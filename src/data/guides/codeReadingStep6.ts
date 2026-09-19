import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_6: Chapter = {
  id: 206,
  slug: 'reading-step-6',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R6',
  title: 'コード読解演習 Step 6【鑑識捜査】：メモリ破壊コードの鑑識捜査（Use-After-Free / ASan）',
  subtitle: '「落ちた場所」と「真犯人」が乖離する怪現象を解明！AddressSanitizerレポートの逆算特定術',
  badge: '読解演習 Step 6',
  description: 'C/C++開発で最も恐ろしいバグは「メモリを不正に解放・破壊した瞬間にはクラッシュせず、数分後や全く無関係な関数の中で突然死ぬ」というメモリ破壊です。現代の開発現場で必須の AddressSanitizer (ASan) のスタックトレースとヒープ割り当て/解放ログをプロの眼力で読み解き、Use-After-Free（解放後メモリ参照）の真犯人を逆算特定する鑑識技術を体得します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-5',
  sections: [
    {
      id: 'step6-overview',
      title: '6.1 メモリ破壊の「潜伏期間」と AddressSanitizer（ASan）の基礎知識',
      leadText: 'なぜC++のメモリ破壊は迷宮入りするのか？クラッシュダンプから「犯人の生存ライン」を逆引きする手法を学びます。',
      dialogueBefore: [
        {
          id: 'dlg-r6-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！自機が敵を倒して爆発エフェクトが出た後、全く関係ないUI描画関数（drawScore）の中で突然 segmentation fault で落ちました！drawScore のコードを何度見てもポインタ操作なんてしていないのに何故ですか！？'
        },
        {
          id: 'dlg-r6-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそが全プログラマを恐怖のどん底に叩き落とす【Use-After-Free（解放後メモリ参照）】の遅延地雷じゃ！すでに delete された敵オブジェクトの残骸ポインタを爆発エフェクトが握り続け、別の誰かがそのメモリを再利用した瞬間にデータが壊れたのじゃ！'
        },
        {
          id: 'dlg-r6-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ひええっ！落ちた場所（drawScore）には何の罪もなかったんですか！？じゃあどうやって本当の犯人を見つければいいんですか！？'
        },
        {
          id: 'dlg-r6-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '現代の開発には【AddressSanitizer（ASan）】という最強の鑑識ツールがある！メモリ確保・解放・アクセスの全履歴を記録し、不正アクセスの瞬間に「いつ誰が確保し、いつ誰が解放し、誰が不当に読んだか」の3大証拠を一瞬で出力してくれるのじゃ！'
        }
      ],
      explanationText: `
### AddressSanitizer (ASan) レポート読解の「3大ブロック検証法」

ASan のクラッシュレポート（\`heap-use-after-free\`）は、必ず以下の3つのスタックトレースで構成されています。上から順に読むのではなく、**「2番目（解放した奴）」** にまず目を光らせるのがプロの鑑識眼です。

1. **ブロック1：【不正アクセスした現場（Crash Point）】**:
   - \`READ of size 4 at 0x603000000040 thread T0\`
   - 誰が死んだメモリを読もうとしたか？（被害者・引き金を引いた関数）
2. **ブロック2：【メモリを解放した現場（The Killer）★最重要★】**:
   - \`0x603000000040 is located 0 bytes inside of 32-byte region [...] freed by thread T0 here:\`
   - **真犯人はここ！** 誰がどの関数のどの行でこのメモリを \`delete\` したのか？
3. **ブロック3：【メモリが確保された現場（Origin）】**:
   - \`previously allocated by thread T0 here:\`
   - このメモリの正体は何だったのか？（どのクラスのインスタンスだったのか？）
      `,
      takeaways: [
        {
          title: 'ASan レポートは「真ん中の freed by」を真っ先に見よ',
          description: 'クラッシュした場所（最上部）は単にゾンビメモリを触ってしまっただけの被害者です。「そのメモリがどこでフライング解放されたか（freed by）」こそが修正すべきバグの発生源です。'
        }
      ]
    },
    {
      id: 'step6-sample-code',
      title: '6.2 演習コード：敵撃破パーティクルシステム（Use-After-Free 潜伏版）',
      leadText: '以下のC++ゲームループコードには、致命的な Use-After-Free バグが組み込まれています。生ポインタの寿命を追跡してください。',
      codeFiles: [
        {
          filename: 'GameParticleSystem.cpp',
          language: 'cpp',
          description: '敵撃破時にパーティクルが追従しようとしてクラッシュする不具合コード',
          isMain: true,
          code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>

struct Enemy {
    int id;
    int hp;
    float x, y;
    Enemy(int _id, float _x, float _y) : id(_id), hp(100), x(_x), y(_y) {}
    ~Enemy() {
        std::cout << "[Destructor] Enemy " << id << " destroyed!\\n";
    }
};

struct Particle {
    float vx, vy;
    int life;
    const Enemy* sourceEnemy; // ⚠️ 危険：敵への生ポインタ（所有権なし）

    Particle(float _vx, float _vy, const Enemy* src)
        : vx(_vx), vy(_vy), life(3), sourceEnemy(src) {}

    void update() {
        // 敵の最新座標に追従してエフェクトを出す処理
        if (sourceEnemy) {
            // ⚠️ ここで死んだ Enemy のメモリを読み出す！
            std::cout << "Particle tracking Enemy at (" 
                      << sourceEnemy->x << ", " << sourceEnemy->y << ")\\n";
        }
        life--;
    }
};

class GameScene {
private:
    std::vector<std::unique_ptr<Enemy>> m_enemies;
    std::vector<Particle> m_particles;

public:
    void init() {
        m_enemies.push_back(std::make_unique<Enemy>(1, 100.0f, 200.0f));
        // パーティクル生成：敵の生ポインタを渡す
        m_particles.emplace_back(1.0f, 1.0f, m_enemies[0].get());
    }

    void updateFrame() {
        std::cout << "--- Frame Start ---\\n";

        // 1. 敵が倒されてリストから消去（ここで Enemy が delete される！）
        std::cout << "Action: 敵を撃破して消去します\\n";
        m_enemies.clear(); // ⚠️ メモリ解放！

        // 2. パーティクルの更新処理（既に死んだ Enemy を見に行く！）
        std::cout << "Action: 残留パーティクルを更新します\\n";
        for (auto& p : m_particles) {
            p.update(); // 💥 Use-After-Free 発生！
        }

        std::cout << "--- Frame End ---\\n";
    }
};

int main() {
    GameScene scene;
    scene.init();
    scene.updateFrame();
    return 0;
}`,
          highlightLines: [18, 24, 49, 54]
        }
      ],
      takeaways: [
        {
          title: 'コンテナの clear() や erase() はポインタ所有者を破壊する',
          description: '`m_enemies.clear()` を呼んだ瞬間、中身の `std::unique_ptr<Enemy>` がすべて即時デストラクトされます。外部に渡していた `sourceEnemy` 生ポインタは瞬時に「ダングリングポインタ（墓場へのポインタ）」と化します。'
        }
      ]
    },
    {
      id: 'step6-asan-report',
      title: '6.3 鑑識眼の証明：実際の ASan ログからの逆引き特定プロファイル',
      leadText: '本コードを `-fsanitize=address` 付きで実行した際に出力される本物の鑑識レポートの読み解きです。',
      processSteps: [
        {
          stepNumber: 1,
          title: 'ステップ1：エラー種別とアクセス行の確認',
          description: '`ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000048`\\n`READ of size 4 at ... in Particle::update() GameParticleSystem.cpp:25`\\n▶ 判定：25行目でサイズ4バイト（float x）を読み出そうとして死亡。',
          impact: '被害者（引き金を引いた関数）の確定'
        },
        {
          stepNumber: 2,
          title: 'ステップ2：解放した犯人の特定（freed by）',
          description: '`0x603000000048 is located 8 bytes inside of 32-byte region`\\n`freed by thread T0 here:`\\n`#0 operator delete(void*)`\\n`#1 std::unique_ptr<Enemy>::~unique_ptr()`\\n`#2 GameScene::updateFrame() GameParticleSystem.cpp:49`\\n▶ 判定：49行目の `m_enemies.clear()` が真犯人。',
          impact: 'メモリを早漏解放した加害コードの特定'
        },
        {
          stepNumber: 3,
          title: 'ステップ3：抜本的設計改善（ID参照または弱参照）',
          description: 'ポインタではなく「EntityID（整数ID）」を保持し、生きているか問い合わせてから使うか、あるいはパーティクル側には敵の座標値（値コピー）だけを渡す設計へと改修します。',
          impact: 'バグの根本原因の完全撲滅'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r6-1',
      question: 'Use-After-Free（解放後メモリ参照）のバグが「デバッグが極めて難しい」と言われる最大の理由は何でしょう？',
      options: [
        'コンパイルが100%通らないから',
        'メモリを delete した瞬間にはクラッシュせず、OSがその領域を別のオブジェクトに再割り当てするまで正常に動いているように見え、後から全く無関係な場所で突然発症するから',
        'C++の規格書に記述がないから',
        'Linuxでは絶対に発生しないから'
      ],
      correctIndex: 1,
      explanation: '正解です！解放されたメモリは即座にゼロクリアされるわけではないため、直後はたまたま昔の値が読めて動いてしまい、数秒後や数分後に別のデータで上書きされた瞬間に謎のクラッシュを引き起こします。'
    },
    {
      id: 'q-r6-2',
      question: 'AddressSanitizer（ASan）のレポートにおいて、「真犯人（そのメモリを不当に delete した箇所）」を特定するために最も注目すべきセクションはどれでしょう？',
      options: [
        '最上行の `SUMMARY: AddressSanitizer:`',
        '`previously allocated by thread T0 here:`',
        '`freed by thread T0 here:` の直後にあるスタックトレース',
        'CPUレジスタ（RSP, RBP）の値'
      ],
      correctIndex: 2,
      explanation: '正解です！`freed by thread T0 here:` には、その不正メモリ領域が「どの関数のどの行番号で解放されたのか」の完全なコールスタックが記録されており、真犯人の特定に直結します。'
    },
    {
      id: 'q-r6-3',
      question: 'GameParticleSystem.cpp において、Particle が Enemy の解放後もアクセスを試みてしまった根本的な設計欠陥は何でしょう？',
      options: [
        'Enemy が struct ではなく class で書かれていたこと',
        'Particle が生存期間の保証されていない Enemy への生ポインタ（const Enemy*）を保持し、Enemy のライフサイクル（m_enemies.clear()）と同期していなかったこと',
        'float ではなく double を使うべきだったこと',
        'Particle のコンストラクタで std::move を使わなかったこと'
      ],
      correctIndex: 1,
      explanation: '正解です！生ポインタは相手の消滅を検知できません。親コンテナがクリアされて Enemy が破棄されたのに、Particle 側がそれを知らずに参照し続けたことが原因です。'
    },
    {
      id: 'q-r6-4',
      question: 'この Use-After-Free を撲滅するための最もクリーンかつ実践的なゲームプログラミング設計はどれでしょう？',
      options: [
        'Enemy を一切 delete しないようにメモリリークさせる',
        'Particle に生ポインタを持たせず、生成時に「その時点の敵の座標（Vec2 position）」を値コピーして渡すか、生存判定が可能な「EntityID（整数識別子）」で管理する',
        'delete の直後に sleep_for(10ms) を挟む',
        'デバッガを繋ぎっぱなしにする'
      ],
      correctIndex: 1,
      explanation: '正解です！エフェクトに必要な情報が座標だけであれば値コピーで渡すのが最も安全です。動的追従が必要な場合でも、生ポインタではなく EntityID で検索し、既に敵が消滅していればエフェクトも自然消滅させる設計が現場の鉄則です。'
    }
  ]
};
