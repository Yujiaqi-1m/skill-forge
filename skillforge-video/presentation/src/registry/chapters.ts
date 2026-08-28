import type { ChapterDef } from "./types";
import Coldopen from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import Anatomy from "../chapters/02-anatomy/Anatomy";
import { narrations as anatomyNarrations } from "../chapters/02-anatomy/narrations";
import SkillsTour from "../chapters/03-skills-tour/SkillsTour";
import { narrations as skillsTourNarrations } from "../chapters/03-skills-tour/narrations";
import Layout from "../chapters/04-layout/Layout";
import { narrations as layoutNarrations } from "../chapters/04-layout/narrations";
import Toolchain from "../chapters/05-toolchain/Toolchain";
import { narrations as toolchainNarrations } from "../chapters/05-toolchain/narrations";
import Casestudy from "../chapters/06-casestudy/Casestudy";
import { narrations as casestudyNarrations } from "../chapters/06-casestudy/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "coldopen",
    title: "同一个 skill,三个 agent",
    narrations: coldopenNarrations,
    Component: Coldopen,
  },
  {
    id: "anatomy",
    title: "一个 skill 长什么样",
    narrations: anatomyNarrations,
    Component: Anatomy,
  },
  {
    id: "skills-tour",
    title: "仓库三件套",
    narrations: skillsTourNarrations,
    Component: SkillsTour,
  },
  {
    id: "layout",
    title: "一个真相源,一排符号链接",
    narrations: layoutNarrations,
    Component: Layout,
  },
  {
    id: "toolchain",
    title: "三个脚本转一圈",
    narrations: toolchainNarrations,
    Component: Toolchain,
  },
  {
    id: "casestudy",
    title: "蒸馏实战与收尾",
    narrations: casestudyNarrations,
    Component: Casestudy,
  },
];
