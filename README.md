# monitorjs
全局SDK监控

从数据采集--》 数据格式化--》 数据组装 --》 数据上报

采集：每个平台的数据采集、包括错误数据、性能数据、API质量等。
数据格式化：对第一步采集到的信息进行格式化。
数据组装：用户信息、环境信息、设备信息和上报的数据一起组装上报。
数据上报：上报组装后的数据。

## 监控内容
### 请求监控
- xhr
- fetch

### 错误监控
- js 错误
- 静态资源错误
### 性能监控
- webVitals 监控
- longtask 监控

## 目录说明
```js
root
|--apps/         // 文档  
|--examples/     // 实例
|--packages/     // 上报模块

```
# Develop
在根目录：
安装依赖包：`pnpm install`
开发：`pnpm dev`
## 内置模块及使用方式
### 工具链
- changeset：版本管理
- pnpm：依赖包管理
- turbo：任务编排

# Publish
构建： `pnpm build` 
TODO： 发布初始版本

### 规范
- eslint 代码规范
- commitlint 代码提交规范
