<template>
  <div class="app" id="app">
    
    <router-view/>

  </div>
</template>


<script>
  //导入消息提示组件

export default {
  name:'APP',
  data() {
    return {
      msg:''
    }
  },

}
</script>

<style lang="less">
  
body{
    line-height:1.4;
    color:#333;
    font-family:arial;
    font-size: 12px;
    background-color: #f7f7f7;
}
.app{
  min-width: 1170px;
}
input,textarea,select{
    font-size:100%;    
    font-family:inherit;
}
body,h1,h2,h3,h4,h5,h6,p,ul,ol,form{
    margin:0;
}
h4,h5,h6{
    font-size:1em;
}
ul,ol{
    padding-left:0; 
    list-style-type:none;
}

.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  display: block;
  content: "";
  clear: both;
}

.auto-img{
  width: 100%;
  display: block;
}

</style>
