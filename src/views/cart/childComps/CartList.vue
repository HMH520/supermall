<template>
  <div class="cart-list">
<!--    商品列表-->
    <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info="item" />
  </div>
</template>

<script>
import CartListItem from "@/views/cart/childComps/CartListItem";
import {mapGetters} from "vuex";

export default {
  name: "CartList",
  components: {
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  }
}
</script>

<style scoped>

</style>
