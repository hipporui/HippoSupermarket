<template>
  <div class="register">

    <div class="register-box clearfix">
      <div class="manage-title fl">商家后台管理系统</div>
      <div class="form-box fr">
        <div class="form-group clearfix">
          <label
            class="fl form-title"
            for="username"
          >邮箱:</label>
          <div class="fl form-input">
            <input
              type="text"
              class=" form-control"
              id="username"
              autocomplete="off"
              v-model="userInfo.email"
            >
          </div>
        </div>
        <!--  -->
        <div class="form-group clearfix">
          <label
            class="fl form-title"
            for="password"
          >密码:</label>
          <div class="fl form-input">
            <input
              type="password"
              class=" form-control"
              id="password"
              autocomplete="off"
              v-model="userInfo.password"
            >
          </div>
        </div>
        <!--  -->
        <!-- <div class="form-group clearfix">
      <div class="valid-box">
        <span>将滑块拖动到最右边</span>
        <div class="mask"></div>  
      </div>  
    </div> -->
        <!--  -->
        <div class="form-group form-btn-box">
          <div class="btn-box">
            <button
              class="btn btn-warning btn-block"
              @click="login"
            >登陆</button>
          </div>
          <div class="clearfix login-text">
            <span @click="goRegister" class="fl">没有账号,立即注册</span>
            <span class="fr">找回密码</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 消息提示组件 -->
    <MyTip :msg="msg" />
  </div>
</template>

<script>
  //导入表单验证文件
  import { validForm } from "../assets/js/validForm";
  //导入提示组件
  import MyTip from "../components/MyTip";
  export default {
    name: "Login",
    data() {
      return {
        userInfo: {
          email: "",
          password: "",
        },
          msg: ""
      };
    },
    methods: {
      login(){
        let result = validForm.valid(this.userInfo);
        if (result.pass === false) {
          // 
          this.msg = result.msg;
          this.$children[0].$el.style.top = "0px";
          setTimeout(() => {
            this.$children[0].$el.style.top = "-64px";
          }, 1500);
          return;
        }
        this.axios({
          method:'POST',
          url:'/login',
          data:this.userInfo
        }).then(result=>{
          
          if(result.data.code == 1020){
            localStorage.setItem('_abc',result.data.token)
            this.$cookies.set('_abc',result.data.token,'30d')
            this.$router.push({name:'Products'});
          }
        }).catch(err =>{
          
        })
      },

      goRegister(){
        this.$router.push({name:'Register'});
      }
    },
    //注册组件
    components: {
      MyTip
    }
  };
</script>

<style lang="less" scoped>
.register{
  position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: url("../assets/images/bg.jpg") no-repeat center center;
    background-size: cover;
    min-width: 1170px;
}
  .register-box {
    width: 1170px;
    margin: 100px auto;

  }
  .manage-title {
    font-size: 48px;
    color: #fff;
    width: 400px;
    text-align: center;
    padding-top: 139px;
    line-height: 350px;
  }
  .form-box {
    width: 450px;
    // position: fixed;
    right: 300px;
    top: 100px;
    padding: 20px;
    box-shadow:12px 15px 15px #c0c0c0;
  }

  .form-title {
    display: block;
    width: 80px;
    height: 38px;
    line-height: 38px;
    color: #fff;
  }
  .form-input {
    width: 320px;
  }
  .valid-box {
    position: relative;
    height: 38px;
    margin-left: 80px;
    background-color: #ddd;
    text-align: center;
    line-height: 38px;
    user-select: none;
    span {
      color: #fff;
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      height: 100%;
      background-color: #e4393c;
      cursor: pointer;
    }
  }
  .valid-code {
    width: 140px;
  }
  .form-btn-box {
    margin-top: 40px;
    .btn-box {
      margin-left: 80px;
    }
  }
  .valid-form-input {
    width: 160px;
    margin-right: 20px;
  }
  .login-text{
    margin-top: 20px;
    color: #444;
    cursor: pointer;
  }
</style>