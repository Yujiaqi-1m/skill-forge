import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Anatomy.css";

/**
 * Chapter 2 · anatomy — "一个 skill 长什么样"(10 steps)。
 *
 * 视觉演示:目录树分支生长 / frontmatter 高亮扫过 / 三层塔逐层点亮
 * (一层一 step,清单铁律)/ 常驻聚焦 / 沉底警示 / 配方格逐格揭示。
 * 颜色字体全走主题 token。
 */

/** step 2~5 共用:三层加载塔,activeIndex 指当前亮起的层(0-based) */
function layerStack(activeIndex: number, allLit: boolean) {
  const layers = [
    { tag: "description", note: "常驻 · ~100 词", sub: "frontmatter 头几行" },
    { tag: "SKILL.md 正文", note: "触发才加载 · <500 行", sub: "工作流 + 规则" },
    { tag: "references/ scripts/", note: "按需读 · 不限量", sub: "细节文档 / 可执行脚本" },
  ];
  return (
    <div className="an-stack">
      {layers.map((l, i) => {
        const active = allLit ? i === 0 : i === activeIndex;
        const dimmed = !allLit && i < activeIndex;        // 已讲过 · 保留上下文
        const pending = allLit ? i > 0 : i > activeIndex; // 未讲到 / 非常驻
        return (
          <div
            key={l.tag}
            className={[
              "an-layer",
              active ? "an-layer-active" : "",
              dimmed ? "an-layer-dim" : "",
              pending ? "an-layer-pending" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={active && !allLit ? { animationDelay: "200ms" } : undefined}
          >
            <span className="an-layer-tag label-mono">{l.tag}</span>
            <span className="an-layer-note label-mono">{l.note}</span>
            <span className="an-layer-sub">{l.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Anatomy({ step }: ChapterStepProps) {
  /* step 0 — 目录树:SKILL.md 高亮,三个子目录分支生长 */
  if (step === 0) {
    return (
      <div className="an-scene scene-pad an-s0">
        <h1 className="an-h2 serif-cn an-s0-h">
          <MaskReveal show duration={900}>一个 skill 长什么样</MaskReveal>
        </h1>
        <div className="an-tree mono">
          <div className="an-tree-root">my-skill/</div>
          <div className="an-tree-branches">
            <div className="an-tree-item an-tree-hl" style={{ animationDelay: "500ms" }}>
              <span className="an-tree-connector" />SKILL.md
              <span className="label-mono an-tree-star">★ 核心</span>
            </div>
            <div className="an-tree-item" style={{ animationDelay: "900ms" }}>
              <span className="an-tree-connector" />references/
            </div>
            <div className="an-tree-item" style={{ animationDelay: "1150ms" }}>
              <span className="an-tree-connector" />scripts/
            </div>
            <div className="an-tree-item" style={{ animationDelay: "1400ms" }}>
              <span className="an-tree-connector" />assets/
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 1 — SKILL.md 放大:frontmatter 中 description 行高亮 */
  if (step === 1) {
    return (
      <div className="an-scene scene-pad an-s1">
        <div className="an-file card">
          <div className="mono an-fm">
            <div className="an-fm-line an-fm-dim">---</div>
            <div className="an-fm-line">name: my-skill</div>
            <div className="an-fm-line an-fm-hl" style={{ animationDelay: "600ms" }}>
              description: 把文章变成视频网页…
            </div>
            <div className="an-fm-line an-fm-dim">---</div>
          </div>
        </div>
        <h1 className="an-h1 serif-cn an-s1-h">
          <MaskReveal show delay={900} duration={900}>
            不是文档,是<span className="serif-it an-em">路由器</span>
          </MaskReveal>
        </h1>
      </div>
    );
  }

  /* step 2~4 — 三层塔逐层点亮(一层一 step) */
  if (step === 2 || step === 3 || step === 4) {
    return (
      <div className="an-scene scene-pad an-s2">
        <h1 className="an-h2 serif-cn an-s2-h">
          <MaskReveal show duration={800}>三层渐进加载</MaskReveal>
        </h1>
        {layerStack(step - 2, false)}
      </div>
    );
  }

  /* step 5 — 全塔视角:只有第一层常驻,hero 数字 */
  if (step === 5) {
    return (
      <div className="an-scene scene-pad an-s5">
        {layerStack(0, true)}
        <div className="an-s5-hero">
          <span className="serif-cn an-s5-pre">常驻成本</span>
          <span className="hero-num an-s5-num">≈100</span>
          <span className="serif-cn an-s5-suf">词</span>
        </div>
      </div>
    );
  }

  /* step 6 — 反面:描述写不好,skill 沉底永不触发 */
  if (step === 6) {
    return (
      <div className="an-scene scene-pad an-s6">
        <div className="an-sink card">
          <span className="mono an-sink-name">vague-skill</span>
          <span className="label-mono an-sink-desc">description: 一个有用的工具</span>
        </div>
        <h1 className="an-h2 serif-cn an-s6-h">
          <MaskReveal show delay={800} duration={900}>
            描述写不好 = <span className="an-em">永远不会被触发</span>
          </MaskReveal>
        </h1>
        <div className="serif-it an-note-en an-s6-en">never triggered, never matters</div>
      </div>
    );
  }

  /* step 7~9 — 描述配方:三格逐格揭示 */
  const recipeIndex = step - 7; // 0,1,2
  const cells = [
    { k: "01", t: "能力一句", e: "what it does" },
    { k: "02", t: "触发词一排", e: "when to trigger" },
    { k: "03", t: "边界一条", e: "what it won't do" },
  ];
  return (
    <div className="an-scene scene-pad an-s7">
      <h1 className="an-h2 serif-cn an-s7-h">
        <MaskReveal show duration={800}>描述配方</MaskReveal>
      </h1>
      <div className="an-recipe">
        {cells.map((c, i) => (
          <div
            key={c.k}
            className={["an-cell card", i === recipeIndex ? "an-cell-active" : "", i < recipeIndex ? "an-cell-dim" : "", i > recipeIndex ? "an-cell-pending" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="label-mono an-cell-k">{c.k}</span>
            <span className="serif-cn an-cell-t">{c.t}</span>
            <span className="serif-it an-cell-e">{c.e}</span>
            {i === 1 && i === recipeIndex && (
              <span className="an-chips">
                <span className="an-chip label-mono">把文章做成视频</span>
                <span className="an-chip label-mono">动态 PPT</span>
                <span className="an-chip label-mono">web presentation</span>
              </span>
            )}
          </div>
        ))}
      </div>
      {recipeIndex === 2 && (
        <div className="label-mono an-s7-note">
          <span className="an-chip an-chip-on label-mono">中文触发词</span>+
          <span className="an-chip an-chip-on label-mono">english triggers</span>
          &nbsp;都要有
        </div>
      )}
    </div>
  );
}
