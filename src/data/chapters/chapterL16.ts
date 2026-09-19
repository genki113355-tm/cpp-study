import { Chapter } from '../../types/curriculum';

export const chapterL16: Chapter = {
  id: 24,
  slug: 'chapter-classic-16-bit-flags',
  courseTrack: 'classic',
  courseChapterCode: 'C16',
  title: 'レガシー第16章：ビット演算・ビットフラグとステータス異常系',
  subtitle: '1バイトで8つの状態を操る！ハードウェア直結の高速フラグ・マスク処理',
  badge: 'レガシーC++ L16：ビットフラグ',
  gameVersion: 'v2_classes',
  description: '「無敵状態」「毒」「暗黒」「氷結スロー」「麻痺」「バリア」「飛行」「バーサーク」…ゲームには無数のステータスや属性フラグが存在します。これらを bool 変数としてクラスに1つずつ持たせると、メモリの無駄遣い（構造体のアライメントパディング）が発生するだけでなく、「氷結かつ毒状態の時だけ特効ダメージ」といった複合条件の判定コードが膨大な if-else の迷宮と化します。本章では、ハードウェアの基本原理である【ビット演算（AND, OR, XOR, NOT, シフト）】を徹底的に使いこなし、1つの整数（4バイトで32個、8バイトで64個）で状態を一括管理する【ビットフラグ（Bitmask）】の極意を伝授。生ビットフィールドの落とし穴から、C++の型安全性を損なわない【enum class に対するビット演算子オーバーロード手法】までを完璧にマスターします。',
  prevChapterSlug: 'chapter-classic-15-data-driven',
  nextChapterSlug: undefined,
  sections: [
    {
      id: 'sec-l16-bool-overhead',
      title: 'L16.1 boolフラグ20個のメモリの無駄とパディング：ハードウェア目線で見るビットの価値',
      leadText: 'なぜ bool を並べるとメモリが浪費されるのか？CPUのアライメントとデータサイズの真実を暴きます。',
      dialogueBefore: [
        {
          id: 'dl16-1',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'シロクマ先生、RPGやアクションゲームを作っていると、bool isPoison; bool isFrozen; bool isInvincible; みたいに状態フラグが20個くらい増えてしまいます。bool は 0 か 1 だから、20個あってもたった20ビット（約2.5バイト）ですよね？'
        },
        {
          id: 'dl16-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '甘い！甘すぎるぞペンギン君！現代の一般的なCPUでは、メモリのアドレス付けの最小単位は「1バイト（8ビット）」じゃ！したがって bool 1つで最低でも1バイト消費するのじゃ！'
        },
        {
          id: 'dl16-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ええっ！？ 1ビットの情報のために、8ビット（1バイト）も使っているんですか！？'
        },
        {
          id: 'dl16-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'それどころか、構造体のアライメント（境界整列）の都合で、後ろにパディング（無駄な隙間）が挟まり、さらにメモリを浪費することもある。何千体もの敵や弾が存在するゲームにおいて、これはキャッシュミスを激発させる大罪じゃ！ビット演算を使えば、32個の状態をたった4バイト（uint32_t 1つ）に凝縮できるのじゃ！'
        }
      ],
      paradigmComparison: {
        title: '無数のbool変数 vs 1整数のビットフラグ（Bitmask）',
        cApproach: {
          title: '❌ 大量のboolフラグによる状態管理（メモリ浪費・複合判定地獄）',
          code: `struct CharacterStatus {
    bool isPoison;
    bool isFrozen;
    bool isInvincible;
    bool hasShield;
    bool isConfused;
    bool isFlying;
    // ⚠️ 20個のboolで20バイト以上消費！
    // 「毒かつ氷結かつバリアなし」を判定するのに:
    // if (isPoison && isFrozen && !hasShield) ...
    // 条件式が長くなりCPU分岐予測も悪化する
};`,
          drawbacks: [
            '1ビットで済む情報に1バイト以上を消費し、メモリ使用量が無駄に膨らむ',
            '複数状態の同時チェックに複数の論理演算（&& や ||）が必要で、分岐予測ミスを誘発する',
            'ネットワーク通信やセーブデータ保存時に、データサイズが無駄に大きくなる'
          ]
        },
        cppApproach: {
          title: '⭕ ビット演算によるフラグ集約（uint32_t で32種の状態をO(1)一括判定）',
          code: `// 1ビットごとに意味を割り当て（1 << 0, 1 << 1, ...）
enum StatusFlag {
    STATUS_POISON     = 1 << 0, // 0b00000001 (1)
    STATUS_FROZEN     = 1 << 1, // 0b00000010 (2)
    STATUS_INVINCIBLE = 1 << 2, // 0b00000100 (4)
    STATUS_SHIELD     = 1 << 3, // 0b00001000 (8)
};

uint32_t status = 0;
// 付与: status |= STATUS_POISON;
// 判定: if ((status & (STATUS_POISON | STATUS_FROZEN)) == (STATUS_POISON | STATUS_FROZEN))
// 1回のビット演算だけで「毒かつ氷結」を高速判定！`,
          benefits: [
            '32個の状態がたった4バイト、64個の状態がたった8バイトに完全凝縮',
            '複数状態の同時検査、一括クリア、一括反転がたった1クロックのCPU命令で完了',
            'セーブデータやパケットシリアライズで、整数1個をそのまま書き出すだけで完了'
          ]
        },
        paradigmShiftNotes: 'ハードウェア本来の語彙である「ビット」を直接操ることで、メモリ効率と実行速度の限界を突破します。'
      }
    },
    {
      id: 'sec-l16-bit-operations',
      title: 'L16.2 ビット演算四則（&, |, ^, ~, <<）とビットマスクの完全制覇',
      leadText: 'プログラマの基本教養であるビットマスクの4大操作（立てる・消す・反転する・調べる）を体得します。',
      processSteps: [
        {
          stepNumber: 1,
          title: 'フラグを立てる（SET）：OR演算（|）',
          description: 'flags |= MASK; で、特定ビットだけを確実に 1 にします。他のビットは一切影響を受けません。',
          impact: '状態の付与'
        },
        {
          stepNumber: 2,
          title: 'フラグを消す（CLEAR）：AND演算 ＋ 反転（& ~）',
          description: 'flags &= ~MASK; で、特定ビットだけを確実に 0 にします。~MASK により目的のビットだけが0、他が1のマスクが作られます。',
          impact: '状態の解除・回復'
        },
        {
          stepNumber: 3,
          title: 'フラグを反転する（TOGGLE）：XOR演算（^）',
          description: 'flags ^= MASK; で、1なら0へ、0なら1へと状態をトグル反転させます。点滅エフェクトなどに最適です。',
          impact: '点滅・交互切り替え'
        },
        {
          stepNumber: 4,
          title: 'フラグを調べる（TEST）：AND演算（&）',
          description: 'if ((flags & MASK) != 0) で、そのビットが立っているかを瞬時に判定します。',
          impact: '状態異常の検知'
        }
      ]
    },
    {
      id: 'sec-l16-typesafe-enum-flags',
      title: 'L16.3 型安全なビットフラグ：enum class に対する演算子オーバーロード',
      leadText: '生整数やC言語enumの脆弱性を克服し、C++らしい堅牢な型安全ビットマスクを設計します。',
      codeFiles: [
        {
          filename: 'StatusFlags.cpp',
          language: 'cpp',
          description: '型安全なenum classビット演算子オーバーロードと状態管理クラス',
          isMain: true,
          code: `#include <iostream>
#include <stdint.h>

// スコープ付き列挙型（enum class）で型安全なフラグを定義
enum class StatusEffect : uint32_t {
    None        = 0,
    Poison      = 1 << 0, // 0x01: 毒（毎秒スリップダメージ）
    Frozen      = 1 << 1, // 0x02: 氷結（移動速度半減）
    Invincible  = 1 << 2, // 0x04: 無敵（被弾無効）
    Shield      = 1 << 3, // 0x08: バリア展開中
    Berserk     = 1 << 4, // 0x10: 攻撃力2倍
};

// ビット演算子 | のオーバーロード
inline StatusEffect operator|(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(
        static_cast<uint32_t>(a) | static_cast<uint32_t>(b)
    );
}

// ビット演算子 & のオーバーロード
inline StatusEffect operator&(StatusEffect a, StatusEffect b) {
    return static_cast<StatusEffect>(
        static_cast<uint32_t>(a) & static_cast<uint32_t>(b)
    );
}

// ビット反転 ~ のオーバーロード
inline StatusEffect operator~(StatusEffect a) {
    return static_cast<StatusEffect>(~static_cast<uint32_t>(a));
}

class Character {
private:
    StatusEffect status_;

public:
    Character() : status_(StatusEffect::None) {}

    // フラグ付与
    void addStatus(StatusEffect effect) {
        status_ = status_ | effect;
    }

    // フラグ解除
    void removeStatus(StatusEffect effect) {
        status_ = status_ & (~effect);
    }

    // フラグ所持チェック
    bool hasStatus(StatusEffect effect) const {
        return (status_ & effect) != StatusEffect::None;
    }

    // 複合フラグの一括チェック（指定したフラグをすべて持っているか）
    bool hasAllStatus(StatusEffect combined) const {
        return (status_ & combined) == combined;
    }

    void printStatus() const {
        std::cout << "[ステータス] 生ビット値: 0x" << std::hex << static_cast<uint32_t>(status_) << std::dec << std::endl;
        if (hasStatus(StatusEffect::Poison))     std::cout << "  - 🟣 毒状態" << std::endl;
        if (hasStatus(StatusEffect::Frozen))     std::cout << "  - ❄️ 氷結状態" << std::endl;
        if (hasStatus(StatusEffect::Invincible)) std::cout << "  - ✨ 無敵状態" << std::endl;
        if (hasStatus(StatusEffect::Shield))     std::cout << "  - 🛡️ バリア展開中" << std::endl;
        if (hasStatus(StatusEffect::Berserk))    std::cout << "  - ⚔️ バーサーク発動中" << std::endl;
    }
};

int main() {
    Character hero;
    std::cout << "=== 初期状態 ===" << std::endl;
    hero.printStatus();

    std::cout << "\\n=== 毒と氷結の複合付与 ===" << std::endl;
    hero.addStatus(StatusEffect::Poison | StatusEffect::Frozen);
    hero.printStatus();

    // 複合判定
    if (hero.hasAllStatus(StatusEffect::Poison | StatusEffect::Frozen)) {
        std::cout << "  ⚠️ 氷結毒の相乗効果！毎秒ダメージ2倍！" << std::endl;
    }

    std::cout << "\\n=== 解毒ポーション使用 ===" << std::endl;
    hero.removeStatus(StatusEffect::Poison);
    hero.printStatus();

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'ビットマスクの4大操作',
          description: 'OR（立てる）、AND+NOT（消す）、XOR（反転）、AND（調べる）を脊椎反射で書けるようにする。'
        },
        {
          title: 'enum class による型安全化',
          description: 'ビット演算子をオーバーロードすることで、生整数の暗黙変換を防ぎつつ美しいマスク演算を可能にする。'
        },
        {
          title: '生ビットフィールドの回避',
          description: 'C++言語の生ビットフィールド（: 1）はメモリレイアウトやエンディアンが処理系定義のため、通信やセーブにはビットマスク演算を使う。'
        },
        {
          title: '演算子の優先順位に警戒',
          description: '== や != は & や | よりも優先順位が高いため、必ず (flags & MASK) != 0 のように括弧で囲む。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l16-1',
      question: '整数変数 flags のうち、MASK ビットだけを確実に「0（オフ）」にして他のビットを維持する正しいビット演算式はどれですか？',
      options: [
        'flags = flags | ~MASK;',
        'flags = flags & ~MASK;',
        'flags = flags ^ MASK;',
        'flags = flags << MASK;'
      ],
      correctIndex: 1,
      explanation: 'MASKをビット反転（~）すると対象ビットだけが0、他が1のマスクができます。これとAND（&）を取ることで、目的のビットのみを0にして他を保持できます。'
    },
    {
      id: 'quiz-l16-2',
      question: 'C++の式「if (flags & MASK != 0)」において、開発者が意図しない重大なバグが発生する理由は何ですか？',
      options: [
        '& 演算子は if 文の条件式の中で使用することが文法上禁止されているため',
        '!= 比較演算子の方が & ビット演算子よりも結合優先順位が高いため、flags & (MASK != 0) と評価されてしまうから',
        '& 演算を行うと変数の値が自動的に 0 に書き換わってしまうため',
        'MASK が 2 以上のとき、!= 0 は常に偽になるため'
      ],
      correctIndex: 1,
      explanation: 'C/C++において等価演算子（==, !=）はビット演算子（&, |, ^）よりも優先順位が高いため、必ず「(flags & MASK) != 0」のように括弧で囲まないと期待通りに動作しません。'
    },
    {
      id: 'quiz-l16-3',
      question: 'C++の構造体ビットフィールド（例: unsigned int flag : 1;）が、ネットワークパケットやバイナリセーブデータで推奨されない主な理由は何ですか？',
      options: [
        'ビットフィールドを使うとプログラムのコンパイル時間が10倍になるため',
        'ビットの並び順（エンディアンや上位/下位ビットの配置）が処理系依存（コンパイラ依存）で移植性がないため',
        '64ビットOSではビットフィールドが一切サポートされていないため',
        'ビットフィールドは仮想関数を持つことができないため'
      ],
      correctIndex: 1,
      explanation: 'C++規格ではビットフィールドのビット詰め順序（LSBからかMSBからか）やアライメント境界跨ぎの挙動が処理系定義となっているため、異なる環境やコンパイラ間でのバイナリ互換性が保証されません。そのため、明示的なビットシフト・ビットマスク演算が推奨されます。'
    }
  ]
};
