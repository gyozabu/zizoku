<template>
  <div>
    <!-- ログイン中に表示される画面 -->
    <div v-if="isAuthenticated">
      {{ user }}でログイン中です<br />
      <button v-on:click="logout">ログアウト</button><br />
    </div>
    <!-- ログインしていない時に表示される画面 -->
    <div v-else>
      <LoginButton />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LoginButton from '~/components/LoginButton.vue'
import firebase from '~/plugins/firebase'

export default {
  components: {
    LoginButton
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.setUser(null)
        })
        .catch((error) => {
          alert(error)
        })
    }
  }
}
</script>
