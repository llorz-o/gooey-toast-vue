# 工作计划：优化项目 .gitignore 配置

**目标**: 标准化和完善goey-toast多包仓库的.gitignore文件，防止构建产物、工具缓存和敏感文件被意外提交

**创建时间**: 2026-04-20  
**优先级**: 中等  
**预计工时**: Quick (< 1小时)

---

## TL;DR

> **快速总结**: 项目存在4个.gitignore文件，其中根目录的配置有一个严重错误（整个`goey-toast-react`目录被忽略），同时`goey-toast-vue`和`docs`完全缺少.gitignore。需要修复根目录配置、新增Vue包和docs目录的.gitignore。

**交付物**:
- ✅ 修复后的根目录 `.gitignore`
- ✅ 新增 `goey-toast-vue/.gitignore`
- ✅ 新增 `goey-toast-vue/demo/.gitignore`
- ✅ 新增 `docs/.gitignore`
- ✅ 审查后的 `.opencode/.gitignore`

**执行方式**: 顺序执行（无并行依赖）  
**验证方式**: 每个任务使用git命令验证文件被正确忽略或tracked

---

## 工作目标

### 核心目标
1. 消除被错误忽略的源代码文件
2. 标准化构建产物和工具产物的忽略规则
3. 跨所有包统一gitignore配置风格
4. 防止敏感信息（.env、密钥）被提交

### 验收标准
- [ ] 所有源代码文件都被git track（包括`goey-toast-react`、`goey-toast-vue`）
- [ ] 所有`dist/`、`node_modules/`等构建产物被正确忽略
- [ ] 工具产物（`.opencode/`、`.playwright-mcp/`、`.sisyphus/evidence/`）被忽略
- [ ] 所有package.json都被track（npm配置）
- [ ] 验证命令`git status --ignored`输出干净（仅含应忽略的产物）

### 必须不做的
- ❌ 不能删除或修改源代码结构
- ❌ 不能改变现有git历史
- ❌ 不能忽略任何源文件
- ❌ 不能忽略package.json和package-lock.json

---

## 上下文

### 当前问题
**根目录.gitignore的严重错误：**
```
node_modules    # ✓ 正确
goey-toast-react  # ❌ 错误！整个包被忽略
dist            # ⚠️ 含糊（哪个dist？）
```

**缺失的gitignore：**
- `goey-toast-vue/` 无.gitignore → dist/被tracked
- `goey-toast-vue/demo/` 无.gitignore → dist/被tracked  
- `docs/` 无.gitignore → 如有构建产物会被tracked

**git状态显示的泄露：**
```
?? .opencode/           # 工具元数据
?? .playwright-mcp/     # 浏览器缓存
?? .sisyphus/evidence/  # 执行产物截图
?? session-ses_*.md     # 会话存档
```

### 项目结构相关信息
```
goey-toast/
├── .gitignore (需修复)
├── .opencode/.gitignore (需审查)
├── goey-toast-react/
│   ├── .gitignore (已有，保留)
│   ├── package.json (需track)
│   ├── dist/ (需忽略)
│   └── demo/
│       ├── .gitignore (已有，保留)
│       └── dist/ (需忽略)
├── goey-toast-vue/ (需新增.gitignore)
│   ├── package.json (需track)
│   ├── dist/ (需忽略)
│   └── demo/ (需新增.gitignore)
└── docs/ (需新增.gitignore)
```

---

## 执行策略

### 执行顺序（顺序执行）

```
Task 1: 修复根目录.gitignore (Quick)
  ↓
Task 2: 创建goey-toast-vue/.gitignore (Quick)
  ↓
Task 3: 创建goey-toast-vue/demo/.gitignore (Quick)
  ↓
Task 4: 创建docs/.gitignore (Quick)
  ↓
Task 5: 审查.opencode/.gitignore (Quick)
  ↓
[最终验证] 运行git验证命令
```

**推荐分配**:
- 所有任务: `quick` 类别（单个文件修改，清晰标准）

---

## TODOs

- [x] 1. 修复根目录 `.gitignore` - 移除错误的目录忽略

  **What to do**:
  - 编辑 `.gitignore`
  - 删除错误的行：`goey-toast-react`
  - 调整 `dist` 为 `dist/` (带斜杠，标明是目录)
  - 保留 `node_modules` 但改为 `node_modules/`
  - 增加IDE/OS文件忽略规则（`.DS_Store`, `.vscode/*` 等）
  - 增加日志文件规则
  - 增加工具产物规则（`.opencode/`, `.playwright-mcp/`, `.sisyphus/evidence/`）
  - 增加会话存档规则（`session-ses_*.md`）
  - 增加环境变量规则（`.env*`）

  **Must NOT do**:
  - ❌ 不能删除 `node_modules` 忽略
  - ❌ 不能忽略任何源代码目录
  - ❌ 不能修改已有的goey-toast-react/.gitignore
  - ❌ 不能改变git历史

  **Recommended Agent Profile**:
  > 简单的配置文件修改任务
  - **Category**: `quick`
    - Reason: 单个文件编辑，标准gitignore语法，无代码逻辑
  - **Skills**: 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (first task)
  - **Blocks**: Tasks 2-5
  - **Blocked By**: None

  **References**:
  - [GitHub .gitignore patterns](https://git-scm.com/docs/gitignore) - 标准glob模式文档
  - `.gitignore` 现有内容 (需修复的起点)

  **Acceptance Criteria**:
  - [ ] `.gitignore` 修改后，`git status` 显示 `goey-toast-react/` 内的文件（未被忽略）
  - [ ] 命令验证：`cd goey-toast-react && git check-ignore -v package.json` 返回空（文件未被忽略）
  - [ ] `dist/` 目录中的文件被正确忽略：`git check-ignore -v goey-toast-react/dist/index.js` 返回规则
  - [ ] `node_modules/` 中的文件被正确忽略：`git check-ignore -v node_modules/react/package.json` 返回规则

  **QA Scenarios**:

  ```
  Scenario: 验证goey-toast-react源文件不被忽略
    Tool: Bash (git)
    Preconditions: 修改后的.gitignore已保存
    Steps:
      1. 运行 git check-ignore -v goey-toast-react/package.json
      2. 确认返回为空（表示文件未被忽略）
      3. 运行 git check-ignore -v goey-toast-react/src/index.ts
      4. 确认返回为空
    Expected Result: 两条命令都返回空字符串，表示源文件可被tracked
    Evidence: .sisyphus/evidence/task-1-source-files-tracked.txt

  Scenario: 验证dist/被正确忽略
    Tool: Bash (git)
    Preconditions: 根目录存在dist/目录
    Steps:
      1. 创建测试文件 touch dist/test.js
      2. 运行 git check-ignore -v dist/test.js
      3. 确认返回规则信息（表示被忽略）
      4. 运行 git status | grep dist
      5. 确认dist不出现在未tracked列表
    Expected Result: git check-ignore返回规则，git status不显示dist/
    Evidence: .sisyphus/evidence/task-1-dist-ignored.txt

  Scenario: 验证node_modules被正确忽略
    Tool: Bash (git)
    Preconditions: node_modules/存在
    Steps:
      1. 运行 git check-ignore -v node_modules/react/package.json
      2. 确认返回规则
    Expected Result: 返回规则信息
    Evidence: .sisyphus/evidence/task-1-node-modules-ignored.txt

  Scenario: 验证工具产物被正确忽略
    Tool: Bash (git)
    Preconditions: .opencode/, .playwright-mcp/ 等存在
    Steps:
      1. 运行 git check-ignore -v .opencode/agents/test.js
      2. 运行 git check-ignore -v .playwright-mcp/cache
      3. 运行 git check-ignore -v .sisyphus/evidence/screenshot.png
      4. 确认都返回规则
    Expected Result: 所有工具产物都被规则忽略
    Evidence: .sisyphus/evidence/task-1-tools-ignored.txt
  ```

  **Commit**: NO (与后续任务合并)

---

- [x] 2. 创建 `goey-toast-vue/.gitignore` - Vue包的标准忽略规则

  **What to do**:
  - 在 `goey-toast-vue/` 目录创建新文件 `.gitignore`
  - 添加Vue包相关的忽略规则：
    - `node_modules/` - 依赖
    - `dist/` - 构建输出（vite产物）
    - `*.tsbuildinfo` - TypeScript缓存
    - IDE文件
    - `.env*` - 环境变量
    - `.DS_Store` - macOS文件
  - 保持规则精简但完整

  **Must NOT do**:
  - ❌ 不能忽略源代码文件（src/目录）
  - ❌ 不能忽略package.json、tsconfig.json
  - ❌ 不能改变Vue包现有文件

  **Recommended Agent Profile**:
  > 新建配置文件任务
  - **Category**: `quick`
    - Reason: 新建标准.gitignore文件，参考React包的规则
  - **Skills**: 无需

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1)
  - **Parallel Group**: Sequential
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `goey-toast-react/.gitignore` (参考标准)
  - `goey-toast-vue/dist/` (确认输出目录结构)
  - `goey-toast-vue/package.json` (确认构建工具)

  **Acceptance Criteria**:
  - [ ] 文件 `goey-toast-vue/.gitignore` 已创建
  - [ ] `goey-toast-vue/dist/` 中文件被正确忽略
  - [ ] `goey-toast-vue/package.json` 未被忽略
  - [ ] `goey-toast-vue/src/` 未被忽略

  **QA Scenarios**:

  ```
  Scenario: 验证Vue包的.gitignore已创建且格式正确
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. 运行 test -f goey-toast-vue/.gitignore && echo "exists"
      2. 运行 cat goey-toast-vue/.gitignore | head -5
      3. 确认包含关键规则（node_modules/, dist/等）
    Expected Result: 文件存在，内容包含标准规则
    Evidence: .sisyphus/evidence/task-2-file-created.txt

  Scenario: 验证Vue包dist被正确忽略
    Tool: Bash (git)
    Preconditions: goey-toast-vue/.gitignore已创建
    Steps:
      1. cd goey-toast-vue
      2. git check-ignore -v dist/index.js
      3. 确认返回规则
    Expected Result: git返回忽略规则
    Evidence: .sisyphus/evidence/task-2-dist-ignored.txt

  Scenario: 验证Vue包package.json未被忽略
    Tool: Bash (git)
    Preconditions: goey-toast-vue/.gitignore已创建
    Steps:
      1. cd goey-toast-vue
      2. git check-ignore -v package.json
      3. 确认返回空（未被忽略）
    Expected Result: 命令返回空
    Evidence: .sisyphus/evidence/task-2-package-tracked.txt
  ```

  **Commit**: NO (与后续任务合并)

---

- [x] 3. 创建 `goey-toast-vue/demo/.gitignore` - Vue demo应用的忽略规则

  **What to do**:
  - 在 `goey-toast-vue/demo/` 目录创建 `.gitignore`
  - 基于 `goey-toast-react/demo/.gitignore` 但适配Vue demo
  - 添加规则：
    - 日志文件（logs, *.log）
    - 构建输出（node_modules, dist, dist-ssr）
    - IDE配置
    - 环境变量
    - 部署工具缓存
  - 与React demo的.gitignore保持风格一致

  **Must NOT do**:
  - ❌ 不能忽略源代码
  - ❌ 不能忽略package.json、vite.config.ts
  - ❌ 不能改变demo现有文件

  **Recommended Agent Profile**:
  > 新建配置文件（参考现有文件）
  - **Category**: `quick`
    - Reason: 新建标准.gitignore，参考React demo版本
  - **Skills**: 无需

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2)
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:
  - `goey-toast-react/demo/.gitignore` (参考标准)
  - `goey-toast-vue/demo/package.json` (确认构建工具是Vite)

  **Acceptance Criteria**:
  - [ ] 文件 `goey-toast-vue/demo/.gitignore` 已创建
  - [ ] `goey-toast-vue/demo/dist/` 被正确忽略
  - [ ] `goey-toast-vue/demo/src/` 未被忽略
  - [ ] `goey-toast-vue/demo/package.json` 未被忽略

  **QA Scenarios**:

  ```
  Scenario: 验证Vue demo的.gitignore已创建
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. test -f goey-toast-vue/demo/.gitignore && echo "exists"
      2. cat goey-toast-vue/demo/.gitignore | grep -E "(node_modules|dist|logs)" | head -3
    Expected Result: 文件存在且包含关键规则
    Evidence: .sisyphus/evidence/task-3-file-created.txt

  Scenario: 验证Vue demo dist被正确忽略
    Tool: Bash (git)
    Preconditions: .gitignore已创建
    Steps:
      1. cd goey-toast-vue/demo
      2. git check-ignore -v dist/index.js
      3. 确认返回规则
    Expected Result: 返回忽略规则
    Evidence: .sisyphus/evidence/task-3-dist-ignored.txt

  Scenario: 验证Vue demo源文件未被忽略
    Tool: Bash (git)
    Preconditions: .gitignore已创建
    Steps:
      1. cd goey-toast-vue/demo
      2. git check-ignore -v src/main.ts
      3. 确认返回空
    Expected Result: 命令返回空（文件可被tracked）
    Evidence: .sisyphus/evidence/task-3-src-tracked.txt
  ```

  **Commit**: NO (与后续任务合并)

---

- [x] 4. 创建 `docs/.gitignore` - 文档目录的忽略规则

  **What to do**:
  - 在 `docs/` 目录创建 `.gitignore`
  - 添加规则：
    - `node_modules/` - 如果docs有Node项目
    - `dist/`, `build/` - 构建输出
    - 日志和环境变量
    - IDE配置
    - `.DS_Store` - macOS文件
  - 适配文档项目（可能是markdown/hugo/next.js等）

  **Must NOT do**:
  - ❌ 不能忽略markdown源文件
  - ❌ 不能忽略配置文件（package.json等）

  **Recommended Agent Profile**:
  > 新建配置文件
  - **Category**: `quick`
    - Reason: 新建标准.gitignore，基于通用docs规则
  - **Skills**: 无需

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential)
  - **Parallel Group**: Sequential
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:
  - `docs/` 目录结构 (确认是否有Node项目)
  - `docs/superpowers/` 子目录内容

  **Acceptance Criteria**:
  - [ ] 文件 `docs/.gitignore` 已创建
  - [ ] markdown文件（.md）未被忽略
  - [ ] 构建产物被正确忽略

  **QA Scenarios**:

  ```
  Scenario: 验证docs/.gitignore已创建
    Tool: Bash
    Preconditions: 文件已创建
    Steps:
      1. test -f docs/.gitignore && echo "exists"
      2. cat docs/.gitignore | head
    Expected Result: 文件存在
    Evidence: .sisyphus/evidence/task-4-file-created.txt

  Scenario: 验证markdown文件未被忽略
    Tool: Bash (git)
    Preconditions: .gitignore已创建
    Steps:
      1. cd docs
      2. git check-ignore -v superpowers/specs/*.md
      3. 确认返回空
    Expected Result: markdown文件可被tracked
    Evidence: .sisyphus/evidence/task-4-md-tracked.txt
  ```

  **Commit**: NO (与后续任务合并)

---

- [x] 5. 审查 `.opencode/.gitignore` - 确认工具配置的忽略规则

  **What to do**:
  - 审查 `.opencode/.gitignore` 的当前内容
  - 确认是否过度忽略（package.json不应忽略）
  - 判断是否需要修改
  - 记录审查结果

  **Must NOT do**:
  - ❌ 不能删除任何工具必需的忽略规则
  - ❌ 不能忽略package.json（opencode工具需要读）

  **Recommended Agent Profile**:
  > 配置文件审查任务
  - **Category**: `quick`
    - Reason: 简单的文件审查和可选编辑
  - **Skills**: 无需

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential)
  - **Parallel Group**: Sequential
  - **Blocks**: 最终验证
  - **Blocked By**: Task 4

  **References**:
  - `.opencode/.gitignore` 现有内容
  - `.opencode/` 目录结构

  **Acceptance Criteria**:
  - [ ] `.opencode/.gitignore` 已审查
  - [ ] 确认package.json在git中可见（未被忽略）
  - [ ] 确认bun.lock在git中可见
  - [ ] 如需修改已完成，如不需修改已确认

  **QA Scenarios**:

  ```
  Scenario: 验证.opencode配置文件未被忽略
    Tool: Bash (git)
    Preconditions: .opencode/.gitignore审查完成
    Steps:
      1. cd .opencode
      2. git check-ignore -v package.json
      3. 确认返回空或确认是否该被忽略（根据opencode需求）
    Expected Result: 确认package.json的ignore状态符合要求
    Evidence: .sisyphus/evidence/task-5-opencode-review.txt

  Scenario: 验证.opencode/*.json配置文件状态
    Tool: Bash (git)
    Preconditions: 审查完成
    Steps:
      1. git check-ignore -v .opencode/openwork.json
      2. git check-ignore -v .opencode/skills/*
      3. 记录所有配置文件的tracked状态
    Expected Result: 配置文件状态符合opencode工具需求
    Evidence: .sisyphus/evidence/task-5-config-files.txt
  ```

  **Commit**: NO (单独提交)

---

## 最终验证 Wave

所有任务完成后，运行验证确保一致性：

- [ ] V1. **完整性检查** — 所有.gitignore已创建/更新

  ```bash
  # 验证所有预期的.gitignore文件存在
  test -f .gitignore
  test -f goey-toast-react/.gitignore
  test -f goey-toast-react/demo/.gitignore
  test -f goey-toast-vue/.gitignore
  test -f goey-toast-vue/demo/.gitignore
  test -f docs/.gitignore
  test -f .opencode/.gitignore
  ```

- [ ] V2. **源文件验证** — 所有源代码可被track

  ```bash
  # 源文件应该在git中可见
  git check-ignore -v goey-toast-react/package.json | grep -q "" && echo "ERROR: 被忽略"
  git check-ignore -v goey-toast-vue/package.json | grep -q "" && echo "ERROR: 被忽略"
  git check-ignore -v docs/superpowers/plans/2026-04-18-goey-toast-vue-execution-plan.md | grep -q "" && echo "ERROR: 被忽略"
  ```

- [ ] V3. **产物验证** — 所有构建产物被正确忽略

  ```bash
  # 构建产物应该被忽略
  git check-ignore -v dist/index.js > /dev/null || echo "ERROR: dist未被忽略"
  git check-ignore -v goey-toast-react/dist/index.js > /dev/null || echo "ERROR: React dist未被忽略"
  git check-ignore -v goey-toast-vue/dist/index.js > /dev/null || echo "ERROR: Vue dist未被忽略"
  ```

---

## 提交策略

**合并提交** (在最后执行):
```
git add .gitignore goey-toast-vue/.gitignore goey-toast-vue/demo/.gitignore docs/.gitignore
git commit -m "chore(gitignore): standardize and complete .gitignore across all packages

- Fix root .gitignore: remove incorrect 'goey-toast-react' entry
- Add missing .gitignore files for goey-toast-vue and docs
- Standardize build artifact, tool cache, and env var ignoring
- Ensure all source files remain tracked, all generated files properly ignored"
```

---

## 成功标准

✅ **所有验收标准通过**:
- [ ] 根目录.gitignore错误已修复
- [ ] 4个新.gitignore文件已创建
- [ ] git status显示干净（仅含应忽略的产物）
- [ ] 所有源代码文件都在git中可见
- [ ] 所有构建产物都被git忽略
- [ ] 一次git提交完成所有更改
