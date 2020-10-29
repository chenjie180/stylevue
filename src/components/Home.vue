<template>
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/logo.png" alt />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
                <el-menu-item index="1-3">选项3</el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
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
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373f41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      img {
        height: 40px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color:#333744;
  }
  .el-main{
    background-color: #eaedf1;
  }

</style>
