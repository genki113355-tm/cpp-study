import { Chapter } from '../../types/curriculum';

export const chapterL7: Chapter = {
  id: 11,
  slug: 'chapter-7-pointer-alignment-endian',
  courseTrack: 'classic',
  courseChapterCode: 'C7',
  title: 'レガシー第7章：ポインタ演算と手動メモリアライメントの深淵',
  subtitle: 'ハードウェア境界・エンディアン変換・バイトパック構造体によるバイナリ通信とセーブデータ',
  badge: 'レガシーC++ L7：ポインタ・アライメント・バイナリ',
  gameVersion: 'v2_classes',
  description: 'ゲーム開発の現場では、セーブデータの保存やネットワーク対戦のパケット送信で「バイナリデータの読み書き」が必須となります。しかし、C言語流に構造体をそのまま `fwrite(&player, sizeof(player), 1, fp);` でダンプすると、環境によってデータが壊れる「構造体パディング（Padding）」「境界整列（Alignment）」「エンディアン（Endianness）」の罠に直面します。CPUがメモリをフェッチする物理的仕組み、ポインタ演算の正しい型キャスト、そして移植性の高い安全なバイナリシリアライザの設計手法を徹底解剖します。',
  sections: [
    {
      id: 'sec-l7-struct-padding',
      title: 'L7.1 構造体をそのままダンプしてはいけない？！パディングとアライメントの罠',
      leadText: '`sizeof(char + int + short)` が 1 + 4 + 2 = 7バイトにならない怪現象！CPUのデータバス構造と境界整列（Alignment）のハードウェア的必然性を学びます。',
      dialogueBefore: [
        {
          id: 'dl7-1',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ベン先生、大惨事です……！自機のハイスコアや座標を保存するセーブ機能を作ったんです。`fwrite(&saveData, sizeof(saveData), 1, fp);` でファイルに書き出したんですが、ファイルサイズが計算と合わないし、友達のPCに渡したらスコアが0点になって自機が画面外へ吹き飛びました……！'
        },
        {
          id: 'dl7-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！初心者が100人いたら99人が一度は踏み抜く【構造体パディング（Padding）と境界整列（Alignment）】の落とし穴じゃな！構造体のメモリを生ダンプしてファイルやネットワークに流しては絶対にいかんのじゃ！'
        },
        {
          id: 'dl7-3',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'えっ！？でも構造体って、宣言した変数が順番にメモリにピッチリ並んでいるんじゃないんですか？`char`（1バイト）と `int`（4バイト）と `short`（2バイト）なら、合計7バイトじゃないんですか……？'
        },
        {
          id: 'dl7-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '甘い、甘すぎるぞピッピン！CPUはメモリからデータを1バイトずつチマチマ読んでいるわけではない！32bit CPUなら4バイト単位、64bit CPUなら8バイト単位の「ワード境界」に合わせて一度にフェッチするんじゃ。境界を跨ぐと読み込み速度がガタ落ちするか、ハードウェア例外（Bus Error）でクラッシュする。だからコンパイラが親切心で「見えない隙間（パディング）」を勝手に挟み込んでおるんじゃよ！'
        }
      ],
      paradigmComparison: {
        title: 'C言語（無防備な構造体生ダンプ） vs C++（明示的バイトシリアライズ）',
        cApproach: {
          title: 'C言語：構造体の生メモリをそのまま fwrite / send',
          code: `typedef struct {
    char  isAlive;   // 1バイト
    // [パディング: 3バイトのゴミデータが勝手に挿入される！]
    int   score;     // 4バイト (4の倍数番地に配置される)
    short level;     // 2バイト
    // [パディング: 末尾に2バイト挿入され、全体が4の倍数(12B)に！]
} PlayerSave;

PlayerSave p = { 1, 99990, 5 };

// 構造体をそのままファイルに保存（危険！）
FILE* fp = fopen("save.dat", "wb");
fwrite(&p, sizeof(PlayerSave), 1, fp); // 7バイトではなく12バイト書き込まれる！
fclose(fp);

// ❌ 罠1: コンパイラやOS(32bit/64bit)によってパディング配置が異なり互換性ゼロ
// ❌ 罠2: 未初期化のパディング領域（ゴミデータ）が書き込まれセキュリティ漏洩`,
          drawbacks: [
            'コンパイラ最適化設定やCPUアーキテクチャによってパディングサイズが変わり、セーブデータが破損する',
            'パディング領域にスタック上の未初期化ゴミデータが混入し、セーブファイルに機密情報が漏洩する恐れがある',
            'エンディアンの違い（x86系リトルエンディアン vs 通信ネットワークのビッグエンディアン）を無視してしまう'
          ]
        },
        cppApproach: {
          title: 'C++：各フィールドを明示的なバイト順・型サイズでシリアライズ',
          code: `class PlayerSavePacket {
public:
    uint8_t  isAlive;
    uint32_t score;
    uint16_t level;

    // バイト配列へ明示的にパッキング（パディングを完全排除）
    void serialize(std::vector<uint8_t>& buffer) const {
        buffer.push_back(isAlive);

        // score (32bit) をリトルエンディアンで4バイト書き込み
        buffer.push_back(static_cast<uint8_t>(score & 0xFF));
        buffer.push_back(static_cast<uint8_t>((score >> 8) & 0xFF));
        buffer.push_back(static_cast<uint8_t>((score >> 16) & 0xFF));
        buffer.push_back(static_cast<uint8_t>((score >> 24) & 0xFF));

        // level (16bit) を2バイト書き込み
        buffer.push_back(static_cast<uint8_t>(level & 0xFF));
        buffer.push_back(static_cast<uint8_t>((level >> 8) & 0xFF));
    }
    // 常に寸分違わず「正確に7バイト」で保存・通信できる！
};`,
          benefits: [
            'コンパイラやOSのアライメント規則に一切左右されず、常に同一のバイト列を生成できる',
            'ゴミデータが一切混入せず、最小限のデータサイズ（帯域・ディスク容量の削減）を実現',
            'エンディアンをビットシフトで明示変換するため、異なるCPU間でも100%確実に復元可能'
          ]
        },
        paradigmShiftNotes: 'ハードウェア境界（アライメント）と論理データ形式（ファイル・通信）を明確に分離することが、堅牢なゲームアーキテクチャの第一歩です。'
      },
      explanationText: `### メモリアライメント（境界整列）とは何か？

CPUは物理メモリにアクセスする際、**「自分のワードサイズ（4バイトまたは8バイト）の倍数のアドレス」** から一度にデータを読み出します。

もし \`int\`（4バイト）が奇数アドレス（例えば \`0x1001\`）に配置されていた場合、CPUは \`0x1000\` と \`0x1004\` の2回メモリを読み出し、それらをビットシフトして結合しなければなりません。これは**大きな性能劣化（ミスアライメントペナルティ）**を引き起こし、ARMなどの組み込みプロセッサでは**アライメント違反例外（SIGBUS）で即座にクラッシュ**します。

そのため、コンパイラは各型のアライメント制約（通常はその型の \`sizeof\` の倍数）を満たすよう、メンバ間に**パディングバイト（空き領域）**を自動挿入します。

\`\`\`text
【メモリ上の配置比較】
未最適化構造体：
[ char isAlive (1B) ][ パディング (3B) ][ int score (4B) ][ short level (2B) ][ パディング (2B) ]
合計: 12 バイト！（5バイトも無駄な隙間がある）

宣言順序を最適化した構造体（大きい型から順に並べる）：
[ int score (4B) ][ short level (2B) ][ char isAlive (1B) ][ パディング (1B) ]
合計: 8 バイト！（4バイトもメモリを節約できる！）
\`\`\`

> [!TIP]
> **構造体設計の鉄則：大きい型のメンバから先に宣言せよ！**
> \`double\` や \`int64_t\`（8B）→ \`int\` や \`float\`（4B）→ \`short\`（2B）→ \`char\` や \`bool\`（1B）の順に並べるだけで、パディングの発生を最小限に抑えられます。`
    },
    {
      id: 'sec-l7-pointer-arithmetic',
      title: 'L7.2 ポインタ演算の深淵：型とストライド、エンディアンの壁',
      leadText: '`ptr + 1` は何バイト進むのか？`char*` キャストによる生メモリ走査と、リトルエンディアン vs ビッグエンディアンのバイト順変換を解き明かします。',
      dialogueBefore: [
        {
          id: 'dl7-5',
          speaker: 'penguin',
          emotion: 'thinking',
          text: '先生、C言語のバイナリパーサーのコードを読んでいると、`char* p = (char*)buffer;` のように無理やりキャストして `p += 4;` のように足し算しているのをよく見かけます。ポインタに数値を足すと、メモリのアドレスがそのまま増えるんですか？'
        },
        {
          id: 'dl7-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'そこがポインタ演算（Pointer Arithmetic）の最大の勘所じゃ！`int* p` に \`+1\` したら、アドレスは 1 ではなく \`sizeof(int)\`（つまり4バイト）進む！型によって「1歩の歩幅（ストライド）」が変わるんじゃよ。'
        },
        {
          id: 'dl7-7',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'うわっ、ということは型のサイズを意識せずにポインタを足し算すると、あっという間に目的のデータを行き過ぎてしまうんですね……！'
        },
        {
          id: 'dl7-8',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！さらに恐ろしいのが【エンディアン（Endianness）】じゃ！\`0x12345678\` という数値をメモリに置くとき、最下位バイトの \`0x78\` から順に置くのがリトルエンディアン（PC・スマホのCPU）、最上位の \`0x12\` から置くのがビッグエンディアン（ネットワーク通信の標準）。これを正しく反転できねば、通信対戦ゲームは成立せんのじゃ！'
        }
      ],
      explanationText: `### ポインタの歩幅（ストライド）とポインタ演算のルール

ポインタに対する加減算は、**「アドレスの数値加算」ではなく「配列の要素インデックス移動」** として定義されています。

\`\`\`cpp
int   arrInt[4];
int*   pInt = arrInt;
pInt += 1; // 実際のアドレスは +4 バイト進む（sizeof(int) == 4）

double arrDbl[4];
double* pDbl = arrDbl;
pDbl += 1; // 実際のアドレスは +8 バイト進む（sizeof(double) == 8）

// 生バイト単位で移動したい場合は必ず uint8_t* または char* にキャストする
uint8_t* pByte = reinterpret_cast<uint8_t*>(arrInt);
pByte += 1; // 実際のアドレスが正確に +1 バイト進む
\`\`\`

### エンディアン（バイト順）の決定的な違い

\`uint32_t value = 0x12345678;\` をメモリに格納する場合：

| 方式 | アドレス N | アドレス N+1 | アドレス N+2 | アドレス N+3 | 採用例 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **リトルエンディアン** (下位桁が先) | \`0x78\` | \`0x56\` | \`0x34\` | \`0x12\` | x86, x64, ARM (PC, iOS, Android) |
| **ビッグエンディアン** (上位桁が先) | \`0x12\` | \`0x34\` | \`0x56\` | \`0x78\` | TCP/IPネットワーク, PS3(Cell) |

> [!WARNING]
> **Strict Aliasing Rule（厳格な別名規約）の罠**
> \`char*\` や \`uint8_t*\` 以外の異なる型同士でポインタを相互キャストしてアクセス（例: \`float*\` を \`int*\` にキャストしてビット参照）すると、C++の**未定義動作（Undefined Behavior）**となります。コンパイラは「異なる型のポインタは同じメモリを指さない」と仮定して最適化を行うため、変数の読み書き順序が狂い、リリースビルドで不可解なバグを生みます。安全にメモリを再解釈するには \`std::memcpy\` を使うのがC++の現代標準です。`
    },
    {
      id: 'sec-l7-binary-stream-impl',
      title: 'L7.3 実践：安全なバイナリセーブデータ＆パケットストリームの設計',
      leadText: 'アライメントとエンディアンを克服する「BinaryWriter / BinaryReader」クラスを構築し、自機のセーブデータを安全・コンパクトにシリアライズします。',
      dialogueBefore: [
        {
          id: 'dl7-9',
          speaker: 'penguin',
          emotion: 'thinking',
          text: 'ベン先生、構造体の生ダンプが危険なら、実際のゲームプログラミングではどうやって自機の座標やインベントリを保存しているんですか？'
        },
        {
          id: 'dl7-10',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'うむ！現場では「BinaryWriter / BinaryReader」というストリームバッファクラスを作るのが常套手段じゃ。先頭にマジックナンバー（例: \`"SKRM"\`）とデータバージョンを刻み、1バイトずつエンディアンを統一して安全に読み書きするんじゃ！'
        },
        {
          id: 'dl7-11',
          speaker: 'penguin',
          emotion: 'smug',
          text: 'マジックナンバー！よくゲームファイルの先頭にある「PNG」とか「RIFF」みたいなファイル識別ヘッダですね！'
        },
        {
          id: 'dl7-12',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'その通り！バージョン番号があれば、将来ゲームがアップデートしてセーブデータ項目が増えても、過去のセーブデータを安全にコンバートできる。これぞプロのセーブデータ設計じゃ！'
        }
      ],
      codeFiles: [
        {
          filename: 'BinaryStream.h',
          language: 'cpp',
          description: '安全なバイナリ書き込み・読み出しストリームクラス（リトルエンディアン統一）',
          code: `#ifndef BINARY_STREAM_H
#define BINARY_STREAM_H

#include <vector>
#include <string>
#include <cstdint>
#include <stdexcept>
#include <cstring>

// 安全なバイナリ書き込みクラス（リトルエンディアン統一）
class BinaryWriter {
private:
    std::vector<uint8_t> m_buffer;

public:
    BinaryWriter() {}

    // 1バイト書き込み
    void writeUint8(uint8_t val) {
        m_buffer.push_back(val);
    }

    // 16bit整数書き込み（リトルエンディアン）
    void writeUint16(uint16_t val) {
        m_buffer.push_back(static_cast<uint8_t>(val & 0xFF));
        m_buffer.push_back(static_cast<uint8_t>((val >> 8) & 0xFF));
    }

    // 32bit整数書き込み（リトルエンディアン）
    void writeUint32(uint32_t val) {
        m_buffer.push_back(static_cast<uint8_t>(val & 0xFF));
        m_buffer.push_back(static_cast<uint8_t>((val >> 8) & 0xFF));
        m_buffer.push_back(static_cast<uint8_t>((val >> 16) & 0xFF));
        m_buffer.push_back(static_cast<uint8_t>((val >> 24) & 0xFF));
    }

    // float (32bit浮動小数点) 書き込み (memcpyでエイリアシングルール遵守)
    void writeFloat(float val) {
        uint32_t raw;
        std::memcpy(&raw, &val, sizeof(float));
        writeUint32(raw);
    }

    // 文字列書き込み (長さ uint16 + 文字列バイト列)
    void writeString(const std::string& str) {
        writeUint16(static_cast<uint16_t>(str.size()));
        for (char c : str) {
            writeUint8(static_cast<uint8_t>(c));
        }
    }

    // 完成したバッファ参照
    const std::vector<uint8_t>& getBuffer() const { return m_buffer; }
    size_t getSize() const { return m_buffer.size(); }
};

// 安全なバイナリ読み出しクラス
class BinaryReader {
private:
    const uint8_t* m_data;
    size_t m_size;
    size_t m_cursor;

public:
    BinaryReader(const uint8_t* data, size_t size)
        : m_data(data), m_size(size), m_cursor(0) {}

    bool hasRemaining(size_t bytes) const {
        return m_cursor + bytes <= m_size;
    }

    uint8_t readUint8() {
        if (!hasRemaining(1)) throw std::runtime_error("Unexpected End of Stream");
        return m_data[m_cursor++];
    }

    uint16_t readUint16() {
        if (!hasRemaining(2)) throw std::runtime_error("Unexpected End of Stream");
        uint16_t b0 = m_data[m_cursor++];
        uint16_t b1 = m_data[m_cursor++];
        return static_cast<uint16_t>(b0 | (b1 << 8));
    }

    uint32_t readUint32() {
        if (!hasRemaining(4)) throw std::runtime_error("Unexpected End of Stream");
        uint32_t b0 = m_data[m_cursor++];
        uint32_t b1 = m_data[m_cursor++];
        uint32_t b2 = m_data[m_cursor++];
        uint32_t b3 = m_data[m_cursor++];
        return b0 | (b1 << 8) | (b2 << 16) | (b3 << 24);
    }

    float readFloat() {
        uint32_t raw = readUint32();
        float val;
        std::memcpy(&val, &raw, sizeof(float));
        return val;
    }

    std::string readString() {
        uint16_t len = readUint16();
        if (!hasRemaining(len)) throw std::runtime_error("Unexpected End of Stream in String");
        std::string str(reinterpret_cast<const char*>(m_data + m_cursor), len);
        m_cursor += len;
        return str;
    }
};

#endif // BINARY_STREAM_H`
        },
        {
          filename: 'SaveDataPacket.h',
          language: 'cpp',
          description: 'マジックナンバーとバージョン管理を備えたセーブデータシリアライザ',
          code: `#ifndef SAVE_DATA_PACKET_H
#define SAVE_DATA_PACKET_H

#include "BinaryStream.h"
#include <string>

// 自機のセーブデータ構造体
struct PlayerSaveState {
    std::string playerName; // プレイヤー名
    float       posX;       // X座標
    float       posY;       // Y座標
    uint32_t    score;      // ハイスコア
    uint16_t    hp;         // 残り体力
    uint8_t     weaponLevel;// 武器レベル
};

// ヘッダ付きセーブデータパケット管理クラス
class SaveDataPacket {
public:
    static const uint32_t MAGIC_HEADER = 0x4D524B53; // "SKRM" (リトルエンディアン)
    static const uint16_t CURRENT_VERSION = 1;

    // セーブデータをバイナリバッファにシリアライズ
    static std::vector<uint8_t> serialize(const PlayerSaveState& player) {
        BinaryWriter writer;

        // 1. ヘッダ情報 (マジックナンバー + バージョン)
        writer.writeUint32(MAGIC_HEADER);
        writer.writeUint16(CURRENT_VERSION);

        // 2. プレイヤーデータ本体
        writer.writeString(player.playerName);
        writer.writeFloat(player.posX);
        writer.writeFloat(player.posY);
        writer.writeUint32(player.score);
        writer.writeUint16(player.hp);
        writer.writeUint8(player.weaponLevel);

        return writer.getBuffer();
    }

    // バイナリバッファからセーブデータを安全にデシリアライズ
    static bool deserialize(const uint8_t* data, size_t size, PlayerSaveState& outPlayer) {
        try {
            BinaryReader reader(data, size);

            // 1. マジックナンバー検証
            uint32_t magic = reader.readUint32();
            if (magic != MAGIC_HEADER) {
                return false; // 不正なファイルフォーマット
            }

            // 2. バージョン確認
            uint16_t version = reader.readUint16();
            if (version != CURRENT_VERSION) {
                return false; // 未対応バージョン
            }

            // 3. データ復元
            outPlayer.playerName  = reader.readString();
            outPlayer.posX        = reader.readFloat();
            outPlayer.posY        = reader.readFloat();
            outPlayer.score       = reader.readUint32();
            outPlayer.hp          = reader.readUint16();
            outPlayer.weaponLevel = reader.readUint8();

            return true;
        } catch (...) {
            return false; // データ破損
        }
    }
};

#endif // SAVE_DATA_PACKET_H`
        },
        {
          filename: 'main.cpp',
          language: 'cpp',
          description: 'セーブデータのシリアライズ・HEXダンプ・デシリアライズ復元動作検証コード',
          code: `#include <iostream>
#include <iomanip>
#include "SaveDataPacket.h"

void dumpHex(const std::vector<uint8_t>& buf) {
    std::cout << "[バイナリダンプ (" << buf.size() << " bytes)]:" << std::endl;
    for (size_t i = 0; i < buf.size(); ++i) {
        std::cout << std::hex << std::setw(2) << std::setfill('0')
                  << static_cast<int>(buf[i]) << " ";
        if ((i + 1) % 8 == 0) std::cout << " ";
        if ((i + 1) % 16 == 0) std::cout << std::endl;
    }
    std::cout << std::dec << std::endl;
}

int main() {
    std::cout << "=== シロクマC++ラボ L7: バイナリシリアライズ実証 ===" << std::endl;

    // 1. セーブするプレイヤーデータ作成
    PlayerSaveState original;
    original.playerName  = "ShirokumaAce";
    original.posX        = 128.5f;
    original.posY        = 256.0f;
    original.score       = 987654;
    original.hp          = 100;
    original.weaponLevel = 3;

    // 2. シリアライズ実行（バイト列化）
    std::vector<uint8_t> binaryData = SaveDataPacket::serialize(original);
    dumpHex(binaryData);

    // 3. デシリアライズ実行（復元）
    PlayerSaveState loaded;
    bool success = SaveDataPacket::deserialize(binaryData.data(), binaryData.size(), loaded);

    if (success) {
        std::cout << "✅ セーブデータの復元に成功しました！" << std::endl;
        std::cout << "  プレイヤー名: " << loaded.playerName << std::endl;
        std::cout << "  座標 (X, Y) : (" << loaded.posX << ", " << loaded.posY << ")" << std::endl;
        std::cout << "  スコア      : " << loaded.score << std::endl;
        std::cout << "  残りHP      : " << loaded.hp << std::endl;
        std::cout << "  武器レベル  : " << static_cast<int>(loaded.weaponLevel) << std::endl;
    } else {
        std::cout << "❌ データ破損または無効なヘッダです。" << std::endl;
    }

    return 0;
}`
        }
      ],
      umlDiagram: {
        title: 'バイナリストリームとセーブデータパケットの設計図',
        subtitle: 'アライメントとエンディアンを吸収するバイト入出力アーキテクチャ',
        diagramType: 'class',
        description: 'BinaryWriter/Reader が低レベルのバイトシリアライズとエンディアン変換をカプセル化し、SaveDataPacket がヘッダ検証（マジックナンバー・バージョン）とビジネスロジックの復元を担います。',
        classes: [
          {
            name: 'BinaryWriter',
            stereotype: 'Utility',
            attributes: [
              {
                name: 'm_buffer',
                type: 'std::vector<uint8_t>',
                visibility: '-',
                codeLineRef: { filename: 'BinaryStream.h', line: 13, keyword: 'm_buffer' }
              }
            ],
            operations: [
              {
                name: 'writeUint8(val: uint8_t)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 19, keyword: 'writeUint8' }
              },
              {
                name: 'writeUint32(val: uint32_t)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 30, keyword: 'writeUint32' }
              },
              {
                name: 'writeFloat(val: float)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 39, keyword: 'writeFloat' }
              },
              {
                name: 'writeString(str: string)',
                type: 'void',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 46, keyword: 'writeString' }
              }
            ]
          },
          {
            name: 'SaveDataPacket',
            stereotype: 'Serializer',
            attributes: [
              {
                name: 'MAGIC_HEADER',
                type: 'const uint32_t',
                visibility: '+',
                codeLineRef: { filename: 'SaveDataPacket.h', line: 19, keyword: 'MAGIC_HEADER' }
              },
              {
                name: 'CURRENT_VERSION',
                type: 'const uint16_t',
                visibility: '+',
                codeLineRef: { filename: 'SaveDataPacket.h', line: 20, keyword: 'CURRENT_VERSION' }
              }
            ],
            operations: [
              {
                name: 'serialize(player: PlayerSaveState&)',
                type: 'vector<uint8_t>',
                visibility: '+',
                codeLineRef: { filename: 'SaveDataPacket.h', line: 23, keyword: 'serialize' }
              },
              {
                name: 'deserialize(data: uint8_t*, out: PlayerSaveState&)',
                type: 'bool',
                visibility: '+',
                codeLineRef: { filename: 'SaveDataPacket.h', line: 40, keyword: 'deserialize' }
              }
            ]
          },
          {
            name: 'BinaryReader',
            stereotype: 'Utility',
            attributes: [
              {
                name: 'm_cursor',
                type: 'size_t',
                visibility: '-',
                codeLineRef: { filename: 'BinaryStream.h', line: 63, keyword: 'm_cursor' }
              }
            ],
            operations: [
              {
                name: 'readUint32()',
                type: 'uint32_t',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 83, keyword: 'readUint32' }
              },
              {
                name: 'readFloat()',
                type: 'float',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 92, keyword: 'readFloat' }
              },
              {
                name: 'readString()',
                type: 'string',
                visibility: '+',
                codeLineRef: { filename: 'BinaryStream.h', line: 99, keyword: 'readString' }
              }
            ]
          }
        ],
        relations: [
          {
            from: 'SaveDataPacket',
            to: 'BinaryWriter',
            type: 'association',
            label: '利用 (シリアライズ時)',
            cppMapping: 'BinaryWriter writer; writer.writeUint32(...);'
          },
          {
            from: 'SaveDataPacket',
            to: 'BinaryReader',
            type: 'association',
            label: '利用 (デシリアライズ時)',
            cppMapping: 'BinaryReader reader(data, size); reader.readUint32();'
          }
        ],
        codeMappingNotes: [
          'BinaryWriter は各プリミティブ型を固定長ビットシフトで書き込むため、CPUやOSのアライメント差異が一切生じません。',
          'SaveDataPacket は先頭4バイトのマジックナンバーを検証することで、破損ファイルや別ゲームのデータを誤読み込みするクラッシュを100%防止します。',
          'float値のシリアライズには reinterpret_cast ではなく std::memcpy を使用し、C++の Strict Aliasing Rule（未定義動作）を完全に回避しています。'
        ]
      }
    }
  ],
  quiz: [
    {
      id: 'q-l7-1',
      question: '以下の構造体 Data の sizeof(Data) は、一般的な 64bit 環境（int: 4B, double: 8B, short: 2B）で何バイトになるでしょうか？\nstruct Data {\n    char   a; // 1バイト\n    double b; // 8バイト\n    short  c; // 2バイト\n};',
      options: [
        '1 + 8 + 2 = 11バイト（パディングなし）',
        '16バイト（aの後ろに7バイトパディング、末尾パディングなし）',
        '24バイト（aの後ろに7バイト、cの後ろに6バイトのパディングが挿入される）',
        '32バイト（すべてのメンバが8バイト単位に拡張される）'
      ],
      correctIndex: 2,
      explanation: '正解は 24バイト です。double のアライメント制約（8バイト境界）を満たすため、char a の直後に 7バイトのパディングが挿入されます。さらに、構造体の配列を作成した際に次の要素の double が正しく8バイト境界に並ぶよう、末尾の short c（2B）の後ろにも 6バイトのパディングが挿入され、全体サイズが最大の型アライメント（8B）の倍数である 24バイト に揃えられます。'
    },
    {
      id: 'q-l7-2',
      question: '前問の構造体 Data のメモリ使用量を最小にするための、最も適切なメンバ宣言順序はどれでしょうか？',
      options: [
        'struct Data { char a; short c; double b; };',
        'struct Data { double b; short c; char a; };',
        'struct Data { short c; double b; char a; };',
        '宣言順序を変えてもパディングは変わらない'
      ],
      correctIndex: 1,
      explanation: '正解は「struct Data { double b; short c; char a; };」です。大きい型から順に並べると、double b (8B) ＋ short c (2B) ＋ char a (1B) となり、有効データは 11バイト。8バイト境界に揃えるための末尾パディングは 5バイトのみとなり、合計 16バイト に縮小できます（24バイトから8バイトも節約可能）。'
    },
    {
      id: 'q-l7-3',
      question: 'リトルエンディアンのシステムにおいて、32bit整数値 0x12345678 をメモリに書き込んだ場合、先頭アドレスから順に配置されるバイト列はどれでしょうか？',
      options: [
        '0x12, 0x34, 0x56, 0x78',
        '0x78, 0x56, 0x34, 0x12',
        '0x56, 0x78, 0x12, 0x34',
        '0x78, 0x12, 0x56, 0x34'
      ],
      correctIndex: 1,
      explanation: '正解は「0x78, 0x56, 0x34, 0x12」です。リトルエンディアン（Little Endian）では、数値の最下位バイト（Least Significant Byte: 0x78）が最も小さいアドレス（先頭）に配置され、最上位バイト（0x12）が末尾アドレスに配置されます。'
    },
    {
      id: 'q-l7-4',
      question: 'ネットワーク通信やセーブデータ保存において、C++構造体をそのまま fwrite(&obj, sizeof(obj), ...) してはいけない最大の理由は何でしょうか？',
      options: [
        'fwrite 関数はテキストファイル専用であり、バイナリを書き込めないから',
        'コンパイラやOSによってパディングサイズやエンディアンが異なり、他の環境でデータが破損・化けるから',
        '構造体の中にポインタが1つでも含まれているとコンパイルエラーになるから',
        'C++ではファイル入出力に std::cout しか使えない仕様になっているから'
      ],
      correctIndex: 1,
      explanation: '正解は「コンパイラやOSによってパディングサイズやエンディアンが異なり、他の環境でデータが破損・化けるから」です。コンパイラバージョンや32bit/64bit環境の違い、CPUエンディアンの違いにより、生メモリのダンプデータは互換性が破壊されます。現場では本章で作成した BinaryWriter のように明示的にバイト列へパッキングして保存・送信するのが鉄則です。'
    }
  ],
  prevChapterSlug: 'chapter-6-operator-overload-vector',
  nextChapterSlug: 'chapter-8-function-pointers-callbacks'
};
