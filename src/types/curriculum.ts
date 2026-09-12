export type CharacterId = 'shirokuma' | 'penguin';

export type CharacterEmotion = 
  | 'normal' 
  | 'smug' 
  | 'shocked' 
  | 'thinking' 
  | 'teaching' 
  | 'question' 
  | 'happy' 
  | 'sweating';

export interface DialogueItem {
  id: string;
  speaker: CharacterId;
  emotion: CharacterEmotion;
  text: string;
  sideNote?: string;
}

export interface CodeFile {
  filename: string;
  language: string;
  description: string;
  isMain?: boolean;
  code: string;
  highlightLines?: number[];
  diffType?: 'original' | 'refactored' | 'added';
}

export interface VariableDoc {
  name: string;
  type: string;
  scope: string;
  description: string;
  cComparison?: string; // C言語における対応物・違い
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  codeSnippet?: string;
  description: string;
  impact: string;
  designIntent?: string; // なぜこの設計・順序にするのかという意図
}

export interface ParadigmComparison {
  title: string;
  cApproach: {
    title: string;
    code: string;
    drawbacks: string[];
  };
  cppApproach: {
    title: string;
    code: string;
    benefits: string[];
  };
  paradigmShiftNotes: string;
}

export interface MemoryMapDoc {
  title: string;
  description: string;
  asciiArt: string;
  stackItems: { address: string; variable: string; value: string; notes: string }[];
  heapItems?: { address: string; object: string; state: string; lifecycle: string }[];
  lifecycleExplanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface KeyTakeaway {
  title: string;
  description: string;
  icon?: string;
}

export type DiagramType = 
  | 'spaghetti_vs_modular' 
  | 'class_encapsulation' 
  | 'vector_memory_lifecycle' 
  | 'inheritance_vtable'
  | 'smart_pointer_ownership'
  | 'state_observer_pattern'
  | 'ecs_composition_template';

export interface CodeHighlightTarget {
  filename?: string;
  line?: number;
  keyword?: string;
  timestamp?: number;
}

export interface UmlClassMember {
  name: string;
  type: string;
  visibility: '+' | '-' | '#';
  isStatic?: boolean;
  isVirtual?: boolean;
  codeLineRef?: {
    filename?: string;
    line?: number;
    keyword?: string;
  };
}

export interface UmlRelation {
  from: string;
  to: string;
  type: 'association' | 'aggregation' | 'composition' | 'generalization' | 'realization';
  multiplicityFrom?: string;
  multiplicityTo?: string;
  label?: string;
  cppMapping?: string;
}

export interface UmlClassItem {
  name: string;
  stereotype?: string;
  isAbstract?: boolean;
  attributes: UmlClassMember[];
  operations: UmlClassMember[];
}

export interface UmlSequenceMessage {
  from: string;
  to: string;
  message: string;
  isReturn?: boolean;
  cppCodeSnippet?: string;
}

export interface UmlStateTransition {
  from: string;
  to: string;
  event: string;
  guard?: string;
  action?: string;
}

export interface UmlDiagramDoc {
  diagramType: 'class' | 'sequence' | 'state';
  title: string;
  subtitle?: string;
  description: string;
  classes?: UmlClassItem[];
  relations?: UmlRelation[];
  sequenceParticipants?: string[];
  sequenceMessages?: UmlSequenceMessage[];
  stateTransitions?: UmlStateTransition[];
  codeMappingNotes: string[];
}

export interface SectionContent {
  id: string;
  title: string;
  leadText?: string;
  dialogueBefore?: DialogueItem[];
  variables?: VariableDoc[];
  paradigmComparison?: ParadigmComparison;
  memoryMap?: MemoryMapDoc;
  processSteps?: ProcessStep[];
  codeFiles?: CodeFile[];
  diagramType?: DiagramType;
  umlDiagram?: UmlDiagramDoc;
  explanationText?: string;
  dialogueAfter?: DialogueItem[];
  takeaways?: KeyTakeaway[];
}

export type CourseTrack = 'classic' | 'modern' | 'reading' | 'guide';

export type ContentCategory = 'architecture' | 'reading' | 'guide' | 'column';

export interface Chapter {
  id: number;
  slug: string;
  category?: ContentCategory;
  courseTrack?: CourseTrack;
  courseChapterCode?: string; // e.g. 'C1', 'C2', 'M1', 'M2', 'R1', 'G1'
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  gameVersion?: 'v1_spaghetti' | 'v2_classes' | 'v3_dynamic' | 'v4_polymorphism' | 'v5_smart_pointers' | 'v6_patterns' | 'v7_ecs_final' | 'none';
  umlDiagram?: UmlDiagramDoc;
  sections: SectionContent[];
  quiz?: QuizQuestion[];
  nextChapterSlug?: string;
  prevChapterSlug?: string;
}
