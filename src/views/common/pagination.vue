<template>
    <div class="paginationWrap">
        <div class="total">共{{pageTotal}}页，{{total}}条</div>
        <nav class="pagination">
            <ul>
                <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(current - 1)"> < </a></li>
                <li :class="{'disabled': current == 1}" v-if="showFirstPageFlag">
                    <a href="javascript:;" @click="setCurrent(1)"> 首页 </a>
                </li>
                <li v-for="item in grouplist" :class="{'active': current == item.val}">
                    <a href="javascript:;" @click="setCurrent(item.val)"> {{item.text}} </a>
                </li>
                <li :class="{'disabled': current == pageTotal}" v-if="showLastPageFlag">
                    <a href="javascript:;" @click="setCurrent(pageTotal)"> 尾页 </a>
                </li>
                <li :class="{'disabled': current == pageTotal}"><a href="javascript:;" @click="setCurrent(current + 1)"> > </a></li>
            </ul>
            <div v-if="showGoInputFlag">
                <input class="goPageInput" v-model="goPageInputNum" onkeyup="this.value = this.value.replace(/[^0-9]/g,'')">
                <button class="goPageButton" @click="goPage">GO</button>
            </div>
        </nav>
        <div class="pageSizeBox" v-if="showPageSizeListFlag">
            <div class="pageSize" @click="togglePageSizeList" v-clickOutSide="hidePageSizeList">
                {{pageSizeLocal}}条/页 <i class="fa fa-caret-down"></i>
            </div>
            <div class="pageSizeList" v-if="pageSizeListFlag">
                <ul>
                    <li v-for="(item,index) in pageSizeList" :class="{'pageSizeActive': index === pageSizeActiveIndex}"
                        @click="changePageSize(item,index)">{{item}}条/页
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { clickOutSide } from '../../library/directives'

export default {
    data () {
        return {
            pageSizeListFlag: false, // 每页显示条数列表显隐变量
            pageSizeActiveIndex: this.pageSizeList.length - 1, // 每页显示条数列表默认选中条目
            pageSizeLocal: this.pageSize, // 每页显示条数
            current: this.currentPage, // 当前页
            goPageInputNum: '' // 跳转到第几页
        }
    },
    props: {
        total: { // 总条数
            type: Number,
            default: 0
        },
        pageSizeList: { // 每页显示条数列表
            type: Array,
            default: function () {
                return [10, 20, 30, 50].reverse()
            }
        },
        showPageSizeListFlag: { // 是否显示每页显示条数列表
            type: Boolean,
            default: true
        },
        pageSize: { // 每页显示条数
            type: Number,
            default: 10
        },
        currentPage: { // 当前页码
            type: Number,
            default: 1
        },
        howManyPages: { // 当前分页组件显示几个页码
            type: Number,
            default: 3
        },
        showGoInputFlag: { // 是否显示输入跳转
            type: Boolean,
            default: true
        },
        showFirstPageFlag: { // 是否显示首页按钮
            type: Boolean,
            default: true
        },
        showLastPageFlag: { // 是否尾页首页按钮
            type: Boolean,
            default: true
        }
    },
    directives: {clickOutSide},
    computed: {
        ...mapGetters(['']),
        pageTotal () { // 总页数
            return Math.ceil(this.total / this.pageSizeLocal);
        },
        grouplist () {
            return this.calculate();
        }
    },
    mounted () {
    },
    watch: {
        currentPage: {
            deep: true,
            handler (v, ov) {
                this.current = v;
            }
        },
        pageSize: {
            deep: true,
            handler (v, ov) {
                this.pageSizeLocal = v;
                if (this.pageSizeList.indexOf(v) > -1) {
                    this.pageSizeActiveIndex = this.pageSizeList.indexOf(v)
                }
            }
        }
    },
    methods: {
        calculate () { // 计算当前页码显示情况
            let temp = []; // 临时数组
            let resultList = []; // 最终结果返回数组
            let halfHowManyPages = Math.floor(this.howManyPages / 2); // 当前分页组件显示几个页码除以2 取整
            let TOTALPAGE = this.pageTotal; // 总页数
            let CURRENT = this.current; // 当前页
            if (TOTALPAGE < this.howManyPages) { // 如果当页数小于等于每页显示的页码个数
                for (let i = 1; i < this.howManyPages; i++) {
                    if (i <= TOTALPAGE) {
                        temp.push({text: i, val: i});
                    }
                }
                return temp;
            } else {
                while (TOTALPAGE--) {
                    temp.push(this.pageTotal - TOTALPAGE);
                }
            }
            let index = temp.indexOf(CURRENT);
            if (index < halfHowManyPages) {
                CURRENT = CURRENT + halfHowManyPages - index;
            }
            if (this.current > this.pageTotal - halfHowManyPages) {
                CURRENT = this.pageTotal - halfHowManyPages;
            }
            temp = temp.splice(CURRENT - halfHowManyPages - 1, this.howManyPages);
            do {
                var t = temp.shift();
                resultList.push({
                    text: t,
                    val: t
                });
            } while (temp.length > 0);
            if (this.pageTotal > this.howManyPages) {
                if (this.current > halfHowManyPages + 1) {
                    resultList.unshift({text: '...', val: resultList[0].val - 1});
                }
                if (this.current < this.pageTotal - halfHowManyPages) {
                    resultList.push({text: '...', val: resultList[resultList.length - 1].val + 1});
                }
            }
            return resultList;
        },
        setCurrent: function (index) { // 当前页码
            if (this.current != index && index > 0 && index < this.pageTotal + 1) {
                this.current = index;
                this.$emit('pagechange', {current: this.current, pageSize: this.pageSizeLocal});
            }
        },
        changePageSize (item, index) { // 改变每页显示条数
            this.pageSizeLocal = item;
            this.pageSizeActiveIndex = index;
            this.current = 1;
            this.$emit('pagechange', {current: this.current, pageSize: this.pageSizeLocal});
        },
        togglePageSizeList () { // 每页条数列表显隐
            this.pageSizeListFlag = !this.pageSizeListFlag;
        },
        hidePageSizeList () { // 隐藏每页显示条数列表
            this.pageSizeListFlag = false;
        },
        goPage () { // 跳转到第几页
            this.goPageInputNum = this.goPageInputNum.replace(/[^0-9]/g, '');
            if (this.goPageInputNum == '') return;
            if (this.goPageInputNum > this.pageTotal) {
                this.goPageInputNum = this.pageTotal;
                this.current = this.pageTotal;
            } else {
                this.current = parseInt(this.goPageInputNum);
                this.goPageInputNum = this.current;
            }
            this.$emit('pagechange', {current: this.current, pageSize: this.pageSizeLocal});
        }
    }
}
</script>
<style lang="less" scoped>
    .paginationWrap {
        display: flex;
        flex: 1;
        margin: 0;
        background-color: transparent;

        .total {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            align-items: center;
            padding-left: 10px;
        }

        .pagination {
            display: flex;
            flex: 3;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin: 0 auto;
            min-height: 50px;

            .goPageInput {
                width: 50px;
                height: 25px;
                margin: 0 5px;
                text-align: center;
                border-radius: 3px;
                border: solid 1px #cccccc;
            }

            ul {
                list-style: none;

                li {
                    float: left;
                    height: 25px;
                    border-radius: 3px;
                    margin: 3px;
                    border: solid 1px #ccc;
                    color: #666;

                    &:hover {
                        background-color: #ffffff;
                        border: solid 1px #00acc1;
                    }

                    &.active {
                        border: solid 1px #00acc1;
                        background-color: #00acc1;

                        &:hover {
                            border: solid 1px #00acc1;
                            background-color: #00acc1;
                        }

                        a {
                            color: #ffffff;

                            &:hover {
                                color: #ffffff;
                            }
                        }
                    }

                    &.disabled {
                        &:hover {
                            border: solid 1px #ccc;
                            background-color: inherit;
                        }

                        a {
                            &:hover {
                                color: #000;
                                cursor: default;
                            }
                        }
                    }

                    a {
                        display: block;
                        min-width: 30px;
                        height: 25px;
                        text-align: center;
                        line-height: 25px;
                        font-size: 12px;
                        text-decoration: none;
                        color: #000;
                        padding: 0px 4px;
                        max-width: 100px;
                        overflow: hidden;
                        text-overflow: ellipsis;

                        &:hover {
                            color: #00acc1;
                        }
                    }
                }
            }
        }

        .goPageButton {
            width: 40px;
            height: 25px;
            margin: 0 5px;
            padding: 0;
            border-radius: 3px;
            border: solid 1px #00acc1;
            background-color: #00acc1;
            color: white;
        }

        .pageSizeBox {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            min-height: 50px;
            padding-right: 10px;

            .pageSize {
                border: 1px solid #ababab;
                padding: 0px 5px;
                height: 25px;
                border-radius: 3px;
                vertical-align: middle;
                line-height: 25px;
                cursor: pointer;

                &:hover {
                    color: #00acc1;
                    border: solid 1px #00acc1;
                }
            }

            .pageSizeList {
                position: absolute;
                z-index: 9;
                bottom: 55px;
                width: 94px;
                text-align: center;
                background-color: white;
                border-radius: 3px;
                border: 1px solid #d1dbe5;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

                ul {
                    padding: 4px 0;

                    li {
                        cursor: pointer;
                        padding: 6px 0;

                        &:hover {
                            background-color: rgb(0, 129, 145);
                            color: #FFFFFF;
                        }

                        &.pageSizeActive {
                            background-color: #00acc1;
                            color: #FFFFFF;
                        }
                    }
                }
            }
        }
    }
</style>
