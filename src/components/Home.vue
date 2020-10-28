<template>
  <div>
    home
    <el-button type="info" @click="logout">退出</el-button>
  </div>


</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      logout(){
        // 清空token
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>
  /* // lang="less" 支持less格式
  // scoped vue的指令，只在当前组件生效 */

</style>
