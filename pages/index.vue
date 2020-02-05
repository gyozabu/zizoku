<template>
  <v-layout column justify-center>
    <img :src="mv" class="index__mv mb-2" />
    <p class="text-center mb-4">
      設定した「持続」を応援するサイトです。持続が失敗すると設定したツイートを流す事で、zizokuを支援しています。
    </p>
    <div class="text-center mb-12">
      <!-- ログイン中 -->
      <div v-if="isAuthenticated">
        <v-btn
          :to="{ name: 'users-id', params: { id: user.uid } }"
          x-large
          color="primary"
          dark
          nuxt
        >
          <v-icon class="mr-3" dark>mdi-format-list-bulleted-square</v-icon>
          マイページを見る
        </v-btn>
      </div>
      <!-- ログインしていない -->
      <div v-else>
        <LoginButton />
      </div>
    </div>

    <h2 class="index__timelineTitle">みんなのZIZOKU</h2>
    <template v-if="posts">
      <main class="index__list">
        <div
          :key="post.id"
          v-for="post in posts"
          class="index__card col-xs-12 col-md-6"
        >
          <post-card :post="post" />
        </div>
      </main>
    </template>
    <template v-else>
      <v-progress-circular
        class="index__loader"
        indeterminate
        color="primary"
      />
    </template>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import PostCard from '~/components/PostCard.vue'
import MainVisual from '~/static/zizoku_index_main_logo.svg'
import LoginButton from '~/components/LoginButton.vue'

export default {
  components: {
    PostCard,
    LoginButton
  },
  data() {
    return {
      mv: MainVisual
    }
  },
  computed: {
    ...mapState(['user', 'posts']),
    ...mapGetters(['isAuthenticated'])
  },
  async created() {
    await this.loadPosts()
  },
  destroyed() {
    this.clearPosts()
  },
  methods: {
    ...mapActions(['loadPosts', 'clearPosts'])
  }
}
</script>

<style lang="scss" scoped>
.index {
  &__mv {
    max-width: 450px;
    margin: auto;
  }

  &__timelineTitle {
    position: relative;
    display: inline-block;
    padding: 0 55px;
    width: 290px;
    margin: auto;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      display: inline-block;
      width: 45px;
      height: 2px;
      border-top: solid 1px black;
      border-bottom: solid 1px black;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__card {
    margin: 10px 0;
  }
  &__loader {
    margin: 0 auto;
    padding-top: 200px;
  }
}
</style>
