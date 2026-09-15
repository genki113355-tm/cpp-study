import { Chapter } from '../../types/curriculum';

export const chapterL8: Chapter = {
  id: 12,
  slug: 'chapter-8-function-pointers-callbacks',
  courseTrack: 'classic',
  courseChapterCode: 'C8',
  title: 'レガシー第8章：関数ポインタとC++メンバ関数ポインタの怪',
  subtitle: 'C言語スタイルのvoid*コールバックから型安全なメンバ関数ポインタ・委譲・イベントリスナー設計へ',
  badge: 'レガシーC++ L8：関数ポインタ・コールバック',
  gameVersion: 'v2_classes',
  description: 'ゲーム開発において「ボタンをクリックしたら技を出す」「敵を倒したらスコアを加算する」「タイマーが鳴ったら敵を湧かせる」といったイベント通知は設計の要です。C言語では `void (*callback)(void* userData)` によるコールバックが定番でしたが、型安全性の喪失とキャストミスによる即死クラッシュの温床でした。さらにC++では、クラスのメンバ関数は通常の関数ポインタとは全く異なる「多重継承や仮想関数に対応するための複雑な内部構造（最大16〜24バイト）」を持っています。本章では、メンバ関数ポインタの物理メモリ構造を解明し、モダンC++（C++11のラムダやstd::function）が登場する以前に現場のエンジニアが血と汗で築き上げた「型安全な委譲（Delegate）設計」をマスターします。',
  sections: [
    {
      id: 'sec-l8-c-style-callbacks',
      title: 'L8.1 C言語流 void* コールバックの栄光と限界',
      leadText: 'イベント駆動の原点「関数ポインタとユーザーデータポインタ」。なぜ void* は悪魔の契約と呼ばれるのか？型消滅によるメモリ破壊の恐怖を学びます。',
      dialogueBefore: [
        {
          id: 'dl8-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生……！UIボタンのクリック処理をC言語の教科書通りに `typedef void (*ClickCallback)(void* userData);` で実装したんです。ボタンを押したら自機のボムを発動させようとしたんですが、ゲームが謎の即死クラッシュを起こしました……！'
        },
        {
          id: 'dl8-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！どれどれ、コードを見せてみろ……ほう、ボタン生成時に渡した `userData` は `SoundManager*` なのに、コールバック関数の中で `(Player*)userData` にキャストして `player->fireBomb()` を呼んでおるぞ！'
        },
        {
          id: 'dl8-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'うわあああ！渡したポインタと受け取ったポインタの型が全然違ったんですね！？でも、コンパイラは一切警告を出してくれませんでした……！'
        },
        {
          id: 'dl8-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそが `void*`（型なしポインタ）の呪いじゃ！C言語では関数の引数を共通化するために `void*` で何でも受け渡す設計が流行ったが、それは「コンパイラの型チェックという最大の安全網を自らドブに捨てる悪魔の契約」なんじゃよ！'
        }
      ],
      paradigmComparison: {
        title: 'C言語（void* 関数ポインタ） vs C++（型安全な委譲 / リスナー）',
        cApproach: {
          title: 'C言語：void* による汎用コールバック',
          code: `typedef void (*CallbackFunc)(void* userData);

typedef struct {
    CallbackFunc onClick;
    void*        userData; // 任意のデータを保持（型情報が完全に消滅！）
} Button;

void onBombClicked(void* data) {
    // ❌ 危険: コンパイラは型を検証できない！
    // もし data が SoundManager* だったらメモリを不正破壊して即死
    Player* player = (Player*)data;
    player->bombCount--;
}

Button btn;
btn.onClick = onBombClicked;
btn.userData = (void*)&g_soundManager; // 型が違うのにコンパイルが通ってしまう！`,
          drawbacks: [
            'void* にキャストした時点でコンパイラの静的型チェックが完全に無効化される',
            '渡したオブジェクトの型とキャスト先の型が不一致でも警告すら出ず、実行時に未定義動作・クラッシュを起こす',
            'userData が指すオブジェクトが既に free されたダングリングポインタでも検知できない'
          ]
        },
        cppApproach: {
          title: 'C++：静的型安全なイベントリスナー（Observer / Delegate）',
          code: `// インターフェースによる型保証
class IButtonClickListener {
public:
    virtual ~IButtonClickListener() = default;
    virtual void onButtonClicked(int buttonId) = 0;
};

class UIButton {
private:
    IButtonClickListener* listener_ = nullptr;
    int buttonId_ = 0;
public:
    UIButton(int id) : buttonId_(id) {}
    
    // ✅ 型が合わないリスナーはコンパイルエラーで弾かれる！
    void setListener(IButtonClickListener* listener) {
        listener_ = listener;
    }
    
    void click() {
        if (listener_) {
            listener_->onButtonClicked(buttonId_);
        }
    }
};`,
          benefits: [
            'コンパイラがインターフェース実装を静的に保証し、型キャストミスが物理的に発生しない',
            'void* を一切排除し、オブジェクトの責務と呼び出し関係がコード上で明確になる',
            'IDEのコード補完やリファクタリング（関数名変更）に完全追従する'
          ]
        },
        paradigmShiftNotes: 'C言語では汎用性を得るために型を捨てて void* に頼らざるを得ませんでしたが、C++では抽象クラス（インターフェース）やテンプレートを用いることで、「汎用性」と「100%の型安全性」を両立させます。'
      },
      processSteps: [
        {
          stepNumber: 1,
          title: '関数ポインタの物理構造（コードセグメントへのアドレス）',
          codeSnippet: `void (*funcPtr)(int) = &printScore;
// 64bit環境では 0x00007FF712345678 のような8バイトのコード領域アドレス
funcPtr(100); // call 命令でそのアドレスへジャンプ`,
          description: '通常の関数ポインタは、メモリ上のテキスト（コード）領域に配置された機械語の先頭アドレスを保持しているだけの単純な8バイト整数です。',
          impact: 'CPUはスタックに引数を積み、そのアドレスへ直接 call 命令でジャンプします。',
          designIntent: 'ステートレスなグローバル関数やstatic関数の呼び出しにはこれで十分ですが、オブジェクト指向の「特定のインスタンスの状態を変更する」処理には使えません。'
        },
        {
          stepNumber: 2,
          title: 'C言語が直面した「インスタンス変数を持てない」壁',
          codeSnippet: `// どのプレイヤーのHPを減らせばいいのか？
void onDamageCallback() {
    // player1 なのか？ player2 なのか？
    // グローバル変数に頼るか、引数に void* を追加するしかない！
}`,
          description: 'C言語の関数ポインタは「関数コードのアドレス」しか持てないため、対象のデータ（インスタンス）を紐付けるには追加の `void* userData` が必須でした。',
          impact: 'これがすべての型破綻とスパゲティポインタの引き金となりました。',
          designIntent: '「関数ポインタ」と「データ」が別々に管理される手続き型の構造的欠陥です。'
        },
        {
          stepNumber: 3,
          title: 'C++の結論：呼び出し側と受取側の型契約（Contract）',
          codeSnippet: `class Player : public IButtonClickListener {
public:
    void onButtonClicked(int buttonId) override {
        if (buttonId == BTN_BOMB) this->fireBomb();
    }
};`,
          description: 'リスナーインターフェースを実装することで、ボタンとプレイヤーは「型」によって安全に結合されます。キャストは1行も必要ありません。',
          impact: 'コンパイルエラーの段階でバグを100%捕捉できるようになります。',
          designIntent: 'GoFの Observer パターンおよび単一責任の原則（SRP）の基礎です。'
        }
      ],
      codeFiles: [
        {
          filename: 'LegacyCallback.h',
          language: 'cpp',
          description: 'C言語スタイルのvoid*コールバック（危険なアンチパターン）',
          code: `#pragma once
#include <iostream>

// ❌ C言語流コールバック: 型情報が完全に消え去る
typedef void (*RawButtonCallback)(int buttonId, void* userData);

class LegacyButton {
private:
    int buttonId_;
    RawButtonCallback callback_;
    void* userData_;

public:
    LegacyButton(int id) 
        : buttonId_(id), callback_(nullptr), userData_(nullptr) {}

    void setCallback(RawButtonCallback cb, void* data) {
        callback_ = cb;
        userData_ = data; // 型チェックなしで何でも代入できてしまう
    }

    void press() {
        std::cout << "[LegacyButton " << buttonId_ << "] クリックされました\\n";
        if (callback_) {
            callback_(buttonId_, userData_);
        }
    }
};`
        },
        {
          filename: 'TypeSafeListener.h',
          language: 'cpp',
          description: 'C++スタイルの型安全リスナーインターフェース',
          code: `#pragma once
#include <iostream>

// ✅ C++流インターフェース: コンパイラが型を100%保証する
class IButtonListener {
public:
    virtual ~IButtonListener() = default;
    virtual void onButtonPressed(int buttonId) = 0;
};

class SafeButton {
private:
    int buttonId_;
    IButtonListener* listener_;

public:
    SafeButton(int id) : buttonId_(id), listener_(nullptr) {}

    // IButtonListener を実装したクラスのポインタしか受け付けない
    void setListener(IButtonListener* listener) {
        listener_ = listener;
    }

    void press() {
        std::cout << "[SafeButton " << buttonId_ << "] クリックされました\\n";
        if (listener_) {
            listener_->onButtonPressed(buttonId_);
        }
    }
};`
        }
      ]
    },
    {
      id: 'sec-l8-member-function-pointers',
      title: 'L8.2 C++メンバ関数ポインタの怪奇な正体とメモリ構造',
      leadText: '`void (*f)()` にメンバ関数を代入するとコンパイルエラー！メンバ関数ポインタのサイズが8バイトではなく16〜24バイトになる物理的理由を解明します。',
      dialogueBefore: [
        {
          id: 'dl8-5',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'ベン先生、インターフェースを作るのもいいですが、わざわざ基底クラスを継承せずに「Playerクラスの `fireBomb` メンバ関数」を直接関数ポインタに代入できないんですか？ `void (*fp)() = &Player::fireBomb;` と書いたらコンパイラに怒鳴られました……。'
        },
        {
          id: 'dl8-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'フォッフォッフォ！それがC++初心者が2番目にぶつかる巨岩【メンバ関数ポインタの怪】じゃ！メンバ関数は普通の関数とは全く別物なんじゃよ！'
        },
        {
          id: 'dl8-7',
          speaker: 'penguin',
          emotion: 'question',
          text: 'えっ！？クラスの中に書いてあるだけで、結局はメモリ上の機械語コードですよね？なんで普通の関数ポインタに代入できないんですか？'
        },
        {
          id: 'dl8-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'メンバ関数を呼ぶには、必ず暗黙の第1引数として【どのインスタンスかを示す `this` ポインタ】をCPUレジスタ（ECXやRDI）にセットせねばならん！さらに多重継承や仮想関数がある場合、`this` ポインタを何バイトずらすか（オフセット）や、`vtable` の何番目かという情報が必要になる。そのためメンバ関数ポインタのサイズは8バイトではなく【16バイトや24バイト】にも膨れ上がるんじゃ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'メンバ関数ポインタの正しい型宣言構文',
          codeSnippet: `// 通常の関数ポインタ
void (*regularFunc)(int);

// Player クラスのメンバ関数ポインタ
void (Player::*memberFunc)(int);`,
          description: 'メンバ関数ポインタを宣言するには、型名の前に `クラス名::*` を明記する必要があります。これにより「この関数はPlayerのインスタンスを必要とする」という型情報が保持されます。',
          impact: '異なるクラスのメンバ関数ポインタ同士は型が違うため、相互に代入できません。',
          designIntent: 'コンパイル時にクラスの型安全性を維持するための言語仕様です。'
        },
        {
          stepNumber: 2,
          title: '呼び出し時の特殊演算子 .* と ->*',
          codeSnippet: `Player player;
Player* pPlayer = &player;

// インスタンス実体からの呼び出し
(player.*memberFunc)(10);

// インスタンスポインタからの呼び出し
(pPlayer->*memberFunc)(10);`,
          description: 'メンバ関数ポインタを呼び出すには、必ず対象となるインスタンスとペアにして `.*` または `->*` 演算子を使用します。括弧 `()` が必須である点に注意が必要です。',
          impact: 'インスタンスが存在しない状態では物理的に実行できません（安全性の担保）。',
          designIntent: 'CPUに正しい `this` ポインタを渡すための構文です。'
        },
        {
          stepNumber: 3,
          title: 'なぜサイズが膨らむのか？多重継承と仮想関数の裏側',
          codeSnippet: `struct MemberFuncPtrInternal {
    void* codeAddress;     // 関数の実体アドレス (8バイト)
    ptrdiff_t thisOffset;  // 多重継承時の this 調整オフセット (8バイト)
    // 仮想継承時はさらに vtable インデックス等が追加され 16〜24バイトに！
};`,
          description: '多重継承された派生クラスでは、基底クラスごとに `this` ポインタの先頭アドレスが異なります。そのためメンバ関数ポインタの内部には「呼び出し時に this ポインタを何バイト足し引きするか」というオフセット値が同梱されています。',
          impact: '普通のポインタ（8バイト）とはサイズが異なるため、`void*` や `uintptr_t` にキャストすることはC++仕様で厳格に禁止されています。',
          designIntent: 'ハードウェアのメモリ配置の歪みをコンパイラが裏で吸収するためのデータ構造です。'
        }
      ],
      codeFiles: [
        {
          filename: 'MemberPointerDemo.cpp',
          language: 'cpp',
          description: 'メンバ関数ポインタの宣言・代入・呼び出しとサイズ検証',
          code: `#include <iostream>

class Spaceship {
private:
    int shield_ = 100;
public:
    void repairShield(int amount) {
        shield_ += amount;
        std::cout << "シールド修復: +" << amount << " (現在値: " << shield_ << ")\\n";
    }

    void emergencyBoost(int amount) {
        shield_ -= amount;
        std::cout << "緊急加速！シールド消費: -" << amount << " (現在値: " << shield_ << ")\\n";
    }
};

int main() {
    Spaceship ship;

    // メンバ関数ポインタの宣言
    void (Spaceship::*action)(int) = nullptr;

    // 状況に応じて呼び出すメンバ関数を切り替え
    action = &Spaceship::repairShield;
    (ship.*action)(20); // シールド修復が呼ばれる

    action = &Spaceship::emergencyBoost;
    (ship.*action)(15); // 緊急加速が呼ばれる

    // メンバ関数ポインタのサイズを表示
    std::cout << "通常ポインタのサイズ: " << sizeof(void*) << " バイト\\n";
    std::cout << "メンバ関数ポインタのサイズ: " << sizeof(action) << " バイト\\n";
    // 多くのコンパイラ（MSVCやGCC）で 16バイト と表示される！

    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l8-delegate-pattern',
      title: 'L8.3 レガシーC++における安全な委譲（Delegate）設計の実践',
      leadText: 'モダンC++のラムダ式がない時代、現場はどう戦ったか？インスタンスとメンバ関数ポインタを一体化する「Delegate（委譲）」パターンの完全実装。',
      dialogueBefore: [
        {
          id: 'dl8-9',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'なるほど！メンバ関数ポインタには「インスタンス」が必要なんですね。ということは、「インスタンスのポインタ」と「メンバ関数ポインタ」を1つのクラスにまとめて保持すれば、C言語の関数ポインタみたいに手軽に扱えるんじゃないですか？'
        },
        {
          id: 'dl8-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'お見事！まさにそれこそが、C#の `delegate` やモダンC++の `std::function` の原型となった【Delegate（委譲）パターン】じゃ！ゲーム開発の歴史において、UIシステムやイベントディスパッチャを救った伝説の技法じゃな！'
        },
        {
          id: 'dl8-11',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'よし！UIボタンにDelegateを持たせて、自機（Player）の回復やボム、サウンド（SoundManager）のBGM再生を疎結合に呼び出せるようにしてみます！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: '非型安全な型消滅を防ぐ基底インターフェース',
          codeSnippet: `class IActionDelegate {
public:
    virtual ~IActionDelegate() = default;
    virtual void execute(int param) = 0;
};`,
          description: '呼び出し元（ボタン）は、相手が Player なのか SoundManager なのかを知る必要はありません。「execute(int) を実行できる何か」という抽象基底を定義します。',
          impact: 'ボタンとゲームオブジェクトの間の結合度をゼロにします。',
          designIntent: '依存性逆転の原則（DIP）の適用。'
        },
        {
          stepNumber: 2,
          title: 'クラステンプレートによるインスタンスと関数のバインド',
          codeSnippet: `template <typename T>
class MemberDelegate : public IActionDelegate {
private:
    T* instance_;
    void (T::*func_)(int);
public:
    MemberDelegate(T* inst, void (T::*f)(int)) 
        : instance_(inst), func_(f) {}

    void execute(int param) override {
        if (instance_ && func_) {
            (instance_->*func_)(param);
        }
    }
};`,
          description: 'テンプレート引数 `T` によって具体的なクラス型を保持し、コンパイル時にメンバ関数のシグネチャを完全検証します。',
          impact: 'void* のキャストを一切使わずに、任意のクラスのメンバ関数を安全に包み込みます。',
          designIntent: 'C++98/03時代に考案された、型消滅（Type Erasure）パターンの原点です。'
        },
        {
          stepNumber: 3,
          title: 'ヘルパー関数による型推論生成',
          codeSnippet: `template <typename T>
IActionDelegate* makeDelegate(T* inst, void (T::*f)(int)) {
    return new MemberDelegate<T>(inst, f);
}`,
          description: 'ヘルパー関数を用意することで、テンプレート引数を明示的に書く手間を省き、直感的にイベントを登録できるようにします。',
          impact: '呼び出し側のコードが非常にクリーンになります。',
          designIntent: 'ファクトリ関数によるユーザビリティ向上。'
        }
      ],
      codeFiles: [
        {
          filename: 'Delegate.h',
          language: 'cpp',
          description: '型安全な委譲（Delegate）システムの汎用ヘッダ',
          code: `#pragma once
#include <iostream>

// 1. 抽象委譲基底クラス
class IActionDelegate {
public:
    virtual ~IActionDelegate() = default;
    virtual void execute(int value) = 0;
};

// 2. 任意のクラスのメンバ関数を安全にバインドするテンプレート
template <typename T>
class MemberDelegate : public IActionDelegate {
private:
    T* targetInstance_;
    void (T::*targetFunc_)(int);

public:
    MemberDelegate(T* inst, void (T::*func)(int))
        : targetInstance_(inst), targetFunc_(func) {}

    void execute(int value) override {
        if (targetInstance_ && targetFunc_) {
            (targetInstance_->*targetFunc_)(value);
        }
    }
};

// 3. 型推論を効かせて簡潔に生成するヘルパー関数
template <typename T>
IActionDelegate* createDelegate(T* inst, void (T::*func)(int)) {
    return new MemberDelegate<T>(inst, func);
}`
        },
        {
          filename: 'GameEventSystem.cpp',
          language: 'cpp',
          description: 'Delegateを用いたUIボタンとプレイヤー・音響の疎結合イベント連携',
          code: `#include "Delegate.h"
#include <vector>
#include <string>

// ゲーム内のボタンUI
class GameUIButton {
private:
    std::string label_;
    int eventValue_;
    IActionDelegate* actionDelegate_ = nullptr;

public:
    GameUIButton(const std::string& label, int value)
        : label_(label), eventValue_(value) {}

    ~GameUIButton() {
        delete actionDelegate_; // 登録されたデリゲートを解放
    }

    void setOnClick(IActionDelegate* del) {
        delete actionDelegate_;
        actionDelegate_ = del;
    }

    void simulateClick() {
        std::cout << "\\n[UI] ボタン「" << label_ << "」が押されました！\\n";
        if (actionDelegate_) {
            actionDelegate_->execute(eventValue_);
        }
    }
};

// プレイヤー
class PlayerCharacter {
public:
    void triggerBomb(int blastPower) {
        std::cout << "💣 [Player] メガボム炸裂！ 威力: " << blastPower 
                  << " 画面内の全敵に大ダメージ！\\n";
    }

    void heal(int hpAmount) {
        std::cout << "💚 [Player] ナノリペア起動！ HPが " << hpAmount << " 回復！\\n";
    }
};

// サウンドマネージャー
class AudioSystem {
public:
    void playBgmTrack(int trackId) {
        std::cout << "🎵 [Audio] BGMトラック #" << trackId << " を再生開始\\n";
    }
};

int main() {
    PlayerCharacter player;
    AudioSystem audio;

    // ボタンの作成
    GameUIButton bombButton("ボム発動", 999);
    GameUIButton healButton("緊急回復", 50);
    GameUIButton musicButton("BGM変更", 3);

    // ✅ 型安全に異なるクラスのメンバ関数を登録！
    // 相手が Player でも AudioSystem でも、同じボタンクラスで透過的に扱える！
    bombButton.setOnClick(createDelegate(&player, &PlayerCharacter::triggerBomb));
    healButton.setOnClick(createDelegate(&player, &PlayerCharacter::heal));
    musicButton.setOnClick(createDelegate(&audio, &AudioSystem::playBgmTrack));

    // ボタンのクリックをシミュレート
    bombButton.simulateClick();
    healButton.simulateClick();
    musicButton.simulateClick();

    return 0;
}`
        }
      ],
      umlDiagram: {
        diagramType: 'class',
        title: '型安全DelegateパターンによるUIとゲームオブジェクトの疎結合設計',
        description: 'GameUIButton は具体的な Player や AudioSystem を一切知らず、IActionDelegate インターフェースのみに依存します。MemberDelegate<T> が型を隠蔽（Type Erasure）することで、完璧な疎結合を実現します。',
        classes: [
          {
            name: 'IActionDelegate',
            stereotype: 'interface',
            attributes: [],
            operations: [
              {
                name: 'execute(value: int)',
                type: 'void',
                visibility: '+',
                isVirtual: true,
                codeLineRef: { filename: 'Delegate.h', line: 9, keyword: 'execute' }
              }
            ]
          },
          {
            name: 'MemberDelegate<T>',
            stereotype: 'Generic Delegate',
            attributes: [
              {
                name: 'targetInstance_',
                type: 'T*',
                visibility: '-',
                codeLineRef: { filename: 'Delegate.h', line: 16, keyword: 'targetInstance_' }
              },
              {
                name: 'targetFunc_',
                type: 'void (T::*)(int)',
                visibility: '-',
                codeLineRef: { filename: 'Delegate.h', line: 17, keyword: 'targetFunc_' }
              }
            ],
            operations: [
              {
                name: 'execute(value: int)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'Delegate.h', line: 23, keyword: 'execute' }
              }
            ]
          },
          {
            name: 'GameUIButton',
            stereotype: 'UI Component',
            attributes: [
              {
                name: 'label_',
                type: 'string',
                visibility: '-',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 8, keyword: 'label_' }
              },
              {
                name: 'actionDelegate_',
                type: 'IActionDelegate*',
                visibility: '-',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 10, keyword: 'actionDelegate_' }
              }
            ],
            operations: [
              {
                name: 'setOnClick(del: IActionDelegate*)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 19, keyword: 'setOnClick' }
              },
              {
                name: 'simulateClick()',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 24, keyword: 'simulateClick' }
              }
            ]
          },
          {
            name: 'PlayerCharacter',
            stereotype: 'Game Domain',
            attributes: [],
            operations: [
              {
                name: 'triggerBomb(blastPower: int)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 35, keyword: 'triggerBomb' }
              },
              {
                name: 'heal(hpAmount: int)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 40, keyword: 'heal' }
              }
            ]
          },
          {
            name: 'AudioSystem',
            stereotype: 'Subsystem',
            attributes: [],
            operations: [
              {
                name: 'playBgmTrack(trackId: int)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'GameEventSystem.cpp', line: 48, keyword: 'playBgmTrack' }
              }
            ]
          }
        ],
        relations: [
          {
            from: 'MemberDelegate<T>',
            to: 'IActionDelegate',
            type: 'realization',
            label: 'implements',
            cppMapping: 'class MemberDelegate : public IActionDelegate'
          },
          {
            from: 'GameUIButton',
            to: 'IActionDelegate',
            type: 'composition',
            label: '所有・委譲',
            cppMapping: 'IActionDelegate* actionDelegate_;'
          },
          {
            from: 'MemberDelegate<T>',
            to: 'PlayerCharacter',
            type: 'association',
            label: 'T = PlayerCharacter の場合',
            cppMapping: 'targetInstance_->triggerBomb(val);'
          },
          {
            from: 'MemberDelegate<T>',
            to: 'AudioSystem',
            type: 'association',
            label: 'T = AudioSystem の場合',
            cppMapping: 'targetInstance_->playBgmTrack(val);'
          }
        ],
        codeMappingNotes: [
          'GameUIButton は具体的な PlayerCharacter や AudioSystem を一切 include せず、IActionDelegate.h のみに依存します。',
          'MemberDelegate<T> はインスタンスとメンバ関数ポインタを一体化し、外側からは単一の execute() メソッドとして透過的に呼び出せます。',
          'これにより、ゲーム内のあらゆるオブジェクトの任意のメンバ関数を、型安全性を1ミリも損なわずにUIボタンへ登録できます。'
        ]
      }
    }
  ],
  quiz: [
    {
      id: 'q-l8-1',
      question: 'C言語スタイルの `void (*callback)(void* userData)` コールバックが、大規模なゲーム開発で深刻なバグの温床となる最大の設計的理由はどれでしょうか？',
      options: [
        '関数ポインタの呼び出しオーバーヘッドが非常に大きく、FPSが著しく低下するから',
        'void* にキャストした時点でコンパイラの型チェックが完全に失われ、渡す型やキャスト先を間違えてもコンパイルが通って実行時に即死するから',
        'C言語の関数ポインタは1つのプログラムの中で最大10個までしか宣言できない仕様だから',
        'void* を使うとOSのメモリ管理機能が停止し、PCが必ずフリーズするから'
      ],
      correctIndex: 1,
      explanation: '正解は「void* にキャストした時点でコンパイラの型チェックが完全に失われ、渡す型やキャスト先を間違えてもコンパイルが通って実行時に即死するから」です。void* は型情報を持たないため、例えば Player* を渡すべき場所に誤って SoundManager* を渡してもコンパイラは一切検知できず、実行時に不正なメモリアドレスを読み書きしてクラッシュを引き起こします。'
    },
    {
      id: 'q-l8-2',
      question: 'C++において、通常の関数ポインタ型 `void (*fp)(int)` に、クラスの非staticメンバ関数 `void Player::takeDamage(int)` を直接代入できない本質的な理由は何でしょうか？',
      options: [
        'メンバ関数はコンパイル後に削除されるため、メモリ上に機械語が存在しないから',
        'メンバ関数を正しく実行するには、対象のインスタンスを指す暗黙の第1引数「this ポインタ」を渡す必要があるから',
        'C++ではすべての関数ポインタの利用が言語規格で禁止されているから',
        'メンバ関数は引数を最大で1つしか取ることができない制限があるから'
      ],
      correctIndex: 1,
      explanation: '正解は「メンバ関数を正しく実行するには、対象のインスタンスを指す暗黙の第1引数「this ポインタ」を渡す必要があるから」です。非staticメンバ関数は「どのインスタンスのメンバ変数を操作するのか」を特定するために必ず this ポインタを必要とします。通常の関数ポインタには this を渡す仕組みがないため、型レベルで厳密に区別されています。'
    },
    {
      id: 'q-l8-3',
      question: '多重継承や仮想関数を持つクラスのメンバ関数ポインタの sizeof が、通常のポインタ（64bit環境で8バイト）よりも大きく（16バイト〜24バイト等に）なる理由として正しいものはどれでしょうか？',
      options: [
        '関数の名前（文字列）がそのままポインタの中に埋め込まれているから',
        '呼び出し時に対象の基底クラスへ this ポインタのアドレスを補正するための「this オフセット調整値」などが内部に含まれているから',
        'コンパイラがバグを起こして不要なゴミデータを詰め込んでいるだけである',
        'C++のクラスはすべて16バイト単位でメモリをアライメントしなければならないから'
      ],
      correctIndex: 1,
      explanation: '正解は「呼び出し時に対象の基底クラスへ this ポインタのアドレスを補正するための「this オフセット調整値」などが内部に含まれているから」です。多重継承では、インスタンスの先頭アドレスと各基底クラスのアドレスが一致しません。そのためメンバ関数ポインタは、関数コードのアドレスだけでなく「呼び出し時に this を何バイトずらせばよいか」というオフセット情報を内部に保持しています。'
    },
    {
      id: 'q-l8-4',
      question: 'モダンC++（C++11以降のラムダ式や std::function）が存在しなかったC++03時代、現場で異なるクラスのメンバ関数を型安全にイベント登録するために用いられた設計手法として、最も適切なものはどれでしょうか？',
      options: [
        'すべてのクラスを単一の神クラス（God Object）に統合してメンバ関数を無くす',
        'インスタンスポインタとメンバ関数ポインタをクラステンプレートでペアとして保持し、共通の抽象基底（IActionDelegate）を介して呼び出す委譲（Delegate）パターン',
        'マクロを用いてすべての関数をインライン展開し、実行時の関数呼び出しを行わないようにする',
        'アセンブラでCPUレジスタを直接書き換えるインラインアセンブリを全ファイルに記述する'
      ],
      correctIndex: 1,
      explanation: '正解は「インスタンスポインタとメンバ関数ポインタをクラステンプレートでペアとして保持し、共通の抽象基底（IActionDelegate）を介して呼び出す委譲（Delegate）パターン」です。本章で実装した MemberDelegate<T> のように、インスタンスとメンバ関数ポインタをカプセル化して型消滅（Type Erasure）を行うことで、void* を1行も使わずに完全な型安全性と疎結合性を両立させていました。'
    }
  ],
  prevChapterSlug: 'chapter-7-pointer-alignment-endian',
  nextChapterSlug: 'chapter-9-multiple-inheritance-diamond'
};
