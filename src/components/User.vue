<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片试图区域-->
      <el-card >
        <!--搜索与添加区域-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <!--用户列表区域-->
        <el-table
          :data="userList">
          <el-table-column type="index" ></el-table-column>
          <el-table-column prop="username" label="姓名" ></el-table-column>
          <el-table-column prop="email" label="邮箱" ></el-table-column>
          <el-table-column prop="mobile" label="电话" ></el-table-column>
          <el-table-column prop="role_name" label="角色" ></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作"  width="180px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-star-off" circle size="mini"></el-button>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <!--新增功能-->
      <el-dialog
        title="新增用户"
        :visible.sync="dialogVisible"
        width="30%" @close="addDialogClosed"
        >
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="addUser">确 定</el-button>
  </span>
      </el-dialog>



      <!--修改用户界面-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisiable"
        width="30%" @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisiable = false">取 消</el-button>
    <el-button type="primary"  @click="editUser">确 定</el-button>
  </span>
      </el-dialog>




    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      //验证邮箱的规则
      const checkEmail = (rule, value, callback) => {
        // 邮箱验证正则
        const regEmail = /^\w+@\w+(\.\w+)+$/;
        if(regEmail.test(value)){
          callback();
          return;
        }
        callback(new Error('请输入正确的邮箱'));
      }
      //验证手机号的规则
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/;
        if(regMobile.test(value)){
          callback();
          return;
        }
        callback(new Error('请输入正确的手机号'));
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total :0,
        dialogVisible: false,
        //添加用户的表单数据
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        //添加表单的验证规则对象
        addFormRules:{
          username:[{required: true,message:"请输入用户名",trigger:'blur'},
                   {min:3,max:10,message: "用户名长度在3-10个字符之间",trigger:'blur'}],
          password:[{required: true,message:"请输入密码",trigger:'blur'},
            {min:6,max:15,message: "用户名长度在6-15个字符之间",trigger:'blur'}],
          email:[{required: true,message:"请输入邮箱",trigger:'blur'},
            { validator: checkEmail, trigger: 'blur' }],
          mobile:[{required: true,message:"请输入手机号",trigger:'blur'},
            { validator: checkMobile, trigger: 'blur' }],
        },
        //修改用户的操作
        editDialogVisiable: false,
        editForm:{},
        //添加表单的验证规则对象
        editFormRules:{
          email:[{required: true,message:"请输入邮箱",trigger:'blur'},
            { validator: checkEmail, trigger: 'blur' }],
          mobile:[{required: true,message:"请输入手机号",trigger:'blur'},
            { validator: checkMobile, trigger: 'blur' }],
        },
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
      },
      //监听 pagesize改变的事件
      handleSizeChange(newSize){
        console.log(newSize);
        this.queryInfo.pagesize=newSize;
        this.getUserList();
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage){
        console.log(newPage);
        this.queryInfo.pagenum=newPage;
        this.getUserList();
      },
      async userStateChanged(userInfo){
        console.log(userInfo);//记得这里使用反引号，就是esc下面的按键
        const {data: res} =await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if(res.meta.status=200){
              this.$message.success("更新用户状态成功!")
        }else{
          userInfo.mg_state=!userInfo.mg_state;
              this.$message.error("更新用户状态失败！")
        }
      },
      addDialogClosed(){
          this.$refs.addFormRef.resetFields();
      },
      addUser(){
        console.log('addUser');
        // 提交请求前，表单预验证
        this.$refs.addFormRef.validate( async valid=>{
          console.log(valid);
          // 表单预校验失败
          if (!valid)

            return
           const {data: res}=  await this.$http.post('users',this.addForm)
          console.log(res);
            if(res.meta.status!=201){
              this.$message.error('添加用户失败！')
            }else{
              this.$message.info('添加用户成功！')
              // 隐藏添加用户对话框
              this.dialogVisible = false
              this.getUserList()
            }
        })
        console.log('end');
      },
      //显示修改的页面
      async showEditDialog(id){
        const  {data: res} =await this.$http.get("/users/"+id);
        if(res.meta.status!=200){

        }
        this.editForm=res.data;
        this.editDialogVisiable=true;
      },
      //每次打开的时候，清空原先的内容
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },
      //修改用户
      editUser(){
        // 提交请求前，表单预验证
        this.$refs.editFormRef.validate( async valid=>{
          console.log(valid);
          // 表单预校验失败
          if (!valid)

            return
          const {data: res}=  await this.$http.put('users/'+this.editForm.id,this.editForm)
          console.log(res);
          if(res.meta.status!=200){
            this.$message.error('修改用户失败！')
          }else{
            this.$message.info('修改用户成功！')
            // 隐藏修改用户对话框
            this.editDialogVisiable = false
            this.getUserList()
          }
        })
        console.log('end');
      },
      //删除用户的操作
      // 删除用户
      async removeUserById (id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        // 点击确定 返回值为：confirm
        // 点击取消 返回值为： cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
        this.$message.success('删除用户成功！');
        this.getUserList()
      }

    },
  }
</script>

<style scoped>

</style>
