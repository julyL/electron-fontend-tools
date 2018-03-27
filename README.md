### electron-fontend-tools
    用electron做的一个小应用,内置各种小工具.

#### 本地执行和打包
```
 // 本地运行
 npm install
 npm run start

 // 本地打包
 npm install electron-packager -g
 npm run package:win64   // 打包成win64系统
```

#### 相关说明

 * 图片压缩功能是在[web版picdiet](https://www.picdiet.com/zh-cn)的实现基础上做了改动。操作体验上更好,支持离线使用！

 * 生成二维码,格式化JSON,字符串编码功能由Chrome插件FeHelper移植改造而来

 * 背景图片是从[https://alpha.wallhaven.cc/](https://alpha.wallhaven.cc/)抓取而来