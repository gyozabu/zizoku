<template>
  <v-app>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer class="d-flex justify-center pt-4 pb-4" app absolute>
      <span class="subtitle-2 mr-2">&copy; zizoku</span>
      <a v-bind:href="rulesUrl" class="caption">利用規約</a>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      userURL: '',
      rulesUrl: '/rules'
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
