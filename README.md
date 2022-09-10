<p></p>
<p></p>
<br/>
<br/>
<br/>
<p align="center">
    <a target="_blank" href="https://gitee.com/wzJun1/uni-nvue-chat/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-GPL3.0-blue" />
    </a>  
   <a target="_blank" href='https://gitee.com/wzJun1/uni-nvue-chat'>
        <img src="https://gitee.com/wzJun1/uni-nvue-chat/badge/star.svg?theme=dark" alt="gitee stars"/>
   </a>
   <a target="_blank" href='https://gitee.com/wzJun1/uni-nvue-chat'>
        <img src="https://gitee.com/wzJun1/uni-nvue-chat/badge/fork.svg?theme=dark" alt="gitee fork"/>
   </a> 
</p>
<br/>

# 更新日志

<details>
  <summary>展开伸缩</summary>
<h2>1.1.1（2021-11-19）</h2>
<ol>
<li>修复部分已知bug</li>
<li>新版本IM预告,超多变现: </li>
<li>1: 增值VIP,等级制,朋友圈,H5游戏付费.</li>
<li>2: 等级制,朋友圈,H5游戏付费.</li>
<li>3: 朋友圈,H5游戏付费.</li>
<li>4: H5游戏付费.</li>
<li>5: 小视频.</li>
<li>更好的体验: 音视频通话,多界面使用Android iOS原生代码重写,非vue nvue</li>
</ol>
<h2>1.1.0（2020-11-22）</h2>
<ol>
<li>修复部分已知bug</li>
</ol>
<h2>1.0.9（2020-10-15）</h2>
<ol>
<li>修复Android下切换tabbar后搜索框自动聚焦问题</li>
<li>修复部分安卓机无法发起消</li>
<li>修复好友列表为空时的异常</li>
</ol>
<h2>1.0.8（2020-09-18）</h2>
<ol>
<li>替换为 5+ API</li>
<li>修复群组异常</li>
</ol>
<h2>1.0.7（2020-09-11）</h2>
<ol>
<li>初步支持H5 （2020.9.11）</li>
<li>优化小程序使用</li>
<li>修复部分已知BUG</li>
</ol>
<h2>1.0.6（2020-08-30）</h2>
<ol>
<li>初步支持微信小程序 （2020.8.30）</li>
<li>修复部分已知BUG</li>
</ol>
<h2>1.0.5（2020-08-28）</h2>
<ol>
<li>
<p>修复群组删除逻辑异常 webSocket端已更新 <a href="https://github.com/wzJun1/uni-nvue-chat-websocket">webSocket</a></p>
</li>
<li>
<p>优化其他小问题</p>
</li>
</ol>
<h2>1.0.3（2020-08-23）</h2>
<ol>
<li>修复聊天记录闪烁和上拉加载历史记录</li>
<li>修复Android加载动画</li>
<li>修改群组会话逻辑</li>
<li>新增群组信息修改</li>
<li>新增上线检测，webSocket端已更新  <a href="https://github.com/wzJun1/uni-nvue-chat-websocket">webSocket</a></li>
<li>优化代码</li>
</ol>
<h2>1.0.2（2020-08-21）</h2>
<ol>
<li>增加好友删除功能</li>
<li>修复发送图片不显示</li>
</ol>
<h2>1.0.1（2020-08-21）</h2>
<ol>
<li>修改好友逻辑</li>
<li>新增备注</li>
<li>修复Android搜索动画</li>
</ol>
</details>




# 前言

此项目基于 `GPL 3.0` 开源，仅用于技术学习交流，`禁止商用，禁止用于违法行为`，`如作它用所承受的法律责任一概与作者无关`


**平台差异说明**

| App  |  H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 字节跳动小程序 |
| :--: | :--: | :--------: | :----------: | :--------: | :------------: |
|  √   |  √   |     √      |      x       |     x      |       x        |



# 如何使用
> 克隆本项目到本地 国内地址：https://gitee.com/wzJun1/uni-nvue-chat
> 此APP需搭配WebSocket端使用
> WebSocket端 Github：[https://github.com/wzJun1/uni-nvue-chat-websocket](https://github.com/wzJun1/uni-nvue-chat-websocket)


----------
> **1. 下载上方WebSocket端源码**
>
>**2. 在服务器上运行WebSocket端，运行方法在Github有说明，也可以百度查一下workerman的启动运行方式，运行成功后再看下一步 (注意防火墙问题)**
>
>**3. 运行后得到socket地址，例如：你的ip:端口 [123.123.123.123:6621]**
>
>**4. 下载本项目，导入HbuilderX，在store/user.js中修改WebSocket地址为你搭建好的地址**
>
>**5. 绑定本项目的UniCloud云空间，如没有请按上面方法新建后绑定，本默认腾讯云空间，如需阿里云需要将文件夹名称 cloudfunctions-tcb 改成 cloudfunctions-aliyun**
>
>**6. 初始化UniCloud数据库，右键 db_init.json 初始化**
>
>**7. 上传云函数及公共函数**
>
>**8. 编译使用**


# 微信交流群(2022-09-17日前扫码有效)

<img src="https://s1.ax1x.com/2022/09/10/vLT56A.jpg" width = "300" height = "430" />

## 如果过期了可以加我微信进群: Sentinel-110

## 程序开发接单中...原生 Android iOS App，中后台开发、移动端H5、小程序开发，可开公司发票

<img src="https://i.loli.net/2021/12/02/HgvQcBVUIAh8JbY.jpg" width = "200" height = "200" />



# 截图

![](https://i.loli.net/2020/08/23/kJgoD3UlOC7FYMN.jpg)

![](https://i.loli.net/2020/08/23/eCzI21TkHcp3XYG.jpg)



 

# 借鉴了一部分好的项目，感谢作者

包括但不限于

https://github.com/wakaryry/mypUI  作者：[wakary](https://github.com/wakaryry)

https://ext.dcloud.net.cn/plugin?id=2198 作者： [粉调](https://ext.dcloud.net.cn/publisher?id=191675)

https://ext.dcloud.net.cn/plugin?id=1383 作者： [479634319@qq.com](https://ext.dcloud.net.cn/publisher?id=249495)

https://ext.dcloud.net.cn/plugin?id=5 作者： [mmt](https://ext.dcloud.net.cn/publisher?id=73507)

https://ext.dcloud.net.cn/plugin?id=2116 作者： [DCloud](https://ext.dcloud.net.cn/publisher?id=93)

.....

还包括UniApp官方的组件等等。

