import { Chapter } from '../../types/curriculum';

export const chapterModernFilesystem: Chapter = {
  id: 36,
  slug: 'chapter-modern-9-filesystem',
  courseTrack: 'modern',
  courseChapterCode: 'M9',
  title: 'モダン第9章：【C++17】クロスプラットフォームファイル操作：std::filesystem',
  subtitle: 'Windowsの「\\」とUnixの「/」問題の終焉！OSネイティブAPI依存からの完全脱却',
  badge: 'モダンC++ M9【C++17】：std::filesystem',
  gameVersion: 'v5_smart_pointers',
  description: 'ゲーム開発において、セーブデータの保存やアセット（テクスチャ・BGM・ステージ定義）の探索は必須の処理です。しかし、C++03/11の標準ライブラリには「ディレクトリ内のファイル一覧を取得する」機能すら存在せず、Windowsなら Win32 API（FindFirstFile / FindNextFile）、Mac/Linuxなら POSIX（opendir / readdir）と、OSごとの生APIを #ifdef で泥臭く分岐して書くしかありませんでした。パス区切り文字の違い（Windowsの「\\」とUnixの「/」）によるバグも絶えませんでした。C++17で標準化された【std::filesystem】は、この長年の悪夢に完全な終止符を打ちました。本章では、スマートなパス結合演算子（/）、ディレクトリ走査イテレータによるアセット自動検出、そしてゲーム業界の例外禁止環境に必須の非例外版エラーハンドリング（std::error_code）を用いた安全なセーブデータ保護手法を体得します。',
  prevChapterSlug: 'chapter-modern-8-if-constexpr',
  nextChapterSlug: 'chapter-7-modern-cpp-ecs',
  sections: [
    {
      id: 'sec-m9-os-path-hell',
      title: 'M9.1 OS依存ファイル操作の泥沼：Win32 API vs POSIX',
      leadText: 'OSごとにバラバラだったファイル操作APIの苦痛と、std::filesystem::path による完全な統一を比較します。',
      dialogueBefore: [
        {
          id: 'dm9-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！Windowsで動いていたゲームをMac（またはSteam Deck/Linux）に移植しようとしたら、パスの「\\\\」と「/」の違いで画像が1枚も読み込めなくなりました！しかもフォルダ一覧取得コードがコンパイルエラーだらけです！'
        },
        {
          id: 'dm9-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそが全ゲーム開発者が通る洗礼じゃな！C++14以前は、ファイルやフォルダを扱う標準関数が一切なく、WindowsとUnix系でコードを完全に2重化する必要があったのじゃ。'
        },
        {
          id: 'dm9-3',
          speaker: 'penguin',
          emotion: 'question',
          text: '1つのコードでWindowsでもSwitchでもMacでも動く、標準のパス操作方法はないんですか？'
        },
        {
          id: 'dm9-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'それこそが C++17 で導入された【std::filesystem】じゃ！`std::filesystem::path` を使えば、パス区切り文字の正規化から親ディレクトリ取得・拡張子変更まで、OSネイティブAPIを1行も書かずに100%クロスプラットフォームで完結するぞ！'
        }
      ],
      paradigmComparison: {
        title: 'レガシーOS生API分岐 vs C++17 std::filesystem',
        cApproach: {
          title: '❌ レガシー：#ifdef によるOSネイティブAPI分岐と文字列パス結合',
          code: `// OSごとにマクロ分岐する地獄
#if defined(_WIN32)
  #include <windows.h>
  std::string sep = "\\\\";
#else
  #include <dirent.h>
  std::string sep = "/";
#endif

// パス結合を手動で文字列連結（区切り文字の重複バグが頻発）
std::string path = "assets" + sep + "textures" + sep + "alien.png";

// ファイル存在確認もOSごとに異なるAPIを呼ぶ必要がある
#if defined(_WIN32)
  DWORD attr = GetFileAttributesA(path.c_str());
  bool exists = (attr != INVALID_FILE_ATTRIBUTES);
#else
  struct stat st;
  bool exists = (stat(path.c_str(), &st) == 0);
#endif`,
          drawbacks: [
            'OSごとに全く異なるヘッダと生APIを勉強して #ifdef で切り分ける必要がある',
            '「//」や「\\\\/」といったパス区切り文字の重複・不整合によるクラッシュが多発',
            '拡張子切り出しやファイル名抽出を自前で文字列探索してバグを混入させやすい'
          ]
        },
        cppApproach: {
          title: '✨ C++17 std::filesystem （完全クロスプラットフォーム）',
          code: `#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

// 1. スラッシュ演算子 (/) でスマートにパス結合
fs::path p = fs::path("assets") / "textures" / "alien.png";

// 2. OSを問わず1行で存在確認
if (fs::exists(p)) {
    std::cout << "ファイル発見: " << p << std::endl;
    std::cout << "拡張子: " << p.extension() << std::endl; // ".png"
    std::cout << "親フォルダ: " << p.parent_path() << std::endl; // "assets/textures"
    std::cout << "ファイルサイズ: " << fs::file_size(p) << " bytes" << std::endl;
}`,
          benefits: [
            'WindowsでもMac/Linuxでも、同じ / 演算子で自動的にOS最適な区切り文字に正規化',
            'ファイル存在確認、拡張子取得、サイズ取得、親パス探索がすべて標準1行で完結',
            'Unicode（日本語・多言語パス）にもネイティブ対応'
          ]
        },
        paradigmShiftNotes: 'std::filesystem::path はOS依存の区切り文字の違い（Windowsの \\ とPOSIXの /）を完全に隠蔽し、型安全なパス結合・正規化を提供します。'
      }
    },
    {
      id: 'sec-m9-directory-traversal',
      title: 'M9.2 ディレクトリ走査とアセット自動検出：directory_iterator',
      leadText: 'フォルダ内の全ファイルを範囲for文でスマートに走査し、再帰探索を行う手法を学びます。',
      dialogueBefore: [
        {
          id: 'dm9-5',
          speaker: 'penguin',
          emotion: 'question',
          text: 'ゲーム起動時に「stage01/sounds」フォルダの中にある音源ファイルを全部自動で読み込みたいんですが、どう書けばいいですか？'
        },
        {
          id: 'dm9-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '【std::filesystem::directory_iterator】の出番じゃ！なんと範囲ベース for ループで `for (const auto& entry : fs::directory_iterator(dir))` と回すだけで、フォルダ内の全ファイルが手に入るのじゃ！'
        },
        {
          id: 'dm9-7',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'えっ！サブフォルダの中身までまとめて掘り下げたいときはどうするんですか？'
        },
        {
          id: 'dm9-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その時は【fs::recursive_directory_iterator】に差し替えるだけじゃ！深さ何十階層のフォルダツリーでも、1行のfor文ですべて再帰探索してくれるぞ！'
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          title: 'directory_iterator：直下ファイルの高速走査',
          description: '指定フォルダの第1階層のみを走査します。余計なサブフォルダ下降を避けて軽量にリストアップしたい場合に最適です。',
          impact: 'セーブスロット一覧（slot1.dat, slot2.dat）の検出'
        },
        {
          stepNumber: 2,
          title: 'recursive_directory_iterator：階層全体の網羅走査',
          description: 'サブディレクトリが見つかるたびに自動で中へ降りていき、全階層のファイルを1つのフラットなループで取り出せます。',
          impact: 'アセットディレクトリ全体の事前ロード・キャッシュ構築'
        },
        {
          stepNumber: 3,
          title: 'entry.is_regular_file() による安全なフィルタリング',
          description: 'フォルダ、シンボリックリンク、隠しファイルを除外し、純粋なデータファイルだけを拡張子付きで判別します。',
          impact: '不正ファイル読み込みによるクラッシュを100%防止'
        }
      ]
    },
    {
      id: 'sec-m9-save-data-safety',
      title: 'M9.3 セーブデータ安全書き出しとエラーハンドリング（例外 vs std::error_code）',
      leadText: 'ゲーム業界の「例外禁止」規約に準拠した非例外版ファイルAPIと、アトミック保存によるクラッシュ破損防止。',
      dialogueBefore: [
        {
          id: 'dm9-9',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生！「ディスク容量がいっぱい」や「アクセス権限がない」ときに std::filesystem::copy_file を呼んだら、filesystem_error 例外が飛んできてゲームがクラッシュしてしまいました！うちのチーム、例外（try-catch）使用禁止規約なんですが……！'
        },
        {
          id: 'dm9-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そこが超重要じゃ！std::filesystem のほぼすべての関数には【第2引数に std::error_code を渡すオーバーロード】が用意されておる！'
        },
        {
          id: 'dm9-11',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'std::error_code を渡せば例外が飛ばなくなるんですか！？'
        },
        {
          id: 'dm9-12',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！エラーが発生しても例外を投げず、エラー内容を引数の ec に記録して安全に戻ってきてくれる。例外禁止のゲームエンジンでも100%安心して利用できるのじゃ！'
        }
      ],
      takeaways: [
        {
          title: '非例外版 API：std::error_code の活用',
          description: '`fs::create_directories(dir, ec);` のように std::error_code を渡すことで、C++例外機構を一切使わずにOSエラーを安全に判定できます。'
        },
        {
          title: '2段階アトミック保存パターン',
          description: 'セーブデータを直接上書きせず、まず `save.tmp` に全データを書き込み、成功後に `fs::rename("save.tmp", "save.dat", ec)` で瞬時にアトミック昇格させることで、停電やクラッシュ時のセーブデータ破損を完全防止します。'
        }
      ]
    },
    {
      id: 'sec-m9-game-asset-scanner',
      title: 'M9.4 実戦：自作ゲームエンジンのアセットローダー＆ホットリロード監視',
      leadText: 'ファイルの最終更新時刻（last_write_time）を取得し、ゲーム実行中のアセット再読み込みを可能にします。',
      dialogueBefore: [
        {
          id: 'dm9-13',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'シロクマ先生！デザイナーさんがテクスチャ画像やステージテキストを編集したとき、ゲームを再起動しなくても自動で更新を検知して画面に反映させたいです！'
        },
        {
          id: 'dm9-14',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'それが【アセット・ホットリロード】じゃ！`fs::last_write_time(path)` でファイルの最終更新タイムスタンプを定期監視すれば、ファイルが更新された瞬間にリロード処理をキックできるぞ！開発効率が何十倍にも跳ね上がる必殺技じゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'AssetWatcher.cpp',
          language: 'cpp',
          description: 'std::filesystem によるタイムスタンプ監視とアセット・ホットリローダー',
          isMain: true,
          code: `#include <iostream>
#include <filesystem>
#include <chrono>

namespace fs = std::filesystem;

class AssetWatcher {
private:
    fs::path targetPath_;
    fs::file_time_type lastTime_;

public:
    explicit AssetWatcher(fs::path path) : targetPath_(std::move(path)) {
        std::error_code ec;
        if (fs::exists(targetPath_, ec)) {
            lastTime_ = fs::last_write_time(targetPath_, ec);
        }
    }

    // 毎フレームまたは定期タイマーで呼び出して変更をチェック
    bool checkReloadNeeded() {
        std::error_code ec;
        if (!fs::exists(targetPath_, ec)) return false;

        auto currentTime = fs::last_write_time(targetPath_, ec);
        if (!ec && currentTime != lastTime_) {
            lastTime_ = currentTime; // タイムスタンプ更新
            return true;             // ホットリロード実行トリガー！
        }
        return false;
    }

    const fs::path& getPath() const { return targetPath_; }
};

int main() {
    std::cout << "--- M9 アセットホットリロードウォッチャー ---" << std::endl;
    AssetWatcher watcher("config/stage1.txt");

    std::cout << "監視対象: " << watcher.getPath() << "\\n";
    std::cout << "ホットリロード監視機構の初期化成功\\n";

    return 0;
}`,
          highlightLines: [16, 25]
        }
      ]
    }
  ]
};
