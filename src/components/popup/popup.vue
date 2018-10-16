<template>
    <div class="popupBox" v-if="popFlag">
        <div class="popupContent" :style="reciveData.wrapStyle">
            <div class="title" v-if="reciveData.title === '' || reciveData.title || closeBtn" :style="reciveData.headerStyle">
                <span class="titleText" v-if="reciveData.title">
                    <template v-if="reciveData.titleType === 'render'">
                        <RenderComponents :render="reciveRender" :dataDelive="reciveData.title"></RenderComponents>
                    </template>
                    <template v-else>{{reciveData.title}}</template>
                </span>
                <span class="close" v-if="closeBtn">
                    <span @click="close">X</span>
                </span>
            </div>
            <template>
                <!-- START 动态组件 -->
                <div class="content" v-if="reciveData.contentType && reciveData.contentType === 'component'" :style="reciveData.contentStyle">
                    <component :is="dynamicComponent"
                               :parentToChildMSG="reciveData.parentToChildMSG ? reciveData.parentToChildMSG : ''"
                               @childToParentMSG="sendToParentMSG">
                    </component>
                </div>
                <!-- END 动态组件 -->
                <!-- START 动态渲染函数式组件 -->
                <div class="content" v-else-if="reciveData.contentType && reciveData.contentType === 'render'"
                     :style="reciveData.contentStyle">
                    <RenderComponents :render="reciveRender" :dataDelive="reciveData.content"></RenderComponents>
                </div>
                <!-- END 动态渲染函数式组件 -->
                <!-- START 文本内容 -->
                <div class="content" v-else :style="reciveData.contentStyle">
                    {{reciveData.content}}
                </div>
                <!-- END 文本内容 -->
            </template>
            <div class="bottomBtn" v-if="reciveData.buttonFlag" :style="reciveData.bottomStyle">
                <ul>
                    <li :key="index" v-for="(item,index) in reciveData.buttonArr ? reciveData.buttonArr : ''">
                        <button :class="item.type ? item.type : 'btnDefault'" @click="btnFun(item.btnFunction)" :Style="item.btnStyle">
                            {{item.text}}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import RenderComponents from './renderComponents.js'

export default {
    name: 'popup',
    data () {
        return {
            popFlag: true, // 控制弹窗显隐
            closeBtn: true // 关闭按钮
        }
    },
    props: {
        reciveData: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        }
    },
    components: {
        RenderComponents
    },
    computed: {
        dynamicComponent () { // 动态组件
            // return () => import(`@/${this.reciveData.content}`)
        },
        reciveRender () { // 函数式组件
            let render = (h, ctx) => {
                return (() => {
                    return h(ctx.props.dataDelive)
                })()
            }
            return render
        }
    },
    watch: {
        reciveData: {
            deep: true,
            handler (v, ov) {
                if (!v) return
                this.closeBtnShowOrNot(v.closeBtn)
            }
        }
    },
    methods: {
        closeBtnShowOrNot (param) { // 默认显示关闭按钮，为false或非布尔值则不显示
            if (param === undefined) {
                this.closeBtn = true
            } else {
                param === true ? this.closeBtn = true : this.closeBtn = false
            }
        },
        btnFun (btnFunction) { // 按钮组事件
            btnFunction((result) => {
                if (result.flag) {
                    this.popFlag = result.flag
                } else {
                    this.popFlag = false
                }
                result.callFunction ? result.callFunction() : ''
            })
        },
        sendToParentMSG (data) { // 弹窗中引用的子组件向弹窗发送的数据
            this.reciveData.reciveChildSendMSG(() => {
                return data
            })
        },
        close () { // 关闭弹窗
            this.popFlag = false
        }
    },
    mounted () {
        this.closeBtnShowOrNot(this.reciveData.closeBtn)
    }
}
</script>
<style lang="scss" scoped>
    .popupBox {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        z-index: 999999;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .6);
        .popupContent {
            position: relative;
            background-color: white;
            border-radius: 6px;
            min-width: 400px;
            max-height: 95%;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0, 0, 0, .6);
            .title {
                border-bottom: 1px solid #e9eaec;
                text-align: center;
                display: flex;
                flex: 1;
                font-size: 16px;
                padding: 5px 0;
                .titleText {
                    padding: 0 15px;
                    display: flex;
                    flex: 3;
                    justify-content: flex-start;
                    align-items: center;
                    font-weight: bold;
                }
                .close {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;
                    align-items: flex-start;
                    margin-top: -10px;
                    span {
                        cursor: pointer;
                        font-size: 14px;
                        height: 40px;
                        width: 40px;
                        text-align: center;
                        line-height: 20px;
                        overflow: hidden;
                        color: #999;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        &:hover {
                            color: #CF6B57;
                        }
                    }
                }
            }
            .content {
                line-height: 1.5;
                font-size: 14px;
            }
            .bottomBtn {
                border-top: 1px solid #e9eaec;
                padding: 15px;
                ul {
                    display: flex;
                    flex: 1;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                    li {
                        display: flex;
                        padding: 0 5px;
                        .btnDefault {
                            background-color: transparent;
                            border: solid 1px #D9D9D7;
                            color: #D9D9D7;
                            padding: 6px 15px 7px;
                            font-size: 14px;
                            border-radius: 4px;
                            cursor: pointer;
                            outline: none;
                            transition: all .5s ease-in-out;
                            &:hover {
                                color: darken(#D9D9D7, 10%);
                                border: solid 1px darken(#D9D9D7, 10%);
                                background-color: transparent;
                            }
                            &:focus, &:active {
                                border: solid 1px darken(#D9D9D7, 20%);
                                color: darken(#D9D9D7, 20%);
                                background-color: transparent;
                                outline: none;
                                box-shadow: none;
                            }
                            &[disabled], &[disabled]:hover {
                                border: solid 1px #C9C9CA;
                                background: #C9C9CA;
                                color: #acacac;
                            }
                        }
                        .btnPrimary {
                            border: solid 1px rgb(220, 100, 80);
                            background: linear-gradient(0deg, rgb(178, 18, 18) 1%, rgb(199, 59, 49) 46%, rgb(220, 100, 80) 100%);
                            padding: 6px 15px 7px;
                            font-size: 14px;
                            border-radius: 4px;
                            color: white;
                            cursor: pointer;
                            outline: none;
                            &:hover {
                                border: solid 1px rgb(220, 100, 80);
                                background: linear-gradient(0deg, #D47B68 0%, #C1564A 46%, #B0312A 100%);
                            }
                            &:focus, &:active {
                                border: solid 1px rgb(166, 44, 44);
                                background: linear-gradient(0deg, #BD614F, #AB4237 46%, #98241D 100%);
                                box-shadow: inset 0px 0px 3.66px 2.34px rgba(55, 1, 1, 0.08);
                                outline: none;
                            }
                            &[disabled], &[disabled]:hover {
                                border: solid 1px #C6C6C6;
                                background: #C6C6C6;
                                color: #acacac;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
