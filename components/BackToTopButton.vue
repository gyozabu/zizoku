<template>
  <v-btn
    @click="login"
    x-large
    color="primary"
    class="backToTop font-weight-black title"
    href="/"
    dark
    ><v-icon dark>mdi-step-backward</v-icon
    ><img :src="logo" class="backToTop__logo mr-2" />TOPへ戻る</v-btn
  >
</template>

<script>
import Logo from '~/static/zizoku_logo_white.svg'

export default {
  data() {
    return {
      logo: Logo
    }
  }
}
</script>

<style lang="scss" scoped>
.backToTop {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 350px;

  &__logo {
    width: 150px;
  }
}
</style>
