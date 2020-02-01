<template>
  <v-app>
    <!-- ヘッダー内容 -->
    <v-app-bar app>
      <v-toolbar-title>
        <nuxt-link to="/" class="logo">zizoku</nuxt-link>
      </v-toolbar-title>
    </v-app-bar>
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
export default {
  data() {
    return {
      userURL: ''
    }
  }
}
</script>
