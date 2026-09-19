import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Sparkles, Terminal, Gamepad2, Info, Sliders, Smartphone, Pause, Play, LogOut, X, Target, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getChapterEvolution } from '../../data/chapterEvolution';
import { audioManager } from '../../utils/audioManager';

interface GameEmulatorProps {
  version: 'v1_spaghetti' | 'v2_classes' | 'v3_dynamic' | 'v4_polymorphism' | 'v5_smart_pointers' | 'v6_patterns' | 'v7_ecs_final';
  chapterCode?: string;
  chapterTitle?: string;
  isModal?: boolean;
  onClose?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  glyph: string;
  color: string;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx?: number;
}

type EnemyType = 'normal' | 'shield' | 'ufo' | 'elite' | 'bomb' | 'boss';

interface Invader {
  id: number;
  x: number;
  y: number;
  alive: boolean;
  type: EnemyType;
  hp: number;
  maxHp: number;
  dir?: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: 'power' | 'bit';
}

interface BitDrone {
  id: number;
  angle: number;
}

type SceneState = 'title' | 'playing' | 'paused' | 'gameover' | 'gameclear';

const WIDTH = 30;
const HEIGHT = 15;

/**
 * 実機（自機）と敵機の矩形（バウンディングボックス AABB）衝突判定
 * 
 * 実機（自機）の座標範囲:
 * - 幅: 3セル ([pX, pX + 2])
 * - 高さ: 1セル (HEIGHT - 2 = 13行目)
 * - 左上: (pX, HEIGHT - 2)
 * - 右上: (pX + 2, HEIGHT - 2)
 * - 左下: (pX, HEIGHT - 2)
 * - 右下: (pX + 2, HEIGHT - 2)
 * 
 * 敵機の座標範囲:
 * - 行: Math.round(inv.y)
 * - 列: 通常/エリート/シールド/ボムは Math.round(inv.x) の1セル
 *       ボスは [Math.round(inv.x) - 1, Math.round(inv.x) + 1] の3セル
 * - 左下: (enemyLeft, enemyBottom)
 * - 右下: (enemyRight, enemyBottom)
 * 
 * 衝突条件（AABB交差判定）:
 * 1. Y方向: enemyBottom >= playerTop && enemyTop <= playerBottom
 *    (敵機が下から2段目(12行目)にいる間は enemyBottom = 12 < playerTop = 13 のため決して衝突しない)
 * 2. X方向: enemyRight >= playerLeft && enemyLeft <= playerRight
 */
const checkPlayerInvaderCollision = (inv: Invader, pX: number): boolean => {
  if (!inv.alive || inv.type === 'ufo') return false;

  // 実機（自機）のバウンディングボックス
  const playerTop = HEIGHT - 2;
  const playerBottom = HEIGHT - 2;
  const playerLeft = pX;
  const playerRight = pX + 2;

  // 敵機のバウンディングボックス（画面グリッド表示位置基準）
  const iy = Math.round(inv.y);
  const ix = Math.round(inv.x);
  const enemyTop = iy;
  const enemyBottom = iy;
  const enemyLeft = inv.type === 'boss' ? ix - 1 : ix;
  const enemyRight = inv.type === 'boss' ? ix + 1 : ix;

  // Y方向の重なり判定（敵機が自機の行に達しているか）
  const yOverlap = enemyBottom >= playerTop && enemyTop <= playerBottom;

  // X方向の重なり判定（実機の左端・右端と敵機の左端・右端の矩形交差）
  const xOverlap = enemyRight >= playerLeft && enemyLeft <= playerRight;

  return yOverlap && xOverlap;
};

export const GameEmulator: React.FC<GameEmulatorProps> = ({
  version,
  chapterCode,
  chapterTitle,
  isModal = false,
  onClose,
}) => {
  const [playerX, setPlayerX] = useState<number>(14);

  // Escキーでモーダルを閉じる
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [drones, setDrones] = useState<BitDrone[]>([]);
  const [hasTripleShot, setHasTripleShot] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [scene, setScene] = useState<SceneState>('title');
  const [achievementToast, setAchievementToast] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => audioManager.getIsMuted());

  useEffect(() => {
    return audioManager.subscribe(() => {
      setIsMuted(audioManager.getIsMuted());
    });
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    if (!nextMuted) {
      audioManager.play('powerup');
    }
  };

  // C++設計定数・インタラクティブ実験室（サンドボックス）状態
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [playerSpeed, setPlayerSpeed] = useState<number>(1);
  const [maxBullets, setMaxBullets] = useState<number>(() =>
    version === 'v1_spaghetti' || version === 'v2_classes' ? 1 : 3
  );
  const [enemySpeedMul, setEnemySpeedMul] = useState<number>(1.0);
  const [sandboxTripleShot, setSandboxTripleShot] = useState<boolean>(false);
  const [showVirtualPad, setShowVirtualPad] = useState<boolean>(true);
  const [showEvolutionDiff, setShowEvolutionDiff] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<'gui' | 'cui'>('gui');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Array<{ x: number; y: number; s: number; alpha: number }>>([]);

  const invaderDirRef = useRef<number>(1);
  const invaderTimerRef = useRef<number>(0);
  const ufoTimerRef = useRef<number>(0);
  const bossTimerRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const moveTimerRef = useRef<number | null>(null);

  const playerXRef = useRef<number>(playerX);
  playerXRef.current = playerX;
  const enemySpeedMulRef = useRef<number>(enemySpeedMul);
  enemySpeedMulRef.current = enemySpeedMul;

  // 移動タイマーの確実なクリーンアップ
  useEffect(() => {
    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
      }
    };
  }, []);

  // 実績トースト表示ヘルパー (Observer パターン)
  const triggerAchievement = useCallback((text: string) => {
    setAchievementToast(text);
    setTimeout(() => {
      setAchievementToast((prev) => (prev === text ? null : prev));
    }, 2800);
  }, []);

  // ゲームの初期化（全バージョン共通でタイトル/待機画面から開始）
  const initGame = useCallback(() => {
    setPlayerX(14);
    setBullets([]);
    setParticles([]);
    setScore(0);
    setScene('title');
    setAchievementToast(null);
    invaderDirRef.current = 1;
    invaderTimerRef.current = 0;
    ufoTimerRef.current = 0;
    bossTimerRef.current = 0;

    setItems([]);
    setDrones(
      version === 'v5_smart_pointers' || version === 'v6_patterns' || version === 'v7_ecs_final'
        ? [{ id: 1, angle: 0 }]
        : []
    );
    setHasTripleShot(version === 'v7_ecs_final');

    const initialInvaders: Invader[] = [];

    if (version === 'v7_ecs_final') {
      // 第7章：ECSコンポーネント合成（巨大ボス + エリート + ボム + 通常）
      initialInvaders.push({
        id: 100,
        x: 13,
        y: 2,
        alive: true,
        type: 'boss',
        hp: 12,
        maxHp: 12,
      });
      initialInvaders.push({ id: 101, x: 5, y: 4, alive: true, type: 'elite', hp: 3, maxHp: 3 });
      initialInvaders.push({ id: 102, x: 21, y: 4, alive: true, type: 'elite', hp: 3, maxHp: 3 });
      initialInvaders.push({ id: 103, x: 9, y: 5, alive: true, type: 'bomb', hp: 1, maxHp: 1 });
      initialInvaders.push({ id: 104, x: 17, y: 5, alive: true, type: 'bomb', hp: 1, maxHp: 1 });
    } else if (version === 'v6_patterns') {
      // 第6章：パターン版（エリート敵 1体 + シールド2体 + 通常3体）
      for (let i = 0; i < 6; i++) {
        let type: EnemyType = 'normal';
        let hp = 1;
        if (i === 1) { type = 'elite'; hp = 3; }
        else if (i === 2 || i === 3) { type = 'shield'; hp = 2; }
        initialInvaders.push({
          id: i,
          x: 4 + i * 4,
          y: 2,
          alive: true,
          type,
          hp,
          maxHp: hp,
        });
      }
    } else if (version === 'v4_polymorphism' || version === 'v5_smart_pointers') {
      // 第4・5章：多態性（通常敵4体 + シールド敵2体）
      for (let i = 0; i < 6; i++) {
        const isShield = i === 2 || i === 3;
        initialInvaders.push({
          id: i,
          x: 4 + i * 4,
          y: 2,
          alive: true,
          type: isShield ? 'shield' : 'normal',
          hp: isShield ? 2 : 1,
          maxHp: isShield ? 2 : 1,
        });
      }
    } else {
      // 第1〜3章：通常インベーダー6体
      for (let i = 0; i < 6; i++) {
        initialInvaders.push({
          id: i,
          x: 4 + i * 4,
          y: 2,
          alive: true,
          type: 'normal',
          hp: 1,
          maxHp: 1,
        });
      }
    }
    setInvaders(initialInvaders);
  }, [version]);

  useEffect(() => {
    initGame();
  }, [version, initGame]);

  // ゲームオーバー/クリア時の即時再プレイ開始
  const restartGame = useCallback(() => {
    initGame();
    setScene('playing');
  }, [initGame]);

  // 弾丸の発射処理
  const shoot = useCallback(() => {
    if (scene !== 'playing') return;

    setBullets((prev) => {
      // サンドボックスで設定された最大発射弾数制限
      if (prev.length >= maxBullets) return prev;

      audioManager.play('shoot');

      const baseId = Date.now();
      const isTriple = hasTripleShot || sandboxTripleShot || version === 'v7_ecs_final';

      if (isTriple) {
        // 3WAYレーザーショット
        const newBullets: Bullet[] = [
          { id: baseId + 1, x: playerX + 1, y: HEIGHT - 3, vx: 0 },
          { id: baseId + 2, x: playerX, y: HEIGHT - 3, vx: -0.25 },
          { id: baseId + 3, x: playerX + 2, y: HEIGHT - 3, vx: 0.25 },
        ];
        // ビットドローンからの援護ビーム
        drones.forEach((d, idx) => {
          const dx = playerX + 1 + Math.round(Math.cos(d.angle) * 3);
          const dy = HEIGHT - 2 + Math.round(Math.sin(d.angle) * 1.5);
          newBullets.push({ id: baseId + 10 + idx, x: dx, y: dy - 1, vx: 0 });
        });
        return [...prev, ...newBullets];
      }

      // 通常単発またはビット付き
      const newBullets: Bullet[] = [{ id: baseId + 1, x: playerX + 1, y: HEIGHT - 3, vx: 0 }];
      drones.forEach((d, idx) => {
        const dx = playerX + 1 + Math.round(Math.cos(d.angle) * 3);
        const dy = HEIGHT - 2 + Math.round(Math.sin(d.angle) * 1.5);
        newBullets.push({ id: baseId + 10 + idx, x: dx, y: dy - 1, vx: 0 });
      });
      return [...prev, ...newBullets];
    });
  }, [scene, playerX, version, hasTripleShot, sandboxTripleShot, drones, maxBullets]);

  // 移動処理（playerSpeedを反映 ＆ 敵との接触判定）
  const moveLeft = useCallback(() => {
    if (scene !== 'playing') return;
    setPlayerX((prev) => {
      const nextX = Math.max(1, prev - playerSpeed);
      // 移動先で敵機と実機（矩形）が衝突したか判定
      setInvaders((currInvs) => {
        const hit = currInvs.some((inv) => checkPlayerInvaderCollision(inv, nextX));
        if (hit) setScene('gameover');
        return currInvs;
      });
      return nextX;
    });
  }, [scene, playerSpeed]);

  const moveRight = useCallback(() => {
    if (scene !== 'playing') return;
    setPlayerX((prev) => {
      const nextX = Math.min(WIDTH - 4, prev + playerSpeed);
      // 移動先で敵機と実機（矩形）が衝突したか判定
      setInvaders((currInvs) => {
        const hit = currInvs.some((inv) => checkPlayerInvaderCollision(inv, nextX));
        if (hit) setScene('gameover');
        return currInvs;
      });
      return nextX;
    });
  }, [scene, playerSpeed]);

  // 長押し連続移動用ヘルパー
  const startMove = (direction: 'left' | 'right') => {
    if (direction === 'left') moveLeft();
    else moveRight();

    if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    moveTimerRef.current = window.setInterval(() => {
      if (direction === 'left') moveLeft();
      else moveRight();
    }, 110);
  };

  const stopMove = () => {
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
  };

  // ポーズ / 再開 / スタート切り替え
  const togglePause = useCallback(() => {
    if (scene === 'playing') setScene('paused');
    else if (scene === 'paused') setScene('playing');
    else if (scene === 'title') setScene('playing');
    else if (scene === 'gameover' || scene === 'gameclear') initGame();
  }, [scene, initGame]);

  // サンドボックスのパラメータ初期化
  const resetSandbox = () => {
    setPlayerSpeed(1);
    setMaxBullets(version === 'v1_spaghetti' || version === 'v2_classes' ? 1 : 3);
    setEnemySpeedMul(1.0);
    setSandboxTripleShot(false);
  };

  // キーボードイベントのハンドリング
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ページスクロール防止
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D', 'p', 'P', 'r', 'R', 'q', 'Q', 'Escape'].includes(e.key)) {
        if ([' ', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
      }

      // タイトル画面：SPACEキーでゲーム開始（State パターン）
      if (scene === 'title') {
        if (e.key === ' ' || e.key === 'Enter') {
          setScene('playing');
        }
        return;
      }

      // ポーズ切り替え（Pキー: State パターン）＆ 終了（QキーまたはEscapeでタイトルへ戻る）
      if (scene === 'paused') {
        if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
          initGame();
          return;
        }
      }
      if (e.key === 'p' || e.key === 'P') {
        if (scene === 'playing') {
          setScene('paused');
        } else if (scene === 'paused') {
          setScene('playing');
        }
        return;
      }

      // ゲームオーバー/クリア時の操作（Rキーでリトライ、QキーまたはEscapeでタイトルへ終了）
      if (scene === 'gameover' || scene === 'gameclear') {
        if (e.key === 'r' || e.key === 'R') {
          restartGame();
          return;
        }
        if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
          initGame();
          return;
        }
      }

      if (scene === 'playing') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          moveLeft();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          moveRight();
        } else if (e.key === ' ') {
          shoot();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, moveLeft, moveRight, shoot, restartGame, initGame]);

  // 爆発エフェクトの生成（第3章・第4章・第5章）
  const spawnExplosion = useCallback((x: number, y: number, isUfo: boolean = false) => {
    if (version === 'v1_spaghetti' || version === 'v2_classes') return;

    const glyphs = isUfo ? ['✦', '★', '*', '#', '✨'] : ['*', '+', '.', 'x', '#', '✦'];
    const colors = isUfo
      ? ['#facc15', '#f59e0b', '#38bdf8', '#fbbf24', '#ffffff']
      : ['#f59e0b', '#ef4444', '#38bdf8', '#fb7185', '#34d399'];
    const count = isUfo ? 20 : 14;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i * (Math.PI * 2)) / count + (Math.random() - 0.5) * 0.5;
      const speed = isUfo ? 0.6 + Math.random() * 0.9 : 0.4 + Math.random() * 0.7;
      newParticles.push({
        id: Math.random() * 1000000,
        x,
        y,
        vx: Math.cos(angle) * speed * 1.4,
        vy: Math.sin(angle) * speed * 0.8,
        life: isUfo ? 8 + Math.floor(Math.random() * 8) : 5 + Math.floor(Math.random() * 6),
        maxLife: isUfo ? 16 : 11,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, [version]);

  // ゲームループ（約30FPS）
  useEffect(() => {
    const updateGame = (time: number) => {
      if (time - lastTimeRef.current > 33) {
        lastTimeRef.current = time;

        if (scene === 'playing') {
          // 1. 弾の移動
          setBullets((prevBullets) =>
            prevBullets
              .map((b) => ({ ...b, x: b.x + (b.vx || 0), y: b.y - 1 }))
              .filter((b) => b.y >= 1 && b.x >= 1 && b.x <= WIDTH - 2)
          );

          // 2. パーティクルの移動と寿命管理（第3章以降）
          if (version !== 'v1_spaghetti' && version !== 'v2_classes') {
            setParticles((prev) =>
              prev
                .map((p) => ({
                  ...p,
                  x: p.x + p.vx,
                  y: p.y + p.vy,
                  life: p.life - 1,
                }))
                .filter((p) => p.life > 0)
            );
          }

          // 3. UFOの出現と移動（第4〜7章）
          if (version !== 'v1_spaghetti' && version !== 'v2_classes' && version !== 'v3_dynamic') {
            ufoTimerRef.current += 1;
            if (ufoTimerRef.current >= 140) {
              setInvaders((prev) => {
                const hasActiveUfo = prev.some((inv) => inv.type === 'ufo' && inv.alive);
                if (!hasActiveUfo) {
                  ufoTimerRef.current = 0;
                  return [
                    ...prev,
                    {
                      id: 999 + Math.random(),
                      x: 1,
                      y: 1,
                      alive: true,
                      type: 'ufo',
                      hp: 1,
                      maxHp: 1,
                    },
                  ];
                }
                return prev;
              });
            }

            // UFOの高速横移動
            setInvaders((prev) =>
              prev
                .map((inv) => {
                  if (inv.type === 'ufo' && inv.alive) {
                    const nextX = inv.x + 0.6;
                    if (nextX >= WIDTH - 2) {
                      return { ...inv, alive: false }; // 画面外離脱
                    }
                    return { ...inv, x: nextX };
                  }
                  return inv;
                })
                .filter((inv) => inv.type !== 'ufo' || inv.alive)
            );
          }

          // 4. ドローンの旋回アニメーション & アイテム落下（第5〜7章）
          if (version === 'v5_smart_pointers' || version === 'v6_patterns' || version === 'v7_ecs_final') {
            setDrones((prev) =>
              prev.map((d, i) => ({
                ...d,
                angle: d.angle + 0.08 + i * 0.02,
              }))
            );

            // アイテムの落下とプレイヤー接触判定
            setItems((prevItems) => {
              const remaining: Item[] = [];
              prevItems.forEach((item) => {
                // 第7章：マグネット回収コンポーネント（近くのアイテムをプレイヤーに吸引）
                let targetX = item.x;
                if (version === 'v7_ecs_final') {
                  if (Math.abs(item.x - (playerXRef.current + 1)) <= 5.0) {
                    targetX += (playerXRef.current + 1 > item.x ? 0.3 : -0.3);
                  }
                }
                const ny = item.y + 0.25;

                // プレイヤー接触判定
                if (Math.abs(targetX - (playerXRef.current + 1)) <= 1.8 && Math.abs(ny - (HEIGHT - 2)) <= 1.2) {
                  if (item.type === 'power') {
                    setHasTripleShot(true);
                    setScore((s) => s + 300);
                    triggerAchievement("⚡ 3WAY LASER UNLOCKED!");
                  } else if (item.type === 'bit') {
                    setDrones((d) => (d.length < 2 ? [...d, { id: Date.now(), angle: Math.PI }] : d));
                    setScore((s) => s + 200);
                    triggerAchievement("🛰️ BIT DRONE DEPLOYED!");
                  }
                  audioManager.play('powerup');
                  spawnExplosion(targetX, ny, true);
                } else if (ny < HEIGHT - 1) {
                  remaining.push({ ...item, x: targetX, y: ny });
                }
              });
              return remaining;
            });
          }

          // 5. 敵の移動タイマー（通常敵＆シールド敵＆エリート敵＆ボス）
          invaderTimerRef.current += 1 * enemySpeedMulRef.current;
          if (invaderTimerRef.current >= 6) {
            invaderTimerRef.current = 0;

            setInvaders((prevInvaders) => {
              let hitWall = false;
              for (const inv of prevInvaders) {
                if (!inv.alive || inv.type === 'ufo' || inv.type === 'boss') continue;
                if (
                  (invaderDirRef.current === 1 && inv.x >= WIDTH - 2) ||
                  (invaderDirRef.current === -1 && inv.x <= 1)
                ) {
                  hitWall = true;
                  break;
                }
              }

              let nextInvaders: Invader[];
              if (hitWall) {
                invaderDirRef.current = -invaderDirRef.current;
                nextInvaders = prevInvaders.map((inv) => {
                  if (inv.type === 'ufo' || inv.type === 'boss') return inv;
                  return { ...inv, y: inv.y + 1 };
                });
              } else {
                nextInvaders = prevInvaders.map((inv) => {
                  if (inv.type === 'ufo' || inv.type === 'boss') return inv;
                  // エリート敵は上下に少し揺れる
                  const deltaY = inv.type === 'elite' ? (Math.random() > 0.5 ? 0.2 : -0.2) : 0;
                  return {
                    ...inv,
                    x: inv.x + invaderDirRef.current,
                    y: Math.max(2, inv.y + deltaY),
                  };
                });
              }

              // 実機と敵機の矩形衝突判定（自機の左上・右上と敵機の左下・右下の位置関係比較）
              // または 最下端の防衛底壁（HEIGHT - 1）到達判定
              const px = playerXRef.current;
              let isGameOver = false;
              for (const inv of nextInvaders) {
                if (!inv.alive || inv.type === 'ufo') continue;

                // 1. 実機（自機）と敵機の矩形（バウンディングボックス）衝突判定
                if (checkPlayerInvaderCollision(inv, px)) {
                  isGameOver = true;
                  break;
                }

                // 2. 最下端（防衛底壁 HEIGHT - 1）への侵略到達判定
                if (Math.round(inv.y) >= HEIGHT - 1) {
                  isGameOver = true;
                  break;
                }
              }

              if (isGameOver) {
                setScene('gameover');
              }

              return nextInvaders;
            });
          }

          // 6. 当たり判定（Bullet vs Invader）
          setBullets((prevBullets) => {
            let nextBullets = [...prevBullets];

            setInvaders((prevInvaders) => {
              let updated = false;
              const nextInvaders = prevInvaders.map((inv) => {
                if (!inv.alive) return inv;

                // 弾と敵の接触判定
                const hitBulletIndex = nextBullets.findIndex(
                  (b) => Math.abs(b.x - inv.x) <= 1.4 && Math.abs(b.y - inv.y) <= 0.9
                );

                if (hitBulletIndex !== -1) {
                  updated = true;
                  nextBullets.splice(hitBulletIndex, 1);

                  // ボス敵の多段ヒット
                  if (inv.type === 'boss' && inv.hp > 1) {
                    setScore((s) => s + 80);
                    spawnExplosion(inv.x, inv.y, true);
                    audioManager.play('hit');
                    return { ...inv, hp: inv.hp - 1 };
                  }

                  // エリート敵の多段ヒット
                  if (inv.type === 'elite' && inv.hp > 1) {
                    setScore((s) => s + 60);
                    spawnExplosion(inv.x, inv.y, false);
                    audioManager.play('hit');
                    return { ...inv, hp: inv.hp - 1 };
                  }

                  // シールド敵の多段ヒット処理
                  if (inv.type === 'shield' && inv.hp > 1) {
                    setScore((s) => s + 50);
                    spawnExplosion(inv.x, inv.y, false);
                    audioManager.play('hit');
                    return { ...inv, hp: inv.hp - 1 };
                  }

                  // 撃破処理
                  let pts = 100;
                  if (inv.type === 'boss') {
                    pts = 1000;
                    triggerAchievement("🏆 BOSS DESTROYED! (ECS FINAL)");
                  } else if (inv.type === 'ufo') {
                    pts = 500;
                    triggerAchievement("🛸 SHARPSHOOTER (UFO DOWN)");
                  } else if (inv.type === 'elite') {
                    pts = 300;
                    triggerAchievement("⚡ ELITE CRUSHED!");
                  } else if (inv.type === 'bomb') {
                    pts = 200;
                    triggerAchievement("💥 CHAIN DETONATION!");
                  } else if (inv.type === 'shield') {
                    pts = 200;
                  }

                  setScore((s) => s + pts);
                  spawnExplosion(inv.x, inv.y, inv.type === 'ufo' || inv.type === 'boss');
                  audioManager.play('explosion');

                  // ドロップアイテム（第5〜7章）
                  if (version === 'v5_smart_pointers' || version === 'v6_patterns' || version === 'v7_ecs_final') {
                    if (inv.type === 'ufo' || inv.type === 'boss') {
                      setItems((it) => [...it, { id: Date.now(), x: inv.x, y: inv.y, type: 'power' }]);
                    } else if (inv.type === 'shield' || inv.type === 'elite') {
                      setItems((it) => [...it, { id: Date.now(), x: inv.x, y: inv.y, type: 'bit' }]);
                    }
                  }

                  return { ...inv, alive: false, hp: 0 };
                }
                return inv;
              });

              // クリア判定（全滅でクリア）
              const anyGroundAlive = nextInvaders.some((inv) => inv.type !== 'ufo' && inv.alive);
              const prevGroundAlive = prevInvaders.some((inv) => inv.type !== 'ufo' && inv.alive);
              if (!anyGroundAlive && prevGroundAlive) {
                setScene('gameclear');
                audioManager.play('clear');
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.5 },
                });
              }

              return updated ? nextInvaders : prevInvaders;
            });

            return nextBullets;
          });
        }
      }
      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [scene, version, spawnExplosion, triggerAchievement]);

  // 画面バッファの構築
  const renderScreen = () => {
    const grid: string[][] = Array(HEIGHT)
      .fill(null)
      .map(() => Array(WIDTH).fill(' '));

    // 壁
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (y === 0 || y === HEIGHT - 1 || x === 0 || x === WIDTH - 1) {
          grid[y][x] = '#';
        }
      }
    }

    // 自機 _A_
    const py = HEIGHT - 2;
    if (py >= 0 && py < HEIGHT) {
      if (playerX >= 0 && playerX < WIDTH) grid[py][playerX] = '_';
      if (playerX + 1 >= 0 && playerX + 1 < WIDTH) grid[py][playerX + 1] = 'A';
      if (playerX + 2 >= 0 && playerX + 2 < WIDTH) grid[py][playerX + 2] = '_';
    }

    // 弾 |
    bullets.forEach((b) => {
      const by = Math.round(b.y);
      const bx = Math.round(b.x);
      if (by >= 1 && by < HEIGHT - 1 && bx >= 1 && bx < WIDTH - 1) {
        grid[by][bx] = '|';
      }
    });

    // 敵（多態的グリフ表示）
    invaders.forEach((inv) => {
      if (inv.alive) {
        const iy = Math.round(inv.y);
        const ix = Math.round(inv.x);
        if (iy >= 1 && iy < HEIGHT - 1 && ix >= 1 && ix < WIDTH - 1) {
          if (inv.type === 'boss') {
            if (ix - 1 >= 1) grid[iy][ix - 1] = '[';
            grid[iy][ix] = 'B';
            if (ix + 1 < WIDTH - 1) grid[iy][ix + 1] = ']';
          } else if (inv.type === 'elite') {
            grid[iy][ix] = 'E';
          } else if (inv.type === 'bomb') {
            grid[iy][ix] = 'X';
          } else if (inv.type === 'ufo') {
            grid[iy][ix] = 'U';
          } else if (inv.type === 'shield') {
            grid[iy][ix] = inv.hp > 1 ? 'S' : 's';
          } else {
            grid[iy][ix] = 'V';
          }
        }
      }
    });

    // パーティクル（第3章以降全て）
    if (version !== 'v1_spaghetti' && version !== 'v2_classes') {
      particles.forEach((p) => {
        const py = Math.round(p.y);
        const px = Math.round(p.x);
        if (py >= 1 && py < HEIGHT - 1 && px >= 1 && px < WIDTH - 1) {
          grid[py][px] = p.glyph;
        }
      });
    }

    // 第5〜7章：ドローンとアイテムの描画
    if (version === 'v5_smart_pointers' || version === 'v6_patterns' || version === 'v7_ecs_final') {
      // 護衛ビットドローン（自機周りを旋回）
      drones.forEach((d) => {
        const dx = playerX + 1 + Math.round(Math.cos(d.angle) * 3);
        const dy = HEIGHT - 2 + Math.round(Math.sin(d.angle) * 1.5);
        if (dy >= 1 && dy < HEIGHT - 1 && dx >= 1 && dx < WIDTH - 1) {
          grid[dy][dx] = 'b';
        }
      });

      // 落下アイテムカプセル
      items.forEach((it) => {
        const iy = Math.round(it.y);
        const ix = Math.round(it.x);
        if (iy >= 1 && iy < HEIGHT - 1 && ix >= 1 && ix < WIDTH - 1) {
          grid[iy][ix] = it.type === 'power' ? 'P' : 'B';
        }
      });
    }

    return grid;
  };

  const grid = renderScreen();

  // 星空データの事前生成
  if (starsRef.current.length === 0) {
    for (let i = 0; i < 70; i++) {
      starsRef.current.push({
        x: Math.random() * 600,
        y: Math.random() * 300,
        s: Math.random() < 0.25 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
  }

  // HTML5 Canvas による2Dアーケードグラフィック（スプライト）描画
  const drawCanvasGame = useCallback((ctx: CanvasRenderingContext2D) => {
    // 1. 背景（ディープスペース星空 ＆ 底面防衛グリッド）
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 600, 300);

    // 星の瞬き描画
    ctx.fillStyle = '#ffffff';
    const now = Date.now();
    starsRef.current.forEach((st) => {
      ctx.globalAlpha = st.alpha * (0.6 + Math.sin(now / 400 + st.x) * 0.4);
      ctx.fillRect(st.x, st.y, st.s, st.s);
    });
    ctx.globalAlpha = 1.0;

    // 底面防衛ライン
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(600, 280);
    ctx.stroke();

    for (let x = 0; x <= 600; x += 40) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.beginPath();
      ctx.moveTo(x, 280);
      ctx.lineTo(x, 300);
      ctx.stroke();
    }

    // 2. 自機（プレイヤー戦闘機スプライト）
    const px = (playerX + 1.5) * 20;
    const py = 270;

    ctx.save();
    ctx.translate(px, py);

    // エンジン噴射炎（アニメーション）
    const flameH = 5 + Math.sin(now / 50) * 4;
    const flameGrad = ctx.createLinearGradient(0, 8, 0, 8 + flameH);
    flameGrad.addColorStop(0, '#38bdf8');
    flameGrad.addColorStop(0.5, '#0284c7');
    flameGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(0, 8 + flameH);
    ctx.lineTo(5, 8);
    ctx.closePath();
    ctx.fill();

    // 戦闘機ボディ
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -10); // 機首
    ctx.lineTo(18, 8);  // 右翼端
    ctx.lineTo(11, 6);  // 右内側
    ctx.lineTo(7, 8);   // 右エンジン
    ctx.lineTo(-7, 8);  // 左エンジン
    ctx.lineTo(-11, 6); // 左内側
    ctx.lineTo(-18, 8); // 左翼端
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 内側装甲
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, 5);
    ctx.lineTo(-7, 5);
    ctx.closePath();
    ctx.fill();

    // キャノピー（コックピットガラス）
    ctx.fillStyle = '#f0f9ff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(0, -2, 2.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 翼端レーザーキャノン
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-18, -2, 2, 8);
    ctx.fillRect(16, -2, 2, 8);
    ctx.restore();

    // 3. 護衛ビットドローン（周回衛星）
    drones.forEach((d) => {
      const dx = (playerX + 1.5 + Math.cos(d.angle) * 3.2) * 20;
      const dy = (13.5 + Math.sin(d.angle) * 1.5) * 20;
      ctx.save();
      ctx.translate(dx, dy);
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7.5, 3, now / 200, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // 4. 敵機（インベーダー各種スプライト）
    const walkStep = Math.floor(now / 350) % 2;

    invaders.forEach((inv) => {
      if (!inv.alive) return;
      const ix = (inv.x + 0.5) * 20;
      const iy = (inv.y + 0.5) * 20;

      ctx.save();
      ctx.translate(ix, iy);

      if (inv.type === 'boss') {
        // 巨大母艦ボス [B:HP12]
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#991b1b';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(26, 4);
        ctx.lineTo(24, -8);
        ctx.lineTo(8, -10);
        ctx.lineTo(0, -7);
        ctx.lineTo(-8, -10);
        ctx.lineTo(-24, -8);
        ctx.lineTo(-26, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-22, 4, 6, 8);
        ctx.fillRect(16, 4, 6, 8);
        ctx.fillRect(-5, 6, 10, 7);

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, -1, 4 + Math.sin(now / 120) * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // ボスHPバー
        const bW = 44;
        const bH = 4;
        const bX = -bW / 2;
        const bY = -18;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bX, bY, bW, bH);
        ctx.fillStyle = '#ef4444';
        const hpRatio = Math.max(0, inv.hp / inv.maxHp);
        ctx.fillRect(bX, bY, bW * hpRatio, bH);
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1;
        ctx.strokeRect(bX, bY, bW, bH);
      } else if (inv.type === 'ufo') {
        // 高速ボーナスUFO [U]
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -2, 6, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(0, 2, 13, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const ufoLights = ['#ef4444', '#38bdf8', '#34d399', '#facc15'];
        const lightOff = Math.floor(now / 100) % 4;
        for (let li = -2; li <= 2; li++) {
          ctx.fillStyle = ufoLights[(Math.abs(li) + lightOff) % ufoLights.length];
          ctx.beginPath();
          ctx.arc(li * 4.5, 2.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (inv.type === 'shield') {
        // 装甲シールド敵 [S:HP2]
        if (inv.hp > 1) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8 + Math.sin(now / 150) * 3;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * Math.PI) / 3;
            const sx = Math.cos(angle) * 11;
            const sy = Math.sin(angle) * 11;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 1.5);
          ctx.stroke();
        }

        ctx.fillStyle = '#059669';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(7, -2);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-7, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = inv.hp > 1 ? '#a7f3d0' : '#f87171';
        ctx.fillRect(-3.5, -2, 7, 2);
      } else if (inv.type === 'elite') {
        // 弾幕エリート [E]
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#7e22ce';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 7);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 + Math.sin(now / 100) * 1, 0, Math.PI * 2);
        ctx.fill();
      } else if (inv.type === 'bomb') {
        // 誘爆ボム (X)
        ctx.fillStyle = '#ea580c';
        for (let a = 0; a < 8; a++) {
          const angle = (a * Math.PI) / 4;
          ctx.fillRect(Math.cos(angle) * 7 - 1.5, Math.sin(angle) * 7 - 1.5, 3, 3);
        }
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
        ctx.fill();
        const isDangerBlink = Math.sin(now / 80) > 0;
        ctx.fillStyle = isDangerBlink ? '#ef4444' : '#fde047';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 通常インベーダー [V]
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#f87171';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.arc(0, -2, 6.5, Math.PI, 0);
        ctx.fill();

        ctx.fillRect(-6.5, -2, 13, 5);

        if (walkStep === 0) {
          ctx.fillRect(-8.5, 3, 2.5, 3.5);
          ctx.fillRect(6, 3, 2.5, 3.5);
          ctx.fillRect(-4.5, 3, 1.8, 4);
          ctx.fillRect(2.7, 3, 1.8, 4);
        } else {
          ctx.fillRect(-9, 1.5, 2.5, 4);
          ctx.fillRect(6.5, 1.5, 2.5, 4);
          ctx.fillRect(-2.5, 3, 1.8, 4);
          ctx.fillRect(0.7, 3, 1.8, 4);
        }

        ctx.fillRect(-5.5, -6.5, 1.8, 4.5);
        ctx.fillRect(3.7, -6.5, 1.8, 4.5);

        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 4;
        ctx.fillRect(-3.5, -1, 2.2, 2.2);
        ctx.fillRect(1.3, -1, 2.2, 2.2);
      }

      ctx.restore();
    });

    // 5. 弾丸（ネオンレーザーボルト）
    bullets.forEach((b) => {
      const bx = (b.x + 0.5) * 20;
      const by = (b.y + 0.5) * 20;
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      const grad = ctx.createLinearGradient(bx, by - 6, bx, by + 6);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(bx - 1.5, by - 6, 3, 12);
      ctx.restore();
    });

    // 6. ドロップアイテム
    items.forEach((it) => {
      const ix = (it.x + 0.5) * 20;
      const iy = (it.y + 0.5) * 20 + Math.sin(now / 150) * 2;
      ctx.save();
      ctx.translate(ix, iy);
      ctx.shadowColor = it.type === 'power' ? '#f59e0b' : '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillStyle = it.type === 'power' ? '#fbbf24' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(it.type === 'power' ? 'P' : 'B', 0, 0.5);
      ctx.restore();
    });

    // 7. 爆発パーティクル
    particles.forEach((p) => {
      const ppx = (p.x + 0.5) * 20;
      const ppy = (p.y + 0.5) * 20;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(ppx, ppy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, [playerX, invaders, bullets, items, drones, particles]);

  useEffect(() => {
    if (renderMode !== 'gui') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCanvasGame(ctx);
  });

  const getVersionBadge = () => {
    switch (version) {
      case 'v1_spaghetti':
        return {
          name: 'スパゲティコード版（C言語）',
          color: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
          desc: '1ファイル・固定ループ。白黒テキストでぎこちなく動作中。',
        };
      case 'v2_classes':
        return {
          name: 'クラス設計版（カプセル化）',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
          desc: 'Player/Invader/Bullet独立。安定した制御とカラーリング。',
        };
      case 'v3_dynamic':
        return {
          name: '動的パーティクル版（STL動的配列）',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
          desc: 'std::vector導入！撃破時に火花粒子が炸裂＆連射対応！',
        };
      case 'v4_polymorphism':
        return {
          name: 'ポリモーフィズム版（継承と仮想関数）',
          color: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
          desc: '基底クラスEnemyを継承！通常V、シールドS(HP2)、高速UFO(U)の多態的動作！',
        };
      case 'v5_smart_pointers':
        return {
          name: 'スマートポインタ版（RAIIと所有権）',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
          desc: '生new/delete撲滅！unique_ptrでアイテム落下＆shared_ptrで護衛ビット機が旋回援護！',
        };
      case 'v6_patterns':
        return {
          name: 'デザインパターン版（State & Observer）',
          color: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
          desc: 'StateパターンでTitle/Play/Pause画面遷移を制御＆Observerパターンで実績解除を疎結合通知！',
        };
      case 'v7_ecs_final':
        return {
          name: 'ECSアーキテクチャ版（コンポーネント指向）',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
          desc: '継承を超越したECS設計！Transform/Render/Shooter/Healthコンポーネント合成で巨大ボス[B]と弾幕エリート[E]を撃破せよ！',
        };
    }
  };

  const getTitleScreenInfo = () => {
    switch (version) {
      case 'v1_spaghetti':
        return {
          stage: '第1段階 / 構造化前夜',
          stageColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
          title: 'RETRO SPACE SHOOTER C (PROCEDURAL)',
          icon: '📜',
          features: [
            'C言語スタイル：単一ファイル・手続き型設計',
            '単発弾丸・白黒ASCIIコンソール描画',
            '固定配列とグローバル変数による状態管理',
          ],
          hint: 'ここからすべてが始まる！C++のクラス化による進化を体験しよう',
        };
      case 'v2_classes':
        return {
          stage: '第2段階 / クラス化・カプセル化',
          stageColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/60',
          title: 'RETRO SPACE SHOOTER OOP (CLASSES)',
          icon: '🛡️',
          features: [
            'C++クラス化：Player / Bullet / Invader を独立カプセル化',
            '座標・状態の隠蔽とRGBカラーコンソール出力',
            'ヘッダ・実装ファイルの分割コンパイル基盤',
          ],
          hint: 'オブジェクト指向によりコードが整理され、安定した挙動を実現！',
        };
      case 'v3_dynamic':
        return {
          stage: '第3段階 / 動的メモリ・パーティクル',
          stageColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
          title: 'RETRO SPACE SHOOTER DYNAMIC (STL)',
          icon: '✨',
          features: [
            'std::vector導入による弾丸・爆発の動的メモリ管理',
            '3連射バースト射撃システムのアンロック',
            'インベーダー撃破時に火花粒子が拡散する動的パーティクル',
          ],
          hint: '動的配列とRule of Three/RAIIによりメモリリークのない動的演出！',
        };
      case 'v4_polymorphism':
        return {
          stage: '第4段階 / 継承とポリモーフィズム',
          stageColor: 'text-purple-400 border-purple-500/40 bg-purple-950/60',
          title: 'RETRO SPACE SHOOTER POLYMORPHISM',
          icon: '🛸',
          features: [
            '基底Enemyクラスとvirtual関数による多態的ディスパッチ',
            '耐久力2のシールド敵 [S] ＆ 上空を高速通過するボーナスUFO [U]',
            '基底ポインタ経由の統一的Update/Draw呼び出し',
          ],
          hint: '継承と仮想関数で、コードを複製せず新しい敵タイプを拡張可能！',
        };
      case 'v5_smart_pointers':
        return {
          stage: '第5段階 / スマートポインタ・RAII',
          stageColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/60',
          title: 'RETRO SPACE SHOOTER MODERN RAII',
          icon: '🛰️',
          features: [
            'std::unique_ptrによる敵・アイテムの完全所有権管理（生delete撤滅）',
            'std::shared_ptrで自機周囲を旋回援護する護衛ビットドローン [o]',
            '敵撃破時のアイテムドロップ（P: 3WAYレーザー、B: ビット増設）',
          ],
          hint: 'モダンC++のRAII設計によりメモリリーク0バイトを完全保証！',
        };
      case 'v6_patterns':
        return {
          stage: '第6段階 / ゲームデザインパターン',
          stageColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
          title: 'RETRO SPACE SHOOTER PATTERNS',
          icon: '🎮',
          features: [
            'Stateパターンによるタイトル・プレイ・ポーズ・ゲームオーバー遷移',
            'Observerパターンによる実績解除（UFO撃破・クリア通知）の疎結合発火',
            '巨大if文分岐を排除したクリーンなゲームループ状態制御',
          ],
          hint: 'デザインパターンでUIとゲームロジックが美しく疎結合に分離！',
        };
      case 'v7_ecs_final':
        return {
          stage: '第7段階 / ECSアーキテクチャ完結編',
          stageColor: 'text-rose-400 border-rose-500/40 bg-rose-950/60',
          title: 'RETRO SPACE SHOOTER ECS FINAL',
          icon: '💥',
          features: [
            'Entity Component System（Transform/Render/Shooter/Health）合成',
            '深層多重継承を完全排除し、振る舞いを動的アセンブル',
            '巨大母艦ボス [B:HP12] ＆ 3WAY貫通レーザー ＆ 誘爆ボム (X)',
          ],
          hint: '商業AAAゲームエンジンが採用する最高峰の疎結合データ指向設計！',
        };
    }
  };

  const vInfo = getVersionBadge();
  const titleInfo = getTitleScreenInfo();
  const evolution = getChapterEvolution(chapterCode, version);
  const isFirstChapter = Boolean(
    evolution.isFirstChapter ||
    chapterCode === 'L1' ||
    chapterCode === 'C1' ||
    version === 'v1_spaghetti' ||
    evolution.previousChapter.includes('なし')
  );
  const activeUfo = invaders.find((inv) => inv.type === 'ufo' && inv.alive);

  const emulatorNode = (
    <div className={`rounded-2xl border border-cyan-500/30 bg-slate-950 shadow-2xl p-2.5 sm:p-4 relative overflow-hidden backdrop-blur-md ${
      isModal
        ? 'w-full max-w-5xl max-h-[94vh] flex flex-col border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-y-auto'
        : 'my-2 sm:my-3'
    }`}>
      {/* 背景の淡いグリッド */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* エミュレータ上部バー */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 sm:mb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <h3 className="font-mono text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 flex-wrap">
            <span>Webコンソール実行エミュレータ</span>
            <span className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full border font-sans font-semibold ${vInfo.color}`}>
              {vInfo.name}
            </span>
            {chapterCode && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-300 font-mono">
                {chapterCode} 収録
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* GUI画像 / CUI文字 レンダリング切替 */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700 shadow-sm mr-1">
            <button
              onClick={() => setRenderMode('gui')}
              className={`px-2 py-1 rounded-md text-xs font-mono font-bold transition flex items-center gap-1 ${
                renderMode === 'gui'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="2Dスプライト画像によるグラフィック描画（レトロアーケード）"
            >
              <span>🎨 GUI画像</span>
            </button>
            <button
              onClick={() => setRenderMode('cui')}
              className={`px-2 py-1 rounded-md text-xs font-mono font-bold transition flex items-center gap-1 ${
                renderMode === 'cui'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="C++コンソール出力（ASCII文字）描画"
            >
              <span>📟 CUI文字</span>
            </button>
          </div>

          {!isFirstChapter && (
            <button
              onClick={() => setShowEvolutionDiff((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border active:scale-95 shadow-sm ${
                showEvolutionDiff
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
              }`}
              title="前の章（前世代）とのゲーム機能・C++設計の進化差分を表示"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>前章からの変化</span>
            </button>
          )}

          <button
            onClick={() => setIsSandboxOpen((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border active:scale-95 shadow-sm ${
              isSandboxOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/30'
            }`}
            title="C++コードの定数（速度・連射数など）をリアルタイムに変更"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>C++定数実験室</span>
          </button>

          <button
            onClick={() => setShowVirtualPad((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border active:scale-95 shadow-sm ${
              showVirtualPad
                ? 'bg-slate-700 text-slate-100 border-slate-600'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="スマホ・タッチ用バーチャルパッドの表示切替"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">操作パッド</span>
          </button>

          <button
            onClick={handleToggleMute}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border active:scale-95 shadow-sm ${
              isMuted
                ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20'
            }`}
            title={isMuted ? 'サウンドをONにする（初期ミュート中）' : 'サウンドをミュート（消音）'}
            aria-label={isMuted ? '音声を有効化' : '音声をミュート'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">消音中</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">サウンドON</span>
              </>
            )}
          </button>

          <button
            onClick={initGame}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition border border-slate-700 active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>リセット</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-mono font-bold transition border border-rose-500/50 active:scale-95 shadow-sm ml-1"
              title="エミュレータを閉じる (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>閉じる (Esc)</span>
            </button>
          )}
        </div>
      </div>

      {/* 🔄 前章からの進化差分（Changelog）パネル */}
      {showEvolutionDiff && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border-2 border-amber-500/50 shadow-2xl space-y-3 font-mono text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>🔄 前の章（{evolution.previousChapter}）との違い・進化差分</span>
            </div>
            <button
              onClick={() => setShowEvolutionDiff(false)}
              className="text-xs text-slate-400 hover:text-white underline font-mono"
            >
              閉じる
            </button>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-sans font-bold leading-relaxed">
            ✨ {evolution.headline}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {evolution.diffItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5 border-b border-slate-800/80 pb-1">
                  <span>📌</span>
                  <span>{item.label}</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs text-rose-300/90 bg-rose-950/40 p-2 rounded-lg border border-rose-900/40">
                    <span className="font-bold text-rose-400 block text-[10px] mb-0.5">【前章での状態】</span>
                    <span className="leading-snug">{item.before}</span>
                  </div>
                  <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/40">
                    <span className="font-bold text-emerald-400 block text-[10px] mb-0.5">【本章での進化！】</span>
                    <span className="leading-snug font-semibold">{item.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-cyan-300 font-bold">💡 C++設計アーキテクチャの背景: </span>
              <span className="font-sans">{evolution.cppArchitecturePoint}</span>
            </div>
          </div>
        </div>
      )}

      {/* C++定数・インタラクティブ実験室（サンドボックス）パネル */}
      {isSandboxOpen && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border-2 border-cyan-500/50 shadow-2xl space-y-4 font-mono text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>⚙️ C++設計定数・インタラクティブ実験室（Sandbox）</span>
            </div>
            <button
              onClick={resetSandbox}
              className="text-xs text-slate-400 hover:text-white underline font-mono"
            >
              数値を初期値に戻す
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            スライダーを動かしてC++プログラムの定数（`constexpr`）を変更してみましょう。ブラウザ上で実行中のゲーム挙動が即座に変化します！
          </p>

          {/* スライダー＆トグルグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 自機スピード */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold">自機スピード</span>
                <span className="text-cyan-400 font-bold">{playerSpeed}マス/移動</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={playerSpeed}
                onChange={(e) => setPlayerSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">`constexpr int kPlayerSpeed`</span>
            </div>

            {/* 最大連射数 */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold">最大連射数 (RAII)</span>
                <span className="text-amber-400 font-bold">{maxBullets}発</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={maxBullets}
                onChange={(e) => setMaxBullets(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">`constexpr size_t kMaxBullets`</span>
            </div>

            {/* 敵行軍スピード倍率 */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold">敵行軍スピード</span>
                <span className="text-rose-400 font-bold">{enemySpeedMul.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={enemySpeedMul}
                onChange={(e) => setEnemySpeedMul(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">`constexpr float kEnemySpeedMul`</span>
            </div>

            {/* 3WAYショットトグル */}
            <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold">3WAY弾幕ショット</span>
              </div>
              <button
                onClick={() => setSandboxTripleShot((prev) => !prev)}
                className={`py-1.5 px-3 rounded-lg font-bold text-xs transition border ${
                  sandboxTripleShot || hasTripleShot
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {sandboxTripleShot || hasTripleShot ? '✨ 3WAY 有効化中' : '通常弾 (単発)'}
              </button>
              <span className="text-[10px] text-slate-400 font-mono block">`constexpr bool kEnableTripleShot`</span>
            </div>
          </div>

          {/* リアルタイムC++定数コードプレビュー */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="text-slate-400 block mb-1 font-sans">// 💡 リアルタイムに適用された C++ 設計定数:</span>
            <code className="block overflow-x-auto whitespace-pre">
              {`constexpr int kPlayerSpeed = ${playerSpeed}; // 1回あたりの横移動距離\nconstexpr size_t kMaxBullets = ${maxBullets}; // 同時に存在可能な弾の最大寿命\nconstexpr float kEnemySpeedMul = ${enemySpeedMul.toFixed(1)}f; // インベーダーの行軍周波数\nconstexpr bool kEnableTripleShot = ${sandboxTripleShot || hasTripleShot ? 'true' : 'false'}; // 3WAY弾幕コンポーネント`}
            </code>
          </div>
        </div>
      )}

      {/* 🔄 前章からの進化クイックバー ＆ バージョンガイダンス（L1以外の章のみ表示） */}
      {!isFirstChapter && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-2 font-mono flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] sm:text-[11px] flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>前章（{evolution.previousChapter}）からの変化</span>
            </span>
            <span className="truncate text-slate-200 font-sans text-xs">{evolution.headline}</span>
          </div>
          <button
            onClick={() => setShowEvolutionDiff((prev) => !prev)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline flex-shrink-0 font-bold ml-auto"
          >
            {showEvolutionDiff ? '差分を閉じる ▲' : '前章との違いを見る ▼'}
          </button>
        </div>
      )}

      {/* レトロCRT風コンソール画面 */}
      <div className={`relative rounded-xl border-2 border-slate-800 bg-[#040810] px-2 py-2 sm:px-4 sm:py-3 font-mono overflow-hidden shadow-2xl flex flex-col items-center select-none scanline w-full ${isModal ? 'min-h-[460px] sm:min-h-[520px]' : 'min-h-[350px] sm:min-h-[390px]'}`}>
        {/* CRTのグローエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent pointer-events-none" />

        {/* 実績解除トースト（Observer パターン） */}
        {achievementToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-3 py-1.5 rounded-xl font-mono font-black text-xs shadow-2xl border-2 border-white animate-bounce">
            <span>🏆 [OBSERVER EVENT]</span>
            <span>{achievementToast}</span>
          </div>
        )}

        {/* 画面表示：GUIキャンバス または CUIテキスト（スマホ幅で切れないようスケーリング ＆ スクロール対応） */}
        {renderMode === 'gui' ? (
          <div className="w-full flex justify-center items-center py-1 flex-1">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className={`w-full ${isModal ? 'max-w-4xl' : 'max-w-[640px]'} aspect-[2/1] rounded-lg shadow-2xl block border border-slate-800/80 bg-[#030712]`}
            />
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto flex justify-center py-1 flex-1">
            <div className={`${isModal ? 'text-xs sm:text-sm md:text-base lg:text-lg leading-[1.2]' : 'text-[10px] min-[360px]:text-[11px] min-[400px]:text-xs sm:text-sm md:text-[15px] lg:text-[16px] leading-[1.15]'} font-bold tracking-wider sm:tracking-widest text-center whitespace-pre font-mono`}>
              {grid.map((row, y) => (
                <div key={y} className="flex justify-center">
                  {row.map((ch, x) => {
                    let colorClass = 'text-slate-600';
                    if (ch === '#') colorClass = version === 'v1_spaghetti' ? 'text-slate-500' : 'text-cyan-900';
                    else if (ch === 'A' || ch === '_') colorClass = version === 'v1_spaghetti' ? 'text-slate-200' : 'text-cyan-400 text-glow-cyan';
                    else if (ch === '|') colorClass = version === 'v1_spaghetti' ? 'text-slate-300' : 'text-amber-400';
                    else if (ch === 'V') colorClass = version === 'v1_spaghetti' ? 'text-slate-400' : 'text-rose-400';
                    else if (ch === 'S') colorClass = 'text-emerald-300 font-black text-glow-green';
                    else if (ch === 's') colorClass = 'text-emerald-500 font-bold';
                    else if (ch === 'E') colorClass = 'text-purple-300 font-black text-glow-cyan animate-pulse';
                    else if (ch === 'X') colorClass = 'text-amber-400 font-black animate-pulse';
                    else if (ch === 'B' || ch === '[' || ch === ']') colorClass = 'text-rose-400 font-black text-glow-red animate-pulse';
                    else if (ch === 'U') colorClass = 'text-amber-300 font-black text-glow-yellow animate-pulse';
                    else if (ch === 'b') colorClass = 'text-cyan-300 font-bold animate-pulse text-glow-cyan';
                    else if (ch === 'P') colorClass = 'text-pink-400 font-black text-glow-yellow animate-bounce';
                    else if (['*', '+', '.', 'x', '✦', '★', '✨'].includes(ch)) colorClass = 'text-emerald-400 text-glow-green animate-pulse';

                    return (
                      <span key={x} className={`inline-block w-[1.15ch] text-center ${colorClass}`}>
                        {ch}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HUDステータスライン */}
        <div className="w-full max-w-2xl mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-400 px-1 sm:px-2 flex-wrap gap-2">
          <div>
            <span className="text-slate-500 font-bold">SCORE:</span>{' '}
            <span className="text-amber-400 font-bold text-xs sm:text-sm">{score}</span>
          </div>

          {version === 'v7_ecs_final' ? (
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <span className="text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                ECS ENTITIES: {invaders.filter((i) => i.alive).length + bullets.length + drones.length + 1}
              </span>
              <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                SYSTEMS: Movement | Render | Collision
              </span>
              <span className="text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/30 font-bold animate-pulse">
                ⚡ 3WAY ACTIVE
              </span>
            </div>
          ) : version === 'v6_patterns' ? (
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                STATE: {scene.toUpperCase()}
              </span>
              <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                OBSERVER: READY (Pキー:Pause)
              </span>
            </div>
          ) : version === 'v5_smart_pointers' ? (
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                unique_ptr: {invaders.filter(i => i.alive).length + items.length}
              </div>
              <div className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                shared_ptr: {drones.length}
              </div>
              <div className="text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                LEAK: 0B (RAII)
              </div>
              {hasTripleShot && (
                <span className="text-pink-400 font-bold animate-pulse bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/40">
                  ⚡ 3WAY SHOT
                </span>
              )}
            </div>
          ) : (version === 'v3_dynamic' || version === 'v4_polymorphism') && (
            <div className="flex items-center gap-3.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>PARTICLES: {particles.length}</span>
              </div>
              <div className="text-cyan-400 font-semibold">
                BULLETS: {bullets.length}/3
              </div>
              {version === 'v4_polymorphism' && activeUfo && (
                <div className="text-amber-300 font-bold animate-pulse flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 text-xs">
                  <span>🛸</span>
                  <span>UFO DETECTED!</span>
                </div>
              )}
            </div>
          )}

          <div className="text-xs sm:text-sm">
            {scene === 'gameover' ? (
              <span className="text-rose-500 font-bold animate-pulse">GAME OVER</span>
            ) : scene === 'gameclear' ? (
              <span className="text-emerald-400 font-bold animate-pulse">CLEAR! 🏆</span>
            ) : scene === 'paused' ? (
              <span className="text-amber-400 font-bold">PAUSED ⏸️</span>
            ) : (
              <span className="text-cyan-500 font-bold">READY</span>
            )}
          </div>
        </div>

        {/* タイトル・待機画面オーバーレイ（全バージョン共通） */}
        {scene === 'title' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5 z-20 overflow-y-auto">
            <div className="text-center max-w-lg w-full my-auto space-y-3">
              {/* ステージバッジ */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border font-mono font-bold ${titleInfo.stageColor}`}>
                  {titleInfo.stage}
                </span>
                {chapterCode && (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-300 font-mono">
                    {chapterCode} 収録
                  </span>
                )}
              </div>

              {/* タイトル */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl">{titleInfo.icon}</span>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white font-mono tracking-wide text-glow-cyan">
                  {titleInfo.title}
                </h4>
              </div>

              {chapterTitle && (
                <div className="text-[11px] sm:text-xs text-slate-400 font-mono truncate max-w-sm mx-auto">
                  <span>章：{chapterTitle}</span>
                </div>
              )}

              {/* 🔄 前章からのゲーム進化差分（L2以降） または 初章ミッション案内（L1） */}
              {!isFirstChapter ? (
                <>
                  <div className="bg-slate-900/90 rounded-xl border-2 border-amber-500/40 p-2.5 sm:p-3 text-left space-y-2 font-mono text-[11px] sm:text-xs shadow-lg">
                    <div className="flex items-center justify-between gap-1 flex-wrap border-b border-slate-800 pb-1.5">
                      <div className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>前章（{evolution.previousChapter}）からの進化点:</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        C++設計 ＆ ゲーム挙動差分
                      </span>
                    </div>

                    <div className="text-amber-100 font-sans font-bold text-xs sm:text-sm leading-snug">
                      ✨ {evolution.headline}
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      {evolution.diffItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/80">
                          <div className="text-rose-300/90 flex items-start gap-1">
                            <span className="text-rose-400 font-bold flex-shrink-0">【前章】</span>
                            <span className="leading-tight">{item.before}</span>
                          </div>
                          <div className="text-emerald-300 flex items-start gap-1">
                            <span className="text-emerald-400 font-bold flex-shrink-0">【本章】</span>
                            <span className="leading-tight font-bold">{item.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono italic leading-relaxed text-left px-1">
                    💡 <span className="text-cyan-300 font-bold">C++設計の狙い: </span>{evolution.cppArchitecturePoint}
                  </p>
                </>
              ) : (
                <div className="bg-slate-900/90 rounded-xl border border-cyan-500/40 p-2.5 sm:p-3 text-left space-y-2 font-mono text-xs shadow-lg">
                  <div className="text-cyan-300 font-bold flex items-center gap-2 text-xs sm:text-sm border-b border-slate-800 pb-1">
                    <Target className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>ミッション目標 ＆ 操作方法:</span>
                  </div>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    迫りくるインベーダー編隊（10機）を迎撃し、地球防衛ラインを死守せよ！
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] pt-0.5">
                    <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold px-1 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">[←] [→]</span>
                      <span>左右移動</span>
                    </div>
                    <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold px-1 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">[SPACE]</span>
                      <span>単発射撃</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
                    💡 <span className="text-cyan-300 font-semibold">C++設計の狙い: </span>1ファイル・グローバル変数・単発弾による手続き型コードの限界を体感します。
                  </p>
                </div>
              )}

              {/* スタートボタン */}
              <button
                onClick={() => setScene('playing')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm font-mono transition shadow-lg shadow-cyan-500/30 active:scale-95 animate-pulse flex items-center justify-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>ゲーム開始 ▶ [SPACE または クリック]</span>
              </button>
            </div>
          </div>
        )}

        {/* ポーズ画面オーバーレイ（State パターン） */}
        {scene === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
            <div className="text-center max-w-sm space-y-3">
              <h4 className="text-2xl font-bold text-amber-400 font-mono">
                ⏸️ PAUSED
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                State パターンによりゲームループ更新が一時停止中
              </p>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setScene('playing')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm font-mono transition shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>再開する (Pキー)</span>
                </button>
                <button
                  onClick={initGame}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs sm:text-sm font-mono transition border border-slate-700 flex items-center gap-1.5 shadow"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>終了する (Qキー)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ゲームオーバー / クリア時のオーバーレイバナー */}
        {(scene === 'gameover' || scene === 'gameclear') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-3 z-20">
            {scene === 'gameclear' ? (
              <div className="text-center max-w-sm">
                <div className="w-36 h-20 mx-auto mb-2 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-xl shadow-emerald-500/30">
                  <img
                    src="/images/characters_victory.png"
                    alt="シロクマ先生とペンギン生徒のハイタッチ"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-emerald-400 font-mono mb-1 text-glow-green">
                  TARGET DETECTED! VICTORY!
                </h4>
                <p className="text-xs text-slate-300 font-mono mb-2.5">
                  全インベーダーを撃破！シロクマ先生とハイタッチ！🎉
                </p>
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition shadow-lg shadow-emerald-500/30 active:scale-95 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>もう一度遊ぶ (Rキー)</span>
                  </button>
                  <button
                    onClick={initGame}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm font-mono transition border border-slate-700 active:scale-95 flex items-center gap-1.5 shadow"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>終了する (Qキー)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-36 h-20 mx-auto mb-2 rounded-xl overflow-hidden border-2 border-rose-500 shadow-xl shadow-rose-500/30">
                  <img
                    src="/images/characters_mission.jpg"
                    alt="シロクマ先生とペンギン生徒の作戦会議"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-rose-500 font-mono mb-1">GAME OVER</h4>
                <p className="text-xs text-slate-300 font-mono mb-2.5">インベーダーに侵略されてしまいました</p>
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    onClick={restartGame}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm font-mono transition shadow-lg shadow-rose-600/30 active:scale-95 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>リトライする (Rキー)</span>
                  </button>
                  <button
                    onClick={initGame}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm font-mono transition border border-slate-700 active:scale-95 flex items-center gap-1.5 shadow"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>終了する (Qキー)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 操作ガイド ＆ モバイル対応バーチャルゲームパッド */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-2">
        {/* キーボード案内 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-200">操作方法:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-[10px] sm:text-xs">A / ←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-[10px] sm:text-xs">D / →</kbd>
            <span className="text-slate-400">移動</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-[10px] sm:text-xs">Space</kbd>
            <span className="text-slate-400">発射</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold text-[10px] sm:text-xs">P</kbd>
            <span className="text-slate-400">ポーズ</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-300 font-bold text-[10px] sm:text-xs">R</kbd>
            <span className="text-slate-400">リトライ</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px] sm:text-xs">Q / Esc</kbd>
            <span className="text-slate-400">終了</span>
          </div>

          <button
            onClick={() => setShowVirtualPad((prev) => !prev)}
            className="text-[11px] sm:text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <Smartphone className="w-3 h-3" />
            <span>{showVirtualPad ? 'パッド非表示' : 'パッド表示'}</span>
          </button>
        </div>

        {/* モバイル＆タッチ端末対応バーチャルコントローラー */}
        {showVirtualPad && (
          <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl select-none touch-none">
            <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
              {/* 左手：移動 D-PAD（タップ＆長押し対応） */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onMouseDown={() => startMove('left')}
                  onMouseUp={stopMove}
                  onMouseLeave={stopMove}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startMove('left');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopMove();
                  }}
                  onTouchCancel={stopMove}
                  className="w-10 h-10 min-[380px]:w-11 min-[380px]:h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 active:border-cyan-400 active:from-cyan-900 active:to-slate-900 text-white font-mono text-base sm:text-lg flex flex-col items-center justify-center transition shadow-lg active:scale-95 cursor-pointer touch-none"
                  aria-label="左移動（長押し対応）"
                >
                  <span>◀</span>
                  <span className="text-[8px] text-slate-400 font-sans tracking-tight leading-none">LEFT</span>
                </button>

                <button
                  onMouseDown={() => startMove('right')}
                  onMouseUp={stopMove}
                  onMouseLeave={stopMove}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startMove('right');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopMove();
                  }}
                  onTouchCancel={stopMove}
                  className="w-10 h-10 min-[380px]:w-11 min-[380px]:h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 active:border-cyan-400 active:from-cyan-900 active:to-slate-900 text-white font-mono text-base sm:text-lg flex flex-col items-center justify-center transition shadow-lg active:scale-95 cursor-pointer touch-none"
                  aria-label="右移動（長押し対応）"
                >
                  <span>▶</span>
                  <span className="text-[8px] text-slate-400 font-sans tracking-tight leading-none">RIGHT</span>
                </button>
              </div>

              {/* 中央：システム操作（PAUSE / RESUME / RESET） */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={togglePause}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 transition active:scale-95 shadow"
                >
                  {scene === 'paused' ? (
                    <>
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      <span>RESUME</span>
                    </>
                  ) : scene === 'title' ? (
                    <>
                      <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <span>START</span>
                    </>
                  ) : scene === 'gameover' || scene === 'gameclear' ? (
                    <>
                      <RotateCcw className="w-3 h-3 text-rose-400" />
                      <span>RETRY</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" />
                      <span>PAUSE</span>
                    </>
                  )}
                </button>

                <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                  <span>長押しで連続移動</span>
                </div>
              </div>

              {/* 右手：アクションボタン（FIRE ボタン） */}
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    shoot();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    shoot();
                  }}
                  className="w-11 h-11 min-[380px]:w-12 min-[380px]:h-12 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-b from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 active:from-cyan-300 active:to-cyan-400 text-slate-950 font-black font-mono text-[11px] sm:text-xs flex flex-col items-center justify-center transition shadow-lg shadow-cyan-500/40 border-2 border-cyan-300 active:scale-90 cursor-pointer touch-none"
                  aria-label="発射ボタン"
                >
                  <span className="text-base sm:text-lg leading-none">🚀</span>
                  <span className="tracking-wider leading-none mt-0.5">FIRE</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 商標・教育目的の注記 */}
        <div className="w-full text-center pt-2 text-[10px] text-slate-500 font-mono">
          ※「スペースインベーダー」は株式会社タイトーの登録商標です。本エミュレータは古典固定画面シューティングを題材とした教育用自作プログラム（RETRO SPACE SHOOTER）です。
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        {emulatorNode}
      </div>
    );
  }

  return emulatorNode;
};
