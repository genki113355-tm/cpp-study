import { Chapter, CourseTrack } from '../types/curriculum';
import { chapter1 } from './chapters/chapter1';
import { chapter2 } from './chapters/chapter2';
import { chapter3 } from './chapters/chapter3';
import { chapter4 } from './chapters/chapter4';
import { chapter5 } from './chapters/chapter5';
import { chapterM2 } from './chapters/modern2';
import { chapter6 } from './chapters/chapter6';
import { chapter7 } from './chapters/chapter7';
import { chapterL6 } from './chapters/chapterL6';
import { chapterL7 } from './chapters/chapterL7';
import { chapterL8 } from './chapters/chapterL8';
import { chapterL9 } from './chapters/chapterL9';
import { chapterL10 } from './chapters/chapterL10';
import { chapterL11 } from './chapters/chapterL11';
import { chapterM4 } from './chapters/modern4';

import { CODE_READING_GUIDE } from './guides/codeReading';
import { WHY_CPP_IS_HARD_COLUMN } from './guides/whyCppIsHard';
import { WHY_CPP_IS_GREAT_COLUMN } from './guides/whyCppIsGreat';
import { DESIGN_PATTERNS_COLUMN } from './guides/designPatterns';
import { ENVIRONMENT_SETUP_GUIDE } from './guides/environmentSetup';
import { UML_DESIGN_GUIDE } from './guides/umlDesignGuide';
import { GOOGLE_TEST_TDD_GUIDE } from './guides/googleTestTdd';
import { CPP_SYNTAX_REFERENCE_GUIDE } from './guides/cppSyntaxReference';

import { CODE_READING_STEP_1 } from './guides/codeReadingStep1';
import { CODE_READING_STEP_2 } from './guides/codeReadingStep2';
import { CODE_READING_STEP_3 } from './guides/codeReadingStep3';

/** 🏛️ レガシーC++コース（C言語・C++03 / クラシックOOP・現場実務編） */
export const CLASSIC_CHAPTERS: Chapter[] = [
  chapter1,   // C1: 構造化設計の限界
  chapter2,   // C2: クラス化とファイル分割
  chapter3,   // C3: 動的メモリとRule of Three
  chapter4,   // C4: 継承とポリモーフィズム
  chapter6,   // C5: ゲームデザインパターン (State & Observer)
  chapterL6,  // C6: 演算子オーバーロードと値オブジェクト
  chapterL7,  // C7: ポインタ演算と手動メモリアライメントの深淵
  chapterL8,  // C8: 関数ポインタとコールバック設計
  chapterL9,  // C9: 多重継承の闇と仮想基底クラス（菱形継承）
  chapterL10, // C10: 静的ポリモーフィズム入門（CRTPとクラシックTemplate）
  chapterL11, // C11: 独自メモリアロケータと固定長プール管理
];

/** 🚀 モダンコース（C++11〜C++17 / モダンC++・新世代設計編） */
export const MODERN_CHAPTERS: Chapter[] = [
  chapter5,  // M1: スマートポインタとRAII
  chapterM2, // M2: ムーブセマンティクスとモダンC++機能
  chapter7,  // M3: 継承より合成とECS
  chapterM4, // M4: 現代的型システム (variant, optional, constexpr)
];

/** 🧭 コード読解演習トラック（段階的実践読解編） */
export const READING_CHAPTERS: Chapter[] = [
  CODE_READING_STEP_1, // R1: 手続き型データフローの追跡
  CODE_READING_STEP_2, // R2: ヘッダAPI仕様とクラス依存の解読
  CODE_READING_STEP_3, // R3: 多態性・vtable・動的挙動の追跡
];

/** 📚 特集ガイド＆実践コラム（品質保証・読解術・言語思想・環境構築・UML設計・デザインパターン） */
export const SPECIAL_GUIDES: Chapter[] = [
  CPP_SYNTAX_REFERENCE_GUIDE, // 付録: C++基本文法＆チートシート総覧
  GOOGLE_TEST_TDD_GUIDE,      // G4: 品質保証特集（GoogleTest & TDD実践）
  CODE_READING_GUIDE,         // G1: 現場コード読解術総合ガイド
  DESIGN_PATTERNS_COLUMN,     // 特別コラム: 現場で役立つデザインパターン入門
  UML_DESIGN_GUIDE,           // G3: UML設計手法とC++相互変換
  WHY_CPP_IS_GREAT_COLUMN,    // 特別コラム: それでも私たちがC++を愛する理由
  WHY_CPP_IS_HARD_COLUMN,     // コラム: C++が難しい理由
  ENVIRONMENT_SETUP_GUIDE,    // G2: C++環境構築ガイド
];

/** 実践設計カリキュラム一覧（進捗計算・コース学習用） */
export const ALL_CHAPTERS: Chapter[] = [
  ...CLASSIC_CHAPTERS,
  ...MODERN_CHAPTERS,
  ...READING_CHAPTERS,
];

/** プラットフォーム全コンテンツ（設計章 ＋ 読解トラック ＋ ガイド ＋ コラム） */
export const ALL_ARTICLES: Chapter[] = [
  ...ALL_CHAPTERS,
  ...SPECIAL_GUIDES,
];

export function getChaptersByCourse(track: CourseTrack): Chapter[] {
  if (track === 'modern') return MODERN_CHAPTERS;
  if (track === 'reading') return READING_CHAPTERS;
  if (track === 'guide') return SPECIAL_GUIDES;
  return CLASSIC_CHAPTERS;
}

// 将来追加予定の章メタデータ（20〜30章拡張構想）
export interface FutureChapterPreview {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  isUpcoming: boolean;
}

export const UPCOMING_CHAPTERS: FutureChapterPreview[] = [
  // レガシーC++コース 拡張予定
  { id: 1012, slug: 'upcoming-l12', title: '【L12】レガシーゲームエンジン統合開発実務', subtitle: 'メインループ・レンダラ・物理・サウンドの疎結合オーケストレーション', badge: 'レガシーC++ L12（準備中）', isUpcoming: true },

  // モダンC++コース 拡張予定
  { id: 2005, slug: 'upcoming-m5', title: '【M5】C++20 コルーチン（Coroutines）による非同期ゲームループ', subtitle: 'co_await / co_yield でステートマシン地獄を解消する', badge: 'モダンC++ M5（準備中）', isUpcoming: true },
  { id: 2006, slug: 'upcoming-m6', title: '【M6】C++20 コンセプト（Concepts）と契約プログラミング', subtitle: 'テンプレートの難解なエラーメッセージを完全駆逐する', badge: 'モダンC++ M6（準備中）', isUpcoming: true },
  { id: 2007, slug: 'upcoming-m7', title: '【M7】C++20 Ranges & Views による関数型パイプライン', subtitle: 'ループを書かないエレガントなゲームデータフィルタリング', badge: 'モダンC++ M7（準備中）', isUpcoming: true },
  { id: 2008, slug: 'upcoming-m8', title: '【M8】C++20 モジュール（Modules）完全移行ガイド', subtitle: '#include ヘッダ地獄からの脱却と超高速ビルドの実現', badge: 'モダンC++ M8（準備中）', isUpcoming: true },

  // 読解演習トラック 拡張予定
  { id: 3004, slug: 'upcoming-r4', title: '【R4】非同期・マルチスレッド競合コードの読解術', subtitle: 'mutex / atomic / レースコンディションの潜伏箇所を暴く', badge: '読解演習 R4（準備中）', isUpcoming: true },
  { id: 3005, slug: 'upcoming-r5', title: '【R5】巨大オープンソースリポジトリ実地読解（Box2D編）', subtitle: 'トップダウン探索と依存グラフ可視化で未知のエンジンを攻略', badge: '読解演習 R5（準備中）', isUpcoming: true },
];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return ALL_ARTICLES.find(c => c.slug === slug);
}
