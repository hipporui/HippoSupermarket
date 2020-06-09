<template>
  <div class="main">
    <div class="header">
      <div class="fl title">珠海河马文化传播后台管理</div>
      <div class="fr clearfix">
        <div class="user-img fl">
          <img class="usersimg" :src="staticeUrl +'/'+ userInfo.userImg" alt="">
        </div>
        <div class="nickname fl">{{userInfo.nickname}}</div>
        <div class="fl setting">设置</div>
        <div class="fl logout">退出</div>
      </div>
    </div>
    <div class="box">
      <div class="aside" >
      <!-- 手风琴 -->
        <div class="accordion" id="accordion">
          <div class="card" v-for="(item, index) in asideMenu" :key="index">
            <div class="card-header">
            <div class="aside-item" data-toggle="collapse" :data-target="'#c' + index">
              <div class="fl"><i class="fa" :class="[item.icon]"></i></div> 
              <div class="fl fa-title">
                <span class="fl">{{item.title}}</span><i class="fa fa-angle-down fr down-arrow"></i>
              </div>
            </div>
            </div>

            <div :id="'c' + index" class="collapse  c-box" :class="{show: index == 0}"  data-parent="#accordion">
              <div class="card-body">
                <div class="type-item" :class="{active: v.isActive}" v-for="(v, i) in item.subTitle" 
				:key="i" @click="toggleAsideMenu(v)">{{v.name}}</div>
              </div>
            </div>
          </div>
          <!-- 第二层 -->
        </div>

      </div> 
      <div class="content">

        <!-- 二级路由 -->
        <router-view></router-view>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        userInfo:{},
        asideMenu: [
          {
            title: '商品管理',
            icon: 'fa-cube',
            subTitle: [
              {
                name: '商品类型',
                isActive: true,

                //路由名称
                routerName: 'Type'
              },
              {
                name: '商品列表',
                isActive: false ,
                routerName: 'Products'
              }
            ]
          },
          {
            title: '订单管理',
            icon: 'fa-file-text-o',
            subTitle: [
              {
                name: '订单列表',
                isActive: false,
                routerName: ''
              }
            ]
          },
          {
            title: '数据统计',
            icon: 'fa-bar-chart',
            subTitle: [
              {
                name: '商品统计',
                isActive: false,
                routerName: ''
              },
              {
                name: '订单统计',
                isActive: false,
                routerName: ''
              }
            ]
          }
        ],
      }
    },
    created() {
      this.getUserInfo();
      
    },
    methods: {
      //获取用户信息
      getUserInfo(){
        this.axios({
          method:'GET',
          url:'/userInfo',
          params:{
            token:localStorage.getItem('_abc')
          }
        }).then(result=>{
          
          if(result.data.code == 1060){
            this.userInfo = result.data.result[0];
          }
        }).catch(err=>{
          
        })
      },

     //切换侧边栏菜单
      toggleAsideMenu(item) {

        //如果当前选中，不做任何事情
        if (item.isActive) {
          
          return;
        }
        

        //将其他选中修改为未选中状态
        this.asideMenu.forEach(v1 => {
          v1.subTitle.forEach(v2 => {
            v2.isActive = false;
          })
        })

        item.isActive = true;

        this.$router.push({name: item.routerName});
      }
    },
  }
</script>

<style lang="less" scoped>
.usersimg{
  width: 100%;
  height: 100%;
}
  .user-img{
    width: 60px;
    height: 60px;
    margin-top: 10px;
    border-radius: 50%;
    background-color: #000;
    overflow: hidden;
  }
  .nickname{
    margin-left: 20px;
    line-height: 80px;
    color: #fff;
    font-weight: bold;
  }
  .title{
    line-height: 80px;
    font-size: 24px;
    color: #fff;
    font-family:汉仪综艺体简;
  }
  .type-item{
    height: 40px;
    line-height:40px;
    color: #fff;
    padding-left: 30px;
    cursor: pointer;
  }
  .type-item.active{
     background-color: #313541;
  }
  .card-body{
    padding: 0;
  }
  .aside-item{
    height: 44px;
  }
  .card-header{
    padding: 0;
    background-color: #3e4359;
  }
  .card{
    border-radius: 0;
    background-color: transparent;
  }
  .header{
    height: 80px;
    background-color: #ff7500;
    position: sticky;
    top: 0;
    padding: 0 20px;
    z-index: 999;
  }
  .aside{
    position: fixed;
    left: 0;
    top: 80px;
    bottom: 0;
    width: 200px;
    background-color: #3e4359;
  }

  .aside-item{
    height: 44px;
    line-height: 44px;
    color: #fff;
    padding-left: 20px;
    cursor: pointer;
  }

  .content{
    width: calc(100% - 200px);
    margin-left: 200px;
    background-color: #fff;
  }
   .fa-title{
    margin-left: 10px;
    width: 124px;
  }
   .down-arrow{
    line-height: 44px;
    font-size: 18px;
    margin-right: 20px;
  }
    .setting{
    margin: 0 20px;
    cursor: pointer;
    line-height: 80px;  
  }
  .logout{
    cursor: pointer;
    line-height: 80px;
  }
</style>