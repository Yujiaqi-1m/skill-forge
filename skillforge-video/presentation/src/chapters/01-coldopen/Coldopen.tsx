import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Coldopen.css";

/**
 * Chapter 1 · coldopen — "同一个 skill,三个 agent"(9 steps)。
 *
 * 每步独占整屏;视觉演示:SVG 连线自绘 / 门槛升起 / 终端入场 /
 * 轨道逐条点亮(一项一 step)/ 撞门弹回 / 三线汇聚。
 * 颜色字体全部走主题 token。
 */

/** step 5~7 共用:三条 agent 轨道,activeIndex 指示当前亮起的一条(0-based;-1 无) */
function agentTracks(activeIndex: number, showBreak: boolean) {
  const tracks = [
    { name: "Claude", sub: "plugin marketplace" },
    { name: "Codex", sub: "~/.agents/skills" },
    { name: "pi", sub: "/skill:<name>" },
  ];
  return (
    <>
      <div className="cd-s4-tracks">
        {tracks.map((t, i) => (
          <div
            key={t.name}
            className={[
              "cd-track",
              i < activeIndex ? "cd-track-done" : "",
              i === activeIndex ? "cd-track-active" : "",
              i > activeIndex ? "cd-track-pending" : "",
            ].filter(Boolean).join(" ")}
          >
            <span className="label-mono cd-track-name">{t.name}</span>
            <span className="cd-track-bar" style={i === activeIndex ? { animationDelay: "300ms" } : undefined} />
            <span className="label-mono cd-track-sub">{t.sub}</span>
          </div>
        ))}
      </div>
      {showBreak && (
        <div className="cd-s4-break">
          <span className="cd-cross" />
          <span className="label-mono cd-s4-x">互不相通</span>
          <span className="cd-cross" />
        </div>
      )}
    </>
  );
}

export default function Coldopen({ step }: ChapterStepProps) {
  /* step 0 — 三 agent 并排 + 中央 SKILL.md,连线自绘 */
  if (step === 0) {
    return (
      <div className="cd-scene scene-pad cd-s0">
        <div className="kicker">skill-forge · 教学讲解</div>
        <div className="cd-s0-stage">
          <div className="cd-file card">
            <span className="mono cd-file-name">SKILL.md</span>
          </div>
          <svg className="cd-s0-lines" viewBox="0 0 1120 190" aria-hidden>
            <path className="cd-line" style={{ animationDelay: "500ms" }} d="M560 10 C 400 80, 280 110, 170 165" />
            <path className="cd-line" style={{ animationDelay: "640ms" }} d="M560 10 C 560 90, 560 120, 560 165" />
            <path className="cd-line" style={{ animationDelay: "780ms" }} d="M560 10 C 720 80, 840 110, 950 165" />
          </svg>
          <div className="cd-agents">
            <div className="cd-agent card" style={{ animationDelay: "950ms" }}>
              <span className="serif-it cd-agent-en">Claude Code</span>
              <span className="label-mono cd-agent-sub">plugin marketplace</span>
            </div>
            <div className="cd-agent card" style={{ animationDelay: "1090ms" }}>
              <span className="serif-it cd-agent-en">Codex CLI</span>
              <span className="label-mono cd-agent-sub">.agents/skills</span>
            </div>
            <div className="cd-agent card" style={{ animationDelay: "1230ms" }}>
              <span className="serif-it cd-agent-en">pi</span>
              <span className="label-mono cd-agent-sub">/skill 命令</span>
            </div>
          </div>
        </div>
        <div className="cd-s0-foot">
          <h1 className="cd-h1 serif-cn">
            <MaskReveal show duration={1000}>三个 agent 同时在用</MaskReveal>
          </h1>
          <div className="cd-s0-once label-mono">
            <span className="dot-accent" />&nbsp;written&nbsp;
            <span className="hero-num cd-x1">×1</span>
          </div>
        </div>
      </div>
    );
  }

  /* step 1 — "最难的不是写,是让三家都认":三道门槛升起 */
  if (step === 1) {
    return (
      <div className="cd-scene scene-pad cd-s1">
        <h1 className="cd-h1 serif-cn cd-s1-h">
          <MaskReveal show duration={900}>
            <span className="cd-dim">最难的不是</span>
          </MaskReveal>
          <MaskReveal show delay={350} duration={900}>
            <span className="serif-it cd-em">写</span>
          </MaskReveal>
        </h1>
        <h1 className="cd-h1 serif-cn">
          <MaskReveal show delay={750} duration={1000}>是让三家都认</MaskReveal>
        </h1>
        <div className="cd-s1-gates">
          <div className="cd-gate" style={{ animationDelay: "1150ms" }}>
            <span className="label-mono">Claude Code</span>
            <span className="cd-gate-bar" />
          </div>
          <div className="cd-gate" style={{ animationDelay: "1350ms" }}>
            <span className="label-mono">Codex CLI</span>
            <span className="cd-gate-bar" />
          </div>
          <div className="cd-gate" style={{ animationDelay: "1550ms" }}>
            <span className="label-mono">pi</span>
            <span className="cd-gate-bar" />
          </div>
        </div>
        <div className="serif-it cd-note-en cd-s1-note">adoption is the hard part</div>
      </div>
    );
  }

  /* step 2 — 引入真仓库:路径 + 标题,分割线生长 */
  if (step === 2) {
    return (
      <div className="cd-scene scene-pad cd-s2">
        <div className="mono cd-s2-path">
          ~/github/skill-forge<span className="cd-caret" />
        </div>
        <h1 className="cd-h1-xl serif-cn">
          <MaskReveal show duration={1000}>写一遍,</MaskReveal>
          <MaskReveal show delay={400} duration={1000}>
            <span className="cd-em">处处能用</span>
          </MaskReveal>
        </h1>
        <div className="cd-s2-rule" />
        <div className="serif-it cd-note-en cd-s2-en">one source, three runtimes</div>
      </div>
    );
  }

  /* step 3 — 痛点:人 + 周围的多个 agent 终端(依次入场) */
  if (step === 3) {
    return (
      <div className="cd-scene scene-pad cd-s3">
        <h1 className="cd-h2 serif-cn cd-s3-h">
          <MaskReveal show duration={900}>你手边肯定不止一个</MaskReveal>
          <MaskReveal show delay={350} duration={900}>
            <span className="serif-it cd-em"> coding agent</span>
          </MaskReveal>
        </h1>
        <div className="cd-s3-field">
          <svg className="cd-person" viewBox="0 0 120 120" aria-hidden>
            <circle cx="60" cy="34" r="22" className="cd-person-stroke" />
            <path d="M18 108 C 22 72, 98 72, 102 108" className="cd-person-stroke" />
          </svg>
          <div className="cd-term card" style={{ animationDelay: "300ms" }}>
            <span className="label-mono cd-term-t">claude</span>
            <span className="cd-term-l1" /><span className="cd-term-l2" />
          </div>
          <div className="cd-term card" style={{ animationDelay: "700ms" }}>
            <span className="label-mono cd-term-t">codex</span>
            <span className="cd-term-l1" /><span className="cd-term-l2" />
          </div>
          <div className="cd-term card" style={{ animationDelay: "1100ms" }}>
            <span className="label-mono cd-term-t">pi</span>
            <span className="cd-term-l1" /><span className="cd-term-l2" />
          </div>
          <div className="cd-term card" style={{ animationDelay: "1500ms" }}>
            <span className="label-mono cd-term-t cd-caret-t">zsh<span className="cd-caret" /></span>
            <span className="cd-term-l1" /><span className="cd-term-l2" />
          </div>
        </div>
      </div>
    );
  }

  /* step 4~6 — 一人一套:三条轨道逐条点亮(一项一 step,禁一次全上) */
  if (step === 4 || step === 5 || step === 6) {
    const active = step - 4;
    return (
      <div className="cd-scene scene-pad cd-s4">
        <h1 className="cd-h2 serif-cn cd-s4-h">
          <MaskReveal show duration={900}>一人一套,各自为政</MaskReveal>
        </h1>
        {agentTracks(active, step === 6)}
      </div>
    );
  }

  /* step 7 — 插件挪过去被拒:撞门弹回 + ×3 */
  if (step === 7) {
    return (
      <div className="cd-scene scene-pad cd-s5">
        <h1 className="cd-h2 serif-cn cd-s5-h">
          <MaskReveal show duration={900}>挪过去,</MaskReveal>
          <MaskReveal show delay={300} duration={900}>
            <span className="cd-em">根本看不见</span>
          </MaskReveal>
        </h1>
        <div className="cd-s5-stage">
          <div className="cd-pkg card">
            <span className="label-mono">claude-plugin</span>
          </div>
          <div className="cd-door">
            <span className="cd-door-frame" />
            <span className="label-mono cd-door-x">NOT FOUND</span>
          </div>
        </div>
        <div className="cd-s5-three">
          <span className="cd-s5-q label-mono">写三遍?</span>
          <span className="hero-num cd-s5-num">×3</span>
          <span className="cd-s5-q label-mono">没人受得了</span>
        </div>
      </div>
    );
  }

  /* step 8 — 答案定场:三线汇聚成一份源码 */
  return (
    <div className="cd-scene scene-pad cd-s6">
      <div className="cd-s6-conv">
        <svg viewBox="0 0 900 300" aria-hidden>
          <path className="cd-line cd-line-slow" d="M60 60 C 350 60, 480 130, 600 150" />
          <path className="cd-line cd-line-slow" style={{ animationDelay: "220ms" }} d="M60 150 C 320 150, 460 150, 600 150" />
          <path className="cd-line cd-line-slow" style={{ animationDelay: "440ms" }} d="M60 240 C 350 240, 480 170, 600 150" />
        </svg>
        <div className="cd-core">
          <span className="cd-core-dot" />
        </div>
      </div>
      <h1 className="cd-h1 serif-cn cd-s6-h">
        <MaskReveal show duration={1000}>一份源码,</MaskReveal>
        <MaskReveal show delay={400} duration={1000}>
          <span className="cd-em">三家认</span>
        </MaskReveal>
      </h1>
      <div className="label-mono cd-s6-std">
        <span className="dot-accent" />&nbsp;Agent Skills 标准 · agentskills.io
      </div>
    </div>
  );
}
