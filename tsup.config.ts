import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // 同时输出CommonJS和ESM格式
  dts: true, // 生成类型声明文件
  clean: true, // 构建前清理输出目录
  splitting: false, // 不进行代码分割
  sourcemap: true, // 生成sourcemap
  
  // 排除大型依赖，让用户自己安装
  external: [
    '@bsv/sdk'
  ],
  
  // 可选：排除所有node_modules中的包，只打包自己的代码
  // external: (id) => !id.startsWith('.') && !id.startsWith('/'),
  
  // 输出配置
  outDir: 'dist',
  
  // 压缩配置
  minify: false, // 库项目通常不需要压缩，便于调试
  
  // 目标环境
  target: 'es2020',
  
  // 处理Node.js内置模块
  platform: 'node',
}) 