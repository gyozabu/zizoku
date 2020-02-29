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
    <template v-if="userPosts">
      <p class="message">
        {{
          userPosts.length > 0
            ? shownPosts.length + '件表示中'
            : 'まだ何も登録されていません。さっそく登録してみよう！'
        }}
      </p>
    </template>
    <main :class="{ '-load': !userPosts }" class="list">
      <template v-if="!userPosts">
        <v-progress-circular class="loader" indeterminate color="primary" />
      </template>
      <template v-else-if="userPosts.length > 0">
        <div
          :key="post.id"
          v-for="post in shownPosts"
          class="card col-xs-12 col-sm-6 col-md-6 col-lg-6"
        >
          <post-card :post="post" :mode="mode" />
        </div>
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
    <v-dialog v-model="isOpenConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title>
          「{{ confirmingPostName }}」を削除しますか？
        </v-card-title>
        <v-card-text class="text">
          削除すると記録が全て破棄されます。
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isOpenConfirmDialog = false" text>
            キャンセル
          </v-btn>
          <v-btn @click="deleteUserPost" color="primary" text>
            削除する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="isOpenSnackbar">
      登録しました
      <v-btn @click="closeSnackbar" color="primary" text>
        とじる
      </v-btn>
    </v-snackbar>
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
      isOpenAddTaskDialog: false,
      isOpenConfirmDialog: false,
      isOpenSnackbar: false,
      confirmingPostId: null
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
    },
    confirmingPostName() {
      if (!this.confirmingPostId) return ''
      const post = this.shownPosts.find(
        (post) => post.id === this.confirmingPostId
      )
      return post ? post.title : ''
    }
  },
  async created() {
    this.clearUserPosts()
    this.$nuxt.$on('close', async () => {
      this.closeAddTaskDialog()
      this.openSnackbar()
      await this.loadUserPosts(this.$route.params.id)
    })
    this.$nuxt.$on('showConfirmDialog', (postId) => {
      this.isOpenConfirmDialog = true
      this.confirmingPostId = postId
    })
    this.$nuxt.$on('hideConfirmDialog', () => {
      this.isOpenConfirmDialog = false
      this.confirmingPostId = null
    })

    await this.loadUserPosts(this.$route.params.id)
  },
  methods: {
    ...mapActions(['setUser', 'loadUserPosts', 'clearUserPosts', 'deletePost']),
    openAddTaskDialog() {
      this.isOpenAddTaskDialog = true
    },
    closeAddTaskDialog() {
      this.isOpenAddTaskDialog = false
    },
    openSnackbar() {
      this.isOpenSnackbar = true
    },
    closeSnackbar() {
      this.isOpenSnackbar = false
    },
    async deleteUserPost() {
      this.isOpenConfirmDialog = false
      await this.deletePost(this.confirmingPostId)
      this.confirmingPostId = null
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
  > .message {
    margin: 10px 0 0 24px;
    color: rgba(0, 0, 0, 0.6);
  }
  > .list {
    display: flex;

    &:not(.-load) {
      flex-wrap: wrap;
    }
  }
  > .list > .card {
    margin: 0 0 10px;
  }
  > .list > .loader {
    margin: 0 auto;
    padding-top: 200px;
  }
}
.dialog > .confirm-content {
  > .text {
    padding-bottom: 10px;
  }
}
</style>
