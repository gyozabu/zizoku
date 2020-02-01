<template>
  <v-card>
    <v-card-title>{{ post.title }}</v-card-title>
    <v-vard-subtitle>
      毎日{{ post.scheduleTimeStamp }}, {{ post.limitTimeStamp }}まで
    </v-vard-subtitle>
    <v-card-text>
      <div class="count">
        <p>success: {{ post.successNum }}</p>
        <p>failure: {{ post.failureNum }}</p>
      </div>
      <div class="graph"></div>
    </v-card-text>
    <v-card-actions>
      <v-btn outlined color="success">
        <v-icon left>mdi-emoticon</v-icon>
        DONE
      </v-btn>
      <v-spacer />
      <v-btn @click="showEditor" icon>
        <v-icon>{{ isExpand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="isExpand">
        <v-divider />
        <div class="option">
          <span class="text">成功時ツイート</span>
          <v-switch v-model="post.successOption" />
        </div>
        <div class="option">
          <span class="text">失敗時ツイート</span>
          <v-switch v-model="post.failureOption" />
        </div>
        <v-btn outlined>
          <v-icon left>mdi-delete</v-icon>
          削除する
        </v-btn>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isExpand: false
    }
  },
  methods: {
    showEditor() {
      this.isExpand = !this.isExpand
    }
  }
}
</script>
