import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Layout.css";

/**
 * Chapter 4 · layout — "一个真相源,一排符号链接"(7 steps)。
 *
 * 每步独占整屏;视觉演示:全景图聚焦环 / 版本角标落章 /
 * 三弧线自绘 + 扫描带点亮 / 目录卡复制飞出 / 链接断裂变虚线红叉 /
 * 对错双布局盖章 / 扫描光束停死 + 复制真身。颜色字体全走主题 token。
 * 画面数据全部来自真实仓库(plugin.json 版本号 / 链接目标路径)。
 */

/** step 1 · plugins/ 三张 plugin 卡(版本号来自仓库真实 plugin.json) */
const PLUGINS = [
  { name: "svg-handdrawn", ver: "0.1.2", skill: "skills/svg-handdrawn/" },
  { name: "task-scheduler", ver: "0.1.0", skill: "skills/task-scheduler/" },
  { name: "web-video-presentation", ver: "0.1.0", skill: "skills/web-video-presentation/" },
];

/** step 2 · 左列符号链接卡与右列 plugins 目标一一对应(同名) */

export default function Layout({ step }: ChapterStepProps) {
  /* step 0 — 章节转场:仓库全景缩略图,聚焦环锁定 plugins/ */
  if (step === 0) {
    const children = [
      { name: "plugins/", sub: "3 个 skill · 真内容", focus: true },
      { name: ".agents/skills/", sub: "3 条符号链接", focus: false },
      { name: "scripts/", sub: "3 个 shell 脚本", focus: false },
    ];
    return (
      <div className="lo-scene scene-pad lo-s0">
        <div className="kicker lo-s0-k">skill-forge · repo layout</div>
        <h1 className="lo-h1 serif-cn lo-s0-h">
          <MaskReveal show duration={900}>仓库布局,</MaskReveal>
          <MaskReveal show delay={450} duration={900}>
            <span className="lo-em">最有意思</span>的部分
          </MaskReveal>
        </h1>
        <div className="lo-map">
          <div className="lo-map-root card">
            <span className="mono lo-map-name">skill-forge/</span>
          </div>
          <svg className="lo-map-lines" viewBox="0 0 1240 190" aria-hidden>
            <path className="lo-map-line" style={{ animationDelay: "500ms" }} d="M620 0 C 620 70, 180 90, 180 186" />
            <path className="lo-map-line" style={{ animationDelay: "640ms" }} d="M620 0 C 620 70, 620 90, 620 186" />
            <path className="lo-map-line" style={{ animationDelay: "780ms" }} d="M620 0 C 620 70, 1060 90, 1060 186" />
          </svg>
          <div className="lo-map-children">
            {children.map((c) => (
              <div
                key={c.name}
                className={["lo-map-child card", c.focus ? "lo-map-child-focus" : "lo-map-child-dim"].join(" ")}
              >
                {c.focus && <span className="lo-focus-ring" />}
                <span className="mono lo-map-cname">{c.name}</span>
                <span className="label-mono lo-map-csub">{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* step 1 — plugins/ 唯一真相源:三张 plugin 卡 + 版本角标落章 */
  if (step === 1) {
    return (
      <div className="lo-scene scene-pad lo-s1">
        <h1 className="lo-h1 serif-cn lo-s1-h">
          <MaskReveal show duration={900}>真内容,</MaskReveal>
          <MaskReveal show delay={400} duration={900}>
            只存<span className="lo-em">一份</span>
          </MaskReveal>
        </h1>
        <div className="lo-s1-body">
          <div className="label-mono lo-s1-dir">plugins/ · 唯一真相源</div>
          <div className="lo-plugins">
            {PLUGINS.map((p, i) => (
              <div key={p.name} className="lo-plugin card" style={{ animationDelay: `${400 + i * 380}ms` }}>
                <div className="lo-plugin-top">
                  <span className="mono lo-plugin-name">{p.name}/</span>
                  <span className="lo-ver label-mono" style={{ animationDelay: `${900 + i * 380}ms` }}>
                    v{p.ver}
                  </span>
                </div>
                <span className="mono lo-plugin-skill">{p.skill}</span>
                <span className="mono lo-plugin-json">.claude-plugin/plugin.json</span>
              </div>
            ))}
          </div>
          <div className="lo-s1-foot label-mono" style={{ animationDelay: "2200ms" }}>
            <span className="dot-accent" />&nbsp;每个 skill 一个 plugin · 版本号写死在 plugin.json
          </div>
        </div>
      </div>
    );
  }

  /* step 2 — 核心视觉:.agents/skills 一排链接弧线指回 plugins,扫描带点亮 */
  if (step === 2) {
    const ys = [118, 258, 398];
    return (
      <div className="lo-scene scene-pad lo-s2">
        <h1 className="lo-h2 serif-cn lo-s2-h">
          <MaskReveal show duration={900}>一排符号链接,</MaskReveal>
          <MaskReveal show delay={400} duration={900}>
            全部<span className="lo-em">指回</span> plugins
          </MaskReveal>
        </h1>
        <div className="lo-s2-diagram">
          <span className="lo-scanband" aria-hidden />
          <svg className="lo-s2-svg" viewBox="0 0 1480 460" aria-hidden>
            <path className="lo-arc" style={{ animationDelay: "600ms" }} d="M410 118 C 660 30, 830 30, 1080 118" />
            <path className="lo-arc" style={{ animationDelay: "850ms" }} d="M410 258 C 660 258, 830 258, 1080 258" />
            <path className="lo-arc" style={{ animationDelay: "1100ms" }} d="M410 398 C 660 486, 830 486, 1080 398" />
            <circle className="lo-arc-dot" style={{ animationDelay: "1500ms" }} cx="410" cy="118" r="7" />
            <circle className="lo-arc-dot" style={{ animationDelay: "1650ms" }} cx="410" cy="258" r="7" />
            <circle className="lo-arc-dot" style={{ animationDelay: "1800ms" }} cx="410" cy="398" r="7" />
          </svg>
          <div className="label-mono lo-s2-colh" style={{ left: 0 }}>仓库根 · .agents/skills/</div>
          <div className="label-mono lo-s2-colh" style={{ right: 0 }}>plugins/ · 真内容</div>
          <div className="lo-s2-links">
            {PLUGINS.map((p, i) => (
              <div
                key={p.name}
                className="lo-link card"
                style={{ top: `${ys[i] - 48}px`, animationDelay: `${200 + i * 180}ms` }}
              >
                <span className="lo-link-row">
                  <span className="lo-link-glyph" aria-hidden>-&gt;</span>
                  <span className="mono lo-link-name">{p.name}</span>
                </span>
                <span className="mono lo-link-target">../../plugins/…</span>
              </div>
            ))}
          </div>
          <div className="lo-s2-targets">
            {PLUGINS.map((p, i) => (
              <div
                key={p.name}
                className="lo-target card"
                style={{ top: `${ys[i] - 48}px`, animationDelay: `${1350 + i * 180}ms` }}
              >
                <span className="mono lo-target-name">{p.name}/</span>
                <span className="label-mono lo-target-sub">skills/ 同名目录</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lo-s2-path">svg-handdrawn -&gt; ../../plugins/svg-handdrawn/skills/svg-handdrawn</div>
        <div className="lo-s2-badges">
          <span className="lo-chip label-mono" style={{ animationDelay: "2400ms" }}>Codex · 扫 .agents/skills/</span>
          <span className="lo-chip label-mono" style={{ animationDelay: "2650ms" }}>链接提交进 git · 相对路径</span>
          <span className="lo-chip lo-chip-on label-mono" style={{ animationDelay: "2900ms" }}>零安装 · 全部直接可用</span>
        </div>
      </div>
    );
  }

  /* step 3 — 坑引入:Claude 安装 = 整个目录复制出去(目录卡复制飞出) */
  if (step === 3) {
    return (
      <div className="lo-scene scene-pad lo-s3">
        <div className="lo-s3-h">
          <span className="lo-pit label-mono" style={{ animationDelay: "300ms" }}>实测踩出来的坑</span>
          <h1 className="lo-h2 serif-cn">
            <MaskReveal show delay={500} duration={900}>
              Claude 装 plugin = <span className="lo-em">整个目录复制出去</span>
            </MaskReveal>
          </h1>
        </div>
        <div className="lo-s3-diagram">
          <div className="lo-zone" style={{ animationDelay: "500ms" }}>
            <span className="label-mono lo-zone-h">仓库 · skill-forge/</span>
            <div className="lo-plugincard card" style={{ animationDelay: "900ms" }}>
              <span className="mono lo-plugincard-name">plugins/task-scheduler/</span>
              <span className="label-mono lo-plugincard-sub">整个 plugin 目录</span>
            </div>
          </div>
          <div className="lo-zone lo-zone-dst" style={{ animationDelay: "750ms" }}>
            <span className="label-mono lo-zone-h">~/.claude/plugins/</span>
            <div className="lo-slot">
              <span className="label-mono lo-slot-t">安装目的地</span>
            </div>
          </div>
          <div className="lo-fly card" aria-hidden>
            <span className="mono lo-fly-name">task-scheduler/</span>
            <span className="lo-fly-tag label-mono">copy</span>
          </div>
        </div>
        <div className="lo-s3-foot label-mono" style={{ animationDelay: "2900ms" }}>
          <span className="dot-accent" />&nbsp;不是引用,是 cp -r · 原样复制一份走
        </div>
      </div>
    );
  }

  /* step 4 — 死链演示:链接放 plugin 里,复制后实线断裂变虚线 + 红叉 */
  if (step === 4) {
    return (
      <div className="lo-scene scene-pad lo-s4">
        <h1 className="lo-h2 serif-cn lo-s4-h">
          <MaskReveal show duration={900}>复制完,</MaskReveal>
          <MaskReveal show delay={350} duration={900}>
            链接就是<span className="lo-em">死</span>的
          </MaskReveal>
        </h1>
        <div className="lo-s4-panels">
          <div className="lo-panel card" style={{ animationDelay: "400ms" }}>
            <span className="label-mono lo-panel-h">仓库里 · 复制前</span>
            <div className="lo-panel-stage">
              <div className="lo-pcard card">
                <span className="mono lo-pcard-name">task-scheduler/</span>
                <span className="mono lo-pcard-link"><span className="lo-em">-&gt;</span> svg-handdrawn</span>
                <span className="label-mono lo-pcard-sub">链接在 plugin 里面</span>
              </div>
              <div className="lo-pcard lo-pcard-sib card">
                <span className="mono lo-pcard-name">svg-handdrawn/</span>
                <span className="label-mono lo-pcard-sub">旁边的兄弟目录</span>
              </div>
              <svg className="lo-s4-svg" viewBox="0 0 600 300" aria-hidden>
                <path className="lo-s4-solid" style={{ animationDelay: "1100ms" }} d="M300 155 L 350 155" />
              </svg>
            </div>
          </div>
          <div className="lo-panel card" style={{ animationDelay: "750ms" }}>
            <span className="label-mono lo-panel-h lo-panel-h-bad">~/.claude/plugins/ · 复制后</span>
            <div className="lo-panel-stage">
              <div className="lo-pcard card">
                <span className="mono lo-pcard-name">task-scheduler/</span>
                <span className="mono lo-pcard-link lo-pcard-link-dead"><span className="lo-em">-&gt;</span> svg-handdrawn</span>
                <span className="label-mono lo-pcard-sub">链接跟着复制过去了</span>
              </div>
              <div className="lo-pcard lo-pcard-ghost">
                <span className="label-mono lo-pcard-sub">兄弟目录没跟来</span>
              </div>
              <svg className="lo-s4-svg" viewBox="0 0 600 300" aria-hidden>
                <path className="lo-s4-solid lo-s4-solid-vanish" d="M300 155 L 350 155" />
                <path className="lo-s4-broken" style={{ animationDelay: "2300ms" }} d="M300 155 L 318 155" />
                <path className="lo-s4-broken" style={{ animationDelay: "2300ms" }} d="M332 155 L 350 155" />
                <g className="lo-s4-x" style={{ animationDelay: "2700ms" }}>
                  <path d="M317 141 L 333 169" />
                  <path d="M333 141 L 317 169" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="lo-s4-stamp label-mono" style={{ animationDelay: "3200ms" }}>skill 直接报废</div>
      </div>
    );
  }

  /* step 5 — 结论定场:对/错两个小布局图对比盖章 */
  if (step === 5) {
    return (
      <div className="lo-scene scene-pad lo-s5">
        <h1 className="lo-h2 serif-cn lo-s5-h">
          <MaskReveal show duration={900}>
            <span className="lo-dim">链接只能放在</span> Claude <span className="lo-em">永远不碰</span>的地方
          </MaskReveal>
        </h1>
        <h1 className="lo-h2 serif-cn">
          <MaskReveal show delay={1100} duration={900}>
            方向反了,<span className="lo-em">全盘皆输</span>
          </MaskReveal>
        </h1>
        <div className="lo-s5-panels">
          <div className="lo-vp card" style={{ animationDelay: "1900ms" }}>
            <span className="lo-verdict lo-verdict-ok" aria-hidden />
            <div className="lo-vp-row">
              <div className="lo-vbox card">
                <span className="mono lo-vbox-name">plugins/</span>
                <span className="label-mono lo-vbox-sub">真内容</span>
              </div>
              <span className="lo-vplus label-mono">+</span>
              <div className="lo-vbox card">
                <span className="mono lo-vbox-name">.agents/skills/</span>
                <span className="label-mono lo-vbox-sub lo-vbox-links">→ 链接住这排</span>
              </div>
            </div>
            <span className="label-mono lo-vp-cap">链接在 plugin 外 · 复制永远安全</span>
          </div>
          <div className="lo-vp card" style={{ animationDelay: "2250ms" }}>
            <span className="lo-verdict lo-verdict-bad" aria-hidden />
            <div className="lo-vp-row">
              <div className="lo-vbox card">
                <span className="mono lo-vbox-name">plugins/</span>
                <span className="label-mono lo-vbox-sub lo-vbox-links">→ 链接塞在里面</span>
              </div>
              <span className="lo-vbox lo-vbox-ghost">
                <span className="label-mono lo-vbox-sub">复制后成死链</span>
              </span>
            </div>
            <span className="label-mono lo-vp-cap">链接在 plugin 里 · 一复制就死</span>
          </div>
        </div>
      </div>
    );
  }

  /* step 6 — pi 特例:扫描光束停在链接上不跟随,安装脚本改复制真身 */
  return (
    <div className="lo-scene scene-pad lo-s6">
      <div className="lo-s6-head">
        <span className="lo-pit label-mono" style={{ animationDelay: "200ms" }}>实测 · pi v0.80.6</span>
        <h1 className="lo-h2 serif-cn">
          <MaskReveal show delay={400} duration={900}>
            <span className="serif-it lo-pi">pi</span> 扫描目录,<span className="lo-em">不跟符号链接</span>
          </MaskReveal>
        </h1>
      </div>
      <div className="lo-s6-top">
        <span className="label-mono lo-beam-label">扫描</span>
        <span className="lo-beam" aria-hidden />
        <span className="lo-cross lo-s6-cross" aria-hidden />
        <div className="lo-link card lo-s6-link">
          <span className="mono lo-link-name">svg-handdrawn</span>
          <span className="label-mono lo-s6-linksub">符号链接</span>
        </div>
        <span className="lo-s6-coldline" aria-hidden />
        <div className="lo-s6-target">
          <span className="mono lo-s6-target-name">plugins/…/svg-handdrawn/</span>
          <span className="label-mono lo-s6-target-sub">到不了</span>
        </div>
      </div>
      <div className="lo-s6-fix" style={{ animationDelay: "2600ms" }}>
        <span className="lo-chip mono lo-s6-cmd">install.sh --agent pi</span>
        <span className="lo-cp">
          <span className="lo-cp-line" aria-hidden />
          <span className="label-mono lo-cp-tag">cp -r</span>
        </span>
        <div className="lo-cpbox card">
          <span className="lo-cpghost" aria-hidden />
          <span className="mono lo-cpbox-name">~/.agents/skills/svg-handdrawn/</span>
          <span className="label-mono lo-cpbox-sub">复制真实文件 · 不搞链接</span>
        </div>
      </div>
      <div className="lo-s6-badges">
        <span className="lo-chip label-mono" style={{ animationDelay: "3600ms" }}>Codex · 官方支持符号链接</span>
        <span className="lo-chip label-mono" style={{ animationDelay: "3850ms" }}>Claude Code · 走 marketplace 安装</span>
      </div>
    </div>
  );
}
