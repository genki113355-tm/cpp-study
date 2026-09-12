import { Chapter } from '../../types/curriculum';

export const chapter1: Chapter = {
  id: 1,
  slug: 'chapter-1-spaghetti-code',
  courseTrack: 'classic',
  courseChapterCode: 'C1',
  title: 'レガシー第1章：1ファイルで作るスパゲティコード（ビフォー：意図の不在）',
  subtitle: 'C言語の手続き型設計がなぜ大規模開発で破綻するのか？',
  badge: 'レガシーC++ C1：1ファイル・構造化設計の限界',
  description: 'Windowsコンソール上で文字（自機 _A_、敵 V、弾 |）を使って描画する最小限のインベーダーゲーム。C言語で関数設計を書いてきた人が「とりあえず動かす」ために書いてしまいがちな、意図の不在によるスパゲティコードを徹底的に解剖します。',
  gameVersion: 'v1_spaghetti',
  prevChapterSlug: undefined,
  nextChapterSlug: 'chapter-2-classes-and-files',
  sections: [
    {
      id: 'sec1-paradigm',
      title: '1.1 C言語マインドセットの罠：「動くけれど破綻するコード」の正体',
      leadText: '読者の皆様の多くは、C言語で「構造化プログラミング」や「関数設計書」を書いてきた経験があるでしょう。しかし、その延長線上でゲームや大規模アプリを書こうとすると、ほぼ確実に最初の壁に激突します。',
      dialogueBefore: [
        {
          id: 'd1-1',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'シロクマ指導官、見てください！C言語のノウハウをフル活用して、Windowsコンソールで動くインベーダーをC++でサクッと作りました！\n面倒なクラス設計もファイル分割もナシ！「main.cpp」たった1ファイルに全て書き殴りました！動けば正義ですよね！',
          sideNote: '胸を張って画面を指差すペンギン生徒'
        },
        {
          id: 'd1-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: '……な、なんじゃこのコードはぁぁぁ！？\nグローバル変数が15個も散らばり、main関数の中に巨大なwhile文が1個、キー入力・移動・当たり判定・描画バッファの組み立てが全部1箇所のif-elseネストに押し込まれておる！これぞまさに「意図の不在」が生んだ純度100%のスパゲティコードじゃ！',
        },
        {
          id: 'd1-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ…でも先生、現に画面で自機は動くし、敵も倒せますよ？C言語の現場でも「関数設計書」を起こす前のプロトタイプってこうやって書きませんか？何がそんなに罪深いんですか？',
        },
        {
          id: 'd1-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ペンギン君、プログラミングにおいて「動く」ことは最低限のスタート地点に過ぎん。\n重要なのは「明日、別のエンジニアが新機能を追加できるか？」「半年後の自分がバグを直せるか？」という【設計の意図】じゃ。このコードは、1個でも仕様変更が来たら即座に自滅する時限爆弾なんじゃよ！',
        }
      ],
      paradigmComparison: {
        title: 'C言語的「とりあえず1ファイル」 vs 破綻のメカニズム',
        cApproach: {
          title: 'グローバル変数と巨大関数の集中豪雨',
          code: `// C言語初心者がやりがちな書き方
int playerX = 14;
int bulletActive = 0;
int bulletX, bulletY;
int invaderAlive[6];

int main() {
    while(1) {
        // 入力も移動も判定も描画も全部直書き
        if (key == 'a') playerX--;
        if (bulletActive) {
            bulletY--;
            // 敵との当たり判定ループ...
        }
        // 描画...
    }
}`,
          drawbacks: [
            'どこからでも全変数が書き換え可能で、バグの原因特定が不可能',
            '弾を3連射にするだけで、変数の増殖とコピペ地獄が発生',
            '「入力」を直したはずが「描画」が壊れる密結合の罠'
          ]
        },
        cppApproach: {
          title: '責任の分離を見据えた設計（第2章の予告）',
          code: `// 本来目指すべきオブジェクト指向の姿
class Player { /* 自機の責任 */ };
class Bullet { /* 弾の責任 */ };
class Invader { /* 敵の責任 */ };

int main() {
    Game game;
    game.run(); // mainは指揮を執るだけ
}`,
          benefits: [
            '各オブジェクトが自分の状態（座標や生存）を厳格に保護',
            '新機能（連射や新敵）を追加しても既存コードが一切壊れない',
            'チーム開発で担当ファイルを完全に分担できる'
          ]
        },
        paradigmShiftNotes: 'C言語の「データを引数で関数に回す」以前に、グローバル変数に甘えて1つの関数に全処理を詰め込むと、コードは一瞬でメンテナンス不能になります。「誰が何のデータに責任を持つのか」を明確にすることが、オブジェクト指向への第一歩です。'
      }
    },
    {
      id: 'sec1-variables',
      title: '1.2 用意された全データ：むき出しのグローバル変数一覧表',
      leadText: '第1章で使われている全変数を公開します。なぜこれらが「むき出し」であることが危険なのか、C言語の関数設計の視点からも対比してみましょう。',
      variables: [
        {
          name: 'WIDTH, HEIGHT',
          type: 'const int',
          scope: 'グローバル定数 (30, 15)',
          description: '画面のマス目サイズ。壁の境界判定や描画バッファ配列のサイズとして全域で使用。',
          cComparison: 'C言語の #define WIDTH 30 と同等。型安全な定数化は良いが、ハードコードされているため画面サイズ可変に対応できない。'
        },
        {
          name: 'playerX, playerY',
          type: 'int / const int',
          scope: 'グローバル変数 (初期値: 14, 13)',
          description: '自機の現在位置。A/Dキーで playerX が加減算される。',
          cComparison: 'C言語なら struct Player { int x, y; } を定義して引数渡しすべきところを、手抜きでグローバル変数にしてしまっている。'
        },
        {
          name: 'bulletActive, bulletX, bulletY',
          type: 'bool / int',
          scope: 'グローバル変数',
          description: '弾の存在フラグと現在位置。自機が撃つと true になり、天井に達するか敵に当たると false になる。',
          cComparison: 'フラグ1個で管理しているため「同時に1発しか撃てない」。連射に対応しようとすると変数のコピペ爆発が起きる。'
        },
        {
          name: 'invaderX[6], invaderY[6], invaderAlive[6]',
          type: 'int[6] / bool[6]',
          scope: 'グローバル固定配列',
          description: '6体の敵それぞれの座標と生存フラグ。',
          cComparison: '固定長配列であるため、ステージごとに敵の数を変えたり、増援を出したりすることが構造上不可能。'
        },
        {
          name: 'invaderDir, invaderMoveTimer',
          type: 'int',
          scope: 'グローバル変数',
          description: '敵全体の移動方向（+1:右, -1:左）と、移動速度を間引くための5フレームタイマー。',
          cComparison: '「敵全体の群れ」の状態と「敵個体」の状態が分離されておらず、コード中に混在している。'
        },
        {
          name: 'score, gameOver, gameClear',
          type: 'int / bool',
          scope: 'グローバル変数',
          description: 'ゲームの進行状態フラグと得点。',
          cComparison: '誰でもスコアやゲームオーバーを強制書き換えできてしまうため、整合性のチェック機構が存在しない。'
        }
      ]
    },
    {
      id: 'sec1-code',
      title: '1.3 第1章の教材コード：main.cpp（全150行）',
      leadText: '実際にWindows環境でコンパイル・実行できる第1章のコードです。「動いているけれど、なぜこれ以上手を入れたくないのか」を感じながら読んでみてください。',
      codeFiles: [
        {
          filename: 'main.cpp',
          language: 'cpp',
          isMain: true,
          description: 'グローバル変数乱立・すべてのロジックが1箇所に集中したスパゲティコード',
          code: `#include <iostream>
#include <windows.h>
#include <conio.h>

// =============================================================
// 【意図の不在①】すべての状態がグローバル変数として野ざらし！
// どこからでも書き換え可能＝どこで壊れたのか誰にも分からない。
// =============================================================
const int WIDTH = 30;
const int HEIGHT = 15;

int playerX = 14;              // 自機のX座標
const int playerY = 13;        // 自機のY座標（固定）

bool bulletActive = false;     // 弾が存在するか
int bulletX = 0;               // 弾のX座標
int bulletY = 0;               // 弾のY座標

const int INVADER_COUNT = 6;
int invaderX[INVADER_COUNT] = { 4, 8, 12, 16, 20, 24 };
int invaderY[INVADER_COUNT] = { 2, 2,  2,  2,  2,  2 };
bool invaderAlive[INVADER_COUNT] = { true, true, true, true, true, true };
int invaderDir = 1;            // 敵の移動方向 (1:右, -1:左)
int invaderMoveTimer = 0;

int score = 0;
bool gameOver = false;
bool gameClear = false;

// カーソルを左上に戻す関数（画面のチラつき防止）
void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

int main() {
    // コンソールカーソルを非表示化
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    // =========================================================
    // 【意図の不在②】巨大なループに全機能が密結合！
    // 入力・更新・当たり判定・描画が絡み合い、修正が全体に波及する。
    // =========================================================
    while (!gameOver && !gameClear) {

        // --- 1. 入力処理 ---
        if (_kbhit()) {
            char key = _getch();
            if (key == 'a' || key == 'A') {
                if (playerX > 1) playerX--;
            }
            else if (key == 'd' || key == 'D') {
                if (playerX < WIDTH - 4) playerX++;
            }
            else if (key == ' ' && !bulletActive) {
                bulletActive = true;
                bulletX = playerX + 1;
                bulletY = playerY - 1;
            }
            else if (key == 'q' || key == 'Q') {
                gameOver = true;
            }
        }

        // --- 2. 弾の移動更新 ---
        if (bulletActive) {
            bulletY--;
            if (bulletY < 1) {
                bulletActive = false; // 天井到達で消滅
            }
        }

        // --- 3. 敵の移動更新（タイマー間引き） ---
        invaderMoveTimer++;
        if (invaderMoveTimer >= 5) {
            invaderMoveTimer = 0;
            bool hitWall = false;

            for (int i = 0; i < INVADER_COUNT; i++) {
                if (!invaderAlive[i]) continue;
                if ((invaderDir == 1 && invaderX[i] >= WIDTH - 2) ||
                    (invaderDir == -1 && invaderX[i] <= 1)) {
                    hitWall = true;
                    break;
                }
            }

            if (hitWall) {
                invaderDir = -invaderDir;
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaderY[i]++;
                    if (invaderAlive[i] && invaderY[i] >= playerY) {
                        gameOver = true; // 自機ライン到達で侵略敗北
                    }
                }
            } else {
                for (int i = 0; i < INVADER_COUNT; i++) {
                    invaderX[i] += invaderDir;
                }
            }
        }

        // --- 4. 当たり判定（弾 vs 敵） ---
        if (bulletActive) {
            for (int i = 0; i < INVADER_COUNT; i++) {
                if (invaderAlive[i] && bulletX == invaderX[i] && bulletY == invaderY[i]) {
                    invaderAlive[i] = false;
                    bulletActive = false;
                    score += 100;
                    break;
                }
            }
        }

        // クリアチェック
        bool anyAlive = false;
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaderAlive[i]) { anyAlive = true; break; }
        }
        if (!anyAlive) gameClear = true;

        // --- 5. 画面描画（文字バッファ構築） ---
        char screen[HEIGHT][WIDTH];
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (y == 0 || y == HEIGHT - 1 || x == 0 || x == WIDTH - 1) {
                    screen[y][x] = '#';
                } else {
                    screen[y][x] = ' ';
                }
            }
        }

        // 自機プロット (_A_)
        screen[playerY][playerX] = '_';
        screen[playerY][playerX + 1] = 'A';
        screen[playerY][playerX + 2] = '_';

        // 弾プロット (|)
        if (bulletActive && bulletY > 0 && bulletY < HEIGHT - 1 && bulletX > 0 && bulletX < WIDTH - 1) {
            screen[bulletY][bulletX] = '|';
        }

        // 敵プロット (V)
        for (int i = 0; i < INVADER_COUNT; i++) {
            if (invaderAlive[i]) {
                int ix = invaderX[i];
                int iy = invaderY[i];
                if (iy > 0 && iy < HEIGHT - 1 && ix > 0 && ix < WIDTH - 1) {
                    screen[iy][ix] = 'V';
                }
            }
        }

        // 一括画面出力
        setCursorPosition(0, 0);
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                std::cout << screen[y][x];
            }
            std::cout << "\\n";
        }
        std::cout << "SCORE: " << score << "  (A:左 D:右 Space:発射 Q:終了)    \\n";

        // --- 6. 30FPS制御 ---
        Sleep(33);
    }

    setCursorPosition(0, HEIGHT + 1);
    if (gameClear) {
        std::cout << "=================================\\n";
        std::cout << "  CONGRATULATIONS! GAME CLEAR!   \\n";
        std::cout << "=================================\\n";
    } else {
        std::cout << "=================================\\n";
        std::cout << "           GAME OVER             \\n";
        std::cout << "=================================\\n";
    }
    return 0;
}`
        }
      ]
    },
    {
      id: 'sec1-critique',
      title: '1.4 シロクマ先生の設計診断：「なぜこれ以上拡張できないのか」',
      diagramType: 'spaghetti_vs_modular',
      dialogueBefore: [
        {
          id: 'd1-5',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ペンギン君、このコードの最も致命的な欠陥を暴いてみよう。\n「自機の弾を画面内に3発まで連射できるように仕様変更してくれ」と言われたら、C言語の関数設計脳の君はどう改造する？',
        },
        {
          id: 'd1-6',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ええと……bulletActive1, bulletActive2, bulletActive3 とフラグを増やして、bulletX1, X2, X3、bulletY1, Y2, Y3 を作って、main関数の移動ロジックも当たり判定ループも3倍コピペして……あれ？コード量が3倍に激増する！？',
          sideNote: '冷や汗を流すペンギン生徒'
        },
        {
          id: 'd1-7',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そう！さらに「耐久力2の中ボス敵」を追加したら？敵のHP配列を作って、当たり判定のなかに例外if文が山のように積み重なる。\nこれが【密結合】の恐怖じゃ。「動けばいい」で作ったコードは、1つの仕様変更でコード全体を書き換えるハメになり、必ず破綻するのじゃ！',
        },
        {
          id: 'd1-8',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ぐぬぬ……確かにこれじゃ、自分以外のチームメンバーに「敵の移動だけ直して」って頼むことすらできません……！',
        }
      ],
      takeaways: [
        {
          title: 'グローバル変数は「責任の不在」',
          description: '誰でも数値を変更できるということは、「誰もその数値の正しさに責任を持っていない」と同義です。バグ調査に何時間も浪費します。'
        },
        {
          title: '密結合は「変更コストの爆発」',
          description: '入力・更新・判定・描画が1つの関数に同居していると、入力の修正が無関係な描画バグを引き起こす連鎖爆縮が起きます。'
        },
        {
          title: '解決策は「カプセル化」と「責任の分離」',
          description: 'Playerは自分の位置にだけ責任を持ち、Bulletは自分の飛翔にだけ責任を持つ。この責任分担を言語機能として実現するのが第2章の「クラス」です。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q1-1',
      question: 'C言語で「関数設計書」を書いてきた開発者が、第1章のようなコードからC++オブジェクト指向へ移行する際、最も捨てるべき思考法はどれでしょう？',
      options: [
        '「画面描画はstd::coutではなくprintfを使うべきだ」という文法へのこだわり',
        '「全ての状態を変数として持ち、関数で上から下へ順番に書き換えていけば動く」という手続き型の発想',
        '「Sleep関数で待つのはCPUに優しい」というタイマー制御の発想',
        '「座標系は左上が原点(0,0)である」というグラフィックの知識'
      ],
      correctIndex: 1,
      explanation: '正解です！手続き型では「データ」と「処理」が分離しており、巨大なループが全データを直接操作します。オブジェクト指向では「データとその操作権」をオブジェクトの中に閉じ込め、自律的に動かす思考の転換（パラダイムシフト）が必須となります。'
    }
  ]
};
