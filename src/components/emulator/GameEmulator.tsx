import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Sparkles, Terminal, Gamepad2, Info, Sliders, Smartphone, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameEmulatorProps {
  version: 'v1_spaghetti' | 'v2_classes' | 'v3_dynamic' | 'v4_polymorphism' | 'v5_smart_pointers' | 'v6_patterns' | 'v7_ecs_final';
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

export const GameEmulator: React.FC<GameEmulatorProps> = ({ version }) => {
  const [playerX, setPlayerX] = useState<number>(14);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [drones, setDrones] = useState<BitDrone[]>([]);
  const [hasTripleShot, setHasTripleShot] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [scene, setScene] = useState<SceneState>(
    version === 'v6_patterns' || version === 'v7_ecs_final' ? 'title' : 'playing'
  );
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // C++設計定数・インタラクティブ実験室（サンドボックス）状態
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [playerSpeed, setPlayerSpeed] = useState<number>(1);
  const [maxBullets, setMaxBullets] = useState<number>(() =>
    version === 'v1_spaghetti' || version === 'v2_classes' ? 1 : 3
  );
  const [enemySpeedMul, setEnemySpeedMul] = useState<number>(1.0);
  const [sandboxTripleShot, setSandboxTripleShot] = useState<boolean>(false);
  const [showVirtualPad, setShowVirtualPad] = useState<boolean>(true);

  const invaderDirRef = useRef<number>(1);
  const invaderTimerRef = useRef<number>(0);
  const ufoTimerRef = useRef<number>(0);
  const bossTimerRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const moveTimerRef = useRef<number | null>(null);

  // 実績トースト表示ヘルパー (Observer パターン)
  const triggerAchievement = useCallback((text: string) => {
    setAchievementToast(text);
    setTimeout(() => {
      setAchievementToast((prev) => (prev === text ? null : prev));
    }, 2800);
  }, []);

  // ゲームの初期化
  const initGame = useCallback(() => {
    setPlayerX(14);
    setBullets([]);
    setParticles([]);
    setScore(0);
    setScene(version === 'v6_patterns' || version === 'v7_ecs_final' ? 'title' : 'playing');
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

  //   // 弾丸の発射処理
  const shoot = useCallback(() => {
    if (scene !== 'playing') return;

    setBullets((prev) => {
      // サンドボックスで設定された最大発射弾数制限
      if (prev.length >= maxBullets) return prev;

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

  // 移動処理（playerSpeedを反映）
  const moveLeft = useCallback(() => {
    if (scene !== 'playing') return;
    setPlayerX((prev) => Math.max(1, prev - playerSpeed));
  }, [scene, playerSpeed]);

  const moveRight = useCallback(() => {
    if (scene !== 'playing') return;
    setPlayerX((prev) => Math.min(WIDTH - 4, prev + playerSpeed));
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
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D', 'p', 'P', 'r', 'R'].includes(e.key)) {
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

      // ポーズ切り替え（Pキー: State パターン）
      if (e.key === 'p' || e.key === 'P') {
        if (scene === 'playing') {
          setScene('paused');
        } else if (scene === 'paused') {
          setScene('playing');
        }
        return;
      }

      // ゲームオーバー/クリア時のリトライ（Rキー）
      if ((scene === 'gameover' || scene === 'gameclear') && (e.key === 'r' || e.key === 'R')) {
        initGame();
        return;
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
  }, [scene, moveLeft, moveRight, shoot, initGame]);

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
                  if (Math.abs(item.x - (playerX + 1)) <= 5.0) {
                    targetX += (playerX + 1 > item.x ? 0.3 : -0.3);
                  }
                }
                const ny = item.y + 0.25;

                // プレイヤー接触判定
                if (Math.abs(targetX - (playerX + 1)) <= 1.8 && Math.abs(ny - (HEIGHT - 2)) <= 1.2) {
                  if (item.type === 'power') {
                    setHasTripleShot(true);
                    setScore((s) => s + 300);
                    triggerAchievement("⚡ 3WAY LASER UNLOCKED!");
                  } else if (item.type === 'bit') {
                    setDrones((d) => (d.length < 2 ? [...d, { id: Date.now(), angle: Math.PI }] : d));
                    setScore((s) => s + 200);
                    triggerAchievement("🛰️ BIT DRONE DEPLOYED!");
                  }
                  spawnExplosion(targetX, ny, true);
                } else if (ny < HEIGHT - 1) {
                  remaining.push({ ...item, x: targetX, y: ny });
                }
              });
              return remaining;
            });
          }

          // 5. 敵の移動タイマー（通常敵＆シールド敵＆エリート敵＆ボス）
          invaderTimerRef.current += 1 * enemySpeedMul;
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

              if (hitWall) {
                invaderDirRef.current = -invaderDirRef.current;
                let touchedBottom = false;
                const nextInvaders = prevInvaders.map((inv) => {
                  if (inv.type === 'ufo' || inv.type === 'boss') return inv;
                  const newY = inv.y + 1;
                  if (inv.alive && newY >= HEIGHT - 2) {
                    touchedBottom = true;
                  }
                  return { ...inv, y: newY };
                });
                if (touchedBottom) {
                  setScene('gameover');
                }
                return nextInvaders;
              } else {
                return prevInvaders.map((inv) => {
                  if (inv.type === 'ufo' || inv.type === 'boss') return inv;
                  // エリート敵は上下に少し揺れる
                  const deltaY = inv.type === 'elite' ? (Math.random() > 0.5 ? 0.2 : -0.2) : 0;
                  return {
                    ...inv,
                    x: inv.x + invaderDirRef.current,
                    y: Math.max(2, Math.min(HEIGHT - 4, inv.y + deltaY)),
                  };
                });
              }
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
                    return { ...inv, hp: inv.hp - 1 };
                  }

                  // エリート敵の多段ヒット
                  if (inv.type === 'elite' && inv.hp > 1) {
                    setScore((s) => s + 60);
                    spawnExplosion(inv.x, inv.y, false);
                    return { ...inv, hp: inv.hp - 1 };
                  }

                  // シールド敵の多段ヒット処理
                  if (inv.type === 'shield' && inv.hp > 1) {
                    setScore((s) => s + 50);
                    spawnExplosion(inv.x, inv.y, false);
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

  const vInfo = getVersionBadge();
  const activeUfo = invaders.find((inv) => inv.type === 'ufo' && inv.alive);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 shadow-2xl p-4 md:p-6 my-6 relative overflow-hidden backdrop-blur-md">
      {/* 背景の淡いグリッド */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* エミュレータ上部バー */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          <h3 className="font-mono text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2.5 flex-wrap">
            <span>Webコンソール実行エミュレータ</span>
            <span className={`text-xs sm:text-sm px-3 py-1 rounded-full border font-sans font-semibold ${vInfo.color}`}>
              {vInfo.name}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSandboxOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition border active:scale-95 shadow-sm ${
              isSandboxOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/30'
            }`}
            title="C++コードの定数（速度・連射数など）をリアルタイムに変更"
          >
            <Sliders className="w-4 h-4" />
            <span>C++定数実験室</span>
          </button>

          <button
            onClick={() => setShowVirtualPad((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition border active:scale-95 shadow-sm ${
              showVirtualPad
                ? 'bg-slate-700 text-slate-100 border-slate-600'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="スマホ・タッチ用バーチャルパッドの表示切替"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">操作パッド</span>
          </button>

          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-mono font-bold transition border border-slate-700 active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>リセット</span>
          </button>
        </div>
      </div>

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

      {/* バージョンごとの特徴ガイダンス */}
      <div className="mb-4 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-center gap-2.5 font-mono">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
        <span className="leading-relaxed">{vInfo.desc}</span>
      </div>

      {/* レトロCRT風コンソール画面 */}
      <div className="relative rounded-2xl border-2 border-slate-800 bg-[#040810] p-4 sm:p-6 font-mono overflow-hidden shadow-2xl flex flex-col items-center select-none scanline">
        {/* CRTのグローエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent pointer-events-none" />

        {/* 実績解除トースト（Observer パターン） */}
        {achievementToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-4 py-2 rounded-xl font-mono font-black text-xs sm:text-sm shadow-2xl border-2 border-white animate-bounce">
            <span>🏆 [OBSERVER EVENT]</span>
            <span>{achievementToast}</span>
          </div>
        )}

        {/* 画面テキスト（スマホ幅で切れないようスケーリング ＆ スクロール対応） */}
        <div className="w-full max-w-full overflow-x-auto flex justify-center py-2">
          <div className="text-[11px] min-[360px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg lg:text-xl leading-none font-bold tracking-wider sm:tracking-widest text-center whitespace-pre font-mono">
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

        {/* HUDステータスライン */}
        <div className="w-full max-w-2xl mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 px-2 flex-wrap gap-2">
          <div>
            <span className="text-slate-500 font-bold">SCORE:</span>{' '}
            <span className="text-amber-400 font-bold text-sm sm:text-base">{score}</span>
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

        {/* タイトル画面オーバーレイ（State パターン） */}
        {scene === 'title' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                👾
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono mb-2 text-glow-cyan">
                {version === 'v7_ecs_final' ? 'SPACE INVADERS ECS 2026' : 'SPACE INVADERS PATTERNS'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mb-6 leading-relaxed whitespace-pre-line">
                {version === 'v7_ecs_final'
                  ? '【完結編】ECS（Entity Component System）設計\n巨大母艦 [ B ] と弾幕エリート [ E ] を撃破せよ！'
                  : 'State パターンによる状態管理\nTitle ⇄ Playing ⇄ Paused ⇄ GameOver'}
              </p>
              <button
                onClick={() => setScene('playing')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-mono transition shadow-lg shadow-cyan-500/40 active:scale-95 animate-pulse"
              >
                PRESS SPACE TO START ▶
              </button>
            </div>
          </div>
        )}

        {/* ポーズ画面オーバーレイ（State パターン） */}
        {scene === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
            <div className="text-center max-w-sm">
              <h4 className="text-2xl font-bold text-amber-400 font-mono mb-2">
                ⏸️ PAUSED
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mb-5">
                State パターンによりゲームループ更新が一時停止中
              </p>
              <button
                onClick={() => setScene('playing')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm font-mono transition shadow-lg shadow-amber-500/30"
              >
                再開する (Pキー)
              </button>
            </div>
          </div>
        )}

        {/* ゲームオーバー / クリア時のオーバーレイバナー */}
        {(scene === 'gameover' || scene === 'gameclear') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 z-20">
            {scene === 'gameclear' ? (
              <div className="text-center max-w-sm">
                <div className="w-44 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl shadow-emerald-500/30">
                  <img
                    src="/images/characters_victory.png"
                    alt="シロクマ先生とペンギン生徒のハイタッチ"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mb-1 text-glow-green">
                  TARGET DETECTED! VICTORY!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-mono mb-4">
                  全インベーダーを撃破！シロクマ先生とハイタッチ！🎉
                </p>
                <button
                  onClick={initGame}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm font-mono transition shadow-lg shadow-emerald-500/30"
                >
                  もう一度遊ぶ (Rキー)
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-44 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-xl shadow-rose-500/30">
                  <img
                    src="/images/characters_mission.jpg"
                    alt="シロクマ先生とペンギン生徒の作戦会議"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-rose-500 font-mono mb-1">GAME OVER</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-mono mb-4">インベーダーに侵略されてしまいました</p>
                <button
                  onClick={initGame}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm font-mono transition shadow-lg shadow-rose-600/30"
                >
                  リトライする (Rキー)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 操作ガイド ＆ モバイル対応バーチャルゲームパッド */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
        {/* キーボード案内 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-300 font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">操作方法:</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs">A / ←</kbd>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs">D / →</kbd>
            <span className="text-slate-400">移動</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs">Space</kbd>
            <span className="text-slate-400">発射</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs">P</kbd>
            <span className="text-slate-400">ポーズ</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-300 font-bold text-xs">R</kbd>
            <span className="text-slate-400">リトライ</span>
          </div>

          <button
            onClick={() => setShowVirtualPad((prev) => !prev)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showVirtualPad ? 'バーチャルパッドを隠す' : 'スマホ用パッドを表示'}</span>
          </button>
        </div>

        {/* モバイル＆タッチ端末対応バーチャルコントローラー */}
        {showVirtualPad && (
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl select-none touch-none">
            <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
              {/* 左手：移動 D-PAD（タップ＆長押し対応） */}
              <div className="flex items-center gap-2 sm:gap-3">
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
                  className="w-12 h-12 min-[380px]:w-14 min-[380px]:h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 active:border-cyan-400 active:from-cyan-900 active:to-slate-900 text-white font-mono text-lg sm:text-2xl flex flex-col items-center justify-center transition shadow-lg active:scale-95 cursor-pointer touch-none"
                  aria-label="左移動（長押し対応）"
                >
                  <span>◀</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-tight">LEFT</span>
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
                  className="w-12 h-12 min-[380px]:w-14 min-[380px]:h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 active:border-cyan-400 active:from-cyan-900 active:to-slate-900 text-white font-mono text-lg sm:text-2xl flex flex-col items-center justify-center transition shadow-lg active:scale-95 cursor-pointer touch-none"
                  aria-label="右移動（長押し対応）"
                >
                  <span>▶</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-tight">RIGHT</span>
                </button>
              </div>

              {/* 中央：システム操作（PAUSE / RESUME / RESET） */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={togglePause}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 shadow"
                >
                  {scene === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      <span>RESUME</span>
                    </>
                  ) : scene === 'title' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                      <span>START</span>
                    </>
                  ) : scene === 'gameover' || scene === 'gameclear' ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>RETRY</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>PAUSE</span>
                    </>
                  )}
                </button>

                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <span>長押しで連続移動</span>
                </div>
              </div>

              {/* 右手：アクションボタン（特大 FIRE ボタン） */}
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
                  className="w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 active:from-cyan-300 active:to-cyan-400 text-slate-950 font-black font-mono text-xs min-[380px]:text-sm sm:text-base flex flex-col items-center justify-center transition shadow-lg shadow-cyan-500/40 border-2 border-cyan-300 active:scale-90 cursor-pointer touch-none"
                  aria-label="発射ボタン"
                >
                  <span className="text-lg sm:text-xl">🚀</span>
                  <span className="tracking-wider">FIRE</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
