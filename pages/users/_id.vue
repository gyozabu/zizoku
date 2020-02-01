<template>
  <div class="post-list-component">
    <div class="form"></div>
    <div class="list">
      <div :key="index" v-for="(post, index) in posts" class="card">
        <post-card :post="post" mode="edit" />
      </div>
    </div>
  </div>
</template>
<script>
import PostCard from '~/components/PostCard'

export default {
  components: {
    PostCard
  },
  data() {
    return {
      posts: [
        {
          userId: 1,
          title: '朝走る',
          limitTimeStamp: '2020-12-08 00:00:00',
          scheduleTimeStamp: '7:00',
          insertTimeStamp: '2020-02-01 00:00:00',
          updateTimeStamp: '2020-02-01 00:00:00',
          successNum: 1000,
          failureNum: 10000,
          successOption: true,
          failureOption: false,
          done: true
        },
        {
          userId: 1,
          title: '夜ごはん食べる',
          limitTimeStamp: '2020-12-08 00:00:00',
          scheduleTimeStamp: '20:00',
          insertTimeStamp: '2020-02-01 00:00:00',
          updateTimeStamp: '2020-02-01 00:00:00',
          successNum: 0,
          failureNum: 0,
          successOption: true,
          failureOption: false,
          done: false
        },
        {
          userId: 1,
          title: 'とてもとてもとてもとても長いなにか達成したいことが書いてある',
          limitTimeStamp: '2020-12-08 00:00:00',
          scheduleTimeStamp: '23:00',
          insertTimeStamp: '2020-02-01 00:00:00',
          updateTimeStamp: '2020-02-01 00:00:00',
          successNum: 0,
          failureNum: 0,
          successOption: true,
          failureOption: false,
          done: true
        },
        {
          userId: 1,
          title: '腹筋する',
          limitTimeStamp: '2020-12-08 00:00:00',
          scheduleTimeStamp: '23:00',
          insertTimeStamp: '2020-02-01 00:00:00',
          updateTimeStamp: '2020-02-01 00:00:00',
          successNum: 0,
          failureNum: 0,
          successOption: true,
          failureOption: false,
          done: true
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.post-list-component {
  > .list {
  }
  > .list > .card {
    margin: 5px;
  }
}
</style>
