const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const Twitter = require('twitter')
const consumer_key = functions.config().twitter.consumer_key
const consumer_secret = functions.config().twitter.consumer_secret

function targetTimestamp() {
  const date = new Date()
  const Timestamp = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  )
  Timestamp.setTime(Timestamp.getTime() + 1000 * 60 * 60 * 9)
  return Timestamp
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
  tweet('🎉今日の' + title + 'を達成できた！！🎉 #zizoku', userId)
}

function notYetTweet(title, userId) {
  tweet('今日の' + title + 'を達成できなかった... #zizoku', userId)
}

exports.batch = functions.https.onRequest(async (req, res) => {
  const postRef = db.collection('post')
  postRef
    .where('isMonitored', '==', true)
    .where('scheduleTimestamp', '<', targetTimestamp())
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data())
        console.log('aaaaa')
        let updateData = doc.data()
        // updateData['scheduleTimestamp'] = admin.firestore.Timestamp.fromDate(date.toDate().setDate(date.toDate() + 1))
        /* if (doc.data().isMonitored && doc.data().limitTimestamp < targetTimestamp()) {
          updateData['isMonitored'] = false
        } */
        if (doc.data().done) {
          console.log(doc.data().userId + 'done the task:' + doc.data().title)
          updateData['done'] = false
          updateData['successNum'] = updateData['successNum'] + 1
          if (doc.data().successOption) {
            doneTweet(doc.data().title, doc.data().userId)
          }
        } else {
          console.log(
            doc.data().userId + 'not yet do the task:' + doc.data().title
          )
          updateData['failureNum'] = updateData['failureNum'] + 1
          if (doc.data().failureOption) {
            notYetTweet(doc.data().title, doc.data().userId)
          }
        }
        console.log(updateData)
        postRef.doc(doc.id).update(updateData)
      })
      return res.send('success')
    })
    .catch((err) => {
      return res.send(err)
    })
})
