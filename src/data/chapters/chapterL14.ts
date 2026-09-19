import { Chapter } from '../../types/curriculum';

export const chapterL14: Chapter = {
  id: 22,
  slug: 'chapter-classic-14-spatial-partitioning',
  courseTrack: 'classic',
  courseChapterCode: 'C14',
  title: 'レガシー第14章：空間分割と超高速衝突判定',
  subtitle: '均等グリッド・四分木（Quadtree）による O(N^2) → O(N log N) ブロードフェーズ枝刈り',
  badge: 'レガシーC++ L14：空間分割・衝突判定',
  gameVersion: 'v2_classes',
  description: '画面上に自機・敵機・弾・パーティクルが数百〜数千個飛び交う弾幕ゲームにおいて、すべての物体同士を総当たりで衝突判定すると、計算回数は物体の2乗（O(N^2)）で爆発し、1000個なら毎フレーム50万回、1万個なら5000万回という天文学的な計算量で即座にフレーム落ちします。本章では、プロのゲームエンジンが採用する衝突判定の2段階パイプライン【ブロードフェーズ（大まかな枝刈り）】と【ナローフェーズ（厳密判定）】を体系化。固定長メモリで爆速に動作する【均等グリッド（Spatial Hashing）】と、オブジェクト密度の濃淡に自己適応する【四分木（Quadtree）】のアルゴリズムをゼロからC++で実装します。',
  prevChapterSlug: 'chapter-classic-13-asset-manager',
  nextChapterSlug: 'chapter-classic-15-data-driven',
  sections: [
    {
      id: 'sec-l14-quadratic-explosion',
      title: 'L14.1 弾幕1000発でFPSが1に崩壊：全対全判定 O(N^2) の物理限界',
      leadText: 'なぜ二重ループの当たり判定は破綻するのか？計算量爆発のメカニズムを視覚化します。',
      dialogueBefore: [
        {
          id: 'dl14-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '先生！ボスの弾幕を1,000発、自機と敵を合わせて1,200個の物体を出した瞬間、60FPSだったゲームが突然 2FPS まで落ちて止まりそうになりました！'
        },
        {
          id: 'dl14-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！1,200個の物体同士を総当たり（二重ループ）で当たり判定しておるじゃろ？計算回数を数えてみたことはあるか？'
        },
        {
          id: 'dl14-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'ええと… for (int i = 0; i < N; ++i) for (int j = i + 1; j < N; ++j) だから… N * (N - 1) / 2 ですよね？ 1,200 × 1,199 / 2 ＝ 約72万回…！？'
        },
        {
          id: 'dl14-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'その通り！毎秒60フレームなら 72万 × 60 ＝ 毎秒4,300万回 の平方根や四則演算じゃ！画面の左上にいる自機の弾と、画面右下にいる敵など、絶対に当たるはずのないペアを毎フレーム何十万回も計算しておるのが原因じゃ！'
        }
      ],
      paradigmComparison: {
        title: '総当たり二重ループ vs 空間分割（均等グリッド）',
        cApproach: {
          title: '❌ 総当たり二重ループ判定（計算量 O(N^2) の破滅）',
          code: `// 全オブジェクトをペア総当たりで当たり判定
void checkCollisionsNaive(const std::vector<Entity>& entities) {
    int n = entities.size();
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            // ⚠️ 離れた場所にある物体同士も律儀に計算してしまう！
            if (checkIntersect(entities[i], entities[j])) {
                handleCollision(entities[i], entities[j]);
            }
        }
    }
}`,
          drawbacks: [
            'オブジェクト数が1,000個で約50万回、10,000個で約5,000万回の計算となり、CPUが即座に飽和する',
            '画面の反対側にいて絶対に衝突しないペアに対しても同一の計算コストを払ってしまう',
            'CPUのL1/L2キャッシュミスが多発し、メモリアクセス帯域を圧迫する'
          ]
        },
        cppApproach: {
          title: '⭕ 空間分割（均等グリッド / Quadtree）による枝刈り（O(N)〜O(N log N)）',
          code: `// 画面をグリッド（格子）に分割し、同一セル内の物体だけを判定
void checkCollisionsSpatial(SpatialGrid& grid, const std::vector<Entity>& entities) {
    grid.clear();
    for (size_t i = 0; i < entities.size(); ++i) {
        grid.insert(entities[i]); // O(1) でセルに登録
    }
    // 同じセル（および隣接セル）に入っているペアだけをテスト！
    grid.queryPotentialPairs([](Entity& a, Entity& b) {
        if (checkIntersect(a, b)) {
            handleCollision(a, b);
        }
    });
}`,
          benefits: [
            '遠く離れたオブジェクト同士の判定がO(1)で完全スキップされる',
            'オブジェクト数1,000個でも判定回数が数千回程度に激減（99%以上の無駄な計算を削減）',
            '空間的な局所性（Spatial Locality）が高まり、CPUキャッシュヒット率が劇的に向上する'
          ]
        },
        paradigmShiftNotes: '「計算を速くする」のではなく「最初から不要な計算をしない（枝刈り）」ことこそがアルゴリズム最適化の真髄です。'
      }
    },
    {
      id: 'sec-l14-two-phase-pipeline',
      title: 'L14.2 ブロードフェーズ（大雑把な枝刈り）とナローフェーズ（厳密判定）',
      leadText: '物理エンジンの世界標準である「2段階パイプライン」のアーキテクチャを理解します。',
      processSteps: [
        {
          stepNumber: 1,
          title: 'ブロードフェーズ（Broad-Phase）：大雑把な候補抽出',
          description: '空間分割（均等グリッドや四分木）と AABB（軸平行境界ボックス）を使い、「接触している可能性があるペア」だけを O(N log N) または O(N) で高速に絞り込みます。',
          impact: '数万ペアの候補をわずか数十〜数百ペアに絞り込む'
        },
        {
          stepNumber: 2,
          title: 'ナローフェーズ（Narrow-Phase）：厳密な幾何交差計算',
          description: 'ブロードフェーズを通過したごく少数のペアに対してのみ、多角形交差（SAT：分離軸判定）やピクセル単位の当たり判定、円同士の平方根判定などの精密計算を行います。',
          impact: '高コストな浮動小数点演算を最小限に抑え、ミリ秒単位で処理完了'
        }
      ]
    },
    {
      id: 'sec-l14-spatial-hashing',
      title: 'L14.3 実践編：均等グリッド（Spatial Hashing）の実装',
      leadText: '2次元平面をセルに区切り、ハッシュマップや固定配列でオブジェクトを高速分類する手法を学びます。',
      codeFiles: [
        {
          filename: 'SpatialGrid.cpp',
          language: 'cpp',
          description: '均等グリッドによるブロードフェーズ衝突枝刈り実装',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <map>

struct Entity {
    int id;
    float x, y;
    float radius;
};

class SpatialGrid {
private:
    float cellSize_;
    // セル座標のハッシュ値 -> そのセルに属するエンティティIDリスト
    std::map<int, std::vector<int> > grid_;

    int getCellHash(int cellX, int cellY) const {
        // 素数を用いた単純な2D空間ハッシュ関数
        return cellX * 73856093 ^ cellY * 19349663;
    }

public:
    SpatialGrid(float cellSize) : cellSize_(cellSize) {}

    void clear() {
        grid_.clear();
    }

    void insert(const Entity& e) {
        int cellX = static_cast<int>(e.x / cellSize_);
        int cellY = static_cast<int>(e.y / cellSize_);
        int hash = getCellHash(cellX, cellY);
        grid_[hash].push_back(e.id);
    }

    void findPotentialCollisions(const std::vector<Entity>& entities) {
        int checkCount = 0;
        int hitCount = 0;

        for (std::map<int, std::vector<int> >::iterator it = grid_.begin();
             it != grid_.end(); ++it) {
            const std::vector<int>& bucket = it->second;
            // 同じバケットに入っている物体同士だけを判定
            for (size_t i = 0; i < bucket.size(); ++i) {
                for (size_t j = i + 1; j < bucket.size(); ++j) {
                    checkCount++;
                    const Entity& a = entities[bucket[i]];
                    const Entity& b = entities[bucket[j]];
                    float dx = a.x - b.x;
                    float dy = a.y - b.y;
                    float distSq = dx * dx + dy * dy;
                    float radSum = a.radius + b.radius;
                    if (distSq <= radSum * radSum) {
                        hitCount++;
                        std::cout << "  💥 衝突検知: ID " << a.id << " <-> ID " << b.id << std::endl;
                    }
                }
            }
        }
        std::cout << "[Grid統計] 判定実行回数: " << checkCount << " 回 (衝突: " << hitCount << " 件)" << std::endl;
    }
};

int main() {
    std::cout << "=== 空間グリッド衝突判定テスト ===" << std::endl;
    std::vector<Entity> entities;
    // 遠く離れた場所と密集した場所にオブジェクトを配置
    Entity e1 = {0, 10.0f, 10.0f, 5.0f};
    Entity e2 = {1, 12.0f, 11.0f, 5.0f}; // e1 と衝突
    Entity e3 = {2, 500.0f, 500.0f, 5.0f}; // 遠く離れた位置
    Entity e4 = {3, 502.0f, 501.0f, 5.0f}; // e3 と衝突

    entities.push_back(e1);
    entities.push_back(e2);
    entities.push_back(e3);
    entities.push_back(e4);

    SpatialGrid grid(64.0f); // セルサイズ 64x64
    for (size_t i = 0; i < entities.size(); ++i) {
        grid.insert(entities[i]);
    }

    grid.findPotentialCollisions(entities);
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'O(N^2) からの脱却',
          description: '空間分割を行わずに当たり判定を回すのは、オブジェクト数が増えた瞬間に必ず破綻する。'
        },
        {
          title: '均等グリッドと四分木の使い分け',
          description: 'オブジェクトが画面全体に均一に散らばるなら均等グリッドが最速。特定の場所に密集するなら四分木（Quadtree）が適応的。'
        },
        {
          title: '境界跨ぎ問題への対策',
          description: 'セル境界をまたぐ大型オブジェクトは、接触する全セルに重複登録するか、境界線専用リストで管理する。'
        },
        {
          title: '動的メモリ確保の回避',
          description: '毎フレームのセル再構築で vector の new/delete が走らないよう、固定配列や事前に reserve したバッファを再利用する。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l14-1',
      question: '物理エンジンにおいて、衝突判定を「ブロードフェーズ」と「ナローフェーズ」の2段階に分ける最大の目的は何ですか？',
      options: [
        'オブジェクトのグラフィック描画とサウンド再生を分離するため',
        '接触する可能性がゼロのペアを大まかな空間判定で素早く除外し、高コストな精密判定の回数を激減させるため',
        '浮動小数点演算をすべて整数演算に置き換えるため',
        'マルチスレッドでの競合状態を完全に排除するため'
      ],
      correctIndex: 1,
      explanation: 'ブロードフェーズは計算量の軽いアルゴリズム（空間分割やAABB）で候補を絞り込み、ナローフェーズで本当に衝突しているかを精密に計算する2段階構成にすることで、全体のスループットを極大化します。'
    },
    {
      id: 'quiz-l14-2',
      question: '四分木（Quadtree）が均等グリッド（Spatial Grid）に対して優れている点はどれですか？',
      options: [
        '実装コードが極めて短く、ポインタを一切使わないこと',
        '空間内にオブジェクトの密度の濃淡（密集地帯と過疎地帯）が激しい場合でも、適応的に深さを変えて効率よく分割できること',
        'どのような場合でも必ず均等グリッドよりメモリ消費量が少なくなること',
        'C++03ではコンパイルできずC++20専用であること'
      ],
      correctIndex: 1,
      explanation: '均等グリッドはセルサイズが固定ですが、四分木はオブジェクトが密集している領域だけを細かく4分割し、過疎な場所は分割しないため、局所的な密集に強い耐性を持ちます。'
    },
    {
      id: 'quiz-l14-3',
      question: '空間分割グリッドにおいて、セル境界線をまたいで存在するオブジェクトを扱う際、最も注意すべきバグは何ですか？',
      options: [
        'セル境界をまたいだ瞬間、オブジェクトのHPが0にリセットされる',
        '複数のセルに重複登録された結果、同じペアの衝突判定が2回実行されて二重ダメージが入るバグ',
        'グリッドのセルサイズが毎フレーム2倍に膨張してしまう',
        'コンパイル時に未定義動作の警告が出る'
      ],
      correctIndex: 1,
      explanation: '境界跨ぎの物体がセルAとセルBの両方に登録された場合、同じ相手との判定がセルAでもセルBでも行われ、「1発の弾で2回被弾した」という二重ダメージバグが頻発します。判定済みペアIDのセットで重複除外を行う必要があります。'
    }
  ]
};
