import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import AboutMe from '@/components/AboutMe.vue'
import AboutSite from '@/components/AboutSite.vue'
import Log from '@/components/Log.vue'
import Friends from '@/components/Friends.vue'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/', component: Home},
        {path:'/about-me', component: AboutMe},
        {path:'/about-site', component: AboutSite},
        {path:'/log', component: Log},
        {path:'/friends', component: Friends},
    ]
})

export default router