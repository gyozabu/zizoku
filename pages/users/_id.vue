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
    <main class="list">
      <div
        :key="post.id"
        v-for="post in shownPosts"
        class="card col-xs-12 col-md-6 "
      >
        <post-card :post="post" :mode="mode" />
      </div>
    </main>
    <v-btn
      @click="openAddTaskDialog"
      fab
      dark
      fixed
      large
      bottom
      right
      color="primary"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="isOpenAddTaskDialog" class="dialog" max-width="600px">
      <add-new-task class="content" />
    </v-dialog>
  </div>
</template>
<script>
import { format, getHours, getMinutes } from 'date-fns'
import { mapState, mapGetters, mapActions } from 'vuex'
import AddNewTask from '~/components/AddNewTask'
import PostCard from '~/components/PostCard'
import firebase from '~/plugins/firebase'

export default {
  components: {
    PostCard,
    AddNewTask
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
      isOpenAddTaskDialog: false
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
    }
  },
  async created() {
    this.$nuxt.$on('close', () => {
      this.closeAddTaskDialog()
    })

    const db = firebase.firestore()
    const userDoc = await db
      .collection('user')
      .doc(this.$route.params.id)
      .get()
    const user = userDoc.data()

    const postDoc = await db
      .collection('post')
      .where('userId', '==', this.$route.params.id)
      .get()

    this.posts = postDoc.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()
      const insertTimeStamp = format(
        data.insertTimeStamp.toDate(),
        'yyyy年M月d日'
      )
      const limitTimeStamp = format(data.limitTimeStamp.toDate(), 'yyyy-M-d')

      const limitHour = getHours(data.scheduleTimeStamp.toDate())
      const limitMinute =
        getMinutes(data.scheduleTimeStamp.toDate()) < 10
          ? `0${getMinutes(data.scheduleTimeStamp.toDate())}`
          : getMinutes(data.scheduleTimeStamp.toDate())
      const scheduleTimeStamp = `${limitHour}:${limitMinute}`

      return {
        id,
        user,
        ...data,
        insertTimeStamp,
        limitTimeStamp,
        scheduleTimeStamp
      }
    })
  },
  methods: {
    ...mapActions(['setUser']),
    openAddTaskDialog() {
      this.isOpenAddTaskDialog = true
    },
    closeAddTaskDialog() {
      this.isOpenAddTaskDialog = false
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
  > .list {
    display: flex;
    flex-wrap: wrap;
  }
  > .list > .card {
    margin: 10px 0;
  }
}
</style>
