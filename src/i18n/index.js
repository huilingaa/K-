// 多语言化插件
import Vue from "vue";
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
    silentTranslationWarn: true,
    locale: localStorage.getItem('language') || 'en',
    messages:{
        'cn':Object.assign(require("./cn.json")),
        'en':Object.assign(require("./en.json"))
    }
});

export default i18n;
