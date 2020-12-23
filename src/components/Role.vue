<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
<!--        <el-button type="primary">主要按钮</el-button>-->
        <el-row>
          <el-col>
            <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
          </el-col>
        </el-row>
        <template>
          <el-table
            :data="rolesList"
            style="width: 100%">
            <!--展开列-->
            <el-table-column type="expand" ></el-table-column>
            <!--索引列-->
            <el-table-column type="index" ></el-table-column>
            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
            <el-table-column label="操作" width="300px">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete"  size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="showSetRightDialog(scope.row)"
                >分配权限</el-button>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
        </template>

      </el-card>


      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
        <el-form
          :model="addRoleForm"
          ref="addRoleFormRef"
          :rules="addRoleFormRules"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
      </el-dialog>

      <!--修改用户对话框-->
      <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
        <el-form
          :model="editRoleForm"
          ref="editRoleFormRef"
          :rules="editRoleFormRules"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
      </el-dialog>

    </div>

</template>

<script>
  export default {
    data () {
      return {
        // 所有角色列表
        rolesList: [],
        //添加角色对话框
        AddRoleDialogVisible: false,
        addRoleForm:{roleName:'',
          roleDesc:''},
        addRoleFormRules:{
          roleName:[{required: true,message:"请输入角色名",trigger:'blur'},
            {min:6,max:20,message: "角色名长度在6-20个字符之间",trigger:'blur'}],
          roleDesc:[{required: true,message:"请输入角色描述",trigger:'blur'},
            {min:8,max:50,message: "角色描述长度在8-50个字符之间",trigger:'blur'}]
        },
        //修改角色对话框
        editRoleDialogVisible:false,
        editRoleForm:{},
        editRoleFormRules:{
          roleName:[{required: true,message:"请输入角色名",trigger:'blur'},
            {min:6,max:20,message: "角色名长度在6-20个字符之间",trigger:'blur'}],
          roleDesc:[{required: true,message:"请输入角色描述",trigger:'blur'},
            {min:8,max:50,message: "角色描述长度在8-50个字符之间",trigger:'blur'}]
        }
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
      addRoleDialogClosed(){
        this.$refs.addRoleFormRef.resetFields();
      },
       addRoles(){
        this.$refs.addRoleFormRef.validate( async valid=>{
          // 表单预校验失败
          if (!valid)
            return
          const { data: res } = await this.$http.post('roles', this.addRoleForm)
          if(res.meta.status!=201){
            this.$message.error("创建角色失败")
          }
          this.$message.info("创建角色成功")
          this.AddRoleDialogVisible=false
          this.getRolesList();
        })

      },
      async showEditRoleDialog(id){
        const { data: res } = await this.$http.get('roles/' + id);
        if(res.meta.status!=200){
          this.$message.error("查询角色失败")
        }
        this.editRoleDialogVisible=true;
        this.editRoleForm=res.data;
      },
      editRoleDialogClosed(){
        this.$refs.editRoleFormRef.resetFields();
      },
      editRoles(){
        this.$refs.editRoleFormRef.validate( async valid=>{
          // 表单预校验失败
          if (!valid)
            return
          const { data: res } = await this.$http.put(
            'roles/' + this.editRoleForm.roleId, this.editRoleForm)
          if(res.meta.status!=201){
            this.$message.error("修改角色失败")
          }
          this.$message.info("修改角色成功")
          this.editRoleDialogVisible=false;
          this.getRolesList();
        })

      },
      // 角色
      async removeRoleById (id) {

      }

    }

  }
</script>

<style scoped>

</style>
