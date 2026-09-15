import { Chapter } from '../../types/curriculum';

export const chapterL6: Chapter = {
  id: 9,
  slug: 'chapter-6-operator-overload-vector',
  courseTrack: 'classic',
  courseChapterCode: 'C6',
  title: 'レガシー第6章：演算子オーバーロードと値オブジェクト',
  subtitle: '数式通りに弾道や位置を記述！C++における数学クラスと演算子の流儀',
  badge: 'レガシーC++ L6：演算子とVec2D',
  gameVersion: 'v2_classes',
  description: 'C言語の構造体では、座標や速度の加算に `Vec2_Add(&pos, &vel, &out);` のような関数呼び出しを多用し、コードのネストや引数順序のバグに悩まされていました。C++の強力な機能「演算子オーバーロード（operator+, operator*, operator+=）」を活用することで、数学の公式通りに物理演算を直感的に記述する手法を習得します。さらに、予期せぬ暗黙の型変換を防ぐ explicit キーワード、friend 関数によるストリーム出力（std::cout << v）、値オブジェクト設計の作法をマスターします。',
  sections: [
    {
      id: 'sec-l6-vec2-add',
      title: 'L6.1 C言語の関数地獄 vs C++演算子オーバーロード',
      leadText: '`Vec2_Add(&pos, Vec2_Scale(&vel, dt, &tmp), &pos);` に終止符を打つ！高校数学の数式そのまま `pos += vel * dt;` と書ける圧倒的恩恵と設計の必然性を学びます。',
      dialogueBefore: [
        {
          id: 'dl6-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生！インベーダーの弾道計算で「自機に向かって飛ぶ誘導ミサイル」や「扇状に広がる拡散弾」を作ろうとしたら、C言語スタイルの計算関数で画面が埋め尽くされて頭が破裂しそうです……！'
        },
        {
          id: 'dl6-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'どれどれ……ほほう！`Vec2_Add(&targetPos, Vec2_Normalize(Vec2_Sub(&p, &e, &t1), &t2), &res);` か！見事なまでの【C言語ネスト地獄】じゃな。括弧がどれに対応しているか誰も読めん！'
        },
        {
          id: 'dl6-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '紙のノートに書くときは `pos = pos + vel * dt;` ってサラッと書けるのに、プログラムになるとどうしてこんなに醜くなるんでしょうか……？'
        },
        {
          id: 'dl6-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ガハハ！そこで登場するのがC++の真骨頂【演算子オーバーロード（Operator Overloading）】じゃ！ユーザー定義のクラスであっても、int や float と全く同じように `+`, `-`, `*`, `+=` を直接使って数式通りに記述できるようにする魔法なんじゃぞ！'
        }
      ],
      paradigmComparison: {
        title: 'C言語（関数ポインタ渡し） vs C++（演算子オーバーロード）',
        cApproach: {
          title: 'C言語：すべての演算を関数呼び出し＆ポインタ渡しで記述',
          code: `typedef struct {
    float x;
    float y;
} Vec2;

// ベクトルの足し算：第1引数と第2引数を足して第3引数に出力
void Vec2_Add(const Vec2* a, const Vec2* b, Vec2* out) {
    out->x = a->x + b->x;
    out->y = a->y + b->y;
}

// スカラー倍：ベクトルに係数を掛ける
void Vec2_Scale(const Vec2* v, float s, Vec2* out) {
    out->x = v->x * s;
    out->y = v->y * s;
}

// 物理移動計算：pos = pos + vel * dt
Vec2 pos = { 10.0f, 20.0f };
Vec2 vel = { 2.0f, -5.0f };
float dt = 0.016f;

Vec2 tempVel;
Vec2_Scale(&vel, dt, &tempVel);
Vec2_Add(&pos, &tempVel, &pos); // 引数の順番を間違えると即バグ！`,
          drawbacks: [
            '数式が長くなると一時変数（tempVel等）が乱立し、コードが極めて読みづらくなる',
            '出力引数（out）のポインタ渡しが必要で、引数の順番（入力か出力か）を取り違えやすい',
            'NULLポインタチェックを忘れると即座にセグメンテーション違反でクラッシュする'
          ]
        },
        cppApproach: {
          title: 'C++：高校数学の数式そのままに直感的に記述',
          code: `class Vec2 {
public:
    float x;
    float y;

    Vec2(float x = 0.0f, float y = 0.0f) : x(x), y(y) {}

    // 加算演算子：a + b
    Vec2 operator+(const Vec2& rhs) const {
        return Vec2(x + rhs.x, y + rhs.y);
    }

    // スカラー乗算：v * s
    Vec2 operator*(float s) const {
        return Vec2(x * s, y * s);
    }

    // 複合代入演算子：pos += vel
    Vec2& operator+=(const Vec2& rhs) {
        x += rhs.x;
        y += rhs.y;
        return *this; // 自身への参照を返す
    }
};

// 物理移動計算：驚くほどシンプル！
Vec2 pos(10.0f, 20.0f);
Vec2 vel(2.0f, -5.0f);
float dt = 0.016f;

pos += vel * dt; // 数学の公式と完全に同一！一時変数も一切不要！`,
          benefits: [
            '数学の教科書や物理エンジンの公式をそのまま1行でミスなくコードに落とし込める',
            'ポインタ渡しの引数順序ミスや NULL 参照のリスクがゼロになる',
            'コンパイラのインライン展開最適化により、関数呼び出しのオーバーヘッドも完全に消滅'
          ]
        },
        paradigmShiftNotes: 'C言語では「データ」と「演算関数」が分断されていました。C++ではクラスに演算子の意味を再定義することで、ユーザー定義型を言語組み込み型（intやfloat）と同等の第一級市民として扱えるようになります。'
      }
    },
    {
      id: 'sec-l6-operators-discipline',
      title: 'L6.2 演算子オーバーロードの鉄則：参照返し・const・explicit',
      leadText: '「便利だから何でもオーバーロードして良い」わけではありません！参照返しと値返しの違い、暗黙変換を防ぐ explicit の防波堤を学びます。',
      dialogueBefore: [
        {
          id: 'dl6-5',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '先生、`operator+` は `Vec2`（値）を返しているのに、`operator+=` は `Vec2&`（参照）を返して `return *this;` しています。この違いは何なんですか？'
        },
        {
          id: 'dl6-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '素晴らしい観察眼じゃ！`a + b` は「新しい計算結果」を作るから新しいオブジェクトのコピー（値）を返す。じゃが、`a += b` は「すでに存在する a 自身を書き換える」から、無駄なコピーを避けて `a` そのものの参照を返すのがC++標準の掟なんじゃ！'
        },
        {
          id: 'dl6-7',
          speaker: 'penguin',
          emotion: 'shocked',
          text: '参照を返せば、`(a += b) += c;` みたいに連鎖（Chaining）もできるわけですね！'
        },
        {
          id: 'dl6-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！そしてもう1つの重要トラップが【暗黙の型変換】じゃ。単一引数のコンストラクタには必ず `explicit` を付けんと、意図しない型変換で謎のバグを踏むことになるぞ！'
        }
      ],
      variables: [
        {
          name: 'Vec2 operator+(const Vec2& rhs) const',
          type: 'メンバ関数（値返し）',
          scope: 'class Vec2',
          description: '2つのベクトルを加算した新しい Vec2 を生成して返す。自身（this）を変更しないため末尾に const を付与。',
          cComparison: 'C言語では一時オブジェクトを手動で malloc するか、出力先ポインタを渡す必要があった。'
        },
        {
          name: 'Vec2& operator+=(const Vec2& rhs)',
          type: 'メンバ関数（参照返し）',
          scope: 'class Vec2',
          description: '自身の x, y を加算更新し、*this の参照を返す。コピーを発生させず高速に連鎖代入をサポート。',
          cComparison: 'C言語の a.x += b.x; a.y += b.y; をクラス内部にカプセル化。'
        },
        {
          name: 'explicit Vec2(float scalar)',
          type: '単一引数コンストラクタ',
          scope: 'class Vec2',
          description: 'explicit を付けることで、例えば関数 foo(Vec2 v) に誤って数値 5.0f を渡した際に勝手に Vec2(5.0f, 5.0f) に暗黙変換される事故をコンパイルエラーとして防ぐ。',
          cComparison: 'C言語には暗黙のコンストラクタ呼び出しが存在しないため、C++特有の安全弁。'
        }
      ]
    },
    {
      id: 'sec-l6-friend-stream',
      title: 'L6.3 friend 関数とストリーム出力（std::cout << vec）',
      leadText: 'なぜ `std::cout << v;` はメンバ関数として書けないのか？二項演算子の左辺と右辺の力関係、および `friend` 関数の正しい使い道を解明します。',
      dialogueBefore: [
        {
          id: 'dl6-9',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '先生！ベクトルの座標を画面にデバッグ出力したいので、`std::cout << pos;` って書けるようにしたいです！でも、`std::cout` 側のクラス（std::ostream）を書き換えるわけにはいかないですよね……？'
        },
        {
          id: 'dl6-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そうなんじゃ！メンバ関数として定義すると「左辺のオブジェクト（this）」に属する関数になる。しかし `std::cout << v` の左辺は標準ライブラリの `std::ostream` じゃ。そこで【非メンバ関数】として演算子をオーバーロードし、クラス内部のプライベート変数にアクセスさせるために【friend 宣言】を使うのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'Vec2.h',
          language: 'cpp',
          description: '演算子オーバーロードとfriendストリーム出力を備えた完全な2Dベクトルクラス',
          isMain: true,
          code: `#pragma once
#include <iostream>

class Vec2 {
private:
    float x_;
    float y_;

public:
    // デフォルト＆座標コンストラクタ
    Vec2(float x = 0.0f, float y = 0.0f) : x_(x), y_(y) {}

    // 単一引数：正方形や等倍スケーリング用（暗黙変換防止）
    explicit Vec2(float scalar) : x_(scalar), y_(scalar) {}

    // ゲッター
    float getX() const { return x_; }
    float getY() const { return y_; }

    // 算術演算子
    Vec2 operator+(const Vec2& rhs) const {
        return Vec2(x_ + rhs.x_, y_ + rhs.y_);
    }

    Vec2 operator-(const Vec2& rhs) const {
        return Vec2(x_ - rhs.x_, y_ - rhs.y_);
    }

    Vec2 operator*(float scalar) const {
        return Vec2(x_ * scalar, y_ * scalar);
    }

    // 複合代入演算子（高速な参照返し）
    Vec2& operator+=(const Vec2& rhs) {
        x_ += rhs.x_;
        y_ += rhs.y_;
        return *this;
    }

    Vec2& operator-=(const Vec2& rhs) {
        x_ -= rhs.x_;
        y_ -= rhs.y_;
        return *this;
    }

    Vec2& operator*=(float scalar) {
        x_ *= scalar;
        y_ *= scalar;
        return *this;
    }

    // 等価比較演算子
    bool operator==(const Vec2& rhs) const {
        return (x_ == rhs.x_) && (y_ == rhs.y_);
    }

    bool operator!=(const Vec2& rhs) const {
        return !(*this == rhs);
    }

    // ストリーム出力 friend 宣言
    friend std::ostream& operator<<(std::ostream& os, const Vec2& v);
};

// ストリーム出力演算子の非メンバ実装
inline std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    os << "(" << v.x_ << ", " << v.y_ << ")";
    return os;
}`
        },
        {
          filename: 'Weapon.cpp',
          language: 'cpp',
          description: '扇状拡散ショット（3WAY）の弾道計算と直感的な位置更新',
          code: `#include "Vec2.h"
#include <vector>
#include <cmath>

// 扇状拡散ショット（3WAY）の弾道ベクトル生成
std::vector<Vec2> createTripleShot(const Vec2& playerPos, float speed) {
    std::vector<Vec2> bulletVelocities;

    // 前方（上向き）
    bulletVelocities.push_back(Vec2(0.0f, -speed));
    // 左斜め拡散弾（-15度）
    bulletVelocities.push_back(Vec2(-speed * 0.3f, -speed * 0.95f));
    // 右斜め拡散弾（+15度）
    bulletVelocities.push_back(Vec2(speed * 0.3f, -speed * 0.95f));

    return bulletVelocities;
}

void updateBullets(std::vector<Vec2>& positions, const std::vector<Vec2>& velocities, float dt) {
    for (size_t i = 0; i < positions.size(); ++i) {
        // 演算子オーバーロードのおかげで、極めて直感的かつ高速に位置更新！
        positions[i] += velocities[i] * dt;
    }
}`
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-l6-1',
      question: '複合代入演算子（operator+=）の戻り値の型として、C++の標準規律に最も則したものはどれですか？',
      options: [
        'Vec2 （新しいオブジェクトのコピーを値で返す）',
        'Vec2& （自身への参照 *this を返す）',
        'void （何も返さない）',
        'const Vec2& （書き換え不可能な const 参照を返す）'
      ],
      correctIndex: 1,
      explanation: 'operator+= は自身を変更する演算子であるため、無駄なオブジェクトコピーを避けて自身への参照（Vec2&）を返し、末尾で return *this; と書くのがC++の慣例です。これにより (a += b) += c; のような連鎖呼び出しも可能になります。'
    },
    {
      id: 'q-l6-2',
      question: '単一引数を受け取るコンストラクタに explicit キーワードを付与する最大の目的は何ですか？',
      options: [
        'メモリをヒープ領域ではなくスタック領域に強制配置するため',
        'コンパイラがプログラマの意図しない暗黙の型変換（Implicit Conversion）を行うのを防止するため',
        '関数をインライン展開させないようにするため',
        '親クラスの仮想関数テーブルを上書きするため'
      ],
      correctIndex: 1,
      explanation: 'explicit を付けないと、例えば void attack(Vec2 target); という関数に attack(10.0f); と渡した際、コンパイラが勝手に Vec2(10.0f) に変換して呼び出してしまい、重大なバグの原因になります。explicit は意図的な型変換のみを許可する安全装置です。'
    },
    {
      id: 'q-l6-3',
      question: 'Vec2 クラスのメンバ関数として二項演算子 operator+ を定義する場合、関数の引数は通常いくつになりますか？',
      options: [
        '0個',
        '1個 （左辺は暗黙の this ポインタとなるため、右辺のみを受け取る）',
        '2個 （左辺と右辺の両方を受け取る）',
        '3個 （出力先ポインタを含めて3個）'
      ],
      correctIndex: 1,
      explanation: '二項演算子をメンバ関数として定義する場合、左辺のオブジェクト自身が this として暗黙に渡されるため、明示的な引数は右辺（const Vec2& rhs）の1個だけになります。'
    },
    {
      id: 'q-l6-4',
      question: 'std::cout << v; のように、自作クラスをストリーム出力演算子で出力できるようにしたい場合、なぜ operator<< はメンバ関数ではなく friend（または非メンバ）関数として定義する必要があるのですか？',
      options: [
        'std::cout は const オブジェクトであり、メンバ関数を受け付けないから',
        '演算子の左辺が自クラスではなく、標準ライブラリの std::ostream だから',
        'friend 関数にしないとコンパイル速度が極端に落ちるから',
        'C++03 では演算子オーバーロードが禁止されているから'
      ],
      correctIndex: 1,
      explanation: '二項演算子をメンバ関数にする場合、左辺の型がそのクラス自身である必要があります。std::cout << v の左辺は std::ostream 型であり、私たちが標準ライブラリの std::ostream クラスにメンバ関数を追加することはできないため、非メンバ関数として定義し、プライベート変数へのアクセスを friend で許可します。'
    }
  ],
  prevChapterSlug: 'chapter-6-design-patterns',
  nextChapterSlug: 'chapter-7-pointer-alignment-endian'
};

