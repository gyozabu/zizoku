<template>
  <v-btn @click="login" small color="primary">bvv</v-btn>
</template>

<script>
import firebase from '~/plugins/firebase'

export default {
  methods: {
    login() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          const db = firebase.firestore()
          const docRef = db.collection('user').doc(result.user.uid)
          docRef.get().then(function(doc) {
            if (doc.exists) {
              docRef.update({
                name: result.user.displayName,
                photoURL: result.user.providerData[0].photoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                twitterId: result.additionalUserInfo.profile.screen_name
              })
            } else {
              const userData = {
                name: result.user.displayName,
                photoURL: result.user.providerData[0].photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                twitterId: result.additionalUserInfo.profile.screen_name
              }
              const secretData = {
                twitterToken: result.credential.accessToken,
                twitterSecret: result.credential.secret
              }
              db.runTransaction(function(transaction) {
                db.collection('user')
                  .doc(result.user.uid)
                  .set(userData)
                  .then(() => {
                    db.collection('user_api')
                      .doc(result.user.uid)
                      .set(secretData)
                  })
              })
            }
          })
        })
    }
  }
}
</script>
