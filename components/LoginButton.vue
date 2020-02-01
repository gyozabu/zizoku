<template>
  <v-btn small color="primary">bvv</v-btn>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    // console.log(this.user)
    setTimeout(() => {
      // console.log(this.user)
    })
  },
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
              const data = {
                name: result.user.displayName,
                photoURL: result.user.providerData[0].photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                twitterId: result.additionalUserInfo.profile.screen_name
              }
              db.collection('user')
                .doc(result.user.uid)
                .set(data)
            }
          })
        })
    }
  }
}
</script>
