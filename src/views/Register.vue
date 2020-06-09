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
          >昵称:</label>
          <div class="fl form-input">
            <input
              type="text"
              class=" form-control"
              id="password"
              autocomplete="off"
              v-model="userInfo.nickname"
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
        <div class="form-group clearfix">
          <label
            class="fl form-title"
            for="validcode"
          >验证码:</label>
          <div class="fl form-input valid-form-input">
            <input
              type="text"
              class=" form-control"
              id="validcode"
              autocomplete="off"
              v-model="userInfo.code"
            >
          </div>
          <div class="valid-code fl">
            <button
              class="btn btn-success btn-block"
              @click="getCode"
              :disabled='isSend'
            >{{text}}</button>
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
              @click="register"
            >注册</button>
          </div>
          <div class="clearfix login-text">
            <span @click="goLogin" class="fr">已有账号,立即登录</span>
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
    name: "Register",
    data() {
      return {
        userInfo: {
          email: "",
          nickname: "",
          password: "",
          code: ""
        },
        text: "获取邮箱验证码",
        isSend: false,

        msg: ""
      };
    },

    methods: {
      //获取邮箱验证码
      getCode() {

        //26上 验证邮箱格式是否正
        let data = {email:this.userInfo.email}
        let res = validForm.valid(data);
        if(res.pass == false){
            // 
          this.msg = res.msg;
          this.$children[0].$el.style.top = "0px";
          setTimeout(() => {
            this.$children[0].$el.style.top = "-64px";
          }, 1500);
          return;
        }


        let time = 30;
        this.text = `${time}s后重新发送`;
        this.isSend = true;
        let timer = setInterval(() => {
          if (time == 0) {
            clearInterval(timer);
            timer = null;
            this.text = `发送验证码`;
            this.isSend = false;
          } else {
            time--;
            this.text = `${time}s后重新发送`;
          }
        }, 1000);

        //发送邮箱验证码  
        this.axios({
          method:'POST',
          url:'/sendmail',
          data,
        }).then(result=>{
          
        }).catch(err=>{
          
        })
      },
      //注册
      register() {
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
        //发起注册请求
        this.axios({
          method: "POST",
          url:'/register',
          //25上 发送post参数
          data:this.userInfo,
        })
          .then(result => {
            
            if(result.data.code == 1000) {
              this.$router.push({name:'Login'});
            } else {
                this.msg = result.data.msg;
                this.$children[0].$el.style.top = "0px";
                setTimeout(() => {
                  this.$children[0].$el.style.top = "-64px";
                }, 1500);
                return;
            }
          })
          .catch(err => {
            
          });
      },

      //跳转登陆
      goLogin(){
        this.$router.push({name:'Login'});
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