<template>
  <v-app>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app absolute>
      <span>&copy; zizoku</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      userURL: ''
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setUser(user)
    })
  },
  methods: {
    ...mapActions(['setUser'])
  }
}
</script>
