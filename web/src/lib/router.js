import Vue from 'vue'
import router from '@clapjs/vue-core/lib/router'
import NProgress from 'nprogress'

router.beforeEach( (to, from, next) => {
    NProgress.start();
    const  whitelist=['login','register']
    const hasLoginUser= !(Vue.prototype.$cookies?Vue.$cookies.get('LOGIN_USER'):Vue.ls.get('LOGIN_USER', undefined))
    const hasAccessToken= !(Vue.prototype.$cookies?Vue.$cookies.get('ACCESS_TOKEN'):Vue.ls.get('ACCESS_TOKEN', undefined))
    if((hasLoginUser||hasAccessToken)&&whitelist.indexOf(to.name)<0){
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
