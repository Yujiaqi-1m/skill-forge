import type { Narration } from "../../registry/types";

/**
 * Chapter 2 · anatomy — 10 steps.
 * Text mirrors script.md beats 10-19 (semantic parity, punctuation tuned for TTS).
 * Length must equal the number of step branches in Anatomy.tsx. Keep in sync.
 */
export const narrations: Narration[] = [
  "先看一个 skill 长什么样。核心就一个 SKILL.md,加三个子目录。",
  "最要命的是开头那几行,叫 description。它不是文档,是路由器。",
  "为什么?agent 的上下文里,永远只驻留这一小段。",
  "正文呢,触发之后才加载。",
  "再往下的 references,用到才读。",
  "三层渐进加载,常驻成本就一百来个词。",
  "所以描述写不好,你的 skill 永远不会被触发。里面写得再牛,也白搭。",
  "描述怎么写?能力一句。",
  "触发词一排。",
  "边界一条。中英文触发词都要有。",
];
