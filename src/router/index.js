import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const page404 = () => import('components/common/page404')
const main = () => import('views/main/insightMain')
const incidentMangement = () => import('views/incidentManagement/incidentManagementMain')


const routes = [
  {
    path: '/',
    name: 'index',
    component: main,
    children: [
      {
        path: 'incident-management',
        name: 'incidentManagement',
        components: {
          'incidents': incidentMangement
        },
        meta: {
          requireAuth: true,
          title: 'insight-事件总览'
        }
      }
    ],
    meta: {
      requireAuth: true,
      title: 'insight-让我来管理您的智能监控'
    }
  },
  {
    path: '*',
    name: 'page404',
    components: {
      'page404': page404
    },
    meta: {
      requireAuth: false,
      title: '您来到了一片未知区域...'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
