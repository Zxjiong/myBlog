<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;我的相册</span>
    </common-header>
    <div class="contactWayMainContent">
      <input
        class="file"
        type="file"
        name="file"
        accept="image/png, image/gif, image/jpeg"
        @change="onFileChange"
      />
      <button class="regBtn" @click="uploadPhoto">上传</button>

      <!-- <img :src="'http://localhost:8888'+item.photos_url" alt=""/> -->
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import "./../assets/css/myPhoto.css";
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "myphoto",
  data() {
    return {
      photo:null
    };
  },
  mounted() {},
  computed: {
    ...mapState(["isLogin", "nickName"])
  },
  methods: {
    //上传相片
    uploadPhoto() {
      var form = new FormData();
      for (var key in this.photo) {
        //读取data中所要上传的内容循环append到form中
        if (key) {
          form.append(key, this.photo);
        }
      }
      //添加请求头
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      axios
        .post("/blogApi/userPhoto", form, config)
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.regFlag = false;
            alert(res.result);
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.photo = files[0];
    }
  },
  components: {
    CommonHeader,
    CommonFooter
  }
};
</script>
