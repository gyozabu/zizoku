<template>
  <div class="post-list-component">
    <div class="form">
      <v-text-field
        v-model="form.title"
        placeholder="達成したいことで検索"
        outlined
        rounded
        dense
        clearable
        clear-icon
        class="textfield"
        prepend-inner-icon="mdi-feature-search"
      />
      <div class="checkbox">
        <v-checkbox v-model="form.done" class="input" label="完了" />
        <v-checkbox v-model="form.notDone" class="input" label="未完了" />
      </div>
    </div>
    <div class="list">
      <div
        :key="'card-' + index"
        v-for="(post, index) in shownPosts"
        class="card"
      >
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
      form: {
        title: '',
        done: true,
        notDone: true
      },
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
          successNum: 5,
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
          successNum: 3,
          failureNum: 3,
          successOption: true,
          failureOption: false,
          done: false
        }
      ]
    }
  },
  computed: {
    shownPosts() {
      const posts = this.posts
      if (!posts) return []

      const { done, notDone, title } = this.form
      const filteringPosts =
        done && notDone
          ? posts
          : done && !notDone
          ? posts.filter((x) => x.done)
          : !done && notDone
          ? posts.filter((x) => !x.done)
          : []

      const regExp = new RegExp(title, 'g')
      return title
        ? filteringPosts.filter((x) => x.title.match(regExp))
        : filteringPosts
    }
  }
}
</script>
<style lang="scss">
.post-list-component {
  > .form > .textfield {
    height: 30px;
  }
  > .form > .checkbox {
    display: flex;
    height: 50px;
  }
  > .form > .checkbox > .input {
    margin-right: 15px;
    &:first-child {
      margin-left: 23px;
    }
  }
  > .list > .card {
    margin: 10px 0;
  }
}
</style>
