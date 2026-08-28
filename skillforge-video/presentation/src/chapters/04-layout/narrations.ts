import type { Narration } from "../../registry/types";

/**
 * Chapter 4 · layout — 7 steps.
 * Text mirrors script.md beats 33-39 (semantic parity, punctuation tuned for TTS).
 * Length must equal the number of step branches in Layout.tsx
 * (if-chains + the default branch). Keep them in sync.
 */
export const narrations: Narration[] = [
  "再看仓库布局,这是最有意思的部分。",
  "真内容只存一份,在 plugins 目录下。每个 skill 一个 plugin,自带版本号。",
  "仓库根的 .agents/skills 里,放一排符号链接,全部指回 plugins。Codex 和 pi 在仓库里跑,扫一眼就行。零安装,全部 skill 直接可用。",
  "但有个坑,实测踩出来的。Claude 装 plugin 的时候,会把整个目录复制出去。",
  "要是符号链接放在 plugin 里面,复制完,链接就是死的。skill 直接报废。",
  "所以链接只能放在 Claude 永远不碰的地方。方向反了,全盘皆输。",
  "pi 还有自己的脾气。实测下来,它扫描目录不跟符号链接。所以安装脚本对 pi 直接复制文件,不搞链接。",
];
