<template>
  <v-form class="new">
    <h2 class="text-center mb-6">新しく宣言してみる</h2>

    <!-- タイトル（title） -->
    <p class="mb-0">タイトル</p>
    <v-text-field
      v-model="title"
      :rules="titleRules"
      class="pt-0"
      required
    ></v-text-field>

    <!-- 時間（scheduleTimestamp） -->
    <p class="mb-0">時間</p>
    <v-menu
      ref="menu"
      v-model="scheduleTimeMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="time"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="scheduleTime"
          v-on="on"
          class="pt-0"
          readonly
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="scheduleTimeMenu"
        v-model="scheduleTime"
        @click:menu="$refs.menu.save(scheduleTime)"
        full-width
        format="24hr"
      >
      </v-time-picker>
    </v-menu>

    <!-- いつまで（limitTimestamp） -->
    <p class="mb-0">いつまで</p>
    <v-menu
      ref="menu2"
      v-model="limitTimeMenu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="limitTime"
          v-on="on"
          class="pt-0"
          readonly
        ></v-text-field>
      </template>
      <v-date-picker v-model="limitTime" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn @click="menu2 = false" text color="primary">Cancel</v-btn>
        <v-btn @click="$refs.menu2.save(limitTime)" text color="primary"
          >OK</v-btn
        >
      </v-date-picker>
    </v-menu>

    <!-- ツイートオプション（successOption, failureOption） -->
    <p class="">ツイートオプション</p>
    <v-switch
      v-model="successOption"
      class="mt-0"
      label="成功したらツイートする"
      inset
    ></v-switch>
    <v-expand-transition>
      <div
        v-show="successOption"
        :class="{ '-open': successOption }"
        class="hint"
      >
        <p class="message">こんなメッセージがツイートされます</p>
        <div class="ex">
          <span>🎉xxxx年xx月xx日の{{ title }}を達成できた！！🎉 #zizoku</span>
        </div>
      </div>
    </v-expand-transition>
    <v-switch
      v-model="failureOption"
      class="mt-0 switch"
      label="失敗したらツイートする"
      inset
    ></v-switch>
    <v-expand-transition>
      <div
        v-show="failureOption"
        :class="{ '-open': failureOption }"
        class="hint"
      >
        <p class="message">こんなメッセージがツイートされます</p>
        <div class="ex">
          <span>xxxx年xx月xx日の{{ title }}を達成できなかった... #zizoku</span>
        </div>
      </div>
    </v-expand-transition>

    <v-btn
      :disabled="!title"
      @click="post"
      raised
      large
      color="primary accent-4"
      >登録する！</v-btn
    >
  </v-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { convertToTimestamp } from '~/util'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      time: false,
      date: false,
      scheduleTimeMenu: false,
      limitTimeMenu: false,
      titleRules: [
        (v) => !!v || 'タイトルは必須です',
        (v) => (v && v.length <= 20) || 'タイトルは20文字以内で入力してください'
      ],
      title: '',
      limitTime: '',
      scheduleTime: '',
      successOption: false,
      failureOption: false
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    ...mapActions(['setPost']),
    goback() {
      this.$router.go(-1)
    },
    async post() {
      const db = firebase.firestore().collection('post')
      const taskData = {
        userId: this.user.uid,
        title: this.title,
        scheduleTimestamp: convertToTimestamp(
          'scheduleTimestamp',
          this.scheduleTime
        ),
        limitTimestamp: convertToTimestamp('limitTimestamp', this.limitTime),
        insertTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        updateTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        successNum: 0,
        failureNum: 0,
        successOption: this.successOption,
        failureOption: this.failureOption,
        isMonitored: true,
        done: false
      }
      await db.add(taskData)
      this.clearData()
      this.$nuxt.$emit('close')
    },
    clearData() {
      this.title = ''
      this.limitTime = ''
      this.scheduleTime = ''
      this.successOption = false
      this.failureOption = false
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  max-width: 653px;
  background-color: #fff;
  padding: 20px;

  > .hint.-open {
    margin-bottom: 30px;
  }
  > .hint > .message {
    margin-bottom: 2px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }
  > .hint > .ex {
    border: 2px solid rgb(29, 161, 242);
    border-radius: 5px;
    padding: 16px;
  }
}
</style>
