import { Chapter } from '../../types/curriculum';

export const DESIGN_PATTERNS_COLUMN: Chapter = {
  id: 107,
  slug: 'column-design-patterns',
  category: 'column',
  courseTrack: 'guide',
  courseChapterCode: 'COL1',
  title: '【特別コラム】現場で役立つデザインパターン入門 〜GoFの知恵と現代C++の設計美学〜',
  subtitle: '「そもそも何のためにあるのか？」から典型3分類の実装コード、モダンC++でのスマートな進化と過剰設計の罠まで',
  badge: '特別コラム：デザインパターン',
  gameVersion: 'none',
  description: '「デザインパターンという言葉は聞くけれど、なぜ必要なのか？」「いつ、どう使えばいいのか？」という疑問に答えます。建築思想からGoF（Gang of Four）による23パターンへの系譜、オブジェクト指向設計の原則（SOLID）、そして現場で頻出する代表的パターン（Singleton, Factory Method, Adapter, Strategy, Observer）を、C++の具体例コード付きで徹底解説。さらにモダンC++でのスマートな実装法や、初心者が陥りがちな「パターン中毒（過剰設計）」への処方箋までを体系化しました。',
  sections: [
    {
      id: 'sec-what-is-design-pattern',
      title: '1. そもそもデザインパターンとは何か？ 〜先人たちの「名前付き知恵袋」〜',
      leadText: 'デザインパターンとは、単なる難解なプログラミング構文ではありません。先輩プログラマたちが幾多の失敗とリファクタリングの末に見出した「再利用可能な設計の定石（ベストプラクティス）」です。',
      dialogueBefore: [
        {
          id: 'dlg-dp-1',
          speaker: 'penguin',
          emotion: 'question',
          text: '指導官！プログラミングの記事や設計レビューを見ていると、「ここはStrategyパターンにしよう」とか「Singletonを使おう」といった単語が頻繁に出てきます。これってC++の新しい機能やライブラリの名前なんですか？',
        },
        {
          id: 'dlg-dp-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '良い着眼点じゃな、ピピン！デザインパターンは言語機能やライブラリの固有名詞ではない。オブジェクト指向プログラミングにおいて「頻出する問題」に対して、先人たちが編み出した【優れた設計の型紙（ひな形）】のことじゃ。',
        },
        {
          id: 'dlg-dp-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '設計の型紙……？型紙があると、何が嬉しいんでしょうか？自分なりに動くコードが書けていれば、それで十分な気もするのですが……。',
        },
        {
          id: 'dlg-dp-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ふふふ。「動くコード」と「変更に耐えられるコード」は全く別物なんじゃ。それに、パターンを知る最大のメリットは【プログラマ同士の超高速な意思疎通（共通言語）】にある。まずはその歴史と価値から紐解いていこう！',
        },
      ],
      explanationText: `
### 1.1 起源と歴史：建築からソフトウェアへ、そしてGoFの誕生

「デザインパターン」という概念は、実はプログラミングの世界で生まれたものではありません。
1970年代、都市計画家・建築家である**クリストファー・アレグザンダー（Christopher Alexander）**が、「住みやすい街や建物には、共通して繰り返し現れる空間のパターンがある」と提唱したのが発端です。

これをソフトウェア設計に応用し、1994年に世界的ベストセラーとなった名著が：
> **『オブジェクト指向における再利用のためのデザインパターン』**
> （原題: *Design Patterns: Elements of Reusable Object-Oriented Software*）

著者の4人（エリック・ガンマ、リチャード・ヘルム、ラルフ・ジョンソン、ジョン・ブリシディース）は親愛と敬意を込めて**「GoF（Gang of Four: 4人のギャング）」**と呼ばれ、彼らがまとめた**23種類の設計パターン**が、現代のソフトウェア設計の共通規格となりました。

---

### 1.2 なぜデザインパターンが必要なのか？（3大メリット）

初心者は「動けば何でもいい」と考えがちですが、開発規模が大きくなると「仕様変更」という荒波が押し寄せます。デザインパターンを学ぶ本質的な理由は3つあります。

#### ① 車輪の再発明と地雷の回避
ソフトウェアの歴史において、先人たちもあなたと全く同じ「仕様追加でコードがスパゲティ化する」「1箇所直したら無関係な場所が壊れた」という地雷を踏んできました。
デザインパターンは、その地雷原を安全に迂回するための**「検証済みの舗装道路」**です。

#### ② チームの共通言語（共通ボキャブラリー）の獲得
これこそが現場で最も絶大な恩恵です。

- **パターンを知らない会話**:
  > 「Aクラスの中にBとCのインスタンス生成を直書きすると差し替えが大変だから、生成用の別クラスを作って、そこから共通基底クラスのポインタを返すようにして、呼び出し側は具象型を知らないようにしよう」
- **パターンを知っている会話**:
  > 「ここは **Factory Method** にしよう」

たった一言で、設計の意図・構造・依存関係がチーム全員の頭に寸分違わず共有されます。意思疎通のコストが劇的に下がるのです。

#### ③ オブジェクト指向の原則（SOLID）の具現化
優れたコードの原則として有名な**SOLID原則**（特に「開放閉鎖原則: OCP」や「依存性逆転原則: DIP」）。これらを「スローガン」で終わらせず、**「具体的にどうクラスを組めば実現できるのか？」という答えのカタログ**こそがデザインパターンなのです。
      `,
    },
    {
      id: 'sec-three-categories',
      title: '2. デザインパターンの3大分類 〜目的別に整理する23の地図〜',
      leadText: 'GoFの23パターンは、その役割と目的によって「生成（Creational）」「構造（Structural）」「振る舞い（Behavioral）」の3つの大グループに体系化されています。',
      dialogueBefore: [
        {
          id: 'dlg-dp-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: '23個も！？指導官、新米の僕が23個全部を今すぐ暗記しなきゃいけないんでしょうか…？名前を見るだけでめまいが…！',
        },
        {
          id: 'dlg-dp-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '安心せい！23個すべてを暗記する必要はまったくない。ベテランエンジニアでも日常的に使うのはそのうちの5〜7個程度じゃ。大事なのは「丸暗記」ではなく「3つの役割（分類）」の感覚を掴むことじゃよ！',
        },
      ],
      explanationText: `
### デザインパターン 3大分類の鳥瞰図

| 分類 | 目的（何を解決するか？） | 代表的なGoFパターン |
| :--- | :--- | :--- |
| **生成に関するパターン**<br>*(Creational)* | オブジェクトの**「インスタンス化（new）」**を柔軟にし、具象クラスとの結合度を下げる | **Singleton**, **Factory Method**, Abstract Factory, Builder, Prototype |
| **構造に関するパターン**<br>*(Structural)* | クラスやオブジェクトを組み合わせて、**柔軟で大きな構造**をすっきりと組み立てる | **Adapter**, **Composite**, Decorator, Facade, Proxy, Bridge, Flyweight |
| **振る舞いに関するパターン**<br>*(Behavioral)* | オブジェクト同士の**「連携・メッセージ伝達・役割分担」**を整理し、変更を局所化する | **Strategy**, **Observer**, **State**, Command, Template Method, Iterator, Visitor |

---

### 各分類の直感的イメージ

\`\`\`
【生成系 (Creational)】
  「どう生み出すか？」
  直接 new するのをやめ、生成方法を隠蔽したり、唯一の存在を保証する。
      例: モンスター生成工場、設定データの唯一インスタンス

【構造系 (Structural)】
  「どう繋ぎ合わせるか？」
  形の合わないインターフェースを変換したり、部品を束ねて1つのように見せる。
      例: 古いライブラリの変換プラグ、フォルダとファイルの階層管理

【振る舞い系 (Behavioral)】
  「どう動かし合うか？」
  アルゴリズムを部品化して差し替えたり、状態変化を仲間に一斉通知する。
      例: AIの行動パターンの差し替え、イベント通知リスナー
\`\`\`
      `,
    },
    {
      id: 'sec-typical-patterns-cpp',
      title: '3. 現場で頻出する典型的パターンとC++コード実践',
      leadText: '実務・ゲーム開発で「これだけは絶対に押さえておくべき」と言える超重要パターンを、C++の具体的コードとともにマスターしましょう。',
      explanationText: `
### ① 【生成系】Meyers' Singleton（シングルトン）

#### 目的と使いどころ
- **目的**: プログラム全体で**「絶対に1つだけしか存在しないインスタンス」**を保証し、どこからでもアクセスできるようにする。
- **使いどころ**: 設定ファイル管理（ConfigManager）、オーディオエンジン（SoundManager）、ログ記録（Logger）など。

#### C++におけるベストプラクティス（Meyers' Singleton）
かつてのC++03では、スレッドセーフにするために複雑な二重チェックロッキング（Double-Checked Locking）を書く必要がありました。しかし**C++11以降では、「関数の静的ローカル変数の初期化はスレッドセーフである」という言語仕様（Magic Static）が定められました**。
これを利用したのが、名著『Effective C++』の著者スコット・メイヤーズが提唱した**「Meyers' Singleton」**です。

\`\`\`cpp
#include <iostream>
#include <string>

class SoundManager {
public:
    // コピーと代入を明示的に禁止（唯一性の担保）
    SoundManager(const SoundManager&) = delete;
    SoundManager& operator=(const SoundManager&) = delete;
    SoundManager(SoundManager&&) = delete;
    SoundManager& operator=(SoundManager&&) = delete;

    // 唯一のインスタンスを取得する静的関数
    static SoundManager& getInstance() {
        // C++11規格により、初回呼び出し時にスレッドセーフに1度だけ初期化される
        static SoundManager instance;
        return instance;
    }

    void playBgm(const std::string& trackName) {
        std::cout << "♪ BGM再生中: " << trackName << std::endl;
    }

private:
    // コンストラクタを private にして外部からの直接生成を禁止
    SoundManager() {
        std::cout << ">> SoundManager 初期化完了" << std::endl;
    }
    ~SoundManager() = default;
};

// 使い方
int main() {
    // どこからでも同じインスタンスにアクセスできる
    SoundManager::getInstance().playBgm("battle_theme.ogg");
    SoundManager::getInstance().playBgm("victory_fanfare.ogg");
    return 0;
}
\`\`\`

---

### ② 【生成系】Factory Method（ファクトリメソッド）

#### 目的と使いどころ
- **目的**: 呼び出し元が具象クラス名（\`new Goblin()\`, \`new Dragon()\`）を直接記述するのを避け、**生成ロジックを分離・隠蔽**する。
- **使いどころ**: マップ上の敵キャラクターの動的出現、ファイル拡張子に応じた画像ローダーの選択。

\`\`\`cpp
#include <iostream>
#include <memory>
#include <string>

// 共通インターフェース
class Monster {
public:
    virtual ~Monster() = default;
    virtual void attack() = 0;
};

class Slime : public Monster {
public:
    void attack() override { std::cout << "スライムが体当たりしてきた！（弱）" << std::endl; }
};

class Dragon : public Monster {
public:
    void attack() override { std::cout << "ドラゴンが灼熱の炎を吐いた！（強）" << std::endl; }
};

// ファクトリ（生成クラス）
class MonsterFactory {
public:
    // C++11以降は生ポインタではなく std::unique_ptr を返すのが鉄則
    static std::unique_ptr<Monster> createMonster(const std::string& type) {
        if (type == "slime") {
            return std::make_unique<Slime>();
        } else if (type == "dragon") {
            return std::make_unique<Dragon>();
        }
        return nullptr;
    }
};

// 使い方：呼び出し側は具体的な Slime や Dragon の型定義を知る必要がない
int main() {
    auto m1 = MonsterFactory::createMonster("slime");
    if (m1) m1->attack();

    auto m2 = MonsterFactory::createMonster("dragon");
    if (m2) m2->attack();

    return 0;
}
\`\`\`

---

### ③ 【構造系】Adapter（アダプタ）

#### 目的と使いどころ
- **目的**: 「中身の機能は使いたいが、インターフェース（関数名や引数）が合わない」既存のクラスを、**変換プラグを噛ませて目的のインターフェースに適合**させる。
- **使いどころ**: レガシーな古い自社コードや、外部サードパーティ製ライブラリを自社システムの設計に合わせて組み込みたいとき。

\`\`\`cpp
#include <iostream>
#include <memory>

// 自社ゲームエンジンが要求する最新インターフェース
class IModernAudio {
public:
    virtual ~IModernAudio() = default;
    virtual void playAudio(float volume) = 0;
};

// 導入したい外部の古いレガシー音源ライブラリ（改変不可）
class LegacySoundLib {
public:
    // 関数名も引数（0-100の整数）も自社規格と合わない！
    void execute_sound_playback(int volumePercent) {
        std::cout << "[Legacy Lib] 音声再生 Volume: " << volumePercent << "%" << std::endl;
    }
};

// アダプタ：両者の溝を埋める変換プラグ
class AudioAdapter : public IModernAudio {
private:
    LegacySoundLib m_legacyLib; // 委譲（合成）で保持
public:
    void playAudio(float volume) override {
        // float(0.0f - 1.0f) を int(0 - 100) に変換して仲介
        int convertedVol = static_cast<int>(volume * 100.0f);
        m_legacyLib.execute_sound_playback(convertedVol);
    }
};

int main() {
    // クライアントコードは IModernAudio だけを見て操作できる
    std::unique_ptr<IModernAudio> audio = std::make_unique<AudioAdapter>();
    audio->playAudio(0.85f); // 内部で変換されて古いライブラリが動く！
    return 0;
}
\`\`\`

---

### ④ 【振る舞い系】Strategy（ストラテジー）

#### 目的と使いどころ
- **目的**: アルゴリズム（戦略・計算方法・AI思考など）をクラスとして部品化し、**実行時に自由自在に差し替え可能**にする。
- **使いどころ**: キャラクターの移動・攻撃アルゴリズム、ゲームの難易度別AIルーチン、決済処理方式（クレカ/PayPay/現金）の切り替え。

\`\`\`cpp
#include <iostream>
#include <memory>

// 戦略インターフェース
class AttackStrategy {
public:
    virtual ~AttackStrategy() = default;
    virtual void executeAttack() = 0;
};

// 具体的な戦略A: 近接剣撃
class SwordAttack : public AttackStrategy {
public:
    void executeAttack() override { std::cout << "剣を激しく振り下ろした！ [近接物理]" << std::endl; }
};

// 具体的な戦略B: 遠距離魔法
class MagicAttack : public AttackStrategy {
public:
    void executeAttack() override { std::cout << "巨大な火球を撃ち放った！ [遠距離魔法]" << std::endl; }
};

// 戦略を利用するキャラクター
class Player {
private:
    std::unique_ptr<AttackStrategy> m_strategy;
public:
    void setStrategy(std::unique_ptr<AttackStrategy> strategy) {
        m_strategy = std::move(strategy);
    }

    void attack() {
        if (m_strategy) {
            m_strategy->executeAttack();
        }
    }
};

int main() {
    Player player;

    // 状況に応じて戦略を切り替える
    player.setStrategy(std::make_unique<SwordAttack>());
    player.attack(); // 剣攻撃

    player.setStrategy(std::make_unique<MagicAttack>());
    player.attack(); // 魔法攻撃に即座に変化！

    return 0;
}
\`\`\`

#### 💡 モダンC++での進化：\`std::function\` によるクラスレスStrategy
モダンC++（C++11以降）では、わざわざ基底クラスや派生クラスを作らなくても、\`std::function\` とラムダ式を使うことで**超軽量にStrategyパターンを実現**できます！

\`\`\`cpp
#include <iostream>
#include <functional>

class ModernPlayer {
public:
    // 関数オブジェクトとして戦略を保持（仮想関数のボイラープレートが不要！）
    using AttackFunc = std::function<void()>;

    void setAttackAction(AttackFunc action) {
        m_attackAction = action;
    }

    void attack() {
        if (m_attackAction) m_attackAction();
    }
private:
    AttackFunc m_attackAction;
};

int main() {
    ModernPlayer player;
    // ラムダ式でその場で戦略を渡せる！
    player.setAttackAction([]() { std::cout << "弓矢で精密射撃！" << std::endl; });
    player.attack();
    return 0;
}
\`\`\`
      `,
    },
    {
      id: 'sec-modern-cpp-and-antipatterns',
      title: '4. モダンC++での進化と「パターン中毒（過剰設計）」の罠',
      leadText: 'デザインパターンは強力な武器ですが、使い方を誤るとコードベースを破滅させる「毒」にもなります。',
      dialogueBefore: [
        {
          id: 'dlg-dp-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: '指導官……実は告白があります。パターンを学んで嬉しくなって、たった10行で済むプログラムにFactoryとSingletonとObserverを全部組み込んだら、クラスが8個に増えて、自分でも何がどこで動いているのか分からなくなってしまいました……。',
        },
        {
          id: 'dlg-dp-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！誰もが一度は通る通過儀礼じゃな！それを業界では【黄金のハンマー症候群】や【パターン中毒（Patternitis）】と呼ぶ。「手元に金槌があると、目に入るすべてのものが釘に見えて叩きたくなる」という心理じゃ！',
        },
      ],
      explanationText: `
### 4.1 パターン中毒と「過剰設計（Over-engineering）」の恐怖

デザインパターンを覚えたての新人が最も陥りやすいのが**「過剰な抽象化」**です。

- 「将来、敵の種類が100種類に増えるかもしれないからFactoryを作っておこう」
- 「将来、画面出力先がVRになるかもしれないからBridgeとAdapterを挟んでおこう」

その結果、**「実際には敵は2種類しか出ず、VRにも対応しなかった」**というオチになり、残ったのは**無駄に難解でステップ実行すらままならない迷宮コード**です。

> **設計の鉄則: YAGNI原則（You Aren't Gonna Need It）**
> 「今必要な最小限のシンプルさで作れ。将来必要になったその時に、初めてリファクタリングしてパターンを適用すればよい」

---

### 4.2 C++特有の落とし穴：GoFパターンと実行時コスト（vtable・ヒープ）

GoFのデザインパターン原著（1994年）は、主に**SmalltalkやJava**といった「すべてがオブジェクト参照であり、ガベージコレクション前提」の言語思想の影響を強く受けています。

しかし、**C++は「ゼロオーバーヘッド原則」を信条とするハイパフォーマンス言語**です。C++でGoFパターンを額面通りに適用すると、以下の代償を支払うことになります。

1. **仮想関数テーブル（vtable）間接参照のコスト**:
   - すべてのパターンを基底クラスの \`virtual\` 関数で実装すると、CPUのインライン展開が阻害され、分岐予測ミスやキャッシュミスを誘発します。
2. **頻繁なヒープ割り当て（\`new\` / \`make_unique\`）**:
   - 小さなオブジェクトをヒープ上にばら撒くと、メモリ断片化とキャッシュ局所性の低下を招きます。

#### 🚀 モダンC++流の解決アプローチ

| 伝統的GoFのアプローチ | モダンC++（C++17/20）のアプローチ | メリット |
| :--- | :--- | :--- |
| **動的ポリモーフィズム**<br>(\`virtual\` 関数 + 継承) | **静的ポリモーフィズム**<br>(テンプレート, コンセプト, CRTP) | 仮想関数呼び出しコストゼロ。コンパイル時インライン化で爆速 |
| **Strategy パターン**<br>(具象戦略クラスを多数作成) | **\`std::function\` や ラムダ式** | クラス定義不要。コードが短く見通しが良い |
| **Visitor パターン**<br>(複雑なダブルディスパッチ) | **\`std::variant\` + \`std::visit\`** | 継承関係のない安全な型安全パターンマッチング |
| **Singleton パターン**<br>(グローバル可視性・単一インスタンス) | **依存性注入（DI: 参照渡し）** | テスタビリティが向上し、隠れた大域結合を防げる |
      `,
    },
    {
      id: 'sec-summary-checklist',
      title: '5. まとめ：良い設計者のためのチェックリスト',
      leadText: 'パターンは「暗記して崇める呪文」ではなく、先人と対話するための「道具箱」です。',
      explanationText: `
### パターン適用前のセルフチェックリスト

コードを書くとき、以下の質問を自分に投げかけてみてください。

- [ ] **Q1. その抽象化は「今」必要か？**
  - 単なる妄想の将来予測（YAGNI違反）ではないか？
- [ ] **Q2. 2〜3回の重複が実際に発生したか？**
  - 最初からパターンを当てはめるのではなく、まずはシンプルに書き、重複や仕様変更の痛みを感じた瞬間に適用するのがベスト（Rule of Three）。
- [ ] **Q3. C++の性能要件を満たしているか？**
  - ゲームの毎フレーム60FPSで呼ばれるタイトなループ内で、不用意に仮想関数やヒープ割り当てを行っていないか？
- [ ] **Q4. チーム全員がその意図を理解できるか？**
  - 自己満足のトリッキーなコードになっていないか？

### シロクマ指導官の金言
> 「デザインパターンを知っている者は、設計のボキャブラリーが豊富である。
> だが**真に優れた設計者とは、『パターンを使わずに済むなら、どこまでもシンプルに書く』ことができる者**である。」
      `,
      dialogueAfter: [
        {
          id: 'dlg-dp-9',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'なるほど！パターンは偉ぶるための道具じゃなくて、変更の痛みを減らし、仲間とスムーズに会話するための共通言語だったんですね。道具に振り回されず、まずはシンプルに書いて必要になったら適用してみます！',
        },
        {
          id: 'dlg-dp-10',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'うむ、素晴らしい悟りじゃ！基本の Singleton, Factory, Strategy, Observer を道具箱のポケットに入れておけば、現場の設計レビューも怖くなくなるぞ。自信を持って進むのじゃ！',
        },
      ],
      takeaways: [
        {
          title: 'パターンの本質は「共通言語」',
          description: '設計の意図を一言でチームに伝え、車輪の再発明と地雷を回避するための先人の知恵袋。',
          icon: '🗣️',
        },
        {
          title: '典型3大分類を押さえる',
          description: '生成系（Singleton, Factory）、構造系（Adapter）、振る舞い系（Strategy, Observer）の役割の違いを理解する。',
          icon: '🗺️',
        },
        {
          title: 'モダンC++で賢く使う',
          description: '仮想関数の濫用に注意し、std::function やテンプレート、ラムダ式を組み合わせたゼロオーバーヘッドな適用を意識する。',
          icon: '⚡',
        },
        {
          title: 'パターン中毒（過剰設計）に注意',
          description: 'YAGNI原則を胸に、まずはシンプルに書き、必要性が生じたタイミングでリファクタリングする。',
          icon: '🛡️',
        },
      ],
    },
  ],
};
