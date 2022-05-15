<template lang="html">
  <div>
    <router-link to="/Home">首页</router-link>
    <router-link to="/About">关于</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'hello options'
    }
  },
  components: {}
}
</script>

<style lang="css" scoped>
</style>
