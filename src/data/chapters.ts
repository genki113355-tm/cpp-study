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
  CODE_READING_STEP_1, // R1: 手続き型データフローの追跡
  CODE_READING_STEP_2, // R2: ヘッダAPI仕様とクラス依存の解読
  CODE_READING_STEP_3, // R3: 多態性・vtable・動的挙動の追跡
  CODE_READING_STEP_4, // R4: 非同期・マルチスレッド競合コードの読解術
  CODE_READING_STEP_5, // R5: 巨大オープンソースリポジトリ実地読解（Box2D編）
  CODE_READING_STEP_6, // R6: メモリ破壊コードの鑑識捜査（Use-After-Free / ASan）
  CODE_READING_STEP_7, // R7: 難解テンプレート＆メタプログラミングの解読術（型パズル鑑識）
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

export const UPCOMING_CHAPTERS: FutureChapterPreview[] = [
  // 🚀 モダンC++コース 拡張予定（C++20発展・C++23/26次世代編）
  {
    id: 2015,
    slug: 'upcoming-m15',
    title: '【M15】C++23 新世代機能：std::expected とゼロコスト出力',
    subtitle: '例外禁止環境の救世主 std::expected と、関数型エラーハンドリング',
    badge: 'モダンC++ M15【C++23】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'ゲーム業界特有の「例外（try-catch）使用禁止」規約により、エラーコードと出力引数の泥臭いC言語的戻り値地獄に逆戻り。',
    afterSkill: '正常値またはエラー型を型安全に保持する std::expected と monadic operation（.and_then, .or_else）によるエレガントなエラー伝播。',
    gameEvolution: 'クラッシュせず例外オーバーヘッドもゼロ！エラー原因が美しく一目でわかる安全設計！',
    techKeywords: ['C++23', 'std::expected', 'Monadic Operations', '例外禁止環境'],
  },
  {
    id: 2016,
    slug: 'upcoming-m16',
    title: '【M16】std::span と連続メモリビュー：配列コピーの完全撲滅',
    subtitle: '生配列・vector・std::array の境界を破壊する軽量安全スライス',
    badge: 'モダンC++ M16【C++20】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: '関数に配列を渡すためにポインタとサイズを2引数で渡し、うっかり範囲外アクセスしてメモリ破壊。',
    afterSkill: 'std::span<T> により、コンテナの型に依存せず連続メモリ領域を安全に参照・スライス操作。',
    gameEvolution: 'サウンド波形バッファや頂点データのサブセット転送がコピーゼロかつ境界安全に！',
    techKeywords: ['std::span', 'メモリビュー', 'スライス操作', 'C++20'],
  },
  {
    id: 2017,
    slug: 'upcoming-m17',
    title: '【M17】std::jthread と協調的停止（stop_token）',
    subtitle: 'join() 忘れクラッシュの撲滅と、安全なスレッド中断・フレーム同期',
    badge: 'モダンC++ M17【C++20】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'スレッド終了時に join() を呼び忘れて std::terminate() で即死。スレッドの安全停止にグローバルフラグが散乱。',
    afterSkill: 'デストラクタで自動合流する std::jthread、std::stop_token による協調的キャンセル、std::latch によるマルチスレッドフレーム同期。',
    gameEvolution: 'ゲーム終了時やステージ切り替え時に、バックグラウンドスレッドが100%安全かつミリ秒で停止！',
    techKeywords: ['std::jthread', 'stop_token', 'std::latch', 'C++20'],
  },
  {
    id: 2018,
    slug: 'upcoming-m18',
    title: '【M18】モダンビット操作ライブラリ（<bit>）と超低レイヤ最適化',
    subtitle: '未定義動作ゼロの型パンニング std::bit_cast と CPU組み込み命令の直結',
    badge: 'モダンC++ M18【C++20】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'ビットパターンを浮動小数点に変換する際に reinterpret_cast やポインタキャストを使ってUB（未定義動作）に。',
    afterSkill: 'std::bit_cast による安全なビットキャスト、std::popcount（POPCNT命令）や std::countl_zero による1クロックビットカウント。',
    gameEvolution: '弾幕のビットマスク判定や乱数生成器がハードウェア直結の最高速で動作！',
    techKeywords: ['<bit>', 'std::bit_cast', 'std::popcount', 'C++20'],
  },
  {
    id: 2019,
    slug: 'upcoming-m19',
    title: '【M19】多次元配列ビュー：std::mdspan による行列・グリッド演算',
    subtitle: '2Dマップ・3Dボクセル・物理空間の1次元連続メモリ超高速マッピング',
    badge: 'モダンC++ M19【C++23】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: '2次元配列を vector<vector<T>> で作ってヒープ断片化とキャッシュミスが激発。1次元化すると y * width + x の手計算でバグる。',
    afterSkill: 'std::mdspan による grid[y, x] 構文でのゼロコスト多次元アクセスと、行優先/列優先レイアウトの透過的切り替え。',
    gameEvolution: '全画面の当たり判定空間グリッドとマップチップ走査がキャッシュヒット率極大で爆速化！',
    techKeywords: ['std::mdspan', '多次元配列ビュー', 'データ指向設計', 'C++23'],
  },
  {
    id: 2020,
    slug: 'upcoming-m20',
    title: '【M20】Deducing this（明示的オブジェクトパラメータ）による新世代CRTP',
    subtitle: 'クラシックC++の奇妙に再帰したテンプレートパターン（CRTP）の終焉',
    badge: 'モダンC++ M20【C++23】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: '静的ポリモーフィズムを実現するために template <class Derived> class Base などの難解なCRTP構文が必要だった。',
    afterSkill: 'メンバ関数の第1引数に this self を取る明示的オブジェクト引数構文により、CRTPや再帰ラムダが驚くほど平易に。',
    gameEvolution: '基底クラスのゼロオーバーヘッド静的継承が、通常のクラス継承と同じシンプルさで記述可能に！',
    techKeywords: ['Deducing this', '明示的オブジェクト引数', 'CRTP簡素化', 'C++23'],
  },
  {
    id: 2021,
    slug: 'upcoming-m21',
    title: '【M21】std::format / std::print による次世代文字列フォーマット',
    subtitle: 'printf の型安全性欠如と std::cout の冗長・低速を両方解決する究極の書式出力',
    badge: 'モダンC++ M21【C++20/23】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'printf は型指定子を間違えるとクラッシュ、std::cout は << の連続でコードが散らかり実行速度も遅い。',
    afterSkill: 'Python風の {} プレースホルダー、コンパイル時書式文字列検証、iostreams を介さない高速バッファ直接出力。',
    gameEvolution: 'ゲーム内コンソールログやデバッグHUDの文字列描画処理が2倍以上高速化！',
    techKeywords: ['std::format', 'std::print', '型安全書式', 'C++20/23'],
  },
  {
    id: 2022,
    slug: 'upcoming-m22',
    title: '【M22】C++26先取り：静的リフレクションとコード自動生成の未来',
    subtitle: 'コンパイル時メタ情報抽出によるゲームエンジンインスペクタとセーブデータ自動化',
    badge: 'モダンC++ M22【C++26】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'クラスの変数をシリアライズしたりGUIインスペクタに表示するために、マクロや外部コード生成ツールが必要だった。',
    afterSkill: '言語標準の静的リフレクション（Static Reflection）により、コンパイル時に構造体のメンバ名や型を自動ループ処理。',
    gameEvolution: '構造体を定義するだけで、セーブデータ書き出し・JSON変換・ImGuiインスペクタが全自動生成！',
    techKeywords: ['C++26', '静的リフレクション', 'メタプログラミング', '自動コード生成'],
  },

  // 🧭 読解演習トラック 拡張予定（R7〜R10：リファクタリング＆リバースエンジニアリング編）
  {
    id: 3007,
    slug: 'upcoming-r7',
    title: '【R7】10年放置された「魔境コード」のリファクタリング読解',
    subtitle: 'マクロ汚染・暗黙型変換・グローバル乱立の安全な切り分け',
    badge: '読解演習 R7（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: '仕様書がなく変数名も意味不明なレガシーコードに触るのが怖くて手が出せない。',
    afterSkill: 'インパクト解析、スコープの狭小化、キャラクタライゼーションテストによる保護。',
    gameEvolution: '2005年代の難解なゲームロジックコードを壊さず分離・解読できるようになる！',
    techKeywords: ['レガシー改善', 'キャラクタライゼーションテスト', 'マクロ除去', 'スコープ分離'],
  },
  {
    id: 3008,
    slug: 'upcoming-r8',
    title: '【R8】テンプレートメタプログラミングとSFINAEコードの解読',
    subtitle: 'enable_if / 型トレイトが渦巻くヘッダオンリーライブラリの解明',
    badge: '読解演習 R8（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: 'テンプレートの型推論が複雑すぎて「なぜこの関数が呼ばれるのか」追えない。',
    afterSkill: 'SFINAE（代入失敗はエラーにあらず）の意図、型トレイトの特殊化パターンの読解。',
    gameEvolution: '自作STL風コンテナや高速アルゴリズムライブラリの内部実装を自由自在に読み解く！',
    techKeywords: ['SFINAE', 'std::enable_if', '型トレイト', 'テンプレート読解'],
  },
  {
    id: 3009,
    slug: 'upcoming-r9',
    title: '【R9】クラッシュダンプと逆アセンブラ読解（MiniDump）',
    subtitle: 'MiniDump とレジスタ（RAX/RSP）から現場を特定する技術',
    badge: '読解演習 R9（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: 'リリースビルド（最適化-O2）でソースコードと行番号が一致しないクラッシュ。',
    afterSkill: 'コールスタック復元、レジスタ値からの引数特定、アセンブリ命令の逆引き。',
    gameEvolution: '最適化でインライン化された関数のNullPointerDereference現場を突き止める！',
    techKeywords: ['MiniDump解析', '逆アセンブラ', 'レジスタ解析', '最適化後デバッグ'],
  },
  {
    id: 3010,
    slug: 'upcoming-r10',
    title: '【R10】アーキテクチャレビュー：密結合コードの依存構造分析',
    subtitle: '循環参照と神クラスを解体するための依存性グラフ抽出',
    badge: '読解演習 R10（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: 'クラス同士が互いを参照し合い、1つ触るとすべて再コンパイルになる泥沼。',
    afterSkill: '依存関係の矢印の方向（DIP）、抽象インターフェースの挿入ポイントの特定。',
    gameEvolution: '肥大化した神クラスの解体計画書を作成し、アーキテクチャ刷新を主導できる！',
    techKeywords: ['アーキテクチャレビュー', '循環依存解消', 'DIP原則', 'リファクタリング計画'],
  },
];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return ALL_ARTICLES.find(c => c.slug === slug);
}
