import { Annotation } from "@langchain/langgraph";
import { Source, Claim, Contradiction } from "./types";

export const ResearchStateAnnotation = Annotation.Root({
  sessionId: Annotation<string>(),
  question: Annotation<string>(),
  retryCount: Annotation<number>({
    reducer: (x, y) => y,
    default: () => 0,
  }),
  researchObjectives: Annotation<string[]>({
    reducer: (x, y) => y,
    default: () => [],
  }),
  sources: Annotation<Source[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),
  researchNotes: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "",
  }),
  claims: Annotation<Claim[]>({
    reducer: (x, y) => y,
    default: () => [],
  }),
  contradictions: Annotation<Contradiction[]>({
    reducer: (x, y) => y,
    default: () => [],
  }),
  confidenceScore: Annotation<number>({
    reducer: (x, y) => y,
    default: () => 50,
  }),
  finalReport: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "",
  }),
  status: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "idle",
  }),
});

export type ResearchState = typeof ResearchStateAnnotation.State;
export type ResearchStateFields = typeof ResearchStateAnnotation.spec;
export type ResearchStateChannels = typeof ResearchStateAnnotation.channels;
