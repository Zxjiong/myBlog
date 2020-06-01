<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;我的资料</span>
    </common-header>
    <div class="contactWayMainContent">
      <div class="contactWayBox">
        <img :src="'./../static/'+userPic" />
        <div class="myInfo">
          <ul>
            <li>
              <span class="leftTxt">昵称：</span>
              <span class="infoDetail">{{userName}}</span>
            </li>
            <li>
              <span class="leftTxt">发布博客：</span>
              <span class="infoDetail">{{blogCount}}篇</span>
            </li>
            <li>
              <span class="leftTxt">获得评论总数：</span>
              <span class="infoDetail" v-text="commentCount/2"></span>
            </li>
            <li>
              <span class="leftTxt">博客获总获赞数：</span>
              <span class="infoDetail" v-text="noticeCount/2"></span>
            </li>
            <!-- <i>
              <span class="el-icon-edit">修改资料</span>
            </i> -->
          </ul>
        </div>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import "./../assets/css/contactWay.css";
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "contact-way",
  data() {
    return {
      userBlogList: [],
      commentCount: 0,
      noticeCount: 0,
      blogCount: 0,
      loading: false,
      userName: "",
      userPic: ""
    };
  },
  mounted() {
    this.getUserBlogList();
    if (this.isLogin) {
      this.getUserBlogList();
    }
  },
  computed: {
    ...mapState(["isLogin", "nickName"])
  },
  methods: {
    //获取用户博客列表
    getUserBlogList() {
      this.userBlogList = [];
      axios
        .get("/blogApi/getUserBlog")
        .then(response => {
          this.loading = true;
          var res = response.data;
          if (res.status == "0") {
            if (res.result.count >= 0) {
              this.blogCount = parseInt(res.result.count);
              this.userName = res.result.userName;
              this.userPic = res.result.userPic;
              setTimeout(() => {
                this.loading = false;
                this.userBlogList = res.result.blogList;
                for (var i in this.userBlogList) {
                  this.commentCount += this.userBlogList[i].commentNum;
                  this.noticeCount +=this.userBlogList[i].noticeNum;
                }
              }, 20);
            } else {
              this.loading = false;
              console.log(res.msg);
            }
          } else {
            this.loading = false;
            console.log(res.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err.message);
        });
    }
  },
  components: {
    CommonHeader,
    CommonFooter
  }
};
</script>
