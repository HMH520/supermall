import BackTop from "@/components/content/backtop/BackTop";

export const backTopMixin = {
  components: {
    BackTop
  },
  data () {
    return {
      isBackShow: false
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    listenShowBackTop(position) {
      this.isBackShow = (-position.y) > 1000
    }
  }

}
