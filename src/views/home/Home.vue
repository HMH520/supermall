<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

<!--    伪吸顶效果-->
    <tab-control
      :titles="['流行','新款','精选']"
      class="tab-control"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"/>

<!--    监听滚动组件-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">

<!--      轮播图组件-->
      <home-swiper :banners="banners"
                   @swiperImgLoad="swiperImgLoad"></home-swiper>

<!--      推荐组件-->
      <recommend-view :recommends="recommends"/>

<!--      本周流行组件-->
      <feature-view/>

<!--      商品导航栏组件-->
      <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl2"/>

<!--      商品列表组件-->
      <goods-list :goods="getGoods"/>

    </scroll>

<!--    回到顶部组件-->
    <back-top @click.native="backClick" v-show="isBackShow"/>
  </div>
</template>

<script>
import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabcontrol/TabControl";
import GoodsList from "@/components/content/goodslist/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backtop/BackTop";

import {getHomeMultidata, getHomeGoods} from "@/network/home";
import {backTopMixin} from "@/common/mixin";

export default {
  name: "Home",
  data() {
    return{
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list:[]},
        'new': {page: 0, list:[]},
        'sell': {page: 0, list:[]}
      },
      currentType: 'pop',
      isBackShow: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins: [backTopMixin],
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  computed: {
    getGoods() {
      //返回当前处于活跃状态的商品的信息
      return this.goods[this.currentType].list
    }
  },
  created() {
    this.getHomeMultidata()

    //获取商品信息
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  //设置组件处于活跃时，滚动状态保持在非活跃状态后Y的值
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    console.log(this.saveY);
  },
  //获取组件处于非活跃状态时滚动Y的值
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
  },
  methods: {
    /**
     * 事件监听相关方法
     */

    //推荐商品栏切换事件
    tabClick(index) {
      switch (index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    //监听内容滚动事件，控制回到顶部按钮显示与隐藏
    contentScroll(position) {
      //判断backTop是否显示
      this.listenShowBackTop(position)

      //决定TabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
      // console.log(position);
    },

    //上拉加载更多事件
    loadMore() {
      this.getHomeGoods(this.currentType)
    },

    //监听轮播图中图片加载事件
    swiperImgLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      //获取TabControl的位置
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关方法
     */

    //推荐数据网络请求
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.data.banner.list;
        this.recommends = res.data.data.recommend.list;
      })
    },

    //商品数据网络请求
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1
        // console.log(res.data.list)

        //完成数据请求后刷新
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*使用原生JS滚动时，防止导航栏跟着滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .tab-control {
    position: sticky;
    top: 44px;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*  height: 100%;*/
  /*  overflow: hidden;*/
  /*  margin-top: 51px;*/
  /*}*/
</style>
