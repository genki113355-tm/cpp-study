import { Chapter } from '../../types/curriculum';

export const ENVIRONMENT_SETUP_GUIDE: Chapter = {
  id: 103,
  slug: 'guide-environment-setup',
  category: 'guide',
  courseTrack: 'guide',
  courseChapterCode: 'G1',
  title: '実際に組んで動かす！C++ローカル開発環境構築ガイド',
  subtitle: '〜VS Code ＋ CMake ＋ モダンコンパイラで始める実機ビルド＆デバッグ〜',
  badge: '実践環境構築',
  description: 'ブラウザ上の学習から一歩踏み出し、自分の手元のパソコン（Windows / Mac / Linux）でC++コードを書いてコンパイルし、ブレークポイントを打ってデバッグ実行するまでの完全な環境構築手順をゼロから解説します。',
  gameVersion: 'none',
  sections: [
    {
      id: 'three-pillars-of-cpp-dev',
      title: '1.1 C++開発の「3大ツール」を理解する',
      leadText: 'PythonやNode.jsと違い、C++でコードを動かすには「3つの異なる道具」を揃える必要があります。それぞれの役割を整理しましょう。',
      dialogueBefore: [
        {
          id: 'dlg-es-1',
          speaker: 'penguin',
          emotion: 'question',
          text: '指導官！ブラウザで動くのも楽しいですが、やっぱり自分のPCで \`main.cpp\` を作って動かしてみたいです！でも「コンパイラ」とか「CMake」とか色々あって何から入れればいいのか…',
        },
        {
          id: 'dlg-es-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！自分のPCで初めて \`a.out\` や \`app.exe\` が動いた瞬間の感動は格別じゃぞ。C++開発の道具立ては「エディタ」「コンパイラ」「ビルドツール（CMake）」の3人衆で成り立っておる。まずはこの3者の役割を押さえるのじゃ！',
        },
      ],
      explanationText: `
### C++開発を支える3大ツール

\`\`\`
[ソースコード (.cpp / .h)]
       │
       ▼
 1. エディタ (VS Code)       : コードを書く、コード補完、エラー表示
       │
       ▼
 2. CMake (ビルドツール)      : 「どのファイルをどういう順でビルドするか」の設計図を作る
       │
       ▼
 3. コンパイラ (MSVC/GCC/Clang) : 人間の書いたコードをCPUが理解できる機械語（.exe / バイナリ）に変換
\`\`\`

1. **エディタ / IDE（統合開発環境）**:
   おすすめは **Visual Studio Code (VS Code)** です。軽量で、Windows/Mac/Linuxすべてで同じ操作感で動作します（Windowsなら **Visual Studio Community** も定番です）。
2. **コンパイラ**:
   ソースコード（テキスト）を機械語（バイナリ）に変換するプログラム。OSごとに標準コンパイラが異なります。
   - **Windows**: MSVC（Microsoft Visual C++）または MinGW (GCC)
   - **Mac**: Apple Clang（Xcode Command Line Tools）
   - **Linux**: GCC（GNU Compiler Collection）または Clang
3. **ビルドシステム（CMake）**:
   ファイルが10個、20個と増えたとき、1つずつコマンドでコンパイルするのは不可能です。CMakeはクロスプラットフォームでビルドを全自動化してくれる世界標準ツールです。
      `,
    },
    {
      id: 'compiler-installation',
      title: '1.2 OS別：コンパイラ導入手順',
      leadText: 'まずはお使いのOSに合わせてコンパイラをインストールします。以下の手順に従ってコマンド1つでセットアップできます。',
      explanationText: `
### ① Windows の場合（最もおすすめ：Visual Studio Build Tools）

1. **Visual Studio Community** または **Build Tools for Visual Studio** を公式サイトからダウンロードして実行します。
2. インストーラーで **「C++ によるデスクトップ開発」** にチェックを入れてインストールします。
   - これにより、世界最高峰のコンパイラ \`cl.exe\` (MSVC) とデバッガが自動導入されます。
3. （軽量派向け代替案）**MSYS2** を導入し、\`pacman -S mingw-w64-ucrt-x86_64-gcc\` で GCC をインストールする選択肢もあります。

---

### ② Mac の場合（Apple Clang）

ターミナルを開き、以下のコマンドを1行実行するだけです。

\`\`\`bash
xcode-select --install
\`\`\`

ダイアログが表示されたら「インストール」をクリックします。完了後、以下のコマンドでバージョンが出れば成功です。

\`\`\`bash
clang++ --version
# Apple clang version 15.x.x ... と出ればOK！
\`\`\`

---

### ③ Linux (Ubuntu / Debian) の場合（GCC）

ターミナルでパッケージマネージャから一発で入ります。

\`\`\`bash
sudo apt update
sudo apt install build-essential gdb cmake -y
g++ --version
\`\`\`
      `,
    },
    {
      id: 'vscode-setup',
      title: '1.3 推奨構成：VS Code の必須拡張機能',
      leadText: 'VS Codeを「最高峰のC++ IDE」に化けさせる、マイクロソフト公式の必須拡張機能を導入します。',
      explanationText: `
### VS Code にインストールすべき2つの拡張機能

VS Code の拡張機能タブ（Ctrl+Shift+X または Cmd+Shift+X）を開き、以下を検索してインストールします。

1. **\`C/C++\` (ms-vscode.cpptools)**:
   Microsoft謹製。強力なコード補完（IntelliSense）、定義ジャンプ（F12）、デバッグ（ブレークポイント）を可能にします。
2. **\`CMake Tools\` (ms-vscode.cmake-tools)**:
   CMakeLists.txt を検知し、エディタ下部のステータスバーに「ビルドボタン」「デバッグ実行ボタン」を自動配置してくれます。

\`\`\`
[VS Code ステータスバー（CMake Tools導入後）]
[CMake: Debug] [Clang 15.0] [Build] [▶ 実行] [🐞 デバッグ]
\`\`\`
これが入ると、複雑なコマンドを一切打たずに、下部の「Build」や「虫アイコン（デバッグ）」をクリックするだけで開発ができるようになります！
      `,
    },
    {
      id: 'cmakelists-template',
      title: '1.4 コピペで動く！最小の `CMakeLists.txt` テンプレート',
      leadText: '本講座のインベーダーゲームや複数クラスのプログラムをビルドするための、標準的かつ美しい CMakeLists.txt です。',
      explanationText: `
### プロジェクトのフォルダ構成例

\`\`\`
my-cpp-project/
├── CMakeLists.txt      <-- ビルド設定ファイル
└── src/
    ├── main.cpp        <-- エントリポイント
    ├── Player.h        <-- 自機クラス宣言
    ├── Player.cpp      <-- 自機クラス実装
    ├── Enemy.h         <-- 敵クラス宣言
    └── Enemy.cpp       <-- 敵クラス実装
\`\`\`

### \`CMakeLists.txt\` の中身（そのまま使えます）

\`\`\`cmake
# 1. 最小要求 CMake バージョン
cmake_minimum_required(VERSION 3.15)

# 2. プロジェクト名とバージョン
project(CppInvaderGame VERSION 1.0.0 LANGUAGES CXX)

# 3. C++17 標準を強制（モダンC++の機能を有効化）
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 4. コンパイル警告を最大にしてバグを早期発見
if (MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# 5. ヘッダファイルの探索場所（include ディレクトリ）
include_directories(src)

# 6. 実行可能バイナリ（cpp_invader）の生成とソースファイル指定
add_executable(cpp_invader
    src/main.cpp
    src/Player.cpp
    src/Enemy.cpp
)
\`\`\`

#### ポイント解説
- \`set(CMAKE_CXX_STANDARD 17)\`: これを書くだけで、コンパイラが何であっても自動的に \`-std=c++17\` フラグが適用されます。
- \`add_executable(アプリ名 ソースファイル一覧...)\`: ここに新しく追加した \`.cpp\` ファイルを並べるだけで、自動で一括コンパイル＆リンクしてくれます。
      `,
      dialogueBefore: [
        {
          id: 'dlg-es-3',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'おおっ！CMakeLists.txt って難しそうに見えて、実は「プロジェクト名」「C++のバージョン（C++17）」「コンパイルするcppファイル名」を書いてあるだけなんですね！',
        },
        {
          id: 'dlg-es-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！これさえあれば、Windowsで作ったプロジェクトをそのままMacやLinuxの仲間に渡しても、コマンド一発でビルドできるのじゃ！',
        },
      ],
    },
    {
      id: 'build-and-debug-flow',
      title: '1.5 F5キー一発！ビルド＆ブレークポイントデバッグの実践',
      leadText: '環境が整ったら、実際にコードを走らせてデバッガの威力を体験してみましょう。',
      explanationText: `
### デバッグ実行の3ステップ

1. **ブレークポイントを打つ**:
   \`src/main.cpp\` を開き、止めたい行の「行番号の左側」をクリックします。**赤い丸（●）**が点灯します。
2. **デバッグ開始（F5 または 虫アイコン）**:
   VS Code のステータスバーにある「🐞（デバッグ実行）」を押すか、\`F5\` キーを押します。
   - CMake が自動的に変更を検知してビルドを実行。
   - プログラムが起動し、先ほど赤い丸を打った行で**黄色いハイライト**になってピタッと一時停止します！
3. **変数とステップ実行を確認する**:
   - **左側の「変数」パネル**: その時点での変数の値（\`x = 10\`, \`hp = 100\` など）が生でリアルタイム表示されます。
   - **F10（ステップオーバー）**: 次の1行を実行します。
   - **F11（ステップイン）**: 呼び出している関数の中に入り込みます。
   - **Shift+F5**: デバッグを終了します。

\`printf\` や \`std::cout\` でログを埋め込まなくても、デバッガを使えば**「プログラムを一時停止して、時間を止めた状態で中身を観察できる」**ようになります。
      `,
    },
    {
      id: 'troubleshooting-common-errors',
      title: '1.6 初心者が100%直面する「2大ビルドエラー」と解決法',
      leadText: 'C++のビルドエラーは英語で長くて威圧的ですが、原因の99%は以下の2パターンに分類されます。',
      explanationText: `
### エラー1：\`fatal error: Player.h: No such file or directory\`

- **症状**: コンパイルが始まってすぐに止まる。
- **原因**: コンパイラが「そんな名前のヘッダファイルは見当たらない」と怒っている。
- **処方箋**:
  1. ファイル名のスペルミス（大文字・小文字の違いを含む）を確認する。
  2. \`#include "Player.h"\` のパスが正しいか確認する（\`src/\` の中にあるなら \`#include "src/Player.h"\` か、CMakeLists.txt に \`include_directories(src)\` を追記する）。

---

### エラー2：\`LNK2019 / undefined reference to 'Player::takeDamage(int)'\`

- **症状**: コンパイル（.cppから.objへの変換）は通ったのに、最後の最後（リンク段階）で落ちる。
- **原因**: ヘッダで宣言された関数の**「実装（.cpp）がビルド対象に含まれていない」**。
- **処方箋**:
  - \`CMakeLists.txt\` の \`add_executable()\` のリストに、\`src/Player.cpp\` を書き忘れていませんか？
  - 実装ファイル（.cpp）を書き足すだけで一発解決します。

\`\`\`
【エラーの発生場所を見分ける極意】
・「No such file / syntax error」 -> コンパイルエラー（コードの書き間違い）
・「undefined reference / LNK2019」 -> リンクエラー（cppファイルの指定漏れ）
\`\`\`
      `,
      dialogueAfter: [
        {
          id: 'dlg-es-5',
          speaker: 'penguin',
          emotion: 'happy',
          text: 'コンパイルエラーとリンクエラーの違い、ずっと謎だったんですがスッキリしました！「未解決の外部シンボル」って出たら「あ、cppファイルをCMakeに書き忘れたな」ってすぐ分かりますね！',
        },
        {
          id: 'dlg-es-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！エラーメッセージを恐れるな、エラーは「ここを直せば動くぞ」というコンパイラからの親切なアドバイスなんじゃ。自分のPCで動かせるようになったお前は、もう立派なC++プログラマの第一歩を踏み出したぞ！',
        },
      ],
      takeaways: [
        {
          title: 'VS Code + CMake が現代C++の王道',
          description: 'CMakeLists.txtにソースを並べ、CMake ToolsでF5デバッグ。リンクエラー（LNK2019）はcppの指定漏れを疑うのが鉄則です。',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'es-q1',
      question: 'C++開発において「CMake」が果たす役割として、最も適切なものはどれか？',
      options: [
        'C++コードを直接実行するWebブラウザ',
        'OSやコンパイラの違いを吸収し、プロジェクト全体のビルド手順（MakefileやNinja/VSプロジェクト）を自動生成するビルドジェネレータ',
        'C++の文法ミスを自動的に修正してコミットするAIツール',
        'ソースコードを自動的に難読化するセキュリティソフトウェア',
      ],
      correctIndex: 1,
      explanation: 'CMakeはクロスプラットフォームなビルドジェネレータであり、Windows/Mac/Linuxの違いを意識せずに同じ設定から各環境用のビルドファイルを生成します。',
    },
    {
      id: 'es-q2',
      question: '`CMakeLists.txt` において、プロジェクトで C++17 の言語機能を有効にするための正しい記述はどれか？',
      options: [
        'use_cpp_version(17)',
        'set(CMAKE_CXX_STANDARD 17) と set(CMAKE_CXX_STANDARD_REQUIRED ON)',
        '#define CPP_STANDARD 17',
        'import cplusplus_17',
      ],
      correctIndex: 1,
      explanation: 'CMakeでは `set(CMAKE_CXX_STANDARD 17)` と `set(CMAKE_CXX_STANDARD_REQUIRED ON)` を記述することで、コンパイラ固有のフラグ（-std=c++17など）を自動適用します。',
    },
    {
      id: 'es-q3',
      question: 'デバッガで設定する「ブレークポイント」の役割として正しいものはどれか？',
      options: [
        'プログラムの実行速度を10倍高速にする',
        'その行に処理が到達した瞬間にプログラムを一時停止させ、その時点でのメモリ状態や変数の値を検査できるようにする',
        'その行のコードを永久に削除する',
        'コード内のすべてのコメントを消去する',
      ],
      correctIndex: 1,
      explanation: 'ブレークポイントは指定した行でプログラムの実行を一時停止させ、変数ウォッチやコールスタック確認などの動的解析を行うための基本機能です。',
    },
    {
      id: 'es-q4',
      question: 'ビルド時に「undefined reference to `Player::update()` / LNK2019: 未解決の外部シンボル」というエラーが出た場合、最も疑うべき原因はどれか？',
      options: [
        'パソコンの電源容量が不足している',
        'ヘッダで宣言されている `Player::update()` の実装（.cppファイル）が CMakeLists.txt のビルド対象に含まれていない',
        'VS Code のフォントサイズが小さすぎる',
        'インターネット接続が切断されている',
      ],
      correctIndex: 1,
      explanation: 'undefined reference / LNK2019 はリンカエラーの代表格であり、宣言に対する実装（.cpp）がビルド対象に追加されていない（リンクされていない）ことが原因です。',
    },
  ],
};
