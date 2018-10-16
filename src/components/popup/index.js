import Vue from 'vue'
import popup from './popup.vue'

let PopupConstructor = Vue.extend(popup)
let instance
export default {
    install (Vue) {
        Vue.prototype.$popup = (data) => {
            if (data) {
                (() => {
                    instance = new PopupConstructor({
                        el: document.createElement('div'),
                        propsData: {reciveData: data || {}}
                    })
                    document.body.appendChild((instance.$el))
                })()
            } else {
                if (instance) { // 全局方法
                    return {
                        close: instance.close
                    }
                } else {
                    return false
                }
            }
        }
    }
}
