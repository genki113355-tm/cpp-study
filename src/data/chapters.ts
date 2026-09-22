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
import { chapterL12 } from './chapters/chapterL12';
import { chapterL13 } from './chapters/chapterL13';
import { chapterL14 } from './chapters/chapterL14';
import { chapterL15 } from './chapters/chapterL15';
import { chapterL16 } from './chapters/chapterL16';
import { chapterL17 } from './chapters/chapterL17';
import { chapterL18 } from './chapters/chapterL18';
import { chapterL19 } from './chapters/chapterL19';
import { chapterL20 } from './chapters/chapterL20';
import { chapterM4 } from './chapters/modern4';
import { chapterM5 } from './chapters/modern5';
import { chapterM6 } from './chapters/modern6';
import { chapterM7 } from './chapters/modern7';
import { chapterM8 } from './chapters/modern8';
import { chapterModernLambda } from './chapters/modernLambda';
import { chapterModernVariadic } from './chapters/modernVariadic';
import { chapterModernThreading } from './chapters/modernThreading';
import { chapterModernStringView } from './chapters/modernStringView';
import { chapterModernIfConstexpr } from './chapters/modernIfConstexpr';
import { chapterModernFilesystem } from './chapters/modernFilesystem';

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
import { CODE_READING_STEP_4 } from './guides/codeReadingStep4';
import { CODE_READING_STEP_5 } from './guides/codeReadingStep5';
import { CODE_READING_STEP_6 } from './guides/codeReadingStep6';
import { CODE_READING_STEP_7 } from './guides/codeReadingStep7';
import { CODE_READING_STEP_8 } from './guides/codeReadingStep8';
import { CODE_READING_STEP_9 } from './guides/codeReadingStep9';
import { CODE_READING_STEP_10 } from './guides/codeReadingStep10';

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
  chapterL12, // C12: レガシーゲームエンジン統合アーキテクチャ
  chapterL13, // C13: アセット管理とリソースキャッシュ設計
  chapterL14, // C14: 空間分割と超高速衝突判定
  chapterL15, // C15: データ駆動設計（Data-Driven）とスクリプトローダー
  chapterL16, // C16: ビット演算・ビットフラグとステータス異常系
  chapterL17, // C17: レガシーマルチスレッドとロックフリータスクキュー
  chapterL18, // C18: 自作メモリリーク検知器とクラッシュダンプ解析
  chapterL19, // C19: リアルタイム通信とパケットシリアライズ
  chapterL20, // C20: 商用品質レガシーゲームエンジンの集大成とモダンC++への架け橋
];

/** 🚀 モダンコース（C++11〜C++20 / モダンC++・新世代設計編） */
export const MODERN_CHAPTERS: Chapter[] = [
  chapter5,                  // M1【C++11】: スマートポインタとRAII
  chapterM2,                 // M2【C++11/14】: ムーブセマンティクス
  chapterModernLambda,       // M3【C++11/14】: ラムダ式と関数オブジェクト
  chapterModernVariadic,     // M4【C++11/14】: 可変引数テンプレートと完全転送
  chapterModernThreading,    // M5【C++11/14】: 標準マルチスレッドと並行処理
  chapterModernStringView,   // M6【C++17】: ゼロコピー文字列革命：std::string_view
  chapterM4,                 // M7【C++17】: 現代的型システム (variant, optional, constexpr)
  chapterModernIfConstexpr,  // M8【C++17】: if constexpr と構造化束縛
  chapterModernFilesystem,   // M9【C++17】: クロスプラットフォームファイル操作：std::filesystem
  chapter7,                  // M10【C++17】: 継承より合成とECS
  chapterM6,                 // M11【C++20】: コンセプトと型制約
  chapterM5,                 // M12【C++20】: コルーチンによる非同期ゲームループ
  chapterM7,                 // M13【C++20】: Ranges & Views による関数型パイプライン
  chapterM8,                 // M14【C++20】: モジュール完全移行ガイド
];

/** 🧭 コード読解演習トラック（段階的実践読解編） */
export const READING_CHAPTERS: Chapter[] = [
  CODE_READING_STEP_1,  // R1: 手続き型データフローの追跡
  CODE_READING_STEP_2,  // R2: ヘッダAPI仕様とクラス依存の解読
  CODE_READING_STEP_3,  // R3: 多態性・vtable・動的挙動の追跡
  CODE_READING_STEP_4,  // R4: 非同期・マルチスレッド競合コードの読解術
  CODE_READING_STEP_5,  // R5: 巨大オープンソースリポジトリ実地読解（Box2D編）
  CODE_READING_STEP_6,  // R6: メモリ破壊コードの鑑識捜査（Use-After-Free / ASan）
  CODE_READING_STEP_7,  // R7: 難解テンプレート＆メタプログラミングの解読術（型パズル鑑識）
  CODE_READING_STEP_8,  // R8: 10年放置された「魔境コード」のリファクタリング読解（魔境解体）
  CODE_READING_STEP_9,  // R9: クラッシュダンプと逆アセンブラ読解（ダンプ鑑識）
  CODE_READING_STEP_10, // R10: アーキテクチャレビュー：密結合コードの依存構造分析（構造鑑識）
];

/** 📚 特集ガイド＆実践コラム（開発環境・文法・読解術・UML設計・品質保証・デザインパターン・言語思想） */
export const SPECIAL_GUIDES: Chapter[] = [
  ENVIRONMENT_SETUP_GUIDE,    // G1: 実践環境構築ガイド（手元PCで動かす）
  CPP_SYNTAX_REFERENCE_GUIDE, // G2: C++基本文法＆チートシート総覧（逆引き辞書）
  CODE_READING_GUIDE,         // G3: 現場コード読解術総合ガイド（既存コードを読む）
  UML_DESIGN_GUIDE,           // G4: UML設計手法とC++相互変換（設計図とコード）
  GOOGLE_TEST_TDD_GUIDE,      // G5: 品質保証特集（GoogleTest & TDD実践）
  DESIGN_PATTERNS_COLUMN,     // COL1: 現場で役立つデザインパターン入門（GoFの知恵）
  WHY_CPP_IS_HARD_COLUMN,     // COL2: なぜC++は難しいと言われるのか？（歴史と代償）
  WHY_CPP_IS_GREAT_COLUMN,    // COL3: なぜ世界は今もC++で動いているのか？（至高の言語思想）
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
  track: 'classic' | 'modern' | 'reading';
  beforePain: string;
  afterSkill: string;
  gameEvolution: string;
  techKeywords: string[];
}

export const UPCOMING_CHAPTERS: FutureChapterPreview[] = [];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return ALL_ARTICLES.find(c => c.slug === slug);
}
