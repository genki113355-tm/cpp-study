import { Chapter } from '../../types/curriculum';

export const chapterL9: Chapter = {
  id: 13,
  slug: 'chapter-9-multiple-inheritance-diamond',
  courseTrack: 'classic',
  courseChapterCode: 'C9',
  title: 'レガシー第9章：多重継承の闇と仮想基底クラス（菱形継承）',
  subtitle: 'メモリレイアウトの解剖、thisポインタ調整オフセット、そして仮想基底クラス（virtual inheritance）の代償',
  badge: 'レガシーC++ L9：多重継承・菱形継承',
  gameVersion: 'v2_classes',
  description: 'ゲーム開発が大規模化すると、「空を飛べる敵（FlyingEnemy）」と「弾を撃てる敵（ShootingEnemy）」の両方の能力を持った「空飛ぶ砲台ボス（Boss）」を作りたくなる瞬間が必ず訪れます。オブジェクト指向初心者は安易に `class Boss : public FlyingEnemy, public ShootingEnemy` という多重継承（Multiple Inheritance）に手を染めますが、待っているのは共通基底クラスが2重実体化してコンパイラが悲鳴を上げる「菱形継承の死（Diamond of Death）」です。多重継承時の物理メモリ配置、キャストでポインタのアドレス値が勝手にズレる「thisポインタ調整オフセット」、仮想基底クラス（virtual inheritance）の隠れたオーバーヘッドを徹底解剖し、なぜ現代のゲームエンジンが多重継承を原則禁止して「継承より合成（Composition）」を選んだのか、その必然性を解き明かします。',
  sections: [
    {
      id: 'sec-l9-diamond-problem',
      title: 'L9.1 なぜ多重継承に走ってしまうのか？菱形継承の死（Diamond of Death）',
      leadText: '「飛べる」と「撃てる」を合体させたら基底クラスが2重に分裂！コンパイルエラー Ambiguous の正体と、安易なコード再利用目的の継承の破綻を学びます。',
      dialogueBefore: [
        {
          id: 'dl9-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生、大惨事です……！ステージ3のボスを作ろうと思って、既に動いている `FlyingEnemy`（飛行）と `ShootingEnemy`（射撃）の両方を多重継承したんです。そしたら `error: reference to hp is ambiguous`（hp変数が曖昧）という謎のエラーが大量に出てコンパイルすら通らなくなりました……！'
        },
        {
          id: 'dl9-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！初心者がオブジェクト指向をかじった後に必ず落ちる悪魔の蟻地獄、【菱形継承の死（Diamond of Death）】に綺麗にハマりおったな！'
        },
        {
          id: 'dl9-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '菱形継承……？FlyingEnemy も ShootingEnemy も、大元は同じ `Entity` クラスを継承しているだけですよ？何が死なんですか！？'
        },
        {
          id: 'dl9-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこじゃ！Boss のメモリの中に【FlyingEnemyが持ってきたEntity】と【ShootingEnemyが持ってきたEntity】の2つが別々に実体化してしまっておるんじゃ！だから `boss.hp` と書いた時、コンパイラは「どっちのEntityのhpを指しておるんじゃ！？」と激怒するんじゃよ！'
        }
      ],
      paradigmComparison: {
        title: '多重継承（菱形継承アンチパターン） vs コンポジション（部品合成）',
        cApproach: {
          title: '多重継承：is-a 関係の乱用による菱形継承',
          code: `class Entity { public: int hp; };
class FlyingEnemy : public Entity { public: float flySpeed; };
class ShootingEnemy : public Entity { public: int ammo; };

// ❌ 菱形継承 (Diamond of Death)
class Boss : public FlyingEnemy, public ShootingEnemy {
public:
    void takeDamage(int dmg) {
        // hp -= dmg; ➔ エラー！Entity::hp が2重に存在して曖昧 (Ambiguous)
        
        // 無理やり解決しようとすると…
        FlyingEnemy::hp -= dmg; // どっちのHPを減らすの？整合性崩壊！
    }
};`,
          drawbacks: [
            '基底クラス Entity のメンバ変数（hp, x, y等）がメモリ上に2つ複製され、無駄なメモリを消費する',
            '変数のアクセス時に修飾子（FlyingEnemy::hp）が必須となり、コードの可読性と保守性が致命的に低下する',
            '基底クラスへのアップキャスト（Entity* e = new Boss()）も曖昧エラーでコンパイル不能になる'
          ]
        },
        cppApproach: {
          title: 'コンポジション：has-a 関係による部品の合成',
          code: `class Entity { public: int hp; };

// 振る舞いを部品（コンポーネント）として独立
class FlightBehavior { public: float flySpeed; void updateFlight(); };
class WeaponBehavior { public: int ammo; void fireBullet(); };

// ✅ 継承ではなく合成（Composition）で構築
class Boss : public Entity {
private:
    FlightBehavior flight_; // 飛行部品を持つ (has-a)
    WeaponBehavior weapon_; // 射撃部品を持つ (has-a)
public:
    void takeDamage(int dmg) {
        hp -= dmg; // Entityは常に1つだけ！曖昧さゼロ！
    }
};`,
          benefits: [
            '基底クラス Entity は単一実体のみ存在し、曖昧さエラーが物理的に発生しない',
            '飛行ロジックや射撃ロジックを他の敵や味方機にも自由に付け替え・再利用できる',
            'クラス間の結合度が最小限に抑えられ、単体テストやモック化が極めて容易'
          ]
        },
        paradigmShiftNotes: '「空を飛ぶ」「弾を撃つ」はキャラクターの「本質（is-a）」ではなく、単なる「能力や部品（has-a）」です。継承をコード再利用のショートカットとして使うことをやめ、部品の組み合わせで設計するのが現代C++の鉄則です。'
      },
      processSteps: [
        {
          stepNumber: 1,
          title: '菱形継承のクラス関係図（Diamond Graph）',
          codeSnippet: `       [ Entity ]  (hp, x, y)
        /      \\
[ Flying ]    [ Shooting ]
        \\      /
        [ Boss ]  <-- Entityが2つ存在！`,
          description: '1つの基底クラスから2つの派生クラスが生まれ、さらにその両方を単一のクラスが多重継承した時、継承ツリーが菱形（ダイヤモンド）の形状を描きます。',
          impact: '頂点にある Entity のデータが末尾の Boss の中に重複してコピーされます。',
          designIntent: 'C++の素朴な多重継承では、各継承パスごとに独立して基底クラスをインスタンス化するためです。'
        },
        {
          stepNumber: 2,
          title: 'Ambiguous エラーの現場直撃コード',
          codeSnippet: `Boss boss;
boss.hp = 100; // error: request for member 'hp' is ambiguous

Entity* p = &boss; // error: 'Entity' is an ambiguous base of 'Boss'`,
          description: '変数のアクセスだけでなく、基底クラスへのポインタ変換（ポリモーフィズム）すらも「どちらの Entity ポインタに変換すべきか不明」として完全に破綻します。',
          impact: 'オブジェクト指向の最大の武器である多態性が使えなくなります。',
          designIntent: 'コンパイラは推測でどちらかのEntityを選ぶことを拒否し、厳密なエラーを出します。'
        },
        {
          stepNumber: 3,
          title: 'スコープ解決演算子による苦肉の策とその破綻',
          codeSnippet: `boss.FlyingEnemy::hp = 80;
boss.ShootingEnemy::hp = 100; // 片方だけ減って片方は満タン？ゲームロジックが崩壊！`,
          description: 'スコープ解決演算子で片方を明示すればコンパイル自体は通りますが、「ボスのHPが2つある」というゲーム設計上の致命的な矛盾を引き起こします。',
          impact: '片方のHPが0になっても、もう片方のHPが残っているため死なない怪奇現象が発生します。',
          designIntent: '構文的なエラー回避はできても、設計の破綻は救えない典型例です。'
        }
      ],
      codeFiles: [
        {
          filename: 'DiamondProblemDemo.cpp',
          language: 'cpp',
          description: '菱形継承による2重実体化とコンパイルエラーの再現',
          code: `#include <iostream>

class Entity {
public:
    int id_;
    int hp_;
    Entity(int id, int hp) : id_(id), hp_(hp) {
        std::cout << "Entity コンストラクタ呼び出し (ID: " << id_ << ")\\n";
    }
};

class FlyingEnemy : public Entity {
public:
    float flySpeed_;
    FlyingEnemy(int id, int hp, float speed) 
        : Entity(id, hp), flySpeed_(speed) {}
};

class ShootingEnemy : public Entity {
public:
    int ammo_;
    ShootingEnemy(int id, int hp, int ammo) 
        : Entity(id, hp), ammo_(ammo) {}
};

// ❌ 菱形継承
class BossShip : public FlyingEnemy, public ShootingEnemy {
public:
    BossShip(int id, int hp) 
        : FlyingEnemy(id, hp, 5.0f), ShootingEnemy(id, hp, 100) {
        std::cout << "BossShip 生成完了\\n";
    }

    void printState() {
        // std::cout << hp_; ➔ コンパイルエラー！
        std::cout << "Flying側のHP: " << FlyingEnemy::hp_ << "\\n";
        std::cout << "Shooting側のHP: " << ShootingEnemy::hp_ << "\\n";
    }
};

int main() {
    // コンストラクタが2回呼ばれる（Entityが2つ実体化！）
    BossShip boss(999, 500);
    boss.printState();

    std::cout << "BossShipのサイズ: " << sizeof(BossShip) << " バイト\\n";
    // Entityのメンバが2重に含まれているためサイズが肥大化！

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l9-memory-layout-this-offset',
      title: 'L9.2 多重継承の物理メモリ構造と this ポインタ調整オフセットの怪',
      leadText: 'キャストするとアドレス値が勝手にズレる？！多重継承されたオブジェクトのメモリレイアウトと、CPUが実行する裏のポインタ計算を解剖します。',
      dialogueBefore: [
        {
          id: 'dl9-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ベン先生……！デバッガでポインタのアドレスを見ていて、恐ろしい怪奇現象を発見してしまいました。`Boss* pBoss = &boss;` のアドレスが `0x1000` なのに、それを `ShootingEnemy* pShoot = pBoss;` にアップキャストしたら、アドレスが勝手に `0x1018` に書き換わったんです！同じオブジェクトを指しているはずなのに、ポインタの値がズレるなんて物理法則が壊れていませんか！？'
        },
        {
          id: 'dl9-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'カッカッカ！壊れてなどおらん、それこそがC++コンパイラが裏で暗躍する【thisポインタ調整オフセット（Pointer Thunk）】の魔術じゃ！'
        },
        {
          id: 'dl9-7',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'ポインタ調整オフセット……？なぜアドレスをずらす必要があるんですか？'
        },
        {
          id: 'dl9-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ShootingEnemy のメンバ関数を実行する時、CPUはその関数が想定している「ShootingEnemy のメンバ変数が並ぶ先頭アドレス」を this ポインタとして受け取る必要がある。メモリの先頭（0x1000）には FlyingEnemy が居座っておるから、ShootingEnemy の位置（0x1018）まで this をジャンプさせねばならんのじゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '多重継承オブジェクトの物理メモリ配置',
          codeSnippet: `[ 0x1000: FlyingEnemy サブオブジェクト ]
  +0x00: vptr (FlyingEnemyの仮想テーブル)
  +0x08: Entity::id_, Entity::hp_
  +0x10: flySpeed_
[ 0x1018: ShootingEnemy サブオブジェクト ]
  +0x18: vptr (ShootingEnemyの仮想テーブル)
  +0x20: Entity::id_, Entity::hp_
  +0x28: ammo_
[ 0x1030: BossShip 独自のメンバ ]`,
          description: '多重継承されたインスタンスの内部には、各基底クラスのデータが順番に積み木のように並べられます。',
          impact: '第1基底クラスは先頭（オフセット0）に置かれますが、第2基底クラス以降は手前に配置されたデータ分だけ後ろに追いやられます。',
          designIntent: '第1基底クラスへのキャストはオフセット0ですが、第2基底クラスへはオフセット加算が必要です。'
        },
        {
          stepNumber: 2,
          title: 'コンパイラによる自動アドレス補正（this += offset）',
          codeSnippet: `BossShip* pBoss = new BossShip(); // 0x1000
FlyingEnemy*   pFly   = pBoss;    // 0x1000 (オフセット加算なし: +0x00)
ShootingEnemy* pShoot = pBoss;    // 0x1018 (コンパイラが裏で +0x18 加算！)`,
          description: 'C++コンパイラは、基底クラスへの暗黙の型変換や static_cast を行う際、アセンブリレベルで `lea rdi, [rbx + 0x18]` のようにオフセットを加算する命令を自動挿入します。',
          impact: 'プログラマが意識しなくても、ShootingEnemy は自分を普通のインスタンスとして扱えます。',
          designIntent: 'クラスの独立性とポリモーフィズムを成立させるための必然の仕組みです。'
        },
        {
          stepNumber: 3,
          title: '生 reinterpret_cast や void* の即死トラップ',
          codeSnippet: `// ❌ 危険：void* を挟むとオフセット調整が消滅！
void* raw = pBoss; // 0x1000
ShootingEnemy* pBroken = (ShootingEnemy*)raw; // 0x1000 のまま！(0x1018であるべき)
pBroken->fireBullet(); // 💥 メモリの壊れた位置を読んで即死クラッシュ！`,
          description: '多重継承されたポインタを一度 `void*` に逃がしてからキャストすると、コンパイラはオフセット調整を行えなくなります。結果として全く無関係なメモリ領域を読み書きし、即座にセグフォやデータ破壊を起こします。',
          impact: 'C言語流のポインタキャストがC++で厳禁とされる最大の物理的理由です。',
          designIntent: 'static_cast や dynamic_cast だけが正しいオフセット補正を行えます。'
        }
      ],
      codeFiles: [
        {
          filename: 'PointerOffsetProof.cpp',
          language: 'cpp',
          description: '多重継承におけるポインタアドレスのズレ（オフセット）を実際に表示・検証する実験コード',
          code: `#include <iostream>
#include <iomanip>

class DeviceA {
public:
    int dataA_ = 100;
    virtual void funcA() { std::cout << "DeviceA::funcA\\n"; }
};

class DeviceB {
public:
    int dataB_ = 200;
    virtual void funcB() { std::cout << "DeviceB::funcB\\n"; }
};

// 2つの基底クラスを多重継承
class CompositeDevice : public DeviceA, public DeviceB {
public:
    int dataComposite_ = 300;
    virtual void funcComposite() { std::cout << "CompositeDevice::funcComposite\\n"; }
};

int main() {
    CompositeDevice dev;

    CompositeDevice* pDev = &dev;
    DeviceA* pA = pDev;
    DeviceB* pB = pDev; // 👈 ここでアドレスがズレる！

    std::cout << "=== 多重継承におけるポインタアドレスの実験 ===\\n";
    std::cout << "pDev (CompositeDevice*) : " << pDev << "\\n";
    std::cout << "pA   (DeviceA*)         : " << pA << " (差分: " << (uintptr_t)pA - (uintptr_t)pDev << " バイト)\\n";
    std::cout << "pB   (DeviceB*)         : " << pB << " (差分: +" << (uintptr_t)pB - (uintptr_t)pDev << " バイト)\\n";

    // 仮想関数の呼び出しも正常に動作
    pA->funcA();
    pB->funcB(); // CPUは自動調整された正しい this を受け取って実行！

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l9-virtual-inheritance-cost',
      title: 'L9.3 仮想基底クラス（virtual inheritance）の仕組みと重すぎる代償',
      leadText: '菱形継承を力技で解決する virtual public Entity。基底クラスの複製を防ぐ代償として支払う「実行時オーバーヘッド」と「初期化責任の崩壊」を学びます。',
      dialogueBefore: [
        {
          id: 'dl9-9',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'ベン先生！C++の規格を調べたら、菱形継承を解決する公式機能として【仮想基底クラス（virtual inheritance）】があるのを見つけました！`class FlyingEnemy : virtual public Entity` と書けば、Entity が1つに統合されるんですよね！？これで多重継承使い放題じゃないですか！'
        },
        {
          id: 'dl9-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'フフフ……確かに構文上は解決する。だがピッピン、タダ飯はこの世に存在せん！仮想継承を導入した瞬間に、メモリの肥大化・ポインタ間接アクセスのコスト・そして【クラスのカプセル化崩壊】という重すぎるツケを支払うことになるんじゃぞ！'
        },
        {
          id: 'dl9-11',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'カプセル化の崩壊……？どういうことですか？'
        },
        {
          id: 'dl9-12',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '仮想基底クラスのコンストラクタは、直接の親ではなく【一番末尾の派生クラス（Boss）が直接呼び出さねばならん】というC++の絶対掟がある！親クラスが基底クラスをどう初期化するかという実装隠蔽がすべて粉々に吹き飛ぶんじゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '仮想基底クラスポインタ（vbptr）の導入',
          codeSnippet: `class FlyingEnemy : virtual public Entity { ... };
class ShootingEnemy : virtual public Entity { ... };`,
          description: 'virtual 継承を指定すると、コンパイラは Entity を末尾に1つだけ配置し、各派生クラスの内部に「Entity はここから何バイト先にあるか」を指す隠しポインタ（vbptr: Virtual Base Pointer）を埋め込みます。',
          impact: 'Entity の重複実体化は解消されますが、vbptr の分だけオブジェクトサイズが肥大化します。',
          designIntent: '実行時にインダイレクションを挟むことで単一の実体を共有します。'
        },
        {
          stepNumber: 2,
          title: 'メンバアクセスの実行時オーバーヘッド',
          codeSnippet: `// 通常のアクセス（固定オフセット）
this->hp; // [this + 8] を読むだけ (超高速)

// 仮想継承のアクセス（2段階の間接参照）
this->hp; // 1. vbptr を読んでオフセットを取得 ➔ 2. その先を読む (キャッシュミス多発！)`,
          description: '毎フレーム何万回も呼ばれる敵の座標更新やHP判定で、常にポインタの間接参照が挟まるため、ゲームループの実行速度に悪影響を与えます。',
          impact: 'CPUのキャッシュ効率（データ局所性）が悪化します。',
          designIntent: '動的な配置解決の代償としてのCPUサイクルの消費です。'
        },
        {
          stepNumber: 3,
          title: '最も致命的：最派生クラスへの初期化責任の転嫁',
          codeSnippet: `class BossShip : public FlyingEnemy, public ShootingEnemy {
public:
    // ❌ 親クラスではなく、BossShip が直々に Entity を初期化せねばならない！
    BossShip(int id, int hp) 
        : Entity(id, hp), // 一番上の基底を末尾が直接呼ぶ（カプセル化崩壊）
          FlyingEnemy(...), 
          ShootingEnemy(...) {}
};`,
          description: '仮想基底クラスの初期化責任は、直近の親を飛び越えて最派生クラス（BossShip）に強制委譲されます。これにより「親クラスがよしなに基底クラスを初期化してくれる」というカプセル化が完全に破綻します。',
          impact: '新しい派生クラスを作るたびに、遥か上の基底クラスの初期化パラメータをすべて知っていなければならなくなります。',
          designIntent: '基底クラスが1つしかないため、誰が初期化するかを一意に決めるための言語規則です。'
        }
      ],
      codeFiles: [
        {
          filename: 'VirtualInheritanceDemo.cpp',
          language: 'cpp',
          description: '仮想継承による菱形継承の解決と、初期化の特殊規則の確認',
          code: `#include <iostream>

class Entity {
public:
    int hp_;
    Entity(int hp) : hp_(hp) {
        std::cout << "Entity コンストラクタ: HP=" << hp_ << "\\n";
    }
};

// virtual 継承を指定
class FlyingEnemy : virtual public Entity {
public:
    FlyingEnemy(int hp) : Entity(hp) {
        std::cout << "FlyingEnemy コンストラクタ\\n";
    }
};

class ShootingEnemy : virtual public Entity {
public:
    ShootingEnemy(int hp) : Entity(hp) {
        std::cout << "ShootingEnemy コンストラクタ\\n";
    }
};

// 菱形継承だが、Entity は1つだけ実体化する
class BossShip : public FlyingEnemy, public ShootingEnemy {
public:
    // ⚠️ 最派生クラスが Entity(hp) を直接明示的に初期化しなければならない！
    // FlyingEnemy や ShootingEnemy に書かれた Entity(hp) は完全に無視される！
    BossShip(int hp) 
        : Entity(hp), FlyingEnemy(hp), ShootingEnemy(hp) {
        std::cout << "BossShip コンストラクタ\\n";
    }

    void showHp() {
        // 曖昧さなし！直接 hp_ にアクセス可能
        std::cout << "単一に統合されたHP: " << hp_ << "\\n";
    }
};

int main() {
    std::cout << "=== 仮想継承の動作実験 ===\\n";
    BossShip boss(1000);
    // Entity のコンストラクタは正確に「1回だけ」呼ばれる
    boss.showHp();

    std::cout << "sizeof(BossShip) = " << sizeof(BossShip) << " バイト\\n";

    return 0;
}`
        }
      ],
      umlDiagram: {
        diagramType: 'class',
        title: '菱形継承アンチパターン vs 現代の合成（Composition）アーキテクチャ',
        description: '多重継承に頼る左側の菱形継承構造は、クラス関係が密結合で破綻します。右側のコンポジション構造は、EntityがComponentを所有（has-a）することで、柔軟でテスト容易な設計を実現します。',
        classes: [
          {
            name: 'EntityBase',
            stereotype: 'Base',
            attributes: [
              { name: 'hp_', type: 'int', visibility: '+', codeLineRef: { filename: 'DiamondProblemDemo.cpp', line: 6, keyword: 'hp_' } }
            ],
            operations: []
          },
          {
            name: 'FlyingEnemy',
            stereotype: 'AntiPattern',
            attributes: [
              { name: 'flySpeed_', type: 'float', visibility: '+', codeLineRef: { filename: 'DiamondProblemDemo.cpp', line: 15, keyword: 'flySpeed_' } }
            ],
            operations: []
          },
          {
            name: 'ShootingEnemy',
            stereotype: 'AntiPattern',
            attributes: [
              { name: 'ammo_', type: 'int', visibility: '+', codeLineRef: { filename: 'DiamondProblemDemo.cpp', line: 22, keyword: 'ammo_' } }
            ],
            operations: []
          },
          {
            name: 'BadBossShip',
            stereotype: 'Diamond Death',
            attributes: [],
            operations: [
              { name: 'takeDamage()', type: 'void', visibility: '+', codeLineRef: { filename: 'DiamondProblemDemo.cpp', line: 35, keyword: 'takeDamage' } }
            ]
          },
          {
            name: 'CleanBossEntity',
            stereotype: 'Modern Clean',
            attributes: [
              { name: 'hp_', type: 'int', visibility: '-', codeLineRef: { filename: 'VirtualInheritanceDemo.cpp', line: 6, keyword: 'hp_' } }
            ],
            operations: [
              { name: 'update()', type: 'void', visibility: '+', codeLineRef: { filename: 'VirtualInheritanceDemo.cpp', line: 36, keyword: 'showHp' } }
            ]
          },
          {
            name: 'IFlightComponent',
            stereotype: 'Component',
            attributes: [],
            operations: [
              { name: 'updateFlight()', type: 'void', visibility: '+', isVirtual: true }
            ]
          },
          {
            name: 'IWeaponComponent',
            stereotype: 'Component',
            attributes: [],
            operations: [
              { name: 'fire()', type: 'void', visibility: '+', isVirtual: true }
            ]
          }
        ],
        relations: [
          {
            from: 'FlyingEnemy',
            to: 'EntityBase',
            type: 'generalization',
            label: 'extends'
          },
          {
            from: 'ShootingEnemy',
            to: 'EntityBase',
            type: 'generalization',
            label: 'extends'
          },
          {
            from: 'BadBossShip',
            to: 'FlyingEnemy',
            type: 'generalization',
            label: '多重継承 (Diamond)'
          },
          {
            from: 'BadBossShip',
            to: 'ShootingEnemy',
            type: 'generalization',
            label: '多重継承 (Diamond)'
          },
          {
            from: 'CleanBossEntity',
            to: 'IFlightComponent',
            type: 'composition',
            label: 'has-a (部品合成)'
          },
          {
            from: 'CleanBossEntity',
            to: 'IWeaponComponent',
            type: 'composition',
            label: 'has-a (部品合成)'
          }
        ],
        codeMappingNotes: [
          'BadBossShip は EntityBase を2つの経路から多重継承してしまい、メンバ変数が重複して破綻します。',
          'CleanBossEntity は単一責任の原則に従い、飛行能力や攻撃能力を Component として所有（has-a）します。',
          'Unreal Engine の ActorComponent や Unity の MonoBehaviour と同様、現代の商用ゲームエンジンはすべてこの合成モデルを採用しています。'
        ]
      }
    }
  ],
  quiz: [
    {
      id: 'q-l9-1',
      question: '共通基底クラス Entity を持つ ClassA と ClassB を多重継承して ClassC を作成した際、コンパイル時に「Ambiguous（曖昧）」エラーが発生する根本的な理由は何でしょうか？',
      options: [
        'C++コンパイラは多重継承を一切サポートしていないため',
        'ClassC のインスタンス内部に Entity のメンバ変数が2重に実体化してしまい、どちらの変数を指しているか特定できないから',
        '多重継承を行うとクラス名が長くなりすぎてコンパイラのメモリが枯渇するから',
        'ClassA と ClassB のファイル名が異なっているから'
      ],
      correctIndex: 1,
      explanation: '正解は「ClassC のインスタンス内部に Entity のメンバ変数が2重に実体化してしまい、どちらの変数を指しているか特定できないから」です。C++の単純な多重継承では、それぞれの継承パスごとに独立して基底クラスの実体がメモリ内に作成されます。そのため hp や id などの基底メンバにアクセスしようとすると、どちらの実体を指すのか曖昧になりコンパイルエラーとなります。'
    },
    {
      id: 'q-l9-2',
      question: '`class Derived : public BaseA, public BaseB` という多重継承において、`Derived* pD = new Derived();` を `BaseB* pB = pD;` へアップキャストした時、ポインタのアドレス値には何が起こるでしょうか？',
      options: [
        'ポインタのアドレス値は全く変化せず、pD と完全に同一のアドレスを指す',
        'コンパイラが裏でBaseAのサイズ分のオフセットを加算し、BaseBのサブオブジェクトが配置されているアドレスへと自動補正される',
        'アドレスが 0 (nullptr) にリセットされる',
        '実行時エラーが発生して即座にプログラムがクラッシュする'
      ],
      correctIndex: 1,
      explanation: '正解は「コンパイラが裏でBaseAのサイズ分のオフセットを加算し、BaseBのサブオブジェクトが配置されているアドレスへと自動補正される」です。Derived オブジェクトのメモリ先頭には第1基底の BaseA が配置され、第2基底の BaseB はその直後に配置されます。そのため BaseB のメンバ関数が正しい this を受け取れるよう、キャスト時にコンパイラが自動でアドレスをオフセット分ずらす命令（thisポインタ調整）を実行します。'
    },
    {
      id: 'q-l9-3',
      question: '仮想基底クラス（`virtual public Entity`）を用いて菱形継承の2重実体化を解消した場合、クラスの初期化に関して発生する制約（仕様）はどれでしょうか？',
      options: [
        '基底クラスのコンストラクタは引数を一切取ることができなくなる',
        '最派生クラス（末尾のクラス）が、仮想基底クラスのコンストラクタを直接明示的に呼び出す責任を持つ',
        '仮想基底クラスのデストラクタを virtual にしてはならない',
        'すべてのコンストラクタを private にしなければならない'
      ],
      correctIndex: 1,
      explanation: '正解は「最派生クラス（末尾のクラス）が、仮想基底クラスのコンストラクタを直接明示的に呼び出す責任を持つ」です。仮想継承では基底クラスの実体が1つしかないため、中間の親クラスによる初期化は無視され、最派生クラスが直々に仮想基底クラスのコンストラクタを呼び出さなければなりません。これにより親クラスによる初期化の実装隠蔽（カプセル化）が崩壊するという設計上の大きな代償を負うことになります。'
    },
    {
      id: 'q-l9-4',
      question: '現代のゲーム開発やソフトウェア設計において、多重継承（特に実装の多重継承）を原則禁止し、「継承より合成（Composition over Inheritance）」が推奨される最大の理由は何でしょうか？',
      options: [
        '合成（has-a）を使うことで、菱形継承の罠やthisポインタ調整の複雑さを完全排除し、振る舞いを部品として柔軟に着脱・テストできるから',
        '合成を使うとC++のコンパイル速度が100倍以上高速になるから',
        '多重継承を使うとCPUのハードウェアが物理的に故障するリスクがあるから',
        'モダンC++規格では class キーワードが廃止されたから'
      ],
      correctIndex: 0,
      explanation: '正解は「合成（has-a）を使うことで、菱形継承の罠やthisポインタ調整の複雑さを完全排除し、振る舞いを部品として柔軟に着脱・テストできるから」です。「空を飛ぶ」「弾を撃つ」といった振る舞いは親子関係（is-a）ではなく部品（has-a）として設計することで、オブジェクトの独立性を保ち、ダイヤモンド継承の死や不要な依存関係の肥大化を根本から防ぐことができます。'
    }
  ],
  prevChapterSlug: 'chapter-8-function-pointers-callbacks',
  nextChapterSlug: 'chapter-10-static-polymorphism-crtp'
};
