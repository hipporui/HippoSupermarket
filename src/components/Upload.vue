<template>
  <div class="upload">
    <div class="upload-box">
      <label class="upload-label">
      <input
        class="file"
        type="file"
        @change='filesData'
      >
    </label>
    <div class="img-box" v-if="url != ''">
      <img
        class="auto-img"
        :src="url" 
      >
    </div>
    <div class="icon-box" v-else>
      <img
        class="auto-img"
        src="../assets/images/add.png"  
      >
    </div>

    <!--  -->
    <MyTip :msg="msg" />
    </div>
    <!--  -->
    <div class="uplpad-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import MyTip from "../components/MyTip";
  export default {
    name: "Upload",
    props: {
      size: {
        type: Number,
        // 默认3M
        default: 3
      }
    },
    data() {
      return {
        url: "",
        msg: "",
        
      };
    },

    methods: {
      filesData(e) {
        let self = this;

        let file = e.target.files[0];

        

        //控制上传图片大小(转M)
        let fileSize = file.size / 1024 / 1024;
        
        // ========================================
        if (fileSize > this.size) {
          this.msg = `上传图片不能超过${this.size}MB`;
          this.$children[0].$el.style.top = "0px";
          setTimeout(() => {
            this.$children[0].$el.style.top = "-64px";
          }, 1500);
          return;
        }

        //将文件信息转换成base64再传到后台

        //创建文件读取对象
        let fileReader = new FileReader();

        //监听文件读取对象是否读取完毕
        fileReader.onload = function(e) {
          // 

          self.url = this.result;

          //触发上传组件自定义事件
          self.$emit("file-upload", {
            base64: this.result,
            type: file.type.split("/")[1]
          });
        };

        //读取
        fileReader.readAsDataURL(file);
      }
    },
    components: {
      MyTip
    }
  };
</script>


<style lang="less" scoped>
.upload{
  position: relative;
}
.upload-slot{
  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
  .upload {
    width: 160px;
    height: 160px;
    background-color: #f2f2f2;
    border: 2px dashed #ddd;
    position: relative;
  }

  .upload-label {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .file {
    display: none;
  }

  .img-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .icon-box{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    z-index: 1;
  }
  .upload-box{
    width: 160px;
    height: 160px;
    background-color: #f2f2f2;
    border: 2px dashed #ddd;
    position: relative;
    z-index: 1;
  }
</style>