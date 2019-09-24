## weapp gulp 简介

基于 gulp4.0 实现七牛云自动上传+图片压缩+scss+封装 wx.request+实时编译+多环境配置，脚手架开发小程序[项目详细介绍](https://juejin.im/post/5d1c503ce51d4510926a7b96)

## 介绍

优化升级 weapp-gulp 1.0.0 优化了构建代码，更简洁易懂，易于修改

-   build 压缩代码
-   删除 css 中`PX`单位
-   图片替换路径通配符%ASSETS_IMG%修改为%CDN_IMG%
-   优化删除代码编译文件删除
-   更改了启动命令 使用 npm run start

## 在这里你可以找到

-   px 转换 rpx，让开发更顺手
-   scss 开发，拜托传统 css 繁琐
-   压缩图片，自动上传七牛云 or 腾讯云
-   wx.request 封装，类似 axios 的拦截器
-   多环境开发，轻松切换不同环境

## 线上体验

![iterm](src/assets/images/qrcode.png)

## 开始使用

> Node 版本建议在 v4 以上,本人使用 8.9.1,低版本容易 npm i 安装失败

## 使用

-全局安装 gulp-cli

```
$ npm install --global gulp-cli
```

-   通过 git clone 下载项目文件。

```
git clone https://github.com/sunnie1992/weapp-gulp
```

-   建议删除.git 目录（Windows 用户请手动删除）

```
cd weapp-gulp
rm -rf .git
```

-   安装必要模块

```
npm install
// or
npm i
```

-   修改配置文件

建议复制`config.js`并重命名为`config.custom.js`，修改七牛云配置，根据 [gulp-qiniu](https://github.com/hfcorriez/gulp-qiniu)配置

-   本地开发

```
npm run start
```

-   打包线上

npm run build

![iterm](src/assets/images/iterm.png)

其余任务：`gulp clean`：清除`dist`，`tmp`文件夹。

## 鸣谢

[WeApp-Workflow](https://github.com/Jeff2Ma/WeApp-Workflow)
[wx-extend](https://github.com/skyvow/wx-extend)

## 意见反馈

您可以扫描添加下方的微信并备注 Sol 加交流群，给我提意见，交流学习

![mine](src/assets/images/mine.png)

如果对你有帮助送我一颗小星星（づ￣ 3 ￣）づ ╭❤ ～
