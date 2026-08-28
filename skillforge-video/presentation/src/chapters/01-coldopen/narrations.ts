import type { Narration } from "../../registry/types";

/**
 * Chapter 1 · coldopen — 9 steps.
 * Text mirrors script.md beats 1-9 (semantic parity, punctuation tuned for TTS).
 * Length must equal the number of step branches in Coldopen.tsx
 * (if-chains + the default branch). Keep them in sync.
 */
export const narrations: Narration[] = [
  "同一个 skill,Claude Code、Codex、pi,三个 agent 同时在用。我只写了一遍。",
  "你猜这里面最难的是什么?不是写,是让三家都认。",
  "今天拆一个真仓库,skill-forge。看它怎么做到写一遍,处处能用。",
  "先说痛点。你手边肯定不止一个 coding agent。",
  "Claude 一套插件机制。",
  "Codex 一套目录约定。",
  "pi 又是一套。",
  "你给 Claude 写的插件,挪到 Codex 里,它根本看不见。写三遍?没人受得了。",
  "skill-forge 的答案特别朴素:所有 skill 按开放的 Agent Skills 标准写。一份源码,三家直接认。",
];
