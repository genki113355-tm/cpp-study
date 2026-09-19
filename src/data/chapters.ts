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
import { chapterM4 } from './chapters/modern4';
import { chapterM5 } from './chapters/modern5';
import { chapterM6 } from './chapters/modern6';
import { chapterM7 } from './chapters/modern7';
import { chapterM8 } from './chapters/modern8';
import { chapterModernLambda } from './chapters/modernLambda';
import { chapterModernVariadic } from './chapters/modernVariadic';
import { chapterModernThreading } from './chapters/modernThreading';

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
  chapterL12, // C12: レガシーゲームエンジン統合アーキテクチャ
  chapterL13, // C13: アセット管理とリソースキャッシュ設計
  chapterL14, // C14: 空間分割と超高速衝突判定
  chapterL15, // C15: データ駆動設計（Data-Driven）とスクリプトローダー
  chapterL16, // C16: ビット演算・ビットフラグとステータス異常系
];

/** 🚀 モダンコース（C++11〜C++20 / モダンC++・新世代設計編） */
export const MODERN_CHAPTERS: Chapter[] = [
  chapter5,              // M1【C++11】: スマートポインタとRAII
  chapterM2,             // M2【C++11/14】: ムーブセマンティクス
  chapterModernLambda,    // M3【C++11/14】: ラムダ式と関数オブジェクト
  chapterModernVariadic,  // M4【C++11/14】: 可変引数テンプレートと完全転送
  chapterModernThreading, // M5【C++11/14】: 標準マルチスレッドと並行処理
  chapterM4,             // M7【C++17】: 現代的型システム (variant, optional, constexpr)
  chapter7,              // M10【C++17】: 継承より合成とECS
  chapterM6,             // M11【C++20】: コンセプトと型制約
  chapterM5,             // M12【C++20】: コルーチンによる非同期ゲームループ
  chapterM7,             // M13【C++20】: Ranges & Views による関数型パイプライン
  chapterM8,             // M14【C++20】: モジュール完全移行ガイド
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
  track: 'classic' | 'modern' | 'reading';
  beforePain: string;
  afterSkill: string;
  gameEvolution: string;
  techKeywords: string[];
}

export const UPCOMING_CHAPTERS: FutureChapterPreview[] = [
  // 🏛️ レガシーC++コース 拡張予定（L17〜L20：本格ゲームエンジン＆現場低レイヤ実務編）
  {
    id: 1017,
    slug: 'upcoming-l17',
    title: '【L17】レガシーマルチスレッドとロックフリータスクキュー',
    subtitle: 'pthread / Win32時代の泥臭い排他制御とワーカースレッドプール',
    badge: 'レガシーC++ L17（準備中）',
    isUpcoming: true,
    track: 'classic',
    beforePain: 'ステージ間のリソース読み込みや重い計算処理でゲーム画面が一瞬フリーズ。排他制御を誤ってデッドロック多発。',
    afterSkill: 'スレッドプールの自作、mutex/条件変数を用いたプロデューサー・コンシューマーキュー、レースコンディションの完全防御。',
    gameEvolution: 'ゲームプレイを一切止めずに裏で次ステージのリソースをバックグラウンド非同期ロード！ロード画面ゼロへ！',
    techKeywords: ['マルチスレッド', 'ワーカースレッドプール', 'ミューテックス/条件変数', '非同期バックグラウンド読込'],
  },
  {
    id: 1018,
    slug: 'upcoming-l18',
    title: '【L18】自作メモリリーク検知器とクラッシュダンプ解析',
    subtitle: 'グローバル new/delete オーバーライドによる確保履歴トラッキングとコールスタック記録',
    badge: 'レガシーC++ L18（準備中）',
    isUpcoming: true,
    track: 'classic',
    beforePain: '「ゲーム終了時に32バイトだけメモリリークしている」と警告が出るが、何万行のコードのどこで確保されたか分からない。',
    afterSkill: 'グローバル operator new/delete のオーバーロードによる確保サイズ・ファイル名・行番号・スタックトレースの自動記録機構の自作。',
    gameEvolution: 'ゲーム内デバッグコンソールにリアルタイムメモリ使用量とリーク警告がリアルタイム表示！',
    techKeywords: ['グローバルnewオーバーライド', 'メモリリーク検知器', 'コールスタック追跡', 'クラッシュダンプ解析'],
  },
  {
    id: 1019,
    slug: 'upcoming-l19',
    title: '【L19】リアルタイム通信とパケットシリアライズ',
    subtitle: 'Berkeley Sockets (UDP/TCP) による自機同期・補間・エンディアン変換',
    badge: 'レガシーC++ L19（準備中）',
    isUpcoming: true,
    track: 'classic',
    beforePain: 'ネットワーク対戦で異なるCPU環境（エンディアン違い）同士で通信すると座標データが壊れる。パケット遅延で敵がワープする。',
    afterSkill: 'ソケットAPI（UDP/TCP）通信、htonl/ntohlによるエンディアン変換、デッドレコニング（推測航法）と位置補間アルゴリズム。',
    gameEvolution: '2台のPCでLAN対戦・2人協力プレイインベーダーが実現！滑らかな同期通信！',
    techKeywords: ['Berkeley Sockets', 'エンディアン変換', 'デッドレコニング推測航法', 'リアルタイム通信同期'],
  },
  {
    id: 1020,
    slug: 'upcoming-l20',
    title: '【L20】商用品質レガシーゲームエンジンの完成',
    subtitle: 'C1〜C19の全技術を結集したアーキテクチャの完成とモダンC++への架け橋',
    badge: 'レガシーC++ L20（準備中）',
    isUpcoming: true,
    track: 'classic',
    beforePain: 'これまで学んだメモリプール、空間分割、リソース管理、マルチスレッド、通信がバラバラの知識になってしまっている。',
    afterSkill: '全サブシステムを1つの堅牢な自作2Dゲームエンジンとして統合。クラシックC++設計の極致を体得し、モダンC++（C++11〜23）の進化の必然性を実感する。',
    gameEvolution: '最初の Stage 1 のスパゲティコードから完全に生まれ変わった、商用グレードの自作ゲームエンジン「ShirokumaEngine」が完成！',
    techKeywords: ['自作ゲームエンジンアーキテクチャ', '全サブシステム統合', 'C++03の集大成', 'モダンC++への架け橋'],
  },

  // 🚀 モダンC++コース 拡張予定（実務黄金世代 C++17 補完 ＆ C++23新世代編）
  {
    id: 2006,
    slug: 'upcoming-m6',
    title: '【M6】ゼロコピー文字列革命：std::string_view',
    subtitle: '文字列を関数に渡すたびに発生するヒープアロケーション（malloc/new）の撲滅',
    badge: 'モダンC++ M6【C++17】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'アセットパスや敵の名前を関数に渡すたびに std::string のコピーが走り、激しいヒープ断片化とフレーム落ちが発生。',
    afterSkill: 'ポインタと長さだけの軽量ビュー std::string_view を駆使し、メモリコピーゼロで文字列探索や部分切り出しを爆速実行。',
    gameEvolution: '何万回のアセットパス照合やテキスト解析がメモリ割り当てゼロで一瞬で完了！',
    techKeywords: ['std::string_view', 'ゼロコピー', 'ヒープ削減', 'C++17'],
  },
  {
    id: 2008,
    slug: 'upcoming-m8',
    title: '【M8】テンプレート革命：if constexpr と構造化束縛',
    subtitle: 'SFINAE（enable_if）の魔術を葬り去るコンパイル時分岐とタプル展開',
    badge: 'モダンC++ M8【C++17】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: '型ごとに処理を分けるために何十行もの難解な enable_if を書き、コンパイルエラーで日が暮れる。',
    afterSkill: 'if constexpr による1行の直感的なコンパイル時型分岐と、auto [x, y, hp] = ... による直感的な複数値受け取り。',
    gameEvolution: 'メタプログラミングコードが普通の if 文と同じ読みやすさになり、保守性が劇的に向上！',
    techKeywords: ['if constexpr', '構造化束縛', 'SFINAE撤廃', 'C++17'],
  },
  {
    id: 2009,
    slug: 'upcoming-m9',
    title: '【M9】クロスプラットフォームファイル操作：std::filesystem',
    subtitle: 'Windowsの「\\」とUnixの「/」問題の終焉！OSネイティブAPI依存からの完全脱却',
    badge: 'モダンC++ M9【C++17】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'セーブデータやアセットディレクトリの走査で、Windows用（FindFirstFile）とMac/Linux用（opendir）を別々に実装。',
    afterSkill: '標準ライブラリ std::filesystem によるパス操作、ファイル存在確認、ディレクトリ走査、セーブデータ安全書き出し。',
    gameEvolution: 'Steam / Switch / PS5 / PC で100%同一のセーブ＆アセット探索コードが稼働！',
    techKeywords: ['std::filesystem', 'クロスプラットフォーム', 'パストラバース', 'C++17'],
  },
  {
    id: 2015,
    slug: 'upcoming-m15',
    title: '【M15】C++23 新世代機能：std::expected とゼロコスト出力',
    subtitle: '例外禁止環境の救世主 std::expected と、std::print による爆速フォーマット',
    badge: 'モダンC++ M15【C++23】（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'ゲーム業界特有の「例外（try-catch）使用禁止」規約により、エラーコードと出力引数の泥臭いC言語的戻り値地獄に逆戻り。',
    afterSkill: '正常値またはエラー型を保持する std::expected による関数型エラーハンドリングと、std::print による型安全フォーマット。',
    gameEvolution: 'クラッシュせず例外コストもゼロ！エラー原因が美しく一目瞭然に出力！',
    techKeywords: ['C++23', 'std::expected', 'std::print', 'Deducing this'],
  },
  {
    id: 2013,
    slug: 'upcoming-m13',
    title: '【M13】現代的メモリモデルとアトミック操作（Lock-free）',
    subtitle: 'acquire / release セマンティクスとロックフリーメッセージキュー',
    badge: 'モダンC++ M13（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: '排他制御（mutex）のロック競合でFPSが低下、アトミックの誤用による未定義動作。',
    afterSkill: 'std::atomic のメモリオーダー（memory_order_acquire/release）、ロックフリーキューの設計。',
    gameEvolution: 'ロック待ちゼロでスレッド間メッセージ通信が超高速に行われる！',
    techKeywords: ['std::atomic', 'メモリモデル', 'acquire/release', 'ロックフリー設計'],
  },
  {
    id: 2014,
    slug: 'upcoming-m14',
    title: '【M14】ゼロオーバーヘッドIPCとデータシリアライゼーション',
    subtitle: 'パースコストゼロの高速通信とプロセス間連携（FlatBuffers / 共有メモリ）',
    badge: 'モダンC++ M14（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'JSON等の文字列パースでCPUとメモリが浪費され、外部ツール通信が遅延。',
    afterSkill: 'フラットバイナリレイアウト、共有メモリIPCによるゼロコピーデータ転送。',
    gameEvolution: 'ゲーム画面と外部デバッグツール/レベルエディタが超低遅延で完全同期！',
    techKeywords: ['FlatBuffers', 'ゼロコピーシリアライズ', '共有メモリIPC', '高速プロセス間通信'],
  },
  {
    id: 2015,
    slug: 'upcoming-m15',
    title: '【M15】C++26 / 将来展望：静的リフレクションとコード自動生成',
    subtitle: 'コンパイル時メタ情報抽出とGUIインスペクタ・セーブデータの自動生成',
    badge: 'モダンC++ M15（準備中）',
    isUpcoming: true,
    track: 'modern',
    beforePain: 'クラスメンバをシリアライズやGUIに公開するためにマクロを何行も手書き。',
    afterSkill: '静的リフレクション（Static Reflection）による型情報の自動走査とコード生成。',
    gameEvolution: 'クラスを書くだけでゲーム内インスペクタやセーブデータが自動生成！',
    techKeywords: ['C++26', '静的リフレクション', 'メタプログラミング', 'コード自動生成'],
  },

  // 🧭 読解演習トラック 拡張予定（R4〜R10：実践リバースエンジニアリング＆現場鑑識編）
  {
    id: 3004,
    slug: 'upcoming-r4',
    title: '【R4】非同期・マルチスレッド競合コードの読解術',
    subtitle: 'mutex / atomic / レースコンディションの潜伏箇所を暴く',
    badge: '読解演習 R4（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: 'たまにしか再現しないクラッシュバグの調査で、どのスレッドがどのタイミングで共有メモリを壊しているのかコードから読めない。',
    afterSkill: 'ロック順序の静的解析、std::atomic とメモリオーダー、クリティカルセクションの局所化を読み解くプロのデバッグ眼。',
    gameEvolution: '非同期マルチスレッドで動くゲームエンジンの競合ポイントを一目で発見できるようになる！',
    techKeywords: ['マルチスレッド読解', 'レースコンディション', 'ロック順序解析', 'デッドロック特定'],
  },
  {
    id: 3005,
    slug: 'upcoming-r5',
    title: '【R5】巨大オープンソースリポジトリ実地読解（Box2D / SDL2編）',
    subtitle: 'トップダウン探索と依存グラフ可視化で未知のエンジンを攻略',
    badge: '読解演習 R5（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: '業務で数十万行のオープンソースや社内フレームワークを渡され、ドキュメントがなくどこから読み始めればいいか圧倒される。',
    afterSkill: 'エントリポイント特定、コアデータ構造の抽出、抽象化レイヤーの剥ぎ取りによる高速なリポジトリマッピング技術。',
    gameEvolution: '世界水準の2D物理エンジン「Box2D」のソースコードを読み解き、自作ゲームへの組み込み方を完全理解！',
    techKeywords: ['Box2D読解', 'オープンソース解読', '依存グラフ抽出', 'リバースエンジニアリング'],
  },
  {
    id: 3006,
    slug: 'upcoming-r6',
    title: '【R6】メモリ破壊コードの鑑識捜査（Use-After-Free / ASan）',
    subtitle: 'ヒープ破壊ログとAddressSanitizerレポートから真犯人を逆算特定',
    badge: '読解演習 R6（準備中）',
    isUpcoming: true,
    track: 'reading',
    beforePain: 'クラッシュした場所と、実際にメモリを壊した場所が離れていて迷宮入り。',
    afterSkill: 'AddressSanitizer（ASan）レポートの読み方、解放済みポインタの生存追跡。',
    gameEvolution: '敵死亡エフェクト再生中のUse-After-Freeバグコードを瞬時に特定！',
    techKeywords: ['AddressSanitizer (ASan)', 'Use-After-Free', 'ヒープ破壊', 'クラッシュ鑑識'],
  },
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
