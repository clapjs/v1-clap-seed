import Vue from 'vue'
import config from '@/config/config.default'
import store from '@/lib/store'

export default function Initializer() {
    store.dispatch('ToggleLayout', Vue.ls.get('LAYOUT', config.layout))
    store.dispatch('ToggleTheme', Vue.ls.get('THEME', config.theme))
    store.dispatch('ToggleLang', Vue.ls.get('LANG', config.lang))
    store.dispatch('ToggleMultiTab', Vue.ls.get('MULTI_TAB', config.multiTab))

    const session=process.env.IS_ELECTRON?Vue.ls:Vue.$cookies;

    if(session.get('ACCESS_TOKEN')!==null){
        const applications=Vue.ls.get('APPLICATIONS', []);
        store.dispatch('ToggleApplications', applications);
        const menu=Vue.ls.get('MENU', {key: 'dash', title: '首页', routeName: 'dash', controlType: 'Group', idOrgan: '', organs: [], closable: false})
        const application=menu.idApplication?menu.idApplication:(applications[0]?applications[0]._id:'');
        store.dispatch('ToggleApplication', application);
        store.dispatch('ToggleMenu', menu);
        store.commit('SET_TOKEN', session.get('ACCESS_TOKEN'))
        store.commit('SET_USER', session.get('LOGIN_USER'))
        store.commit('SET_GROUP', session.get('LOGIN_GROUP'))
        store.commit('SET_ORGAN', session.get('LOGIN_ORGAN'))
    }
}

