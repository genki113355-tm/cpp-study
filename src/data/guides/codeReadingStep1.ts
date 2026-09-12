import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_1: Chapter = {
  id: 201,
  slug: 'reading-step-1',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R1',
  title: 'コード読解演習 Step 1【初級】：手続き型データフローの追跡',
  subtitle: '単一ファイル・手続き型コードから「状態変数」と「メインループの実行順序」を抜き出す',
  badge: '読解演習 Step 1',
  description: '何百行もある手続き型ソースコードを前にしても動じない！変数がどこで初期化され、ループ内でどう書き換わり、どこへ出力されるのか——「状態変数のライフサイクル」と「実行順序」をプロの眼力でトレースする基礎体力を養成します。',
  gameVersion: 'none',
  sections: [
    {
      id: 'step1-overview',
      title: '1.1 初級読解の極意：上から下へ読むな！「変数表」を頭に作れ',
      leadText: '手続き型コードを1行目から小説のように読んではいけません。最初に「何が状態（データ）で、何が更新処理か」を分離して捉えます。',
      dialogueBefore: [
        {
          id: 'dlg-r1-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生！先輩から「このレガシーな保守コード、どんな挙動してるか読んで仕様書にまとめて」って言われたんですけど、1つの `main.cpp` に変数がいっぱいあって、上から順に読んでたら途中で何が何だか分からなくなって頭がオーバーヒートしました…！',
        },
        {
          id: 'dlg-r1-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉふぉふぉ、典型的な新人のトラップじゃな！手続き型プログラムは「小説」ではなく「工場のベルトコンベア」じゃ。1行目から流し読みするのではなく、**【① 状態変数（保管庫）をリストアップ】→【② ループ（加工工程）での更新式を追跡】→【③ 終了・出力条件】**の3ステップで解読するのじゃ！',
        },
      ],
      explanationText: `
### 手続き型コード読解の「3ステップ・スキャン法」

1. **ステップ1：状態変数（State Variables）の洗い出し**:
   - 関数の先頭で宣言されている変数は何か？
   - どれが「座標（X, Y）」で、どれが「タイマー/カウンタ」、どれが「フラグ（bool）」か？
2. **ステップ2：メインループの「フレーム更新周期」の特定**:
   - \`while\` や \`for\` の条件式は何か？（何が起きたらループを抜けるか？）
   - 1周ごとに値が増減する変数はどれか？（時間の経過を表す変数）
3. **ステップ3：入力と分岐（If文）による「状態遷移」の図式化**:
   - ユーザー入力や特定条件で、どの変数がどう書き換わるか？
      `,
      takeaways: [
        {
          title: '変数を「役割別」に脳内分類する',
          description: '位置データ、進行カウンタ、状態フラグ（生存/死亡など）に変数を分類するだけで、読むべき行数が1/3に圧縮されます。',
        },
      ],
    },
    {
      id: 'step1-sample-code',
      title: '1.2 演習コード：宇宙探査ポッドの手続き型シミュレータ',
      leadText: '以下のC++コードを読み解き、ポッドの燃料消費と高度変化のデータフローを追跡してください。',
      codeFiles: [
        {
          filename: 'lander_procedural.cpp',
          language: 'cpp',
          isMain: true,
          description: '単一ファイルで書かれた月面探査機着陸シミュレータ（手続き型）',
          code: `#include <iostream>

// 月面探査機の手続き型シミュレーション
int main() {
    // --- 【状態変数グループ】 ---
    double altitude = 100.0; // 高度 (m)
    double velocity = 0.0;    // 降下速度 (m/s) 正値で降下
    double fuel = 50.0;       // 残り燃料 (L)
    const double gravity = 1.62; // 月面重力加速度
    int timeSeconds = 0;      // 経過時間
    bool landed = false;

    // --- 【シミュレーション・メインループ】 ---
    while (!landed) {
        timeSeconds++;
        double thrust = 0.0; // この秒の噴射推力

        // 簡易オートパイロット判断ロジック
        if (altitude < 30.0 && fuel >= 5.0) {
            thrust = 3.0; // 逆噴射で減速
            fuel -= 5.0;
        } else if (altitude < 60.0 && fuel >= 2.0) {
            thrust = 1.8;
            fuel -= 2.0;
        }

        // 物理計算（データフロー：重力と推力から速度と高度を更新）
        velocity += (gravity - thrust);
        altitude -= velocity;

        // 接地判定
        if (altitude <= 0.0) {
            altitude = 0.0;
            landed = true;
        }

        std::cout << "[T=" << timeSeconds << "s] 高度: " << altitude 
                  << "m, 速度: " << velocity << "m/s, 燃料: " << fuel << "L\\n";

        // 安全装置：燃料切れかつ速度超過なら暴走防止で緊急中断
        if (fuel <= 0.0 && velocity > 15.0) {
            std::cout << ">>> 警告：燃料枯渇！墜落コースに入りました\\n";
            break;
        }
    }

    // --- 【結果判定】 ---
    if (velocity <= 3.0) {
        std::cout << "=== 軟着陸成功！探査ポッドは無事です ===\\n";
    } else {
        std::cout << "=== 衝撃大！着陸脚が破損しました (着地速度: " << velocity << "m/s) ===\\n";
    }
    return 0;
}`
        }
      ],
      dialogueAfter: [
        {
          id: 'dlg-r1-3',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'どうじゃペンギン君？\n変数 `thrust` はループの先頭で毎回 `0.0` にリセットされる「一時変数」、`altitude` と `velocity` と `fuel` はループを跨いで値が累積していく「永続状態変数」じゃな！この区別がつくだけで、コードの挙動がクッキリ見えてくるはずじゃ！',
        },
        {
          id: 'dlg-r1-4',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'あ！本当だ！`thrust` はその秒だけの使い捨てで、`altitude` から `velocity` を引き算しているから、速度がプラスの間は高度がどんどん下がっていくんですね！データが流れるパイプが見えました！',
        }
      ],
      takeaways: [
        {
          title: '一時変数（スコープ内）と蓄積変数（スコープ外）を見分ける',
          description: '毎フレーム上書きされる使い捨て変数と、前のフレームの結果を蓄積する変数を区別することが読解の第一歩です。',
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r1-1',
      question: '演習コードにおいて、ループを跨いで前のターンの計算結果を記憶し続ける「永続状態変数」はどれでしょう？',
      options: [
        'thrust のみ',
        'altitude, velocity, fuel, timeSeconds',
        'gravity のみ',
        'timeSeconds と thrust のみ'
      ],
      correctIndex: 1,
      explanation: '正解です！altitude, velocity, fuel, timeSeconds は while ループの外側で宣言されており、各反復での変化が累積していきます。一方 thrust はループ内で宣言されているため毎反復リセットされる一時変数です。'
    },
    {
      id: 'q-r1-2',
      question: '高度（altitude）が 25.0m で、残り燃料（fuel）が 10.0L のとき、オートパイロットが選択する逆噴射推力（thrust）と燃料消費量はどれでしょう？',
      options: [
        'thrust = 0.0、燃料消費 0.0L',
        'thrust = 1.8、燃料消費 2.0L',
        'thrust = 3.0、燃料消費 5.0L',
        'thrust = 5.0、燃料消費 3.0L'
      ],
      correctIndex: 2,
      explanation: '正解です！`if (altitude < 30.0 && fuel >= 5.0)` の第1条件に合致するため、thrust = 3.0 が代入され、燃料が 5.0L 消費されます。'
    },
    {
      id: 'q-r1-3',
      question: 'このシミュレーションで「軟着陸成功」と判定されるための絶対条件は何でしょう？',
      options: [
        '残り燃料が 0L であること',
        '経過時間（timeSeconds）が 10秒以内であること',
        '高度が 0.0m に達した時点の降下速度（velocity）が 3.0 m/s 以下であること',
        'thrust が一度も 3.0 にならなかったこと'
      ],
      correctIndex: 2,
      explanation: '正解です！接地判定後、ループを抜けた先の `if (velocity <= 3.0)` によって軟着陸の成否が判定されます。'
    },
    {
      id: 'q-r1-4',
      question: 'このような手続き型コードを保守する際、最も発生しやすい典型的なバグ（落とし穴）は何でしょう？',
      options: [
        'クラスが多すぎてファイルが見つからないこと',
        '変数の値がどこで誰によって書き換えられたか追跡が難しく、計算順序を1行入れ替えただけで挙動が激変すること',
        'vtableの仮想関数呼び出しオーバーヘッドで速度が低下すること',
        'テンプレートのコンパイルエラーが長すぎること'
      ],
      correctIndex: 1,
      explanation: '正解です！手続き型コードはデータが広域スコープで共有されがちなため、代入のタイミングや順序への依存度が高く、修正時の予期せぬ副作用（バグ）を生みやすいのが弱点です。'
    }
  ]
};
