<template>
  <div class="pro">
    <form>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品名称</div>
        <div class="form-input fl">
          <input
            type="text"
            class="form-control"
            v-model="productInfo.name"
          >
        </div>
      </div>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品类型</div>
        <div class="form-input fl">
          <select class="form-control" v-model="productInfo.type">
            <option value=""></option>
            <option :value="item.typeId" v-for="(item, index) in proTypeList" :key="index">{{item.type}}</option>
          </select>
        </div>
      </div>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品价格</div>
        <div class="form-input fl">
          <input
            type="text"
            class="form-control"
            v-model="productInfo.price"
          >
        </div>
      </div>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">库存</div>
        <div class="form-input fl">
          <input
            type="text"
            class="form-control"
            v-model="productInfo.count"
          >
        </div>
      </div>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品图片</div>
        <div class="form-upload fl">
          <Upload
            @file-upload="fileUpload"
            :size="size"
          />
        </div>
      </div>
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品详情图</div>
        <div class="form-upload fl">
          <Upload
            @file-upload="detailfileUpload"
            :size="size"
          />
        </div>
      </div>
      <!--  -->
      <div class="fomr-box form-group clearfix">
        <div class="form-title fl">商品状态</div>
        <div class="form-input form-radio-box fl clearfix">
          <div class="fl">
            <div class="custom-control custom-radio mr-sm-2">
              <input type="radio" class="custom-control-input" id="r1" name="r" checked  data-status="1" @change="selectStatus">
              <label class="custom-control-label" for="r1">上架</label>
            </div>
          </div>
          <div class="fl">
            <div class="custom-control custom-radio mr-sm-2">
              <input type="radio" class="custom-control-input" id="r2" name="r"  data-status="0" @change="selectStatus">
              <label class="custom-control-label" for="r2">下架</label>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="form-box form-group clearfix">
        <div class="form-title fl">商品描述</div>
        <div class="form-input fl">
          <textarea class="form-control textarea-box"  v-model="productInfo.desc"></textarea>
        </div>
      </div>
      <!--  -->
      <div class="form-box form-group clearfix">
        <button class="btn btn-warning" @click="postProduct">发布商品</button>
      </div>
    </form>

    <MyTip :msg="msg" />
  </div>
</template>

<script>
  import Upload from "../components/Upload";
  import MyTip from "../components/MyTip";
  export default {
    name: "Pro",
    data() {
      return {
        // 图片最大内存
        size: 3,

        proTypeList: [],

        msg: "",

         //保存上传商品信息
        productInfo: {
          name: "", //商品名称
          type: "default", //商品类型
          price: 0, //商品价格
          count: 0, //商品库存；量
          img: "", //商品图片
          imgType: "", //商品图片类型 jpg、png、
          imgDetail: "", //商品详情图
          imgDetailType: "", //商品商品详情图类型
          status: 1, //1上架 0下架
          desc: "", //描述m,
          
        }
      };
    },
    created() {
      //截取路由参数
      let params = this.$route.params;
      

      //获取商品类型
      this.getProType();

      //
      if(params.id == 1 || params == 3){
        this.getProductByPid(params.pid);
      }
      
    },
    methods: {
      //获取上传图片信息
      fileUpload(e) {
        // e是子组件发过来的参数
        // 
        this.productInfo.img = e.base64.replace(/data:image\/[A-Za-z]+;base64,/, '');

        this.productInfo.imgType = e.type;
      },

      detailfileUpload(e){
        this.productInfo.imgDetail = e.base64.replace(/data:image\/[A-Za-z]+;base64,/, '');

        this.productInfo.imgDetailType = e.type;
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

        //选择上下架
      selectStatus(e) {
        // 
        //获取data-status
        this.productInfo.status = e.target.dataset.status;

      },
      //发布商品
      postProduct() {

        //表单验证
        let nameReg = /<\/?script>/;


        //^[1-9]\d*$ ==> 整数
        //^0\.\d{1,2}$ ==> 0.xx的小数
        //^[1-9]\d*\.\d{1,2}$ ==> 121.xx小数

        let priceReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/; 

        let countReg = /^[1-9]\d*$/;

        if (this.productInfo.name == '' || nameReg.test(this.productInfo.name)) {
          this.$showToast({
            message: '商品名称不能为空且不能含有<script>字符',
            duration: 3000
          })

        } else if (this.productInfo.type == 'default') {
          this.$showToast({
            message: '请选择商品类型',
            duration: 3000
          })

        } else if (!priceReg.test(this.productInfo.price)) {
          this.$showToast({
            message: '价格只能填写数字且最多含两位小数',
            duration: 3000
          })

        } else if (!countReg.test(this.productInfo.count)) {
          this.$showToast({
            message: '库存只能填写数字且为整数',
            duration: 3000
          })

        } else if (this.productInfo.img == '') {
          this.$showToast({
            message: '请上传商品图片',
            duration: 3000
          })

        } else if (this.productInfo.imgDetail == '') {
          this.$showToast({
            message: '请上传商品详情图片',
            duration: 3000
          })

        } else if (this.productInfo.desc == '' || nameReg.test(this.productInfo.desc)) {
          this.$showToast({
            message: '商品描述不能为空且不能含有<script>字符',
            duration: 3000
          })

        } else {

          
          this.productInfo.token = localStorage.getItem('_abc');
          //发起请求
          this.axios({
            method: 'POST',
            url: '/postProduct',
            data: this.productInfo
          }).then(result => {
            // 
          }).catch(err => {
            
          })

        }

      },

      //根据商品pid 查看商品数据
      // getProductByPid(pid){
      //   this.axios({
      //     method:'GET',
      //     url:'/productByPid',
      //     params: {
      //       pid,
      //       token: localStorage.getItem("_abc")
      //     }
      //   }).then(result =>{
      //     
      //   }).catch(err =>{
      //     
      //   })
      // }
    },
    components: {
      Upload,
      MyTip
    }
  };
</script>

<style lang="less" scoped>
  .pro {
    padding: 20px;
  }
  .btn-box {
    margin-left: 100px;
    margin-top: 50px;
  }
  .textarea-box {
    height: 180px;
    resize: none;
  }
  .form-radio-box {
    padding-top: 7px;
  }
  .form-title {
    width: 100px;
    line-height: 38px;
  }
  .form-input {
    width: 300px;
  }

  .form-upload {
    width: 160px;
    height: 160px;
  }
</style>