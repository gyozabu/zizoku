const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const Twitter = require('twitter')

function targetTimestamp() {
  const date = new Date()
  const timestamp = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  )
  // cloud functions内のTZはUTCなのでJSTに合わせる
  timestamp.setTime(timestamp.getTime() + 1000 * 60 * 60 * 9)
  return timestamp
}

exports.tweet = functions.https.onRequest(async (req, res) => {
  const consumer_key = ''
  const consumer_secret = ''
  const access_token_key = ''
  const access_token_secret = ''

  const db = admin.firestore()
  const postRef = db.collection('post')
  const query = postRef
    .where('done', '==', true)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return false
      }

      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data())
      })
      return true
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })

  const client = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
  })
  // client.post('statuses/update', {status: 'test'})

  res.send(targetTimestamp())
})
