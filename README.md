# 前言

此项目基于GPL开源，仅用于技术学习交流，不做商用，禁止用于违法行为



**平台差异说明**

| App  |  H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 字节跳动小程序 |
| :--: | :--: | :--------: | :----------: | :--------: | :------------: |
|  √   |  x   |     x      |      x       |     x      |       x        |



# 如何使用

此APP需搭配websocket端使用

GitHub：[https://github.com/wzJun1/uni-nvue-chat-websocket](https://github.com/wzJun1/uni-nvue-chat-websocket)



1. 搭建完成后在本页面或GitHub下载项目源码，导入HbuilderX
2. 在store/user.js中修改websocket地址为你搭建好的地址
3. 绑定项目云空间，默认腾讯云，如需阿里云需要将 `cloudfunctions-tcb` 改成 `cloudfunctions-aliyun` 
4. 如默认腾讯云，则需初始化数据库，右键  `db_init.json` 初始化
5. 上传云函数及公共函数
6. 编译使用



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

还包括官方的组件等等。


