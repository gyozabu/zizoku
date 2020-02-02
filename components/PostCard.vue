<template>
  <v-card raised class="post-card">
    <v-card-title class="title">
      <v-scroll-x-transition>
        <v-icon
          v-if="mode === 'edit' && edit.done"
          class="icon"
          color="success"
        >
          mdi-check-circle
        </v-icon>
      </v-scroll-x-transition>
      {{ post.title }}
    </v-card-title>
    <v-card-subtitle
      :class="{ '-has-data': post.successNum || post.failureNum }"
      class="subtitle"
    >
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
    <v-card-text class="content">
      <template v-if="post.successNum || post.failureNum">
        <pie-chart
          :chartdata="dataCollection"
          :options="options"
          class="chart"
        />
      </template>
      <template v-else>
        <p class="text">まだ集計データがありません</p>
      </template>
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
            <v-form :valid="form.name.valid">
              <v-text-field
                v-model="edit.title"
                :rules="form.name.rules"
                label="達成したいこと"
                required
              />
            </v-form>
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
import PieChart from './PieChart'

export default {
  components: { PieChart },
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
      },
      form: {
        name: {
          rules: [(v) => !!v || '達成したいことは必ず入力してください'],
          valid: true
        }
      },
      options: {}
    }
  },
  computed: {
    dataCollection() {
      return {
        labels: [
          `達成できた数 ${this.post.successNum}`,
          `達成できなかった数 ${this.post.failureNum}`
        ],
        datasets: [
          {
            label: 'aaa',
            data: [this.post.successNum, this.post.failureNum],
            backgroundColor: ['#66BB6A', '#EF5350']
          }
        ]
      }
    }
  },
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
      this.post.successNum = this.post.successNum + 1 // TODO
    }
  }
}
</script>
<style lang="scss">
.post-card {
  > .title {
    display: block;
  }
  > .title > .icon {
    padding-bottom: 3px;
  }
  > .subtitle.-has-data {
    padding-bottom: 10px;
  }
  > .subtitle > .text {
    margin: 0;
    display: flex;
    align-items: center;
  }
  > .subtitle > .text > .icon {
    margin-right: 3px;
  }
  > .content > .chart {
    width: 180px;
    height: 180px;
  }
  > .content > .text {
    margin: 0;
  }
  > .actions {
    padding: 0 16px 16px;
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
