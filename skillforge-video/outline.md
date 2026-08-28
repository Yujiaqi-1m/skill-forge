# Video Outline

> **主题**:`paper-press`(亮色印刷) —— 技术教学讲解,信息密度中高,需要终端 / 目录树 / 对比类视觉演示
> **总时长**:约 4 分 55 秒(口播 ~1160 字 ÷ 4 字/秒)
> **章节数**:6 章 / 52 步(与 script.md 52 节拍 1:1)

---

## 1. coldopen — 同一份代码,三个 agent(9 steps · ~44s)

**信息池**(chapter agent 按需挂角标 / 副标 / pull-quote / mono cue):
- 名称:Claude Code / OpenAI Codex CLI / pi —— 来源 article §1
- 痛点句:"你给 Claude 写的插件,挪到 Codex 里它根本看不见" —— 来源 article §1
- 关键词:Agent Skills 标准(agentskills.io)、"一份 skill 源码,三个 agent 直接可用" —— 来源 article §1
- 仓库事实:不是一个框架,是"仓库布局约定 + 三个 shell 脚本 + 一条硬规矩" —— 来源 article §1

**开发计划**:

- step 1 (~6s) — hero 对比:三个 agent 名并排,同一份 SKILL.md 居中,"×1"
- step 2 (~5s) — "最难的不是写,是让三家都认":三家位置 + 认证门槛隐喻
- step 3 (~5s) — 引入卡:仓库路径 `skill-forge/`,标题"写一遍,处处能用"
- step 4 (~5s) — 痛点:一个人影 + 手边多个 agent 终端窗口
- step 5 (~3s) — 轨道一:Claude(plugin marketplace)亮起,其余暗占位
- step 6 (~3s) — 轨道二:Codex(~/.agents/skills)亮起,Claude 灰化保留
- step 7 (~3s) — 轨道三:pi(/skill:<name>)亮起,前两条灰化 + "互不相通"叉号
- step 8 (~6s) — "挪过去看不见 / 写三遍没人受得了":插件图标被拒绝门挡住
- step 9 (~6s) — 答案定场:开放标准 = 一份源码,三家认

口播节选:
> 同一个 skill,Claude Code、Codex、pi,三个 agent 同时在用。我只写了一遍。
> skill-forge 的答案特别朴素:所有 skill 按开放的 Agent Skills 标准写。

---

## 2. anatomy — 一个 skill 长什么样(10 steps · ~39s)

**信息池**:
- 结构:核心是 SKILL.md + 三个子目录(references/ scripts/ assets/) —— 来源 article §2
- 三层加载:description 常驻(~100 词)→ 正文触发才加载(<500 行)→ references 按需读 —— 来源 article §2
- 关键论断:"description 不是文档,是路由器" / "描述写不好,skill 永远不会被触发" —— 来源 article §2
- 描述写法:能力一句话 + 中英文触发词 + 边界(不做什么) —— 来源 article §2
- 类比:路由器 / 路由表(触发词 = 喂给路由器的关键词) —— 来源 article §2

**开发计划**:

- step 1 (~6s) — 目录树演示:SKILL.md 高亮 + 三个子目录分支线生长
- step 2 (~5s) — SKILL.md 放大:frontmatter 几行,description 行高亮扫过,"不是文档,是路由器"
- step 3 (~4s) — 三层塔第一层:description · 常驻 · ~100 词,亮起
- step 4 (~3s) — 第二层:SKILL.md 正文 · <500 行 · 触发才加载,亮起,第一层灰化保留
- step 5 (~3s) — 第三层:references / scripts · 按需读,亮起,前两层灰化
- step 6 (~4s) — 全塔视角:仅第一层橙色发光,hero "常驻 ≈ 100 词"
- step 7 (~5s) — 反面:skill 卡片下坠变暗,"永远不会被触发"
- step 8 (~3s) — 配方格 1/3:"能力一句"亮起
- step 9 (~2s) — 配方格 2/3:"触发词一排"(中英词 chip 整排同时挂)
- step 10 (~4s) — 配方格 3/3:"边界一条"亮起,三格合览 + "中英文都要有"标注

口播节选:
> 它不是文档,是路由器。三层渐进加载,常驻成本就一百来个词。


---

## 3. skills-tour — 仓库三件套(8 steps · ~58s)

**信息池**:
- svg-handdrawn:中英自然语言 → 白板手绘风 SVG(歪边/排线填充/手写字体),非 draw.io 机械感 —— 来源 article §3
- svg 宽高比:16:9 / 4:3 / A4 / 自定义 —— 来源 article §3
- svg 自检循环:栅格化 → 自己看 → 不满意迭代重画,"交付的是它自己验收过的图" —— 来源 article §3
- task-scheduler:延迟/多步/定时调度,任务记录落 `.tasks/`,一次性触发器 —— 来源 article §3
- 断点续跑:检查点日志,会话断/程序崩,重进从检查点续跑而非重启 —— 来源 article §3
- wvp:文章/口播稿 → 点击驱动 16:9 网页,可选 TTS + `?auto=1` 一镜到底录屏 —— 来源 article §3
- wvp 出处:刚从 ConardLi 的 garden-skills 蒸馏(300KB 精选、主题 23→10) —— 来源 article §3
- 自指:"你现在正在看的这个视频,就是用它做的" —— 来源 article §3

**开发计划**:

- step 1 (~6s) — 引入:三张 skill 卡片排队入场,标题"仓库三件套"
- step 2 (~8s) — svg-handdrawn:一句话指令 → 手绘 SVG 线条逐渐画出演示
- step 3 (~7s) — 倔脾气循环:画 → 渲染 → 自查 → 重画,环形流程点亮
- step 4 (~8s) — task-scheduler:定时指令卡两张(每小时查部署/十分钟后提醒)
- step 5 (~5s) — 任务队列:几十个任务排队,跑完一个划掉一个
- step 6 (~9s) — 断点续跑:任务进度条中断 → 从检查点标记处继续,而非回到起点
- step 7 (~8s) — wvp:文章页 → 网页舞台变形演示,点击一步步推进 + 一镜到底录屏标注
- step 8 (~7s) — 自指定场:"你现在正在看的这个视频,就是用它做的"

口播节选:
> 第一个,svg-handdrawn。你说人话,它画图。……你现在正在看的这个视频,就是用它做的。

---

## 4. layout — 一个真相源,一排符号链接(7 steps · ~48s)

**信息池**:
- 布局:真内容唯一真相源在 `plugins/<name>/skills/<name>/`,每 skill 一个 plugin + `.claude-plugin/plugin.json`(名称 + 语义化版本号) —— 来源 article §4
- 机制:`.agents/skills/<name>` 是提交进 git 的相对符号链接 → `../../plugins/<name>/skills/<name>`,Codex/pi 仓库内零安装发现 —— 来源 article §4
- 大坑:Claude Code 安装 plugin 时**复制**整个目录;plugin 内指向兄弟目录的链接复制后变死链 —— 来源 article §4
- 原则:"符号链接只能放在 Claude 安装器永远不会碰的 `.agents/skills/` 里" —— 来源 article §4
- pi 限制:v0.80.6 实测**不跟随符号链接**;install.sh 对 pi 用复制 —— 来源 article §4

**开发计划**:

- step 1 (~7s) — 章节转场:仓库全景缩略图定位
- step 2 (~7s) — 目录演示:plugins/ 唯一真相源,plugin.json 版本号角标
- step 3 (~7s) — 符号链接演示:.agents/skills 一排链接线全部指回 plugins,扫一遍全部点亮
- step 4 (~7s) — 坑引入:Claude 安装 = 整个目录复制出去
- step 5 (~7s) — 死链演示:链接放 plugin 内部 → 复制后断链变红,skill 报废
- step 6 (~6s) — 结论定场:链接只能放 Claude 永远不碰的地方,方向反了全盘皆输
- step 7 (~7s) — pi 特例:扫描不跟链接 → 安装脚本对 pi 复制真实文件

口播节选:
> 真内容只存一份,在 plugins 目录下。……方向反了,全盘皆输。

---

## 5. toolchain — 三个脚本转一圈(10 steps · ~53s)

**信息池**:
- new-skill.sh:一键脚手架——plugin 目录、SKILL.md 模板、evals 模板、符号链接、marketplace 注册 —— 来源 article §5
- validate.sh 检查清单:name == 目录名、description ≤1024 字符、SKILL.md <500 行(硬限)、evals 3~5 条、agent 中性措辞、marketplace ↔ plugins 双向一致 —— 来源 article §5
- CI:每次 push 跑 validate.sh —— 来源 article §5
- evals/evals.json:3~5 条真实场景 + 定性预期产出,改动后重跑 —— 来源 article §2/§5
- install.sh:claude→`~/.claude/skills/` 链接、codex→`~/.agents/skills/` 链接、pi→复制 —— 来源 article §5
- 家规:规则写成决策不是感觉;内建自验证(agent 中性表述);内容一变 bump 版本 —— 来源 article §5

**开发计划**:

- step 1 (~5s) — 流水线总览:三个脚本节点连成环,"转一圈,上线"
- step 2 (~6s) — new-skill 演示:命令行敲下,目录树瞬间长出
- step 3 (~8s) — validate 演示:终端输出滚动,四项检查与口播"挨个查"同步逐项打勾
- step 4 (~5s) — CI:push 事件触发 validate,闸门绿放行
- step 5 (~6s) — evals:3~5 条用例卡片,改动→重跑,东墙西墙对比
- step 6 (~5s) — install 演示:三个 agent 位,链接/链接/复制 差异标注
- step 7 (~6s) — install 路径卡:两个目标目录点亮,pi 的复制位单独标
- step 8 (~4s) — 家规 1/3:"规则写成决策,不写感觉"亮起
- step 9 (~3s) — 家规 2/3:"产出后自己检查再交付"亮起,家规 1 灰化
- step 10 (~3s) — 家规 3/3:"内容一变,版本号跟着变"亮起,三条合览

口播节选:
> 工具链就三个脚本,转一圈,一个 skill 上线。……防止改好了东墙,塌了西墙。

---

## 6. casestudy — 蒸馏实战与收尾(8 steps · ~56s)

**信息池**:
- 案例:web-video-presentation,外部 skill 300KB —— 来源 article §6
- 蒸馏动作:留 6 份方法论文档 + 完整 Vite 模板;主题 23→10(明暗各半场景互补);删 EXAMPLES + README×2 + manifest;frontmatter 重写路由风格 —— 来源 article §6
- bug:create-vite 把绝对路径错误拼到 cwd 后面,项目建错位置;scaffold.sh 加路径归一化加固,两种传法验证 —— 来源 article §6
- 结果:validate 零 error,一次提交上线 —— 来源 article §6
- 方法论:"把一次性经验,蒸馏成带自验证、带回归用例的可复用工作流" —— 来源 article §7
- CTA 落点:GitHub 搜 skill-forge / fork + new-skill —— 来源 article §7

**开发计划**:

- step 1 (~7s) — 案例引入:GitHub 仓库卡(300KB)→ skill-forge 仓库卡
- step 2 (~8s) — 蒸馏决策演示:留/精选 23→10/删,与口播连述同步逐区点亮
- step 3 (~5s) — frontmatter 重写:前后对比,路由字段点亮
- step 4 (~9s) — 冒烟抓 bug:终端构建输出 + 绝对路径错误示意,红色叉
- step 5 (~5s) — 修复上线:加固代码位 + validate 零 error 绿勾
- step 6 (~8s) — 方法论定场金句:"一次性经验 → 可复用工作流"
- step 7 (~4s) — 收束三联:写一遍 / 三 agent / CI 保质
- step 8 (~10s) — CTA:GitHub 搜 skill-forge,fork + new-skill 演示,收尾

口播节选:
> 蒸馏不是搬运。……把一次性的经验,蒸馏成可复用的工作流。要带自验证,要带回归用例。

---

## 素材清单

### 1. coldopen
- ✓ 无外部素材:agent 名 / 轨道 / 门槛全部 CSS/SVG 绘制

### 2. anatomy
- ✓ 无外部素材:目录树 / 三层加载 / 配方卡全部代码绘制

### 3. skills-tour
- ✓ 无外部素材:skill 卡片 / 手绘线条 / 断点续跑 / 变形演示全部 CSS/SVG 绘制

### 4. layout
- ✓ 无外部素材:目录结构 / 符号链接线 / 死链演示全部 SVG 绘制

### 5. toolchain
- ✓ 无外部素材:终端输出 / 流水线节点 / 用例卡全部模拟终端 + CSS 绘制

### 6. casestudy
- ✓ 无外部素材:仓库卡片 / 对比 / 终端全部代码绘制;不使用真实截图,避免假 logo
