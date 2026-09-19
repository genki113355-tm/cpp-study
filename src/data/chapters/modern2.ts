import { Chapter } from '../../types/curriculum';

export const chapterM2: Chapter = {
  id: 8,
  slug: 'modern-2-move-and-modern-features',
  courseTrack: 'modern',
  courseChapterCode: 'M2',
  title: 'モダン第2章：【C++11/14】右辺値参照とムーブセマンティクス（ゼロコピー革命）',
  subtitle: '右辺値参照（T&&）、std::move、Rule of Five によるゼロコピー抽象化',
  badge: 'モダンC++ M2【C++11/14】：ムーブセマンティクス',
  gameVersion: 'v5_smart_pointers',
  description: 'C言語やレガシーなC++03では、大きなオブジェクトや配列を関数から返したりコレクションに追加する際、すべてのデータを複製する「ディープコピー」が発生し、多大なCPU時間とメモリを浪費していました。C++11最大の革命である「ムーブセマンティクス（右辺値参照とstd::move）」、処理をインラインで記述できる「ラムダ式」、そして型推論「auto」によって、安全性を1ミリも犠牲にせず極限の実行速度を手に入れるモダンC++の技法を習得します。',
  sections: [
    {
      id: 'sec-m2-copy-vs-move',
      title: 'M2.1 ディープコピーの悲劇と右辺値参照（T&&）の革命',
      leadText: '「捨てる予定の巨大データ」をわざわざ全件コピーしてから元のデータを破棄していませんか？ムーブセマンティクスがなぜC++11以降の標準ライブラリを根本から高速化したのか、その物理構造を解き明かします。',
      dialogueBefore: [
        {
          id: 'dm2-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！ステージ上の弾丸や敵データをまとめた std::vector を別の管理クラスに渡そうとしたら、ゲームが一瞬カクつくんです。プロファイラを見たら、メモリのコピー処理に時間がかかっていました……！'
        },
        {
          id: 'dm2-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！それこそが古典C++の宿痾【ディープコピー（深層複製）の悲劇】じゃ！vector の中に数百個の要素があるとき、レガシーなコピー代入 `a = b;` を行うと、ヒープ領域を新しく malloc し直し、全要素を1つずつ愚直にコピーしておったのじゃ。'
        },
        {
          id: 'dm2-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'でも先生、元の `b` は代入した直後に関数を抜けて消える一時オブジェクトなんです！消えるやつの中身をいちいちコピーするの、めちゃくちゃ無駄じゃないですか？'
        },
        {
          id: 'dm2-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '鋭いのう、ピピン！まさにその「どうせ消える一時オブジェクト（右辺値）」から、メモリの所有権ポインタだけをヒュッと奪い取る仕組みこそが【ムーブセマンティクス（Move Semantics）】じゃ！C++11で世界を変えた大発明なんじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: '古典C++（ディープコピー） vs モダンC++（ムーブセマンティクス）',
        cApproach: {
          title: '古典C++03：毎回全件コピー（O(N) の時間とメモリ確保）',
          code: `// 敵データの巨大な配列
std::vector<Enemy> createEnemies() {
    std::vector<Enemy> temp;
    // 100体の敵を追加...
    return temp; // ← 古典C++ではここで100体分の全件ディープコピー！
}

std::vector<Enemy> enemies;
enemies = createEnemies(); 
// 1. 新しいヒープ領域を確保
// 2. temp の要素を100回コピー
// 3. temp の古いヒープ領域を解放
// → 膨大なCPUサイクルとメモリ断片化が発生！`,
          drawbacks: [
            '関数から大きなコンテナや文字列を値返しするたびにヒープ再確保と全件コピーが発生',
            'コピーコストを嫌って「ポインタを引数で渡して書き込ませる」というC言語的な汚いシグネチャ（出力引数）を強要される',
            '巨大オブジェクトの代入や配列の並び替え（sort）が著しく低速化する'
          ]
        },
        cppApproach: {
          title: 'モダンC++：所有権ポインタの瞬間すげ替え（O(1) の超高速転送）',
          code: `// モダンC++：自動的にムーブが発動！
std::vector<Enemy> createEnemies() {
    std::vector<Enemy> temp;
    // 100体の敵を追加...
    return temp; // 右辺値として扱われ、ムーブコンストラクタが発動！
}

std::vector<Enemy> enemies = createEnemies();
// 1. enemies の内部ポインタに temp のバッファ先頭番地を代入
// 2. temp の内部ポインタを nullptr にリセット
// → 1バイトのデータも複製せず、ポインタ3つの書き換え（約3ナノ秒）で完了！`,
          benefits: [
            'どんなに巨大な vector や string でも、0コスト（ポインタの書き換えのみ）で関数から戻せる',
            '「値返し（Return by Value）」が推奨され、クリーンで関数的なAPI設計が可能になる',
            'コピー不可能なリソース（unique_ptr, ファイルハンドル, スレッド）も安全に転送可能'
          ]
        },
        paradigmShiftNotes: '古典C++では「値の代入＝常に複製」でした。モダンC++では「左辺値（名前があり生存し続けるもの）はコピー」「右辺値（名前がなく消滅するもの）は所有権を強奪（ムーブ）」と明確に区別します。'
      }
    },
    {
      id: 'sec-m2-std-move-usage',
      title: 'M2.2 std::move の正しい使い方と「抜け殻（Moved-from）」の規律',
      leadText: '`std::move()` は実際には「何も動かさない」？！std::move の正体である「右辺値キャスト」の仕組みと、ムーブされた後の変数を触ってはいけない鉄則を学びます。',
      variables: [
        {
          name: 'std::move(variable)',
          type: 'std::remove_reference<T>::type&& (キャスト関数)',
          scope: '式レベル',
          description: '変数を「右辺値（消えても良い一時オブジェクト）」として扱うようコンパイラに指示するキャスト。データ自体の移動はムーブコンストラクタやムーブ代入演算子が行う。',
          cComparison: 'C言語には存在しない概念。C言語ではmemcpyかポインタ手動NULLクリアで泥臭く実装していた。'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'std::move による明示的な権利移譲',
          description: '名前のある左辺値（例: localBullet）をコンテナに渡す際、`bullets.push_back(std::move(localBullet));` と書いて所有権を譲渡します。',
          impact: '無駄なコピーコンストラクタの起動を100%防止',
          codeSnippet: 'bullets.push_back(std::move(bullet));',
          designIntent: 'unique_ptr などのコピー禁止オブジェクトを配列に追加するための標準的な書き方。'
        },
        {
          stepNumber: 2,
          title: 'ムーブ後の変数（Moved-from state）の取り扱い規律',
          description: 'ムーブされた後の元の変数は「有効だが未規定（Valid but unspecified）」な空っぽ状態（ポインタならnullptr、vectorなら空）になります。',
          impact: '抜け殻のオブジェクトへのアクセスによるバグを予防',
          codeSnippet: '// ムーブした後は再代入するまで触らないのが原則！',
          designIntent: 'リソースの二重管理を防ぐため、所有権を手放した変数は速やかにスコープ外へ出す。'
        }
      ]
    },
    {
      id: 'sec-m2-lambda-expressions',
      title: 'M2.3 ラムダ式（無名関数）：関数の即席インライン定義',
      leadText: '「死んだ敵を一括削除する」のに、いちいち外部に関数ポインタやファンクタクラスを書いていませんか？モダンC++のラムダ式 `[...] (...) { ... }` でコードの局所性と可読性を極限まで高めます。',
      paradigmComparison: {
        title: 'C言語／古典C++の関数ポインタ vs モダンC++ラムダ式',
        cApproach: {
          title: '古典C++：外部に専用の述語関数や述語構造体（Functor）を定義',
          code: `// ファイルの遠く離れた場所にわざわざ関数を書く必要がある
bool isEnemyDead(const Enemy* e) {
    return !e->isAlive();
}

// 呼び出し側
enemies.erase(
    std::remove_if(enemies.begin(), enemies.end(), isEnemyDead),
    enemies.end()
);
// 判定条件が呼び出し元から離れており、ローカル変数のキャプチャもできない！`,
          drawbacks: [
            '1回しか使わない使い捨ての判定ロジックのために、ヘッダや外部に関数を定義しなければならない',
            '呼び出し元のローカル変数（例: 現在の自機座標や制限時間）を関数ポインタに渡すのが極めて困難',
            'コードの文脈が分断され、可読性が著しく低下する'
          ]
        },
        cppApproach: {
          title: 'モダンC++：ラムダ式で呼び出し箇所にインライン定義',
          code: `// その場に直接ラムダ式を記述！
enemies.erase(
    std::remove_if(enemies.begin(), enemies.end(), [](const auto& e) {
        return !e->isAlive(); // 1行で直感的に記述！
    }),
    enemies.end()
);

// ローカル変数のキャプチャ（[&] や [=]）も自由自在！
int hitRadius = 15;
auto hitChecker = [hitRadius](int dist) { return dist <= hitRadius; };`,
          benefits: [
            'ロジックが使用されるその場所に直書きでき、コードの意図が一目瞭然',
            'キャプチャリスト `[&]` や `[=]` により、外側のローカル変数を安全かつ簡単に参照・コピー可能',
            '関数ポインタの呼び出しオーバーヘッドがなく、インライン展開による超高速実行が可能'
          ]
        },
        paradigmShiftNotes: 'C言語の関数はすべてファイルスコープのグローバルな存在でした。モダンC++のラムダ式により、関数は変数と同じように「その場で作り、変数に代入し、引数で渡す」ファーストクラスの道具へと進化しました。'
      },
      processSteps: [
        {
          stepNumber: 1,
          title: 'ラムダ式の構文構造：[キャプチャ](引数) -> 戻り値 { 処理 }',
          description: '[] は外側の変数をどう取り込むか（[&] 参照、[=] コピー）、() は引数、{} は実行本文を指定します。',
          impact: 'コールバック処理やSTLアルゴリズムの記述が劇的に簡潔化',
          codeSnippet: 'auto isDead = [](const auto& item) { return item.hp <= 0; };',
          designIntent: 'GUIイベントリスナーや非同期処理、コンテナ検索の標準記法。'
        },
        {
          stepNumber: 2,
          title: 'auto による型推論と constexpr 定数式',
          description: '`auto it = enemies.begin();` のように複雑な型名をコンパイラに推論させ、`constexpr int WIDTH = 30;` でコンパイル時に値を確定します。',
          impact: 'タイピング量の削減とリファクタリング耐性の向上',
          codeSnippet: 'constexpr int MAX_FPS = 60; auto player = getPlayer();',
          designIntent: '保守性を高め、コンパイル時最適化の恩恵を最大限に享受する。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'qm2-1',
      question: 'モダンC++において「ムーブセマンティクス（std::move）」がディープコピーより圧倒的に高速である根本的な理由は何ですか？',
      options: [
        'CPUのマルチコアをすべて使って並列にデータをコピーするから',
        'ヒープ上の実体データを1バイトも複製せず、内部のポインタ番地をすげ替える（付け替える）だけで完了するから',
        'OSの仮想メモリ圧縮機能を強制起動するから',
        'コンパイラが自動的にアセンブラの goto 文に変換するから'
      ],
      correctIndex: 1,
      explanation: '正解は「ヒープ上の実体データを1バイトも複製せず、内部のポインタ番地をすげ替える（付け替える）だけで完了するから」です。消滅予定の一時オブジェクトからポインタを譲り受けることで、どれほど巨大な配列や文字列であってもO(1)の瞬時に所有権を移動できます。'
    },
    {
      id: 'qm2-2',
      question: '`std::move(x)` を実行した直後、元の変数 `x` の状態について正しい説明はどれですか？',
      options: [
        'メモリから完全に消滅し、変数の宣言自体が無効になる',
        '有効だが未規定（Valid but unspecified）な状態（空のポインタや空の配列）になり、再代入するまでは安全な利用が保証されない',
        '以前と全く同じ値がそのまま保持されている',
        '即座にOSのアクセス違反（Segmentation Fault）が発生する'
      ],
      correctIndex: 1,
      explanation: '正解は「有効だが未規定（Valid but unspecified）な状態になり、再代入するまでは安全な利用が保証されない」です。リソースが新しい所有者へ引き渡されたため、元の変数は「空っぽの抜け殻」になります。'
    },
    {
      id: 'qm2-3',
      question: 'C++のラムダ式 `[=](int a) { return a + bonus; }` において、先頭の `[=]`（キャプチャリスト）は何を意味していますか？',
      options: [
        '外側のローカル変数をすべて「コピー（値渡し）」してラムダ式内部で利用可能にする',
        '外側のローカル変数をすべて「参照（ポインタ渡し）」として利用可能にする',
        '引数 a と bonus が等しいかどうかを比較する',
        'ラムダ式の戻り値を強制的に void にする'
      ],
      correctIndex: 0,
      explanation: '正解は「外側のローカル変数をすべてコピー（値渡し）してラムダ式内部で利用可能にする」です。参照で取り込みたい場合は `[&]` を指定します。'
    },
    {
      id: 'qm2-4',
      question: '関数から大きな `std::vector` を返す設計において、C++11以降のモダンC++で最も推奨される書き方はどれですか？',
      options: [
        '引数に生ポインタ `std::vector*` を渡して内部で new する',
        '引数に出力用参照 `std::vector& out` を渡して書き込ませる',
        '普通に `std::vector` を値返し（Return by value）する（コンパイラが自動的にムーブまたはRVO最適化を行う）',
        'グローバル変数に vector を置いて共有する'
      ],
      correctIndex: 2,
      explanation: '正解は「普通に std::vector を値返し（Return by value）する」です。モダンC++ではRVO（戻り値最適化）やムーブセマンティクスが働くため、値返しを行っても一切のコピーオーバーヘッドが発生しません。最も自然で安全なAPI設計になります。'
    }
  ],
  nextChapterSlug: 'chapter-modern-3-lambda',
  prevChapterSlug: 'chapter-5-smart-pointers-raii'
};

