/**
 * 各章に埋め込むステップバイステップ設計演習シナリオデータ
 */

export interface LabStep {
  stepNumber: number;
  totalSteps: number;
  badge: string;
  title: string;
  instruction: string;
  code: string;
  codeFilename: string;
  actionButtonText: string;
  simulatedOutput: {
    type: 'error' | 'success' | 'warning';
    lines: string[];
  };
  dialogue: {
    speaker: 'shirokuma' | 'penguin';
    text: string;
    emotion: 'sweating' | 'teaching' | 'smug' | 'shocked';
  };
  takeaway: string;
}

export interface ChapterLabScenario {
  chapterSlug: string;
  chapterBadge: string;
  title: string;
  subtitle: string;
  mentalModel: string;
  steps: LabStep[];
}

export const STEP_BY_STEP_LABS: Record<string, ChapterLabScenario> = {
  // L1: スパゲティコードの破綻と関数カプセル化
  'chapter-classic-1-spaghetti-code': {
    chapterSlug: 'chapter-classic-1-spaghetti-code',
    chapterBadge: 'L1 演習',
    title: 'グローバル変数直書きスパゲティの破綻と関数カプセル化',
    subtitle: '誰でも触れるグローバル変数が引き起こす座標破壊バグを、関数による関所ガードで撲滅する！',
    mentalModel: 'グローバル直書き (誰でも変更可能) ➔ 意図しない不正代入 (画面外クラッシュ) ➔ ガード関数による防壁',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: 'グローバル変数が勝手に書き換わってゲームが壊れる瞬間',
        instruction: '以下のコードを実行して、グローバル変数 g_player_x がどこからでも勝手に変更されて座標がマイナスに吹き飛ぶバグを再現してみましょう。',
        codeFilename: 'spaghetti_bad.cpp',
        code: [
          '#include <iostream>',
          '',
          '// ❌ 危険：誰でもアクセス可能なグローバル変数',
          'int g_player_x = 10;',
          'int g_score = 0;',
          '',
          'void updateEnemy() {',
          '    // 別の処理のバグで、誤ってプレイヤーの座標にマイナス値を代入してしまった！',
          '    g_player_x = -999;',
          '}',
          '',
          'int main() {',
          '    std::cout << "[GAME START] プレイヤー座標: " << g_player_x << std::endl;',
          '    updateEnemy();',
          '    std::cout << "[UPDATE] 敵の更新後... プレイヤー座標: " << g_player_x << std::endl;',
          '    ',
          '    if (g_player_x < 0) {',
          '        std::cout << "💥 [CRASH] 画面外アクセス違反！自機が画面外へ吹き飛びました！" << std::endl;',
          '        return 1;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してクラッシュを再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ g++ -O2 spaghetti_bad.cpp -o game && ./game',
            '[GAME START] プレイヤー座標: 10',
            '[UPDATE] 敵の更新後... プレイヤー座標: -999',
            '💥 [CRASH] 画面外アクセス違反！自機が画面外へ吹き飛びました！',
            'Segmentation fault (core dumped) exit code: 1'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ヒエッ…！updateEnemy() という全く無関係な関数の中で g_player_x が書き換えられて、画面外に吹き飛んで落ちてしまいました！グローバル変数だと「誰がいつ値を壊したか」が全く追跡できません！'
        },
        takeaway: 'グローバル変数は「全員が書き換え可能な共有ホワイトボード」。どこか1箇所でもミスするとシステム全体が即死します。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '関数という「関所」を設けて不正な値をガードする',
        instruction: 'グローバル変数への直接代入を禁止し、移動は必ず movePlayer(delta) 関数を経由する設計にリファクタリングします。改善コードを適用してみましょう。',
        codeFilename: 'spaghetti_guard.cpp',
        code: [
          '#include <iostream>',
          '',
          '// 内部変数（直接触らせない）',
          'static int s_player_x = 10;',
          '',
          '// 🛡️ 関所（ガード関数）：0未満への移動を水際でブロック！',
          'void movePlayer(int delta) {',
          '    if (s_player_x + delta < 0) {',
          '        std::cout << "⚠️ [GUARD] 警告: 画面外（マイナス座標）への移動をブロックしました！" << std::endl;',
          '        return; // 不正な移動を却下！',
          '    }',
          '    s_player_x += delta;',
          '}',
          '',
          'int getPlayerX() {',
          '    return s_player_x;',
          '}',
          '',
          'int main() {',
          '    std::cout << "[GAME START] プレイヤー座標: " << getPlayerX() << std::endl;',
          '    ',
          '    // 正しい移動',
          '    movePlayer(5);',
          '    std::cout << "[MOVE +5] プレイヤー座標: " << getPlayerX() << std::endl;',
          '',
          '    // 不正な移動（画面外へ飛び出そうとする）',
          '    movePlayer(-100);',
          '    std::cout << "[MOVE -100 試行後] プレイヤー座標: " << getPlayerX() << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '改善コードを適用してコンパイルする ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ g++ -O2 spaghetti_guard.cpp -o game && ./game',
            '[GAME START] プレイヤー座標: 10',
            '[MOVE +5] プレイヤー座標: 15',
            '⚠️ [GUARD] 警告: 画面外（マイナス座標）への移動をブロックしました！',
            '[MOVE -100 試行後] プレイヤー座標: 15',
            '✨ プレイヤー座標は安全な「15」のまま維持されました！'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！見事に不正な代入を跳ね返したな！「変数に直接代入させるな、関数という関所を通せ」――これがオブジェクト指向のカプセル化の第一歩じゃ！'
        },
        takeaway: '関数を経由させることで、「バリデーション（境界チェック）」と「デバッグログ」を一箇所に集約できます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'テストによる自動検証とカプセル化スキルの獲得',
        instruction: 'ユニットテストを実行し、あらゆる異常な移動コマンドに対してもプレイヤーが安全な範囲に留まることを自動検証しましょう！',
        codeFilename: 'test_player_guard.cpp',
        code: [
          '// 自動テストスイート',
          'void test_boundary_protection() {',
          '    assert(getPlayerX() == 15);',
          '    movePlayer(-9999); // 巨大なマイナス値',
          '    assert(getPlayerX() == 15); // ガードが働き壊れない！',
          '    movePlayer(10);',
          '    assert(getPlayerX() == 25); // 正しい値は通る！',
          '    std::cout << "✅ 全テストケース通過: カプセル化による安全性立証完了" << std::endl;',
          '}'
        ].join('\n'),
        actionButtonText: '全自動テストを実行して合格を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ctest --verbose',
            'Test #1: test_player_initial_position ......... Passed (0.01 sec)',
            'Test #2: test_player_valid_movement ........... Passed (0.01 sec)',
            'Test #3: test_boundary_protection ............. Passed (0.01 sec)',
            '100% tests passed, 0 tests failed out of 3',
            '🎉 ALL TESTS PASSED! カプセル化による防衛ライン構築完了！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'テストが全部通りました！「誰でも触れる生変数」を「関所付き関数」に変えるだけで、こんなにも頑丈になるんですね！次章の「クラス化（class）」へ進む心の準備ができました！'
        },
        takeaway: 'お見事！L1の中核技術「意図しない変更の遮断」を体得しました。'
      }
    ]
  },

  // L2: 構造体生アクセスと class の private 隠蔽
  'chapter-classic-2-classes-and-files': {
    chapterSlug: 'chapter-classic-2-classes-and-files',
    chapterBadge: 'L2 演習',
    title: 'C言語構造体の改ざんリスクと C++ class の private 隠蔽',
    subtitle: 'struct の全公開フィールドを class と private で塞ぎ、コンパイル時にバグを撲滅する！',
    mentalModel: 'struct (全メンバ公開・改ざん自由) ➔ class (private隠蔽) ➔ コンパイラが不正アクセスを拒絶',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: 'C言語構造体：外部からHPや残機が勝手に書き換えられる',
        instruction: '以下のコードを実行し、外部関数から構造体の内部データが勝手に書き換えられて「残機がマイナス99」になる不正状態を体験してみましょう。',
        codeFilename: 'player_struct_bad.cpp',
        code: [
          '#include <iostream>',
          '',
          '// C言語流の構造体（メンバはすべてpublic）',
          'struct Player {',
          '    int x;',
          '    int y;',
          '    int hp;',
          '    int lives;',
          '};',
          '',
          'void rogueHack(Player* p) {',
          '    // 外部のコードが直接メンバ変数をいじくり倒す！',
          '    p->hp = -999;',
          '    p->lives = -99;',
          '}',
          '',
          'int main() {',
          '    Player p = { 10, 20, 100, 3 };',
          '    rogueHack(&p);',
          '    ',
          '    std::cout << "[STATUS] HP: " << p.hp << ", 残機: " << p.lives << std::endl;',
          '    if (p.hp < 0 || p.lives < 0) {',
          '        std::cout << "💥 [INCONSISTENT] 不正なゲームオーバー状態！データ整合性が崩壊しました！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してデータ破壊を確認する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ g++ player_struct_bad.cpp -o struct_test && ./struct_test',
            '[STATUS] HP: -999, 残機: -99',
            '💥 [INCONSISTENT] 不正なゲームオーバー状態！データ整合性が崩壊しました！',
            'Error: Game state violated invariants.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '構造体だと、どんな外部コードからでも p->hp = -999; って書き込めちゃいますね……！ルールを守るかどうかを「プログラマの善意」に頼るのは危険すぎます！'
        },
        takeaway: '構造体の全公開メンバは「無施錠の金庫」。不正な値の混入をコンパイル時に防ぐ手立てがありません。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'class と private で「金庫に鍵をかける」',
        instruction: 'struct を class に変更し、メンバ変数を private: に配置します。直接代入を試みるとどうなるかコンパイルしてみましょう。',
        codeFilename: 'player_class_private.cpp',
        code: [
          '#include <iostream>',
          '',
          'class Player {',
          'private:',
          '    int m_x;',
          '    int m_y;',
          '    int m_hp;',
          '    int m_lives;',
          '',
          'public:',
          '    Player(int x, int y) : m_x(x), m_y(y), m_hp(100), m_lives(3) {}',
          '',
          '    // 適切な窓口（メソッド）だけを公開',
          '    void takeDamage(int amount) {',
          '        if (amount > 0) {',
          '            m_hp = std::max(0, m_hp - amount);',
          '            if (m_hp == 0 && m_lives > 0) {',
          '                m_lives--;',
          '                m_hp = 100; // 復活',
          '            }',
          '        }',
          '    }',
          '',
          '    int getHp() const { return m_hp; }',
          '    int getLives() const { return m_lives; }',
          '};',
          '',
          'int main() {',
          '    Player p(10, 20);',
          '    // ❌ 不正な直接代入を試みる！',
          '    // p.m_hp = -999;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コンパイルして不正アクセスを阻止する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ g++ player_class_private.cpp -o class_test',
            'player_class_private.cpp: In function \'int main()\':',
            'player_class_private.cpp:33:7: error: \'int Player::m_hp\' is private within this context',
            '   33 |     p.m_hp = -999;',
            '      |       ^~~~',
            '🛑 コンパイル拒絶！コンパイラが不正アクセスを物理的に遮断しました！'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'smug',
          text: '見たか！これぞコンパイラの鉄壁ガードじゃ！private にしたメンバは、外部から1ミリも触ることができん。バグを実行時に出すのではなく、「コンパイルエラー」にして世に出さないのがC++流じゃ！'
        },
        takeaway: 'private はプログラマのミスをコンパイラに叱らせるための強力なセーフティネットです。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'メソッド経由の安全なダメージ処理とライフ管理',
        instruction: '公開メソッド takeDamage() を経由してダメージを与え、HPがゼロになった瞬間に残機が正しく減算・復活するライフサイクルをテストしましょう！',
        codeFilename: 'test_player_lifecycle.cpp',
        code: [
          'int main() {',
          '    Player p(10, 20);',
          '    std::cout << "[INITIAL] HP: " << p.getHp() << ", 残機: " << p.getLives() << std::endl;',
          '    ',
          '    p.takeDamage(40);',
          '    std::cout << "[HIT 40] HP: " << p.getHp() << ", 残機: " << p.getLives() << std::endl;',
          '',
          '    p.takeDamage(100); // 致命傷！残機が1減ってHPが100にリスポーン',
          '    std::cout << "[FATAL HIT] HP: " << p.getHp() << ", 残機: " << p.getLives() << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'ライフサイクルテストを実行する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./lifecycle_test',
            '[INITIAL] HP: 100, 残機: 3',
            '[HIT 40] HP: 60, 残機: 3',
            '[FATAL HIT] HP: 100, 残機: 2 （自動リスポーン成功！）',
            '✨ データ整合性完全保持！カプセル化クラス完成！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'teaching',
          text: 'すごい！HPの減少もリスポーン処理も、すべて Player クラスの中で完結しています。呼び出し側はただ p.takeDamage() を呼ぶだけで、内部の複雑なルールを気にする必要がなくなりました！'
        },
        takeaway: '「データを隠し、振る舞いを公開する」。これこそがカプセル化の本質です。'
      }
    ]
  },

  // M1: 生ポインタの二重解放と std::unique_ptr
  'chapter-modern-1-smart-pointers-raii': {
    chapterSlug: 'chapter-modern-1-smart-pointers-raii',
    chapterBadge: 'M1 演習',
    title: '生ポインタの二重解放（Double Free）と std::unique_ptr（RAII）',
    subtitle: '誰がdeleteするかの押し付け合いによるクラッシュを、唯一の所有権（std::unique_ptr）で完全撲滅！',
    mentalModel: '生deleteの重複 ➔ ダブルフリー即死クラッシュ ➔ std::unique_ptr のスコープ自動解放',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '生ポインタの二重deleteによる惨劇（Double Free）',
        instruction: '複数の関数が生ポインタをdeleteしてしまい、OSのメモリアロケータが激怒して即死クラッシュするコードを実行してみましょう。',
        codeFilename: 'double_free_bad.cpp',
        code: [
          '#include <iostream>',
          '',
          'struct Bullet {',
          '    int damage = 50;',
          '    ~Bullet() { std::cout << "Bullet 消滅" << std::endl; }',
          '};',
          '',
          'void cleanupA(Bullet* b) {',
          '    delete b; // 1回目のdelete',
          '}',
          '',
          'void cleanupB(Bullet* b) {',
          '    delete b; // 2回目のdelete（すでに解放されたメモリを再び解放！）',
          '}',
          '',
          'int main() {',
          '    Bullet* pBullet = new Bullet();',
          '    cleanupA(pBullet);',
          '    cleanupB(pBullet); // 💥 ここで爆発！',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行して二重解放クラッシュを確認する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ g++ double_free_bad.cpp -o double_free && ./double_free',
            'Bullet 消滅',
            'free(): double free detected in tcache 2',
            'Aborted (core dumped) exit code: 134'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ヒャアッ！double free detected でプログラムが強制終了しました！A関数もB関数も「自分が後片付けしなきゃ」と親切心で delete した結果、2回目の delete でメモリ破壊が起きたんですね…！'
        },
        takeaway: '生ポインタの最大の欠陥は「誰が解放の責任（所有権）を持っているか」がコード上で分からないことです。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'std::unique_ptr で「所有者は世界で1人だけ」にする',
        instruction: '生ポインタを std::unique_ptr に置換します。所有権のコピーがコンパイル時に禁止され、不要になった生deleteを抹殺します。',
        codeFilename: 'unique_ptr_safe.cpp',
        code: [
          '#include <iostream>',
          '#include <memory>',
          '',
          'struct Bullet {',
          '    int damage = 50;',
          '    ~Bullet() { std::cout << "🛡️ [RAII] Bullet がスコープ脱出時に自動消滅！" << std::endl; }',
          '};',
          '',
          'int main() {',
          '    // std::make_unique で安全に生成',
          '    auto pBullet = std::make_unique<Bullet>();',
          '    ',
          '    std::cout << "弾の威力: " << pBullet->damage << std::endl;',
          '',
          '    // ❌ コピーを試みるとコンパイルエラー！（所有権の重複を物理遮断）',
          '    // auto pCopy = pBullet; ',
          '',
          '    // ✅ delete は 1行も書かない！',
          '    return 0; // ここでスコープを抜けると自動解放される！',
          '}'
        ].join('\n'),
        actionButtonText: 'std::unique_ptr を適用して実行する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ g++ -std=c++17 unique_ptr_safe.cpp -o unique_test && ./unique_test',
            '弾の威力: 50',
            '🛡️ [RAII] Bullet がスコープ脱出時に自動消滅！',
            '✨ メモリリーク: 0バイト, 二重解放: 0回'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞモダンC++の至宝【RAII（Resource Acquisition Is Initialization）】じゃ！delete という単語自体をコードから永久追放した。スコープを抜ければコンパイラが100%確実に後始末してくれる！'
        },
        takeaway: 'std::unique_ptr を使えば、コピー不可（所有者1人のみ）かつ自動解放となり、二重解放は構造的に発生不能になります。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'Valgrind / ASan によるメモリ完全性テスト',
        instruction: 'AddressSanitizer (ASan) を有効にしてビルド＆テストし、ヒープメモリが完全にノーリークで解放されていることを証明しましょう！',
        codeFilename: 'test_memory_leak.cpp',
        code: [
          '// ASan 検証用メインルーチン',
          'int main() {',
          '    for (int i = 0; i < 1000; ++i) {',
          '        auto b = std::make_unique<Bullet>();',
          '    }',
          '    // 1000個生成してすべて自動解放',
          '    std::cout << "1000発の弾丸の生成＆自動破棄テスト完了" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'AddressSanitizer でメモリ検証を実行する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ g++ -fsanitize=address -g test_memory_leak.cpp -o asan_test && ./asan_test',
            '1000発の弾丸の生成＆自動破棄テスト完了',
            '=================================================================',
            '==12345==AddressSanitizer: 0 errors detected (leak check: OK)',
            '==12345==All heap blocks were freed -- no leaks are possible',
            '🎉 PERFECT SCORE: 生delete撲滅・ゼロリーク・ゼロクラッシュ達成！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'ASan のエラーがゼロ！1000個のオブジェクトが1バイトも漏れずに綺麗サッパリ解放されました！もう delete の書き忘れに怯える夜は来ないんですね！'
        },
        takeaway: 'お見事！M1の中核「スマートポインタによる絶対的所有権管理」をマスターしました。'
      }
    ]
  },

  // M10: 継承爆発と ECS（コンポーネント指向合成）
  'chapter-modern-10-ecs': {
    chapterSlug: 'chapter-modern-10-ecs',
    chapterBadge: 'M10 演習',
    title: '巨大継承ツリーの爆発と ECS（コンポーネント指向合成）',
    subtitle: '多重継承による「菱形継承の地獄」を、部品のアタッチ（Component）による自由な合成へと脱皮させる！',
    mentalModel: '継承ツリー (硬直・多重継承爆発) ➔ 部品化 (Component) ➔ 自由なエンティティ合成',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '継承の罠：「空飛ぶ・火を吹く・潜水するボス」で継承が爆発',
        instruction: '敵のバリエーションを継承だけで増やそうとして、多重継承の衝突とクラスの組み合わせ爆発に直面するコードを確認してみましょう。',
        codeFilename: 'inheritance_explosion.cpp',
        code: [
          '#include <iostream>',
          '',
          'class Entity { public: virtual ~Entity() {} };',
          'class FlyingEntity : public virtual Entity {};',
          'class SwimmingEntity : public virtual Entity {};',
          'class FireBreathingEntity : public virtual Entity {};',
          '',
          '// 💥 新しいボス「空を飛び、水に潜り、火を吹く敵」を作るために3重継承！',
          'class FlyingSwimmingFireBoss : ',
          '    public FlyingEntity, ',
          '    public SwimmingEntity, ',
          '    public FireBreathingEntity ',
          '{',
          '    // クラスの数が 2^N で爆発！',
          '    // 仮想基底クラスのオーバーヘッドと菱形継承の複雑怪奇な初期化が必要に...',
          '};',
          '',
          'int main() {',
          '    std::cout << "FlyingSwimmingFireBoss sizeof: " << sizeof(FlyingSwimmingFireBoss) << " bytes" << std::endl;',
          '    std::cout << "⚠️ vtable ポインタが複数散乱し、キャッシュ効率が最悪です！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '多重継承のサイズと構造を確認する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ g++ inheritance_explosion.cpp -o boss_test && ./boss_test',
            'FlyingSwimmingFireBoss sizeof: 40 bytes',
            '⚠️ vtable ポインタが複数散乱し、キャッシュ効率が最悪です！',
            'Warning: Virtual base class offset table overhead detected.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'sweating',
          text: '敵の能力が増えるたびに Flying...Swimming...Fire... みたいな巨大な派生クラスを無限に作らなきゃいけません！しかも多重継承のせいでメモリ配置が飛び飛びで、ゲームエンジンとして性能が出ません…！'
        },
        takeaway: '「is-a（〜は〜である）」の継承関係で振る舞いを増やそうとすると、クラス数が組み合わせ爆発（2のN乗）を起こします。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '「継承より合成」：ECSコンポーネント化へ切り替える',
        instruction: '能力を小さな構造体（Component）に分解し、Entity に「アタッチ」するだけで何でも作れるECS（Entity Component System）設計を適用します。',
        codeFilename: 'ecs_composition.cpp',
        code: [
          '#include <iostream>',
          '#include <vector>',
          '',
          '// 部品（Component）：純粋なデータ構造体',
          'struct Flyable { float speed = 10.0f; };',
          'struct Swimmable { float depth = 50.0f; };',
          'struct FireBreath { int damage = 999; };',
          '',
          '// 実体（Entity）：ただのIDと部品の入れ物',
          'class Entity {',
          'public:',
          '    Flyable* fly = nullptr;',
          '    Swimmable* swim = nullptr;',
          '    FireBreath* fire = nullptr;',
          '',
          '    void printSkills() {',
          '        std::cout << "【能力チェック】: ";',
          '        if (fly) std::cout << "🦅飛行 ";',
          '        if (swim) std::cout << "🐬潜水 ";',
          '        if (fire) std::cout << "🔥火炎放射 ";',
          '        std::cout << std::endl;',
          '    }',
          '};',
          '',
          'int main() {',
          '    Flyable flyComp;',
          '    FireBreath fireComp;',
          '',
          '    // クラスを新設せず、部品を付けるだけで「空飛ぶ火炎竜」が完成！',
          '    Entity dragon;',
          '    dragon.fly = &flyComp;',
          '    dragon.fire = &fireComp;',
          '    dragon.printSkills();',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'ECSコンポーネント合成を実行する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ g++ -O3 ecs_composition.cpp -o ecs_test && ./ecs_test',
            '【能力チェック】: 🦅飛行 🔥火炎放射 ',
            '✨ クラス新設ゼロ！コード追加わずか3行で新キャラ誕生！'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'smug',
          text: 'ガハハ！これぞ「継承より合成（Composition over Inheritance）」じゃ！新種族のクラスをいちいち定義しなくても、部品の付け替えだけで1億通りのモンスターを即座に生み出せるのじゃ！'
        },
        takeaway: 'ECS（データ指向設計）は、現代のUnity（DOTS）やUnreal Engine（Mass）でも採用される究極のゲームエンジン設計です。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'キャッシュフレンドリーな連続メモリ走査の検証',
        instruction: '10,000体のエンティティをコンポーネント配列で一括更新し、仮想関数のオーバーヘッドなしで超高速にループが完走することを検証しましょう！',
        codeFilename: 'test_ecs_benchmark.cpp',
        code: [
          '// 10,000体のコンポーネント一括更新ベンチマーク',
          'void updateMovement(std::vector<Flyable>& flyers) {',
          '    for (auto& f : flyers) {',
          '        f.speed += 0.1f; // メモリ連続アクセスでL1キャッシュヒット率 99.8%!',
          '    }',
          '}'
        ].join('\n'),
        actionButtonText: '10,000体一括走査ベンチマークを実行する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./ecs_benchmark',
            'Running benchmark on 10,000 entities...',
            'L1 Cache Hit Rate: 99.8%',
            'Execution Time: 0.0021 ms (50倍高速！)',
            '🎉 BENCHMARK PASSED: データ指向ECSアーキテクチャ制覇！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '10,000体の更新がたった 0.002ミリ秒で終わりました！仮想関数テーブル（vtable）のポインタジャンプがないだけで、CPUのキャッシュがこんなに効くんですね！'
        },
        takeaway: 'お見事！M10の神髄「ECSによる設計柔軟性と極限パフォーマンスの両立」を体得しました。'
      }
    ]
  }
};

export function getLabScenario(chapterSlug: string): ChapterLabScenario | undefined {
  return STEP_BY_STEP_LABS[chapterSlug];
}
