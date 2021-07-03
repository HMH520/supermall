<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="back">
        <img src="@/assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item, index) in titles"
             class="titleItem"
             :class="{active: index == currentIndex}"
             @click="itemClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";

export default {
  name: "DetailNavBar",
  data() {
    return {
      titles: ['商品','参数','评论','推荐'],
      currentIndex: 0
    }
  },
  components: {
    NavBar
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('titleClick', index)
    },

    back() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
  .title {
    display: flex;
    text-align: center;
    font-size: 13px;
  }

  .titleItem {
    flex: 1;
  }

  .back {
    margin-top: 7px;
  }

  .active {
    color: var(--color-high-text);
  }
</style>
