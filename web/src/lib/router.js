import Vue from 'vue'
import router from '@clapjs/vue-core/lib/router'
import NProgress from 'nprogress'

router.addRoute({path: '/login', name: 'login', component: () => import('@/views/login')})

router.beforeEach( (to, from, next) => {
    NProgress.start();
    const checkLogin=()=>{
        return (Vue.prototype.$global.platform==='web'?Vue.$cookies:Vue.ls).get('ACCESS_TOKEN')!==null
    }
    if(!checkLogin()&&['login','register'].indexOf(to.name)<0){
        router.replace({name: 'login'})
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});

router.onReady( () => {

});

export default router
