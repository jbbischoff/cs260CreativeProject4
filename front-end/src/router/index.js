import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Expenses from '../views/Expenses.vue'
import Income from '../views/Income.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expenses
  },
  {
    path: '/income',
    name: 'Income',
    component: Income
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
