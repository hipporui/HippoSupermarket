<template>
  <div class="msg-box">{{msg}}</div>
</template>

<script>
import Vue from "vue";
Vue.prototype.$showToast = function(o) {

  //this.$children ==> 页面使用组件集合

  for (let i = 0; i < this.$children.length; i++) {
    let cihldren = this.$children[i].$el;
    if (cihldren.className == 'msg-box') {
      cihldren.textContent = o.message;
      cihldren.style.top = "0px";
      setTimeout(() => {
        cihldren.style.top = "-64px";
      }, o.duration || 2000);
      return;
    }
  } 
};
export default {
  name:'MyTip',
  props:{

    msg:{
      type:String,
      default:'错误消息提示'
    }
  },

}
</script>

<style lang="less" scoped>
  .msg-box{
    width: 400px;
    height: 64px;
    padding: 20px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: #ae433d;
    position: fixed;
    font-weight: bold;
    top: -64px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    // line-height: 64px;
    transition: top .2s linear;
    z-index: 9999;
  }
</style>