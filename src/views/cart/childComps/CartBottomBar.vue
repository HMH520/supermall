<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="all-check"
        @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{titlePrice}}
    </div>

    <div class="calculate">
      结算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkbutton/CheckButton";

import {mapGetters} from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),

    titlePrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0)
    },

    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },

    isSelectAll() {
      if (this.cartList.length === 0) return false

      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      }else {
        this.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
 .bottom-bar {
   display: flex;
   position: absolute;
   bottom: 49px;
   left: 0;
   right: 0;
   padding-left: 10px;

   height: 40px;
   line-height: 40px;

   background-color: #eee;
   border-top: 1px solid #aaa;
 }

 .check-content {
   display: flex;
   align-items: center;
   width: 60px;
 }

 .check-content span {
   padding-left: 5px;
 }

 .all-check {
   width: 20px;
   height: 20px;
   line-height: 20px;
 }

 .price {
   margin-left: 20px;
   flex: 1;
 }

 .calculate {
   width: 90px;
   color: #fff;
   font-size: 14px;
   text-align: center;
   border-radius: 5px;
   background: #f46b45;  /* fallback for old browsers */
   background: -webkit-linear-gradient(to right, #eea849, #f46b45);  /* Chrome 10-25, Safari 5.1-6 */
   background: linear-gradient(to right, #eea849, #f46b45); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
 }
</style>
