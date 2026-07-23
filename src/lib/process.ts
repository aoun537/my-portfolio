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
      "Every project starts with what the thing is for, who uses it, and what already exists. I read the codebase, ask the awkward questions, and get a plain answer to {what problem this actually solves}.",
    color: "#2FA9C4",
  },
  {
    word: "DEFINE",
    title: "CUT THE SCOPE.",
    description:
      "Most builds fail by trying to do everything at once. I find the {one flow that has to work}, agree what ships first, and park the rest where it can be found later.",
    color: "#CB1F37",
  },
  {
    word: "DESIGN",
    title: "PROTOTYPE, DON'T GUESS.",
    description:
      "Before anything is built for real, you click it: layouts, states, and a working prototype. We find out the idea is wrong while it is still {cheap to change}.",
    color: "#F4980F",
  },
  {
    word: "BUILD",
    title: "BUILD IT FOR REAL.",
    description:
      "Typed end to end, accessible by default, fast on a cheap phone, and reviewed line by line. Code written so the next person to open it, including you, gets {one obvious way forward}.",
    color: "#96BF9D",
  },
  {
    word: "REFINE",
    title: "SWEAT THE LAST TEN.",
    description:
      "The last ten percent is what users feel. I profile the slow paths, kill the bugs nobody has hit yet, and keep tuning until the {interface stops getting in the way}.",
    color: "#CB1F37",
  },
];
