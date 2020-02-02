<template>
  <v-app>
    <v-container fluid class="new">
      <h2 class="text-center">新しく宣言してみる</h2>
      <v-form>
        <p class="mb-0">タイトル</p>
        <v-text-field
          v-model="text"
          :rules="rule"
          class="pt-0"
          label=""
          required
        ></v-text-field>

        <p class="mb-0">時間</p>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="time"
          persistent
          lazy
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="time"
              v-on="on"
              class="pt-0"
              readonly
            ></v-text-field>
          </template>
          <v-time-picker v-if="modal" v-model="time" full-width>
            <v-spacer></v-spacer>
            <v-btn @click="modal = false" flat color="primary">Cancel</v-btn>
            <v-btn @click="$refs.dialog.save(time)" flat color="primary"
              >OK</v-btn
            >
          </v-time-picker>
        </v-dialog>

        <p class="mb-0">いつまで</p>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-combobox
              v-model="dates"
              v-on="on"
              class="pt-0"
              multiple
              chips
              small-chips
              readonly
            ></v-combobox>
          </template>
          <v-date-picker v-model="dates" multiple no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn @click="menu = false" text color="primary">Cancel</v-btn>
            <v-btn @click="$refs.menu.save(dates)" text color="primary"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>

        <p class="">ツイートオプション</p>
        <v-switch
          v-model="successOption"
          class="mt-0"
          label="成功したらツイートする"
        ></v-switch>
        <v-switch
          v-model="failureOption"
          class="mt-0"
          label="失敗したらツイートする"
        ></v-switch>

        <v-btn color="success">
          登録する！
        </v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      modal: false,
      dates: false,
      menu: false
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  max-width: 653px;
}
</style>
