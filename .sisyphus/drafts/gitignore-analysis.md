# .gitignore 分析与优化建议

**日期**: 2026-04-20  
**项目**: goey-toast (多包型仓库)

## 当前状态概览

### 现存的 .gitignore 文件
1. **根目录** (`.gitignore`) - 仅3行，极其基础
2. **goey-toast-react** (`.gitignore`) - 4行，包含tsup输出
3. **goey-toast-react/demo** (`.gitignore`) - Vite标准模板
4. **.opencode** (`.gitignore`) - 5行，忽略opencode工具文件

### 缺失的 .gitignore 文件
- ❌ `goey-toast-vue/` - **完全缺失**（有dist/目录但未被忽略）
- ❌ `goey-toast-vue/demo/` - **完全缺失**
- ❌ `docs/` - **完全缺失**

## 问题分析

### 1. 根目录 .gitignore 过于简化

**当前内容：**
```
node_modules
goey-toast-react
dist
```

**问题：**
- ❌ `goey-toast-react` 整个目录被忽略 - 这是**不应该忽略**的源代码目录
- ❌ 缺少IDE、OS生成的文件（`.DS_Store`, `.env`, `.vercel`）
- ❌ 缺少editor/IDE配置（`.vscode/extensions.json` 应该保留但其他.vscode文件该忽略）
- ❌ 缺少工具生成的cache
- ❌ 缺少`.sisyphus/evidence` 这种临时产物

### 2. goey-toast-vue 包的忽略策略缺失

**当前：** 无 .gitignore  
**结果：**
- ✓ `dist/` 在git中可见（不符合标准实践）
- ✓ `demo/dist/` 在git中可见
- ✓ 可能泄漏环境变量和本地配置

### 3. 工具生成的文件在git中

**当前git状态显示：**
- `?? .opencode/` - opencode工具元数据（应忽略）
- `?? .playwright-mcp/` - playwright cache（应忽略）
- `?? .sisyphus/evidence/` - 执行产物（应忽略）
- `?? session-ses_*.md` - 会话存档（应忽略）

## 需要忽略的完整清单

### 按类别分类

#### 📦 构建和发布产物
- `dist/` - tsup/vite输出
- `dist-ssr/` - SSR构建产物
- `*.tsbuildinfo` - TypeScript增量构建缓存
- `coverage/` - 测试覆盖率报告

#### 🔧 开发环境产物
- `node_modules/` - 依赖安装
- `.env.local` - 本地环境变量
- `.env.*.local` - 特定环境的本地变量
- `*.local` - 本地测试文件

#### 🖥️ IDE和编辑器
- `.vscode/` - VSCode设置（但保留`extensions.json`）
- `.idea/` - WebStorm/IntelliJ
- `.DS_Store` - macOS系统文件
- `*.suo` - Visual Studio
- `*.ntvs*` - Node Tools for VS
- `*.njsproj` - NJ项目文件
- `*.sln` - Visual Studio解决方案
- `*.sw[op]` - Vim swap文件

#### 📝 日志文件
- `logs/`, `*.log` - 各类日志
- `npm-debug.log*`
- `yarn-debug.log*`, `yarn-error.log*`
- `pnpm-debug.log*`
- `lerna-debug.log*`

#### 🛠️ 特定工具产物
- `.npmrc` - NPM配置（可能含敏感凭证）
- `.vercel` - Vercel CLI缓存
- `.opencode/` - OpenCode工具元数据
- `.playwright-mcp/` - Playwright MCP缓存
- `.sisyphus/evidence/` - 执行证据截图
- `session-ses_*.md` - 会话存档

#### 🔐 敏感文件
- `.env` 文件族
- `*secret*`, `*credential*`

## 推荐的 .gitignore 配置

### 根目录 `.gitignore`

```gitignore
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 构建输出
dist/
dist-ssr/
*.tsbuildinfo
coverage/

# IDE和编辑器
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw[op]

# 本地环境变量
.env
.env.local
.env.*.local
*.local

# 工具产物
.vercel/
.opencode/
.playwright-mcp/
.opencode-router/

# 执行/会话产物
.sisyphus/evidence/
session-ses_*.md
.sisyphus/boulder.json
```

### `goey-toast-vue/` 新增 `.gitignore`

```gitignore
# Node.js
node_modules/

# 构建输出
dist/
*.tsbuildinfo

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store

# 环境变量
.env
.env.local
.env.*.local
*.local
```

### `goey-toast-vue/demo/` 新增 `.gitignore`

```gitignore
# 继承自父包，加上demo特定项

# 日志
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 构建
node_modules/
dist/
dist-ssr/
*.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store

# 环境
.env.local
.env.*.local

# 部署
.vercel
```

### `docs/` 新增 `.gitignore`

```gitignore
# 如果docs中有Node项目
node_modules/
npm-debug.log*
.env.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store

# 构建/生成
dist/
build/
_site/
```

### 调整 `.opencode/` `.gitignore`

当前过度忽略了package.json。建议改为只忽略运行时产物：

```gitignore
# 运行时产物
*.log
.DS_Store

# 这些应该 git tracked，不应忽略：
# - node_modules (在parent的gitignore中处理)
# - package.json (需要track)
# - package-lock.json (需要track)
# - bun.lock (需要track)
# - .gitignore 自己 (需要track)
```

## 优化建议总结

| 优先级 | 任务 | 影响 |
|--------|------|------|
| 🔴 高 | 修复根目录 `.gitignore`（移除 `goey-toast-react`） | 防止目录被错误忽略 |
| 🔴 高 | 创建 `goey-toast-vue/.gitignore` | 标准化Vue包的构建物 |
| 🟡 中 | 创建 `goey-toast-vue/demo/.gitignore` | 统一demo配置 |
| 🟡 中 | 创建 `docs/.gitignore` | 如果docs有Node项目 |
| 🟡 中 | 更新 `.opencode/.gitignore` | 避免过度忽略 |
| 🟢 低 | 增加常见临时文件到根 .gitignore | 防止意外提交 |

## 实施顺序

1. ✅ **第1步**：修复根目录 `.gitignore`（删除错误的 `goey-toast-react` 行）
2. ✅ **第2步**：为 `goey-toast-vue/` 创建 `.gitignore`
3. ✅ **第3步**：为 `goey-toast-vue/demo/` 创建 `.gitignore`
4. ✅ **第4步**：为 `docs/` 创建 `.gitignore`
5. ✅ **第5步**：审查 `.opencode/.gitignore` 的必要性

---

## 验证步骤

实施后应验证：
```bash
# 1. 检查是否有源文件被意外忽略
git status --ignored | grep -v ".sisyphus/evidence"

# 2. 确认构建产物被正确忽略
ls -la goey-toast-react/dist/ && git status | grep dist

# 3. 检查每个包的忽略规则
cd goey-toast-vue && git check-ignore -v node_modules dist .env.local

# 4. 统计当前被忽略的文件数
git clean -n -d -x | wc -l
```
