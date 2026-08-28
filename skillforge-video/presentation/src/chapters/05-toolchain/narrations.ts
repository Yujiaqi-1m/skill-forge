import type { Narration } from "../../registry/types";

/**
 * Chapter 5 · toolchain — 10 steps.
 * Text mirrors script.md beats (三个脚本 / new-skill / validate / CI /
 * evals / install / 路径 / 家规×3). Kept verbatim.
 * Length must equal the number of step branches in Toolchain.tsx.
 */
export const narrations: Narration[] = [
  "工具链就三个脚本,转一圈,一个 skill 上线。",
  "第一个,new-skill。一键脚手架,目录、模板、链接、注册,一次建全。",
  "第二个,validate,仓库级 lint。名字对不对、描述长没长、行数超没超、有没有写死工具名,挨个查。",
  "CI 每次 push 都跑它,想偷懒都不行。",
  "它还逼你配回归用例。每个 skill 必须配三到五条真实场景。skill 一改,重跑一遍。防止改好了东墙,塌了西墙。",
  "第三个,install。Claude 和 Codex 链接过去,pi 特殊,复制一份。",
  "装到哪?Claude 链接进 .claude/skills,Codex 链接进 .agents/skills。",
  "还有三条家规。规则写成决策,不写感觉。",
  "产出后自己检查再交付。",
  "内容一变,版本号跟着变。",
];
