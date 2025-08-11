# 发布流程（手动、可审计）

适用于次版本号发布（例如 0.1.x -> 0.2.0）。本流程将 npm 包与 Go 模块一并发布，并确保每一步都可单独执行/回滚，便于定位问题。

## 0. 前置检查

- 确认已更新版本号与说明：
  - `package.json` 中的 `version` 已更新（当前应为 `0.2.0`）。
  - `RELEASE_NOTES.md` 已新增本次版本条目并描述变更。
- 确认 proto 改动已保存于 `proto/v1/*.proto`。
- 确认处于正确分支（通常 `main`）。
- 确认 npm 已登录：`npm whoami` 应返回用户名。

## 1. 同步远端并检查工作区

```bash
# 获取最新远端更新（不产生合并提交）
git pull --ff-only

# 查看工作区状态
git status
```

## 2. 生成代码与构建

```bash
# 2.1 生成 Go/TS 代码（会覆盖 gen/ 目录）
./compile_proto.sh

# 2.2 安装 Node 依赖并构建打包产物
npm ci
npm run build

# 2.3 验证 Go 侧可编译
go build ./...
```

## 3. 提交变更

```bash
# 将本次涉及的文件纳入提交（按需增减）
git add proto/v1/message.proto package.json RELEASE_NOTES.md publish.sh gen/ tsconfig.json tsup.config.ts src/ pkg/ go.mod go.sum

# 生成提交
git commit -m "chore(release): v0.2.0 - proto updates and release notes"
```

提示：若仅有部分目录变更，可精简 `git add` 列表；保持提交语义清晰。

## 4. 打标签并推送

```bash
# 4.1 创建语义化标签（Go 模块依赖 Git tag）
git tag v0.2.0

# 4.2 推送分支与标签
git push origin main
git push origin v0.2.0
```

## 5. 发布 npm 包

```bash
# 确保 package.json version == 0.2.0
npm publish
```

## 6. 发布后验证

```bash
# npm 安装验证
npm info keymaster_proto version
# 期望输出 0.2.0

# Go 模块获取验证
go get github.com/spycat55/KeymasterProto@v0.2.0
```

## 7. 常见问题

- 若 `npm run build` 提示 `tsup: command not found`：先执行 `npm ci`。
- 若 `git pull --ff-only` 失败：说明有分叉历史，请先手动处理再继续。
- 若 `npm publish` 403：检查是否登录、是否有发布权限、包名归属是否正确。

---

说明：本流程与 `publish.sh` 脚本等价，但拆分为可审计的独立步骤，便于在任一步骤失败时快速定位与重试。
