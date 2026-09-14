import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';

export const BeforeAfterShowcase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'sideBySide' | 'stage1' | 'stage10'>('sideBySide');

  const stage1Code = `// ❌ 【Stage 1】 最初のコード: 全部入り神クラス GameManager
#include <iostream>
#include <vector>

class GameManager {
public:
    int playerX = 10, playerY = 15;
    int playerHp = 3;
    
    // 敵データも配列で直接持つ
    int enemyX[5] = {2, 4, 6, 8, 10};
    int enemyY[5] = {1, 1, 1, 1, 1};
    int enemyType[5] = {1, 1, 2, 1, 3}; // 1:ザコ, 2:装甲, 3:ボス
    bool enemyAlive[5] = {true, true, true, true, true};
    
    int score = 0;
    bool isPaused = false;
    bool isGameOver = false;

    void update() {
        if (isPaused || isGameOver) return;

        // キー入力処理
        // ...
        
        // 敵の移動と当たり判定（巨大 switch 文）
        for (int i = 0; i < 5; ++i) {
            if (!enemyAlive[i]) continue;
            
            // 敵の種類ごとに処理をベタ書き分岐
            if (enemyType[i] == 1) {
                enemyY[i] += 1; // ザコは直進
            } else if (enemyType[i] == 2) {
                enemyX[i] += (playerX > enemyX[i]) ? 1 : -1; // 追尾
            } else if (enemyType[i] == 3) {
                // ボスは弾を乱射...
            }
            
            // 当たり判定・自機被弾・スコア加算・音再生も全部ここで直書き！
            if (enemyX[i] == playerX && enemyY[i] == playerY) {
                playerHp--;
                // playSoundEffect("hit.wav"); // ハードウェア直接呼び出し
            }
        }
    }
    
    void render() {
        // 画面クリアからコンソール描画まで全部抱え込み！
    }
};`;

  const stage10Code = `// ✨ 【Stage 10】 最終コード: クリーンECS ＆ ゼロコストモダン設計
#include <memory>
#include <vector>
#include <variant>

// 1. 純粋なデータ（Component）
struct Position { float x, y; };
struct Velocity { float vx, vy; };
struct Health { int current, max; };
struct PlayerTag {};
struct EnemyTag { int scoreReward; };

// 2. 疎結合なシステム（System）: 単一責任・テスト容易
class MovementSystem {
public:
    static void update(Registry& reg, float dt) {
        // Position と Velocity を持つ全エンティティを一括ベクトル演算
        reg.view<Position, Velocity>().each([dt](auto& pos, const auto& vel) {
            pos.x += vel.vx * dt;
            pos.y += vel.vy * dt;
        });
    }
};

// 3. 開閉原則を満たす振る舞い（Behavior / Visitor）
class CombatSystem {
public:
    void handleCollision(Registry& reg, Entity bullet, Entity enemy, IEventBus& bus) {
        auto& hp = reg.get<Health>(enemy);
        hp.current -= 1;
        if (hp.current <= 0) {
            // Observer パターンで音響・スコアへ疎結合通知（直接依存ゼロ！）
            bus.publish(EnemyDefeatedEvent{ reg.get<EnemyTag>(enemy).scoreReward });
            reg.destroy(enemy); // RAII でメモリは100%自動回収
        }
    }
};

// 4. アプリケーション骨格: 状態遷移（State）とDI（依存性注入）
class GameApp {
    std::unique_ptr<IScene> currentScene_;
    std::shared_ptr<IAudioService> audio_; // モック差し替え可能なDI設計
public:
    void update(float dt) {
        currentScene_->update(dt);
    }
};`;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>THE ULTIMATE BEFORE & AFTER SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
            圧倒的進化を比較。「最初のコード」vs「10ステージ後のコード」
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            カリキュラムを完走したとき、あなたの手で生み出せるコードの劇的な変化をご覧ください。
            「動けばいい」泥臭い神クラスが、商用ゲームエンジン同等の堅牢・疎結合・高速なクリーンアーキテクチャへと脱皮します。
          </p>
        </div>

        {/* 表示モード切り替えタブ */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'sideBySide' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            並列比較
          </button>
          <button
            onClick={() => setViewMode('stage1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'stage1' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stage 1 (Before)
          </button>
          <button
            onClick={() => setViewMode('stage10')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'stage10' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stage 10 (After)
          </button>
        </div>
      </div>

      {/* 5大指標の対比テーブル */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">結合度 (Coupling)</span>
          <div className="text-xs font-bold text-rose-400 line-through">超密結合 (Spaghetti)</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>➔ 完全疎結合 (Decoupled)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">単一責任 (SRP)</span>
          <div className="text-xs font-bold text-rose-400 line-through">1クラスが10個の仕事</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>➔ 1クラス1責務に特化</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">開閉原則 (OCP)</span>
          <div className="text-xs font-bold text-rose-400 line-through">新敵追加で既存switch破壊</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>➔ 既存コード変更ゼロ拡張</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">メモリ安全性</span>
          <div className="text-xs font-bold text-rose-400 line-through">二重解放・リークのリスク</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>➔ RAIIでリーク率 0%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">テスト容易性</span>
          <div className="text-xs font-bold text-rose-400 line-through">手動キーボードプレイのみ</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>➔ GoogleTest自動検証</span>
          </div>
        </div>
      </div>

      {/* コード対比ビュー */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(viewMode === 'sideBySide' || viewMode === 'stage1') && (
          <div className={`rounded-3xl border border-rose-500/40 bg-slate-950 overflow-hidden shadow-2xl ${
            viewMode === 'stage1' ? 'lg:col-span-2' : ''
          }`}>
            <div className="px-5 py-3.5 bg-gradient-to-r from-rose-950/80 to-slate-900 border-b border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  1
                </span>
                <span className="font-bold font-mono text-sm text-rose-200">
                  Stage 1: 最初期コード（全部入り神クラス）
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/30">
                アンチパターンの温床
              </span>
            </div>
            <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{stage1Code}</code>
            </pre>
          </div>
        )}

        {(viewMode === 'sideBySide' || viewMode === 'stage10') && (
          <div className={`rounded-3xl border border-emerald-500/40 bg-slate-950 overflow-hidden shadow-2xl ${
            viewMode === 'stage10' ? 'lg:col-span-2' : ''
          }`}>
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950/80 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  10
                </span>
                <span className="font-bold font-mono text-sm text-emerald-200">
                  Stage 10: 最終完成形（ECS ＋ RAII ＋ クリーン設計）
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                商用レベルの堅牢性
              </span>
            </div>
            <pre className="p-5 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{stage10Code}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
