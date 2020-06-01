<template>
  <div class="detailBox">
    <div class="blogDetailBox">
      <div class="detailMainContent">
        <span class="blogHeadTxt">博客详情</span>
        <div class="blogHead clearfix">
          <img :src="'./../static/'+authorPic" alt class="authorHead" v-rainbow="'active'" />
          <span class="authorName">{{author}}</span>
          <span class="createTime">{{createDate}}</span>
        </div>
        <div class="tags">标签：{{curBlog.tags}}</div>
        <div
          style="width:100%;height: 100%;display: flex;flex-direction: column;justify-content: space-around;align-items: flex-start;text-align: left;text-indent: 10px;"
        >
          <span
            style="font-size: 16px;width:100%;margin-left:auto;margin-right:auto;text-align:center;"
          >{{curBlog.title}}</span>
          <span class="blogContent">{{curBlog.content}}</span>
        </div>
        <div class="blogState">
          <button class="button1" @click="addBlogFlag=true;updateBadWord()">编辑</button>&nbsp;&nbsp;&nbsp;
          <button class="button2" @click="deleteBlog()">删除</button>
          <div class="commentIcon">
            <i class="icon iconfont icon-pinglun"></i>
            <span class="commentNum">{{curBlog.commentNum}}</span>
          </div>
          <div class="noticeIcon">
            <i class="icon iconfont icon-xiazai13"></i>
            <span class="noticeNum">{{curBlog.noticeNum}}</span>
          </div>
        </div>
      </div>
      <div class="commentMainContent">
        <span class="commentHeadTxt">评论列表</span>
        <ul>
          <li v-for="(comment,index) in commentList.slice((currpage-1)*4,currpage*4)" :key="index">
            <div class="commentHead clearfix">
              <img
                :src="'./../static/'+comment.commentAuthorPic"
                alt
                class="commentAuthorPic"
                v-rainbow="'active'"
              />
              <span class="commentAuthor">{{comment.commentAuthor}}({{index+1}}楼)：</span>
              <span
                class="commentDate"
              >{{comment.commentDate.substring(0,10)+" "+comment.commentDate.substring(11,19)}}</span>
            </div>
            <div class="commentContent">
              {{comment.commentContent}}
              <div class="deleteComment" @click="deleteComment(comment.commentId)">[删除评论]</div>
            </div>
          </li>
        </ul>
        <div class="pagination">
          <span
            style="cursor:pointer;text-decoration:underline"
            v-if="currpage>1"
            @click="currpage--"
          >上一页</span>
          <span>{{ currpage}}</span>/
          <span>{{ pagesum}}</span>
          <span
            style="cursor:pointer;text-decoration:underline"
            v-if="currpage<pagesum"
            @click="currpage++"
          >下一页</span>
        </div>
      </div>
    </div>
    <div class="addBlogBox" v-if="addBlogFlag" :class="{'showAddBlogBox':addBlogFlag}">
      <span class="labelTxt">Edit blog</span>
      <span class="errorMsg" v-if="errMsg2">博客标题、内容或者标签不能为空!</span>
      <div class="inputTxt2">
        <input type="text" class="myBlogTitle" v-model="title" />
      </div>
      <div class="inputTxt3">
        <textarea class="myBlogContent" cols="30" rows="5" v-model="content"></textarea>
      </div>
      <div class="inputTxt2">
        <input type="text" class="myBlogTags" v-model="tags" @keyup.enter="addBlog" />
      </div>
      <button class="addBlogBtn" @click="addBlog">修改发布</button>
      <span class="closeBtn" @click="addBlogFlag=false">X</span>
    </div>
  </div>
</template>
<script>
import "./../assets/css/common.css";
import "@/assets/css/blogDetail.css";
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "blog-detail-component",
  data() {
    return {
      authorPic: "",
      curBlog: {},
      createDate: "",
      commentList: [],
      pagesum: 1, //总页数
      currpage: 1, //当前页数
      eachpage: 4, //每页显示4条评论
      addBlogFlag: false,
      errMsg2: false,
      title: "",
      content: "",
      tags: "",
      isPass: true,
      forbiddenArray:[]
    };
  },
  mounted() {
    this.getBlogDetail();
  },
  computed: {
    ...mapState(["author", "blogId"])
  },
  methods: {
    //获取博客详情
    getBlogDetail() {
      let author = this.author;
      let blogId = this.blogId;
      var param = {
        userName: author,
        blogId: blogId
      };
      axios
        .get("/blogApi/getBlogDetail", {
          params: param
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.authorPic = res.result.authorPic;
            this.curBlog = res.result.curBlog;
            this.title = this.curBlog.title;
            this.content = this.curBlog.content;
            this.tags = this.curBlog.tags;
            this.createDate =
              this.curBlog.createDate.substring(0, 10) +
              " " +
              this.curBlog.createDate.substring(11, 19);
            this.commentList = this.curBlog.commentList;
            this.pagesum = Math.ceil(
              this.curBlog.commentList.length / this.eachpage
            );
          }
        });
    },
    //删除博客
    deleteBlog() {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("/blogApi/deleteBlog", {
              blogId: this.blogId
            })
            .then(response => {
              let res = response.data;
              if (res.status == "0") {
                alert(res.result);
                setTimeout(() => {
                  history.go(-1);
                }, 1000);
              } else {
                console.log(res.msg);
              }
            })
            .catch(err => {
              console.log(err.message);
            });
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除评论
    deleteComment(id) {
      this.$confirm("是否删除此评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("/blogApi/deleteComment", {
              blogId: this.blogId,
              commentId: id
            })
            .then(response => {
              let res = response.data;
              if (res.status == "0") {
                alert(res.result);
                setTimeout(() => {
                  history.go(-1);
                }, 1000);
              } else {
                console.log(res.msg);
              }
            })
            .catch(err => {
              console.log(err.message);
            });
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //发布博客
    addBlog() {
      if (!this.title || !this.content || !this.tags) {
        this.errMsg2 = true;
        return;
      }
      this.searchWord(this.content);
      console.log(this.content)
      if (!this.isPass) {
        alert("该文章含有敏感词汇，请修改后再发布");
      } else {
        axios
          .post("/blogApi/editBlog", {
            title: this.title,
            content: this.content,
            tags: this.tags,
            blogId: this.blogId
          })
          .then(response => {
            let res = response.data;
            if (res.status == "0") {
              alert(res.result);
              this.addBlogFlag = false;
              setTimeout(() => {
                history.go(-1);
              }, 1000);
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
