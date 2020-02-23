const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const Twitter = require('twitter')
const consumer_key = functions.config().twitter.consumer_key
const consumer_secret = functions.config().twitter.consumer_secret

function targetTimestamp() {
  const date = new Date()
  const timestamp = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  )
  return timestamp
}

function tomorrowTimestamp(date) {
  const timestamp = new Date(
    targetTimestamp().getFullYear(),
    targetTimestamp().getMonth(),
    targetTimestamp().getDate() + 1,
    date.getHours(),
    date.getMinutes()
  )
  return timestamp
}

function tweet(message, userId) {
  console.log('stand by tweet')
  const userApiRef = db.collection('user_api')
  userApiRef
    .doc(userId)
    .get()
    .then((doc) => {
      const access_token_key = doc.data().twitterToken
      const access_token_secret = doc.data().twitterSecret
      const client = new Twitter({
        consumer_key,
        consumer_secret,
        access_token_key,
        access_token_secret
      })
      client.post('statuses/update', {
        status: message
      })
      return true
    })
    .catch((err) => {
      return console.log(err)
    })
}

function doneTweet(title, userId) {
  const timestamp = targetTimestamp()
  timestamp.setTime(timestamp.getTime() + 1000 * 60 * 60 * 9)
  tweet(
    '🎉' +
      timestamp.getFullYear() +
      '年' +
      (timestamp.getMonth() + 1) +
      '月' +
      timestamp.getDate() +
      '日の' +
      title +
      'を達成できた！！🎉 #zizoku',
    userId
  )
}

function notYetTweet(title, userId) {
  const timestamp = targetTimestamp()
  timestamp.setTime(timestamp.getTime() + 1000 * 60 * 60 * 9)
  tweet(
    timestamp.getFullYear() +
      '年' +
      (timestamp.getMonth() + 1) +
      '月' +
      timestamp.getDate() +
      '日の' +
      title +
      'を達成できなかった... #zizoku',
    userId
  )
}

exports.scheduledFunction = functions.pubsub
  .schedule('every 1 minutes')
  .onRun((context) => {
    const postRef = db.collection('post')
    postRef
      .where('isMonitored', '==', true)
      .where('scheduleTimestamp', '<=', targetTimestamp())
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let updateData = doc.data()
          updateData['scheduleTimestamp'] = admin.firestore.Timestamp.fromDate(
            tomorrowTimestamp(updateData['scheduleTimestamp'].toDate())
          )
          if (doc.data().limitTimestamp.toDate() < targetTimestamp()) {
            updateData['isMonitored'] = false
          } else {
            if (doc.data().done) {
              updateData['done'] = false
              if (doc.data().successOption) {
                doneTweet(doc.data().title, doc.data().userId)
              }
            } else {
              updateData['failureNum'] = updateData['failureNum'] + 1
              if (doc.data().failureOption) {
                notYetTweet(doc.data().title, doc.data().userId)
              }
            }
          }
          postRef.doc(doc.id).update(updateData)
        })
        return true
      })
      .catch(() => {
        return true
      })
  })
