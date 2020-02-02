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
        :key="post.title"
        v-for="post in shownPosts"
        class="card col-xs-12 col-md-6 "
      >
        <post-card :post="post" :photo-url="shownUser.photoUrl" :mode="mode" />
      </div>
    </div>
  </div>
</template>
<script>
import { format, getHours, getMinutes } from 'date-fns'
import { mapState, mapGetters, mapActions } from 'vuex'
import PostCard from '~/components/PostCard'
import firebase from '~/plugins/firebase'

export default {
  components: {
    PostCard
  },
  data() {
    return {
      form: {
        title: null,
        done: true,
        notDone: true
      },
      mode: 'edit',
      posts: null,
      shownUser: {
        id: null,
        photoUrl: null,
        twitterId: null
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated']),
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
    },
    photoUrl() {
      if (!this.user || !this.user.photoURL) return ''
      return this.user.photoURL.replace('normal', '80x80')
    }
  },
  async created() {
    this.shownUser.id = this.$route.params.id

    const db = firebase.firestore()
    const userDoc = await db
      .collection('user')
      .doc(this.shownUser.id)
      .get()
    const { twitterId, photoURL } = userDoc.data()
    this.shownUser.twitterId = twitterId
    this.shownUser.photoUrl = photoURL.replace('normal', '80x80')

    const postDoc = await db
      .collection('post')
      .where('userId', '==', this.shownUser.id)
      .get()
    this.posts = postDoc.docs.map((doc) => {
      const data = doc.data()
      const insertTimeStamp = format(
        data.insertTimeStamp.toDate(),
        'yyyy年M月dd日'
      )
      const limitTimeStamp = format(
        data.limitTimeStamp.toDate(),
        'yyyy年M月dd日'
      )

      const limitHour = getHours(data.scheduleTimeStamp.toDate())
      const limitMinute = getMinutes(data.scheduleTimeStamp.toDate())
        ? getMinutes(data.scheduleTimeStamp.toDate())
        : '00'
      const scheduleTimeStamp = `${limitHour}:${limitMinute}`

      return {
        ...data,
        insertTimeStamp,
        limitTimeStamp,
        scheduleTimeStamp
      }
    })
  },
  methods: {
    ...mapActions(['setUser'])
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
  > .list {
    display: flex;
    flex-wrap: wrap;
  }
  > .list > .card {
    margin: 10px 0;
  }
}
</style>
