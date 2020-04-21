import Vue from 'vue';
import vueRouter from 'vue-router';

Vue.use(vueRouter);

import KLine from './pages/index.vue';

const router = new vueRouter({
    routes:[
        {path:'/',component:KLine}
    ]
})

export default router;