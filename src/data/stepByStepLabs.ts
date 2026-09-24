/**
 * 各章に埋め込むステップバイステップ設計演習シナリオデータ
 */

export interface LabStep {
  stepNumber: number;
  totalSteps: number;
  badge: string;
  title: string;
  instruction: string;
  command: string;
  matchKeywords: string[];
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
        instruction: '以下のコードを実行して、グローバル変数 g_player_x がどこからでも勝手に変更されて座標がマイナスに吹き飛ぶバグを再現してみましょう。\n➔ `./spaghetti_bad` と入力（または [Tab] キーで補完）',
        command: './spaghetti_bad',
        matchKeywords: ['spaghetti_bad', './spaghetti_bad', 'game'],
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
          '    if (g_player_x < 0) {',
          '        std::cout << "💥 [CRASH] プレイヤーが画面外へ吹き飛びゲームがフリーズしました！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行して破綻を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./spaghetti_bad',
            '[GAME START] プレイヤー座標: 10',
            '[UPDATE] 敵の更新後... プレイヤー座標: -999',
            '💥 [CRASH] プレイヤーが画面外へ吹き飛びゲームがフリーズしました！',
            'ERROR: g_player_x is -999 (Invalid negative coordinate).'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'わわっ！敵の移動関数 updateEnemy() を呼んだだけなのに、関係ないはずの自機の座標（g_player_x）が勝手に -999 に書き換えられてクラッシュしました！'
        },
        takeaway: 'グローバル変数は「誰でも・どこからでも書き換えられる」ため、プログラムが大きくなると原因不明のバグの温床になります。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '関数によるカプセル化（不正な代入を跳ね返す関所の設置）',
        instruction: '変数を直接触らせず、必ず「関所（関数）」を通す設計コードを確認します。\n➔ `cat spaghetti_guard.cpp` と入力（または [Tab] キーで補完）',
        command: 'cat spaghetti_guard.cpp',
        matchKeywords: ['cat', 'spaghetti_guard', 'guard'],
        codeFilename: 'spaghetti_guard.cpp',
        code: [
          '#include <iostream>',
          '',
          '// 🛡️ 改善：ファイル外から隠蔽（static）',
          'static int s_player_x = 10;',
          '',
          '// 関所（セッター）：不正な値は門前払いする',
          'void movePlayer(int delta_x) {',
          '    int next_x = s_player_x + delta_x;',
          '    if (next_x < 0 || next_x > 800) {',
          '        std::cout << "⚠️ [GUARD] 警告: 画面外（マイナス座標）への移動をブロックしました！" << std::endl;',
          '        return; // 代入を拒絶して自機を守る！',
          '    }',
          '    s_player_x = next_x;',
          '}',
          '',
          'int getPlayerX() { return s_player_x; }'
        ].join('\n'),
        actionButtonText: '関所ガードコードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat spaghetti_guard.cpp',
            '[Static Encapsulation Applied]',
            's_player_x is now hidden inside player module.',
            'Validation guard active: 0 <= next_x <= 800.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'ガハハ！見よ！「変数に直接代入させるな、関数という関所を通せ」――これがオブジェクト指向のカプセル化の第一歩じゃ！不正な値が来ても、関所の if 文で跳ね返せるのだ！'
        },
        takeaway: '関数を経由させることで、「バリデーション（境界チェック）」と「デバッグログ」を一箇所に集約できます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'テストによる自動検証とカプセル化スキルの獲得',
        instruction: 'テストを実行し、あらゆる異常な移動コマンドに対してもプレイヤー座標が安全な範囲に留まることを検証しましょう！\n➔ `./test_player_guard` と入力（または [Tab] キーで補完）',
        command: './test_player_guard',
        matchKeywords: ['test_player_guard', './test_player_guard', 'test'],
        codeFilename: 'test_player_guard.cpp',
        code: [
          '#include <iostream>',
          '// movePlayer(delta_x) のテスト',
          'int main() {',
          '    std::cout << "[TEST 1] 正常移動 (+5)..." << std::endl;',
          '    movePlayer(5);',
          '    std::cout << "プレイヤー座標: " << getPlayerX() << std::endl;',
          '',
          '    std::cout << "[TEST 2] 画面外飛び出し (-100)..." << std::endl;',
          '    movePlayer(-100); // 弾かれるはず！',
          '    std::cout << "プレイヤー座標: " << getPlayerX() << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: カプセル化による防壁が完成しました！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_player_guard',
            '[TEST 1] 正常移動 (+5)...',
            'プレイヤー座標: 15',
            '[TEST 2] 画面外飛び出し (-100)...',
            '⚠️ [GUARD] 警告: 画面外（マイナス座標）への移動をブロックしました！',
            'プレイヤー座標: 15 (安全に保護された！)',
            '🎉 ALL TESTS PASSED: カプセル化による防壁が完成しました！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'テストが全問パスしました！マイナス100に移動しようとしても、関所で弾かれて座標15が守られています！変数を隠すだけでこんなに安心できるんですね！'
        },
        takeaway: 'お見事！L1の核心「データと操作をまとめ、不正な変更を関所で防ぐ」というオブジェクト指向の第一歩を体得しました。'
      }
    ]
  },

  // L2: クラス化とファイル分割（private カプセル化）
  'chapter-classic-2-classes-and-files': {
    chapterSlug: 'chapter-classic-2-classes-and-files',
    chapterBadge: 'L2 演習',
    title: '公開メンバの直接書き換え破綻と class による private 隠蔽',
    subtitle: '誰でも触れる public 構造体の数値を、class と private による鉄壁ガードで守り抜く！',
    mentalModel: 'public 構造体 (外部からHP不正改ざん) ➔ 即死バグ ➔ class + private (コンパイラによるアクセス遮断)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '外部からHPを直接マイナスに改ざんされて即死するバグ',
        instruction: '以下のコードを実行して、外部から p.hp = -999 と直接代入されてゲームオーバーになるバグを再現してみましょう。\n➔ `./bad_game` と入力（または [Tab] キーで補完）',
        command: './bad_game',
        matchKeywords: ['bad_game', './bad_game'],
        codeFilename: 'player_bad_public.cpp',
        code: [
          '#include <iostream>',
          '',
          '// ❌ 危険：すべてのメンバが誰でも書き換え可能な struct',
          'struct BadPlayer {',
          '    int hp = 100;',
          '    int lives = 3;',
          '};',
          '',
          'int main() {',
          '    BadPlayer p;',
          '    std::cout << "初期HP: " << p.hp << std::endl;',
          '    // バグ：外部の処理が誤ってHPに負の数値を代入！',
          '    p.hp = -999;',
          '    std::cout << "改ざん後HP: " << p.hp << std::endl;',
          '    if (p.hp < 0) {',
          '        std::cout << "💥 [BUG] HPが不正な負の値になり、残機処理をすっ飛ばして即死しました！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してHP改ざんを再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./bad_game',
            '初期HP: 100',
            '改ざん後HP: -999',
            '💥 [BUG] HPが不正な負の値になり、残機処理をすっ飛ばして即死しました！',
            'ERROR: BadPlayer::hp is negative (-999).'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '構造体の変数が public だから、外から p.hp = -999 って代入できちゃいました！HPチェックも通らず残機も減らずに即ゲームオーバーです…！'
        },
        takeaway: 'C++の構造体（struct）はデフォルトで公開されるため、重要データを不用意に公開すると外部から不正な状態に破壊されます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'class と private による鉄壁アクセス制御の構築',
        instruction: 'class と private でメンバ変数を閉じ込め、コンパイル時に外部からの直接代入を拒絶するコードをコンパイルしてみましょう。\n➔ `g++ player_class_private.cpp` と入力（または [Tab] キーで補完）',
        command: 'g++ player_class_private.cpp',
        matchKeywords: ['g++', 'private', 'player_class_private'],
        codeFilename: 'player_class_private.cpp',
        code: [
          '#include <iostream>',
          '',
          'class Player {',
          'private:',
          '    int m_hp = 100; // 🛡️ 外部からは1ミリも触らせない！',
          '    int m_lives = 3;',
          'public:',
          '    void takeDamage(int amount) {',
          '        if (amount > 0) m_hp = std::max(0, m_hp - amount);',
          '    }',
          '    int getHp() const { return m_hp; }',
          '};',
          '',
          'int main() {',
          '    Player p;',
          '    p.m_hp = -999; // ❌ コンパイル拒絶！',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コンパイルして不正アクセスを阻止する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ g++ player_class_private.cpp -o class_test',
            "player_class_private.cpp: In function 'int main()':",
            "player_class_private.cpp:15:7: error: 'int Player::m_hp' is private within this context",
            '   15 |     p.m_hp = -999;',
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
        instruction: '公開メソッド takeDamage() を経由してダメージを与え、HPがゼロになった瞬間に残機が正しく減算・復活するライフサイクルをテストしましょう！\n➔ `./test_player_lifecycle` と入力（または [Tab] キーで補完）',
        command: './test_player_lifecycle',
        matchKeywords: ['test_player_lifecycle', './test_player_lifecycle', 'lifecycle'],
        codeFilename: 'test_player_lifecycle.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    Player p;',
          '    std::cout << "通常ダメージ 30 を適用..." << std::endl;',
          '    p.takeDamage(30);',
          '    std::cout << "残りHP: " << p.getHp() << std::endl;',
          '',
          '    std::cout << "大ダメージ 100 を適用 (残機減算テスト)..." << std::endl;',
          '    p.takeDamage(100);',
          '    std::cout << "残り残機: " << p.getLives() << ", 復活後HP: " << p.getHp() << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: private カプセル化による安全なライフサイクル確認！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_player_lifecycle',
            '通常ダメージ 30 を適用...',
            '残りHP: 70',
            '大ダメージ 100 を適用 (残機減算テスト)...',
            '残り残機: 2, 復活後HP: 100',
            '🎉 ALL TESTS PASSED: private カプセル化による安全なライフサイクル確認！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '公開メソッド takeDamage() を通すことで、HPが0になったら自動で残機が減ってHPが100に戻るルールが守られました！外から直接変数をいじらせないから、状態が絶対に狂いません！'
        },
        takeaway: 'お見事！L2の核心「structからclassへの進化、privateによるデータ隠蔽」をマスターしました。'
      }
    ]
  },

  // M1: モダンC++スマートポインタ（unique_ptrによるRAII自動解放）
  'chapter-modern-1-smart-pointers-raii': {
    chapterSlug: 'chapter-modern-1-smart-pointers-raii',
    chapterBadge: 'M1 演習',
    title: '生ポインタ解放漏れ（Memory Leak）と std::unique_ptr による自動RAII',
    subtitle: 'エラーや早期returnでdeleteがスキップされる惨劇を、スマートポインタでゼロにする！',
    mentalModel: 'new/delete手動管理 (早期returnで解放漏れ) ➔ メモリリーク多発 ➔ std::unique_ptr (RAII自動スコープ破棄)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '早期returnのせいでdeleteに辿り着かないメモリリーク',
        instruction: '以下のコードを実行し、敵撃破時に早期returnしたことで delete bullet がスキップされ、メモリが漏れ出る様子を再現してみましょう。\n➔ `./leak_game` と入力（または [Tab] キーで補完）',
        command: './leak_game',
        matchKeywords: ['leak_game', './leak_game', 'leak'],
        codeFilename: 'raw_ptr_leak.cpp',
        code: [
          '#include <iostream>',
          'struct Bullet { int damage = 50; ~Bullet() { std::cout << "Bullet破棄" << std::endl; } };',
          '',
          'void fireBullet(bool hitBoss) {',
          '    Bullet* b = new Bullet(); // ヒープ確保',
          '    if (hitBoss) {',
          '        std::cout << "ボスに直撃！ステージクリア！" << std::endl;',
          '        return; // 💥 危険：delete b を呼ばずに早期return！',
          '    }',
          '    delete b;',
          '}',
          '',
          'int main() {',
          '    fireBullet(true);',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してメモリリークを再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./leak_game',
            'ボスに直撃！ステージクリア！',
            '⚠️ [VALGRIND MEMCHECK]:',
            '==12345== definitely lost: 4 bytes in 1 blocks',
            '==12345== total heap usage: 1 allocs, 0 frees',
            '💥 LEAK DETECTED: Bullet破棄デストラクタが呼ばれていません！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ああっ！ボスに当たって return したせいで、後ろに書いてあった delete b に到達しませんでした！Valgrindに「definitely lost」って警告されてます！'
        },
        takeaway: '手動の new/delete は「早期return」「例外」によって簡単にすり抜けられ、サーバーやゲームをメモリ枯渇死させます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'モダンC++の特効薬：std::unique_ptr による自動RAII化',
        instruction: '生ポインタを std::unique_ptr に置き換え、どこからreturnしても自動的にデストラクタが走るコードを確認します。\n➔ `cat unique_ptr_safe.cpp` と入力（または [Tab] キーで補完）',
        command: 'cat unique_ptr_safe.cpp',
        matchKeywords: ['cat', 'unique_ptr_safe', 'unique_ptr'],
        codeFilename: 'unique_ptr_safe.cpp',
        code: [
          '#include <iostream>',
          '#include <memory> // std::unique_ptr',
          '',
          'struct Bullet { int damage = 50; ~Bullet() { std::cout << "🛡️ [RAII] Bullet がスコープ脱出時に自動消滅！" << std::endl; } };',
          '',
          'void fireBulletModern(bool hitBoss) {',
          '    // ✨ delete不要！スコープを抜けると自動解放される',
          '    auto b = std::make_unique<Bullet>();',
          '    if (hitBoss) {',
          '        std::cout << "ボスに直撃！ステージクリア！" << std::endl;',
          '        return; // 🛡️ ここでreturnしても、bの寿命が尽きて自動delete！',
          '    }',
          '}'
        ].join('\n'),
        actionButtonText: 'std::unique_ptr 導入コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat unique_ptr_safe.cpp',
            '[Modern C++ RAII Refactoring Applied]',
            'std::unique_ptr manages heap lifetime.',
            'Destructor guaranteed to run on any exit path.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞモダンC++の至宝【RAII（Resource Acquisition Is Initialization）】じゃ！delete という単語自体をコードから永久追放した。スコープを抜ければコンパイラが100%確実に後始末してくれる！'
        },
        takeaway: 'std::unique_ptr を使えば、コピー不可（所有者1人のみ）かつ自動解放となり、二重解放・リークは構造的に発生不能になります。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'AddressSanitizer によるメモリ完全性テスト',
        instruction: 'AddressSanitizer (ASan) を有効にしてビルド＆テストし、1,000発の弾丸が完全にノーリークで解放されていることを証明しましょう！\n➔ `./asan_test` と入力（または [Tab] キーで補完）',
        command: './asan_test',
        matchKeywords: ['asan_test', './asan_test', 'asan'],
        codeFilename: 'test_memory_leak.cpp',
        code: [
          '#include <iostream>',
          '#include <memory>',
          'int main() {',
          '    std::cout << "1000発の弾丸を発射・テスト開始..." << std::endl;',
          '    for (int i = 0; i < 1000; ++i) {',
          '        auto b = std::make_unique<Bullet>();',
          '    }',
          '    std::cout << "🎉 ALL 1000 BULLETS FREED: メモリリーク0バイト！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'ASanでメモリ完全性をテストする ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./asan_test',
            '1000発の弾丸を発射・テスト開始...',
            '=================================================================',
            '==12345==AddressSanitizer: 0 errors detected (leak check: OK)',
            '==12345==All heap blocks were freed -- no leaks are possible',
            '🎉 ALL 1000 BULLETS FREED: メモリリーク0バイト！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '「0 errors detected」「All heap blocks were freed」！一行も delete を書いていないのに、1000個全部綺麗に片付いてます！これがモダンC++の威力なんですね！'
        },
        takeaway: 'お見事！M1の核心「スマートポインタによるメモリ管理の自動化」を体得しました。現代のC++開発では必須の作法です。'
      }
    ]
  },

  // M10: モダンC++データ指向ECS設計（極限パフォーマンスと柔軟性）
  'chapter-modern-10-ecs': {
    chapterSlug: 'chapter-modern-10-ecs',
    chapterBadge: 'M10 演習',
    title: '巨大継承ツリーのキャッシュミス破綻とデータ指向ECS',
    subtitle: '仮想関数テーブル（vtable）のポインタジャンプによる低速化を、SoA配列化で50倍高速化！',
    mentalModel: '重厚OOP継承 (ポインタ散在・キャッシュミス多発) ➔ 処理落ち ➔ データ指向ECS (連続メモリ走査で超高速)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '継承＆仮想関数テーブルが引き起こすキャッシュミスの悪夢',
        instruction: '10,000体の敵オブジェクトを従来の重厚OOP（仮想関数ポインタ経由）で一斉更新したときの実行速度を測定してみましょう。\n➔ `./oop_bench` と入力（または [Tab] キーで補完）',
        command: './oop_bench',
        matchKeywords: ['oop_bench', './oop_bench', 'bench'],
        codeFilename: 'heavy_oop.cpp',
        code: [
          '#include <iostream>',
          '#include <vector>',
          'class GameObject { public: virtual void update() = 0; };',
          'class Enemy : public GameObject {',
          '    float x, y, speed;',
          'public:',
          '    void update() override { x += speed; }',
          '};',
          '// メモリ上に10,000個のポインタが散らばっている',
          'std::vector<GameObject*> entities;'
        ].join('\n'),
        actionButtonText: '重厚OOPベンチマークを実行する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ ./oop_bench',
            'Running benchmark on 10,000 entities...',
            'L1 Cache Miss Rate: 42.8% (極めて高い！)',
            'Execution Time: 0.1084 ms',
            '⚠️ WARNING: ポインタ参照とvtableジャンプでCPUがメモリ待ちになっています。'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '10,000回も「仮想関数テーブルの参照」と「あちこちに散らばったポインタの先を見に行く作業」が起きて、CPUのキャッシュミスが40%超えてます…！'
        },
        takeaway: 'OOPのクラス継承ツリーは設計が綺麗な反面、メモリが断片化し、現代の高速CPUのL1/L2キャッシュを活かせません。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'データ指向ECS：コンポーネントを連続メモリに並べる',
        instruction: 'データをメモリ上に一直線に並べ、CPUが一気にキャッシュへ取り込めるECS設計コードを確認します。\n➔ `cat ecs_entities.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat ecs_entities.hpp',
        matchKeywords: ['cat', 'ecs_entities', 'ecs'],
        codeFilename: 'ecs_entities.hpp',
        code: [
          '#include <vector>',
          '// データ（Component）だけを連続したメモリ配列にパッキング',
          'struct PositionComponent { float x, y; };',
          'struct VelocityComponent { float vx, vy; };',
          '',
          'struct MovementSystem {',
          '    void update(std::vector<PositionComponent>& pos, const std::vector<VelocityComponent>& vel) {',
          '        // ポインタも仮想関数もゼロ！メモリが連続しているため超高速！',
          '        for (size_t i = 0; i < pos.size(); ++i) {',
          '            pos[i].x += vel[i].vx;',
          '            pos[i].y += vel[i].vy;',
          '        }',
          '    }',
          '};'
        ].join('\n'),
        actionButtonText: 'データ指向ECSコードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat ecs_entities.hpp',
            '[Data-Oriented ECS Architecture Applied]',
            'Continuous array memory layout.',
            'Zero virtual table lookups, 100% cache friendly.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞ現代のゲームエンジン（Unreal EngineのMassやUnityのDOTS）の標準思想！オブジェクト指向を捨て「データを直線配列に並べる」ことで、CPUが次のデータを先読み（プリフェッチ）できるんだ。'
        },
        takeaway: 'ECS（Entity Component System）は「データと振る舞いを分離」し、ハードウェアの性能を100%引き出す究極のアーキテクチャです。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'ベンチマーク実行：L1キャッシュミス激減＆50倍高速化',
        instruction: '修正後のECSコードで10,000体一括走査ベンチマークを実行し、キャッシュヒット率99%以上と圧倒的な高速化を検証します。\n➔ `./ecs_benchmark` と入力（または [Tab] キーで補完）',
        command: './ecs_benchmark',
        matchKeywords: ['ecs_benchmark', './ecs_benchmark'],
        codeFilename: 'ecs_benchmark_main.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    constexpr size_t COUNT = 10000;',
          '    std::vector<PositionComponent> positions(COUNT);',
          '    std::vector<VelocityComponent> velocities(COUNT);',
          '    MovementSystem system;',
          '    system.update(positions, velocities);',
          '    std::cout << "🎉 BENCHMARK PASSED: データ指向ECSアーキテクチャ制覇！" << std::endl;',
          '    return 0;',
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
  },

  // C3: オブジェクトプールと寿命管理
  'chapter-classic-3-dynamic-lifecycle': {
    chapterSlug: 'chapter-classic-3-dynamic-lifecycle',
    chapterBadge: 'C3 演習',
    title: '撃破パーティクルの動的確保（malloc/new）破綻と静的オブジェクトプール',
    subtitle: '毎フレームのヒープ確保による断片化と解放漏れを、固定長配列スロット再利用で完全撲滅！',
    mentalModel: '撃破エフェクト毎に new ➔ メモリリーク・断片化で突然のフレーム落ち ➔ 静的オブジェクトプール（mallocゼロで爆速再利用）',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '撃破火花の乱発でヒープが枯渇しクラッシュする瞬間',
        instruction: '以下のコードを実行し、敵撃破時に毎フレーム new Particle() を乱発してヒープが断片化・枯渇するバグを再現してみましょう。\n➔ `./particle_leak` と入力（または [Tab] キーで補完）',
        command: './particle_leak',
        matchKeywords: ['particle_leak', './particle_leak', 'leak'],
        codeFilename: 'particle_raw_new.cpp',
        code: [
          '#include <iostream>',
          'struct Particle { float x, y, vx, vy; int life; };',
          '',
          'void onEnemyKilled(int enemyX, int enemyY) {',
          '    std::cout << "[EVENT] 敵撃破！火花パーティクルを20個ヒープ生成..." << std::endl;',
          '    for (int i = 0; i < 20; ++i) {',
          '        // 💥 危険：リアルタイム描画ループ内で malloc/new を乱発！',
          '        Particle* p = new Particle{ (float)enemyX, (float)enemyY, 1.0f, -1.0f, 30 };',
          '        // delete p のタイミングが散逸し、メモリリークと断片化を引き起こす！',
          '    }',
          '}',
          '',
          'int main() {',
          '    for (int frame = 0; frame < 60; ++frame) {',
          '        onEnemyKilled(10, 5);',
          '    }',
          '    std::cout << "💥 [CRASH] メモリ断片化によりヒープ確保に失敗 (std::bad_alloc) しました！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してヒープ枯渇を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./particle_leak',
            '[EVENT] 敵撃破！火花パーティクルを20個ヒープ生成...',
            '⚠️ [HEAP WARNING] 60FPSで毎秒1,200個の new/delete が発生！',
            '💥 [CRASH] メモリ断片化によりヒープ確保に失敗 (std::bad_alloc) しました！',
            'ERROR: Heap allocation failed in tight game loop.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ひええっ！敵を倒したときの火花を new Particle() でポンポン作っていたら、メモリ断片化と解放漏れで std::bad_alloc が出てゲームが落ちました！'
        },
        takeaway: 'リアルタイムシステムや組込み・ゲーム開発では、毎フレームの更新処理内で動的メモリ（malloc/new）を呼ぶのは絶対禁忌です。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '静的オブジェクトプールによるゼロアロケーション化',
        instruction: '固定長配列であらかじめメモリを確保し、activeフラグでスロットを再利用するプール設計コードを確認します。\n➔ `cat particle_pool.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat particle_pool.hpp',
        matchKeywords: ['cat', 'particle_pool', 'pool'],
        codeFilename: 'particle_pool.hpp',
        code: [
          '#include <iostream>',
          '',
          'class ParticlePool {',
          'public:',
          '    static const int MAX_PARTICLES = 64;',
          '    struct Particle {',
          '        float x, y, vx, vy;',
          '        int life;',
          '        bool active;',
          '    };',
          '',
          'private:',
          '    // 🛡️ 静的領域に固定長配列を事前確保（ヒープ確保ゼロ！）',
          '    Particle m_pool[MAX_PARTICLES];',
          '',
          'public:',
          '    ParticlePool() {',
          '        for (int i = 0; i < MAX_PARTICLES; ++i) m_pool[i].active = false;',
          '    }',
          '',
          '    void spawn(float x, float y, float vx, float vy, int life) {',
          '        for (int i = 0; i < MAX_PARTICLES; ++i) {',
          '            if (!m_pool[i].active) { // 空きスロットを再利用！',
          '                m_pool[i] = { x, y, vx, vy, life, true };',
          '                return;',
          '            }',
          '        }',
          '        // プール満杯時は安全にスキップ（絶対にクラッシュさせない）',
          '    }',
          '};'
        ].join('\n'),
        actionButtonText: '静的オブジェクトプール設計を確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat particle_pool.hpp',
            '[Static Object Pool Architecture Applied]',
            'Pre-allocated 64 particle slots in fixed memory.',
            'Zero malloc/new at runtime. O(1) slot recycling.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞレガシー現場の黄金律【静的オブジェクトプール】じゃ！起動時に64個分の配列を用意しておき、死んだスロットを使い回す。ヒープへの問い合わせが0回になるから、断片化もリークも原理的に起こり得ん！'
        },
        takeaway: '静的プールを使えば、実行時のメモリ確保コストは完全にゼロ（O(1)）になり、決定論的な安定動作が保証されます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '1万回エフェクト連続発生ベンチマークテスト',
        instruction: 'プール化された火花エフェクトで10,000回の連続発生テストを行い、malloc呼び出し回数0回＆リーク0バイトを検証しましょう！\n➔ `./test_pool_benchmark` と入力（または [Tab] キーで補完）',
        command: './test_pool_benchmark',
        matchKeywords: ['test_pool_benchmark', './test_pool_benchmark', 'benchmark'],
        codeFilename: 'test_particle_pool.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    ParticlePool pool;',
          '    std::cout << "[TEST] 10,000回の火花エフェクト発生＆自動再利用サイクルを実行..." << std::endl;',
          '    for (int i = 0; i < 10000; ++i) {',
          '        pool.spawn(10.0f, 5.0f, 1.0f, -1.0f, 20);',
          '    }',
          '    std::cout << "動的メモリ確保回数: 0 回 (完全ゼロアロケーション)" << std::endl;',
          '    std::cout << "メモリリーク: 0 bytes" << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: 静的オブジェクトプールによる安定稼働を証明！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'ベンチマークを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_pool_benchmark',
            '[TEST] 10,000回の火花エフェクト発生＆自動再利用サイクルを実行...',
            '動的メモリ確保回数: 0 回 (完全ゼロアロケーション)',
            'メモリリーク: 0 bytes',
            '🎉 ALL TESTS PASSED: 静的オブジェクトプールによる安定稼働を証明！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '1万回火花を出しても、malloc呼び出し回数が0回！ヒープを一切使っていないから、メモリリークの心配が完全に消えました！'
        },
        takeaway: 'お見事！C3の核心「静的オブジェクトプールによるヒープ断片化の撲滅とゼロアロケーション設計」をマスターしました。'
      }
    ]
  },

  // C4: 継承とポリモーフィズム
  'chapter-classic-4-inheritance-polymorphism': {
    chapterSlug: 'chapter-classic-4-inheritance-polymorphism',
    chapterBadge: 'C4 演習',
    title: '巨大 switch-case 分岐の破綻と多態性（ポリモーフィズム）による抽象化',
    subtitle: '敵の種類が増えるたびにコード全体を書き換える地獄を、抽象基底クラスと純粋仮想関数で解決！',
    mentalModel: 'switch (enemy.type) 分岐 (敵追加のたび全箇所修正・抜け漏れ) ➔ バグ多発 ➔ 抽象基底クラス Enemy + 仮想関数 (1行で一括更新)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '新敵追加で switch 文に書き漏らしが発生してバグる瞬間',
        instruction: '以下のコードを実行し、敵の種類を判定する switch-case に UFO の分岐を書き忘れて敵が静止するバグを再現してみましょう。\n➔ `./switch_nightmare` と入力（または [Tab] キーで補完）',
        command: './switch_nightmare',
        matchKeywords: ['switch_nightmare', './switch_nightmare', 'switch'],
        codeFilename: 'enemy_switch_bad.cpp',
        code: [
          '#include <iostream>',
          'enum EnemyType { NORMAL, SHIELD, UFO };',
          '',
          'struct BadEnemy {',
          '    EnemyType type;',
          '    int x, y;',
          '};',
          '',
          'void updateEnemy(BadEnemy& e) {',
          '    // ❌ 危険：敵の種類ごとに switch 文で分岐',
          '    switch (e.type) {',
          '        case NORMAL: e.x += 2; break;',
          '        case SHIELD: e.x += 1; break;',
          '        // ⚠️ バグ：UFO のケースを書き忘れた！',
          '        default: break;',
          '    }',
          '}',
          '',
          'int main() {',
          '    BadEnemy ufo{ UFO, 0, 10 };',
          '    std::cout << "[SPAWN] ボーナス敵(UFO) を配置... 初期X: " << ufo.x << std::endl;',
          '    updateEnemy(ufo);',
          '    std::cout << "[UPDATE] 更新後X: " << ufo.x << std::endl;',
          '    if (ufo.x == 0) {',
          '        std::cout << "⚠️ [BUG DETECTED] switch文に case UFO が無く、UFOが画面端でフリーズしています！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してswitch分岐バグを再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./switch_nightmare',
            '[SPAWN] ボーナス敵(UFO) を配置... 初期X: 0',
            '[UPDATE] 更新後X: 0',
            '⚠️ [BUG DETECTED] switch文に case UFO が無く、UFOが画面端でフリーズしています！',
            'ERROR: EnemyType::UFO is unhandled in updateEnemy().'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '新しい敵「UFO」を追加したのに、プログラムのあちこちにある switch 文の1箇所に case UFO を書き忘れたせいで、UFOがピクリとも動きません…！'
        },
        takeaway: '型分岐のための switch 文は、新種を追加するたびに全ファイルを修正しなければならず、修正漏れバグの温床になります。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '抽象基底クラス Enemy と純粋仮想関数による多態化',
        instruction: '抽象基底クラス Enemy と仮想関数テーブル（vtable）を用いて、switch文を消滅させる設計コードを確認します。\n➔ `cat enemy_polymorphism.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat enemy_polymorphism.hpp',
        matchKeywords: ['cat', 'enemy_polymorphism', 'poly'],
        codeFilename: 'enemy_polymorphism.hpp',
        code: [
          '#include <iostream>',
          '',
          '// 🛡️ 抽象基底クラス：全種類の敵が満たすべき契約',
          'class Enemy {',
          'protected:',
          '    int m_x, m_y;',
          'public:',
          '    Enemy(int x, int y) : m_x(x), m_y(y) {}',
          '    virtual ~Enemy() {} // 仮想デストラクタ（派生クラスの安全破棄）',
          '    virtual void update() = 0; // 純粋仮想関数',
          '    int getX() const { return m_x; }',
          '};',
          '',
          'class NormalEnemy : public Enemy {',
          'public:',
          '    NormalEnemy(int x, int y) : Enemy(x, y) {}',
          '    void update() override { m_x += 2; std::cout << "👾 通常敵: 横移動 (X=" << m_x << ")\\n"; }',
          '};',
          '',
          'class UfoEnemy : public Enemy {',
          'public:',
          '    UfoEnemy(int x, int y) : Enemy(x, y) {}',
          '    void update() override { m_x += 5; std::cout << "🛸 UFO敵: 上空を高速移動 (X=" << m_x << ")\\n"; }',
          '};'
        ].join('\n'),
        actionButtonText: 'ポリモーフィズム設計コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat enemy_polymorphism.hpp',
            '[Polymorphic Architecture Applied]',
            'Abstract base class: Enemy with pure virtual update()',
            'Virtual destructor ~Enemy() declared.',
            'Derived: NormalEnemy, UfoEnemy.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞオブジェクト指向の王道【ポリモーフィズム（多態性）】じゃ！基底クラス Enemy に純粋仮想関数（= 0）を定義し、個別の振る舞いは各クラスに閉じ込める。呼び出し側は switch 文を書く必要が一切なくなるのじゃ！'
        },
        takeaway: '仮想関数テーブル（vtable）により、コンパイラが実行時に適切な派生クラスの関数を自動解決してくれます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '統一インターフェースによる多態的ゲームループ実行',
        instruction: 'std::vector<Enemy*> に通常敵とUFOを詰め込み、たった1行のループでそれぞれが自律行動することを証明しましょう！\n➔ `./test_polymorphism` と入力（または [Tab] キーで補完）',
        command: './test_polymorphism',
        matchKeywords: ['test_polymorphism', './test_polymorphism'],
        codeFilename: 'test_enemy_loop.cpp',
        code: [
          '#include <iostream>',
          '#include <vector>',
          'int main() {',
          '    std::vector<Enemy*> enemies;',
          '    enemies.push_back(new NormalEnemy(10, 20));',
          '    enemies.push_back(new UfoEnemy(0, 5));',
          '',
          '    std::cout << "[TEST] 統一ポインタで一括更新実行..." << std::endl;',
          '    for (Enemy* e : enemies) {',
          '        e->update(); // ✨ switch文ゼロ！多態的に解決される！',
          '    }',
          '    for (Enemy* e : enemies) delete e;',
          '    std::cout << "🎉 ALL TESTS PASSED: switch文0個で全種類の敵が自律行動しました！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '多態的ループを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_polymorphism',
            '[TEST] 統一ポインタで一括更新実行...',
            '👾 通常敵: 横移動 (X=12)',
            '🛸 UFO敵: 上空を高速移動 (X=5)',
            '🎉 ALL TESTS PASSED: switch文0個で全種類の敵が自律行動しました！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'switch文が1個もないのに、たった1行の「e->update();」で通常敵もUFOもそれぞれの動きをしてくれました！これなら新キャラを何百体増やしてもゲームループは1行も直さなくて済みます！'
        },
        takeaway: 'お見事！C4の神髄「継承とポリモーフィズムによるswitch文の根絶と開放閉鎖原則（OCP）」を完全に体得しました。'
      }
    ]
  },

  // C5: ゲームデザインパターン（Stateパターン）
  'chapter-classic-5-design-patterns': {
    chapterSlug: 'chapter-classic-5-design-patterns',
    chapterBadge: 'C5 演習',
    title: '状態フラグスパゲティの破綻と State パターンによるシーン遷移',
    subtitle: 'isTitle, isPlaying, isPaused, isGameOver のフラグ交錯を、状態カプセル化で解決！',
    mentalModel: 'boolフラグだらけの巨大if文 ➔ 状態が混ざる不正遷移バグ ➔ Stateパターン (状態ごとのクラスに責任を分離)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '複数フラグの矛盾でポーズ中に自機が動いて死ぬバグ',
        instruction: '以下のコードを実行し、複数のboolフラグ管理が破綻してポーズ中にゲームオーバー音が鳴るバグを再現してみましょう。\n➔ `./bad_state_flags` と入力（または [Tab] キーで補完）',
        command: './bad_state_flags',
        matchKeywords: ['bad_state_flags', './bad_state_flags', 'flags'],
        codeFilename: 'state_spaghetti_flags.cpp',
        code: [
          '#include <iostream>',
          '// ❌ 危険：複数の状態フラグがバラバラに散在',
          'bool g_isPlaying = true;',
          'bool g_isPaused = false;',
          'bool g_isGameOver = false;',
          '',
          'void handleInput(char key) {',
          '    if (key == \'p\') g_isPaused = !g_isPaused;',
          '    if (key == \'k\') g_isGameOver = true; // 被弾',
          '}',
          '',
          'void updateGame() {',
          '    // フラグの組み合わせチェックが漏れて不正動作！',
          '    if (g_isPlaying && !g_isPaused) {',
          '        std::cout << "ゲームプレイ更新中..." << std::endl;',
          '    }',
          '    if (g_isGameOver && g_isPaused) {',
          '        std::cout << "💥 [STATE CONFLICT] ポーズ中なのに裏で被弾してゲームオーバーになりました！" << std::endl;',
          '    }',
          '}',
          '',
          'int main() {',
          '    handleInput(\'p\'); // ポーズ',
          '    handleInput(\'k\'); // 被弾イベントが侵入',
          '    updateGame();',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行して状態フラグの破綻を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./bad_state_flags',
            '💥 [STATE CONFLICT] ポーズ中なのに裏で被弾してゲームオーバーになりました！',
            'ERROR: Inconsistent game state (isPaused=true && isGameOver=true).'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'bool isPaused と bool isGameOver が両方 true になってしまい、ポーズ画面なのに裏で敵が動いて自機が死ぬ怪奇現象が起きました…！フラグが増えすぎて制御不能です！'
        },
        takeaway: '複数のboolフラグでゲーム状態を管理すると、「あり得ない組み合わせ」が発生して深刻なバグを引き起こします。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'State パターンによる状態オブジェクトのカプセル化',
        instruction: '「状態」を1つのクラスとして定義し、常に現在の状態オブジェクトが1つだけ存在する設計コードを確認します。\n➔ `cat game_state_pattern.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat game_state_pattern.hpp',
        matchKeywords: ['cat', 'game_state_pattern', 'state'],
        codeFilename: 'game_state_pattern.hpp',
        code: [
          '#include <iostream>',
          'class GameContext;',
          '',
          '// 🛡️ 状態の共通インターフェース',
          'class GameState {',
          'public:',
          '    virtual ~GameState() {}',
          '    virtual void handleInput(GameContext& ctx, char key) = 0;',
          '    virtual void update(GameContext& ctx) = 0;',
          '};',
          '',
          '// コンテキスト（現在の状態を保持する持ち主）',
          'class GameContext {',
          'private:',
          '    GameState* m_state;',
          'public:',
          '    GameContext(GameState* initial) : m_state(initial) {}',
          '    ~GameContext() { delete m_state; }',
          '    void changeState(GameState* newState) {',
          '        delete m_state;',
          '        m_state = newState;',
          '    }',
          '    void handleInput(char key) { m_state->handleInput(*this, key); }',
          '    void update() { m_state->update(*this); }',
          '};'
        ].join('\n'),
        actionButtonText: 'State パターン設計コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat game_state_pattern.hpp',
            '[State Pattern Architecture Applied]',
            'Interface: GameState',
            'Context manages current active state exclusively.',
            'Transitions cleanly handled via changeState().'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞGoFの精髄【State（状態）パターン】じゃ！「現在どの状態か」を独立したクラスとして実体化し、状態ごとの入力をカプセル化する。状態は常に1つしか存在し得ないため、フラグの矛盾が原理的に起きん！'
        },
        takeaway: 'Stateパターンを適用することで、状態ごとの振る舞いが1つのクラスにまとまり、遷移ロジックが極めて明快になります。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: 'Title ➔ Playing ➔ GameOver のクリーンな状態遷移テスト',
        instruction: '状態遷移テストを実行し、各状態が完全に独立して安全にシーン遷移することを証明しましょう！\n➔ `./test_state_machine` と入力（または [Tab] キーで補完）',
        command: './test_state_machine',
        matchKeywords: ['test_state_machine', './test_state_machine', 'state'],
        codeFilename: 'test_state_transition.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    std::cout << "[SCENE] TitleState ➔ [Spaceキー] ➔ PlayingState に遷移" << std::endl;',
          '    std::cout << "[SCENE] PlayingState ➔ [Pキー] ➔ PausedState に遷移 (ゲーム更新停止)" << std::endl;',
          '    std::cout << "[SCENE] PausedState ➔ [Pキー] ➔ PlayingState に安全復帰" << std::endl;',
          '    std::cout << "[SCENE] PlayingState ➔ [残機0] ➔ GameOverState に遷移" << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: Stateパターンによるクリーンな状態遷移を確認！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '状態機械テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_state_machine',
            '[SCENE] TitleState ➔ [Spaceキー] ➔ PlayingState に遷移',
            '[SCENE] PlayingState ➔ [Pキー] ➔ PausedState に遷移 (ゲーム更新停止)',
            '[SCENE] PausedState ➔ [Pキー] ➔ PlayingState に安全復帰',
            '[SCENE] PlayingState ➔ [残機0] ➔ GameOverState に遷移',
            '🎉 ALL TESTS PASSED: Stateパターンによるクリーンな状態遷移を確認！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'Title ➔ Playing ➔ Pause ➔ GameOver と綺麗に遷移して、お互いの状態が絶対に混ざりません！ゲームの骨組みが一気にプロっぽくなりました！'
        },
        takeaway: 'お見事！C5の核心「Stateパターンによる状態管理の疎結合化とアーキテクチャの確立」をマスターしました。'
      }
    ]
  },

  // C6: 演算子オーバーロード
  'chapter-classic-6-operator-overload': {
    chapterSlug: 'chapter-classic-6-operator-overload',
    chapterBadge: 'C6 演習',
    title: 'C言語流ポインタ関数演算の破綻と operator+ による数学的ベクトル',
    subtitle: 'Vec2_Add(&pos, &vel, &out) のネスト地獄を、自然な数学演算子（pos += vel * dt）へ昇華！',
    mentalModel: 'C言語関数ポインタ渡し (Vec2_Add(&a, &b, &c)) ➔ 引数間違い・ネスト難解 ➔ 演算子オーバーロード (a + b)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: 'ポインタ引数の取り違えで弾丸の座標が吹き飛ぶバグ',
        instruction: '以下のコードを実行し、C言語スタイルの構造体ポインタ関数で引数を渡し間違えて座標が狂うバグを再現してみましょう。\n➔ `./c_vector_bug` と入力（または [Tab] キーで補完）',
        command: './c_vector_bug',
        matchKeywords: ['c_vector_bug', './c_vector_bug', 'c_vector'],
        codeFilename: 'c_vector_calc.cpp',
        code: [
          '#include <iostream>',
          'struct C_Vec2 { float x, y; };',
          '',
          '// C言語流：ポインタで受け渡しする加算関数',
          'void Vec2_Add(const C_Vec2* a, const C_Vec2* b, C_Vec2* out) {',
          '    out->x = a->x + b->x;',
          '    out->y = a->y + b->y;',
          '}',
          '',
          'int main() {',
          '    C_Vec2 pos{ 10.0f, 50.0f };',
          '    C_Vec2 vel{ 2.0f, -5.0f };',
          '    C_Vec2 result{ 0, 0 };',
          '',
          '    // ❌ 危険：第1引数と第3引数のポインタを取り違えた！',
          '    Vec2_Add(&result, &vel, &pos);',
          '    std::cout << "更新後座標: (" << pos.x << ", " << pos.y << ")" << std::endl;',
          '    if (pos.x == 2.0f && pos.y == -5.0f) {',
          '        std::cout << "⚠️ [ARG MISMATCH] 元の座標 (10, 50) が速度で上書きされて吹き飛びました！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行して引数取り違えバグを再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./c_vector_bug',
            '更新後座標: (2, -5)',
            '⚠️ [ARG MISMATCH] 元の座標 (10, 50) が速度で上書きされて吹き飛びました！',
            'ERROR: Wrong pointer passed to Vec2_Add (position reset).'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '関数の第1引数と第3引数のポインタを取り違えて、自機の位置に速度が上書きされて座標が吹っ飛びました！関数呼び出しだらけで数式が全然読めません！'
        },
        takeaway: 'C言語スタイルの構造体ポインタ関数は、引数の順番間違いを起こしやすく、数式が入れ子になると可読性が破壊されます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'C++演算子オーバーロードによる直感的ベクトルクラス',
        instruction: 'operator+ や operator+= をオーバーロードし、数学の公式そのまま記述できる Vec2 クラスを確認します。\n➔ `cat vector2d_operators.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat vector2d_operators.hpp',
        matchKeywords: ['cat', 'vector2d_operators', 'vector2d'],
        codeFilename: 'vector2d_operators.hpp',
        code: [
          '#include <iostream>',
          '',
          'struct Vec2 {',
          '    float x, y;',
          '    Vec2(float x = 0, float y = 0) : x(x), y(y) {}',
          '',
          '    // 🛡️ 演算子オーバーロード（operator+）',
          '    Vec2 operator+(const Vec2& rhs) const {',
          '        return Vec2(x + rhs.x, y + rhs.y);',
          '    }',
          '',
          '    // 複合代入演算子（operator+=）高速インプレース更新',
          '    Vec2& operator+=(const Vec2& rhs) {',
          '        x += rhs.x; y += rhs.y;',
          '        return *this;',
          '    }',
          '',
          '    // スカラー乗算（operator*）速度ベクトルの倍率計算',
          '    Vec2 operator*(float scalar) const {',
          '        return Vec2(x * scalar, y * scalar);',
          '    }',
          '};'
        ].join('\n'),
        actionButtonText: '演算子オーバーロード設計コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat vector2d_operators.hpp',
            '[Operator Overload Architecture Applied]',
            'operator+(const Vec2&) const -> creates new vector',
            'operator+=(const Vec2&) -> in-place modification (fast)',
            'operator*(float) -> scalar scaling'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞC++の真骨頂【演算子オーバーロード】じゃ！ユーザー定義型であっても、組み込みの int や float と全く同じ「+」や「*」で直感的に計算できるようにする。数式そのまま記述できるからバグが激減するぞ！'
        },
        takeaway: '演算子オーバーロードは、自然な数学的表現を提供し、引数取り違えバグを撲滅する強力な武器です。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '自然な数式による弾丸の軌道計算テスト',
        instruction: '「pos += vel * dt;」という物理公式通りのコードを実行し、着弾座標が正確に計算されることを証明しましょう！\n➔ `./test_vector_math` と入力（または [Tab] キーで補完）',
        command: './test_vector_math',
        matchKeywords: ['test_vector_math', './test_vector_math', 'math'],
        codeFilename: 'test_bullet_trajectory.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    Vec2 pos(10.0f, 50.0f);',
          '    Vec2 vel(2.0f, -5.0f);',
          '    float dt = 2.0f;',
          '',
          '    std::cout << "[CALC] 初期位置: (" << pos.x << ", " << pos.y << ")" << std::endl;',
          '    // ✨ 高校の物理の教科書通りに記述可能！',
          '    pos += vel * dt;',
          '    std::cout << "[UPDATE] 着弾位置: (" << pos.x << ", " << pos.y << ")" << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: 演算子オーバーロードによる直感的弾道計算を確認！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '弾道計算テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_vector_math',
            '[CALC] 初期位置: (10, 50)',
            '[UPDATE] 着弾位置: (14, 40)',
            '🎉 ALL TESTS PASSED: 演算子オーバーロードによる直感的弾道計算を確認！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '「pos += vel * dt;」って高校の物理の公式そのまんま書けました！関数呼び出しがないから読みやすくて、引数の渡し間違いも絶対に起きません！'
        },
        takeaway: 'お見事！C6の核心「演算子オーバーロードと値オブジェクト設計による直感的コード記述」を体得しました。'
      }
    ]
  },

  // C7: ポインタ演算とメモリアライメント
  'chapter-classic-7-pointer-alignment-endian': {
    chapterSlug: 'chapter-classic-7-pointer-alignment-endian',
    chapterBadge: 'C7 演習',
    title: '構造体直接ダンプのパディング破綻とアライメント安全なバイナリ保存',
    subtitle: '異なるOSでセーブデータが破損する怪奇現象を、固定幅型と手動パックで解決！',
    mentalModel: '構造体丸ごと生fwrite ➔ コンパイラによるパディング挿入でサイズ肥大化・他環境で破損 ➔ 固定幅型と明示的シリアライズ',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '構造体直接ダンプでパディングによりセーブデータが化ける瞬間',
        instruction: '以下のコードを実行し、sizeof(char + int + short) が 7 ではなく 12バイトになってデータが壊れる現象を再現してみましょう。\n➔ `./dump_corrupt` と入力（または [Tab] キーで補完）',
        command: './dump_corrupt',
        matchKeywords: ['dump_corrupt', './dump_corrupt', 'dump'],
        codeFilename: 'bad_struct_dump.cpp',
        code: [
          '#include <iostream>',
          '// ❌ 危険：アライメントパディングを考慮しない構造体',
          'struct BadSaveData {',
          '    char rank;    // 1バイト',
          '    // ⚠️ ここに3バイトの未定義ゴミ（パディング）が挿入される！',
          '    int score;    // 4バイト',
          '    short stage;  // 2バイト',
          '    // ⚠️ 末尾にも2バイトのパディングが挿入される！',
          '};',
          '',
          'int main() {',
          '    BadSaveData data{ \'S\', 95000, 5 };',
          '    std::cout << "論理上のサイズ: 1 + 4 + 2 = 7 バイト" << std::endl;',
          '    std::cout << "実際の sizeof:  " << sizeof(BadSaveData) << " バイト！" << std::endl;',
          '    if (sizeof(BadSaveData) != 7) {',
          '        std::cout << "⚠️ [ALIGNMENT TRAP] 5バイトのゴミ（パディング）が混入し、他OSで読むとスコアが破壊されます！" << std::endl;',
          '    }',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してパディング破損を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./dump_corrupt',
            '論理上のサイズ: 1 + 4 + 2 = 7 バイト',
            '実際の sizeof:  12 バイト！',
            '⚠️ [ALIGNMENT TRAP] 5バイトのゴミ（パディング）が混入し、他OSで読むとスコアが破壊されます！',
            'ERROR: Binary save format is non-portable across compilers/architectures.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ええっ！1バイトと4バイトと2バイトを足したら7バイトのはずなのに、sizeof が12バイトになってます！勝手に隙間にゴミが入ってデータがズレてます！'
        },
        takeaway: 'CPUはメモリアクセスを高速化するために境界整列（アライメント）を行うため、構造体をそのままファイルに書き出すと移植性が失われます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '固定幅整数とオフセット計算による安全なシリアライズ',
        instruction: 'uint8_t, uint32_t, uint16_t を使い、バイト列へ隙間なく明示的にパッキングする設計コードを確認します。\n➔ `cat safe_serializer.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat safe_serializer.hpp',
        matchKeywords: ['cat', 'safe_serializer', 'safe'],
        codeFilename: 'safe_serializer.hpp',
        code: [
          '#include <iostream>',
          '#include <cstdint>',
          '#include <cstring>',
          '',
          'class SafeSaveSerializer {',
          'public:',
          '    // 🛡️ 隙間なく7バイト固定バッファに書き込む',
          '    static void serialize(uint8_t rank, uint32_t score, uint16_t stage, uint8_t* outBuf) {',
          '        outBuf[0] = rank;                                 // 1バイト目 (0..1)',
          '        std::memcpy(outBuf + 1, &score, sizeof(score));   // 2〜5バイト目 (1..5)',
          '        std::memcpy(outBuf + 5, &stage, sizeof(stage));   // 6〜7バイト目 (5..7)',
          '    }',
          '',
          '    static void deserialize(const uint8_t* inBuf, uint8_t& outRank, uint32_t& outScore, uint16_t& outStage) {',
          '        outRank = inBuf[0];',
          '        std::memcpy(&outScore, inBuf + 1, sizeof(outScore));',
          '        std::memcpy(&outStage, inBuf + 5, sizeof(outStage));',
          '    }',
          '};'
        ].join('\n'),
        actionButtonText: '安全なバイナリシリアライザを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat safe_serializer.hpp',
            '[Portable Binary Serializer Applied]',
            'Fixed 7-byte buffer layout with zero padding.',
            'Uses explicit offsets and memcpy for endian-safe deserialization.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞ現場のセーブデータ設計じゃ！構造体の丸投げを廃止し、バイト配列に1つずつ明示的にオフセット書き込みする。これならSwitch、PS5、PC、iOSのどこで読み書きしても絶対に1ビットも狂わん！'
        },
        takeaway: 'バイナリ保存・ネットワーク通信では、固定幅型（<cstdint>）と明示的なバイトパッキングが絶対の鉄則です。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '7バイト完全一致セーブ＆ロード復元テスト',
        instruction: '隙間ゼロの7バイト形式で保存と復元を実行し、データが寸分違わず復元されることを証明しましょう！\n➔ `./test_save_load` と入力（または [Tab] キーで補完）',
        command: './test_save_load',
        matchKeywords: ['test_save_load', './test_save_load', 'save'],
        codeFilename: 'test_save_verification.cpp',
        code: [
          '#include <iostream>',
          '#include <cstdint>',
          'int main() {',
          '    uint8_t buffer[7];',
          '    SafeSaveSerializer::serialize(\'S\', 95000, 5, buffer);',
          '',
          '    uint8_t rank;',
          '    uint32_t score;',
          '    uint16_t stage;',
          '    SafeSaveSerializer::deserialize(buffer, rank, score, stage);',
          '',
          '    std::cout << "[RESTORE] 復元ランク: " << (char)rank << ", スコア: " << score << ", ステージ: " << stage << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: パディングなし7バイトでの完全データ復元に成功！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '復元テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_save_load',
            '[RESTORE] 復元ランク: S, スコア: 95000, ステージ: 5',
            'データサイズ: 厳密に 7 bytes (パディング0バイト)',
            '🎉 ALL TESTS PASSED: パディングなし7バイトでの完全データ復元に成功！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'ぴったり7バイトで保存できて、ランクSもスコア95000も完璧に戻ってきました！これでもうパディングに悩まされることはありません！'
        },
        takeaway: 'お見事！C7の核心「メモリアライメントの理解と移植性の高いバイナリシリアライズ設計」をマスターしました。'
      }
    ]
  },

  // C8: 関数ポインタとコールバック
  'chapter-classic-8-function-pointers-callbacks': {
    chapterSlug: 'chapter-classic-8-function-pointers-callbacks',
    chapterBadge: 'C8 演習',
    title: 'C言語流 void* コールバックの型崩壊と型安全なデリゲート設計',
    subtitle: '危険な reinterpret_cast による即死クラッシュを、メンバ関数ポインタ委譲で解決！',
    mentalModel: 'void* コールバック (型情報消滅・キャストミスで即死) ➔ セグフォ ➔ C++メンバ関数委譲 (型安全なイベント通知)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: 'void* のキャスト間違いでメモリが破壊され即死する瞬間',
        instruction: '以下のコードを実行し、C言語流の void* コールバックで誤ったポインタ型にキャストしてクラッシュするバグを再現してみましょう。\n➔ `./c_callback_crash` と入力（または [Tab] キーで補完）',
        command: './c_callback_crash',
        matchKeywords: ['c_callback_crash', './c_callback_crash', 'callback'],
        codeFilename: 'void_ptr_crash.cpp',
        code: [
          '#include <iostream>',
          'struct Player { int score = 100; };',
          'struct SoundManager { int volume = 80; };',
          '',
          '// C言語流：型安全性のない void* コールバック',
          'void onEnemyDefeated(void (*callback)(void*), void* userData) {',
          '    callback(userData);',
          '}',
          '',
          'void addScoreCallback(void* userData) {',
          '    // ❌ 危険：本当は SoundManager が渡されたのに、Player と思い込んでキャスト！',
          '    Player* p = (Player*)userData;',
          '    p->score += 500;',
          '    std::cout << "スコア加算: " << p->score << std::endl;',
          '}',
          '',
          'int main() {',
          '    SoundManager soundMgr;',
          '    // バグ：誤って soundMgr のアドレスを渡してしまった！',
          '    onEnemyDefeated(addScoreCallback, &soundMgr);',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行してvoid*キャスト破綻を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./c_callback_crash',
            '💥 [SEGMENTATION FAULT] 不正なメモリアクセスが発生しました！',
            'Player* pointer was pointing to SoundManager instance.',
            'ERROR: Memory corruption due to unsafe void* downcasting.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: 'ひえっ！SoundManagerのポインタをPlayerだと思い込んでキャストしたせいで、無関係なメモリを書き換えてセグフォ即死しました…！void*はコンパイラがチェックしてくれないから怖すぎます！'
        },
        takeaway: 'C言語スタイルの void* コールバックは型情報が完全に消滅するため、コンパイル時エラーにならず実行時即死バグを生みます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'メンバ関数ポインタを包む型安全デリゲート（Delegate）',
        instruction: '対象クラスの型とメンバ関数ポインタをペアで保持し、型安全に呼び出す委譲コードを確認します。\n➔ `cat safe_delegate.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat safe_delegate.hpp',
        matchKeywords: ['cat', 'safe_delegate', 'delegate'],
        codeFilename: 'safe_delegate.hpp',
        code: [
          '#include <iostream>',
          '',
          'template <typename T>',
          'class Delegate {',
          'private:',
          '    T* m_instance;',
          '    void (T::*m_method)(int); // 🛡️ 型安全なメンバ関数ポインタ',
          '',
          'public:',
          '    Delegate(T* inst, void (T::*method)(int))',
          '        : m_instance(inst), m_method(method) {}',
          '',
          '    void invoke(int arg) {',
          '        if (m_instance && m_method) {',
          '            (m_instance->*m_method)(arg); // 確実にその型のメソッドを実行！',
          '        }',
          '    }',
          '};'
        ].join('\n'),
        actionButtonText: '型安全デリゲート設計コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat safe_delegate.hpp',
            '[Type-Safe Delegate Pattern Applied]',
            'Encapsulates instance pointer + member function pointer.',
            'Zero void* casting. Type mismatch rejected at compile time.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞC++の委譲【Delegate】の原型じゃ！「どのインスタンスの、どのメンバ関数を呼ぶか」をテンプレートで型安全にバインドする。型が食い違っていればコンパイルの瞬間に弾かれるぞ！'
        },
        takeaway: 'メンバ関数ポインタとテンプレートを組み合わせることで、void* の危険性をゼロにしたイベント通知基盤が構築できます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '敵撃破スコア通知イベントの安全な実行テスト',
        instruction: '型安全デリゲートを使って敵撃破時にプレイヤーの addScore() が正確に呼ばれることを証明しましょう！\n➔ `./test_delegate` と入力（または [Tab] キーで補完）',
        command: './test_delegate',
        matchKeywords: ['test_delegate', './test_delegate'],
        codeFilename: 'test_delegate_event.cpp',
        code: [
          '#include <iostream>',
          'class ScoreSystem {',
          'public:',
          '    int score = 0;',
          '    void onAddScore(int pts) { score += pts; }',
          '};',
          '',
          'int main() {',
          '    ScoreSystem scoreSys;',
          '    Delegate<ScoreSystem> scoreDelegate(&scoreSys, &ScoreSystem::onAddScore);',
          '',
          '    std::cout << "[EVENT] インベーダー撃破！500点通知をディスパッチ..." << std::endl;',
          '    scoreDelegate.invoke(500);',
          '    std::cout << "更新後スコア: " << scoreSys.score << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: 型安全なメンバ関数デリゲートによる通知成功！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'デリゲート通知テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_delegate',
            '[EVENT] インベーダー撃破！500点通知をディスパッチ...',
            '更新後スコア: 500',
            '🎉 ALL TESTS PASSED: 型安全なメンバ関数デリゲートによる通知成功！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'void* のキャストを1回も書かずに、狙ったインスタンスのメソッドが安全に呼ばれました！これなら引数を間違えてもコンパイラが教えてくれます！'
        },
        takeaway: 'お見事！C8の核心「C言語コールバックの脱却とC++型安全デリゲート設計」を体得しました。'
      }
    ]
  },

  // C9: 多重継承と菱形継承
  'chapter-classic-9-multiple-inheritance-diamond': {
    chapterSlug: 'chapter-classic-9-multiple-inheritance-diamond',
    chapterBadge: 'C9 演習',
    title: '多重継承による菱形継承の死（Diamond of Death）と仮想継承',
    subtitle: '基底クラスの二重実体化によるメンバ曖昧エラーを、virtual 継承で統一！',
    mentalModel: '単純な多重継承 (基底Enemyが2つ生成されHPが分裂) ➔ 曖昧コンパイルエラー ➔ 仮想継承 (virtual public Enemyで基底を共有)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '多重継承で基底クラスが2重実体化してコンパイル不能になる瞬間',
        instruction: '以下のコードを実行し、BossEnemy の基底 Enemy::hp が2重化してコンパイラが Ambiguous エラーを出す様子を再現してみましょう。\n➔ `./diamond_error` と入力（または [Tab] キーで補完）',
        command: './diamond_error',
        matchKeywords: ['diamond_error', './diamond_error', 'diamond'],
        codeFilename: 'diamond_death.cpp',
        code: [
          '#include <iostream>',
          'class Enemy { public: int hp = 100; };',
          '// ❌ 通常の継承',
          'class FlyingEnemy : public Enemy { public: void fly() {} };',
          'class ShootingEnemy : public Enemy { public: void shoot() {} };',
          '',
          '// 💥 菱形継承：Enemy が 2 つ実体化してしまう！',
          'class BossEnemy : public FlyingEnemy, public ShootingEnemy {};',
          '',
          'int main() {',
          '    BossEnemy boss;',
          '    // boss.hp = 500; // ⚠️ コンパイルエラー: \'Enemy::hp\' is ambiguous!',
          '    std::cout << "FlyingEnemy経由のHP:   " << boss.FlyingEnemy::hp << std::endl;',
          '    std::cout << "ShootingEnemy経由のHP: " << boss.ShootingEnemy::hp << std::endl;',
          '    std::cout << "⚠️ [DIAMOND TRAP] HP変数が2個存在し、片方を攻撃しても撃破できません！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'コードを実行して菱形継承の破綻を再現する ➔',
        simulatedOutput: {
          type: 'error',
          lines: [
            '$ ./diamond_error',
            'FlyingEnemy経由のHP:   100',
            'ShootingEnemy経由のHP: 100',
            '⚠️ [DIAMOND TRAP] HP変数が2個存在し、片方を攻撃しても撃破できません！',
            'ERROR: Ambiguous base class \'Enemy\' in \'BossEnemy\'.'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '空飛ぶ能力と弾撃ち能力を合体させようとしたら、ボスのHPが2個に分裂してしまいました！boss.hp と書いただけで「どっちのHPか分からない」ってコンパイラに怒られます！'
        },
        takeaway: '不用意な多重継承は「菱形継承（Diamond of Death）」を引き起こし、基底クラスの多重生成とメモリ浪費を招きます。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: '仮想基底クラス（virtual public）による共通基底の単一化',
        instruction: 'virtual public Enemy と宣言し、共通基底クラスの実体を1つに統合する設計コードを確認します。\n➔ `cat virtual_inheritance.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat virtual_inheritance.hpp',
        matchKeywords: ['cat', 'virtual_inheritance', 'virtual'],
        codeFilename: 'virtual_inheritance.hpp',
        code: [
          '#include <iostream>',
          '',
          'class Enemy {',
          'public:',
          '    int hp;',
          '    Enemy(int h = 100) : hp(h) {}',
          '};',
          '',
          '// 🛡️ virtual 継承：共通基底を共有することを宣言',
          'class FlyingEnemy : virtual public Enemy {',
          'public:',
          '    FlyingEnemy() : Enemy(100) {}',
          '};',
          '',
          'class ShootingEnemy : virtual public Enemy {',
          'public:',
          '    ShootingEnemy() : Enemy(100) {}',
          '};',
          '',
          'class BossEnemy : public FlyingEnemy, public ShootingEnemy {',
          'public:',
          '    // 最派生クラスが仮想基底クラス Enemy のコンストラクタを直接初期化',
          '    BossEnemy(int bossHp) : Enemy(bossHp), FlyingEnemy(), ShootingEnemy() {}',
          '};'
        ].join('\n'),
        actionButtonText: '仮想継承設計コードを確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat virtual_inheritance.hpp',
            '[Virtual Base Class Architecture Applied]',
            'FlyingEnemy and ShootingEnemy virtually inherit Enemy.',
            'BossEnemy shares a single instance of Enemy::hp.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これがC++の必殺技【仮想基底クラス（Virtual Inheritance）】じゃ！virtual をつけて継承することで、コンパイラが裏でポインタオフセットを調整し、基底クラス Enemy をたった1つに合体させてくれるのじゃ！'
        },
        takeaway: '仮想継承を使うことで菱形継承の曖昧さは解決できますが、内部オフセット参照によるコストが生じるため、真の現場では「インターフェースのみの多重継承」か「コンポジション（部品の合成）」が推奨されます。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '合体ボス敵の単一HPと能力連動テスト',
        instruction: '仮想継承された BossEnemy を生成し、boss.hp が1つに統一されて飛行と射撃が正常連動することを証明しましょう！\n➔ `./test_boss_diamond` と入力（または [Tab] キーで補完）',
        command: './test_boss_diamond',
        matchKeywords: ['test_boss_diamond', './test_boss_diamond'],
        codeFilename: 'test_boss_unified.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    BossEnemy boss(500);',
          '    std::cout << "[SPAWN] ボスHP: " << boss.hp << " (曖昧性なく直接アクセス可能！)" << std::endl;',
          '    boss.hp -= 150;',
          '    std::cout << "[DAMAGE] 150被弾後のボスHP: " << boss.hp << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: 仮想継承による単一基底HP管理の成功を証明！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'ボス動作テストを実行して安全性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_boss_diamond',
            '[SPAWN] ボスHP: 500 (曖昧性なく直接アクセス可能！)',
            '[DAMAGE] 150被弾後のボスHP: 350',
            '🎉 ALL TESTS PASSED: 仮想継承による単一基底HP管理の成功を証明！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: 'boss.hp が1つになって、直接ダメージを与えられました！「仮想継承」の仕組みと、なぜ安易な多重継承が危険なのかが身に沁みてわかりました！'
        },
        takeaway: 'お見事！C9の核心「多重継承のメモリモデル・菱形継承の解決と合成への昇華」をマスターしました。'
      }
    ]
  },

  // C10: CRTP と静的ポリモーフィズム
  'chapter-classic-10-static-polymorphism-crtp': {
    chapterSlug: 'chapter-classic-10-static-polymorphism-crtp',
    chapterBadge: 'C10 演習',
    title: '仮想関数テーブル（vtable）のオーバーヘッドと CRTP による超高速弾幕',
    subtitle: '1万発の弾丸更新で発生する間接参照コストを、コンパイル時ポリモーフィズムで消滅！',
    mentalModel: '動的ポリモーフィズム (virtual によるポインタジャンプ・インライン不可) ➔ 処理落ち ➔ CRTP (コンパイル時完全インライン化)',
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        badge: 'STEP 1: 破綻の再現',
        title: '1万発の弾丸で仮想関数呼び出しが処理落ちを引き起こす瞬間',
        instruction: '以下のコードを実行し、virtual 関数ポインタ経由で10,000発の弾丸を更新するとインライン展開されず低速になる様子を再現してみましょう。\n➔ `./vtable_slowdown` と入力（または [Tab] キーで補完）',
        command: './vtable_slowdown',
        matchKeywords: ['vtable_slowdown', './vtable_slowdown', 'vtable'],
        codeFilename: 'virtual_bullet_bench.cpp',
        code: [
          '#include <iostream>',
          'class VirtualBullet {',
          'public:',
          '    float x = 0, y = 0;',
          '    // ❌ 仮想関数：vtable経由の間接呼び出しとなりインライン展開不可！',
          '    virtual void update() { y -= 1.0f; }',
          '    virtual ~VirtualBullet() {}',
          '};',
          '',
          'int main() {',
          '    std::cout << "[BENCH] 仮想関数による弾丸10,000発の更新ベンチマーク..." << std::endl;',
          '    std::cout << "実行時間: 1.240 ms (vtable参照オーバーヘッド発生)" << std::endl;',
          '    std::cout << "⚠️ [PERF WARNING] virtual関数のためコンパイラがループをインライン最適化できません！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: '仮想関数ベンチマークを実行する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ ./vtable_slowdown',
            '[BENCH] 仮想関数による弾丸10,000発の更新ベンチマーク...',
            '実行時間: 1.240 ms (vtable参照オーバーヘッド発生)',
            'インライン展開: 不可能 (間接ポインタジャンプ)',
            '⚠️ [PERF WARNING] virtual関数のためコンパイラがループをインライン最適化できません！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'shocked',
          text: '1発なら気にならない仮想関数も、弾幕シューティングで10,000発になると毎フレーム1万回もvtableポインタを見に行って処理落ちしちゃいます…！'
        },
        takeaway: 'virtual関数は柔軟ですが、vtable間接参照と「インライン展開の阻害」という二重の実行時コストを支払います。'
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        badge: 'STEP 2: 設計の外科手術',
        title: 'CRTP（奇妙に再帰したテンプレートパターン）による静的結合',
        instruction: '基底クラスに派生クラスをテンプレート渡しし、コンパイル時に静的解決するCRTPコードを確認します。\n➔ `cat crtp_bullet.hpp` と入力（または [Tab] キーで補完）',
        command: 'cat crtp_bullet.hpp',
        matchKeywords: ['cat', 'crtp_bullet', 'crtp'],
        codeFilename: 'crtp_bullet.hpp',
        code: [
          '#include <iostream>',
          '',
          '// 🛡️ CRTP基底クラス：仮想関数テーブル（vptr）ゼロ！',
          'template <typename Derived>',
          'class CRTPBulletBase {',
          'public:',
          '    float x = 0, y = 0;',
          '    // コンパイル時に派生クラスのメソッドを直接インライン呼び出し！',
          '    void update() {',
          '        static_cast<Derived*>(this)->updateImpl();',
          '    }',
          '};',
          '',
          'class FastLaser : public CRTPBulletBase<FastLaser> {',
          'public:',
          '    void updateImpl() { y -= 5.0f; } // ✨ 完全にインライン展開される！',
          '};'
        ].join('\n'),
        actionButtonText: 'CRTP静的ポリモーフィズム設計を確認・解析する ➔',
        simulatedOutput: {
          type: 'warning',
          lines: [
            '$ cat crtp_bullet.hpp',
            '[CRTP Static Polymorphism Applied]',
            'Base: CRTPBulletBase<Derived> with static_cast downcasting.',
            'Zero virtual table (vptr = 0 bytes). 100% inline expandable.'
          ]
        },
        dialogue: {
          speaker: 'shirokuma',
          emotion: 'teaching',
          text: 'これぞC++が生み出した超絶技巧【CRTP（Curiously Recurring Template Pattern）】じゃ！基底クラスが派生クラスの型を知っているため、キャストがコンパイル時に静的解決され、vtableが跡形もなく消滅するのじゃ！'
        },
        takeaway: 'CRTPを使えば、共通の基底インターフェースを持たせつつ、実行時オーバーヘッド完全ゼロ（0バイト・0サイクル）の静的ポリモーフィズムが手に入ります。'
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        badge: 'STEP 3: 安全性の検証・合格',
        title: '1万発CRTP弾幕の爆速インライン更新ベンチマーク',
        instruction: 'CRTP版の弾幕更新を実行し、仮想関数版に比べて3倍以上の超高速化（インライン展開）を検証しましょう！\n➔ `./test_crtp_perf` と入力（または [Tab] キーで補完）',
        command: './test_crtp_perf',
        matchKeywords: ['test_crtp_perf', './test_crtp_perf', 'perf'],
        codeFilename: 'test_crtp_benchmark.cpp',
        code: [
          '#include <iostream>',
          'int main() {',
          '    std::cout << "[BENCH] CRTP静的ポリモーフィズムによる弾丸10,000発更新..." << std::endl;',
          '    std::cout << "実行時間: 0.380 ms (約 3.2 倍の爆速化達成！)" << std::endl;',
          '    std::cout << "vtable参照: 0 回 (完全インライン展開)" << std::endl;',
          '    std::cout << "🎉 ALL TESTS PASSED: CRTPによるゼロコスト静的ポリモーフィズムの実証成功！" << std::endl;',
          '    return 0;',
          '}'
        ].join('\n'),
        actionButtonText: 'CRTPベンチマークを実行して高速性を証明する ➔',
        simulatedOutput: {
          type: 'success',
          lines: [
            '$ ./test_crtp_perf',
            '[BENCH] CRTP静的ポリモーフィズムによる弾丸10,000発更新...',
            '実行時間: 0.380 ms (約 3.2 倍の爆速化達成！)',
            'vtable参照: 0 回 (完全インライン展開)',
            '🎉 ALL TESTS PASSED: CRTPによるゼロコスト静的ポリモーフィズムの実証成功！'
          ]
        },
        dialogue: {
          speaker: 'penguin',
          emotion: 'smug',
          text: '3倍以上速くなりました！多態性を持たせながら、コンパイラが完全にインライン展開してくれるなんて…C++のテンプレートの底知れなさを実感しました！'
        },
        takeaway: 'お見事！C10の神髄「CRTPによるゼロコスト抽象化とコンパイル時静的ポリモーフィズム」を体得しました。'
      }
    ]
  }
};

export function getLabScenario(chapterSlug: string): ChapterLabScenario | undefined {
  return STEP_BY_STEP_LABS[chapterSlug];
}
