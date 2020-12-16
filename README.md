# React Electron Demo

✨🚀一个简单的`react`结合`electron`开发的demo程序 

## Usage
```bash
# 安装依赖
npm install

# 启动开发环境
npm start

# 测试生成打包运行
npm run start:prod

# webpack打包代码
npm run build

# electron打包
npm run pack
```

## 项目结构

```
- .electron      # webpack打包运行配置
- public         # 公共资源文件
- build          # electron 打包目录
- dist           # webpack 打包后的代码
- src
    - main       # 主进程代码
    - renderer   # 渲染进程代码
```