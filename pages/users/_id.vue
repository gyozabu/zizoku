<template>
  <div class="post-list-component">
    <header class="header">
      <v-btn icon to="/" nuxt>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </header>
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
    <main :class="{ '-load': !userPosts }" class="list">
      <template v-if="!userPosts">
        <v-progress-circular class="loader" indeterminate color="primary" />
      </template>
      <template v-else-if="userPosts.length > 0">
        <div
          :key="post.id"
          v-for="post in shownPosts"
          class="card col-xs-12 col-md-6 "
        >
          <post-card :post="post" :mode="mode" />
        </div>
      </template>
      <template v-else>
        <p class="message">
          まだ何も登録されていません。さっそく登録してみよう！
        </p>
      </template>
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
import { mapState, mapGetters, mapActions } from 'vuex'
import AddNewTask from '~/components/AddNewTask'
import PostCard from '~/components/PostCard'

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
      isOpenAddTaskDialog: false
    }
  },
  computed: {
    ...mapState(['user', 'userPosts']),
    ...mapGetters(['isAuthenticated']),
    shownPosts() {
      const posts = this.userPosts
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
    this.$nuxt.$on('close', async () => {
      this.closeAddTaskDialog()
      await this.loadUserPosts(this.$route.params.id)
    })

    await this.loadUserPosts(this.$route.params.id)
  },
  methods: {
    ...mapActions(['setUser', 'loadUserPosts']),
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
  > .header {
    margin-bottom: 5px;
  }
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

    &:not(.-load) {
      flex-wrap: wrap;
    }
  }
  > .list > .card {
    margin: 10px 0;
  }
  > .list > .loader {
    margin: 0 auto;
    padding-top: 200px;
  }
  > .list > .message {
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
