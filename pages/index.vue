<template>
  <v-layout column justify-center>
    <p class="text-center mt-12 mb-12">
      設定した「持続」を応援するサイトです。持続が失敗すると設定したツイートを流す事で、zizokuを支援しています。
    </p>
    <div class="text-center mb-12">
      <v-btn large color="primary" dark>持続をpostする!!</v-btn>
    </div>
    <h1 class="text-center">みんなのzizoku</h1>
    <div v-for="(post, post_index) in posts" :key="post_index">{{ name }}</div>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      items: ['更新順', 'いいね数順'],
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
