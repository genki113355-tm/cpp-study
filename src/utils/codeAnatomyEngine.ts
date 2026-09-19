import { CodeFile, CodeExplanationItem } from '../types/curriculum';

/**
 * C++コードの構文パターンを自動解析し、初心者向けの解剖解説を生成するスマートエンジン
 */
export const getFileLineExplanations = (file: CodeFile): Map<number, CodeExplanationItem> => {
  const map = new Map<number, CodeExplanationItem>();

  // 1. 手動で定義されたリッチな行解説を最優先登録
  if (file.lineExplanations) {
    file.lineExplanations.forEach((item) => {
      map.set(item.line, item);
    });
  }

  // 2. 自動構文解析（手動解説がない重要行をスマート補完）
  const lines = file.code.split('\n');

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    if (map.has(lineNum)) return; // 既に手動解説がある行はスキップ

    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('/*')) return;

    // ① 純粋仮想関数
    if (line.includes('virtual ') && (line.includes('= 0;') || line.includes('=0;'))) {
      map.set(lineNum, {
        line: lineNum,
        title: '純粋仮想関数（インターフェースの契約）',
        summary: '基底クラスでは処理の実体を持たず、派生クラスに「必ずこの関数を実装せよ」と強制する宣言です。',
        tokens: [
          { token: 'virtual', explanation: '仮想関数テーブル（vtable）を経由して動的呼び出しを行う修飾子' },
          { token: '= 0;', explanation: '純粋仮想関数の合図。このクラス単体での実体化（インスタンス化）を禁止します' },
        ],
        pitfall: '= 0 を書かないと基底クラス側にも中身が必要になり、抽象インターフェースとしての設計が崩れます。',
      });
      return;
    }

    // ② 仮想デストラクタ
    if (line.includes('virtual ~') || (line.startsWith('~') && line.includes('override'))) {
      map.set(lineNum, {
        line: lineNum,
        title: '仮想デストラクタ（継承時のメモリリーク防止）',
        summary: '基底クラスのポインタ経由で delete された際、派生クラスのデストラクタが確実に呼ばれるようにします。',
        tokens: [
          { token: 'virtual', explanation: 'デストラクタ呼び出しを実行時の実際の型に基づいて解決させる' },
          { token: '= default;', explanation: '標準の自明なデストラクタ処理をコンパイラに自動生成させる' },
        ],
        pitfall: '継承の基底クラスでデストラクタを virtual にし忘れると、派生クラスのメンバ変数が解放されず深刻なメモリリークを引き起こします。',
      });
      return;
    }

    // ③ 仮想関数（基底クラス）
    if (line.startsWith('virtual ') && !line.includes('~')) {
      map.set(lineNum, {
        line: lineNum,
        title: '仮想関数（ポリモーフィズムの基盤）',
        summary: '子クラスで挙動を自由に上書き（オーバーライド）できるようにする宣言です。',
        tokens: [
          { token: 'virtual', explanation: '関数の動的結合（vtable経由の実行時ディスパッチ）を有効にするキーワード' },
        ],
        pitfall: 'virtual を付けないと、基底クラスのポインタで呼んだ時に常に基底クラス側の関数が固定で呼ばれてしまいます。',
      });
      return;
    }

    // ④ override 指定
    if (line.includes('override') && (line.endsWith('override;') || line.endsWith('override') || line.includes('override {'))) {
      map.set(lineNum, {
        line: lineNum,
        title: 'override 指定子（安全な関数上書きの保証）',
        summary: '「親クラスの仮想関数を正しく上書きしているか」をコンパイラに厳密にチェックさせます。',
        tokens: [
          { token: 'override', explanation: '引数の型や const の付け忘れによるミスをコンパイルエラーとして検知する' },
        ],
        pitfall: 'override を書き忘れると、親クラスの関数シグネチャと1文字ズレていても別関数とみなされ、バグの温床になります。',
      });
      return;
    }

    // ⑤ explicit コンストラクタ
    if (line.startsWith('explicit ')) {
      map.set(lineNum, {
        line: lineNum,
        title: 'explicit コンストラクタ（暗黙変換の禁止）',
        summary: '意図しない自動的な型変換（例: Player p = 10; など）をコンパイルエラーとしてブロックします。',
        tokens: [
          { token: 'explicit', explanation: '単一引数コンストラクタによる暗黙の型キャストを無効化する' },
        ],
        pitfall: '省略すると、関数に数値を渡しただけで勝手に一時オブジェクトが生成されるという分かりにくいバグを招きます。',
      });
      return;
    }

    // ⑥ std::make_unique
    if (line.includes('std::make_unique<')) {
      map.set(lineNum, {
        line: lineNum,
        title: 'std::make_unique（安全なスマートポインタ生成）',
        summary: 'new を一切書かずにヒープメモリを確保し、例外発生時にも絶対にリークしない安全な生成関数です。',
        tokens: [
          { token: 'std::make_unique<T>(...)', explanation: '指定した型 T のインスタンスを動的生成し、unique_ptr で包んで返す（C++14〜）' },
        ],
        pitfall: '生 new で確保して代入すると、引数評価順序の例外発生時にメモリリークする可能性があります。',
      });
      return;
    }

    // ⑦ std::unique_ptr
    if (line.includes('std::unique_ptr<')) {
      map.set(lineNum, {
        line: lineNum,
        title: 'std::unique_ptr（単独所有型スマートポインタ）',
        summary: 'このポインタがスコープを抜けて不要になった時、自動的に delete を呼んでメモリを解放します。',
        tokens: [
          { token: 'std::unique_ptr<T>', explanation: '所有権を1箇所だけで独占保持するポインタ。コピー禁止・ムーブのみ許可' },
        ],
        pitfall: '生ポインタと違い delete を手動で書く必要が一切なく、delete 忘れや二重解放の事故を根絶できます。',
      });
      return;
    }

    // ⑧ std::move
    if (line.includes('std::move(')) {
      map.set(lineNum, {
        line: lineNum,
        title: 'std::move（所有権の譲渡・ムーブセマンティクス）',
        summary: '巨大なデータの不要なコピーを避け、中身のポインタ所有権だけを「引っ越し」させて高速移動します。',
        tokens: [
          { token: 'std::move(x)', explanation: '変数を一時オブジェクト（右辺値）にキャストし、所有権の譲渡を可能にする' },
        ],
        pitfall: 'std::move した後の元の変数は「空（中身が抜き取られた状態）」になるため、再利用してはいけません。',
      });
      return;
    }

    // ⑨ delete[] / delete
    if (line.startsWith('delete[] ') || line.startsWith('delete ')) {
      map.set(lineNum, {
        line: lineNum,
        title: '手動メモリ解放（クラシックC++の必須責務）',
        summary: 'new で確保したヒープ領域のメモリをOSに返却します。',
        tokens: [
          { token: line.startsWith('delete[]') ? 'delete[]' : 'delete', explanation: '配列確保なら delete[]、単体確保なら delete を対で呼ぶ' },
        ],
        pitfall: '解放を忘れるとメモリリーク、二重に呼ぶとクラッシュ（二重解放）、配列に単体 delete を使うと未定義動作になります。',
      });
      return;
    }

    // ⑩ nullptr
    if (line.includes('nullptr') && (line.includes('= nullptr') || line.includes('== nullptr') || line.includes('!= nullptr'))) {
      map.set(lineNum, {
        line: lineNum,
        title: 'nullptr（型安全なヌルポインタ定数）',
        summary: 'ポインタが何も指していないことを安全に表すC++11標準キーワードです。',
        tokens: [
          { token: 'nullptr', explanation: 'ポインタ専用の型（std::nullptr_t）を持ち、整数 0 やマクロ NULL のような混同が起きない' },
        ],
        pitfall: 'C言語の NULL は実質ただの「0（整数）」であるため、関数のオーバーロードで整数版が誤認呼び出しされる事故が起きます。',
      });
      return;
    }

    // ⑪ メンバ初期化子リスト
    if (line.includes(') : ') && line.includes('(') && line.includes(')') && (line.endsWith('{') || line.endsWith('{}'))) {
      map.set(lineNum, {
        line: lineNum,
        title: 'メンバ初期化子リスト（高速かつ安全な初期化）',
        summary: 'コンストラクタ本体の {} が動く前に、メンバ変数を直接構築します。',
        tokens: [
          { token: ': var(val), ...', explanation: 'メンバ変数の初期値をカンマ区切りで指定するコロン構文' },
        ],
        pitfall: '{} 内で代入（var = val;）すると「デフォルト構築＋後から代入」の2度手間になり、constメンバや参照メンバは初期化できません。',
      });
      return;
    }

    // ⑫ constexpr
    if (line.startsWith('constexpr ') || line.includes(' constexpr ')) {
      map.set(lineNum, {
        line: lineNum,
        title: 'constexpr（コンパイル時計算定数）',
        summary: 'プログラム実行前（コンパイル時）に値や関数の計算を終わらせ、実行時コストを完全ゼロにします。',
        tokens: [
          { token: 'constexpr', explanation: '「定数式（Constant Expression）」としてコンパイル時に確定させるキーワード' },
        ],
        pitfall: '#define と違い、C++のスコープと型チェックが完全に効くため、名前衝突事故が起きません。',
      });
      return;
    }

    // ⑬ 二重インクルード防止ガード
    if (line === '#pragma once') {
      map.set(lineNum, {
        line: lineNum,
        title: '#pragma once（ヘッダ多重インクルード防止）',
        summary: '同じヘッダファイルが複数のソースから重複して読み込まれ、型定義エラーになるのを防ぎます。',
        tokens: [
          { token: '#pragma once', explanation: '現在の主要コンパイラ（GCC/Clang/MSVC）すべてで標準的にサポートされるヘッダガード' },
        ],
        pitfall: 'これがないと、ヘッダを複数インクルードした瞬間に「クラスの再定義エラー」でコンパイルが止まります。',
      });
      return;
    }

    // ⑭ public / private アクセス指定子
    if (line === 'public:' || line === 'private:' || line === 'protected:') {
      map.set(lineNum, {
        line: lineNum,
        title: `アクセス指定子（${line.replace(':', '')}）`,
        summary: line === 'private:' 
          ? 'ここから下のメンバはクラス内部からしか触れないように隠蔽（カプセル化）します。'
          : 'ここから下のメンバは外部のどこからでもアクセスできる公開インターフェースになります。',
        tokens: [
          { token: line, explanation: 'クラスの公開範囲を切り替えるラベル' },
        ],
        pitfall: 'すべてを public にすると外部から勝手に内部状態を書き換えられ、オブジェクト指向の堅牢性が失われます。',
      });
      return;
    }
  });

  return map;
};
