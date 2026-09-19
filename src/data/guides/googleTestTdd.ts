import { Chapter } from '../../types/curriculum';

export const GOOGLE_TEST_TDD_GUIDE: Chapter = {
  id: 104,
  slug: 'guide-googletest-tdd',
  category: 'guide',
  courseTrack: 'guide',
  courseChapterCode: 'G5',
  title: '品質保証特集：GoogleTest（gtest）とTDD（テスト駆動開発）実践入門',
  subtitle: '「動かすまでバグが分からない」からの脱却！CI/CDで壊れない堅牢なC++設計とテスト技法',
  badge: '品質保証・TDD特集',
  description: 'C++現場で必須とされるユニットテストフレームワーク「GoogleTest（gtest）」の導入・記述法と、テスト駆動開発（TDD）のRed-Green-Refactorサイクルを徹底解説。テスト容易性の高い疎結合設計（DI: 依存性注入）の真髄を学びます。',
  gameVersion: 'none',
  sections: [
    {
      id: 'why-cpp-unit-test',
      title: '4.1 なぜC++こそユニットテストと自動テストが不可欠なのか？',
      leadText: '手動テスト頼みのC++開発は破滅を招きます。メモリ破壊・未定義動作・リファクタリングの恐怖に立ち向かう唯一の武器が自動テストです。',
      dialogueBefore: [
        {
          id: 'dlg-gt-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ指導官……！ちょっと当たり判定の計算式を綺麗に直しただけなのに、なぜか敵のHPがマイナスになっても死ななくなって、ゲームがクラッシュしてしまいました……。手動で何回もゲームをプレイして確認するの、本当に限界です……！',
        },
        {
          id: 'dlg-gt-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ、痛いほど分かるぞ。C++はPythonやJavaのような実行時例外ガードが薄く、些細なバグが「メモリ破壊」や「未定義動作」という最悪の形で吹き飛ぶ。だからこそ、プロの現場では【手動プレイでの動作確認】ではなく【ミリ秒単位で何千回も走る自動ユニットテスト】をビルドパイプライン（CI）に組み込むのが絶対常識なのじゃ！',
        },
      ],
      explanationText: `
### 手動テスト vs 自動ユニットテストの決定的な違い

| 項目 | 手動テスト（デバッグプレイ） | 自動ユニットテスト（GoogleTest） |
| :--- | :--- | :--- |
| **実行速度** | 1回あたり数分〜数十分 | **1000件で数秒〜ミリ秒単位** |
| **網羅性** | 人間の注意力に依存（見落とし多発） | **境界値・異常系を100%機械的に検証** |
| **リファクタ耐性** | 「動いているコードは怖くて触れない」 | **テストが通れば「壊れていない」と即座に確信** |
| **CI/CD連携** | 不可能（人間の目視が必要） | **Gitプッシュ時にGitHub Actions等で自動実行** |

### C++における「テスト容易性（Testability）」が設計を美しくする
テストが書きにくいコードは、例外なく**「密結合（Spaghetti Code）」**です。
- グローバル変数に依存していると、テストごとに状態をリセットできない。
- 他のクラスを \`new\` で直結していると、テスト対象だけを切り離せない。
テストを書こうとすること自体が、クラスを「疎結合」かつ「明確な責務」へと強制的に進化させる最高の設計指針になります。
      `,
      takeaways: [
        {
          title: 'テストは「後付けの検品」ではなく「設計の羅針盤」',
          description: 'テストを書きやすいように関数やクラスの引数を整えることで、自然と依存性が下がり再利用性の高いコードが生まれます。',
        },
      ],
    },
    {
      id: 'googletest-basics',
      title: '4.2 GoogleTest（gtest）の基本文法：ASSERT vs EXPECT',
      leadText: '世界標準のC++テストフレームワーク GoogleTest の中核マクロと、テストケースの書き方をマスターします。',
      dialogueBefore: [
        {
          id: 'dlg-gt-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'GoogleTestって、どうやって合否を判定するんですか？ `assert()` みたいなものですか？',
        },
        {
          id: 'dlg-gt-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'いい質問じゃ！gtestには主に `EXPECT_*` と `ASSERT_*` の2種類のアサーションがある。この2つの使い分けこそが最初の重要関門じゃぞ！',
        },
      ],
      explanationText: `
### EXPECT_* と ASSERT_* の違い

1. **\`EXPECT_EQ(val1, val2)\` / \`EXPECT_TRUE(cond)\` (非致命的失敗)**:
   - 検証に失敗しても、**そのテスト関数の次の行以降の検証を続行**します。
   - 1つのテストケース内で複数の項目（X座標とY座標の両方など）を一度にチェックしたい場合に最適です。

2. **\`ASSERT_EQ(val1, val2)\` / \`ASSERT_NE(ptr, nullptr)\` (致命的失敗)**:
   - 検証に失敗した場合、**そのテスト関数の実行を即座に中断（abort）**します。
   - ポインタが \`nullptr\` でないことを確かめてからメンバアクセスする場合など、失敗したまま進むとセグフォを起こす箇所で使用します。

\`\`\`cpp
#include <gtest/gtest.h>

// テスト対象の関数
int add(int a, int b) { return a + b; }

// TEST(テストグループ名, テスト名)
TEST(MathTest, AddPositiveNumbers) {
    EXPECT_EQ(add(2, 3), 5);
    EXPECT_EQ(add(0, 0), 0);
}

TEST(PointerTest, SafeDereference) {
    int* ptr = getResource();
    // ptrがnullならここで即時中断（ヌルポインタ参照クラッシュを防止）
    ASSERT_NE(ptr, nullptr);
    EXPECT_EQ(*ptr, 42);
}
\`\`\`
      `,
      takeaways: [
        {
          title: '基本は EXPECT_*、ポインタ前提は ASSERT_*',
          description: '可能な限り多くの失敗情報を一度に集めるために普段は EXPECT_* を使い、後続処理がクラッシュする危険がある場合のみ ASSERT_* を使います。',
        },
      ],
    },
    {
      id: 'tdd-cycle',
      title: '4.3 TDD（テスト駆動開発）の神髄：Red -> Green -> Refactor',
      leadText: '実装コードを1行も書く前に、まず「失敗するテスト」を書く！この逆転の発想がバグの混入をゼロにします。',
      dialogueBefore: [
        {
          id: 'dlg-gt-5',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'えっ！？プログラムを書く前にテストを書くんですか！？まだ関数の中身が存在しないのに、どうやってテストを動かすんですか！？',
        },
        {
          id: 'dlg-gt-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'カッカッカ！そこがミソなんじゃ！\nテストを先に書くということは、「この関数はどう呼ばれたいか？どんな引数で何を返すべきか？」という【利用者の視点（API仕様）】を強制的に固める作業なんじゃ。仕様が決まってから中身を作る。これがTDDの真髄じゃ！',
        },
      ],
      explanationText: `
### TDDの3ステップサイクル

\`\`\`text
┌──► [1. Red] 失敗するテストを書く
│     └─ 仕様（API）を決め、テストが正しく「赤色（失敗）」になることを確認
│           │
│           ▼
│    [2. Green] 最短でテストを通すコードを書く
│     └─ ベタ書き・ハードコードでもOK！まずはテストを「緑色（成功）」に光らせる
│           │
│           ▼
│    [3. Refactor] テストが通った状態を維持してコードを整理する
│     └─ 重複排除・命名改善・最適化（自動テストがあるから怖くない！）
│           │
└───────────┘ (次の機能・仕様へ / 再び Red からサイクルを回す)
\`\`\`

#### インベーダー衝突判定の実例
\`\`\`cpp
// STEP 1: Red（まだ checkCollision の中身は空っぽ）
TEST(CollisionTest, BulletHitsInvader) {
    Bullet bullet(10, 5);
    Invader invader(10, 5);
    // 弾と敵が同座標なら true を返すべきという仕様テスト
    EXPECT_TRUE(checkCollision(bullet, invader));
}

// STEP 2: Green（テストを通す最小限の実装）
bool checkCollision(const Bullet& b, const Invader& i) {
    return b.getX() == i.getX() && b.getY() == i.getY();
}

// STEP 3: Refactor（サイズ判定や境界条件の追加・構造化）
\`\`\`
      `,
      takeaways: [
        {
          title: '「テストがパスした状態」という絶対的セーフティネット',
          description: 'テストコードがあるからこそ、大胆な設計改善（リファクタリング）を行っても既存の機能が壊れていないことを数秒で証明できます。',
        },
      ],
    },
    {
      id: 'testable-di-design',
      title: '4.4 テスト容易性を生み出す「依存性注入（DI）」パターン',
      leadText: 'ハードウェアや画面描画、時間に直結したコードはテストできません。インターフェースを挟んで外から注入する設計技法を学びます。',
      codeFiles: [
        {
          filename: 'ISoundEngine.h',
          language: 'cpp',
          description: 'サウンド再生の抽象インターフェース（テスト時はモックに差し替え可能）',
          code: `#pragma once

// サウンド機能の抽象インターフェース
class ISoundEngine {
public:
    virtual ~ISoundEngine() = default;
    virtual void playExplosion() = 0;
    virtual void playLaser() = 0;
};`
        },
        {
          filename: 'PlayerWithSound.h',
          language: 'cpp',
          description: 'ISoundEngine を外部から注入（DI）される設計の自機クラス',
          code: `#pragma once
#include "ISoundEngine.h"

class PlayerWithSound {
private:
    int m_x;
    int m_y;
    ISoundEngine& m_sound; // 具象ではなくインターフェースの参照を保持（DI）

public:
    PlayerWithSound(int x, int y, ISoundEngine& sound)
        : m_x(x), m_y(y), m_sound(sound) {}

    void shoot() {
        // 発射処理を行い、音を鳴らす
        m_sound.playLaser();
    }
};`
        },
        {
          filename: 'PlayerTest.cpp',
          language: 'cpp',
          isMain: true,
          description: 'GoogleTestを用いたユニットテストとモックの検証',
          code: `#include <gtest/gtest.h>
#include "PlayerWithSound.h"

// テスト用のダミー音響エンジン（モック）
class MockSoundEngine : public ISoundEngine {
public:
    int laserPlayCount = 0;
    int explosionPlayCount = 0;

    void playLaser() override {
        laserPlayCount++;
    }
    void playExplosion() override {
        explosionPlayCount++;
    }
};

// 自機の発射時にレーザー音が正確に1回要求されるかを検証するユニットテスト
TEST(PlayerTest, ShootPlaysLaserSoundExactlyOnce) {
    MockSoundEngine mockSound;
    PlayerWithSound player(10, 20, mockSound);

    // テスト前は再生回数0
    EXPECT_EQ(mockSound.laserPlayCount, 0);

    // 発射を実行
    player.shoot();

    // 正確に1回呼ばれたことを検証！本物のスピーカーがなくてもテスト完結！
    EXPECT_EQ(mockSound.laserPlayCount, 1);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}`
        }
      ],
      takeaways: [
        {
          title: '具象クラスに直接依存せず、インターフェースを参照する',
          description: 'スピーカーやファイルIO、ネットワークなどの外部リソースはインターフェース化して外から渡す（DI）ことで、テスト時に100%制御可能なモックに差し替えられます。',
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-gt-1',
      question: 'GoogleTestにおいて、EXPECT_EQ と ASSERT_EQ の決定的な動作の違いは何でしょう？',
      options: [
        'EXPECT_EQ は整数専用で、ASSERT_EQ は浮動小数点専用であること',
        'EXPECT_EQ は検証失敗後もテスト関数内の後続処理を続行するが、ASSERT_EQ は失敗した時点でそのテスト関数の実行を直ちに中断すること',
        'ASSERT_EQ は例外をスローするが、EXPECT_EQ はプログラム全体を即座にクラッシュさせること',
        'EXPECT_EQ はコンパイル時のみ検証され、実行時には無視されること'
      ],
      correctIndex: 1,
      explanation: '正解です！EXPECT_* はテスト失敗を記録しつつ次の検証へ進むため、一度に多くの不具合箇所を把握できます。一方 ASSERT_* は直ちに中断するため、ポインタが非ヌルである前提で後続の検証を行う場合などに用いられます。'
    },
    {
      id: 'q-gt-2',
      question: 'TDD（テスト駆動開発）の基本サイクル「Red -> Green -> Refactor」の正しい順序と説明はどれでしょう？',
      options: [
        'リファクタリングをしてから、テストを書き、最後に実装すること',
        'まず失敗するテスト（Red）を書き、最短でテストを通過させるコード（Green）を書き、テストが通った状態を維持したままコードを綺麗に改善（Refactor）すること',
        'コードを全部完成させてから、自動テストを走らせて緑色になるまで修正すること',
        'すべての変数を private にしてから、public 関数を追加すること'
      ],
      correctIndex: 1,
      explanation: '正解です！テストを先に書くことで「あるべき外部仕様」を固め、Greenで最短達成し、最後にテストという安全綱がある状態でコードの品質を高める（Refactor）のがTDDの鉄則です。'
    },
    {
      id: 'q-gt-3',
      question: 'スピーカーから音を鳴らす処理をユニットテストで安全かつ自動的に検証するために最も有効な設計手法はどれでしょう？',
      options: [
        'マイクをPCに近づけて、テスト実行時に音を録音して音量を調べる',
        '音声を鳴らす具象クラスへの直接依存をやめ、ISoundEngine などのインターフェースを導入して外部から注入（依存性注入: DI）し、テスト時は呼出回数を記録するモッククラスに差し替える',
        'テスト中はサウンド機能を #ifdef でコメントアウトして一切呼ばないようにする',
        'グローバル変数に音声ファイルパスを保存しておく'
      ],
      correctIndex: 1,
      explanation: '正解です！依存性注入（DI: Dependency Injection）により外部インターフェースを差し替え可能にすることで、実機のハードウェアや環境に依存せず、純粋なC++ロジックとしてミリ秒でテスト可能になります。'
    },
    {
      id: 'q-gt-4',
      question: '「ユニットテストが書きやすいコード」が持つ一般的な特徴として正しいものはどれでしょう？',
      options: [
        'グローバル変数や静的変数が多用されており、どこからでも値を取得できる',
        '1つの関数にすべてのアルゴリズムが集約されていて1000行以上ある',
        '各クラスの責務が単一（SRP）で、外部依存が少なく疎結合に保たれている',
        'クラスの継承が10階層以上深くネストしている'
      ],
      correctIndex: 2,
      explanation: '正解です！テストが書きやすいコードは「責務が単一」で「疎結合」です。テストを書く習慣を持つこと自体が、自然と綺麗なオブジェクト指向設計へと導いてくれます。'
    }
  ]
};
