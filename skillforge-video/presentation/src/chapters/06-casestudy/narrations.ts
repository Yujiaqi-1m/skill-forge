import type { Narration } from "../../registry/types";

/**
 * Chapter 6 · casestudy — 8 steps(收官章)。
 * Text mirrors script.md final 8 beats (verbatim, punctuation as in script).
 * Length must equal the number of step branches in Casestudy.tsx. Keep in sync.
 */
export const narrations: Narration[] = [
  "压轴看一个实战。仓库里最新的 skill,是蒸馏来的。GitHub 上别人三百 KB 的作品。",
  "怎么蒸?方法论和完整模板留下,主题二十三套精选到十套,示例和 README 删掉。",
  "frontmatter 也重写成路由风格,中英触发词配齐。",
  "蒸馏不是搬运。冒烟测试跑了两个主题的构建。结果抓到一个真 bug。脚手架把绝对路径拼错了。项目直接建到别的目录去。",
  "顺手加固修复。两种传法都验证过。零 error,才提交上线。",
  "这个仓库干的事,就一个。把一次性的经验,蒸馏成可复用的工作流。要带自验证,要带回归用例。",
  "写一遍,三个 agent 受益,CI 保证它不烂。",
  "想自己整一个?GitHub 搜 skill-forge。fork 完跑一遍 new-skill,你就有一个自己的 forge。评论区聊聊你打算蒸馏什么。",
];
