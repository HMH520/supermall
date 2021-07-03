import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const Home = () => import('@/views/home/Home')
const Cate = () => import('@/views/cate/Cate')
const Cart = () => import('@/views/cart/Cart')
const Profile = () => import('@/views/profile/Profile')
const Detail = () => import('@/views/detail/Detail')

const routes = [
  {
    path:'',
    redirect:'/home'
  },
  {
    path: '/home',
    component:Home
  },
  {
    path: '/cate',
    component:Cate
  },
  {
    path: '/cart',
    component:Cart
  },
  {
    path: '/profile',
    component:Profile
  },
  {
    path: '/detail/:iid',
    component:Detail
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
