import { Chapter } from '../../types/curriculum';

export const chapterL19: Chapter = {
  id: 28,
  slug: 'chapter-classic-19-network-sockets',
  courseTrack: 'classic',
  courseChapterCode: 'C19',
  title: 'レガシー第19章：リアルタイム通信とパケットシリアライズ',
  subtitle: 'Berkeley Sockets (UDP/TCP) による自機同期・補間・エンディアン変換',
  badge: 'レガシーC++ L19：ネットワーク',
  gameVersion: 'v2_classes',
  description: '「2台のPCで2人協力プレイインベーダーを作りたい！」「通信対戦で敵の位置がカクカク飛んだり、弾がすり抜けてしまう」——スタンドアロンゲームからネットワークマルチプレイヤーゲームへの進化は、プログラマに全く新しい次元の課題を突きつけます。C++には長年標準ネットワークライブラリが存在せず、OSネイティブの【Berkeley Sockets API】を直接叩いてパケットを送受信するのが現場の必須技術でした。本章では、リアルタイムアクションに不可欠なUDP通信、異なるCPUアーキテクチャ間でデータが壊れるのを防ぐエンディアン変換、構造体のアライメントパッキング、そしてパケット遅延を脳内で打ち消す【推測航法（Dead Reckoning）と線形補間（Lerp）】を網羅します。',
  prevChapterSlug: 'chapter-classic-18-memory-leak-tracker',
  nextChapterSlug: 'chapter-classic-20-legacy-engine-culmination',
  sections: [
    {
      id: 'sec-l19-udp-vs-tcp',
      title: 'L19.1 なぜアクションゲームはTCPを捨ててUDPを採用するのか？',
      leadText: 'Webやファイル転送の常識が通用しないゲーム通信の世界。TCPの致命的弱点「ヘッドオブラインブロッキング」を暴きます。',
      dialogueBefore: [
        {
          id: 'dl19-1',
          speaker: 'penguin',
          emotion: 'question',
          text: 'シロクマ先生！2人プレイの通信を作ろうと思って調べていたら、TCPとUDPという2つのプロトコルがあることを知りました。TCPは「パケットが絶対に届くことを保証してくれる」と書いてあったので、TCPを使うのが一番安全ですよね？'
        },
        {
          id: 'dl19-2',
          speaker: 'shirokuma',
          emotion: 'shocked',
          text: 'バッカモーーーン！リアルタイムアクションゲームやFPSでTCPを使うのは、時速200kmで走るレーシングカーに錨（いかり）をつけるようなものじゃ！'
        },
        {
          id: 'dl19-3',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ええっ！？絶対に届くのにダメなんですか！？'
        },
        {
          id: 'dl19-4',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'TCPは「途中のパケットが1つでも欠落（パケロス）したら、再送が成功するまで後続の全パケットの処理をストップさせる（Head-of-Line Blocking）」という致命的な挙動をするのじゃ！1秒前の古い自機座標などゲームではゴミ同然！最新の座標さえ届けば古いパケットなど捨てて構わんのじゃ！'
        }
      ],
      paradigmComparison: {
        title: 'TCP（信頼性重視） vs UDP（即時性・低遅延重視）',
        cApproach: {
          title: '❌ TCP通信（パケロス時にゲームが数秒フリーズする）',
          code: `// TCPは送達確認（ACK）と順序保証をOSカーネルが行う
// パケット#42がネットの混雑で消滅すると...
// パケット#43, #44, #45が届いてもOSがゲームに渡さずブロック！
// #42が再送されて届くまで、ゲーム内の全キャラクターが完全に停止する！`,
          drawbacks: [
            '1パケットの欠落で数十〜数百ミリ秒のラグスパイクが発生し、画面がワープする',
            '接続維持のためのハンドシェイクやヘッダーサイズ（最低20バイト）のオーバーヘッドが大きい',
            '格闘ゲームや対戦インベーダーでは入力遅延が即座に勝敗を破壊する'
          ]
        },
        cppApproach: {
          title: '⭕ UDP通信 ＋ アプリケーション層での取捨選択',
          code: `// UDPはパケットを投げっぱなし（Fire-and-Forget）
// パケット#42が消えても、直後に届いた最新のパケット#43を即時処理！
// 古い#42は再送すら待たずに無視する！
// ゲームは常に最新の状態で16.6msごとに滑らかに描画され続ける！`,
          benefits: [
            'パケロスが起きてもゲームが一切ブロックされず、常に最新フレームのデータを描画可能',
            'ヘッダーがたった8バイトと超軽量で、毎秒60回のパケット送信でも帯域を圧迫しない',
            'チャットログや決済など「絶対に落とせない情報」だけ自前でACK確認を挟むハイブリッド設計が可能'
          ]
        },
        paradigmShiftNotes: '「すべてのパケットを確実に届ける」Web型思考（TCP）から、「遅れて届いた古いデータは捨て、最新のデータで未来を予測・補間する」ゲーム通信型思考（UDP＋推測航法）へのパラダイムシフトが、低遅延マルチプレイの真髄です。'
      },
      takeaways: [
        {
          title: '即時性 vs 信頼性のトレードオフ',
          description: 'リアルタイムアクションゲームでは「古いデータが確実に届く」ことよりも「最新データが今すぐ届く」即時性が最優先される。'
        },
        {
          title: 'ヘッドオブラインブロッキングの回避',
          description: 'TCPの再送待ちによる全停止を避けるため、ゲーム同期にはUDPをベースに採用するのが商用エンジンの標準。'
        }
      ]
    },
    {
      id: 'sec-l19-endian-and-packing',
      title: 'L19.2 エンディアン変換とバイナリパケットパッキング',
      leadText: 'Intel CPUとARM CPUで通信すると数値が反転する！？ バイトオーダーの罠と構造体アライメントの隙間。',
      dialogueBefore: [
        {
          id: 'dl19-5',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'PCのサーバーから、自機のHP（値: 1000）を構造体ごと send() で送ったんですが、スマホ側のクライアントで受け取ったら HP が -286331153 みたいな奇怪な巨大数値になって即死しました！なんでですか！？'
        },
        {
          id: 'dl19-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞ低レイヤネットワークの登竜門、【エンディアン（バイトオーダー）問題】じゃ！PC（x86）は下位バイトから並ぶリトルエンディアン、ネットワーク標準（および一部のCPU）は上位バイトから並ぶビッグエンディアンなのじゃ！'
        }
      ],
      explanationText: `
### エンディアン（バイト順）の恐怖

例えば 32ビット整数「0x12345678」（10進数で 305419896）をメモリに置くとき：

- **リトルエンディアン（PC/x86/現代のスマホ）**: [78] [56] [34] [12] （下位バイトから順に格納）
- **ビッグエンディアン（ネットワークバイトオーダー/旧PowerPC等）**: [12] [34] [56] [78] （上位バイトから順に格納）

ネットワークに流すデータは必ず【ネットワークバイトオーダー（ビッグエンディアン）】に変換する規格になっています。
これを変換するのが以下の標準関数です：

- htonl() : Host to Network Long (32bit)
- ntohl() : Network to Host Long (32bit)
- htons() : Host to Network Short (16bit)
- ntohs() : Network to Host Short (16bit)

さらに、構造体をそのままバイナリ送信する場合、コンパイラが勝手に挟む【パディング（隙間）】を「#pragma pack(push, 1)」で詰める必要があります。
      `,
      codeFiles: [
        {
          filename: 'PacketDefinition.hpp',
          language: 'cpp',
          description: '1バイトアライメントパッキングされたバイナリ通信パケット定義',
          isMain: true,
          code: `#ifndef PACKET_DEFINITION_HPP
#define PACKET_DEFINITION_HPP

#include <iostream>
#include <cstring>
#include <cstdint>

#if defined(_WIN32)
#include <winsock2.h>
#else
#include <arpa/inet.h>
#endif

// 構造体のパディング（アライメントの隙間）を強制的に1バイト単位に詰める
#pragma pack(push, 1)

// 自機・敵の座標同期パケット
struct PlayerSyncPacket {
    uint8_t packetType;  // 1: 位置同期
    uint32_t sequenceId; // パケット通し番号
    int16_t posX;        // X座標
    int16_t posY;        // Y座標
    uint8_t inputBits;   // キー入力フラグ（L16のビットフラグ！）
};

#pragma pack(pop)

// パケットのシリアライズ（送信前のバイト順変換）
inline void serializePlayerPacket(const PlayerSyncPacket& src, char* buffer) {
    PlayerSyncPacket netPacket;
    netPacket.packetType = src.packetType;
    netPacket.sequenceId = htonl(src.sequenceId);
    netPacket.posX = (int16_t)htons((uint16_t)src.posX);
    netPacket.posY = (int16_t)htons((uint16_t)src.posY);
    netPacket.inputBits = src.inputBits;
    
    std::memcpy(buffer, &netPacket, sizeof(PlayerSyncPacket));
}

// パケットのデシリアライズ（受信後のホストバイト順変換）
inline void deserializePlayerPacket(const char* buffer, PlayerSyncPacket& dst) {
    PlayerSyncPacket netPacket;
    std::memcpy(&netPacket, buffer, sizeof(PlayerSyncPacket));
    
    dst.packetType = netPacket.packetType;
    dst.sequenceId = ntohl(netPacket.sequenceId);
    dst.posX = (int16_t)ntohs((uint16_t)netPacket.posX);
    dst.posY = (int16_t)ntohs((uint16_t)netPacket.posY);
    dst.inputBits = netPacket.inputBits;
}

#endif`
        }
      ],
      takeaways: [
        {
          title: 'htonl / ntohl の徹底',
          description: 'ネットワークを流れる整数データは必ずネットワークバイト順（ビッグエンディアン）に変換して送受する。'
        },
        {
          title: '#pragma pack(push, 1) による構造体パッキング',
          description: 'コンパイラやOSによって異なるパディングバイトの混入を防ぐため、通信用パケットはアライメントを1バイトに固定する。'
        }
      ]
    },
    {
      id: 'sec-l19-dead-reckoning',
      title: 'L19.3 パケロスと遅延を脳内で消し去る「推測航法（Dead Reckoning）」',
      leadText: 'ネットワーク遅延が50ミリ秒あっても、敵が滑らかに動く奇跡のアルゴリズム。線形補間（Lerp）の実装。',
      dialogueBefore: [
        {
          id: 'dl19-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'パケットが毎秒20回しか届かないので、相手のプレイヤーが1秒間に20回カクカクッと瞬間移動して見えてしまいます…！これじゃ狙い撃ちできません！'
        },
        {
          id: 'dl19-8',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'パケットが届いた瞬間にその座標へワープさせてはならん！過去の座標から現在の目標座標へ向かって、時間をかけて滑らかに中間座標を計算する【線形補間（Lerp：Linear Interpolation）】を使うのじゃ！'
        },
        {
          id: 'dl19-9',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'さらに、パケットが途切れた間も「相手は前の速度ベクトルを維持して進んでいるはずだ」と未来の位置を先読み計算する【推測航法（Dead Reckoning）】を組み合わせれば、遅延をプレイヤーに全く気付かせない魔法が完成するのじゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'DeadReckoning.cpp',
          language: 'cpp',
          description: '線形補間（Lerp）と推測航法による滑らかな座標同期アルゴリズム',
          isMain: true,
          code: `#include <iostream>

struct Vector2D {
    float x;
    float y;
};

// 線形補間（Lerp: AからBへ t (0.0〜1.0) の割合で補間）
inline float lerp(float a, float b, float t) {
    return a + (b - a) * t;
}

class NetworkEntity {
public:
    Vector2D currentPos;   // 現在画面に表示している補間座標
    Vector2D targetPos;    // 最後にネットワークから受信した真の目標座標
    Vector2D velocity;     // 推測航法用の速度ベクトル
    
    NetworkEntity() {
        currentPos.x = 0; currentPos.y = 0;
        targetPos.x = 0; targetPos.y = 0;
        velocity.x = 0; velocity.y = 0;
    }

    // パケット受信時に呼ばれる
    void onReceivePacket(float newX, float newY, float vx, float vy) {
        targetPos.x = newX;
        targetPos.y = newY;
        velocity.x = vx;
        velocity.y = vy;
    }

    // 毎フレーム（60FPS / 16.6ms）呼ばれる描画更新
    void update(float deltaTime) {
        // 目標地点へ少しずつ滑らかに寄せていく（補間係数 0.15）
        currentPos.x = lerp(currentPos.x, targetPos.x, 0.15f);
        currentPos.y = lerp(currentPos.y, targetPos.y, 0.15f);

        // さらに推測航法：次のパケットが来るまで速度分だけ目標座標を進める
        targetPos.x += velocity.x * deltaTime;
        targetPos.y += velocity.y * deltaTime;
    }
};

int main() {
    NetworkEntity remotePlayer;
    
    // 相手が座標(100, 50)へ速度(10, 0)で移動中というパケットを受信
    remotePlayer.onReceivePacket(100.0f, 50.0f, 10.0f, 0.0f);

    std::cout << "--- 60FPS 補間シミュレーション開始 ---" << std::endl;
    for (int frame = 1; frame <= 5; ++frame) {
        remotePlayer.update(0.0166f); // 16.6ms
        std::cout << "Frame " << frame << ": Current Screen Pos = (" 
                  << remotePlayer.currentPos.x << ", " 
                  << remotePlayer.currentPos.y << ")" << std::endl;
    }

    return 0;
}`
        }
      ],
      takeaways: [
        {
          title: '線形補間（Lerp）による瞬間移動の解消',
          description: '受信した座標に即座にオブジェクトをジャンプさせず、現在座標から徐々に近づけることで滑らかな描画を実現する。'
        },
        {
          title: '推測航法（Dead Reckoning）',
          description: 'パケットの到着頻度が低くても、速度ベクトルを掛けて未来位置を予測シミュレーションすることで遅延を感じさせない。'
        }
      ]
    },
    {
      id: 'sec-l19-socket-game-loop',
      title: 'L19.4 ノンブロッキングソケットと同期ゲームループの合体',
      leadText: 'パケットが来ていなくても待たずに即リターン！ select() / ioctlsocket によるノンブロッキングI/O。',
      dialogueBefore: [
        {
          id: 'dl19-10',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'recvfrom() を呼んだら、相手がパケットを送ってくるまで処理が止まってしまい、ゲーム全体がフリーズしてしまいました…！'
        },
        {
          id: 'dl19-11',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'デフォルトのソケットは「データが来るまで待機するブロッキングモード」じゃ！ゲームループで使うソケットは、必ず【ノンブロッキングモード（Non-blocking I/O）】に設定して「パケットが来ていなければ即座にエラーEWOULDBLOCKを返して処理を抜ける」ように仕込むのじゃ！'
        }
      ],
      takeaways: [
        {
          title: 'ノンブロッキングI/Oの必須性',
          description: 'ゲームループは16.6ms周期で回り続けなければならないため、通信受信待ちでブロックされるソケットは絶対に使用してはならない。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-l19-1',
      question: 'リアルタイムアクションゲームやオンライン対戦において、TCPよりもUDPが圧倒的に多く採用される最大の理由は何ですか？',
      options: [
        'UDPのほうが暗号化が強固だから',
        'TCPではパケットが1つ欠落すると後続パケットの処理が全てブロックされる（Head-of-Line Blocking）ため、リアルタイム性が失われるから',
        'UDPを使うとインターネット料金が半額になるから',
        'TCPはC++で使えないから'
      ],
      correctIndex: 1,
      explanation: 'TCPの信頼性保証機構はパケット損失時に再送完了まで後続を止めてしまうため、リアルタイムゲームでは最新パケットを即時処理できるUDPが必須となります。'
    },
    {
      id: 'quiz-l19-2',
      question: '異なるCPUアーキテクチャ間で整数データを送信する際、バイトオーダー（エンディアン）の違いによる数値破損を防ぐために使用する標準関数はどれですか？',
      options: [
        'malloc() / free()',
        'htonl() / ntohl()',
        'printf() / scanf()',
        'std::sort()'
      ],
      correctIndex: 1,
      explanation: 'htonl（ホスト→ネットワーク）および ntohl（ネットワーク→ホスト）を使用することで、リトルエンディアンとビッグエンディアンの差異を自動吸収して正しい数値を送受できます。'
    },
    {
      id: 'quiz-l19-3',
      question: 'パケットの到着頻度が毎秒20回程度であるにもかかわらず、画面上で相手プレイヤーを60FPSで滑らかに移動しているように見せる技術の組み合わせは何ですか？',
      options: [
        'メモリリーク検知器とクラッシュダンプ',
        '線形補間（Lerp）と推測航法（Dead Reckoning）',
        '仮想関数テーブルと菱形多重継承',
        'ビットフラグとstd::stringstream'
      ],
      correctIndex: 1,
      explanation: '線形補間（Lerp）で過去から目標位置へ滑らかに繋ぎ、推測航法（Dead Reckoning）でパケット間隔中の未来移動を予測することで、遅延のない滑らかな同期を実現します。'
    },
    {
      id: 'quiz-l19-4',
      question: 'ゲームループ内で通信パケットを受信するソケットを扱う際、必須となる設定は何ですか？',
      options: [
        'データが届くまでスレッドを永久停止させるブロッキングモード',
        'パケットが届いていない場合は待機せず即座に制御を戻すノンブロッキングモード（Non-blocking I/O）',
        'ソケットのバッファサイズを0バイトにする設定',
        '毎フレームソケットを close() して再作成する設定'
      ],
      correctIndex: 1,
      explanation: 'ノンブロッキングモードに設定しないと、相手からパケットが届かないフレームで recv が止まり、ゲームループの60FPS描画がフリーズしてしまいます。'
    }
  ]
};
