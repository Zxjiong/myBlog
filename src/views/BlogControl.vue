<template>
  <div>
    <common-header>
      <span class="activeState" slot="locationName">&nbsp;/&nbsp;博客详情</span>
    </common-header>
    <user-blog-control></user-blog-control>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/CommonHeader'
  import CommonFooter from '@/components/CommonFooter'
  import UserBlogControl from '@/components/UserBlogControl'
  export default {
    name: "blog-detail",
    data(){
      return{

      }
    },
    components:{
      CommonHeader,
      CommonFooter,
      UserBlogControl
    }
  }
</script>
