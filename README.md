# 更新日志

<details>
  <summary>展开伸缩</summary>
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

此项目基于GPL开源，仅用于技术学习交流，不做商用，禁止用于违法行为



**平台差异说明**

| App  |  H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 字节跳动小程序 |
| :--: | :--: | :--------: | :----------: | :--------: | :------------: |
|  √   |  √   |     √      |      x       |     x      |       x        |



# 如何使用

此APP需搭配websocket端使用

GitHub：[https://github.com/wzJun1/uni-nvue-chat-websocket](https://github.com/wzJun1/uni-nvue-chat-websocket)



1. 搭建完成后在本页面或GitHub下载项目源码，导入HbuilderX
2. 在store/user.js中修改websocket地址为你搭建好的地址
3. 绑定项目云空间，默认腾讯云，如需阿里云需要将 `cloudfunctions-tcb` 改成 `cloudfunctions-aliyun` 
4. 如默认腾讯云，则需初始化数据库，右键  `db_init.json` 初始化
5. 上传云函数及公共函数
6. 编译使用



# 交流群

QQ群：1029339929



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

