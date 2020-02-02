<template>
  <v-layout column justify-center>
    <img :src="mv" class="index__mv mb-2" />
    <p class="text-center mb-4">
      設定した「持続」を応援するサイトです。持続が失敗すると設定したツイートを流す事で、zizokuを支援しています。
    </p>
    <div class="text-center mb-12">
      <!-- ログイン中 -->
      <div v-if="isAuthenticated">
        <v-btn v-bind:href="mypageUrl" x-large color="primary" dark
          ><v-icon class="mr-3" dark>mdi-format-list-bulleted-square</v-icon
          >マイページを見る</v-btn
        >
      </div>
      <!-- ログインしていない -->
      <div v-else>
        <LoginButton />
      </div>
    </div>

    <h2 class="index__timelineTitle">みんなのZIZOKU</h2>

    <div :key="index" v-for="(post, index) in posts" class="card">
      <post-card :post="post" class="mt-8 mb-8" />
    </div>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PostCard from '~/components/PostCard.vue'
import MainVisual from '~/static/zizoku_index_main_logo.svg'
import LoginButton from '~/components/LoginButton.vue'

export default {
  components: {
    PostCard,
    LoginButton
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated'])
  },
  data() {
    return {
      mv: MainVisual,
      mypageUrl: '/new',
      posts: [
        {
          userId: 1, // ユーザーID
          title: '朝走る', // やること
          limitTimeStamp: '2020-12-08 00:00:00', // いつまで続けるか
          scheduleTimeStamp: '7:00', // 何時に設定するか
          insertTimeStamp: '2020-02-01 00:00:00', // 登録日時
          updateTimeStamp: '2020-02-01 00:00:00', // 更新日時
          successNum: 0, // 成功数
          failureNum: 0, // 失敗数
          successOption: false, // ツイートしない
          failureOption: true, // ツイートする
          done: true // やった
        },
        {
          userId: 1,
          title: '早く起きる',
          limitTimeStamp: '2020-12-08 00:00:00',
          scheduleTimeStamp: '7:00',
          insertTimeStamp: '2020-02-01 00:00:00',
          updateTimeStamp: '2020-02-01 00:00:00',
          successNum: 0,
          failureNum: 0,
          successOption: false,
          failureOption: true,
          done: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  &__mv {
    width: 450px;
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
}
</style>
