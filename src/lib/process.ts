/**
 * Five-step working process for the pinned twin-circle section.
 * The accent circle recolors per step from the global palette.
 */

export interface ProcessStep {
  word: string;
  title: string;
  /** One tight paragraph. Wrap emphasis in {curly braces} to render accented. */
  description: string;
  /** Accent circle color for this step (from the global palette). */
  color: string;
}

export const processSteps: ProcessStep[] = [
  {
    word: "DISCOVER",
    title: "LISTEN FIRST.",
    description:
      "Every engagement starts with your goals, your market, and your numbers. I audit what exists, ask the awkward questions, and get a plain answer to {what is actually holding you back}.",
    color: "#2FA9C4",
  },
  {
    word: "DEFINE",
    title: "FIND THE ANGLE.",
    description:
      "Most businesses try to say five things and win none. I find the {one idea worth keeping}, the searches with real buying intent, and shape the plan around them.",
    color: "#CB1F37",
  },
  {
    word: "DESIGN",
    title: "PROTOTYPE, DON'T GUESS.",
    description:
      "Before anything is built for real, you see it: page structures, copy directions, and working drafts. We test the idea while it is still {cheap to change}.",
    color: "#F4980F",
  },
  {
    word: "BUILD",
    title: "BUILD IT FOR REAL.",
    description:
      "Websites, profiles, and systems shipped properly: typed end to end, fast on a cheap phone, structured so Google reads them at a glance, and giving every visitor {one obvious next step}.",
    color: "#96BF9D",
  },
  {
    word: "REFINE",
    title: "SWEAT THE LAST TEN.",
    description:
      "The last ten percent is what customers feel. I track positions, calls, and form fills, kill the bugs nobody has hit yet, and keep tuning until the {results ring the phone}.",
    color: "#CB1F37",
  },
];
