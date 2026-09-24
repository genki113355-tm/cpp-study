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

  // L2: ポインタ地獄（二重解放・クラッシュ）と所有権
  'chapter-classic-2-pointer-hell': {
    chapterSlug: 'chapter-classic-2-pointer-hell',
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
  'chapter-modern-1-unique-ptr': {
    chapterSlug: 'chapter-modern-1-unique-ptr',
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
  'chapter-modern-10-game-loop': {
    chapterSlug: 'chapter-modern-10-game-loop',
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
  }
};

export function getLabScenario(chapterSlug: string): ChapterLabScenario | undefined {
  return STEP_BY_STEP_LABS[chapterSlug];
}
