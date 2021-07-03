<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailnavbar"/>
    <scroll class="content"
            :probe-type="3"
            :pull-up-load="true"
            ref="scroll"
            @scroll="contentScroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="detailImgLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isBackShow"/>
    <detail-bottom-bar @addToCart="addToCart"/>
    <toast :message="message" :is-show="isShow"/>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goodslist/GoodsList";
import Toast from "@/components/common/toast/Toast";

import {getDetail, getRecommend, Goods, GoodsParam, Shop} from "@/network/detail";
import {debounce} from "@/common/utils";
import {backTopMixin} from "@/common/mixin";

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      message: '',
      isShow: false
    }
  },
  mixins: [backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },

  created() {
    //获取iid
    this.iid = this.$route.params.iid

    //请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.data.result
      // console.log(res);
      // console.log(res.data.result.itemInfo.topImages);
      // 1.获取顶部的图片详情数据
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //3.获取店铺信息
      this.shop = new Shop(data.shopInfo)
      // console.log(this.shop);
      //4.获取商品详细信息
      this.detailInfo = data.detailInfo
      // console.log(this.detailInfo);
      //5.获取商品参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //6.获取商品评论信息
      if (data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
        // console.log(this.commentInfo);
      }
    })

    //请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.data.list
      // console.log(this.recommends);
    })

    //给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.$nextTick(() => {
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 40)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 40)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 40)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);
      }, 50)
    })
  },
  methods: {
    ...mapActions(['addCart']),

    //监听图片加载
    detailImgLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },

    //监听导航点击
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      // console.log(this.themeTopYs);
    },

    //监听内容滚动
    contentScroll(position) {
      // console.log(position.y);
      //滚动内容与导航联动
      const positionY = -position.y
      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        if ((this.currentIndex !== i) && (i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          // console.log(i);
          this.currentIndex = i
          this.$refs.detailnavbar.currentIndex = this.currentIndex
        }
      }

      this.listenShowBackTop(position)
    },

    //添加到购物车
    addToCart() {
      // console.log('---');
      //将商品信息存储到Vuex的state中
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      product.checked = true

      this.addCart(product).then(res => {
        // console.log(res);
        // this.isShow = true
        // this.message = res
        // setTimeout(() => {
        //   this.isShow = false
        //   this.message = ''
        // }, 1500)
        this.$toast.ShowToast(res, 2000)
      })

      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
    }

  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }

  .detail-nav {
    background-color: #fff;
    position: relative;
    z-index: 9;
  }

  .content {
    height: calc(100% - 44px - 49px);
    background-color: #fff;
  }
</style>
