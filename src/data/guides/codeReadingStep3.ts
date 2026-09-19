import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_3: Chapter = {
  id: 203,
  slug: 'reading-step-3',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R3',
  title: 'コード読解演習 Step 3【上級】：多態性・vtable・動的挙動の追跡',
  subtitle: '基底ポインタと仮想関数テーブル（vtable）の向こう側にある「真の実行時呼び出し先」を暴く',
  badge: '読解演習 Step 3',
  description: '`target->execute();` と書かれていても、実際に動くのはどのクラスの関数なのか？静的なテキスト検索だけでは歯が立たない多態性（ポリモーフィズム）と動的ディスパッチを、vtableの構造とデバッガ・ログを活用して正確に特定する上級読解術です。',
  gameVersion: 'none',
  umlDiagram: {
    diagramType: 'class',
    title: '演習教材：イベント駆動コマンドパターンのクラス設計図',
    subtitle: '抽象基底コマンド ICommand と具象コマンド群（Move / Attack / Heal）の汎化構造',
    description: 'CommandQueue（キュー）が基底クラス ICommand* のポインタ配列を保持し、実行時に動的ポリモーフィズムによってそれぞれの具象コマンドを呼び出します。',
    classes: [
      {
        name: 'ICommand',
        isAbstract: true,
        stereotype: 'interface',
        attributes: [],
        operations: [
          { name: '~ICommand()', type: 'void', visibility: '+', isVirtual: true, codeLineRef: { filename: 'ICommand.h', line: 7 } },
          { name: 'execute(ctx: Context&)', type: 'void', visibility: '+', isVirtual: true, codeLineRef: { filename: 'ICommand.h', line: 8 } },
          { name: 'getName() const', type: 'string', visibility: '+', isVirtual: true, codeLineRef: { filename: 'ICommand.h', line: 9 } },
        ],
      },
      {
        name: 'MoveCommand',
        attributes: [
          { name: 'm_deltaX', type: 'int', visibility: '-', codeLineRef: { filename: 'ConcreteCommands.h', line: 7 } },
        ],
        operations: [
          { name: 'execute(ctx: Context&)', type: 'void', visibility: '+', codeLineRef: { filename: 'ConcreteCommands.h', line: 12 } },
        ],
      },
      {
        name: 'AttackCommand',
        attributes: [
          { name: 'm_damage', type: 'int', visibility: '-', codeLineRef: { filename: 'ConcreteCommands.h', line: 24 } },
        ],
        operations: [
          { name: 'execute(ctx: Context&)', type: 'void', visibility: '+', codeLineRef: { filename: 'ConcreteCommands.h', line: 29 } },
        ],
      },
      {
        name: 'CommandQueue',
        attributes: [
          { name: 'm_queue', type: 'std::vector<ICommand*>', visibility: '-', codeLineRef: { filename: 'CommandQueue.h', line: 10 } },
        ],
        operations: [
          { name: 'push(cmd: ICommand*)', type: 'void', visibility: '+', codeLineRef: { filename: 'CommandQueue.h', line: 15 } },
          { name: 'processAll(ctx: Context&)', type: 'void', visibility: '+', codeLineRef: { filename: 'CommandQueue.h', line: 20 } },
        ],
      },
    ],
    relations: [
      {
        from: 'MoveCommand',
        to: 'ICommand',
        type: 'realization',
        label: 'インターフェース実装',
        cppMapping: 'class MoveCommand : public ICommand',
      },
      {
        from: 'AttackCommand',
        to: 'ICommand',
        type: 'realization',
        label: 'インターフェース実装',
        cppMapping: 'class AttackCommand : public ICommand',
      },
      {
        from: 'CommandQueue',
        to: 'ICommand',
        type: 'aggregation',
        label: 'ポリモーフィック集約',
        cppMapping: 'std::vector<ICommand*> m_queue;',
      },
    ],
    codeMappingNotes: [
      '【仮想関数テーブル（vtable）の介在】: `cmd->execute()` の呼び出し時、CPUはオブジェクト先頭の vptr を参照して vtable から具象関数のアドレスを取り出し間接ジャンプします。',
      '【読解のコツ】: 「どこで `new MoveCommand` などの具象インスタンスが生成されてキューに積まれたか（登録箇所）」を検索して特定します。',
    ],
  },
  sections: [
    {
      id: 'step3-vtable-mystery',
      title: '3.1 多態性コード読解の壁：「定義へジャンプ」で基底クラスへ飛んでしまう問題',
      leadText: 'VS Codeなどの「定義へジャンプ（F12）」を押すと、純粋仮想関数（= 0）に飛ばされて絶望した経験はありませんか？動的ディスパッチの読解戦略を伝授します。',
      dialogueBefore: [
        {
          id: 'dlg-r3-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'うわあああ！`cmd->execute(ctx);` の中身を読みたくてエディタで「定義へジャンプ」したら、`virtual void execute(Context& ctx) = 0;` って空っぽのヘッダに飛ばされました！実際に何が起きているのか全然分かりません！',
        },
        {
          id: 'dlg-r3-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'グハハ！それこそがオブジェクト指向の最大の罠であり強みじゃ！\n静的なソースコード上では「基底クラスの契約」しか書かれておらん。実行時にどの具象クラスが化けているのかを突き止めるには、**【① 派生クラス一覧の grep 検索】→【② インスタンス生成（Factory や new）の探索】→【③ 実行時RTTIやデバッガログ】**を使うのじゃ！',
        },
      ],
      explanationText: `
### 動的ディスパッチを暴く「3大探索テクニック」

1. **テクニック1：「派生クラス・実装一覧」を引く**:
   - \`class [A-Za-z0-9_]+ : public ICommand\` で正規表現検索をかけ、このインターフェースを実装している具象クラスの全候補をリストアップします。
2. **テクニック2：「生成起点（Factory/new）」を逆引きする**:
   - キューに積まれる手前で、誰が \`new MoveCommand(...)\` を行っているかを検索します。
   - イベント発火のトリガー（ボタン押下、パケット受信、AI判断）が見えてきます。
3. **テクニック3：「仮想デストラクタの存在」を必ず確認する**:
   - 基底ポインタ経由で \`delete cmd;\` される場合、基底クラスに \`virtual ~ICommand()\` がないと派生クラスのデストラクタが呼ばれずメモリリークを起こします。コード読解時の最重要チェックポイントです。
      `,
      takeaways: [
        {
          title: '「呼び出し元」ではなく「生成元」を探す',
          description: '多態性コードの真の挙動を知るには、`execute()` を呼んでいる場所ではなく、そのオブジェクトを `new` して渡している場所を特定するのが近道です。',
        },
      ],
    },
    {
      id: 'step3-sample-code',
      title: '3.2 演習コード：コマンドパターンによるイベント処理キュー一式',
      leadText: '以下のファイルをタブで切り替えながら、`processAll` が各具象コマンドをどのように多態的に処理しているか追跡してください。',
      codeFiles: [
        {
          filename: 'ICommand.h',
          language: 'cpp',
          description: 'コマンド抽象基底インターフェース（純粋仮想関数）',
          code: `#pragma once
#include <string>

struct Context {
    int playerX = 10;
    int enemyHp = 50;
};

class ICommand {
public:
    virtual ~ICommand() = default;
    virtual void execute(Context& ctx) = 0;
    virtual std::string getName() const = 0;
};`
        },
        {
          filename: 'ConcreteCommands.h',
          language: 'cpp',
          description: '移動コマンドと攻撃コマンドの具象実装',
          code: `#pragma once
#include <iostream>
#include "ICommand.h"

// 移動コマンド
class MoveCommand : public ICommand {
private:
    int m_deltaX;

public:
    MoveCommand(int deltaX) : m_deltaX(deltaX) {}

    void execute(Context& ctx) override {
        ctx.playerX += m_deltaX;
        std::cout << "[Action] 移動実行: X座標が " << ctx.playerX << " になりました\\n";
    }

    std::string getName() const override { return "MoveCommand"; }
};

// 攻撃コマンド
class AttackCommand : public ICommand {
private:
    int m_damage;

public:
    AttackCommand(int damage) : m_damage(damage) {}

    void execute(Context& ctx) override {
        ctx.enemyHp -= m_damage;
        std::cout << "[Action] 攻撃実行: 敵HPに " << m_damage 
                  << " ダメージ！(残HP: " << ctx.enemyHp << ")\\n";
    }

    std::string getName() const override { return "AttackCommand"; }
};`
        },
        {
          filename: 'CommandQueue.h',
          language: 'cpp',
          description: 'コマンドを蓄積し、ポリモーフィックに順次実行するキュー',
          code: `#pragma once
#include <vector>
#include <iostream>
#include "ICommand.h"

class CommandQueue {
private:
    std::vector<ICommand*> m_queue;

public:
    ~CommandQueue() {
        // メモリ解放（基底の仮想デストラクタ経由）
        for (ICommand* cmd : m_queue) {
            delete cmd;
        }
    }

    void push(ICommand* cmd) {
        m_queue.push_back(cmd);
    }

    void processAll(Context& ctx) {
        std::cout << ">>> キュー内の全コマンドを一括ディスパッチ実行:\\n";
        for (ICommand* cmd : m_queue) {
            std::cout << "実行中: " << cmd->getName() << " -> ";
            // ★多態的呼び出し：vtable経由で具象クラスのexecute()が呼ばれる！
            cmd->execute(ctx);
        }
        m_queue.clear();
    }
};`
        },
        {
          filename: 'main.cpp',
          language: 'cpp',
          isMain: true,
          description: 'コマンドの登録と実行',
          code: `#include <iostream>
#include "ConcreteCommands.h"
#include "CommandQueue.h"

int main() {
    Context gameContext;
    CommandQueue queue;

    // イベントに応じてコマンドをキューイング（生成起点）
    queue.push(new MoveCommand(5));
    queue.push(new AttackCommand(25));
    queue.push(new MoveCommand(-2));

    // キューを実行
    queue.processAll(gameContext);

    std::cout << "=== 最終ゲームコンテキスト ===\\n";
    std::cout << "自機X: " << gameContext.playerX << ", 敵HP: " << gameContext.enemyHp << "\\n";
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'vtableを通じた実行時の「化け」を見破る',
          description: 'CommandQueue は ICommand という抽象しか知りません。しかし実行時には注入された MoveCommand や AttackCommand の具象コードが正確に呼び出されます。',
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r3-1',
      question: 'CommandQueue::processAll() 内の `cmd->execute(ctx);` において、実行時に MoveCommand や AttackCommand の正しい関数が呼び出されるC++の内部メカニズムは何でしょう？',
      options: [
        'コンパイラがすべての if-else 分岐を自動生成しているから',
        'オブジェクト内に埋め込まれた vptr（仮想関数テーブルポインタ）が、実行時にその具象クラス固有の vtable を参照して間接関数ジャンプを行うから',
        'main.cpp の行番号を直接記憶しているから',
        'OSのプロセス管理機能が関数を検索しているから'
      ],
      correctIndex: 1,
      explanation: '正解です！C++の仮想関数（virtual）は、各オブジェクトに不可視の vptr（仮想テーブルポインタ）を持たせ、実行時に vtable から関数アドレスを解決する動的ディスパッチによって動作します。'
    },
    {
      id: 'q-r3-2',
      question: 'ICommand のデストラクタに `virtual` が指定されていない場合、`CommandQueue::~CommandQueue()` で `delete cmd;` した際に発生する重大なバグは何でしょう？',
      options: [
        'コンパイルエラーになりビルドできない',
        '基底クラスのデストラクタしか呼ばれず、派生クラス固有のメンバ変数の解放処理がスキップされて未定義動作・メモリリークが発生する',
        'PCの電源が落ちる',
        '自動的にガーベジコレクションが実行される'
      ],
      correctIndex: 1,
      explanation: '正解です！基底クラスのポインタ経由で派生オブジェクトを破棄（delete）する場合、仮想デストラクタ（virtual ~ICommand）が必須です。仮想になっていないと派生側のデストラクタがスキップされメモリリークや未定義動作を引き起こします。'
    },
    {
      id: 'q-r3-3',
      question: 'main.cpp において、3つのコマンド（MoveCommand(5), AttackCommand(25), MoveCommand(-2)）がすべて実行された後の `gameContext` の最終状態（playerX, enemyHp）はどれでしょう？（初期値: playerX = 10, enemyHp = 50）',
      options: [
        'playerX = 10, enemyHp = 50',
        'playerX = 15, enemyHp = 25',
        'playerX = 13, enemyHp = 25',
        'playerX = 17, enemyHp = 75'
      ],
      correctIndex: 2,
      explanation: '正解です！初期値 playerX=10 に +5 され 15、次に -2 されて 13 になります。敵HPは初期値 50 から -25 されて 25 になります。'
    },
    {
      id: 'q-r3-4',
      question: '多態性を用いた巨大なC++プロジェクトで、「このインターフェースを実装している具象クラスがどこにあるか分からない」ときの最も効率的な初動調査テクニックはどれでしょう？',
      options: [
        '諦めて全てのファイルを1行目から目視で探す',
        'プロジェクト全体を対象に `: public インターフェース名` で grep 検索（またはIDEの実装一覧機能）をかけて具象クラスをリストアップし、それらがどこで new / 生成されているかを特定する',
        'コンパイルを止めて再インストールする',
        'すべての virtual を削除してみる'
      ],
      correctIndex: 1,
      explanation: '正解です！派生クラスの宣言パターン（`: public ICommand`）を検索することで候補を一網打尽にし、さらに「その具象クラスをインスタンス化している Factory や登録箇所」を特定するのがプロの読解テクニックです。'
    }
  ],
  prevChapterSlug: 'reading-step-2',
  nextChapterSlug: 'reading-step-4'
};
