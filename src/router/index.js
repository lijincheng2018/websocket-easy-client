import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../views/index'

Vue.use(Router)

export default new Router({
    routes:[
        {
            path:'/',
            name:'Dashboard',
            component:Dashboard,
            meta: {
                title: 'WebSocket Easy Client',
            }
        },
        {
            path:'/index',
            name:'Dashboard',
            component:Dashboard,
            meta: {
                title: 'WebSocket Easy Client',
            }
        }
    ]
})