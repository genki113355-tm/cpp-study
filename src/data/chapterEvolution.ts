/**
 * 🔄 各章のインベーダーゲーム進化差分（Changelog）データ
 * 
 * 「前の章（前世代）のゲームと何が変わったのか」を視覚的に対比し、
 * C++の設計・技術の進化がゲームの挙動や演出にどう直結しているかを理解するためのデータセット。
 */

export interface EvolutionDiffItem {
  label: string;      // 比較項目（例: 「設計・構成」「弾丸・武装」「画面演出」など）
  before: string;     // 前の章・世代での状態
  after: string;      // 本章・新世代での進化内容
}

export interface ChapterEvolutionInfo {
  chapterCode: string;
  title: string;
  previousChapter: string;
  headline: string;
  beforeSummary: string;
  afterSummary: string;
  diffItems: EvolutionDiffItem[];
  cppArchitecturePoint: string;
  isFirstChapter?: boolean;
}

export const CHAPTER_EVOLUTION_MAP: Record<string, ChapterEvolutionInfo> = {
  // ==========================================
  // 🏛️ クラシックC++コース（C1〜C16）
  // ==========================================
  C1: {
    chapterCode: 'C1',
    isFirstChapter: true,
    title: '構造化設計の限界（C言語スパゲティ）',
    previousChapter: 'なし（原点・スタート地点）',
    headline: 'C言語手続き型の原点！1ファイル・グローバル変数・単発白黒インベーダー',
    beforeSummary: 'プログラム設計が存在しない状態（未着手）',
    afterSummary: 'まずは動く最小ゲーム：単発弾・白黒ASCII・固定配列ループ',
    diffItems: [
      { label: 'コード構成', before: '未実装', after: '単一ファイル（main.c）に全ロジックが混在' },
      { label: '射撃＆描画', before: '未実装', after: '画面内に単発のみ・白黒テキスト表示' },
      { label: '状態管理', before: '未実装', after: 'グローバル変数と固定長配列によるぎこちないループ' },
    ],
    cppArchitecturePoint: '規模が大きくなると変数名衝突や修正時の副作用で破綻する手続き型の限界を体験します。',
  },

  C2: {
    chapterCode: 'C2',
    title: 'クラス化とファイル分割',
    previousChapter: '第C1章（C言語手続き型）',
    headline: 'C言語からC++へ！Player/Bullet/Invaderのクラスカプセル化とRGBカラー出力！',
    beforeSummary: 'グローバル変数乱立・白黒表示・状態が外部に露出',
    afterSummary: 'クラス化により責務を分離、RGBカラーコンソール描画、ヘッダ分割コンパイル',
    diffItems: [
      { label: '設計アーキテクチャ', before: 'グローバル変数と単一main関数', after: 'Player / Bullet / Invader クラスへカプセル化' },
      { label: 'コンソール描画', before: '白黒モノクロテキスト', after: '自機シアン・敵レッド・弾イエローのRGBカラー' },
      { label: 'ファイル構成', before: '1ファイルに全記述', after: '.h（インターフェース）と .cpp（実装）の物理分割' },
    ],
    cppArchitecturePoint: 'クラスによる「情報隠蔽」と「カプセル化」により、他の部位を壊さずに安全にコードを拡張できるようになります。',
  },

  C3: {
    chapterCode: 'C3',
    title: '動的メモリとRule of Three',
    previousChapter: '第C2章（クラス化）',
    headline: '固定配列の限界を突破！std::vectorによる3連射と敵撃破時の火花パーティクル炸裂！',
    beforeSummary: '弾丸は画面内に1発のみ、敵撃破演出なし、静的固定配列',
    afterSummary: 'std::vectorによる動的弾丸管理、最大3連射バースト、撃破時の火花粒子拡散エフェクト',
    diffItems: [
      { label: '射撃システム', before: '画面内に1発のみ（固定配列）', after: '最大3連射バースト射撃（std::vectorで動的生成・消滅）' },
      { label: '撃破エフェクト', before: '敵が一瞬で消えるのみ（演出なし）', after: '撃破時に14個以上の火花粒子（* + . ✨）が四方に炸裂' },
      { label: 'メモリ管理', before: '静的配列で要素数上限が固定', after: '動的確保とRule of Three（デストラクタ・コピー制御）' },
    ],
    cppArchitecturePoint: '動的メモリを安全に扱うためのデストラクタ・コピーコンストラクタ・コピー代入演算子の三位一体を習得します。',
  },

  C4: {
    chapterCode: 'C4',
    title: '継承とポリモーフィズム',
    previousChapter: '第C3章（動的メモリ）',
    headline: 'switch分岐地獄を消滅！基底Enemyからの継承でシールド敵[S]＆ボーナスUFO[U]が参戦！',
    beforeSummary: '敵は通常インベーダー1種類のみ。新敵追加には全コードの改造が必要',
    afterSummary: '基底Enemyから派生したシールド敵[S:HP2]と高速ボーナスUFO[U]が多態的動作',
    diffItems: [
      { label: '敵のバリエーション', before: '通常敵（V）1種類のみ', after: '耐久力2のシールド敵 [S] ＆ 上空を高速横断するボーナスUFO [U]' },
      { label: '挙動ディスパッチ', before: 'if/switch文で敵の種類を都度判定', after: '基底ポインタ経由の仮想関数 (virtual Update/Draw) で統一実行' },
      { label: 'コード拡張性', before: '敵を追加するたび既存コードを大改造', after: '既存コードに触れず新Enemyクラスを派生するだけで追加可能' },
    ],
    cppArchitecturePoint: '仮想関数テーブル（vtable）の動的ディスパッチにより、オープン・クローズドの原則（OCP）を体現します。',
  },

  C5: {
    chapterCode: 'C5',
    title: 'ゲームデザインパターン (State & Observer)',
    previousChapter: '第C4章（ポリモーフィズム）',
    headline: '状態フラグ乱立を一掃！StateパターンによるTitle/Pause画面とObserver実績解除通知！',
    beforeSummary: '起動と同時に敵が勝手に進軍開始、一時停止不可、UIとロジックが密結合',
    afterSummary: 'Title ⇄ Playing ⇄ Paused 状態マシン（Pキーで一時停止）＆ 実績トースト疎結合通知',
    diffItems: [
      { label: 'ゲーム状態制御', before: 'isPlaying等の巨大if文分岐', after: 'StateパターンによるTitle/Playing/Paused/GameOver独立オブジェクト' },
      { label: 'ポーズ機能', before: '一時停止不可（即座に侵略開始）', after: '「Pキー」でポーズ画面表示・安全にゲームを中断/再開' },
      { label: 'イベント通知', before: '撃破処理の中にUI表示が直書き混在', after: 'Observerパターンで「🛸 UFO撃破」等の実績トーストを疎結合発火' },
    ],
    cppArchitecturePoint: 'GoFデザインパターンを活用し、状態遷移とイベント購読をクリーンなオブジェクト指向で構築します。',
  },

  C6: {
    chapterCode: 'C6',
    title: '演算子オーバーロードと値オブジェクト',
    previousChapter: '第C5章（デザインパターン）',
    headline: '物理演算を高校数学の数式通りに記述！Vec2Dの operator+, operator+= を導入',
    beforeSummary: 'C言語スタイルの Vec2_Add(&pos, &vel, &out) という関数ネスト地獄',
    afterSummary: '`pos += vel * dt;` と数式そのまま直感的に記述できる演算子オーバーロード',
    diffItems: [
      { label: 'ベース実機設計', before: 'v6 デザインパターン版', after: 'v2 クラス設計版をベースに数理ベクトル演算を拡張' },
      { label: 'ベクトル加減算', before: 'Vec2_Add(&a, &b, &out) ポインタ渡し関数', after: 'operator+ / operator+= による直感的な二項演算' },
      { label: 'ストリーム出力', before: 'printf("(%f, %f)", v.x, v.y)', after: 'std::cout << v; （friend operator<< による標準出力）' },
    ],
    cppArchitecturePoint: 'ユーザー定義型であってもプリミティブ型と同じ感覚で自然に演算できるC++固有の表現力を体得します。',
  },

  C7: {
    chapterCode: 'C7',
    title: 'ポインタ演算と手動メモリアライメント',
    previousChapter: '第C6章（演算子オーバーロード）',
    headline: '画面バッファをポインタ演算で超高速走査！CPUキャッシュとアライメント境界を極限最適化',
    beforeSummary: '2次元配列のインデックスアクセス grid[y][x] による冗長な乗算コスト',
    afterSummary: 'ポインタ直接加算 `*(buf + offset)` による高速走査とパディング排除構造体',
    diffItems: [
      { label: '画面バッファ走査', before: 'grid[y][x] インデックス多重アクセス', after: 'char* ポインタ直接加算による1次元リニアメモリ高速走査' },
      { label: '構造体メモリ配置', before: 'コンパイラ任せ（不要なパディング発生）', after: 'alignas / sizeof によるバイト境界整列とキャッシュライン最適化' },
      { label: 'ハードウェア親和性', before: '抽象化されたクラス操作', after: 'メモリレイアウトを直接制御する低レベルC++の真骨頂' },
    ],
    cppArchitecturePoint: '高級言語でありながらポインタでハードウェアメモリを直接制覇できるC++の強みを理解します。',
  },

  C8: {
    chapterCode: 'C8',
    title: '関数ポインタとコールバック設計',
    previousChapter: '第C7章（ポインタ演算）',
    headline: '敵撃破やアイテム取得の処理をコールバック化！エンジンとルールを疎結合に分離',
    beforeSummary: '当たり判定処理の中に「スコア加算」「爆発生成」がハードコード直書き',
    afterSummary: '関数ポインタとOnCollisionCallbackにより、イベントハンドラを動的登録',
    diffItems: [
      { label: '衝突イベント処理', before: '当たり判定関数内に処理をべた書き', after: 'void (*OnHit)(Invader&, Bullet&) 関数ポインタへ委譲' },
      { label: 'エンジン拡張性', before: 'ルール変更のたびに物理コアコードを編集', after: 'コールバック関数の差し替えだけでスコアや効果音を変更' },
      { label: 'C互換API', before: 'C++専用クラスメソッド呼び出し', after: 'C言語ライブラリやOSのAPIと連携可能な関数シグネチャ' },
    ],
    cppArchitecturePoint: 'コードの再コンパイルを減らし、フレームワークとアプリケーションロジックを分離する基礎を学びます。',
  },

  C9: {
    chapterCode: 'C9',
    title: '多重継承の闇と仮想基底クラス（菱形継承）',
    previousChapter: '第C8章（関数ポインタ）',
    headline: '「描画可能」かつ「衝突可能」！多重継承の二重実体化バグを仮想継承で完全封殺',
    beforeSummary: '単一継承ツリーのみで「自機」「敵」「障害物」の共有インターフェースが硬直化',
    afterSummary: 'IDrawable, ICollidable の多重継承と virtual 基底クラスによる菱形継承の解決',
    diffItems: [
      { label: 'インターフェース', before: '単一の親クラス（Enemy）のみ', after: 'IDrawable + ICollidable + IMovable の多重インターフェース合成' },
      { label: '菱形継承問題', before: '親の共通祖先が2回実体化して曖昧性エラー', after: 'virtual public GameObject による祖先の単一実体共有' },
      { label: '動的型変換', before: '危険なC形式キャスト (Enemy*)obj', after: 'dynamic_cast による安全なクロスキャスト検証' },
    ],
    cppArchitecturePoint: '多重継承の危険性と、それを克服して真のコンポーネント指向へ向かう進化の過渡期を体験します。',
  },

  C10: {
    chapterCode: 'C10',
    title: '静的ポリモーフィズム入門（CRTPとクラシックTemplate）',
    previousChapter: '第C9章（多重継承）',
    headline: '仮想関数テーブル（vtable）のポインタジャンプをゼロ化！コンパイル時高速ディスパッチ',
    beforeSummary: 'virtual関数のポインタ間接参照による実行時オーバーヘッドとインライン展開阻害',
    afterSummary: 'CRTP（Curiously Recurring Template Pattern）によるコンパイル時静的ディスパッチ',
    diffItems: [
      { label: 'ポリモーフィズム', before: 'virtual関数テーブル（実行時ポインタ探索）', after: 'テンプレート基底 Class Derived : Base<Derived> による静的解決' },
      { label: 'インライン最適化', before: 'vtable経由のためインライン化不可能', after: 'コンパイル時に呼び出し先が確定し、完全インライン展開' },
      { label: 'メモリ消費', before: '各インスタンスにvptr（8バイト）が必要', after: 'vptr不要でメモリサイズ最小化' },
    ],
    cppArchitecturePoint: '静的型付言語C++の真骨頂である「ゼロオーバーヘッド原則（使わないものにコストを払わない）」を体感します。',
  },

  C11: {
    chapterCode: 'C11',
    title: '独自メモリアロケータと固定長プール管理',
    previousChapter: '第C10章（静的ポリモーフィズム）',
    headline: '弾丸乱射でもメモリ断片化ゼロ！毎フレームのnew/deleteを固定長プールでO(1)高速化',
    beforeSummary: '弾丸の発射・消滅のたびにOSヒープの new/delete を呼び出し、ヒープ断片化と速度低下',
    afterSummary: '事前確保されたメモリブロックから即座にメモリを貸し出す自作プールアロケータ',
    diffItems: [
      { label: '弾丸アロケーション', before: '標準 new / malloc（OSヒープ探索 O(N)）', after: 'FreeList方式の固定長メモリプールによる O(1) 瞬時割り当て' },
      { label: 'メモリ断片化', before: '長時間のプレイでヒープがバラバラに断片化', after: '連続した固定メモリ領域内で再利用し断片化リスク完全ゼロ' },
      { label: 'placement new', before: '通常の new 演算子', after: '既存メモリ上にオブジェクトを構築する placement new の実践' },
    ],
    cppArchitecturePoint: 'コンソールゲーム機や組み込みシステムで必須となる「メモリ空間の自給自足」をマスターします。',
  },

  C12: {
    chapterCode: 'C12',
    title: 'レガシーゲームエンジン統合アーキテクチャ',
    previousChapter: '第C11章（メモリプール）',
    headline: 'Input・Physics・Renderのサブシステムを統括！デルタタイム（dt）による可変FPSゲームループ',
    beforeSummary: 'フレーム固定スリープ（33ms）による環境ごとの速度ブレ、単一ループ内に全処理混在',
    afterSummary: 'Engineクラス配下に各サブシステムを統合、高精度タイマーによる物理と描画の同期',
    diffItems: [
      { label: 'ゲームループ', before: '固定ウェイトの単一whileループ', after: 'Tick(deltaTime) による可変フレームレート対応ループ' },
      { label: 'システム構成', before: 'main関数から直接ゲームロジックを駆動', after: 'InputSystem / PhysicsSystem / RenderSystem の責務分担' },
      { label: 'ライフサイクル', before: 'グローバル初期化', after: 'Engine::Initialize() ➔ Run() ➔ Shutdown() の厳密な順序制御' },
    ],
    cppArchitecturePoint: 'ゲームの規模が10万行を超えても破綻しない、商業ゲームエンジンの基本骨格を設計します。',
  },

  C13: {
    chapterCode: 'C13',
    title: 'アセット管理とリソースキャッシュ設計',
    previousChapter: '第C12章（エンジン統合）',
    headline: 'スプライトや音声の重複ロードを完全遮断！参照カウント式リソースマネージャー',
    beforeSummary: '敵オブジェクトごとに同じアスキーアート文字列や設定データを多重ロード',
    afterSummary: 'ResourceManager によるアセット一元キャッシュ、参照カウント管理と自動アンロード',
    diffItems: [
      { label: 'アセット読み込み', before: 'オブジェクト生成ごとに個別ロード', after: 'リソースIDでキャッシュ探索し、重複ロードを0回に抑制' },
      { label: 'メモリ解放タイミング', before: 'どこで破棄すべきか不明瞭', after: '参照カウントが0になった瞬間に自動クリーンアップ' },
      { label: '存在しないリソース', before: 'ヌルポインタ参照クラッシュ', after: 'フォールバック用のダミーアセットを返却するフェイルセーフ設計' },
    ],
    cppArchitecturePoint: '大容量ゲーム開発における最重要課題「リソースの枯渇と重複」をスマートに解決します。',
  },

  C14: {
    chapterCode: 'C14',
    title: '空間分割と超高速衝突判定',
    previousChapter: '第C13章（アセット管理）',
    headline: '弾丸100発×敵100体でも処理落ちゼロ！グリッド空間分割でO(N×M)をO(N)へ高速化',
    beforeSummary: 'すべての弾丸とすべての敵を2重ループで総当たり照合（O(N×M) 爆発）',
    afterSummary: '画面をグリッドセルに分割し、同一セル内のオブジェクトのみを判定する空間ハッシュ',
    diffItems: [
      { label: '当たり判定計算量', before: '弾数 × 敵数の総当たり O(N×M)', after: 'グリッド空間分割（Spatial Hashing）により局所 O(N) に短縮' },
      { label: '判定回数削減', before: '画面の端と端のオブジェクトも無駄に計算', after: '同じグリッドセルに存在する近接オブジェクトのみピンポイント判定' },
      { label: '大量オブジェクト耐性', before: 'オブジェクトが増えると指数関数的にカクつく', after: '数百の弾丸や破片が飛び交っても30FPS/60FPSを平然とキープ' },
    ],
    cppArchitecturePoint: 'アルゴリズムとデータ構造の選択がハードウェアの性能を何百倍にも引き出す瞬間を体験します。',
  },

  C15: {
    chapterCode: 'C15',
    title: 'データ駆動設計（Data-Driven）とスクリプトローダー',
    previousChapter: '第C14章（空間分割）',
    headline: '敵の出現ウェーブやパラメータを外部データ化！再コンパイル不要のゲームバランス調整',
    beforeSummary: '敵のHP・移動速度・出現座標がC++のソースコード内にハードコード直書き',
    afterSummary: 'テキスト/JSON形式のステージ定義ファイルをロードして敵部隊を動的生成',
    diffItems: [
      { label: 'ステージ・敵配置', before: 'C++コードのコンパイルが毎回必要', after: '外部テキスト設定ファイルを編集するだけで即座にゲームへ反映' },
      { label: 'プランナー協業', before: 'プログラマーしか敵のHPを変更できない', after: 'ゲームデザイナーがコードを触らずにバランス調整可能' },
      { label: '構文解析・パース', before: '静的定数定義', after: '文字列パーサーによる堅牢なバリデーションとエラーハンドリング' },
    ],
    cppArchitecturePoint: 'ロジック（C++コード）とデータ（ステージ設定）を完全分離する商業開発の必須パラダイムを学びます。',
  },

  C16: {
    chapterCode: 'C16',
    title: 'ビット演算・ビットフラグとステータス異常系',
    previousChapter: '第C15章（データ駆動）',
    headline: '自機や敵の「無敵・加速・凍結・毒」を1バイトで管理！超高速ビットマスク演算',
    beforeSummary: 'bool isInvincible, bool isPoisoned... とフラグごとに1バイト消費しメモリ肥大化',
    afterSummary: '1つの整数（uint8_t）の各ビットに状態を格納し、AND/OR/XORビット演算で瞬時判定',
    diffItems: [
      { label: '状態フラグ保持', before: '大量のbool変数（それぞれ1バイト消費）', after: '1バイト（8ビット）で最大8種の状態異常を同時格納' },
      { label: 'フラグ判定・更新', before: '複数のif文による個別評価', after: 'flag & FLAG_POISON、flag |= FLAG_SPEED_UP による1CPU命令判定' },
      { label: '排他・トグル制御', before: '複雑な論理代入', after: 'XOR（^）による瞬時反転、NOT（~）マスクによる安全な消去' },
    ],
    cppArchitecturePoint: 'ハードウェアの最小単位「ビット」を自在に操り、メモリを極限まで節約する低レベル最適化を極めます。',
  },

  // ==========================================
  // 🚀 モダンC++コース（M1〜M14）
  // ==========================================
  M1: {
    chapterCode: 'M1',
    title: 'スマートポインタとRAII（C++11）',
    previousChapter: 'レガシー編（第C1章〜第C5章）',
    headline: '生deleteを完全撲滅！unique_ptr所有権管理とshared_ptr旋回護衛ビット機が参戦！',
    beforeSummary: '手動 new/delete によるメモリリークや二重解放（Dangling pointer）の恐怖',
    afterSummary: 'unique_ptrによるアイテム・敵の完全所有権、shared_ptrによる護衛ビット機[o]、リーク0B',
    diffItems: [
      { label: 'メモリ安全性', before: '手動 new / delete（リーク脆弱性あり）', after: 'std::unique_ptr / std::make_unique（リーク0バイト完全保証）' },
      { label: '新ゲーム要素', before: 'ビット機・アイテムなし', after: '自機周囲を旋回する護衛ビット機 [o] ＆ P(3WAY)/B(ビット)アイテム' },
      { label: '所有権の共有', before: '生ポインタの参照渡し（寿命管理が曖昧）', after: 'std::shared_ptr による安全な参照カウント共有' },
    ],
    cppArchitecturePoint: '「リソースの寿命をオブジェクトのスコープに縛る（RAII）」により、例外発生時でも確実にリソースを解放します。',
  },

  M2: {
    chapterCode: 'M2',
    title: 'ムーブセマンティクスと右辺値参照（C++11）',
    previousChapter: '第M1章（スマートポインタ）',
    headline: '巨大オブジェクトのディープコピーを完全ゼロ化！std::move による所有権の瞬間移動',
    beforeSummary: '関数への引数渡しや返り値で、弾丸や敵配列の巨大なメモリコピーが多発',
    afterSummary: '右辺値参照（T&&）と std::move により、ポインタのすげ替えだけで超高速転送',
    diffItems: [
      { label: 'インスタンス転送', before: '全要素のディープコピー（高コスト）', after: '内部ポインタのすげ替えのみ（ゼロコピー転送）' },
      { label: 'コンストラクタ', before: 'コピーコンストラクタのみ', after: 'ムーブコンストラクタ ＆ ムーブ代入演算子の新設' },
      { label: 'リソースの再利用', before: '一時オブジェクトが作られては破棄', after: '破棄予定の一時オブジェクトから中身を合法的に「強奪」' },
    ],
    cppArchitecturePoint: 'C++11最大の革命「ムーブセマンティクス」により、値渡しの美しさとポインタ渡しの超高速を両立します。',
  },

  M3: {
    chapterCode: 'M3',
    title: 'ラムダ式と関数オブジェクト（C++11/14）',
    previousChapter: '第M2章（ムーブセマンティクス）',
    headline: '述語やコールバックを即席インライン記述！std::erase_if とキャプチャの魔術',
    beforeSummary: 'ソートやフィルタリングのために毎回独立した関数やクラス構造体を定義する必要があった',
    afterSummary: '`[=](const auto& e) { return e.hp <= 0; }` でその場に無名関数を即座に記述',
    diffItems: [
      { label: '述語・コールバック', before: '外部関数ポインタやファンクタ構造体', after: 'ラムダ式 [...]() { ... } による直感的インライン記述' },
      { label: 'ローカル変数参照', before: '引数経由かグローバル変数経由のみ', after: '[&] や [=] キャプチャにより外側の変数を直接利用' },
      { label: 'コンテナ要素削除', before: 'イテレータを回す複雑な remove-erase イディオム', after: 'std::erase_if(bullets, [](b) { return b.y < 0; }) の1行記述' },
    ],
    cppArchitecturePoint: '関数型プログラミングのエッセンスを取り入れ、STLアルゴリズムの真価を解放します。',
  },

  M4: {
    chapterCode: 'M4',
    title: '可変引数テンプレートと完全転送（C++11/14）',
    previousChapter: '第M3章（ラムダ式）',
    headline: 'make_unique の心臓部！任意の型と数の引数を完璧に引き渡す完全転送ファクトリ',
    beforeSummary: '引数の数（1個、2個、3個...）ごとにコンストラクタ呼び出し関数を多重定義',
    afterSummary: '`template <typename... Args>` と `std::forward` による汎用オブジェクト生成基盤',
    diffItems: [
      { label: 'ファクトリ関数', before: '引数の組み合わせごとにオーバーロード地獄', after: '可変引数テンプレート（Args...）で任意引数を一括受け入れ' },
      { label: '値カテゴリ維持', before: '左辺値/右辺値の性質が途中で失われる', after: 'std::forward<Args>(args)... による右辺値性の完全維持' },
      { label: 'メモリ無駄', before: '転送途中で一時オブジェクトが生成', after: '引数を直接コンストラクタへゼロコピーで転送（In-place生成）' },
    ],
    cppArchitecturePoint: '標準ライブラリの `std::make_unique` や `emplace_back` がなぜ超高速なのか、その舞台裏を解読します。',
  },

  M5: {
    chapterCode: 'M5',
    title: '標準マルチスレッドと並行処理（C++11/14）',
    previousChapter: '第M4章（可変引数）',
    headline: 'ゲームループと重い物理演算を別コアで並列化！std::thread と mutex/atomic の安全同期',
    beforeSummary: 'OS依存（pthread/Win32）の複雑なスレッドAPI、または単一スレッドで処理落ち',
    afterSummary: 'C++標準の std::thread, std::mutex, std::atomic による安全なマルチスレッド化',
    diffItems: [
      { label: 'スレッドAPI', before: 'OS固有（CreateThread等）で移植性ゼロ', after: 'C++標準の std::thread による完全ポータブル並行処理' },
      { label: 'データ競合防止', before: 'クリティカルセクション管理が複雑でデッドロック', after: 'std::lock_guard / std::scoped_lock によるRAII式自動ロック' },
      { label: '高速同期変数', before: '重いミューテックスを全変数に使用', after: 'std::atomic<int> によるロックフリー超高速アトミック操作' },
    ],
    cppArchitecturePoint: 'マルチコアCPU時代に必須の並行処理と、データ競合（Data Race）を予防する言語仕様を習得します。',
  },

  M6: {
    chapterCode: 'M6',
    title: 'ゼロコピー文字列革命：std::string_view（C++17）',
    previousChapter: '第M5章（マルチスレッド）',
    headline: '文字列を切り出してもヒープ確保は0回！ポインタと長さだけで文字列を覗き見',
    beforeSummary: '部分文字列の切り出しや const std::string& 渡しで発生する隠れたメモリ確保',
    afterSummary: '所有権を持たずメモリを参照するだけの std::string_view によるゼロアロケーション',
    diffItems: [
      { label: '文字列受け取り', before: 'const std::string&（char配列を渡すと暗黙new発生）', after: 'std::string_view（どんな文字列でもアロケーション0回）' },
      { label: '部分文字列抽出', before: 's.substr() で毎回新しいヒープメモリを確保', after: 'sv.substr() はポインタとサイズをずらすだけで計算量 O(1)' },
      { label: 'コンソールUI描画', before: '毎フレームのテキスト生成でメモリ断片化', after: '静的ROM文字列を view で安全に使い回し' },
    ],
    cppArchitecturePoint: '「所有権を持たずに参照だけを渡す」という現代的C++のメモリ節約の極意を学びます。',
  },

  M7: {
    chapterCode: 'M7',
    title: '現代的型システム (variant, optional, constexpr)（C++17）',
    previousChapter: '第M6章（string_view）',
    headline: 'NULLポインタと無効値を世界から追放！型安全な代数的データ構造',
    beforeSummary: 'nullptr参照クラッシュや、「-1をエラー値とする」ような危険な暗黙の了解',
    afterSummary: '値の有無を明示する std::optional と、型安全な共用体 std::variant の活用',
    diffItems: [
      { label: 'null・空の表現', before: 'nullptr ポインタや -1 センチネル値', after: 'std::optional<T> により値の存在を型安全に強制チェック' },
      { label: '多肢選択型', before: '型安全性のない void* や union', after: 'std::variant<Normal, Boss, UFO> と std::visit パターンマッチ' },
      { label: '定数計算', before: '実行時に毎回sin/cosを計算', after: 'constexpr によるコンパイル時事前事前計算' },
    ],
    cppArchitecturePoint: 'バグを「実行時エラー」ではなく「コンパイル時エラー」として検出する堅牢な型安全設計を体得します。',
  },

  M8: {
    chapterCode: 'M8',
    title: 'if constexpr と構造化束縛（C++17）',
    previousChapter: '第M7章（現代的型システム）',
    headline: 'コンパイル時に不要な分岐コードを完全消去！auto [x, y] による直感的タプルアンパック',
    beforeSummary: 'SFINAE（enable_if）による難解なテンプレート特殊化と、ペアの p.first, p.second 参照',
    afterSummary: 'if constexpr によるクリーンなコンパイル時分岐と、構造化束縛 auto [x, y] = pos;',
    diffItems: [
      { label: 'コンパイル時分岐', before: '難解な SFINAE やテンプレート多重定義', after: '普通の見た目で書ける if constexpr (std::is_same_v<T, ...>)' },
      { label: '複合戻り値の分解', before: 'std::tie や it->first, it->second の冗長な記述', after: 'const auto& [entity, transform] = getPair(); の直感記法' },
      { label: 'バイナリサイズ', before: '実行されないコードパスもバイナリに残存', after: 'false分岐はコンパイル時に跡形もなく消去' },
    ],
    cppArchitecturePoint: 'メタプログラミングの難解さを過去のものにし、日常的なC++コードを劇的に洗練させます。',
  },

  M9: {
    chapterCode: 'M9',
    title: 'クロスプラットフォームファイル操作：std::filesystem（C++17）',
    previousChapter: '第M8章（if constexpr）',
    headline: 'Windows/Linuxのパス区切り（\\ と /）の壁を完全解決！標準ファイルシステム操作',
    beforeSummary: 'Windows用の <windows.h> とLinux用の <dirent.h> の #ifdef 分岐地獄',
    afterSummary: 'C++標準の std::filesystem::path により、1行で安全なファイル・ディレクトリ操作',
    diffItems: [
      { label: 'パス文字列処理', before: '文字列連結でスラッシュが二重になったり逆向きになるバグ', after: 'path / "assets" / "stage1.json" による自動正規化' },
      { label: 'ディレクトリ走査', before: 'OS固有の低レベルファイル走査API', after: 'for (const auto& entry : fs::directory_iterator(dir)) の美しさ' },
      { label: 'ファイル状態確認', before: 'ファイルオープンに失敗して初めて存在しないと気付く', after: 'fs::exists() や fs::file_size() による安全な事前検査' },
    ],
    cppArchitecturePoint: 'OSごとの差異をC++標準規格が吸収し、真のマルチプラットフォーム互換コードを実現します。',
  },

  M10: {
    chapterCode: 'M10',
    title: '継承より合成とECS（Entity Component System）（C++17）',
    previousChapter: '第M1章（スマートポインタ版）',
    headline: '商業AAAゲームエンジンの頂点へ！ECSコンポーネント合成・3WAYレーザー・巨大母艦ボス[B]降臨！',
    beforeSummary: '深いクラス継承ツリーによる「神クラス化」や多重継承の硬直化',
    afterSummary: 'Entity Component System（Transform/Render/Shooter/Health）合成、巨大ボス[B:HP12]、3WAYレーザー、誘爆ボム(X)',
    diffItems: [
      { label: '設計アーキテクチャ', before: 'is-a関係によるクラス継承（OOP）', after: 'has-a関係によるコンポーネント合成（ECS・データ指向）' },
      { label: 'ボス＆新敵', before: '通常敵・シールド敵・UFOのみ', after: 'HP12の巨大母艦ボス [B] ＆ 弾幕エリート [E] ＆ 連鎖爆発ボム (X)' },
      { label: '自機武装', before: '単発またはドロップ依存', after: '標準で強力な「3WAY貫通レーザー」を搭載' },
    ],
    cppArchitecturePoint: '「継承より合成（Composition over Inheritance）」により、Unreal/Unity等の現代商用ゲームエンジン同等の拡張性を実現します。',
  },

  M11: {
    chapterCode: 'M11',
    title: 'コンセプトと型制約（Concepts）（C++20）',
    previousChapter: '第M10章（ECS完結編）',
    headline: '暗号のようなテンプレートエラーを完全駆逐！コンパイル時に引数要件を明確に制約',
    beforeSummary: 'テンプレート型引数のミスで何十行にも及ぶ解読不能なコンパイラエラーが出力',
    afterSummary: '`template <Component T>` や `requires` 節により、美しい要件定義と明快なエラー文',
    diffItems: [
      { label: 'テンプレート制約', before: '何でも受け取れるが内部で使えない時に謎エラー', after: 'template <Renderable T> で渡せる型を厳格に制約' },
      { label: 'エラーメッセージ', before: 'STL内部の奥底で発生した数十行の怪文書', after: '「型XはRenderableの要件を満たしていません」の1行通知' },
      { label: '関数のオーバーロード', before: 'SFINAEによる無理やりな分岐', after: 'コンセプトの包含関係によるクリーンな自動最適分岐' },
    ],
    cppArchitecturePoint: 'C++20最大の目玉機能により、ジェネリックプログラミングを誰でも安全・快適に書ける時代へ。',
  },

  M12: {
    chapterCode: 'M12',
    title: 'コルーチンによる非同期ゲームループ（C++20）',
    previousChapter: '第M11章（コンセプト）',
    headline: '「途中で一時停止して次フレームで再開」できる！敵AIや演出を直線的コードで自然に記述',
    beforeSummary: '毎フレームのタイマー加算やステートマシンフラグ管理によるコードの断片化',
    afterSummary: '`co_yield` や `co_await` による一時停止・再開可能な協調的非同期ゲームループ',
    diffItems: [
      { label: '敵AI行動記述', before: 'タイマー変数とstateの膨大なswitch文', after: '「3秒待つ ➔ 移動 ➔ 弾を撃つ」を直線的な自然なコードで記述' },
      { label: '非同期処理', before: 'コールバック地獄または重いOSスレッド', after: 'スタックレスコルーチンによる軽量な中断・再開' },
      { label: 'ゲームループ統合', before: '外部から強引に割り込み', after: '毎フレームのTickごとに co_yield で自発的に制御を返却' },
    ],
    cppArchitecturePoint: 'ゲーム開発で最も記述が煩雑だった「時間経過に伴う振る舞い」を直感的に記述できる新次元へ。',
  },

  M13: {
    chapterCode: 'M13',
    title: 'Ranges & Views による関数型パイプライン（C++20）',
    previousChapter: '第M12章（コルーチン）',
    headline: 'パイプ演算子 | で敵リストを直感フィルタリング！一時オブジェクト生成ゼロの関数型処理',
    beforeSummary: '一時vectorを作ってfor文で詰め直す無駄なメモリ確保と冗長なイテレーション',
    afterSummary: '`invaders | std::views::filter(isAlive) | std::views::transform(getPos)` の優雅な連結',
    diffItems: [
      { label: 'コレクション処理', before: 'forループ内にif文とpush_backが乱立', after: 'UNIXパイプのような `|` 演算子による宣言的パイプライン' },
      { label: '遅延評価（Lazy）', before: '中間結果ごとに一時メモリを確保', after: '要素が実際に取り出されるまで計算を行わないゼロコスト評価' },
      { label: '可読性', before: '手続きが何重にもネストして解読困難', after: '上から下へ流れるような直感的なデータフロー' },
    ],
    cppArchitecturePoint: 'C++にモダン関数型プログラミングの洗練された表現力が完全融合した最新のコードスタイルを体験します。',
  },

  M14: {
    chapterCode: 'M14',
    title: 'C++20 モジュール完全移行ガイド（C++20）',
    previousChapter: '第M13章（Ranges & Views）',
    headline: '50年続いた #include ヘッダ地獄から脱却！ビルド高速化とマクロ汚染ゼロの未来へ',
    beforeSummary: 'ヘッダファイル多重インクルードガード、マクロ名衝突、何十分もかかるビルド時間',
    afterSummary: '`import game.engine;` によるモジュール分割、コンパイル速度の劇的高速化',
    diffItems: [
      { label: 'ファイル結合方式', before: '#include（単なるプリプロセッサのテキストコピー）', after: 'import / export（バイナリ化されたインターフェース読み込み）' },
      { label: 'マクロ汚染', before: 'ヘッダ内で定義されたマクロが全体に漏れ出してバグ', after: 'モジュール内部のマクロは外部に一切漏れない完全カプセル化' },
      { label: 'ビルドパフォーマンス', before: '全ファイルで同じヘッダを何千回も再パース', after: '1回コンパイルされたモジュールを瞬時にキャッシュ再利用' },
    ],
    cppArchitecturePoint: 'C言語以来半世紀にわたって開発者を苦しめてきたヘッダ構造を一掃する、真の次世代C++アーキテクチャで完結します。',
  },
};

/**
 * 章コードまたはバージョンから進化情報を取得するヘルパー
 */
export const getChapterEvolution = (chapterCode?: string, version?: string): ChapterEvolutionInfo => {
  // L1〜L16 は C1〜C16 と同一マップへマッピング
  const normalizedCode = chapterCode?.replace(/^L/, 'C');

  if (chapterCode && CHAPTER_EVOLUTION_MAP[chapterCode]) {
    return CHAPTER_EVOLUTION_MAP[chapterCode];
  }
  if (normalizedCode && CHAPTER_EVOLUTION_MAP[normalizedCode]) {
    return CHAPTER_EVOLUTION_MAP[normalizedCode];
  }

  // バージョンによるフォールバック
  switch (version) {
    case 'v1_spaghetti':
      return CHAPTER_EVOLUTION_MAP.C1;
    case 'v2_classes':
      return CHAPTER_EVOLUTION_MAP.C2;
    case 'v3_dynamic':
      return CHAPTER_EVOLUTION_MAP.C3;
    case 'v4_polymorphism':
      return CHAPTER_EVOLUTION_MAP.C4;
    case 'v5_smart_pointers':
      return CHAPTER_EVOLUTION_MAP.M1;
    case 'v6_patterns':
      return CHAPTER_EVOLUTION_MAP.C5;
    case 'v7_ecs_final':
    default:
      return CHAPTER_EVOLUTION_MAP.M10;
  }
};
