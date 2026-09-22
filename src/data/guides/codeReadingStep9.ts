import { Chapter } from '../../types/curriculum';

export const CODE_READING_STEP_9: Chapter = {
  id: 209,
  slug: 'reading-step-9',
  category: 'reading',
  courseTrack: 'reading',
  courseChapterCode: 'R9',
  title: 'コード読解演習 Step 9【ダンプ鑑識】：クラッシュダンプと逆アセンブラ読解（MiniDump解析）',
  subtitle: '最適化ビルド（-O2）で狂う行番号を突破！MiniDump と CPUレジスタ（RAX/RSP）からクラッシュ現場を特定する技術',
  badge: '読解演習 Step 9',
  description: '「開発環境（Debugビルド）では絶対に再現しないのに、リリース版でお客さんのPCでのみクラッシュする」「デバッガをアタッチした瞬間、タイミングが変わってバグが消える（ハイゼンバグ）」――プロの開発現場で最も難度の高いトラブルが本番クラッシュです。本章では、Windows MiniDump や Linux Core Dump を用いてクラッシュ瞬間のCPUレジスタとメモリ状態を復元し、最適化（-O2 / -O3）によってインライン化・並べ替えられたアセンブリ命令の逆引きから真のクラッシュ原因を特定する現場鑑識眼を体得します。',
  gameVersion: 'none',
  prevChapterSlug: 'reading-step-8',
  nextChapterSlug: 'reading-step-10',
  sections: [
    {
      id: 'step9-dump-basics',
      title: '9.1 「手元で再現しない！」本番クラッシュを捕らえる MiniDump と PDB',
      leadText: 'クラッシュした瞬間のプロセスを凍結保存するダンプファイル。開発者の手元へ事故現場を完全輸送する仕組み。',
      dialogueBefore: [
        {
          id: 'dlg-r9-1',
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'シロクマ先生！リリースしたゲームをプレイしているユーザーさんから「3時間くらい遊んでいたら突然画面が消えてデスクトップに戻った」と問い合わせが来ました！私の開発PCで同じ操作をしても全く落ちないんです…！'
        },
        {
          id: 'dlg-r9-2',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ふぉっふぉっふぉ！それぞ「ハイゼンバグ（観察しようとすると消えるバグ）」の典型例じゃな！Releaseビルドは最適化が効いておるし、メモリ配置もDebug版とは全く異なる。手元の勘で直そうとするのは暗闇で針を探すようなものじゃ！'
        },
        {
          id: 'dlg-r9-3',
          speaker: 'penguin',
          emotion: 'question',
          text: 'じゃあ、ユーザーさんのPCで何が起きていたのか、どうやって調べればいいんですか？'
        },
        {
          id: 'dlg-r9-4',
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'そこで活躍するのが【クラッシュダンプ（MiniDump：.dmp）】と【デバッグシンボル（PDB）】じゃ！OSがクラッシュした瞬間のCPUレジスタ、スタックメモリ、スレッド状態をファイルに書き出して送ってもらうのじゃよ！'
        }
      ],
      explanationText: `
### MiniDump と PDB シンボルの関係

本番環境の実行可能ファイル（.exe / .dll）には、実行速度とファイルサイズ削減のため、関数名やソースコードの行番号情報が含まれていません。

1. **クラッシュダンプ (.dmp)**:
   - クラッシュ瞬間の「CPUレジスタ値（RAX, RSP, RIP等）」と「スタックメモリの生バイナリ」を記録したスナップショット。
2. **デバッグシンボル (.pdb / DWARF)**:
   - ビルド時に生成される「機械語アドレス（例: 0x00401A20）とソースコード（例: Player.cpp の 142行目）」の対応辞書。

この2つを開発者のPC上で合体させることで、**「ユーザーのPCでクラッシュした瞬間のコールスタック」**が数千キロ離れた手元のIDE上で鮮やかに再現されます。

**⚠️ プロの鉄則**: リリースビルドを行う際、生成された「.pdb」ファイルは絶対に破棄せず、バージョンごとに社内シンボルサーバー等へ永久保管しなければなりません。PDBが1文字でもビルド時とズレると、ダンプの行番号は二度と復元できなくなります。
      `,
      takeaways: [
        {
          title: 'MiniDump ＋ PDB ＝ 事故現場のタイムトラベル',
          description: 'ユーザー環境のクラッシュは、生ダンプと対応するバージョンのPDBシンボルを突き合わせることで初めて解析可能になります。'
        }
      ]
    },
    {
      id: 'step9-opt-inlining-trap',
      title: '9.2 最適化（-O2）の罠：消えたコールスタックとズレる行番号',
      leadText: 'なぜリリース版のデバッグは一筋縄でいかないのか？ コンパイラ最適化の魔術を解き明かします。',
      dialogueBefore: [
        {
          id: 'dlg-r9-5',
          speaker: 'penguin',
          emotion: 'sweating',
          text: 'ダンプをVisual Studioで開いてみました！コールスタックが表示されたんですが…落ちた行番号として表示されているのが空行や波括弧「}」だったり、絶対に呼んでいるはずの getEnemy() 関数がスタックに存在しないんです…デバッガが壊れているんでしょうか？'
        },
        {
          id: 'dlg-r9-6',
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'デバッガは正常じゃ！それこそが【コンパイラ最適化（Optimization）】の仕業なんじゃよ！'
        }
      ],
      explanationText: `
### 最適化がもたらす3大デバッグ難関

C++コンパイラ（MSVC, GCC, Clang）は、「-O2」や「/O2」が指定されると、人間が書いたコードの構造を大幅に組み替えます：

1. **インライン展開（Inlining）**:
   - 小さな関数は関数呼び出し（CALL命令）を行わず、呼び出し元のコードの中に直接埋め込まれます。そのため、コールスタックから関数名が綺麗に消え去ります。
2. **末尾呼び出し最適化（Tail Call Optimization: TCO）**:
   - 関数の末尾でのリターン呼び出しは、スタックフレームを破棄してジャンプ（JMP）命令に変換されるため、中間のスタックフレームが消失します。
3. **命令の並べ替え（Instruction Reordering）**:
   - CPUパイプラインの効率化のため、無関係な演算の順番が前後します。これにより、デバッガの現在行ハイライトと実際に実行されている命令にズレが生じます。

このため、リリース版の真因究明には**「ソースコードの行番号を盲信するのではなく、逆アセンブラ（Assembly）を直接鑑識する力」**が必須となります。
      `,
      takeaways: [
        {
          title: '最適化ビルドでは行番号を疑い、アセンブリ命令を信ぜよ',
          description: 'インライン展開や命令並べ替えにより行番号表示がズレるため、クラッシュアドレスの直前の機械語命令を確認するのが確実です。'
        }
      ]
    },
    {
      id: 'step9-disasm-forensics',
      title: '9.3 逆アセンブラ鑑識術：レジスタ値から真犯人を逆算する',
      leadText: 'クラッシュ現場の x86-64 アセンブリ命令を読み解き、Access Violation の真の引き金を特定します。',
      explanationText: `
### 実例：アクセス違反（Access Violation 0xC0000005）の現場

ダンプを開いた際、クラッシュ現場のアセンブリ命令が以下のようになっていたとします：

【命令】00007FF7B4201A34: mov rax, qword ptr [rcx+18h]  <-- ここでアクセス違反！
【命令】00007FF7B4201A38: mov edx, dword ptr [rax+8]
【命令】00007FF7B4201A3B: call Player::takeDamage

同時に、デバッガのレジスタウィンドウには以下の値が記録されていました：
- **RCX**: 0x0000000000000000
- **RDX**: 0x0000000000000014
- **RSP**: 0x00000058F31DF680

#### 【鑑識のステップ】
1. **問題の命令を読む**:
   - 「mov rax, qword ptr [rcx+18h]」は、「RCX の指すアドレスから 0x18（24バイト）進んだ場所にあるポインタを RAX に読み込め」という意味です。
2. **レジスタを確認する**:
   - なんと **RCX が 0x0（nullptr）** です！
   - つまり、アドレス「0x0 + 0x18 = 0x0000000000000018」という無効なメモリ領域を読み込もうとして、OSによって即座に撃墜されたことが分かります。
3. **C++の文脈へ逆算する**:
   - x64の呼出規約（Microsoft x64 ABI）では、**第1引数（メンバ関数における this ポインタ）は RCX レジスタ** に格納されます。
   - つまり、**「ヌルポインタ（nullptr）のオブジェクトに対してメンバ関数を呼び出したため、this->member にアクセスした瞬間に爆死した」** という真実が一瞬で浮き彫りになります！
      `,
      codeFiles: [
        {
          filename: 'CrashForensicsExample.cpp',
          language: 'cpp',
          description: 'アセンブリ鑑識とC++ソースコードの対応',
          code: `struct Shield {
    int defensePower; // offset: 0x8
};

struct Player {
    Shield* pShield;   // offset: 0x18 (24バイト目)
    
    void takeDamage(int rawDmg) {
        // もし this (RCX) が nullptr だった場合、
        // pShield (this + 0x18) を参照しようとした瞬間にクラッシュ！
        int finalDmg = rawDmg - this->pShield->defensePower;
    }
};

// 鑑識の結果判明したバグの温床：
void onEnemyHit(Player* pTarget) {
    // pTarget が nullptr かどうかの事前チェックが抜けていた！
    // if (pTarget != nullptr) が必要！
    pTarget->takeDamage(20);
}`
        }
      ],
      takeaways: [
        {
          title: 'RCX + 0xXX のアクセス違反は「this が nullptr」の代名詞',
          description: 'x64環境でオフセット数十バイトへのアクセス違反が起きた場合、ほぼ例外なく this ポインタ（RCX）が nullptr のままメンバを触ったことが原因です。'
        }
      ]
    }
  ],
  quiz: [
    {
      id: 'quiz-r9-1',
      question: 'ユーザー環境でクラッシュしたプロセスの MiniDump（.dmp）を解析する際、開発者の手元に絶対に必要となるファイルは何ですか？',
      options: [
        'ユーザーのWebブラウザのキャッシュ',
        'ビルド時にその実行ファイル（.exe）と同時に生成されたデバッグシンボルファイル（.pdb）',
        'PCのグラフィックボードドライバ',
        'ゲームの音声ファイル（.wav）'
      ],
      correctIndex: 1,
      explanation: 'MiniDump内の機械語アドレスとソースコードのファイル名・行番号を復元するには、ビルド時に生成された同一ハッシュのデバッグシンボル（.pdb）が必須です。'
    },
    {
      id: 'quiz-r9-2',
      question: '最適化ビルド（-O2）のクラッシュダンプで、呼び出したはずの関数がコールスタックに表示されない主な原因は何ですか？',
      options: [
        'コンパイラが関数を削除してゲームを軽量化したため',
        'インライン展開（Inlining）により、関数のコードが呼び出し元に直接埋め込まれCALL命令が消失したため',
        'メモリが足りなくて関数名が保存できなかったため',
        'モニターの解像度が低いため'
      ],
      correctIndex: 1,
      explanation: 'インライン展開されると関数呼び出しオーバーヘッドがなくなる代わりに独立したスタックフレームが生成されないため、コールスタックから関数名が消えます。'
    },
    {
      id: 'quiz-r9-3',
      question: 'x64環境で mov rax, [rcx + 0x18] の命令でアクセス違反が発生し、RCXレジスタが 0x00000000 だった場合、C++コードレベルで何が起きていますか？',
      options: [
        'メモリがハードディスクに書き込まれた',
        'nullptr であるオブジェクト（this）のメンバ変数へアクセスしようとした（Null Pointer Dereference）',
        '配列のインデックスが100万を超えた',
        'マルチスレッドのデッドロックが発生した'
      ],
      correctIndex: 1,
      explanation: 'x64呼び出し規約ではメンバ関数の this ポインタは RCX に入るため、RCX=0 の状態でオフセット0x18を読み込むのは nullptr->member を参照した典型的なヌルポ即死です。'
    },
    {
      id: 'quiz-r9-4',
      question: 'デバッガをアタッチして調査しようとするとタイミングやメモリ配置が変化して発生しなくなるバグの通称は何ですか？',
      options: [
        'オームの法則',
        'ハイゼンバグ（Heisenbug）',
        'シュレディンガーの猫',
        'ムーアの法則'
      ],
      correctIndex: 1,
      explanation: '物理学者ハイゼンベルクの不確定性原理にちなみ、観察（デバッガ接続やログ出力）しようとすると挙動が変わったり再現しなくなるバグをハイゼンバグと呼びます。'
    }
  ]
};
