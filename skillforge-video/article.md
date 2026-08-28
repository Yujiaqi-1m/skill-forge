# 一次编写,三个 agent 都能用:skill-forge 教学讲解

## §1 痛点:每个 agent 一套扩展机制

2026 年写代码的人,手边往往不止一个 agent:Claude Code、OpenAI 的 Codex CLI、
pi。问题来了——每个 agent 的扩展机制都不一样。Claude Code 有自己的 plugin
marketplace;Codex CLI 从 `~/.agents/skills/` 和仓库里的 `.agents/skills/`
发现 skill;pi 也读 `.agents/skills/`,但注册成 `/skill:<name>` 命令。你给
Claude 写的插件,挪到 Codex 里它根本看不见。

给三个 agent 写三遍?没人受得了。这就是 skill-forge 这个仓库要解决的事:
**一份 skill 源码,三个 agent 直接可用**。它不是一个框架,就是一个仓库
布局约定 + 三个 shell 脚本,加上一条硬规矩:所有 skill 都按开放的
Agent Skills 标准(agentskills.io)写。

## §2 Agent Skills 标准:一个 skill 长什么样

Agent Skills 标准的产物就是一个目录,核心是一个 SKILL.md。它有三层
渐进加载:

- **第一层,frontmatter 里的 description**:这是唯一永远驻留在 agent
  上下文里的部分(约 100 词)。它不是文档,是路由器——agent 靠它判断
  "这个 skill 该不该被触发"。所以写法有讲究:能力一句话 + 中英文触发
  词 + 边界(不做什么)。描述写不好,skill 永远不会被触发,写得再好
  也白搭。
- **第二层,SKILL.md 正文**:触发后才加载,约定少于 500 行,只放工作流
  和规则。
- **第三层,references/、scripts/、assets/**:按需读取,不占常驻上下文。
  细节文档、可执行脚本、模板素材都放这里。

目录里还有一个强制项:`evals/evals.json`,3 到 5 条回归用例,每条是
一个真实用户会说的话 + 定性的预期产出。skill 每次改动后重跑,防止
改好了东墙塌了西墙。

## §3 仓库里现有哪三个 skill

**svg-handdrawn——说人话,画手绘图**。输入中英文自然语言("帮我画个流程图:代码
合入 main 后 CI 跑构建和测试,通过后部署预发,QA 验收完再上生产,失败就通知
值班"),输出白板手绘风格的 SVG 流程图:歪扭的边、排线填充、手写字体,像用
马克笔在白板上画的,而不是 draw.io 那种机械直线。支持 16:9 / 4:3 / A4 /
任意自定义宽高比。它内建"渲染-检查"循环:画完先栅格化成图片,自己看一遍
效果,不通过就迭代重画——交付到用户手上的,是它自己验收过的图。适用:
想把流程 / 系统 / 架构快速可视化,又嫌绘图工具太机械的时候。

**task-scheduler——让 agent 定时干活,断了能续**。管延迟任务、多步任务和
定时调度:任务记录落在 `.tasks/` 目录,支持一次性触发器,几十个
任务排队挨个跑也行。杀手锏是检查点日志 + 断点续跑——长任务跑到一半,agent
会话断了、甚至程序崩了,重新进来它从上次的检查点接着跑,而不是从头再来。
适用:"每小时检查一次部署""十分钟后提醒我""把这批链接挨个抓一遍,分几天
跑完"这类长程 / 定时活。

**web-video-presentation——文章进去,视频出来**。扔一篇文章或口播稿进去,
出来一个点击驱动的 16:9 网页演示:每点一下推进一步,看起来像视频,实际
是网页(Vite + React + TS)。可选 TTS 口播音频,合成后开 `?auto=1` 就能
一镜到底录屏,音画天然同步。适用:"把这篇文章做成视频"、动态
PPT、B 站 / YouTube 录屏教程。你现在正在看的这个视频,就是用它做的。

## §4 skill-forge 的仓库设计:一个真相源 + 一排符号链接

skill-forge 的核心决策:**真内容只存一份,放在 `plugins/<name>/skills/<name>/`**,
这是唯一真相源。每个 skill 是一个独立 plugin,自带 `.claude-plugin/plugin.json`
(名称 + 语义化版本号)。

仓库根的 `.agents/skills/<name>` 放的是**提交进 git 的相对符号链接**,
指向 `../../plugins/<name>/skills/<name>`。Codex 和 pi 在仓库里跑的时候
会扫描 `.agents/skills/`,这样零安装就能发现所有 skill。

为什么不反过来(根目录放 skills/,plugin 包一层)?这里有个实测出来的
坑:**Claude Code 安装 plugin 时会把整个 plugin 目录复制出去**。如果
符号链接在 plugin 目录内部、指向旁边的兄弟目录,复制到
`~/.claude/plugins/` 之后就是一条死链——skill 直接报废。所以符号链接
只能放在 Claude 安装器永远不会碰的 `.agents/skills/` 里。

还有一个实测限制:pi v0.80.6 的扫描**不跟随符号链接**。所以
`install.sh --agent pi` 默认不用链接,直接复制真实目录到
`~/.agents/skills/`;Codex 官方支持符号链接;Claude Code 推荐直接走
marketplace 安装。

## §5 工具链:三个脚本转一圈,一个 skill 上线

- `new-skill.sh <name> "描述"`:一键脚手架。建 plugin 目录、SKILL.md
  模板、evals 模板、符号链接、marketplace 注册,一次全建好。
- `validate.sh`:仓库级 lint。检查 frontmatter 的 name 和目录名一致、
  description 不超过 1024 字符、SKILL.md 少于 500 行(硬限)、evals
  必须有 3 到 5 条、正文不能出现特定 agent 的工具名(agent 中性措辞)、
  marketplace.json 和 plugins/ 目录双向一致。CI 在每次 push 时跑它。
- `install.sh --agent claude|codex|pi`:把 skill 暴露给指定 agent——
  Claude 用符号链接进 `~/.claude/skills/`,Codex 符号链接进
  `~/.agents/skills/`,pi 复制副本。

写 skill 的三条家规:规则要写成决策而不是感觉(确切的命令、字体、
阈值,并带上为什么);skill 必须内建自我验证(产出后自己检查再交付,
但措辞用 agent 中性表述,不点名某个 harness 的工具);skill 内容一变
就 bump plugin.json 的版本号。

## §6 实战:蒸馏一个外部 skill

仓库里最新的 skill,web-video-presentation,就是把 GitHub 上别人 300KB
的 skill 蒸馏进来的完整案例。外部 skill 质量很高但夹带大量冗余。蒸馏
动作:保留 6 份方法论文档和完整的 Vite 模板;主题从 23 套精选到 10 套
(明暗各半、场景互补);删掉示例目录、两份人类向 README 和 manifest;
frontmatter 重写成路由风格。

蒸馏不是搬运。冒烟测试时跑两个主题的脚手架 + `npm run build`,结果
抓到一个真 bug:create-vite 会把绝对路径参数错误地拼到当前目录后面,
项目建错位置。顺手在 scaffold.sh 里加了路径归一化加固,两种传法都
验证通过。最后 `validate.sh` 零 error,一次提交上线。

## §7 收尾

整个仓库的方法论就一句话:把一次性的经验,蒸馏成带自验证、带回归
用例、按开放标准写的可复用工作流。skill 写一遍,三个 agent 受益,
CI 保证它不烂掉。
