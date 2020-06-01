<template>
  <div>
    <div class="headerBox">
      <carousel-3d>
        <slide v-for="(item,index) in bannerImg" :index="index" :key="index">
          <a href="javascript:;">
            <img :src="item.src" alt />
          </a>
        </slide>
      </carousel-3d>
    </div>
    <div class="headerMenu">
      <div class="searchBox">
        <input
          type="text"
          class="searchBar"
          placeholder="请输入搜索关键词"
          v-model="keywords"
          @keyup.enter="searchBlog"
        />
        <button class="searchBtn" @click="searchBlog">搜索</button>
      </div>
      <video id="video" src controls="controls" hidden="hidden" autoplay="autoplay" loop="loop"></video>

      <div class="menuBox">
        <router-link to="/" exact>首页</router-link>
        <router-link to="/myBlog" exact>我的博客</router-link>
        <router-link to="/contactWay" exact>我的资料</router-link>
        <!-- <router-link to="/myPhoto" exact>我的相册</router-link> -->
      </div>
    </div>
    <div class="breadState">
      <div class="locationState">
        <a href="javascript:;" class="defaultState">首页</a>
        <slot name="locationName"></slot>
      </div>
      <div class="loginState">
        <a href="javascript:;" @click="loginFlag=true" v-if="!isLogin">登录</a>
        <a href="javascript:;" @click="regFlag=true" v-if="!isLogin">注册</a>
        <span class="nickName" v-if="isLogin">{{nickName}}</span>
        <a href="javascript:;" v-if="isLogin" @click="userLogout">退出</a>
        <a href="javascript:;" v-if="isLogin" @click="addBlogFlag=true;updateBadWord()">发布博客</a>
        <a href="javascript:;" v-if="isLogin" @click="showMessageFlag=true">
          <i class="el-icon-bell"></i>
        </a>
      </div>
    </div>
    <div class="overLay" v-if="loginFlag" @click="loginFlag=false"></div>
    <div class="overLay" v-if="regFlag" @click="regFlag=false"></div>
    <div class="overLay" v-if="addBlogFlag" @click="addBlogFlag=false"></div>
    <div class="overLay2" v-if="showMessageFlag" @click="showMessageFlag=false"></div>
    <div class="loginBox" v-if="loginFlag" :class="{'showLoginBox':loginFlag}">
      <span class="labelTxt">Login in</span>
      <span class="errorMsg" v-if="errMsg">用户名或者密码错误!</span>
      <div class="inputTxt">
        <input
          type="text"
          class="userName"
          placeholder="User Name"
          v-model="users.userName"
          @keyup.enter="userLogin"
        />
      </div>
      <div class="inputTxt">
        <input
          type="password"
          class="pwd"
          placeholder="Password"
          v-model="users.userPwd"
          @keyup.enter="userLogin"
        />
      </div>
      <button class="loginBtn" @click="userLogin">登录</button>
      <span class="closeBtn" @click="loginFlag=false">X</span>
    </div>
    <div class="regBox" v-if="regFlag" :class="{'showRegBox':regFlag}">
      <span class="labelTxt">Reg in</span>
      <span class="errorMsg" v-if="errMsg1">请输入用户名和密码以及上传头像！</span>
      <div class="inputTxt1">
        <input
          type="text"
          class="userName"
          placeholder="User Name"
          v-model="users.userName"
          @keyup.enter="userReg"
        />
      </div>
      <div class="inputTxt1">
        <input
          type="password"
          class="pwd"
          placeholder="Password"
          v-model="users.userPwd"
          @keyup.enter="userReg"
        />
      </div>
      <div class="inputTxt1">
        <input
          class="file"
          type="file"
          name="file"
          accept="image/png, image/gif, image/jpeg"
          @change="onFileChange"
        />
      </div>
      <div class="inputTxt1">
        <Verify @success="alert('success')" @error="alert('error')" :type="3"></Verify>
      </div>
      <button class="regBtn" @click="userReg">注册</button>
      <span class="closeBtn" @click="regFlag=false">X</span>
    </div>
    <div class="messageBox" v-if="showMessageFlag" :class="{'showMessageBox':showMessageFlag}">
      <div>如有疑问，请联系632112316@qq.com</div>
      <ul class="msgUl">
        <li class="msgLi"
          v-for="(msg,i) in message"
          :key="i"
        ><div style="">消息{{i+1}}：</div>尊敬的用户您好，你的名为“{{msg.title}}”文章不符合本网站规定，已被管理员删除</li>
      </ul>
    </div>
    <div class="addBlogBox" v-if="addBlogFlag" :class="{'showAddBlogBox':addBlogFlag}">
      <span class="labelTxt">Add blog</span>
      <span class="errorMsg" v-if="errMsg2">博客标题、内容或者标签不能为空!</span>
      <div class="inputTxt2">
        <input type="text" class="myBlogTitle" placeholder="博客标题" v-model="title" />
      </div>
      <div class="inputTxt3">
        <textarea class="myBlogContent" cols="30" rows="5" placeholder="博客内容" v-model="content"></textarea>
      </div>
      <div class="inputTxt2">
        <input
          type="text"
          class="myBlogTags"
          placeholder="博客标签"
          v-model="tags"
          @keyup.enter="addBlog"
        />
      </div>
      <button class="addBlogBtn" @click="addBlog">发布博客</button>
      <span class="closeBtn" @click="addBlogFlag=false">X</span>
    </div>
  </div>
</template>
<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
import "./../assets/css/common.css";
import axios from "axios";
import { mapState } from "vuex";
import Verify from "vue2-verify";
export default {
  name: "common-header",
  data() {
    return {
      bannerImg: [
        { src: require("../../blog/static/1.jpg") },
        { src: require("../../blog/static/2.jpg") },
        { src: require("../../blog/static/3.jpg") },
        { src: require("../../blog/static/4.jpg") },
        { src: require("../../blog/static/5.jpg") }
      ],
      keywords: "",
      isLogin: false,
      loginFlag: false,
      regFlag: false,
      errMsg: false,
      errMsg1: false,
      errMsg2: false,
      users: {
        userName: "",
        userPwd: "",
        photo: null,
        code: ""
      },
      addBlogFlag: false,
      showMessageFlag: false,
      message: [],
      title: "",
      content: "",
      tags: "",
      isPass: true,
      forbiddenArray: []
    };
  },
  mounted() {
    this.checkLogin();
  },
  created() {
    this.getUserMessage();
  },
  computed: {
    ...mapState(["nickName"])
  },
  components: {
    Carousel3d,
    Slide,
    Verify
  },
  methods: {
    //提交搜索的关键词到store
    searchBlog() {
      this.$store.commit("updateKeyWords", this.keywords);
    },
    getUserMessage() {
      axios.get("/blogApi/getUserBlog").then(response => {
        var res = response.data;
        this.message = res.result.message;
        console.log(res.result);
        console.log(this.message);
      });
    },
    //检查是否登录
    checkLogin() {
      axios
        .get("/blogApi/checkLogin")
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.isLogin = true;
            this.$store.commit("updateUserInfo", res.result);
          } else {
            console.log(res.msg);
            this.isLogin = false;
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //用户登录
    userLogin() {
      if (!this.users.userName || !this.users.userPwd) {
        this.errMsg = true;
        return;
      }
      axios
        .post("/blogApi/login", {
          userName: this.users.userName,
          userPwd: this.users.userPwd
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.errMsg = false;
            this.loginFlag = false;
            this.isLogin = true;
            this.$store.commit("updateIsLogin", true);
            this.$store.commit("updateUserInfo", res.result.userName);
            alert("登陆成功");
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //用户登出
    userLogout() {
      axios
        .post("/blogApi/logout")
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.isLogin = false;
            this.$store.commit("updateUserInfo", "");
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //上传头像
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.users.photo = files[0];
    },
    //滑动验证
    alert(text) {
      console.log(text);
      this.users.code = text;
    },
    //用户注册
    userReg() {
      var form = new FormData();
      for (var key in this.users) {
        //读取data中所要上传的内容循环append到form中
        if (key) {
          form.append(key, this.users[key]);
        }
      }
      //添加请求头
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      if (!this.users.userName || !this.users.userPwd || !this.users.photo) {
        this.errMsg1 = true;
        return;
      }
      axios
        .post("/blogApi/userReg", form, config)
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
    //发布博客
    addBlog() {
      if (!this.title || !this.content || !this.tags) {
        this.errMsg2 = true;
        return;
      }
      this.searchWord(this.content);
      console.log(this.isPass);
      if (!this.isPass) {
        alert("该文章含有敏感词汇，请修改后再发布");
      } else {
        axios
          .post("/blogApi/addBlog", {
            title: this.title,
            content: this.content,
            tags: this.tags
          })
          .then(response => {
            let res = response.data;
            if (res.status == "0") {
              alert(res.result);
              this.addBlogFlag = false;
            } else {
              console.log(res.msg);
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    },
    updateBadWord() {
      axios.get("/blogApi/getBadWord").then(response => {
        let res = response.data.result[0].badword;
        this.forbiddenArray = res;
        console.log(this.forbiddenArray);
      });
    },

    searchWord(str) {
      //定义敏感字符
      // var forbiddenArray = ["你妈的", "操你妈", "台独", "港独", "藏独"];
      //        var destString = trim(str);
      var re = "";
      for (var i = 0; i < this.forbiddenArray.length; i++) {
        if (i == this.forbiddenArray.length - 1) re += this.forbiddenArray[i];
        else re += this.forbiddenArray[i] + "|";
      }
      //定义正则表示式对象
      //利用RegExp可以动态生成正则表示式
      var pattern = new RegExp(re, "g");
      console.log(pattern);
      if (pattern.test(str)) {
        this.isPass = false;
        // return false;
      } else {
        // return true;
        this.isPass = true;
      }
    }
  }
};
</script>

<style scoped>
.msgUl{
  position: absolute;
  top:0;
  left: -60%;
  width: 100%;
  height: 100%;
  /* list-style-type: none; */
  /* overflow: scroll; */
}
.msgLi{
  color:black;
  /* padding-left:-100px; */
  height: 30px;
}
</style>