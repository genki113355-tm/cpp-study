import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_2: Chapter = {
  id: 202,
  slug: 'reading-step-2',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R2',
  title: 'コード読解演習 Step 2【中級】：ヘッダAPI仕様とクラス依存の解読',
  subtitle: 'ヘッダファイル群（.h）からクラス設計図を脳内復元し、責任境界と呼び出し構造を見抜く',
  badge: '読解演習 Step 2',
  description: 'ファイル数が数十個に増えたとき、.cpp の実装ロジックにいきなり飛び込むのは遭難の元！ヘッダファイル（.h）の宣言だけを拾い読みしてクラス間の依存関係（所有・参照）と責務を瞬時に把握する中級読解テクニックを習得します。',
  gameVersion: 'none',
  umlDiagram: {
    diagramType: 'class',
    title: '演習教材：警備ロボットシステムのクラス設計図',
    subtitle: 'ヘッダファイル群から抽出されたクラス構成とコンポジション/関連関係',
    description: 'SecurityRobot が Battery をコンポジション（強固に所有）し、UltrasonicSensor を利用して前方の障害物を自律検知・回避する構造です。',
    classes: [
      {
        name: 'Battery',
        attributes: [
          { name: 'm_capacityMah', type: 'int', visibility: '-', codeLineRef: { filename: 'Battery.h', line: 7 } },
          { name: 'm_currentMah', type: 'int', visibility: '-', codeLineRef: { filename: 'Battery.h', line: 8 } },
        ],
        operations: [
          { name: 'consume(amount: int)', type: 'bool', visibility: '+', codeLineRef: { filename: 'Battery.h', line: 14 } },
          { name: 'getPercentage() const', type: 'int', visibility: '+', codeLineRef: { filename: 'Battery.h', line: 20 } },
        ],
      },
      {
        name: 'UltrasonicSensor',
        attributes: [
          { name: 'm_maxDistanceCm', type: 'int', visibility: '-', codeLineRef: { filename: 'UltrasonicSensor.h', line: 7 } },
        ],
        operations: [
          { name: 'pingDistanceCm()', type: 'int', visibility: '+', codeLineRef: { filename: 'UltrasonicSensor.h', line: 13 } },
        ],
      },
      {
        name: 'SecurityRobot',
        attributes: [
          { name: 'm_battery', type: 'Battery', visibility: '-', codeLineRef: { filename: 'SecurityRobot.h', line: 10 } },
          { name: 'm_sensor', type: 'UltrasonicSensor*', visibility: '-', codeLineRef: { filename: 'SecurityRobot.h', line: 11 } },
          { name: 'm_posX', type: 'int', visibility: '-', codeLineRef: { filename: 'SecurityRobot.h', line: 12 } },
        ],
        operations: [
          { name: 'patrolStep()', type: 'void', visibility: '+', codeLineRef: { filename: 'SecurityRobot.cpp', line: 12 } },
          { name: 'reportStatus() const', type: 'void', visibility: '+', codeLineRef: { filename: 'SecurityRobot.cpp', line: 26 } },
        ],
      },
    ],
    relations: [
      {
        from: 'SecurityRobot',
        to: 'Battery',
        type: 'composition',
        label: '内蔵バッテリー所有',
        cppMapping: 'Battery m_battery; // 値保持（ロボット破棄時に寿命連動）',
      },
      {
        from: 'SecurityRobot',
        to: 'UltrasonicSensor',
        type: 'association',
        label: '外付けセンサ参照',
        cppMapping: 'UltrasonicSensor* m_sensor; // 外部接続ポインタ',
      },
    ],
    codeMappingNotes: [
      '【値メンバ＝コンポジション】: `Battery m_battery;` のように直接メンバ変数として持っている場合、UMLでは黒ひし形（◆）のコンポジションになります。',
      '【ポインタ/参照＝関連】: `UltrasonicSensor* m_sensor;` のようにアドレスを参照している場合、寿命は別管理（外付け・差し替え可能）の関連（───>）になります。',
    ],
  },
  sections: [
    {
      id: 'step2-header-first-rule',
      title: '2.1 中級読解の黄金律：「.cpp」は後回し！まず「.h」だけを読め',
      leadText: 'ファイル数が多いプロジェクトでは、実装詳細（.cpp）を読んではいけません。ヘッダの public メソッドとメンバ変数からシステムの骨格を掴みます。',
      dialogueBefore: [
        {
          id: 'dlg-r2-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生、今度はファイルが10個に分かれてます！`SecurityRobot.cpp` を開いたら、長々とした計算処理が書かれていて、何をしているクラスなのか全体像が全然見えてきません……！',
        },
        {
          id: 'dlg-r2-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: '渇っ！なぜいきなり `.cpp` を開くのじゃ！\n`.cpp` は「エンジンの配線工事」じゃ。設計を見るにはまず「車のカタログ」である `.h`（ヘッダ）を見ねばならん！\nヘッダの **【① クラス名】→【② public 関数一覧（提供する機能）】→【③ メンバ変数（他クラスとの所有関係）】** をスキャンすれば、5分で脳内にクラス図が完成するのじゃ！',
        },
      ],
      explanationText: `
### ヘッダ（.h）スキャンのチェックリスト

1. **クラス名と責務**:
   - \`class SecurityRobot\`: このクラスは何を担当する存在か？
2. **public 窓口関数（外部への約束）**:
   - どんなメソッドを提供しているか？（例: \`patrolStep()\`, \`reportStatus()\`)
   - 引数と戻り値は何か？
3. **private メンバ変数（他クラスへの依存性）**:
   - 他のクラスを「値」で持っているか？（\`Battery m_battery\` → コンポジション、寿命連動）
   - 他のクラスを「ポインタ/参照」で持っているか？（\`Sensor* m_sensor\` → 外部利用・集約）
      `,
      takeaways: [
        {
          title: '「カタログ（.h）」を見てから「中身（.cpp）」へ進む',
          description: 'ヘッダファイルだけでクラスの責務と依存関係の90%は理解できます。実装詳細（アルゴリズム）は必要になった時にだけ読みに行きます。',
        },
      ],
    },
    {
      id: 'step2-sample-code',
      title: '2.2 演習コード：自律型警備ロボットシステム一式',
      leadText: 'ヘッダファイル群と実装コードを切り替えて、上のUMLクラス図とコード行の対応関係（連動クリック）を体感してください。',
      codeFiles: [
        {
          filename: 'Battery.h',
          language: 'cpp',
          description: 'バッテリークラスのヘッダ（内部残量カプセル化）',
          code: `#pragma once

class Battery {
private:
    int m_capacityMah;
    int m_currentMah;

public:
    Battery(int capacity) 
        : m_capacityMah(capacity), m_currentMah(capacity) {}

    bool consume(int amount) {
        if (m_currentMah < amount) return false;
        m_currentMah -= amount;
        return true;
    }

    int getPercentage() const {
        return (m_currentMah * 100) / m_capacityMah;
    }
};`
        },
        {
          filename: 'UltrasonicSensor.h',
          language: 'cpp',
          description: '超音波障害物センサクラスのヘッダ',
          code: `#pragma once

class UltrasonicSensor {
private:
    int m_maxDistanceCm;

public:
    UltrasonicSensor(int maxDist = 200) : m_maxDistanceCm(maxDist) {}

    int pingDistanceCm() {
        // シミュレーション用ダミー測定値（実際はハードウェアレジスタ読取）
        return 45; 
    }
};`
        },
        {
          filename: 'SecurityRobot.h',
          language: 'cpp',
          description: '警備ロボットクラスの外部仕様ヘッダ（BatteryとSensorへの依存関係）',
          code: `#pragma once
#include "Battery.h"
#include "UltrasonicSensor.h"

class SecurityRobot {
private:
    // 【コンポジション：内蔵】
    Battery m_battery;
    // 【関連：外付けセンサへの参照】
    UltrasonicSensor* m_sensor;
    int m_posX;

public:
    SecurityRobot(int batteryCap, UltrasonicSensor* sensor);
    void patrolStep();
    void reportStatus() const;
};`
        },
        {
          filename: 'SecurityRobot.cpp',
          language: 'cpp',
          description: 'SecurityRobotの内部動作ロジック（巡回と障害物回避）',
          code: `#include <iostream>
#include "SecurityRobot.h"

SecurityRobot::SecurityRobot(int batteryCap, UltrasonicSensor* sensor)
    : m_battery(batteryCap), m_sensor(sensor), m_posX(0) {}

void SecurityRobot::patrolStep() {
    // バッテリー消費チェック
    if (!m_battery.consume(5)) {
        std::cout << "[Robot] バッテリー切れのため停止！\\n";
        return;
    }

    // センサによる前方監視
    if (m_sensor != nullptr) {
        int dist = m_sensor->pingDistanceCm();
        if (dist < 50) {
            std::cout << "[Robot] 前方障害物を検知 (" << dist << "cm)！回避旋回します。\\n";
            return;
        }
    }

    m_posX += 1;
    std::cout << "[Robot] 前進中... 現在地点: " << m_posX << "m\\n";
}

void SecurityRobot::reportStatus() const {
    std::cout << "[Status] 位置: " << m_posX << "m, 残バッテリー: " 
              << m_battery.getPercentage() << "%\\n";
}`
        },
        {
          filename: 'main.cpp',
          language: 'cpp',
          isMain: true,
          description: 'システムの統合起動と巡回ループ',
          code: `#include <iostream>
#include "SecurityRobot.h"

int main() {
    UltrasonicSensor externalSensor(200);
    // ロボットにセンサのポインタを注入
    SecurityRobot robot(1000, &externalSensor);

    std::cout << "=== 自律警備システム 巡回開始 ===\\n";
    for (int i = 0; i < 3; i++) {
        robot.patrolStep();
        robot.reportStatus();
    }
    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '「メンバ変数の型」が関係性の正体',
          description: '`Battery m_battery;`（生の実体）は寿命が一緒のコンポジション、`Sensor* m_sensor;`（ポインタ）は外から渡される関連関係。ヘッダの変数を見るだけで設計図が描けます。',
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'q-r2-1',
      question: 'SecurityRobot クラスにおける Battery と UltrasonicSensor の所有関係の違いとして正しいものはどれでしょう？',
      options: [
        'Battery も UltrasonicSensor もどちらも動的確保（new）されている',
        'Battery はメンバ変数として直接値を持つコンポジション（内蔵）であり、UltrasonicSensor はポインタとして外部から渡される関連関係である',
        'Battery はロボットの親クラス（継承）である',
        'UltrasonicSensor は static メンバである'
      ],
      correctIndex: 1,
      explanation: '正解です！`Battery m_battery;` はロボットオブジェクト内に直接埋め込まれており寿命を共にします。一方 `UltrasonicSensor* m_sensor;` はアドレスを保持するポインタであり、センサの実体は外部（main関数内）に存在します。'
    },
    {
      id: 'q-r2-2',
      question: 'SecurityRobot::patrolStep() において、ロボットが前進（m_posX += 1）せずに停止または旋回する条件はどれでしょう？',
      options: [
        'バッテリー残量が足りない場合、またはセンサ検知距離が 50cm 未満の場合',
        '走行距離が 100m を超えた場合のみ',
        'センサのポインタが nullptr の場合のみ',
        '常に前進する'
      ],
      correctIndex: 0,
      explanation: '正解です！コード内の `if (!m_battery.consume(5))`（バッテリー切れ）と `if (dist < 50)`（障害物検知）の2つの早期リターン条件があります。'
    },
    {
      id: 'q-r2-3',
      question: 'プロジェクト内で「SecurityRobot の機能に新しい命令（例: 緊急停止 emergencyStop()）を追加したい」場合、最初に見るべき・修正すべきファイルはどれでしょう？',
      options: [
        'いきなり Battery.cpp を開く',
        'まず SecurityRobot.h に公開関数のシグネチャを宣言し、その後 SecurityRobot.cpp に処理を実装する',
        'main.cpp の末尾に直接グローバル関数を書く',
        'Common.h の定数を書き換える'
      ],
      correctIndex: 1,
      explanation: '正解です！外部仕様書（ヘッダ .h）にインターフェースを定義してから実装（.cpp）を行うのがC++の正しい開発フローです。'
    },
    {
      id: 'q-r2-4',
      question: '上のUMLクラス図の操作（メソッド）をクリックしたとき、エディタ側で起きる動作として正しいものはどれでしょう？',
      options: [
        'プログラムが自動的にコンパイルされて実行される',
        '該当するファイルタブへ自動で切り替わり、定義されているコード行へスムーズスクロールしてハイライト点滅する',
        'コードが消去される',
        '新しいファイルが作成される'
      ],
      correctIndex: 1,
      explanation: '正解です！当サイトの「UML ⇄ ソースコード双方向連動」機能により、設計書から該当の実装コードへ瞬時にジャンプして確認できます。'
    }
  ]
};
