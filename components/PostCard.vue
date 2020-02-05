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
        <v-list-item-subtitle class="subtitle">
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
      <v-list-item-avatar
        :src="photoUrl"
        @click="moveToTwitter"
        size="80"
        class="avatar"
      >
        <v-img :src="photoUrl" />
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text class="content">
      <div class="task-result">
        <template v-if="edit.successNum || edit.failureNum">
          <p class="text -success">
            <span>成功した： </span>
            {{ edit.successNum }}
          </p>
          <p class="text -failure">
            <span>失敗した： </span>
            {{ edit.failureNum }}
          </p>
        </template>
        <template v-else>
          <p class="text -no-data">データがありません</p>
        </template>
      </div>
      <pie-chart
        key="has-data"
        :chart-data="dataCollection"
        :options="options"
        class="chart"
      />
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
        failureNum: null,
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
      options: {
        tooltips: {
          enabled: false
        }
      }
    }
  },
  computed: {
    dataCollection() {
      const { successNum, failureNum } = this.edit
      if (successNum || failureNum) {
        return {
          datasets: [
            {
              data: [this.edit.successNum, this.edit.failureNum],
              backgroundColor: ['#66BB6A', '#EF5350']
            }
          ]
        }
      } else {
        return {
          datasets: [
            {
              data: [1],
              backgroundColor: ['#CFD8DC']
            }
          ]
        }
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
    },
    moveToTwitter() {
      window.open(`https://twitter.com/${this.post.user.twitterId}`)
    }
  }
}
</script>
<style lang="scss">
.post-card {
  > .header > .avatar {
    position: relative;
    &::after {
      display: block;
      position: absolute;
      width: inherit;
      height: inherit;
    }
    &:hover::after {
      content: '';
      cursor: pointer;
      background-color: #e3f2fd;
      opacity: 0.25;
    }
  }
  > .title {
    display: block;
    margin-bottom: 5px;
  }
  > .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 0;
  }
  > .content > .chart {
    width: 160px;
    height: 160px;
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
  padding: 0;
  > .title {
    margin: 5px 0 8px;
  }
  > .title > .icon {
    padding-bottom: 3px;
  }
  > .subtitle {
    padding-left: 4px;
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

.task-result {
  margin-left: 5px;
  > .text {
    display: flex;
    align-items: center;
    &:last-child {
      margin: 0;
    }
    &::before {
      content: '';
      display: block;
      width: 15px;
      height: 0.6rem;
      margin-right: 7px;
    }
    &.-success::before {
      background-color: #66bb6a;
    }
    &.-failure::before {
      background-color: #ef5350;
    }
    &.-no-data::before {
      content: none;
    }
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
