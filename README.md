## weapp gulp 简介

基于 gulp4.0 实现七牛云自动上传+图片压缩+scss+封装 wx.request+实时编译+多环境配置，脚手架开发小程序[项目介绍](https://juejin.im/post/5d1c503ce51d4510926a7b96)
根据[WeApp-Workflow](https://github.com/Jeff2Ma/WeApp-Workflow) 修改

## 介绍

拥有 WeApp-Workflow 的主要功能
删除了雪碧图，保留了 SCSS 实时编译为 WXSS,图片压缩

## 新增 图片上传七牛云 cdn

优化相对路径的图片引用，gulp 复制文件和替换`%ASSETS_IMG%/`冲突，导致保存文件时小程序报错

## 开始使用

> Node 版本建议在 v4 以上,本人使用 8.9.1,低版本容易 npm i 安装失败

### 安装

0、请先全局安装 Gulp-cli

```
npm install gulp-cli -g
```

1、通过`git clone`下载项目文件。

```
git clone https://github.com/sunnie1992/weapp-gulp
```

2、建议删除`.git`目录（Windows 用户请手动删除）

```
cd weapp-gulp
rm -rf .git
```

3、安装必要模块

```
npm i
```

4、启动开发

建议复制`config.js`并重命名为`config.custom.js`，修改七牛云配置，根据 [gulp-qiniu](https://github.com/hfcorriez/gulp-qiniu)配置

```
gulp
```

![iterm](src/assets/images/iterm.png)

其余任务：`gulp clean`：清除`dist`，`tmp`文件夹。

## 案例展示

![devework+微信小程序](src/assets/images/qr.png)

## 鸣谢

[WeApp-Workflow](https://github.com/Jeff2Ma/WeApp-Workflow)

## 意见反馈

您可以扫描添加下方的微信并备注 Soul 加交流群，给我提意见，交流学习

![mine](src/assets/images/mine.png)

如果对你有帮助送我一颗小星星（づ￣ 3 ￣）づ ╭❤ ～
