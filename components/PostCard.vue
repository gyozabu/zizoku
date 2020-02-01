<template>
  <v-card raised class="post-card">
    <v-card-title class="title">
      <v-icon v-if="mode === 'edit' && edit.done" class="icon" color="success">
        mdi-check-circle
      </v-icon>
      {{ post.title }}
    </v-card-title>
    <v-card-subtitle class="subtitle">
      <p class="text">
        <v-icon class="icon" small>mdi-timer</v-icon>
        <span>{{ post.scheduleTimeStamp }}</span>
      </p>
      <p class="text">
        <v-icon class="icon" small>mdi-calendar</v-icon>
        <span>
          {{ shownDate(post.insertTimeStamp) }}
          ~
          {{ shownDate(post.limitTimeStamp) }}
        </span>
      </p>
    </v-card-subtitle>
    <v-card-text class="post-result">
      <div class="count">
        <p class="text">
          <span class="subject">達成できた数</span>
          <span class="result">{{ post.successNum }}</span>
        </p>
        <p class="text">
          <span class="subject">達成できなかった数</span>
          <span class="result">{{ post.failureNum }}</span>
        </p>
      </div>
      <div class="graph"></div>
    </v-card-text>
    <template v-if="mode === 'edit'">
      <v-card-actions class="actions">
        <v-btn
          :disabled="edit.done"
          @click="changeStatusDone"
          depressed
          color="success"
          width="280px"
        >
          <v-icon left>mdi-emoticon</v-icon>
          達成できた！
        </v-btn>
        <v-spacer />
        <v-btn @click="toggleEditor" icon>
          <v-icon>
            {{ isOpenEditor ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="isOpenEditor" class="post-option">
          <div class="option -title">
            <v-text-field v-model="edit.title" label="達成したいこと" />
          </div>
          <div class="option -schedule-time">
            <v-text-field
              v-model="edit.scheduleTimeStamp"
              @focus="toggleTimePicker"
              label="実行時間"
              readonly
            />
            <v-dialog v-model="isOpenScheduleTimeDialog" width="290px">
              <v-time-picker
                @input="toggleTimePicker"
                v-model="edit.scheduleTimeStamp"
                scrollable
                format="24hr"
              />
            </v-dialog>
          </div>
          <div class="option -limit-date">
            <v-text-field
              v-model="edit.limitTimeStamp"
              @focus="toggleDatePicker"
              label="終了日"
              readonly
            />
            <v-dialog v-model="isOpenLimitDateDialog" width="290px">
              <v-date-picker
                @input="toggleDatePicker"
                v-model="edit.limitTimeStamp"
                scrollable
              />
            </v-dialog>
          </div>
          <div class="option -tweet">
            <span class="text">達成できた時ツイートする</span>
            <v-switch v-model="edit.successOption" class="switch" inset />
          </div>
          <div class="option -tweet">
            <span class="text">達成できなかった時ツイートする</span>
            <v-switch v-model="edit.failureOption" class="switch" inset />
          </div>
          <v-btn class="option -delete" outlined>
            <v-icon left>mdi-delete</v-icon>
            削除する
          </v-btn>
        </div>
      </v-expand-transition>
    </template>
  </v-card>
</template>
<script>
import { format } from 'date-fns'

export default {
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: 'readonly'
    }
  },
  data() {
    return {
      isOpenEditor: false,
      isOpenLimitDateDialog: false,
      isOpenScheduleTimeDialog: false,
      edit: {
        title: null,
        limitTimeStamp: null,
        scheduleTimeStamp: null,
        insertTimeStamp: null,
        updateTimeStamp: null,
        successOption: null,
        failureOption: null,
        done: null
      }
    }
  },
  computed: {},
  created() {
    if (this.mode === 'readonly') return
    const keys = Object.keys(this.edit)
    Object.entries(this.post).forEach(([key, value]) => {
      if (keys.find((k) => k === key)) this.edit[key] = value
    })
  },
  methods: {
    shownDate(timestamp) {
      const limitDate = new Date(timestamp.replace(/\s.*/g, ''))
      return format(limitDate, 'yyyy年M月d日')
    },
    toggleEditor() {
      this.isOpenEditor = !this.isOpenEditor
    },
    toggleDatePicker() {
      this.isOpenLimitDateDialog = !this.isOpenLimitDateDialog
    },
    toggleTimePicker() {
      this.isOpenScheduleTimeDialog = !this.isOpenScheduleTimeDialog
    },
    changeStatusDone() {
      if (this.edit.done) return
      this.edit.done = true
    }
  }
}
</script>
<style lang="scss">
.post-card {
  > .title > .icon {
    margin-right: 5px;
  }
  > .subtitle > .text {
    margin: 0;
    display: flex;
    align-items: center;
  }
  > .subtitle > .text > .icon {
    margin-right: 3px;
  }
  > .actions {
    padding: 0 16px 16px;
  }
}

.post-result {
  display: flex;

  > .count > .text {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  > .count > .text > .subject {
    margin-right: 30px;
  }
}

.post-option {
  padding: 16px;
  > .option {
    &.-tweet {
      display: flex;
      align-items: top;
      justify-content: space-between;
    }
    &.-delete {
      display: block;
      margin-right: 0;
      margin-left: auto;
    }
  }
  > .option > .text {
    color: rgba(0, 0, 0, 0.6);
  }
  > .option > .switch {
    margin: 0;
    padding: 0;
  }
}
</style>
