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
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu

            background-color="#333744"
            text-color="#fff"
            active-text-color="#489EFF"
            unique-opened :collapse="isCollapse"
          :collapse-transition="false" router :default-active="activePath">
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                @click="saveNavState('/'+subItem.path)">
                <template slot="title">

                  <i class="el-icon-location"></i>
                  <span>{{subItem.authName}}</span>
                </template>
                </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  export default {
    data () {
      return {
        menuList:[],
        iconObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        isCollapse:false,
        activePath:''
      }
    },
    created () {
      this.getMenuList();
      this.activePath= window.sessionStorage.getItem('activePath');
    },
    methods: {
      logout(){
        // 清空token
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList (){
        const {data:res}   =await this.$http.get('menus')
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        this.menuList=res.data;
        console.log(res)
      },
      toggleCollapse(){
        this.isCollapse=!this.isCollapse;
      }
      ,//保存连接的激活状态
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath=activePath
      }
    },

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
    .el-menu {
      border: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #42b983;
    font-size: 10px;
    line-height: 24px;
    color: #cccccc;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>
