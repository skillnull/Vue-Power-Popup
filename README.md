<p align="center">
  <a href="http://www.skillnull.com"><img src="http://skillnull.com/others/images/brand/MIT.svg" alt="License MIT"></a>
</p>

> 版本信息 

| Integration | Version |
| :--- | :--- |
| vue | 2 |
| vue-router | ^3.0.1 |
| vuex           | ^3.0.1 |
| vue-cli        | vue-cli-3 |
| axios           | ^0.18.0 |
| socket.io-client | ^2.1.1 |
| vue-material | ^1.0.0-beta-10.2 |

> 使用配置

```javascript
// 打开弹窗
this.$popup({
     wrapStyle: 'min-height: 400px', // 弹窗最外层样式, 非必传
     closeBtn: true, // 是否显示关闭按钮, 默认显示, 为false或非布尔类型的值则不显示
     titleType: 'render', // 值为render表示是函数式组件, 不传或值为其他则为文本
     title: '标题', // 不传这个属性则不显示标题, 支持空字符串
     headerStyle: 'padding: 5px; font-size: 14px; border: none;', // 标题样式, border属性可去除title底部的分割线
     contentType: 'component', // 若传这个属性，属性值为component则表示content传递的是组件，值为render表示是函数式组件，否则是文本
     content: 'views/edit/backgroundMusic/chooseBackgroundMusic.vue', // 文本或组件地址或函数式组件
     contentStyle: 'text-align:center;padding:40px 0;', // 内容样式
     reciveChildSendMSG: (callBack) => {
         // 这里是子组件传递回来的数据： callBack()
     },
     parentToChildMSG: '', // 父组件传递给子组件的数据
     buttonFlag: true, // 是否显示按钮组, 不显示则下面的 'buttonArr' 不用传
     bottomStyle: 'border: none', // 底部样式, border属性可去除title底部的分割线
     buttonArr: [{
         text: '确定', // 按钮文字
         type: 'btnDefault', // 默认按钮样式,非必传
         btnStyle: 'background-color: #cccccc;color:white;', // 自定义按钮样式,非必传
         btnFunction: (callBack) => {
             callBack({
                 flag: true, // 是否关闭弹窗, 默认关闭，不传或传false则关闭，传true则不关闭
                 callFunction: () => {
                     // 这里是点击按钮需要执行的方法
                 }
             })
         }
     }]
})

// 关闭弹窗
this.$popup().close()

/*
 * 子组件接收父组件传递的数据
 * type根据实际情况更改
 */
props: {
    parentToChildMSG: {
        type: String,
        default: () => {
            return ''
        }
    }
}

// 子组件向父组件传递数据
    this.$emit('childToParentMSG', 'Hi')
```
