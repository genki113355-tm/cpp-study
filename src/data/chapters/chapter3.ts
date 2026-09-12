import { Chapter } from '../../types/curriculum';

export const chapter3: Chapter = {
  id: 3,
  slug: 'chapter-3-dynamic-lifecycle',
  courseTrack: 'classic',
  courseChapterCode: 'C3',
  title: 'レガシー第3章：オブジェクトの動的生成と寿命管理（豪華さアップ＆メモリの意図）',
  subtitle: '可変個数のオブジェクトを安全に扱う！std::vector と RAII の基本',
  badge: 'レガシーC++ C3：動的配列と手動寿命管理',
  description: '固定長配列を卒業し、標準コンテナ std::vector を導入！敵に弾が当たると、大量の火花（Particleオブジェクト）が動的に生み出され、寿命を迎えて自動消滅する豪華なエフェクトを実装。メモリ（スタック/ヒープ）におけるオブジェクトの誕生と消滅のサイクルを完全可視化します。',
  gameVersion: 'v3_dynamic',
  prevChapterSlug: 'chapter-2-classes-and-files',
  nextChapterSlug: 'chapter-4-inheritance-and-polymorphism',
  sections: [
    {
      id: 'sec3-malloc-vs-raii',
      title: '3.1 C言語の「malloc / free 地獄」vs C++の「寿命管理（RAII）」',
      leadText: 'C言語で動的メモリを扱ったことのある開発者なら、誰もが「解放忘れ（メモリリーク）」や「二重解放（double free）」で深夜に頭を抱えた経験があるはずです。C++はこの問題を根本から解決します。',
      dialogueBefore: [
        {
          id: 'd3-1',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'シロクマ指導官！第2章でクラス化はできましたが、敵を倒した瞬間が「ポッ」と消えるだけでなんだか地味です……もっと弾が当たったときにドカーン！と火花が散る派手な演出が欲しいです！',
        },
        {
          id: 'd3-2',
          speaker: 'shirokuma',
          emotion: 'happy',
          text: 'いい着眼点じゃ！ゲームの爽快感を決定づける要素、それが『パーティクル（粒子エフェクト）』じゃ。敵が撃破された瞬間、10個以上の火花オブジェクトを一気に生成して四方へ飛ばすのじゃ！',
        },
        {
          id: 'd3-3',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ええっ！？でもC言語で動的に増えるオブジェクトを作るとなると、`malloc(sizeof(Particle) * 10)` とかやるんですよね？\n僕、どこで `free()` を呼べばいいか分からなくなって、メモリリークでOSをクラッシュさせたり、二重解放で即死セグフォ食らったりしてトラウマなんですが……！',
          sideNote: '青ざめるペンギン生徒'
        },
        {
          id: 'd3-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '安心せい！それこそがC言語開発者を40年間苦しめてきた最大の悪夢じゃ。\nC++には【RAII（Resource Acquisition Is Initialization）】という究極の設計哲学と、自動でメモリを伸縮させる【std::vector】がある！手動で free() を呼ぶ時代は完全に終わったのじゃ！',
        }
      ],
      paradigmComparison: {
        title: '動的メモリ管理のパラダイムシフト：malloc/free vs std::vector',
        cApproach: {
          title: 'C言語：手動ポインタ管理（事故多発）',
          code: `// C言語での動的確保
Particle* p = (Particle*)malloc(sizeof(Particle) * count);
if (!p) return ERROR; // NULLチェック必須

// ...ゲーム処理...

// 現場の恐怖：
// free(p); を忘れるとメモリリークで長時間稼働時に死ぬ
// ループの途中で return すると free が漏れる
// 2回呼ぶと double free で即死クラッシュ！`,
          drawbacks: [
            'freeの呼び忘れによる深刻なメモリリーク',
            '二重解放（double-free）や解放後アクセス（use-after-free）',
            '配列サイズが足りなくなった時の realloc の煩雑さと危険性'
          ]
        },
        cppApproach: {
          title: 'C++：std::vector と RAII（完全自動寿命）',
          code: `// C++の動的配列コンテナ
std::vector<Particle> particles;

// 必要な時に生成（メモリは自動確保＆自動拡張）
particles.push_back(Particle(x, y, vx, vy, life));

// 役目が終われば安全に消去
// デストラクタが自動で走り、メモリは1バイトも漏れずに返却される！
particles.erase(it);`,
          benefits: [
            'malloc / free を一切書く必要がない（メモリ安全性100%）',
            'コンストラクタで初期化され、デストラクタで自動解放される（RAII原則）',
            '要素数に応じてバッファが自動で拡張・再配置される'
          ]
        },
        paradigmShiftNotes: 'C言語では「メモリの確保と解放をプログラマが手作業で管理」しなければならず、ヒューマンエラーが不可避でした。C++では「オブジェクトのスコープやコンテナの寿命と、メモリの生存期間を完全に同期させる」ことで、メモリリークを設計レベルで撲滅します。'
      }
    },
    {
      id: 'sec3-memory-architecture',
      title: '3.2 メモリの可視化：スタックとヒープにおけるオブジェクトの命の環',
      leadText: '「型（クラス）」はたい焼きの金型に過ぎません。プログラム実行中、メモリ上に「実体（インスタンス）」がどうクローンされ、いつ生まれてどう消えるのかを図解します。',
      memoryMap: {
        title: 'スタック（Stack）とヒープ（Heap）のメモリ配置マップ',
        description: 'Gameクラスがスタック領域に存在し、内部の std::vector<Particle> がヒープ領域の連続した動的メモリブロックを管理しています。',
        asciiArt: `[ STACK: スタック領域 ]                            [ HEAP: ヒープ領域 (動的配列) ]
+------------------------------------+
| main() フレーム                    |
|  +-- Game game                     |
|      +-- Player m_player           |
|      |    +-- int m_x, m_y         |
|      +-- std::vector<Particle>     |
|          +-- Particle* _data ------+----------> +-----------------------------+
|          +-- size_t    _size (10)  |            | Particle[0] : (x,y,vx,vy)   |
|          +-- size_t    _cap  (16)  |            | Particle[1] : (x,y,vx,vy)   |
+------------------------------------+            | Particle[2] : (x,y,vx,vy)   |
                                                  | ...                         |
                                                  | Particle[9] : (x,y,vx,vy)   |
                                                  +-----------------------------+
                                                   ^
                                                   |-- 敵撃破時に push_back で誕生
                                                   |-- 寿命尽きると erase で解放！`,
        stackItems: [
          {
            address: '0x7ffd0000',
            variable: 'Game game',
            value: 'インスタンス実体',
            notes: 'main関数が始まるとスタック上に自動配置され、mainが終わると自動で破棄される。'
          },
          {
            address: '0x7ffd0020',
            variable: 'm_particles (vectorヘッダ)',
            value: 'ポインタ + サイズ + 容量',
            notes: 'vector自体はスタック上にわずか24バイト（ポインタ3本分）しか占有しない。'
          }
        ],
        heapItems: [
          {
            address: '0x00a12000',
            object: 'Particle[0]〜[9]',
            state: '生存中 (lifetime: 4〜8)',
            lifecycle: '【誕生】push_back() によりヒープ上に直接コンストラクトされた実体群。'
          },
          {
            address: '0x00a120c0',
            object: 'Particle[x] (lifetime=0)',
            state: '消滅対象 (Dead)',
            lifecycle: '【消滅】erase() によりデストラクタが起動し、安全にメモリが切り詰められる。'
          }
        ],
        lifecycleExplanation: 'クラス（設計図）から、push_back() を呼んだ瞬間にヒープ領域上にオブジェクトの実体がクローン生成されます。各オブジェクトは自分だけの x, y, vx, vy, lifetime を持ち、個別に活動します。lifetime <= 0 になったオブジェクトは erase-remove イディオムで vector から除外され、その瞬間にメモリが返却されます。'
      }
    },
    {
      id: 'sec3-classes-detail',
      title: '3.3 新設クラスの設計：Particle と Game の内部構造',
      variables: [
        {
          name: 'Particle::m_x, m_y',
          type: 'private float',
          scope: 'Particleクラス内部',
          description: '火花粒子の現在座標。斜め方向へ滑らかに飛散させるため、整数ではなく浮動小数点数（float）を採用。',
          cComparison: '整数座標だと 45度など斜めの速度（0.707ピクセル）を表現できずカクカクする。floatで微小移動を蓄積する。'
        },
        {
          name: 'Particle::m_vx, m_vy',
          type: 'private float',
          scope: 'Particleクラス内部',
          description: '1フレームあたりの移動速度ベクトル。三角関数（cos, sin）によって360度ランダムに射出される。',
          cComparison: 'C言語の物理シミュレーションと同じ幾何ベクトル計算。'
        },
        {
          name: 'Particle::m_lifetime',
          type: 'private int',
          scope: 'Particleクラス内部',
          description: '【最重要】オブジェクトの残り寿命（フレーム数）。毎フレーム-1され、0以下で寿命死する。',
          cComparison: 'C言語のフラグ管理と違い、オブジェクト自身が「自分の寿命」を知っており、isDead() で外部に通知する。'
        },
        {
          name: 'Particle::m_glyph',
          type: 'private char',
          scope: 'Particleクラス内部',
          description: '描画文字（*、+、.、x、# などランダム）。'
        },
        {
          name: 'Game::m_particles',
          type: 'std::vector<Particle>',
          scope: 'Gameクラス内部',
          description: '現在飛んでいる全火花オブジェクトを保持する動的リスト。',
          cComparison: '固定長配列 Particle particles[100] の上位互換。要素数に応じて自動伸長する。'
        },
        {
          name: 'Game::m_bullets',
          type: 'std::vector<Bullet>',
          scope: 'Gameクラス内部',
          description: '弾の動的リスト。第2章の固定1発から、画面内最大3発までの連射が可能に進化！',
          cComparison: 'vectorを活用することで、第1章で悩んだ「連射対応」がわずか数行で実現。'
        }
      ]
    },
    {
      id: 'sec3-code',
      title: '3.4 第3章の教材コード：動的生成と寿命管理の完全実装',
      leadText: '弾が敵に当たった瞬間に火花が咲き誇り、寿命が尽きると安全にメモリから消え去る、オブジェクト指向の完成形コードです。',
      codeFiles: [
        {
          filename: 'Particle.h',
          language: 'cpp',
          description: '爆発の火花1粒を表すParticleクラスの宣言',
          code: `#pragma once
#include "Common.h"

class Particle {
private:
    float m_x;
    float m_y;
    float m_vx;     // X方向速度
    float m_vy;     // Y方向速度
    int m_lifetime; // 残り寿命（フレーム数）
    char m_glyph;   // 表示文字 ('*', '+', '.')

public:
    Particle(float x, float y, float vx, float vy, int lifetime, char glyph);

    // 毎フレーム座標を動かし、寿命を減らす
    void update();

    // 寿命が尽きたか（消滅判定）
    bool isDead() const { return m_lifetime <= 0; }

    int getX() const { return (int)m_x; }
    int getY() const { return (int)m_y; }
    char getGlyph() const { return m_glyph; }
};
`
        },
        {
          filename: 'Particle.cpp',
          language: 'cpp',
          description: '火花の移動と寿命減衰の実装',
          code: `#include "Particle.h"

Particle::Particle(float x, float y, float vx, float vy, int lifetime, char glyph)
    : m_x(x), m_y(y), m_vx(vx), m_vy(vy), m_lifetime(lifetime), m_glyph(glyph) {}

void Particle::update() {
    m_x += m_vx;
    m_y += m_vy;
    m_lifetime--; // 1フレームごとに寿命を消費（老化プロセス）
}
`
        },
        {
          filename: 'Game.h',
          language: 'cpp',
          description: '全オブジェクトの生成と寿命管理を一元統括するGameクラス',
          code: `#pragma once
#include <vector>
#include "Common.h"
#include "Player.h"
#include "Invader.h"
#include "Bullet.h"
#include "Particle.h"

class Game {
private:
    Player m_player;
    std::vector<Bullet> m_bullets;       // 動的な弾リスト（連射対応）
    std::vector<Invader> m_invaders;     // 動的な敵リスト
    std::vector<Particle> m_particles;   // 動的な火花パーティクルリスト！

    int m_score;
    int m_invaderDir;
    int m_invaderMoveTimer;
    bool m_isRunning;
    bool m_gameClear;

    // 爆発火花をヒープ上に動的生成するファクトリメソッド
    void spawnExplosion(int x, int y);
    void processInput();
    void update();
    void render();

public:
    Game();
    void run(); // ゲーム全体の起動窓口
};
`
        },
        {
          filename: 'Game.cpp',
          language: 'cpp',
          description: '寿命管理の心臓部（erase-removeイディオム）を含む実装',
          code: `#include "Game.h"
#include <iostream>
#include <algorithm>
#include <cmath>
#include <windows.h>
#include <conio.h>

void setCursorPosition(int x, int y) {
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

Game::Game() 
    : m_player(SCREEN_WIDTH / 2 - 1, SCREEN_HEIGHT - 2),
      m_score(0), m_invaderDir(1), m_invaderMoveTimer(0),
      m_isRunning(true), m_gameClear(false) {
    
    // 敵を動的に配置
    for (int col = 0; col < 6; col++) {
        m_invaders.push_back(Invader(4 + col * 4, 2));
    }
}

// =============================================================
// 【動的生成フェーズ】弾が命中した瞬間、10個の火花実体を生み出す
// =============================================================
void Game::spawnExplosion(int x, int y) {
    const char glyphs[] = { '*', '+', '.', 'x', '#' };
    for (int i = 0; i < 10; i++) {
        // 360度放射状のベクトルを計算
        float angle = (float)(i * (3.1415926 * 2.0 / 10.0));
        float speed = 0.5f + (float)(rand() % 5) * 0.1f;
        float vx = std::cos(angle) * speed * 1.5f;
        float vy = std::sin(angle) * speed * 0.8f;
        int life = 4 + rand() % 5; // 4〜8フレームの寿命
        char g = glyphs[rand() % 5];

        // vectorのメモリ上に直接Particleインスタンスを追加（生成）
        m_particles.push_back(Particle((float)x, (float)y, vx, vy, life, g));
    }
}

void Game::processInput() {
    if (_kbhit()) {
        char key = _getch();
        if (key == 'a' || key == 'A') m_player.moveLeft();
        if (key == 'd' || key == 'D') m_player.moveRight();
        if (key == ' ') {
            // 連射制限：画面内に最大3発まで動的追加
            if (m_bullets.size() < 3) {
                m_bullets.push_back(Bullet(m_player.getX() + 1, m_player.getY() - 1));
            }
        }
        if (key == 'q' || key == 'Q') m_isRunning = false;
    }
}

// 【C++03 述語関数】erase-remove で使用する消去条件の判定関数
static bool isParticleDead(const Particle& p) { return p.isDead(); }
static bool isBulletInactive(const Bullet& b) { return !b.isActive(); }
static bool isInvaderDead(const Invader& inv) { return !inv.isAlive(); }

void Game::update() {
    // 1. 弾の更新
    for (size_t i = 0; i < m_bullets.size(); ++i) {
        m_bullets[i].update();
    }

    // 2. 敵の更新（タイマー制御）
    m_invaderMoveTimer++;
    if (m_invaderMoveTimer >= 5) {
        m_invaderMoveTimer = 0;
        bool hitWall = false;
        for (size_t i = 0; i < m_invaders.size(); ++i) {
            if ((m_invaderDir == 1 && m_invaders[i].getX() >= SCREEN_WIDTH - 2) ||
                (m_invaderDir == -1 && m_invaders[i].getX() <= 1)) {
                hitWall = true;
                break;
            }
        }
        if (hitWall) {
            m_invaderDir = -m_invaderDir;
            for (size_t i = 0; i < m_invaders.size(); ++i) {
                m_invaders[i].move(0, 1);
                if (m_invaders[i].getY() >= m_player.getY()) {
                    m_isRunning = false;
                }
            }
        } else {
            for (size_t i = 0; i < m_invaders.size(); ++i) {
                m_invaders[i].move(m_invaderDir, 0);
            }
        }
    }

    // 3. 当たり判定（Bullet vs Invader）
    for (size_t b = 0; b < m_bullets.size(); ++b) {
        if (!m_bullets[b].isActive()) continue;
        for (size_t inv = 0; inv < m_invaders.size(); ++inv) {
            if (m_invaders[inv].isAlive() && m_bullets[b].getX() == m_invaders[inv].getX() && m_bullets[b].getY() == m_invaders[inv].getY()) {
                m_invaders[inv].destroy();
                m_bullets[b].deactivate();
                m_score += 100;
                // ド派手な爆発火花を大量動的生成！
                spawnExplosion(m_invaders[inv].getX(), m_invaders[inv].getY());
                break;
            }
        }
    }

    // 4. パーティクルの更新（物理移動と寿命減算）
    for (size_t p = 0; p < m_particles.size(); ++p) {
        m_particles[p].update();
    }

    // =========================================================
    // 【最重要：寿命管理と自動消滅フェーズ】
    // C++標準イディオム「erase-remove」により、死んだ実体を完全解放！
    // =========================================================
    // 寿命が尽きた火花粒子を消去
    m_particles.erase(
        std::remove_if(m_particles.begin(), m_particles.end(), isParticleDead),
        m_particles.end()
    );

    // 画面外に出た弾を消去
    m_bullets.erase(
        std::remove_if(m_bullets.begin(), m_bullets.end(), isBulletInactive),
        m_bullets.end()
    );

    // 撃破された敵を消去
    m_invaders.erase(
        std::remove_if(m_invaders.begin(), m_invaders.end(), isInvaderDead),
        m_invaders.end()
    );

    if (m_invaders.empty()) {
        m_gameClear = true;
        m_isRunning = false;
    }
}

void Game::render() {
    char buffer[SCREEN_HEIGHT][SCREEN_WIDTH];
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            buffer[y][x] = (y == 0 || y == SCREEN_HEIGHT - 1 || x == 0 || x == SCREEN_WIDTH - 1) ? '#' : ' ';
        }
    }

    // 自機
    buffer[m_player.getY()][m_player.getX()] = '_';
    buffer[m_player.getY()][m_player.getX() + 1] = 'A';
    buffer[m_player.getY()][m_player.getX() + 2] = '_';

    // 弾
    for (size_t i = 0; i < m_bullets.size(); ++i) {
        if (m_bullets[i].getY() > 0 && m_bullets[i].getY() < SCREEN_HEIGHT - 1) {
            buffer[m_bullets[i].getY()][m_bullets[i].getX()] = '|';
        }
    }

    // 敵
    for (size_t i = 0; i < m_invaders.size(); ++i) {
        buffer[m_invaders[i].getY()][m_invaders[i].getX()] = 'V';
    }

    // 火花パーティクル（最前面に美しく散乱！）
    for (size_t i = 0; i < m_particles.size(); ++i) {
        int px = m_particles[i].getX();
        int py = m_particles[i].getY();
        if (px > 0 && px < SCREEN_WIDTH - 1 && py > 0 && py < SCREEN_HEIGHT - 1) {
            buffer[py][px] = m_particles[i].getGlyph();
        }
    }

    setCursorPosition(0, 0);
    for (int y = 0; y < SCREEN_HEIGHT; y++) {
        for (int x = 0; x < SCREEN_WIDTH; x++) {
            std::cout << buffer[y][x];
        }
        std::cout << "\\n";
    }
    std::cout << "SCORE: " << m_score 
              << " | PARTICLES: " << m_particles.size() 
              << " | BULLETS: " << m_bullets.size() << "    \\n";
}

void Game::run() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    while (m_isRunning) {
        processInput();
        update();
        render();
        Sleep(33);
    }

    setCursorPosition(0, SCREEN_HEIGHT + 2);
    if (m_gameClear) {
        std::cout << "=========================================\\n";
        std::cout << " ★★★ VICTORY! ALL INVADERS DESTROYED! ★★★\\n";
        std::cout << "=========================================\\n";
    } else {
        std::cout << "=========================================\\n";
        std::cout << "               GAME OVER                 \\n";
        std::cout << "=========================================\\n";
    }
}
`
        },
        {
          filename: 'main.cpp',
          language: 'cpp',
          isMain: true,
          description: '究極の洗練！main関数はわずか3行のエントリーポイントへ',
          code: `#include "Game.h"

// -------------------------------------------------------------
// 【第3章：オブジェクト指向の到達点】
// main関数は「ゲームを開始する」という1つの責任のみを持つ。
// ゲームループすら Game クラスの中に美しくカプセル化された。
// -------------------------------------------------------------
int main() {
    Game game;
    game.run();
    return 0;
}
`
        }
      ]
    },
    {
      id: 'sec3-lifecycle-steps',
      title: '3.5 オブジェクトの「命の環（ライフサイクル）」3段階プロセス',
      leadText: 'オブジェクトが生まれてから死ぬまでのメモリ上の流れを、プログラミングの意図と結びつけて解説します。',
      processSteps: [
        {
          stepNumber: 1,
          title: '【誕生】コンストラクタによる命の吹き込み（動的生成）',
          codeSnippet: 'm_particles.push_back(Particle((float)x, (float)y, vx, vy, life, g));',
          description: '敵が撃破された瞬間、360度ランダムな角度と速度を持つ10個の Particle インスタンスがヒープ上に直接構築されます。C言語の malloc のような「確保してから手作業で初期化」ではなく、コンストラクタによって「生まれた瞬間に完全な状態」になることが保証されます。',
          impact: '画面上に一気に10個の火花オブジェクトが乱れ飛ぶ！',
          designIntent: '「未初期化オブジェクト」の存在を許さないコンストラクタの安全性'
        },
        {
          stepNumber: 2,
          title: '【活動と老化】自律的更新と寿命のカウントダウン',
          codeSnippet: 'void Particle::update() { m_x += m_vx; m_y += m_vy; m_lifetime--; }',
          description: '毎フレーム、自身の速度ベクトルに基づいて座標を更新すると同時に、寿命カウンター m_lifetime を 1 ずつ減算します。オブジェクト自身が「自分の老い」を管理します。',
          impact: '火花が放射状に飛び散りながら自然に減衰していく',
          designIntent: '寿命管理のロジックを外部のGameではなくParticle自身に持たせる責任分担'
        },
        {
          stepNumber: 3,
          title: '【消滅】erase-remove とデストラクタによる完全自動解放',
          codeSnippet: 'm_particles.erase(std::remove_if(m_particles.begin(), m_particles.end(), isParticleDead), m_particles.end());',
          description: 'm_lifetime <= 0 になった粒子は、erase によって vector のバッファから安全に除去されます。この瞬間、各 Particle のデストラクタが自動起動し、メモリが1バイトの漏れもなく綺麗に解放されます。手動の free() は一切不要です。',
          impact: 'メモリリークゼロ。何千個火花を散らしてもPCのメモリを圧迫しない！',
          designIntent: 'RAII原則に基づく「オブジェクトの消滅＝リソースの自動返却」の実現'
        }
      ],
      dialogueBefore: [
        {
          id: 'd3-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'すごーーいっ！！敵を倒した瞬間に星くずが四方にパッと飛び散って、数フレーム後にフワッと消えていきました！\nしかも、あんなに怖かった free() のメモリ管理を1行も書いていないのに、メモリリークが一切起きないなんて魔法みたいです！',
        },
        {
          id: 'd3-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '魔法ではない、これがC++の真骨頂【RAII】じゃ！\nさらに main.cpp を見てみなさい。第1章であれほど巨大で醜かったコードが、たったの3行（Game game; game.run();）になっておる！\n入力も更新も寿命管理も、全てが美しいクラス構造の中に調和しておるのじゃ！',
        }
      ],
      takeaways: [
        {
          title: 'std::vector による動的メモリ管理',
          description: '固定長配列と違い、ゲーム実行中に必要な数だけ要素を追加（push_back）でき、サイズが自動で伸縮します。'
        },
        {
          title: 'RAII（リソース取得は初期化である）',
          description: 'コンストラクタで生成され、寿命が尽きるとデストラクタが自動起動して破棄されるため、手動 free() によるメモリリークを設計レベルで撲滅します。'
        },
        {
          title: 'Gameクラスによるゲームループの隠蔽',
          description: 'ゲームループすらクラスにカプセル化することで、main関数は「ゲームを開始する」という1つの責任のみを持つ美しい姿になりました。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q3-1',
      question: 'C言語の「malloc / free による動的配列管理」に対して、C++の「std::vector と RAII」がもたらす最大の利点はどれでしょう？',
      options: [
        'メモリを無限に使ってもOSが重くならないこと',
        'コンストラクタで安全に初期化され、コンテナから消去される際にデストラクタが自動起動するため、手作業の free() 忘れによるメモリリークや二重解放（double free）の事故を設計レベルで撲滅できること',
        'C言語のポインタ演算よりも計算が100倍速くなること',
        '画面のフレームレートが自動で60FPSに固定されること'
      ],
      correctIndex: 1,
      explanation: '正解です！RAII原則と std::vector を使うことで、リソース（メモリ）の寿命がオブジェクトの生存期間と完全に一体化します。これにより、C言語で最も過酷だった「手動メモリ解放の漏れや二重解放事故」からプログラマが完全に解放されます。'
    }
  ]
};
