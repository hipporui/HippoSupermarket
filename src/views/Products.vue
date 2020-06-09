<template>
  <div class="products">
    <div class="header clearfix">
      <div>
        <ul class="list fl clearfix">
          <li class="fl list-title">商品类型</li>
          <li class="fl list-input">
            <select class="form-control">
              <option :value="item.id" v-for="(item,index) in proTypeList" :key="index">{{item.type}}</option>
            </select>
          </li>
        </ul>
        <ul class="list fl clearfix">
          <li class="fl list-title">商品名称</li>
          <li class="fl list-input">
            <input type="text" class="from-control" v-model="searchInfo.name">
          </li>
        </ul>
        <ul class="list fl clearfix">
          <li class="fl list-title">商品状态</li>
          <li class="fl list-input">
            <select class="form-control" v-model="searchInfo.status">
              <option value="default">请选择</option>
              <option value="1">上架</option>
              <option value="0">下架</option>
            </select>
          </li>
        </ul>
        <ul class="list fl clearfix">
          <li class="fl list-title">时间日期</li>
          <li class="fl list-input">
            <input type="date" class="form-control" v-model="searchInfo.date">  
          </li>
        </ul>
        <ul class="list fl clearfix">
          <li><button class="btn btn-primary" @click="search">搜索</button></li>
        </ul>
      </div>
    </div>
    <div class="btn-box">
      <button class="btn btn-info" @click="goPro(2)">添加商品</button>
    </div>
    <div class="content">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>序号</th>
            <th>商品名称</th>
            <th>商品类型</th>
            <th>商品状态</th>
            <th>添加时间</th>
            <th>跟新时间</th>
            <th>操作</th>
          </tr>
        </thead>
          <tr v-for="(item,index) in productList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.type}}</td>
            <td>{{item.status == 1?'上架' :'下架'}}</td>
            <td>{{item.created_at}}</td>
            <td>{{item.updated_at}}</td>
            <td>
               <button class="btn pro-btn btn-success btn-sm edit" @click="goPro(1,item.pid)">查看</button>
               <button class="btn pro-btn btn-info btn-sm edit" @click="goPro(3,item.pid)">编辑</button>
              <button class="btn  pro-btn btn-warning btn-sm" v-if="item.status == 0" @click="upDown(1, item)">上架</button>
              <button class="btn  pro-btn btn-secondary btn-sm" @click="upDown(0, item)" v-else>下架</button>
              <button class="btn btn-danger btn-sm" @click="remove(item.pid,index)">删除</button>
            </td>
          </tr>
      </table>
      <nav v-if="productList.length>0">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled:currentPage == 1}" @click="prevPage">
          <a class="page-link" href="javascript:void(0);">上一页</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);">{{currentPage}}</a>
        </li>
        <li class="page-item" :class="{disabled:currentPage == this.total}" @click="nextPage">
          <a class="page-link" href="javascript:void(0);">下一页</a>
        </li>
        <li>
          <a class="page-link" href="javascript:void(0);">共{{total}}页</a>
        </li>
      </ul>
    </nav>
    </div>
  </div>
</template>

<script>
import {tool} from '../assets/js/tool'
export default {
  name:'Products',
  data() {
    return {
      //搜索条件
      searchInfo:{
        name:'',
        type: 'default',
        status: 'default',
        date:''
      },
      //
      proTypeList:[],

      //每一页显示10条数据
        pageCount: 1,

      //当前页面
      currentPage: 1,

      //总页面数
      total: 0,

      productList:[]
    }
  },
  created() {
    this.getProType();
    this.getProductList();
    this.getProductListRow();
  },
  
  methods: {

    //查看:1,添加:2,编辑:3
    goPro(id,pid){
      let params ={
        id
      }
      if(pid){
        params.pid = pid;
      }
      this.$router.push({name:'Pro',params});
    },

    search(){
      this.currentPage = 1;
      
      this.getSearchCondition();
      this.getProductListRow();
    },

    //获取商品类型
      getProType() {
        this.axios({
          methid: "GET",
          url: "/proType",
          params: {
            token: localStorage.getItem("_abc")
          }
        })
          .then(result => {
            // 
            if (result.data.code == 1052) {
              result.data.result.unshift({
                typeId: "default",
                type: "请选择"
              });
              this.proTypeList = result.data.result;
            }
          })
          .catch(err => {
            
          });
      },
    
    //获取搜索参数条件
    getSearchCondition(){
      //获取搜索条件
        let searchCondition = this.searchInfo;
        

        //过滤条件
        //商品名称 、 日期不能为空
        //商品类型 、 商品不能为default
        let condition = {};
            
        if (searchCondition.name != '') {
          condition.name = searchCondition.name;
        }

        if (searchCondition.date != '') {
          condition.date = searchCondition.date;
        }

        if (searchCondition.type != 'default') {
          condition.type = searchCondition.type;
        }

        if (searchCondition.status != 'default') {
          condition.status = searchCondition.status;
        }
        return condition;
    },

    //获取商品列表记录数量
    getProductListRow(){
      let condition = this.getSearchCondition();
      condition.token = localStorage.getItem("_abc")
      this.axios({
        methid:'GET',
        url:'/productListRows',
        params:condition
      }).then(result=>{
        
        this.total = Math.ceil(result.data.result / this.pageCount);
      }).catch(err=>{
        
      })
    },

    //获取商品列表数据
      getProductList() {

        //获取搜索条件
        let searchCondition = this.searchInfo;
        

        //过滤条件
        //商品名称 、 日期不能为空
        //商品类型 、 商品不能为default
        let condition = {};
            
        if (searchCondition.name != '') {
          condition.name = searchCondition.name;
        }

        if (searchCondition.date != '') {
          condition.date = searchCondition.date;
        }

        if (searchCondition.type != 'default') {
          condition.type = searchCondition.type;
        }

        if (searchCondition.status != 'default') {
          condition.status = searchCondition.status;
        }

        condition.token = localStorage.getItem('_abc')
        
        //偏移数据量
        condition.offset = (this.currentPage -1)*this.pageCount;
        //查询数据量
        condition.limit = this.pageCount;
        //发起请求
        this.axios({
          method: 'GET',
          url: '/productList',
          params: condition
        }).then(result => {
          

          if (result.data.code == 1080) {

            result.data.result.forEach(v => {
              v.created_at = tool.formatDate(new Date(v.created_at), 'yyyy-MM-dd hh:mm:ss');
              v.updated_at = tool.formatDate(new Date(v.updated_at), 'yyyy-MM-dd hh:mm:ss');
            })

            this.productList = result.data.result;
          }
        }).catch(err => {
          
        })


      },

    //上一页
    prevPage(){
      if(this.currentPage == 1){
        return;
      }
        this.currentPage--;
        this.getProductList();
    },
    //下一页
    nextPage(){
      if(this.currentPage == this.total){
        return;
      }
      this.currentPage++;
      this.getProductList();
    },

   //上下架
      upDown(status, item) {

        this.axios({
          method: 'POST',
          url: '/status',
          data: {
            status,
            pid: item.pid,
            token:localStorage.getItem('_abc')
          }
        }).then(result => {
          
          if (result.data.code == 1090 && result.data.result[0] == 1) {
            item.status = status;
          }
        }).catch(err => {
          
        })
      },

    //删除商品
    remove(pid,index){
      
      // this.productList.splice(index,1);
      this.axios({
        method:"POST",
        url:'/removeProduct',
        data:{
          pid,
          token:localStorage.getItem('_abc')
        }
      }).then(result=>{
        
        if(result.data.code == 1074 && result.data.result == 1){
          //如果存在下一页数据,则补全当前页数据
          //判断是否存在下一页
          if(this.currentPage <this.total){
            this.getProductList();
            this.getProductListRow();
          } else {
            //如果是最后一页,存在两种可能
            //1,删除后,仍然存在数据,则只是删除当前页的数据数据,不换页码
            if(this.productList.length >= 2 ){
              this.productList.splice(index,1);
            } else {
              //判断是否存在上一页数据
              if(this.currentPage > 1 ){
                this.currentPage--;
                this.getProductList();
                this.getProductListRow();
              }else {
              this.productList.splice(index,1);

              }
            }
            //2.删除后,最后一页没有数据了,跳到上一页
          }
        }
      }).catch(err=>{
        
      })
    }
  },
}
</script>

<style lang="less" scoped>
  .products{
    padding: 20px;
  }
  .list{
    line-height: 38px;
    margin-right: 10px;
    .list-title{
      width: 80px;
      margin-right: 10px;
    }
    .list-input{
      width: 200px;
    }
  }
  .btn-box{
    margin: 15px;
  }
  .pro-btn{
    margin-right: 10px;
  }
</style>