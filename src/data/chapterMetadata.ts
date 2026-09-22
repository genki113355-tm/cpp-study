export type DifficultyLevel = '初級' | '中級' | '上級';
export type ImportanceLevel = 1 | 2 | 3;

export interface ChapterMeta {
  readingTimeMinutes: number;
  readingTimeText: string;
  importance: ImportanceLevel;
  importanceLabel: '必修コア' | '実戦応用' | '現場・深層';
  importanceStars: '★★★' | '★★☆' | '★☆☆';
  difficulty: DifficultyLevel;
  keyTakeaway?: string;
  badgeClasses: {
    importance: string;
    difficulty: string;
    time: string;
  };
}

/** 全44章の厳密なメタデータ定義テーブル */
const CHAPTER_METADATA_MAP: Record<number, {
  readingTimeMinutes: number;
  importance: ImportanceLevel;
  difficulty: DifficultyLevel;
  keyTakeaway: string;
}> = {
  // 🏛️ クラシック基礎編 (L1〜L16)
  1: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'main関数500行の限界を体感し、構造化の壁を知る',
  },
  2: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'カプセル化（private/public）とヘッダ・実装ファイル分割',
  },
  3: {
    readingTimeMinutes: 20,
    importance: 3,
    difficulty: '中級',
    keyTakeaway: 'new/delete手動管理とコピーコンストラクタ（Rule of Three）',
  },
  4: {
    readingTimeMinutes: 20,
    importance: 3,
    difficulty: '中級',
    keyTakeaway: '基底クラス・仮想関数・vtableによる多態的ゲームループ',
  },
  6: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'GoF State/Observerパターンによる画面遷移と通知設計',
  },
  11: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: '演算子オーバーロード（operator+等）によるVector2D値オブジェクト',
  },
  12: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: 'ポインタ加減算、アライメントパディング、reinterpret_cast',
  },
  13: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: '関数ポインタ型定義とイベントリスナーコールバック設計',
  },
  14: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: '多重継承の菱形衝突とvirtual継承のメモリレイアウト',
  },
  15: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: 'CRTP（奇妙に再帰したテンプレート）によるゼロコスト静的多態性',
  },
  16: {
    readingTimeMinutes: 25,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: '事前確保メモリプールとplacement newによる断片化ゼロ化',
  },
  25: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'C++03資産を破綻なく統合するモノリシックゲームエンジン設計',
  },
  21: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'テクスチャ・音声の二重読込を防ぐハッシュキャッシュ設計',
  },
  22: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: '空間グリッド分割による弾幕判定のO(N^2)→O(N)高速化',
  },
  23: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: '敵ステータスやウェーブ構成をコードから分離するデータ駆動',
  },
  24: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'ビットマスク・論理積/論理和による高速フラグ管理',
  },

  // 🚀 モダン実践編 (M1〜M14)
  5: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'std::unique_ptr / shared_ptr による所有権とゼロリーク自動解放',
  },
  8: {
    readingTimeMinutes: 20,
    importance: 3,
    difficulty: '中級',
    keyTakeaway: 'std::moveと右辺値参照（&&）による巨大バッファゼロミリ秒移譲',
  },
  31: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'キャプチャ句、std::function、STLアルゴリズムとの即時連携',
  },
  32: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '上級',
    keyTakeaway: 'std::forwardとパラメータパックによる完全転送ファクトリ',
  },
  33: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'std::jthread、std::mutex、条件変数による安全な並行処理',
  },
  34: {
    readingTimeMinutes: 10,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'std::string_viewによる文字列コピーゼロ・ビュー参照',
  },
  10: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'std::variant, std::optional, constexprによる型安全リファクタ',
  },
  35: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'コンパイル時分岐 if constexpr とタプル/構造体分解束縛',
  },
  36: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '初級',
    keyTakeaway: 'std::filesystemによるOS差分なしのファイル操作・走査',
  },
  7: {
    readingTimeMinutes: 25,
    importance: 2,
    difficulty: '上級',
    keyTakeaway: '巨大継承ツリーの廃止、Entity-Component-Systemによるデータ指向設計',
  },
  18: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '上級',
    keyTakeaway: 'C++20コンセプトによるテンプレート制約と分かりやすいエラーメッセージ',
  },
  17: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: 'C++20コルーチン（co_await/co_yield）による状態遷移フラット化',
  },
  19: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'C++20 Rangesによるパイプライン（|）合成と遅延評価',
  },
  20: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'ヘッダinclude地獄を脱却するC++20モジュール（import）設計',
  },

  // 🧭 コード読解演習 (R1〜R6)
  201: {
    readingTimeMinutes: 10,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: '変数の寿命と引数参照渡しによるデータ更新フローの追跡',
  },
  202: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '中級',
    keyTakeaway: 'クラスヘッダと前方宣言から依存関係グラフをメンタルモデル化',
  },
  203: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: '実行時にどの派生クラスメソッドが呼ばれるかをvptrから解読',
  },
  204: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: 'マルチスレッド競合・Data Race・ロック順序の静的コード検証',
  },
  205: {
    readingTimeMinutes: 25,
    importance: 2,
    difficulty: '上級',
    keyTakeaway: '数万行規模のOSS物理エンジン（Box2D）の実地ディレクトリ探索',
  },
  206: {
    readingTimeMinutes: 20,
    importance: 1,
    difficulty: '上級',
    keyTakeaway: 'AddressSanitizerログから解放後メモリ参照（UAF）の犯人特定',
  },
  207: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '上級',
    keyTakeaway: 'SFINAE / enable_if / Concepts の皮をむき、型制約と真のシグネチャを解読',
  },

  // 📚 ガイド＆コラム (G1〜G5, COL1〜COL3)
  103: {
    readingTimeMinutes: 15,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'VS Code, GCC/Clang, CMakeを用いたモダンC++実行環境のセットアップ',
  },
  105: {
    readingTimeMinutes: 25,
    importance: 3,
    difficulty: '初級',
    keyTakeaway: 'C++03からC++20までの主要構文・キーワードを逆引き検索',
  },
  101: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: '既存の巨大レガシーコードベースを安全に読み解く3大原則',
  },
  108: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'クラス図・シーケンス図とC++ヘッダ/実装の双方向変換テクニック',
  },
  104: {
    readingTimeMinutes: 20,
    importance: 2,
    difficulty: '中級',
    keyTakeaway: 'GoogleTestのASSERT/EXPECTマクロを用いたテストファースト開発',
  },
  107: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '初級',
    keyTakeaway: 'GoF 23パターンの本質と、現代C++における簡潔な代替実装',
  },
  102: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '初級',
    keyTakeaway: '下位互換性・ゼロオーバーヘッド原則がもたらした複雑さの歴史的必然',
  },
  106: {
    readingTimeMinutes: 15,
    importance: 2,
    difficulty: '初級',
    keyTakeaway: 'OS、ゲームエンジン、金融、組み込みを支え続けるC++の思想',
  },
};

/**
 * 章オブジェクトから学習目安時間・重要度・難易度を取得
 */
export function getChapterMeta(chapter: {
  id: number;
  slug?: string;
  sections?: any[];
  quiz?: any[];
}): ChapterMeta {
  const custom = CHAPTER_METADATA_MAP[chapter.id];

  const readingTimeMinutes = custom?.readingTimeMinutes ?? (
    chapter.sections && chapter.sections.length > 0
      ? Math.max(10, Math.min(30, Math.round((chapter.sections.length * 4 + (chapter.quiz?.length ? 3 : 0)) / 5) * 5))
      : 15
  );

  const importance: ImportanceLevel = custom?.importance ?? 2;
  const difficulty: DifficultyLevel = custom?.difficulty ?? '中級';
  const keyTakeaway = custom?.keyTakeaway;

  const importanceLabel: ChapterMeta['importanceLabel'] =
    importance === 3 ? '必修コア' : importance === 2 ? '実戦応用' : '現場・深層';

  const importanceStars: ChapterMeta['importanceStars'] =
    importance === 3 ? '★★★' : importance === 2 ? '★★☆' : '★☆☆';

  const importanceBadge =
    importance === 3
      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
      : importance === 2
      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
      : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40';

  const difficultyBadge =
    difficulty === '初級'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
      : difficulty === '中級'
      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
      : 'bg-purple-950/80 text-purple-300 border-purple-500/40';

  const timeBadge = 'bg-slate-900/90 text-slate-300 border-slate-700/80';

  return {
    readingTimeMinutes,
    readingTimeText: `約${readingTimeMinutes}分`,
    importance,
    importanceLabel,
    importanceStars,
    difficulty,
    keyTakeaway,
    badgeClasses: {
      importance: importanceBadge,
      difficulty: difficultyBadge,
      time: timeBadge,
    },
  };
}
