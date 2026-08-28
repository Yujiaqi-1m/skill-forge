import type { CSSProperties } from "react";
import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Casestudy.css";

/**
 * Chapter 6 · casestudy — "蒸馏实战与收官"(8 steps,收官章)。
 *
 * 每步独占整屏;视觉演示:仓库卡对流 / 三区取舍板逐区点亮 /
 * frontmatter 前后对比逐字段扫亮 / 模拟终端 + 错误路径拼合 /
 * 证据条依次盖章 / 粒子蒸馏汇聚成流 / 收束三联 / 搜索打字 CTA。
 * 终端命令、路径、commit、validate 输出均取自真实仓库。
 * 颜色字体全走主题 token。
 */

/** step 5 · 蒸馏粒子:散落的"一次性经验"汇聚到右端成一条流 */
const DISTILL_DOTS: { x: number; y: number; d: number }[] = [
  { x: 70, y: 42, d: 800 },
  { x: 170, y: 216, d: 1140 },
  { x: 300, y: 92, d: 1480 },
  { x: 420, y: 196, d: 1820 },
  { x: 520, y: 48, d: 2160 },
  { x: 650, y: 232, d: 2500 },
  { x: 770, y: 108, d: 2840 },
  { x: 880, y: 186, d: 3180 },
];
const CONVERGE_X = 1000;
const CONVERGE_Y = 140;

export default function Casestudy({ step }: ChapterStepProps) {
  /* step 0 — 案例引入:外部仓库卡 → 蒸馏箭头 → skill-forge 仓库卡 */
  if (step === 0) {
    return (
      <div className="cs-scene scene-pad cs-s0">
        <div className="kicker">case study · 蒸馏实战</div>
        <h1 className="cs-h2 serif-cn">
          <MaskReveal show duration={900}>仓库里最新的 skill,</MaskReveal>
          <MaskReveal show delay={380} duration={900}>
            <span className="cs-em">是蒸馏来的</span>
          </MaskReveal>
        </h1>
        <div className="cs-s0-row">
          <div className="cs-repo card" style={{ animationDelay: "600ms" }}>
            <span className="label-mono cs-repo-owner">github.com/ConardLi</span>
            <span className="mono cs-repo-name">garden-skills</span>
            <span className="label-mono cs-repo-meta">v1.2.2 · MIT · 80+ files</span>
            <span className="hero-num cs-repo-size">
              300<span className="cs-repo-unit">KB</span>
            </span>
          </div>
          <div className="cs-s0-flow">
            <span className="label-mono cs-s0-flow-label">蒸馏 distill</span>
            <svg viewBox="0 0 260 60" aria-hidden>
              <path className="cs-flow-line" style={{ animationDelay: "1250ms" }} d="M10 30 H 210" />
              <path
                className="cs-flow-head"
                style={{ animationDelay: "1850ms" }}
                d="M196 12 L 234 30 L 196 48"
              />
            </svg>
          </div>
          <div className="cs-repo card cs-repo-in" style={{ animationDelay: "1150ms" }}>
            <span className="label-mono cs-repo-owner">Yujiaqi-1m/skill-forge</span>
            <span className="mono cs-repo-name">web-video-presentation</span>
            <span className="label-mono cs-repo-meta">plugins/ · skills/web-video-presentation</span>
          </div>
        </div>
        <div className="label-mono cs-s0-sub" style={{ animationDelay: "2100ms" }}>
          <span className="dot-accent" />&nbsp;外部作品 → 蒸馏入库
        </div>
      </div>
    );
  }

  /* step 1 — 蒸馏决策:留 / 精选 23→10 / 删,与口播连述同步逐区点亮 */
  if (step === 1) {
    return (
      <div className="cs-scene scene-pad cs-s1">
        <h1 className="cs-h2 serif-cn">
          <MaskReveal show duration={800}>怎么蒸?</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="cs-em">三步取舍</span>
          </MaskReveal>
        </h1>
        <div className="cs-s1-board">
          <div className="cs-zone card" style={{ animationDelay: "600ms" }}>
            <span className="label-mono cs-zone-tag">留下 keep</span>
            <div className="cs-keep">
              <div className="mono cs-keep-item">references/ ×6</div>
              <div className="mono cs-keep-sub">CHAPTER-CRAFT · THEMES · AUDIO …</div>
              <div className="mono cs-keep-item">templates/ ×1</div>
              <div className="mono cs-keep-sub">完整 Vite 模板</div>
            </div>
          </div>
          <div className="cs-zone card" style={{ animationDelay: "2800ms" }}>
            <span className="label-mono cs-zone-tag">精选 select</span>
            <div className="cs-sel-hero">
              <span className="hero-num cs-sel-from">23</span>
              <span className="cs-sel-arrow" aria-hidden />
              <span className="hero-num cs-sel-to">10</span>
            </div>
            <div className="mono cs-sel-note">主题 · 明 5 : 暗 5</div>
            <div className="mono cs-keep-sub">paper-press · terminal-green …</div>
          </div>
          <div className="cs-zone card" style={{ animationDelay: "5300ms" }}>
            <span className="label-mono cs-zone-tag">删掉 drop</span>
            <div className="cs-drop">
              <div className="mono cs-drop-item">
                <span className="cs-strike" style={{ animationDelay: "6000ms" }} />
                EXAMPLES/
              </div>
              <div className="mono cs-drop-item">
                <span className="cs-strike" style={{ animationDelay: "6500ms" }} />
                README ×2
              </div>
              <div className="mono cs-drop-item">
                <span className="cs-strike" style={{ animationDelay: "7000ms" }} />
                manifest.json
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 2 — frontmatter 重写:平淡式 → 路由式,路由字段逐条点亮 */
  if (step === 2) {
    return (
      <div className="cs-scene scene-pad cs-s2">
        <h1 className="cs-h2 serif-cn">
          <MaskReveal show duration={800}>frontmatter 重写成</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="cs-em">路由式</span>
          </MaskReveal>
        </h1>
        <div className="cs-s2-row">
          <div className="cs-fm card cs-fm-old">
            <span className="label-mono cs-fm-tag">改写前 · 泛泛一句</span>
            <div className="mono cs-fm-code">
              <div className="cs-fm-dim">---</div>
              <div className="cs-fm-weak">name: video-skill</div>
              <div className="cs-fm-weak">description: 一个视频工具</div>
              <div className="cs-fm-dim">---</div>
            </div>
            <span className="label-mono cs-fm-verdict">没有触发词 · 没有边界</span>
          </div>
          <svg className="cs-s2-arrow" viewBox="0 0 120 60" aria-hidden>
            <path className="cs-flow-line" style={{ animationDelay: "500ms" }} d="M14 30 H 82" />
            <path className="cs-flow-head" style={{ animationDelay: "900ms" }} d="M70 16 L 100 30 L 70 44" />
          </svg>
          <div className="cs-fm card cs-fm-new">
            <span className="label-mono cs-fm-tag cs-fm-tag-new">改写后 · 路由式</span>
            <div className="cs-fm-code">
              <div className="cs-route" style={{ animationDelay: "900ms" }}>
                <span className="label-mono cs-route-k">能力</span>
                <span className="mono cs-route-v">把文章做成 16:9 视频网页</span>
              </div>
              <div className="cs-route" style={{ animationDelay: "2100ms" }}>
                <span className="label-mono cs-route-k">触发</span>
                <span className="cs-chips mono">
                  <span className="cs-chip">把这篇文章做成视频</span>
                  <span className="cs-chip">录屏教程</span>
                  <span className="cs-chip">web presentation</span>
                </span>
              </div>
              <div className="cs-route" style={{ animationDelay: "3400ms" }}>
                <span className="label-mono cs-route-k">边界</span>
                <span className="mono cs-route-v">是网页项目,不是视频文件</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 3 — 冒烟抓 bug:终端滚动 + 绝对路径被拼到 cwd 后面(红色叉) */
  if (step === 3) {
    return (
      <div className="cs-scene scene-pad cs-s3">
        <h1 className="cs-h2 serif-cn">
          <MaskReveal show duration={800}>蒸馏不是搬运,</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            冒烟抓到一个<span className="cs-em">真 bug</span>
          </MaskReveal>
        </h1>
        <div className="cs-s3-row">
          <div className="cs-term card">
            <div className="cs-term-bar">
              <span className="label-mono">zsh · scaffold 冒烟 · 两个主题</span>
            </div>
            <div className="cs-term-body mono">
              <div className="cs-tl" style={{ animationDelay: "600ms" }}>
                <span className="cs-p">$</span>./scaffold.sh --theme paper-press /tmp/wvp-smoke
              </div>
              <div className="cs-tl cs-tl-dim" style={{ animationDelay: "1500ms" }}>
                ▸ 在 /tmp/wvp-smoke 创建 Vite + React + TS 项目
              </div>
              <div className="cs-tl" style={{ animationDelay: "2400ms" }}>
                <span className="cs-p">$</span>./scaffold.sh --theme midnight-press /tmp/wvp-smoke2
              </div>
              <div className="cs-tl cs-tl-dim" style={{ animationDelay: "3300ms" }}>
                ▸ 在 /tmp/wvp-smoke2 创建 Vite + React + TS 项目
              </div>
              <div className="cs-tl" style={{ animationDelay: "4400ms" }}>
                <span className="cs-p">$</span>cd /tmp/wvp-smoke && npm run build
              </div>
              <div className="cs-tl cs-tl-err" style={{ animationDelay: "5700ms" }}>
                cd: no such file or directory: /tmp/wvp-smoke
              </div>
            </div>
          </div>
          <div className="cs-path card">
            <div className="cs-path-expr mono">
              <div className="cs-pl" style={{ animationDelay: "7300ms" }}>path.join(</div>
              <div className="cs-pl" style={{ animationDelay: "7700ms" }}>
                <span className="cs-pk">cwd</span>~/github/skill-forge
              </div>
              <div className="cs-pl" style={{ animationDelay: "8100ms" }}>
                <span className="cs-pk">arg</span>/tmp/wvp-smoke
              </div>
              <div className="cs-pl" style={{ animationDelay: "8500ms" }}>)</div>
            </div>
            <div className="cs-path-wrong mono">
              <span className="cs-pw-a" style={{ animationDelay: "9100ms" }}>~/github/skill-forge</span>
              <span className="cs-pw-b" style={{ animationDelay: "9100ms" }}>/tmp/wvp-smoke</span>
              <span className="cs-x" style={{ animationDelay: "10300ms" }} aria-hidden />
            </div>
            <div className="label-mono cs-path-verdict" style={{ animationDelay: "11000ms" }}>
              项目直接建到别的目录
            </div>
            <div className="mono cs-path-note" style={{ animationDelay: "11800ms" }}>
              create-vite@9 · 绝对路径被拼到 cwd 后面
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 4 — 修复上线:加固代码 → 两种传法 + validate 零 error → commit */
  if (step === 4) {
    return (
      <div className="cs-scene scene-pad cs-s4">
        <h1 className="cs-h2 serif-cn">
          <MaskReveal show duration={800}>顺手加固,</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="cs-em">零 error</span> 才上线
          </MaskReveal>
        </h1>
        <div className="cs-s4-evi">
          <div className="cs-fix card" style={{ animationDelay: "500ms" }}>
            <span className="label-mono cs-fix-tag">scaffold.sh · 路径归一化</span>
            <div className="mono cs-fix-code">
              <div>TARGET_PARENT="$(cd -- "$(dirname -- "$TARGET")" && pwd)"</div>
              <div>TARGET="$TARGET_PARENT/$(basename -- "$TARGET")"</div>
            </div>
            <span className="cs-stamp mono" style={{ animationDelay: "2400ms" }}>0 error</span>
          </div>
          <div className="cs-check" style={{ animationDelay: "2100ms" }}>
            <span className="mono cs-ok">
              <span className="cs-ok-mark">✓</span> 绝对路径
            </span>
            <span className="mono cs-ok">
              <span className="cs-ok-mark">✓</span> 相对路径
            </span>
            <span className="mono cs-okv">validate → 3 skills, 0 error(s)</span>
          </div>
          <div className="mono cs-commit" style={{ animationDelay: "3600ms" }}>
            <span className="dot-accent" />&nbsp;1c3f931 · feat(skills): add web-video-presentation
          </div>
        </div>
      </div>
    );
  }

  /* step 5 — 方法论定场金句:散点蒸馏汇聚 → 一次性经验 → 可复用工作流 */
  if (step === 5) {
    return (
      <div className="cs-scene scene-pad cs-s5">
        <div className="kicker">这个仓库干的事,就一个</div>
        <div className="cs-s5-visual">
          <svg viewBox="0 0 1240 280" aria-hidden>
            {DISTILL_DOTS.map((p, i) => (
              <circle
                key={i}
                className="cs-s5-dot"
                cx={p.x}
                cy={p.y}
                r={7}
                style={
                  {
                    "--dx": `${CONVERGE_X - p.x}px`,
                    "--dy": `${CONVERGE_Y - p.y}px`,
                    animationDelay: `${p.d}ms`,
                  } as CSSProperties
                }
              />
            ))}
            <line className="cs-s5-bar" x1={CONVERGE_X} y1={CONVERGE_Y} x2={1210} y2={CONVERGE_Y} />
          </svg>
        </div>
        <h1 className="cs-hero serif-cn cs-s5-h">
          <MaskReveal show delay={4400} duration={900}>一次性经验</MaskReveal>
          <span className="cs-hero-arrow" aria-hidden />
          <MaskReveal show delay={5300} duration={900}>
            可复用<span className="cs-em">工作流</span>
          </MaskReveal>
        </h1>
        <div className="cs-s5-badges">
          <span className="label-mono cs-s5-badge" style={{ animationDelay: "7400ms" }}>
            内建自验证
          </span>
          <span className="label-mono cs-s5-badge" style={{ animationDelay: "8000ms" }}>
            回归用例
          </span>
        </div>
      </div>
    );
  }

  /* step 6 — 收束三联:写一遍 / 三个 agent 受益 / CI 保质 */
  if (step === 6) {
    return (
      <div className="cs-scene scene-pad cs-s6">
        <div className="cs-s6-row">
          <div className="cs-t card" style={{ animationDelay: "300ms" }}>
            <span className="hero-num cs-t1">×1</span>
            <span className="serif-cn cs-tt">写一遍</span>
          </div>
          <div className="cs-t card" style={{ animationDelay: "1500ms" }}>
            <span className="label-mono cs-agents">Claude · Codex · pi</span>
            <span className="serif-cn cs-tt">三个 agent 受益</span>
          </div>
          <div className="cs-t card" style={{ animationDelay: "2700ms" }}>
            <svg className="cs-ci" viewBox="0 0 56 56" aria-hidden>
              <path className="cs-ci-path" d="M10 30 L24 44 L46 12" />
            </svg>
            <span className="serif-cn cs-tt">CI 保证不烂</span>
          </div>
        </div>
      </div>
    );
  }

  /* step 7 — CTA 收尾:GitHub 搜 skill-forge → fork + new-skill → 评论区 */
  if (step === 7) {
    return (
      <div className="cs-scene scene-pad cs-s7">
        <div className="kicker">自己整一个?</div>
        <div className="cs-search card" style={{ animationDelay: "400ms" }}>
          <span className="label-mono cs-search-k">GitHub</span>
          <span className="mono cs-search-typed">
            <span className="cs-type">skill-forge</span>
            <span className="cs-caret" />
          </span>
        </div>
        <div className="cs-hit card" style={{ animationDelay: "3400ms" }}>
          <span className="mono cs-hit-name">Yujiaqi-1m / skill-forge</span>
          <span className="label-mono cs-hit-meta">3 skills · CI · open standard</span>
        </div>
        <div className="mono cs-cmd" style={{ animationDelay: "5800ms" }}>
          /plugin marketplace add Yujiaqi-1m/skill-forge
        </div>
        <div className="mono cs-fork" style={{ animationDelay: "7800ms" }}>
          fork → ./scripts/new-skill.sh &lt;你的 idea&gt;
        </div>
        <h1 className="cs-h2 serif-cn cs-s7-h">
          <MaskReveal show delay={10200} duration={900}>
            你打算<span className="cs-em">蒸馏</span>什么?
          </MaskReveal>
        </h1>
        <div className="label-mono cs-s7-sub" style={{ animationDelay: "11400ms" }}>
          评论区聊聊
        </div>
      </div>
    );
  }

  return null;
}
