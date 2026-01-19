import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'
import Log from '@/components/Log.vue'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/', component: Home},
        {path:'/about', component: About},
        {path:'/log', component: Log},
    ]
})

export default router