import { Chapter } from '../../types/curriculum';

export const chapterL15: Chapter = {
  id: 23,
  slug: 'chapter-classic-15-data-driven',
  courseTrack: 'classic',
  courseChapterCode: 'C15',
  title: 'レガシー第15章：データ駆動設計（Data-Driven）とスクリプトローダー',
  subtitle: 'ハードコード脱却！テキスト/CSVステージ定義パーサーと動的エンティティ生成',
  badge: 'レガシーC++ L15：データ駆動設計',
  gameVersion: 'v2_classes',
  description: '「敵の出現座標を10ピクセルずらす」「ボスのHPを100増やす」——こうしたゲームバランスの微調整を行うたびに、C++コードを書き換えてビルドを回していませんか？チーム開発や規模の拡大において、ゲームパラメータのハードコードは開発速度を致命的に低下させます。本章では、ゲームのロジック（プログラム）とルール・数値・構成（データ）を完全に切り離す【データ駆動設計（Data-Driven Design）】を実践。C++の標準文字列ストリーム（std::stringstream）を活用した高速・安全なCSV/テキストステージローダーを構築し、文字列識別子から対応する敵インスタンスを動的に生成する【エンティティファクトリレジストリ】を実装します。再コンパイル不要でステージが無限に増える爽快感を体感してください。',
  prevChapterSlug: 'chapter-classic-14-spatial-partitioning',
  nextChapterSlug: 'chapter-classic-16-bit-flags',
  sections: [
    {
      id: 'sec-l15-hardcoding-hell',
      title: 'L15.1 「敵のHPを1変えるのに10分コンパイル」：ハードコード地獄の終焉',
      leadText: 'なぜプログラムコード内にゲームのパラメータを直接書いてはいけないのか？その本質的な理由を解き明かします。',
      dialogueBefore: [
        {
          id: 'dl15-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'シロクマ先生…ゲームデザイナーさんから「ステージ2の敵の出現数を 5体から6体に増やして、HPを40から35にして」と頼まれるたびに、C++コードを直してリビルドしています…1日中コンパイル待ちで日が暮れてしまいました…'
        },
        {
          id: 'dl15-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それこそが【ハードコード地獄】じゃな！コードの中にステージの敵配置やパラメータを直接書き込んでおるから、ゲームバランス調整のたびにビルドが走るのじゃ。'
        },
        {
          id: 'dl15-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'でも、敵を作る new Enemy(x, y, hp); ってC++の命令ですよね？外部ファイルからどうやってC++のオブジェクトを作れるんですか？'
        },
        {
          id: 'dl15-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'プログラム（エンジン）は「ルールを実行する器」に徹し、ステージの構成や敵のステータスは「外部のテキストファイル（CSVやJSON）」から読み込んで動的に生成するのじゃ！これぞゲーム業界の基本中の基本、【データ駆動設計（Data-Driven Architecture）】じゃ！'
        }
      ],
      paradigmComparison: {
        title: 'ハードコード方式 vs データ駆動アーキテクチャ',
        cApproach: {
          title: '❌ C++ソースコードに敵配置や数値を直接記述（ハードコード）',
          code: `// C++コード内に敵の配置やパラメータが直接埋め込まれている
void initStage1() {
    enemies.push_back(new Invader(100, 50, 30)); // 座標(100, 50), HP30
    enemies.push_back(new Invader(150, 50, 30));
    enemies.push_back(new BossEnemy(300, 200, 500)); // 座標(300, 200), HP500
    // ⚠️ 敵のHPを1変えるだけでも再コンパイル・リンクが必要！
}`,
          drawbacks: [
            '数値の微調整のたびにビルドが走り、プランナーやデザイナーの試行錯誤速度が激減する',
            'プログラマ以外（企画担当者）がステージや難易度を編集できない',
            'ステージを10面、100面と増やすたびに実行バイナリサイズが肥大化する'
          ]
        },
        cppApproach: {
          title: '⭕ データ駆動設計（外部ファイル定義 ＋ 動的ファクトリ生成）',
          code: `// stage1.txt （外部テキストファイル）
// TYPE,   X,   Y,  HP
// ENEMY, 100,  50, 30
// ENEMY, 150,  50, 30
// BOSS,  300, 200, 500

// C++ローダー
void loadStage(const std::string& filepath) {
    StageLoader loader;
    loader.loadFromFile(filepath, entityManager);
    // 💡 ゲーム起動中にファイルを再読み込み（ホットリロード）することも可能！
}`,
          benefits: [
            'コンパイルゼロ秒！テキストファイルを保存して再起動するだけで即座にゲームに反映',
            'プランナーやレベルデザイナーがプログラマの手を煩わせずに自由にステージを作成可能',
            'DLCや追加ステージ、MODの配布が実行ファイルの更新なしで容易に実現できる'
          ]
        },
        paradigmShiftNotes: 'プログラムは「振る舞い（アルゴリズム）」を定義し、データが「実体（パラメータ）」を決定します。'
      }
    },
    {
      id: 'sec-l15-safe-parser',
      title: 'L15.2 文字列ストリームによる堅牢なテキストパーサーの実装',
      leadText: 'std::stringstream と std::getline を駆使して、コメント行や不正データを安全に処理するパーサーを作ります。',
      codeFiles: [
        {
          filename: 'StageLoader.cpp',
          language: 'cpp',
          description: '行番号エラー報告と空白・コメント無視機能を備えたテキストローダー',
          isMain: true,
          code: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct SpawnCommand {
    std::string type;
    int x;
    int y;
    int hp;
};

class StageLoader {
public:
    static bool parseStageData(const std::string& script, std::vector<SpawnCommand>& outCommands) {
        std::istringstream stream(script);
        std::string line;
        int lineNum = 0;

        while (std::getline(stream, line)) {
            lineNum++;
            // 空行や # で始まるコメント行をスキップ
            if (line.empty() || line[0] == '#' || line[0] == ';') {
                continue;
            }

            std::stringstream lineStream(line);
            std::string type;
            int x, y, hp;

            // 書式: TYPE X Y HP
            if (lineStream >> type >> x >> y >> hp) {
                SpawnCommand cmd;
                cmd.type = type;
                cmd.x = x;
                cmd.y = y;
                cmd.hp = hp;
                outCommands.push_back(cmd);
                std::cout << "[Line " << lineNum << "] 正常パース: " 
                          << type << " at (" << x << ", " << y << ") HP=" << hp << std::endl;
            } else {
                std::cerr << "[Line " << lineNum << " 警告] 不正な書式のためスキップ: " << line << std::endl;
            }
        }
        return true;
    }
};

int main() {
    std::cout << "=== ステージスクリプトのパーステスト ===" << std::endl;
    std::string sampleStage = 
        "# Stage 1: 初級インベーダー防衛戦\\n"
        "# TYPE X Y HP\\n"
        "INVADER 100 80 10\\n"
        "INVADER 150 80 10\\n"
        "\\n"
        "# 中ボス出現\\n"
        "COMMANDER 250 120 50\\n"
        "INVALID_LINE_DATA_TEST\\n" // 不正な行
        "BOSS 300 200 200\\n";

    std::vector<SpawnCommand> commands;
    StageLoader::parseStageData(sampleStage, commands);

    std::cout << "\\n読み込み成功コマンド数: " << commands.size() << std::endl;
    return 0;
}`
        }
      ]
    },
    {
      id: 'sec-l15-dynamic-factory',
      title: 'L15.3 動的エンティティファクトリ：文字列からインスタンスを生み出すレジストリ',
      leadText: 'if-elseの連打を追放し、関数ポインタのマップで拡張性に優れたオブジェクト生成器を構築します。',
      codeFiles: [
        {
          filename: 'EntityFactory.cpp',
          language: 'cpp',
          description: '文字列名と生成関数をバインドするファクトリレジストリ',
          isMain: true,
          code: `#include <iostream>
#include <string>
#include <map>

// 基底エンティティ
class Entity {
public:
    virtual ~Entity() {}
    virtual void show() const = 0;
};

class Invader : public Entity {
public:
    void show() const { std::cout << "👾 インベーダー出現！" << std::endl; }
};

class BossEnemy : public Entity {
public:
    void show() const { std::cout << "👹 ボス艦出現！大警報発令！" << std::endl; }
};

// 生成関数ポインタ型
typedef Entity* (*CreateFunc)();

class EntityFactory {
private:
    std::map<std::string, CreateFunc> registry_;

public:
    void registerType(const std::string& typeName, CreateFunc func) {
        registry_[typeName] = func;
    }

    Entity* create(const std::string& typeName) {
        std::map<std::string, CreateFunc>::iterator it = registry_.find(typeName);
        if (it != registry_.end()) {
            return it->second(); // 登録された生成関数を呼び出す
        }
        std::cerr << "未登録のエンティティ型: " << typeName << std::endl;
        return NULL;
    }
};

Entity* createInvader() { return new Invader(); }
Entity* createBoss() { return new BossEnemy(); }

int main() {
    EntityFactory factory;
    factory.registerType("INVADER", createInvader);
    factory.registerType("BOSS", createBoss);

    std::cout << "=== 外部スクリプトの文字列から生成 ===" << std::endl;
    Entity* e1 = factory.create("INVADER");
    Entity* e2 = factory.create("BOSS");

    if (e1) e1->show();
    if (e2) e2->show();

    delete e1;
    delete e2;
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: 'コードとデータの境界線',
          description: 'ロジックはコンパイルされたコードに、出現位置・パラメータ・シナリオは外部データに完全に分離する。'
        },
        {
          title: 'パース耐障害性',
          description: 'データに記述ミスがあってもプロセスを落とさず、警告ログを出して不正行だけをスキップする堅牢性を持たせる。'
        },
        {
          title: 'ファクトリレジストリ',
          description: '文字列型名から生成関数をルックアップするレジストリ構造により、新種敵の追加時にパーサーを一切修正しなくて済む。'
        },
        {
          title: '開発効率の爆発的向上',
          description: 'プランナーやレベルデザイナーが独自にステージを作成・テストできるようになり、チーム全体の生産性が向上する。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l15-1',
      question: 'ゲーム開発において「データ駆動設計（Data-Driven Design）」を採用する最大の利点は何ですか？',
      options: [
        'プログラムの実行速度がC言語より10倍速くなるため',
        'パラメータやステージ構成を変更するたびに再コンパイルする必要がなくなり、開発・調整効率が劇的に向上するため',
        'メモリ使用量が常に0バイトになるため',
        'すべての変数をグローバル変数として扱えるようになるため'
      ],
      correctIndex: 1,
      explanation: 'データ駆動設計では、敵のパラメータやステージ配置などのデータを外部ファイルに逃がすため、コンパイルすることなく即座にゲームバランスの調整や新ステージの追加が可能になります。'
    },
    {
      id: 'quiz-l15-2',
      question: '文字列名（"INVADER" など）から対応するクラスのインスタンスを生成する仕組みとして、最も拡張性が高く推奨される設計はどれですか？',
      options: [
        '大量の if-else や巨大な switch 文を単一の関数内に書き並べる',
        '型名文字列と生成関数ポインタを対応付ける「ファクトリレジストリ（std::map等）」を用意する',
        'C言語の goto 文で各生成ラベルにジャンプする',
        'クラス名を eval() 関数で直接実行する'
      ],
      correctIndex: 1,
      explanation: '型名文字列と生成関数を登録（レジストリ登録）できるファクトリクラスを用意すると、新しい敵種別を追加する際に既存のパーサーコードを一切改変する必要がなくなり、開閉原則（OCP）を遵守できます。'
    },
    {
      id: 'quiz-l15-3',
      question: '外部ステージファイルをパースする際、商用品質のローダーが必ず備えるべき「耐障害性（Fault Tolerance）」とは何ですか？',
      options: [
        '構文エラーが1箇所でもあったら即座に abort() でゲームを落とす',
        'エラーが起きても無視して未初期化のゴミメモリのままエンティティを生成する',
        '不正な行や存在しない識別子があってもクラッシュせず、行番号付きの警告を出力して該当行のみをスキップしパースを完走させる',
        '不正なテキストを自動的にC++ソースコードに書き直して再コンパイルする'
      ],
      correctIndex: 2,
      explanation: '実務環境ではプランナーの打ち間違い（タイポやカンマ抜け）が日常茶飯事です。1箇所のミスでゲームが落ちてしまうと作業が中断するため、行番号とエラー内容をログに出力し、該当箇所をスキップしてテストプレイを継続できる堅牢性が不可欠です。'
    }
  ]
};
