import type { Narration } from "../../registry/types";

/**
 * Chapter 3 · skills-tour — 8 steps.
 * Text mirrors script.md beats for §3 (仓库三件套), verbatim.
 * Length must equal the number of step branches in SkillsTour.tsx
 * (if-chains + the default branch). Keep them in sync.
 */
export const narrations: Narration[] = [
  "光说结构有点抽象。直接看仓库里三个真货。",
  "第一个,svg-handdrawn。你说人话,它画图。比如\"帮我画个 CI 流程图\"。一句话,手绘风的 SVG 就出来了。16:9、A4,宽高比随便挑。",
  "它还有个倔脾气:画完先自己渲染成图片,自己看一遍,不满意就重画。到你手上的,都是它自己验收过的。嫌绘图工具太机械?找它。",
  "第二个,task-scheduler。让 agent 定时干活:每小时查一次部署,十分钟后提醒我,都行。任务全记在 .tasks 目录里。",
  "排队也行。几十个任务挨个跑,跑完一个划掉一个。",
  "它的杀手锏是断点续跑。长任务跑到一半,会话断了。重新进来,它从上次的检查点接着跑,不是从头再来。",
  "第三个,web-video-presentation。扔一篇文章进去,出来一个能录屏的网页。一步一步演,像视频一样。配上口播音频,一镜到底录屏。",
  "你现在正在看的这个视频,就是用它做的。",
];
