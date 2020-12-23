<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
<!--        <el-button type="primary">主要按钮</el-button>-->
        <el-col>
          <el-button type="primary" >添加角色</el-button>
        </el-col>
        <template>
          <el-table
            :data="rolesList"
            style="width: 100%">
            <el-table-column type="index" ></el-table-column>
            <el-table-column prop="id" label="id" ></el-table-column>
            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
          </el-table>
        </template>

      </el-card>
    </div>

</template>

<script>
  export default {
    data () {
      return {
        // 所有角色列表
        rolesList: [],
      }
    }
    ,created () {
      this.getRolesList()
    },
    methods: {
      async getRolesList () {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
      },
    }

  }
</script>

<style scoped>

</style>
