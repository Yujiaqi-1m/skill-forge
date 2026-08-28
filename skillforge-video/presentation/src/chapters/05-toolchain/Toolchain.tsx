import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Toolchain.css";

/**
 * Chapter 5 · toolchain — "三个脚本转一圈,一个 skill 上线"(10 steps)。
 *
 * 每步独占整屏;视觉演示:流水线环线自绘 / 终端敲命令 + 目录树长出 /
 * validate 四项检查与口播"挨个查"同步逐项打勾 / CI push 包飞线过闸 /
 * evals 重跑扫过 + 东墙西墙 / install 链接飞点 + pi 复制分身 / 路径卡点亮
 * / 家规三格逐格揭示(一格一 step)。颜色字体全走主题 token。
 */

/** step 7~9 共用:三条家规,activeIndex 指当前亮格(0-based) */
function ruleCells(activeIndex: number) {
  const rules = [
    { k: "01", t: "规则写成决策", d: "不写感觉 — 确切命令 · 字体 · 阈值,带上为什么" },
    { k: "02", t: "自己检查再交付", d: "内建自检 — 措辞 agent 中性,不点名 harness" },
    { k: "03", t: "版本号跟着变", d: "内容一变就 bump — plugin.json · semver" },
  ];
  return (
    <div className="tc-rules">
      {rules.map((r, i) => (
        <div
          key={r.k}
          className={[
            "tc-rule card",
            i === activeIndex ? "tc-rule-active" : "",
            i < activeIndex ? "tc-rule-dim" : "",
            i > activeIndex ? "tc-rule-pending" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="label-mono tc-rule-k">{r.k}</span>
          <span className="serif-cn tc-rule-t">{r.t}</span>
          <span className="tc-rule-d">{r.d}</span>
          {i === 2 && i === activeIndex && (
            <span className="tc-bump mono">
              <span className="tc-bump-key">"version":</span> 1.2.0
              <span className="tc-bump-arrow">→</span>
              <span className="tc-bump-new">1.2.1</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Toolchain({ step }: ChapterStepProps) {
  /* step 0 — 流水线总览:三个脚本节点连成环,环线自绘,"转一圈,上线" */
  if (step === 0) {
    return (
      <div className="tc-scene scene-pad tc-s0">
        <h1 className="tc-h1 serif-cn tc-s0-h">
          <MaskReveal show duration={900}>三个脚本,</MaskReveal>
          <MaskReveal show delay={350} duration={900}>
            <span className="tc-em">转一圈</span>
          </MaskReveal>
        </h1>
        <div className="tc-loop">
          <svg className="tc-loop-svg" viewBox="0 0 1040 430" aria-hidden>
            <path className="tc-loop-path" d="M 280 210 C 340 160, 340 130, 400 120" />
            <path className="tc-loop-path" style={{ animationDelay: "620ms" }} d="M 640 120 C 700 130, 700 160, 760 210" />
            <path className="tc-loop-path tc-loop-path-back" style={{ animationDelay: "1240ms" }} d="M 760 250 C 640 400, 400 400, 280 250" />
          </svg>
          <div className="tc-node card" style={{ animationDelay: "380ms" }}>
            <span className="label-mono tc-node-k">01</span>
            <span className="mono tc-node-name">new-skill</span>
            <span className="tc-node-sub">一键脚手架</span>
          </div>
          <div className="tc-node card tc-node-top" style={{ animationDelay: "1000ms" }}>
            <span className="label-mono tc-node-k">02</span>
            <span className="mono tc-node-name">validate</span>
            <span className="tc-node-sub">仓库级 lint</span>
          </div>
          <div className="tc-node card tc-node-right" style={{ animationDelay: "1620ms" }}>
            <span className="label-mono tc-node-k">03</span>
            <span className="mono tc-node-name">install</span>
            <span className="tc-node-sub">装给三个 agent</span>
          </div>
          <div className="tc-loop-seal">
            <span className="serif-cn tc-loop-seal-t">上线</span>
          </div>
        </div>
        <div className="label-mono tc-s0-foot">
          <span className="dot-accent" />&nbsp;turn the crank once — one skill ships
        </div>
      </div>
    );
  }

  /* step 1 — new-skill:命令行敲下,目录树瞬间长出(五件套一次建全) */
  if (step === 1) {
    return (
      <div className="tc-scene scene-pad tc-s1">
        <div className="tc-s1-main">
          <div className="tc-term card tc-s1-term">
            <div className="tc-term-bar">
              <span className="tc-dot" /><span className="tc-dot" /><span className="tc-dot" />
              <span className="label-mono tc-term-title">zsh — scaffold</span>
            </div>
            <div className="mono tc-cmd-row">
              <span className="tc-prompt">$&nbsp;</span>
              <span className="tc-cmd">./scripts/new-skill.sh demo-skill "把文章做成视频网页"</span>
              <span className="tc-caret" />
            </div>
            <div className="mono tc-tree">
              <div className="tc-tree-line tc-tree-root" style={{ animationDelay: "2200ms" }}>skill-forge/</div>
              <div className="tc-tree-line" style={{ animationDelay: "2800ms" }}>├─ plugins/demo-skill/</div>
              <div className="tc-tree-line" style={{ animationDelay: "3400ms" }}>│&nbsp;&nbsp;├─ .claude-plugin/plugin.json</div>
              <div className="tc-tree-line" style={{ animationDelay: "4000ms" }}>│&nbsp;&nbsp;└─ skills/demo-skill/SKILL.md<span className="tc-tree-tag label-mono">模板</span></div>
              <div className="tc-tree-line" style={{ animationDelay: "4600ms" }}>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ evals/evals.json<span className="tc-tree-tag label-mono">模板</span></div>
              <div className="tc-tree-line" style={{ animationDelay: "5200ms" }}>├─ .agents/skills/demo-skill →<span className="tc-tree-tag label-mono">符号链接</span></div>
              <div className="tc-tree-line" style={{ animationDelay: "5800ms" }}>└─ marketplace.json<span className="tc-em">+1</span><span className="tc-tree-tag label-mono">注册</span></div>
            </div>
          </div>
          <div className="tc-s1-right">
            <h1 className="tc-h2 serif-cn">
              <MaskReveal show delay={1300} duration={900}>一键脚手架</MaskReveal>
            </h1>
            <h1 className="tc-h2 serif-cn">
              <MaskReveal show delay={1800} duration={900}>
                <span className="tc-em">一次建全</span>
              </MaskReveal>
            </h1>
            <div className="tc-s1-num-row">
              <span className="hero-num tc-s1-num">5</span>
              <span className="serif-cn tc-s1-num-t">件套,一条命令</span>
            </div>
            <div className="serif-it tc-note-en">scaffold once, everything wired</div>
          </div>
        </div>
      </div>
    );
  }

  /* step 2 — validate:模拟终端,四项检查与口播"挨个查"同步逐项打勾 */
  if (step === 2) {
    const checks = [
      { at: 4200, label: "名字对不对 · name == 目录名", val: "demo-skill", extra: false },
      { at: 5800, label: "描述长没长 · description ≤ 1024 字符", val: "9 chars", extra: false },
      { at: 7400, label: "行数超没超 · SKILL.md < 500 行", val: "214 行", extra: false },
      { at: 9200, label: "写死工具名 · agent 中性措辞", val: "body clean", extra: false },
      { at: 10600, label: "evals 3–5 条 · id / prompt / expected_output", val: "4 cases", extra: true },
      { at: 10750, label: "marketplace.json ↔ plugins/ 双向一致", val: "in sync", extra: true },
    ];
    return (
      <div className="tc-scene scene-pad tc-s2">
        <h1 className="tc-h2 serif-cn tc-s2-h">
          <MaskReveal show duration={800}>仓库级 lint,</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="tc-em">挨个查</span>
          </MaskReveal>
        </h1>
        <div className="tc-term card tc-s2-term">
          <div className="tc-term-bar">
            <span className="tc-dot" /><span className="tc-dot" /><span className="tc-dot" />
            <span className="label-mono tc-term-title">validate.sh</span>
          </div>
          <div className="mono tc-cmd-row tc-cmd-static">
            <span className="tc-prompt">$&nbsp;</span>
            <span className="mono">./scripts/validate.sh</span>
            <span className="tc-caret" />
          </div>
          {checks.map((c) => (
            <div
              key={c.label}
              className={["tc-chk", c.extra ? "tc-chk-extra" : ""].filter(Boolean).join(" ")}
              style={{ animationDelay: `${c.at}ms` }}
            >
              <span className="tc-tick" style={{ animationDelay: `${c.at + 180}ms` }} />
              <span className="tc-chk-label">{c.label}</span>
              <span className="tc-chk-val">{c.val}</span>
            </div>
          ))}
          <div className="tc-verdict label-mono" style={{ animationDelay: "11300ms" }}>
            <span className="dot-accent" />&nbsp;0 error · pass
          </div>
        </div>
      </div>
    );
  }

  /* step 3 — CI:push 事件包飞过线,validate 闸门绿放行 */
  if (step === 3) {
    return (
      <div className="tc-scene scene-pad tc-s3">
        <h1 className="tc-h2 serif-cn tc-s3-h">
          <MaskReveal show duration={800}>每次 push,</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="tc-em">必须过闸</span>
          </MaskReveal>
        </h1>
        <div className="tc-ci">
          <div className="tc-ci-evt card" style={{ animationDelay: "300ms" }}>
            <span className="mono tc-ci-cmd">git push</span>
            <span className="tc-ci-sub label-mono">origin main</span>
          </div>
          <div className="tc-ci-wire">
            <span className="tc-ci-line" />
            <span className="tc-ci-pkt" />
            <span className="tc-ci-wire-t label-mono">.github/workflows/validate.yml</span>
          </div>
          <div className="tc-ci-gate card">
            <span className="mono tc-ci-gate-t">validate.sh</span>
            <span className="tc-ci-bars"><span className="tc-ci-bar" /></span>
            <span className="tc-ci-pass label-mono">0 error · pass</span>
          </div>
        </div>
        <div className="label-mono tc-s3-foot">想偷懒都不行 — CI runs it on every push</div>
      </div>
    );
  }

  /* step 4 — evals:改动 → 重跑扫过四张用例卡,东墙修好西墙没塌 */
  if (step === 4) {
    const cases = [
      { id: "e1", prompt: "把这篇文章做成视频网页" },
      { id: "e2", prompt: "帮我画个流程图:合入 main 后 CI 跑构建" },
      { id: "e3", prompt: "十分钟后提醒我检查部署" },
      { id: "e4", prompt: "这套流程每小时巡检一次" },
    ];
    return (
      <div className="tc-scene scene-pad tc-s4">
        <h1 className="tc-h2 serif-cn tc-s4-h">
          <MaskReveal show duration={800}>skill 一改,</MaskReveal>
          <MaskReveal show delay={350} duration={800}>
            <span className="tc-em">重跑一遍</span>
          </MaskReveal>
        </h1>
        <div className="tc-s4-main">
          <div className="tc-s4-left">
            <div className="tc-s4-file card">
              <span className="mono tc-s4-file-t">SKILL.md</span>
              <span className="tc-s4-edit label-mono" style={{ animationDelay: "6200ms" }}>改动</span>
            </div>
            <div className="tc-s4-arrow"><span className="tc-s4-arrow-line" style={{ animationDelay: "6800ms" }} /></div>
            <div className="tc-s4-evals card" style={{ animationDelay: "2600ms" }}>
              <span className="mono tc-s4-evals-t">evals/evals.json</span>
              <span className="tc-s4-evals-f label-mono">prompt + expected_output</span>
            </div>
            <div className="tc-s4-count">
              <span className="hero-num tc-s4-num">3–5</span>
              <span className="serif-cn tc-s4-num-t">条真实场景</span>
            </div>
          </div>
          <div className="tc-s4-cards">
            {cases.map((c, i) => (
              <div key={c.id} className="tc-s4-card card" style={{ animationDelay: `${3200 + i * 500}ms` }}>
                <span className="label-mono tc-s4-card-id">{c.id}</span>
                <span className="tc-s4-card-p">"{c.prompt}"</span>
                <span className="tc-s4-ok" style={{ animationDelay: `${7800 + i * 400}ms` }}>✓</span>
              </div>
            ))}
            <span className="tc-s4-sweep" />
          </div>
        </div>
        <div className="tc-s4-walls">
          <div className="tc-wall">
            <span className="tc-wall-t label-mono">东墙 · 刚改好</span>
            <span className="tc-wall-bricks">
              <i /><i /><i className="tc-brick-patch" style={{ animationDelay: "11200ms" }} /><i /><i /><i />
            </span>
          </div>
          <div className="tc-wall tc-wall-right">
            <span className="tc-wall-t label-mono">西墙 · 没塌</span>
            <span className="tc-wall-bricks"><i /><i /><i /><i /><i /><i /></span>
          </div>
        </div>
      </div>
    );
  }

  /* step 5 — install:Claude/Codex 链接飞点延伸,pi 复制分身 */
  if (step === 5) {
    return (
      <div className="tc-scene scene-pad tc-s5">
        <h1 className="tc-h2 serif-cn tc-s5-h">
          <MaskReveal show duration={800}>链接过去,</MaskReveal>
          <MaskReveal show delay={300} duration={800}>
            <span className="tc-em">pi 复制一份</span>
          </MaskReveal>
        </h1>
        <div className="tc-s5-main">
          <div className="tc-src card" style={{ animationDelay: "300ms" }}>
            <span className="tc-src-k label-mono">唯一真相源</span>
            <span className="mono tc-src-p">plugins/&lt;name&gt;/skills/&lt;name&gt;</span>
          </div>
          <div className="tc-s5-rows">
            <div className="tc-s5-row">
              <span className="tc-s5-agent">Claude</span>
              <span className="tc-s5-wire"><span className="tc-s5-dash" /><span className="tc-s5-link" style={{ animationDelay: "1600ms" }} /></span>
              <span className="tc-s5-tag label-mono" style={{ animationDelay: "2600ms" }}>symlink</span>
            </div>
            <div className="tc-s5-row">
              <span className="tc-s5-agent">Codex</span>
              <span className="tc-s5-wire"><span className="tc-s5-dash" /><span className="tc-s5-link" style={{ animationDelay: "3000ms" }} /></span>
              <span className="tc-s5-tag label-mono" style={{ animationDelay: "4000ms" }}>symlink</span>
            </div>
            <div className="tc-s5-row">
              <span className="tc-s5-agent">pi</span>
              <span className="tc-s5-copy">
                <span className="tc-folder card" />
                <span className="tc-folder tc-folder-clone card" style={{ animationDelay: "4800ms" }} />
              </span>
              <span className="tc-s5-tag tc-s5-tag-copy label-mono" style={{ animationDelay: "5200ms" }}>复制副本</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* step 6 — 装到哪:两个目标目录点亮,pi 的复制位单独标 */
  if (step === 6) {
    const paths = [
      { at: 2200, agent: "claude", dir: "~/.claude/skills/demo-skill", mode: "符号链接" },
      { at: 3800, agent: "codex", dir: "~/.agents/skills/demo-skill", mode: "符号链接" },
    ];
    return (
      <div className="tc-scene scene-pad tc-s6">
        <h1 className="tc-h2 serif-cn tc-s6-h">
          <MaskReveal show duration={800}>装到哪?</MaskReveal>
        </h1>
        <div className="tc-paths">
          {paths.map((p) => (
            <div key={p.agent} className="tc-path card" style={{ animationDelay: `${p.at}ms` }}>
              <span className="tc-path-wipe" style={{ animationDelay: `${p.at + 100}ms` }} />
              <span className="tc-path-agent mono">{p.agent}</span>
              <span className="mono tc-path-dir">{p.dir}</span>
              <span className="mono tc-path-entry" style={{ animationDelay: `${p.at + 500}ms` }}>→ ../../plugins/demo-skill/skills/demo-skill</span>
              <span className="tc-path-mode label-mono">{p.mode}</span>
            </div>
          ))}
          <div className="tc-path tc-path-pi" style={{ animationDelay: "5000ms" }}>
            <span className="tc-path-agent mono">pi</span>
            <span className="mono tc-path-dir">~/.agents/skills/demo-skill</span>
            <span className="tc-path-mode tc-path-mode-copy label-mono">复制副本 · 不跟随链接</span>
          </div>
        </div>
      </div>
    );
  }

  /* step 7~9 — 三条家规:一格一 step,严格逐格揭示 */
  if (step === 7 || step === 8 || step === 9) {
    return (
      <div className="tc-scene scene-pad tc-s7">
        <h1 className="tc-h2 serif-cn tc-s7-h">
          <MaskReveal show duration={800}>写 skill 的<span className="tc-em">三条家规</span></MaskReveal>
        </h1>
        <div className="rule tc-s7-rule" />
        {ruleCells(step - 7)}
      </div>
    );
  }

  return null;
}
