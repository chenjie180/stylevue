<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card class="box-card">
        <el-table
          :data="rightsList"
          style="width: 100%">
          <el-table-column type="index"  label="#" ></el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径">
          </el-table-column>
          <el-table-column
            prop="level"
            label="权限等级">
            <template v-slot="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="danger" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>



    </div>
</template>

<script>
  export default {
    name: '',
    data(){
      return {
        type: 'list',
        // 权限列表
        rightsList: []
      }

    },
    created () {
      this.getRightsList()
    },
    methods:{
     async getRightsList(){
        const {data: res}=await this.$http.get("rights/"+this.type)
       if (res.meta.status !== 200) {
         return this.$message.error('获取权限列表失败！')
       }
       this.rightsList = res.data
      }

    },

  }
</script>

<style scoped>

</style>
