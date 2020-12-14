<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片试图区域-->
      <el-card >
        <!--搜索与添加区域-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <el-table
          :data="userList">
          <el-table-column type="index" ></el-table-column>
          <el-table-column prop="username" label="姓名" ></el-table-column>
          <el-table-column prop="email" label="邮箱" ></el-table-column>
          <el-table-column prop="mobile" label="电话" ></el-table-column>
          <el-table-column prop="role_name" label="角色" ></el-table-column>
          <el-table-column prop="mg_state" label="状态"></el-table-column>
          <el-table-column prop="date" label="操作" ></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total :0
      }
    },
    created () {
      this.getUserList();
    },
    methods: {
      async getUserList(){
       const {data:res}=await this.$http.get('users',{
         params:this.queryInfo
       })
        if(res.meta.status!==200){
          return  this.$message.error("获取用户列表失败！")
        }
        this.userList= res.data.users;
        this.total=res.data.total;
        console.log('res'+res);
      }
    },
  }
</script>

<style scoped>

</style>
