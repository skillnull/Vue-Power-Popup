<template>
    <div class="flex-center home-page-box">
        <button @click="openPopup('text')">传递文本</button>
        <button @click="openPopup('render')">传递函数式组件</button>
        <button @click="openPopup('component')">传递组件</button>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    methods: {
        openPopup (type) {
            let content = ''
            let contentType = ''
            switch (type) {
                case 'text':
                    content = `content='文本内容' contentType=''`
                    contentType = ''
                    break
                case 'render':
                    content = {
                        render: (h) => {
                            return h('div', [
                                h('div', ` content = {
                                    render: (h) => {
                                        return h('div', [
                                            '函数渲染'
                                        ])
                                    }
                                }`),
                                h('div', `contentType = 'render'`)
                            ])
                        }
                    }
                    contentType = 'render'
                    break
                case 'component':
                    content = 'views/homePage/testComponent.vue'
                    contentType = 'component'
                    break
            }
            this.$popup({
                wrapStyle: 'min-height: 400px', // 弹窗最外层样式, 非必传
                closeBtn: true, // 是否显示关闭按钮, 默认显示, 为false或非布尔类型的值则不显示
                titleType: '', // 值为render表示是函数式组件, 不传或值为其他则为文本
                title: '标题', // 不传这个属性则不显示标题, 支持空字符串
                headerStyle: 'padding: 5px; font-size: 14px; border: none;height:40px;', // 标题样式, border属性可去除title底部的分割线
                contentType: contentType, // 若传这个属性，属性值为component则表示content传递的是组件，值为render表示是函数式组件，否则是文本
                content: content, // 文本或组件地址或函数式组件
                contentStyle: 'text-align:center;padding:40px 0;', // 内容样式
                reciveChildSendMSG: (callBack) => {
                    // 这里是子组件传递回来的数据： callBack()
                },
                parentToChildMSG: '', // 父组件传递给子组件的数据
                buttonFlag: true, // 是否显示按钮组, 不显示则下面的 'buttonArr' 不用传
                bottomStyle: 'border: none;position:absolute;bottom:0;width: 100%;padding:0;margin-bottom:30px;', // 底部样式, border属性可去除title底部的分割线
                buttonArr: [{
                    text: '确定', // 按钮文字
                    type: 'btnDefault', // 默认按钮样式,非必传
                    btnStyle: 'background-color: green;color:white;', // 自定义按钮样式,非必传
                    btnFunction: (callBack) => {
                        callBack({
                            flag: false, // 是否关闭弹窗, 默认关闭，不传或传false则关闭，传true则不关闭
                            callFunction: () => {
                                // 这里是点击按钮需要执行的方法
                            }
                        })
                    }
                }]
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .home-page-box {
        height: 100vh;

        button {
            cursor: pointer;
            padding: 5px 10px;
            background-color: green;
            outline: none;
            color: #fff;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
        }
    }
</style>
