<template>
  <v-card raised shaped class="post-card">
    <v-list-item two-line class="header">
      <v-list-item-content class="header-content">
        <v-list-item-title class="title">
          <v-scroll-x-transition>
            <v-icon
              v-if="mode === 'edit' && edit.done"
              class="icon"
              color="success"
            >
              mdi-check-circle
            </v-icon>
          </v-scroll-x-transition>
          {{ edit.title }}
        </v-list-item-title>
        <v-list-item-subtitle
          :class="{ '-has-data': post.successNum || post.failureNum }"
          class="subtitle"
        >
          <p class="text">
            <v-icon class="icon" small>mdi-timer</v-icon>
            <span>{{ shownScheduleTime }}</span>
          </p>
          <p class="text">
            <v-icon class="icon" small>mdi-calendar</v-icon>
            <span>
              {{ post.insertTimeStamp }}
              ~
              {{ shownLimitDate }}
            </span>
          </p>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar :src="photoUrl" tile size="80">
        <v-img :src="photoUrl" />
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text class="content">
      <template v-if="edit.successNum || edit.failureNum">
        <pie-chart
          key="has-data"
          :chartdata="dataCollection"
          :options="options"
          class="chart"
        />
      </template>
      <template v-else>
        <pie-chart
          key="no-data"
          :chartdata="noDataCollection"
          :options="noDataOptions"
          class="chart -no-data"
        />
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
                @change="changeOptions('title')"
                label="達成したいこと"
                required
              />
            </v-form>
          </div>
          <div class="option -schedule-time">
            <v-text-field
              v-model="edit.scheduleTimeStamp"
              @change="changeOptions('scheduleTimeStamp')"
              @focus="toggleTimePicker"
              label="実行時間"
              readonly
            />
            <v-dialog v-model="isOpenScheduleTimeDialog" width="290px">
              <v-time-picker
                @change="changeTimeStamp('scheduleTimeStamp')"
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
                @change="changeTimeStamp('limitTimeStamp')"
                v-model="edit.limitTimeStamp"
                scrollable
              />
            </v-dialog>
          </div>
          <div class="option -tweet">
            <span class="text">成功した時ツイートする</span>
            <v-switch
              v-model="edit.successOption"
              @change="changeOptions('successOption')"
              class="switch"
              inset
            />
          </div>
          <div class="option -tweet">
            <span class="text">失敗した時ツイートする</span>
            <v-switch
              v-model="edit.failureOption"
              @change="changeOptions('failureOption')"
              class="switch"
              inset
            />
          </div>
        </div>
      </v-expand-transition>
    </template>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex'
import PieChart from './PieChart'
import { convertToTimestamp } from '~/util'

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
        successNum: null,
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
      options: {},
      noDataOptions: {
        legend: {
          labels: {
            boxWidth: 0
          }
        }
      }
    }
  },
  computed: {
    dataCollection() {
      return {
        labels: [
          `成功数 ${this.post.successNum}`,
          `失敗数 ${this.post.failureNum}`
        ],
        datasets: [
          {
            data: [this.post.successNum, this.post.failureNum],
            backgroundColor: ['#66BB6A', '#EF5350']
          }
        ]
      }
    },
    noDataCollection() {
      return {
        labels: ['まだ集計データがありません'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#CFD8DC']
          }
        ]
      }
    },
    shownLimitDate() {
      const limitDate = this.edit.limitTimeStamp
      if (!limitDate) return ''
      return `${limitDate.replace(/-0|-/, '年').replace(/-0|-/, '月')}日`
    },
    shownScheduleTime() {
      const scheduleTime = this.edit.scheduleTimeStamp
      if (!scheduleTime) return ''
      return scheduleTime.replace(/^0/, '')
    },
    photoUrl() {
      const photoUrl =
        this.post && this.post.user.photoURL ? this.post.user.photoURL : ''
      return photoUrl.replace('normal', '80x80')
    }
  },
  created() {
    const keys = Object.keys(this.edit)
    Object.entries(this.post).forEach(([key, value]) => {
      if (keys.find((k) => k === key)) this.edit[key] = value
    })
  },
  methods: {
    ...mapActions(['updatePost']),
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
      const id = this.post.id
      this.edit.done = true
      this.edit.successNum += 1
      this.updatePost({
        id,
        data: {
          successNum: this.edit.successNum,
          done: this.edit.done
        }
      })
    },
    changeOptions(key, override = null) {
      const id = this.post.id
      const data = {}
      data[key] = override || this.edit[key]

      this.updatePost({ id, data })
    },
    changeTimeStamp(key) {
      const timestamp = convertToTimestamp(key, this.edit[key])

      this.changeOptions(key, timestamp)
      key === 'limitTimeStamp'
        ? this.toggleDatePicker()
        : this.toggleTimePicker()
    }
  }
}
</script>
<style lang="scss">
.post-card {
  > .title {
    display: block;
    margin-bottom: 5px;
  }
  > .content {
    padding-top: 0;
  }
  > .content > .chart {
    width: 180px;
    height: 180px;
    &.-no-data {
      width: 160px;
      height: 160px;
      margin-top: 20px;
    }
  }
  > .content > .text {
    margin: 0;
    font-size: 12px;
  }
  > .actions {
    padding: 0 16px 16px;
  }
}

.header-content {
  padding-bottom: 0;
  > .title > .icon {
    padding-bottom: 3px;
  }
  > .subtitle {
    padding-left: 4px;
    &.-has-data {
      padding-bottom: 10px;
    }
  }
  > .subtitle > .text {
    margin: 0 0 2px 0;
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  > .subtitle > .text > .icon {
    margin-right: 5px;
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
    &.-tweet:last-child {
      height: 30px;
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
    width: 48px;
  }
}
</style>
