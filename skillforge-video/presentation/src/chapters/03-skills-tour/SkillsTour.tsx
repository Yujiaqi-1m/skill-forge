import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./SkillsTour.css";

/**
 * Chapter 3 · skills-tour — "仓库三件套"(8 steps)。
 *
 * 每步独占整屏;主导动作各不相同:三卡入场 / 手绘 SVG 线条自绘(歪边+排线)/
 * 自检环形流程点亮 / 定时时间轴 + .tasks 记录 / 队列逐个划掉 / 断点续跑
 * 进度叙事(断 → 检查点 → 续跑)/ 文章→舞台变形 / 镜头拉回自身的嵌套画框。
 * 颜色字体全走主题 token。
 */

/** 手绘感矩形:固定抖动的贝塞尔边(j/k 每盒不同,像马克笔手描,非机械直线) */
function wobbleRect(x: number, y: number, w: number, h: number, j: number, k: number): string {
  return [
    `M ${x + 3 + j} ${y + 5 - k}`,
    `C ${x + w * 0.32} ${y - 2 - k} ${x + w * 0.68} ${y + 6 + k} ${x + w - 3 - j} ${y + 3}`,
    `C ${x + w + 4 - j} ${y + h * 0.38} ${x + w - 5 + k} ${y + h * 0.74} ${x + w - 2 + j} ${y + h - 4 + k}`,
    `C ${x + w * 0.62} ${y + h + 3 - j} ${x + w * 0.3} ${y + h - 5 - k} ${x + 4 + j} ${y + h - 2}`,
    `C ${x - 3 + k} ${y + h * 0.6} ${x + 5 - k} ${y + h * 0.3} ${x + 3 + j} ${y + 5 - k}`,
    "Z",
  ].join(" ");
}

export default function SkillsTour({ step }: ChapterStepProps) {
  /* step 0 — 引入:三张 skill 卡片排队入场,标题"仓库三件套" */
  if (step === 0) {
    const skills = [
      { no: "01", name: "svg-handdrawn", cn: "说人话,画手绘图", en: "draws by listening", d: 900 },
      { no: "02", name: "task-scheduler", cn: "定时干活,断了能续", en: "schedules & resumes", d: 1150 },
      { no: "03", name: "web-video-presentation", cn: "文章进去,视频出来", en: "article to video", d: 1400 },
    ];
    return (
      <div className="sk-scene scene-pad sk-s0">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "200ms" }}>
          skill-forge · 仓库里现有三个 skill
        </div>
        <h1 className="sk-h1 serif-cn">
          <MaskReveal show duration={900}>仓库三件套</MaskReveal>
        </h1>
        <div className="sk-s0-rule" aria-hidden />
        <div className="sk-s0-cards">
          {skills.map((s) => (
            <div key={s.no} className="card sk-skill" style={{ animationDelay: `${s.d}ms` }}>
              <span className="hero-num sk-skill-no">{s.no}</span>
              <span className="mono sk-skill-name">{s.name}</span>
              <span className="serif-cn sk-skill-cn">{s.cn}</span>
              <span className="serif-it sk-skill-en">{s.en}</span>
            </div>
          ))}
        </div>
        <div className="label-mono sk-s0-note" style={{ animationDelay: "1800ms" }}>
          <span className="dot-accent" />&nbsp;都是真跑的 skill,不是示例目录
        </div>
      </div>
    );
  }

  /* step 1 — svg-handdrawn:一句话指令 → 手绘 SVG 线条自己画出来(含宽高比角标切换) */
  if (step === 1) {
    const boxes = [
      { x: 20, y: 150, w: 190, h: 96, j: 3, k: -2, cn: "合入 main", en: "merge", d: 1300 },
      { x: 260, y: 150, w: 190, h: 96, j: -2, k: 3, cn: "构建 · 测试", en: "build + test", d: 1800 },
      { x: 500, y: 150, w: 190, h: 96, j: 4, k: 1, cn: "部署预发", en: "staging", d: 2300 },
      { x: 740, y: 150, w: 190, h: 96, j: -3, k: 2, cn: "QA 验收", en: "QA check", d: 2800 },
      { x: 985, y: 150, w: 160, h: 96, j: 2, k: -3, cn: "上生产", en: "ship", d: 3300 },
    ];
    const arrows = [
      { d: "M 216 198 C 230 192, 242 204, 254 198", c: "M 246 190 L 256 198 L 246 206", t: 1750 },
      { d: "M 456 198 C 470 192, 482 204, 494 198", c: "M 486 190 L 496 198 L 486 206", t: 2250 },
      { d: "M 696 198 C 710 192, 722 204, 734 198", c: "M 726 190 L 736 198 L 726 206", t: 2750 },
      { d: "M 936 198 C 950 192, 962 204, 974 198", c: "M 966 190 L 976 198 L 966 206", t: 3250 },
    ];
    return (
      <div className="sk-scene scene-pad sk-s1">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 01 · svg-handdrawn
        </div>
        <h1 className="sk-h2 serif-cn">
          <MaskReveal show duration={800}>说人话,</MaskReveal>
          <MaskReveal show delay={320} duration={800}>
            <span className="sk-em">画手绘图</span>
          </MaskReveal>
        </h1>
        <div className="sk-s1-row">
          <div className="sk-s1-left">
            <div className="card sk-prompt" style={{ animationDelay: "600ms" }}>
              <span className="label-mono">你说一句</span>
              <span className="serif-cn sk-prompt-q">“帮我画个 CI 流程图”<span className="sk-caret" /></span>
              <span className="sk-prompt-sub">一句话 · 中英文都行</span>
            </div>
            <div className="sk-spec">
              <div className="sk-spec-row" style={{ animationDelay: "1200ms" }}>
                <span className="serif-cn sk-spec-cn">歪扭的边</span>
                <span className="serif-it sk-spec-en">wobbly edges</span>
              </div>
              <div className="sk-spec-row" style={{ animationDelay: "1400ms" }}>
                <span className="serif-cn sk-spec-cn">排线填充</span>
                <span className="serif-it sk-spec-en">hatching</span>
              </div>
              <div className="sk-spec-row" style={{ animationDelay: "1600ms" }}>
                <span className="serif-cn sk-spec-cn">手写字体</span>
                <span className="serif-it sk-spec-en">handwriting</span>
              </div>
              <div className="sk-spec-note" style={{ animationDelay: "2000ms" }}>
                不是 <span className="mono">draw.io</span> 那种机械直线
              </div>
            </div>
          </div>
          <div className="card sk-canvas" style={{ animationDelay: "800ms" }}>
            <div className="sk-dr-badges" aria-hidden>
              <span className="sk-badge mono sk-badge-a">16:9</span>
              <span className="sk-badge mono sk-badge-b">A4</span>
              <span className="sk-badge mono sk-badge-c">任意 W:H</span>
            </div>
            <svg className="sk-dr-svg" viewBox="0 0 1160 560" aria-hidden>
              {boxes.map((b) => (
                <g key={b.cn}>
                  <path className="sk-dr-box" style={{ animationDelay: `${b.d}ms` }} d={wobbleRect(b.x, b.y, b.w, b.h, b.j, b.k)} />
                  <path className="sk-dr-hatch" style={{ animationDelay: `${b.d + 250}ms` }} d={`M ${b.x + 14} ${b.y + 26} L ${b.x + 34} ${b.y + 12}`} />
                  <path className="sk-dr-hatch" style={{ animationDelay: `${b.d + 330}ms` }} d={`M ${b.x + 38} ${b.y + 28} L ${b.x + 58} ${b.y + 14}`} />
                  <text className="sk-dr-cn" style={{ animationDelay: `${b.d + 200}ms` }} x={b.x + b.w / 2} y={b.y + 52}>{b.cn}</text>
                  <text className="sk-dr-en" style={{ animationDelay: `${b.d + 300}ms` }} x={b.x + b.w / 2} y={b.y + 84}>{b.en}</text>
                </g>
              ))}
              {arrows.map((a, i) => (
                <g key={i}>
                  <path className="sk-dr-arrow" style={{ animationDelay: `${a.t}ms` }} d={a.d} />
                  <path className="sk-dr-chev" style={{ animationDelay: `${a.t + 150}ms` }} d={a.c} />
                </g>
              ))}
              <path className="sk-dr-failpath" style={{ animationDelay: "3900ms" }} d="M 355 252 C 358 300, 352 330, 355 382" />
              <text className="sk-dr-failtag" style={{ animationDelay: "4000ms" }} x="376" y="316">失败</text>
              <path className="sk-dr-box" style={{ animationDelay: "4000ms" }} d={wobbleRect(260, 392, 190, 88, -3, 2)} />
              <path className="sk-dr-hatch" style={{ animationDelay: "4250ms" }} d="M 274 418 L 294 404" />
              <text className="sk-dr-cn" style={{ animationDelay: "4200ms" }} x="355" y="440">通知值班</text>
              <text className="sk-dr-en" style={{ animationDelay: "4300ms" }} x="355" y="470">oncall</text>
            </svg>
            <div className="label-mono sk-dr-ratio" style={{ animationDelay: "4900ms" }}>
              宽高比 · 16:9 / 4:3 / A4 / 自定义
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 2 — 倔脾气循环:画 → 渲染 → 自查 → 重画,环形流程点亮 + 验收章 */
  if (step === 2) {
    const nodes = [
      { cx: 280, cy: 80, cn: "画", en: "draw", d: 1000 },
      { cx: 480, cy: 280, cn: "渲染成图片", en: "rasterize", d: 1900 },
      { cx: 280, cy: 480, cn: "自己看一遍", en: "inspect", d: 2800 },
      { cx: 80, cy: 280, cn: "重画", en: "redraw", d: 3700 },
    ];
    const arcs = [
      { d: "M 280 84 A 196 196 0 0 1 476 280", t: 1450 },
      { d: "M 476 280 A 196 196 0 0 1 280 476", t: 2350 },
      { d: "M 280 476 A 196 196 0 0 1 84 280", t: 3250 },
      { d: "M 84 280 A 196 196 0 0 1 280 84", t: 4150 },
    ];
    const chevs = [
      { x: 418, y: 141, r: 45, t: 1800 },
      { x: 418, y: 418, r: 135, t: 2700 },
      { x: 141, y: 418, r: 225, t: 3600 },
      { x: 141, y: 141, r: 315, t: 4500 },
    ];
    return (
      <div className="sk-scene scene-pad sk-s2">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 01 · svg-handdrawn — 内建自检
        </div>
        <h1 className="sk-h2 serif-cn sk-s2-h">
          <MaskReveal show duration={800}>到你手上的,</MaskReveal>
          <MaskReveal show delay={320} duration={800}>
            都是<span className="sk-em">它自己验收过的</span>
          </MaskReveal>
        </h1>
        <div className="sk-s2-ring">
          <svg className="sk-ring-svg" viewBox="0 0 560 560" aria-hidden>
            {arcs.map((a, i) => (
              <path key={i} className="sk-arc" style={{ animationDelay: `${a.t}ms` }} d={a.d} />
            ))}
            {chevs.map((c, i) => (
              <path
                key={`c${i}`}
                className="sk-chev"
                style={{ animationDelay: `${c.t}ms` }}
                transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}
                d="M -9 -9 L 0 0 L -9 9"
              />
            ))}
            {nodes.map((n) => (
              <g key={n.cn} className="sk-node" style={{ animationDelay: `${n.d}ms` }}>
                <circle cx={n.cx} cy={n.cy} r="66" />
                <text className="sk-node-cn" x={n.cx} y={n.cy - 2}>{n.cn}</text>
                <text className="sk-node-en" x={n.cx} y={n.cy + 34}>{n.en}</text>
              </g>
            ))}
            <text className="sk-ring-ctr" x="280" y="262">不满意?</text>
            <text className="sk-ring-ctr sk-ring-ctr-em" x="280" y="306">再来一圈</text>
            <text className="sk-ring-sub" x="280" y="348" style={{ animationDelay: "4300ms" }}>render-check loop</text>
          </svg>
          <div className="sk-stamp" style={{ animationDelay: "4700ms" }}>
            <span className="serif-cn sk-stamp-cn">验收通过</span>
            <span className="label-mono sk-stamp-en">self-checked · 交付</span>
          </div>
        </div>
        <div className="sk-s2-note" style={{ animationDelay: "5200ms" }}>
          <span className="serif-cn sk-s2-q">嫌绘图工具太机械?找它。</span>
          <span className="sk-chip mono">画个流程图</span>
          <span className="sk-chip mono">draw a diagram</span>
        </div>
      </div>
    );
  }

  /* step 3 — task-scheduler:两张定时指令卡 + 时间轴 + .tasks 记录 */
  if (step === 3) {
    return (
      <div className="sk-scene scene-pad sk-s3">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 02 · task-scheduler
        </div>
        <h1 className="sk-h2 serif-cn">
          <MaskReveal show duration={800}>让 agent</MaskReveal>
          <MaskReveal show delay={320} duration={800}>
            <span className="sk-em"> 定时干活</span>
          </MaskReveal>
        </h1>
        <div className="sk-s3-row">
          <div className="sk-s3-cards">
            <div className="card sk-cmd" style={{ animationDelay: "1400ms" }}>
              <span className="mono sk-cmd-trigger">@hourly</span>
              <span className="serif-cn sk-cmd-cn">每小时查一次部署</span>
              <span className="label-mono sk-cmd-note">周期调度 · cron 风格</span>
            </div>
            <div className="card sk-cmd" style={{ animationDelay: "3000ms" }}>
              <span className="mono sk-cmd-trigger">+10min</span>
              <span className="serif-cn sk-cmd-cn">十分钟后提醒我</span>
              <span className="label-mono sk-cmd-note">一次性触发器 · fire once</span>
            </div>
          </div>
          <div className="card sk-tasks" style={{ animationDelay: "4200ms" }}>
            <div className="sk-tasks-head">
              <span className="mono sk-tasks-dir">.tasks/</span>
              <span className="label-mono">任务记录落在这里</span>
            </div>
            <div className="mono sk-task-line" style={{ animationDelay: "4400ms" }}>周期 · 查一次部署</div>
            <div className="mono sk-task-line" style={{ animationDelay: "4700ms" }}>一次 · +10min 提醒我</div>
            <div className="mono sk-task-line sk-task-dim" style={{ animationDelay: "5000ms" }}>checkpoint.log …</div>
          </div>
        </div>
        <div className="sk-tl">
          <div className="sk-tl-axis" />
          <span className="sk-tl-now label-mono" style={{ animationDelay: "1000ms" }}>now</span>
          {[24, 46, 68, 90].map((p, i) => (
            <span key={p} className={i === 0 ? "sk-tl-tick sk-tl-tick-hot" : "sk-tl-tick"} style={{ left: `${p}%`, animationDelay: `${1300 + i * 150}ms` }} />
          ))}
          <span className="sk-tl-dot" style={{ animationDelay: "3100ms" }} />
          <span className="label-mono sk-tl-l1" style={{ animationDelay: "3100ms" }}>+10min · 一次</span>
          <span className="label-mono sk-tl-l2" style={{ animationDelay: "1500ms" }}>@hourly · 每小时一次</span>
        </div>
      </div>
    );
  }

  /* step 4 — 任务队列:几十个任务排队,跑完一个划掉一个 */
  if (step === 4) {
    const rows = ["抓取链接 · 批次 01", "抓取链接 · 批次 02", "抓取链接 · 批次 03", "抓取链接 · 批次 04", "抓取链接 · 批次 05", "抓取链接 · 批次 06", "抓取链接 · 批次 07", "抓取链接 · 批次 08"];
    return (
      <div className="sk-scene scene-pad sk-s4">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 02 · task-scheduler — 排队
        </div>
        <h1 className="sk-h2 serif-cn">
          <MaskReveal show duration={800}>几十个任务,</MaskReveal>
          <MaskReveal show delay={320} duration={800}>
            <span className="sk-em">挨个跑</span>
          </MaskReveal>
        </h1>
        <div className="card sk-queue">
          {rows.map((r, i) => (
            <div key={r} className="sk-q-row" style={{ animationDelay: `${100 + i * 70}ms` }}>
              <span className="mono sk-q-idx" style={{ animationDelay: `${1400 + i * 300}ms` }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="serif-cn sk-q-name" style={{ animationDelay: `${1400 + i * 300}ms` }}>{r}</span>
              <span className="mono sk-q-check" style={{ animationDelay: `${1550 + i * 300}ms` }}>✓</span>
              <span className="sk-q-strike" style={{ animationDelay: `${1400 + i * 300}ms` }} />
            </div>
          ))}
          <div className="sk-q-row sk-q-more label-mono" style={{ animationDelay: "800ms" }}>
            … 后面还排着几十个
          </div>
        </div>
        <div className="label-mono sk-s4-cap" style={{ animationDelay: "3900ms" }}>跑完一个,划掉一个</div>
      </div>
    );
  }

  /* step 5 — 断点续跑:跑到一半断了 → 从检查点续跑(本章最重要的演示) */
  if (step === 5) {
    const logs = [
      { t: "T+0 · 长任务运行中", d: 1000, hot: false },
      { t: "T+1 · 会话断了 ×", d: 2700, hot: true },
      { t: "T+2 · 重新进入,读 .tasks/ 检查点", d: 3700, hot: false },
      { t: "T+2 · 从 ck-02 继续 → 跑完", d: 6300, hot: true },
    ];
    return (
      <div className="sk-scene scene-pad sk-s5">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 02 · task-scheduler — 杀手锏
        </div>
        <h1 className="sk-h2 serif-cn">
          <MaskReveal show duration={800}>断了?从</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="sk-em">检查点</span>
          </MaskReveal>
          <MaskReveal show delay={620} duration={800}>接着跑</MaskReveal>
        </h1>
        <div className="sk-track-wrap">
          <div className="label-mono sk-break-tag" style={{ animationDelay: "2600ms" }}>× 会话断了</div>
          <div className="label-mono sk-done-tag" style={{ animationDelay: "6400ms" }}>✓ 续跑完成</div>
          <div className="sk-track">
            <span className="sk-ck" style={{ left: "25%" }} />
            <span className="sk-ck" style={{ left: "85%" }} />
            <span className="sk-fill-a" />
            <svg className="sk-crack" viewBox="0 0 24 72" aria-hidden>
              <path d="M 12 0 L 6 14 L 16 26 L 8 40 L 15 54 L 10 72" />
            </svg>
            <span className="sk-fill-b" />
            <span className="sk-ck-hot" />
          </div>
          <div className="sk-track-under">
            <span className="label-mono sk-ghost" style={{ animationDelay: "3000ms" }}>从头再来</span>
            <span className="label-mono sk-ck-label" style={{ animationDelay: "3400ms" }}>ck-02 · 检查点日志</span>
            <span className="label-mono sk-pct">100%</span>
          </div>
        </div>
        <div className="card sk-log">
          {logs.map((l) => (
            <div key={l.t} className="sk-log-line" style={{ animationDelay: `${l.d}ms` }}>
              <span className={l.hot ? "sk-log-dot sk-log-dot-hot" : "sk-log-dot"} />
              <span className="mono sk-log-t">{l.t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* step 6 — wvp:文章页变形出网页舞台,一步一步演 + 口播/一镜到底标注 */
  if (step === 6) {
    return (
      <div className="sk-scene scene-pad sk-s6">
        <div className="label-mono sk-badge-line" style={{ animationDelay: "150ms" }}>
          skill 03 · web-video-presentation
        </div>
        <h1 className="sk-h2 serif-cn">
          <MaskReveal show duration={800}>文章进去,</MaskReveal>
          <MaskReveal show delay={320} duration={800}>
            <span className="sk-em">视频出来</span>
          </MaskReveal>
        </h1>
        <div className="sk-s6-stage">
          <div className="sk-src-wrap">
            <div className="card sk-article" style={{ animationDelay: "800ms" }}>
              <span className="mono sk-art-title">article.md</span>
              <span className="sk-art-hero" />
              <span className="sk-art-line l1" />
              <span className="sk-art-line l2" />
              <span className="sk-art-line l3" />
              <span className="sk-art-line l4" />
              <span className="label-mono sk-art-foot">一篇文章 / 口播稿</span>
            </div>
          </div>
          <svg className="sk-morph-arrow" viewBox="0 0 140 40" aria-hidden>
            <path style={{ animationDelay: "2000ms" }} d="M 6 20 C 50 14, 90 26, 126 20" />
            <path style={{ animationDelay: "2150ms" }} d="M 116 12 L 128 20 L 116 28" />
          </svg>
          <div className="sk-vp">
            <div className="sk-vp-frame">
              <span className="sk-vp-hero" />
              <span className="sk-vp-line l1" />
              <span className="sk-vp-line l2" />
              <div className="sk-vp-dots">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={i < 3 ? "sk-vp-dot sk-vp-dot-on" : "sk-vp-dot"} style={{ animationDelay: `${3600 + i * 600}ms` }} />
                ))}
              </div>
              <span className="sk-vp-progress" />
              <span className="label-mono sk-vp-tag" style={{ animationDelay: "3300ms" }}>16:9 · 点击驱动 · 像视频一样</span>
            </div>
          </div>
        </div>
        <div className="sk-s6-notes">
          <div className="card sk-note-chip" style={{ animationDelay: "5400ms" }}>
            <span className="sk-wave" aria-hidden><i /><i /><i /><i /><i /></span>
            <span className="label-mono">TTS 口播音频</span>
          </div>
          <div className="card sk-note-chip" style={{ animationDelay: "5900ms" }}>
            <span className="mono sk-auto">?auto=1</span>
            <span className="label-mono">一镜到底录屏</span>
          </div>
          <div className="label-mono sk-s6-origin" style={{ animationDelay: "6300ms" }}>
            Vite + React + TS · 蒸馏自 300KB 外部 skill
          </div>
        </div>
      </div>
    );
  }

  /* step 7 — 自指定场:镜头拉回自身,嵌套画框 + "就是用它做的" */
  return (
    <div className="sk-scene scene-pad sk-s7">
      <div className="sk-frame-outer">
        <svg className="sk-frame-draw" viewBox="0 0 926 520" preserveAspectRatio="none" aria-hidden>
          <path d="M 4 4 H 922 V 516 H 4 Z" />
        </svg>
        <span className="label-mono sk-frame-tag" style={{ animationDelay: "1500ms" }}>这个视频 · 16:9 网页</span>
        <div className="sk-frame-inner">
          <span className="sk-fi-hero" />
          <div className="sk-fi-cards">
            <div className="sk-fi-card" style={{ animationDelay: "900ms" }}>
              <span className="label-mono">01</span><i />
            </div>
            <div className="sk-fi-card" style={{ animationDelay: "1050ms" }}>
              <span className="label-mono">02</span><i />
            </div>
            <div className="sk-fi-card" style={{ animationDelay: "1200ms" }}>
              <span className="label-mono">03</span><i />
            </div>
          </div>
          <span className="sk-fi-progress" />
        </div>
      </div>
      <h1 className="sk-s7-h serif-cn">
        <MaskReveal show delay={1800} duration={800}>
          <span className="sk-line">你现在正在看的这个视频,</span>
        </MaskReveal>
        <MaskReveal show delay={2300} duration={800}>
          <span className="sk-line sk-em">就是用它做的</span>
        </MaskReveal>
      </h1>
      <div className="label-mono sk-s7-foot" style={{ animationDelay: "2800ms" }}>
        web-video-presentation · ?auto=1
      </div>
    </div>
  );
}
