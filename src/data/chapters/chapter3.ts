import { Chapter } from '../../types/curriculum';

export const chapter3: Chapter = {
  id: 3,
  slug: 'chapter-3-dynamic-lifecycle',
  courseTrack: 'classic',
  courseChapterCode: 'C3',
  title: 'レガシー第3章：オブジェクトの動的生成と寿命管理（可変エフェクトとメモリ設計）',
  subtitle: 'ヒープ断片化を防ぐ「静的オブジェクトプール」の正解と、動的メモリ寿命管理の深淵',
  badge: 'レガシーC++ C3：静的プールと手動寿命管理',
  description: '敵の撃破エフェクト（Particle）を題材に、組込み・リアルタイムゲーム開発現場で動的メモリ（malloc/new）が忌避される理由と、ゼロ・アロケーションを実現する「静的オブジェクトプール設計（レガシーの正解）」を徹底解剖。さらに、メモリ制約のない汎用PC環境で使われる std::vector（参考資料）との対比を通じて、真のメモリ設計力を養います。',
  gameVersion: 'v3_dynamic',
  prevChapterSlug: 'chapter-2-classes-and-files',
  nextChapterSlug: 'chapter-4-inheritance-and-polymorphism',
  sections: [
    {
      id: 'sec3-malloc-vs-raii',
      title: '3.1 なぜ現場は動的メモリを恐れるのか？「静的プール（レガシーの正解）」vs「動的確保」',
      leadText: '組込み機器、車載ECU、航空宇宙、リアルタイムゲームエンジンなど、止まることが許されない現場では「動的メモリ確保（malloc/new）の実行時呼び出しは原則禁止」という鉄の掟が存在します。レガシー環境における真の正解とは何かを学びます。',
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
          text: 'ええっ！？でも可変個数のオブジェクトを作るとなると、毎フレーム `malloc` とかやるんですよね？\n僕、どこで `free()` を呼べばいいか分からなくなって、メモリリークでOSをクラッシュさせたり、二重解放で即死セグフォ食らったりしてトラウマなんですが……！',
          sideNote: '青ざめるペンギン生徒'
        },
        {
          id: 'd3-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'まさにそこが現場の分水嶺じゃ！実は航空宇宙、車載（MISRA規格）、格闘ゲーム等のリアルタイム制御の現場では、**『プログラム実行中の malloc / new の呼び出しは全面禁止』**とされることが多いのじゃ！\nなぜなら、メモリの断片化（Heap Fragmentation）で突然メモリ確保に失敗したり、OSヒープの内部ロックでフレーム落ちが発生するからじゃ！',
        },
        {
          id: 'd3-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ！？mallocもnewも使えないなら、どうやって火花を飛ばすんですか！？',
        },
        {
          id: 'd3-6',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそがレガシー現場の黄金律、**【静的オブジェクトプール（Static Object Pool）】**じゃ！\n最大出現数（例: 64個）の配列をあらかじめ静的領域に確保しておき、空いているスロットを使い回す。ヒープ確保ゼロ、断片化ゼロ、処理速度一定（O(1)）の究極の安定性を誇る設計じゃ！\nこの「レガシーの正解」を学んだ上で、汎用PC開発で使われるモダンな `std::vector`（参考資料）との違いを見ていくのじゃ！',
        }
      ],
      paradigmComparison: {
        title: 'メモリ管理の現場対比：場当たり的 malloc/free vs 静的オブジェクトプール（レガシーの正解）',
        cApproach: {
          title: 'アンチパターン：実行時毎フレームの動的確保（事故多発）',
          code: `// 危険な書き方：毎回の撃破時に malloc / free
void spawnExplosion(int x, int y) {
    Particle* p = (Particle*)malloc(sizeof(Particle) * 16);
    if (!p) return; // メモリ枯渇時のエラー処理が煩雑
    // ...
    // どこかで free(p) を忘れると長時間稼働でメモリリーク！
    // 連続確保・解放を繰り返すとヒープが虫食い（断片化）状態に！
}`,
          drawbacks: [
            'メモリ断片化（ヒープが虫食いになり、空きはあるのに確保不能になる）',
            '非決定的な実行時間：mallocの内部処理時間は一定ではなくフレーム落ちを誘発',
            'free忘れによるメモリリークや二重解放（double-free）の危険'
          ]
        },
        cppApproach: {
          title: 'レガシーの正解：静的オブジェクトプール（ゼロ・アロケーション）',
          code: `// 組込み・リアルタイムの黄金律：事前に上限数を静的確保
class ParticlePool {
    static const int MAX_PARTICLES = 64;
    Particle m_pool[MAX_PARTICLES]; // ヒープ不要・固定配列

public:
    void spawn(int x, int y, int vx, int vy) {
        for (int i = 0; i < MAX_PARTICLES; ++i) {
            if (!m_pool[i].isActive()) { // 未使用スロットを発見
                m_pool[i].activate(x, y, vx, vy);
                return; // O(1)定数時間で確保完了！
            }
        }
    }
};`,
          benefits: [
            'ヒープメモリ完全不使用：断片化リスクが物理的にゼロ（MISRA完全準拠）',
            '決定論的リアルタイム性能：常に予測可能な一定時間（O(1)）で動作',
            'メモリリークや二重解放の概念そのものが存在しない絶対的な安全性'
          ]
        },
        paradigmShiftNotes: '動的メモリを「悪魔」のように恐れて何も作れなくなる必要はありません。現場の制約（組込みやリアルタイム応答）があるなら「静的オブジェクトプール」を極めるのがプロの正解です。なお、メモリ制約やリアルタイム制約のないデスクトップ・サーバー開発では、要素数を自動伸縮させる「std::vector と RAII」が標準的な別解（参考資料）として広く利用されます。'
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
          cComparison: '【設計対比】組込み現場では「Particle m_pool[64]」の静的プール（レガシーの正解）が選ばれるのに対し、デスクトップ環境では要素数が自動伸縮する std::vector が活用されます。'
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
`,
          lineExplanations: [
            {
              line: 20,
              title: 'std::vector への動的追加（自動メモリ確保）',
              summary: '敵インスタンスを動的配列の末尾に追加。メモリが足りなければ vector が自動でヒープバッファを拡張してくれます。',
              tokens: [
                { token: 'm_invaders.push_back(...)', explanation: '末尾に要素を追加するメンバ関数' },
                { token: 'Invader(...)', explanation: '指定座標で一時生成された敵オブジェクト' }
              ],
              pitfall: 'C言語の固定長配列（Invader invaders[6]）と違い、ゲーム実行中にサイズを自由に変更できます。'
            },
            {
              line: 39,
              title: 'パーティクルの動的生成（派手な演出の創出）',
              summary: '敵が撃破された瞬間、計算された放射速度と寿命を持つ火花インスタンスをヒープ配列へ追加します。',
              tokens: [
                { token: 'm_particles.push_back(...)', explanation: '動的配列の末尾に火花を挿入' },
                { token: 'Particle(...)', explanation: '座標、速度ベクトル、寿命、表示文字を渡して構築' }
              ],
              pitfall: 'C言語の malloc だとサイズ拡張時に realloc やポインタ再配置の事故が多発しますが、vector なら1行で完全自動化されます。'
            },
            {
              line: 121,
              title: 'erase-remove イディオム（寿命を迎えた要素の一括消去）',
              summary: '寿命が尽きた火花粒子を一括で詰め、コンテナのサイズを物理的に縮小させます。C++の伝統的かつ強力な消去イディオムです。',
              tokens: [
                { token: 'm_particles.erase(...)', explanation: '不要になったイテレータ範囲の要素を物理削除し、デストラクタを呼ぶ' },
                { token: 'std::remove_if(...)', explanation: '消去条件（isParticleDead）に一致する要素を末尾へ追いやり、有効要素の終端イテレータを返す' },
                { token: 'm_particles.end()', explanation: '配列の末尾イテレータ' }
              ],
              pitfall: 'std::remove_if だけを呼んでもコンテナのサイズ（size()）は1つも減らず、末尾にゴミデータが残ります。必ず erase() と組み合わせて初めてメモリが解放されます！'
            }
          ]
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
          text: '魔法ではない、これがC++の真骨頂【RAII】じゃ！\nただし、現場のエンジニアとして忘れてはならんぞ。\n組込みマイコンや車載システムなど「動的メモリ確保（malloc/new）そのものが許されない環境」では、冒頭で学んだ【静的オブジェクトプール】こそが唯一無二の正解じゃ。\n一方で、メモリ制約のないPCやサーバー等で可変長データを扱うなら、この std::vector と RAII が極めて強力な武器になる。環境の制約に応じてこの2つを使い分けられることこそが、本物のプロの証なんじゃよ！',
        }
      ],
      takeaways: [
        {
          title: '【レガシーの正解】静的オブジェクトプール（Static Object Pool）',
          description: '組込み・車載（MISRA準拠）・リアルタイムゲームエンジン等において、動的ヒープ確保をゼロ化し、断片化リスク排除とO(1)定数時間アロケーションを保証する古典的王道設計。'
        },
        {
          title: '【参考資料：モダンC++】std::vector と RAII',
          description: 'メモリ制約の緩やかな汎用PC・サーバー環境において、要素数を自動伸縮させつつ、コンストラクタとデストラクタで手動 free() を完全撲滅する現代的設計。'
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
      question: '組込み機器やリアルタイムゲームエンジンにおいて、動的メモリ確保（malloc/new/std::vector）をあえて使わず「静的オブジェクトプール」が推奨される最大の理由は何でしょう？',
      options: [
        'C++コンパイラが壊れてしまうから',
        'メモリ断片化（Heap Fragmentation）による不意の確保失敗を防ぎ、常に一定の処理時間（O(1)確定性）で安全に再利用できるから',
        '静的配列にすると画面の解像度が2倍になるから',
        'プログラムのバイナリサイズが100MB小さくなるから'
      ],
      correctIndex: 1,
      explanation: '正解です！長期間連続稼働する組込みシステムやリアルタイム制御では、ヒープの確保・解放を繰り返すことでメモリが虫食い状態（断片化）になり、空き容量はあるのに確保に失敗する致命的なバグが起きます。事前に最大数を静的確保して使い回す「静的オブジェクトプール」は、この問題を根絶するレガシー環境の黄金律です。（※なお、メモリ制約のないPC環境では std::vector と RAII が標準的に使われます）'
    }
  ]
};
