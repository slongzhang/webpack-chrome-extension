<template lang="html">
  <div class="wrap">
    <h1>{{message}}</h1>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'hello popup!'
    }
  }
}
</script>

<style lang="css" scoped>
.wrap {
  width: 200px;
}
h1{
  color: red;
}
</style>
