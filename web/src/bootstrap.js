import Vue from 'vue'
import config from '@/config/config.default'
import store from '@/lib/store'

export default function Initializer() {
    store.dispatch('ToggleLayout', Vue.ls.get('LAYOUT', config.layout))
    store.dispatch('ToggleTheme', Vue.ls.get('THEME', config.theme))
    store.dispatch('ToggleLang', Vue.ls.get('LANG', config.lang))
    store.dispatch('ToggleMultiTab', Vue.ls.get('MULTI_TAB', config.multiTab))

    const applications=Vue.ls.get('APPLICATIONS', []);
    store.dispatch('ToggleApplications', applications);
    const menu=Vue.ls.get('MENU', {key: 'dash', title: '首页', routeName: 'dash', controlType: 'Group', idOrgan: '', organs: [], closable: false})
    store.dispatch('ToggleMenu', menu);
    const application=menu.idApplication?menu.idApplication:(applications[0]?applications[0]._id:undefined);
    store.dispatch('ToggleApplication', application);

    if (Vue.prototype.$electron) {
        store.commit('SET_TOKEN', Vue.ls.get('ACCESS_TOKEN', undefined))
        store.commit('SET_USER', Vue.ls.get('LOGIN_USER', undefined))
        store.commit('SET_GROUP', Vue.ls.get('LOGIN_GROUP', undefined))
        store.commit('SET_ORGAN', Vue.ls.get('LOGIN_ORGAN', undefined))
    }

    if (Vue.prototype.$cookies) {
        store.commit('SET_TOKEN', Vue.$cookies.get('ACCESS_TOKEN'))
        store.commit('SET_USER', Vue.$cookies.get('LOGIN_USER'))
        store.commit('SET_GROUP', Vue.$cookies.get('LOGIN_GROUP'))
        store.commit('SET_ORGAN', Vue.$cookies.get('LOGIN_ORGAN'))
    }
}

