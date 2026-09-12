# C++ インベーダー育成型オブジェクト指向プログラミング学習Webサイト

C++の「オブジェクト指向設計」および「複数ファイル分割・実装」を、段階的なインベーダーゲーム開発を通して楽しく体感できるインタラクティブWeb学習サイトです。

---

## 🌟 主な特徴

1. **育成型のゲーム開発体験**:
   - **第1章**：1ファイルで作るスパゲティコード（グローバル変数地獄とmain関数の肥大化）
   - **第2章**：クラス化とファイルの分割（Player, Invader, Bullet をヘッダ `.h` と実装 `.cpp` に分割、カプセル化）
   - **第3章**：オブジェクトの動的生成と寿命管理（`std::vector` による火花パーティクル爆発エフェクト、メモリ管理）
2. **ブラウザ上で実際に遊べる「Webコンソールエミュレータ」**:
   - 各章のコード改善に応じて、ゲームの見た目やエフェクト（第3章のパーティクル爆発など）が豪華になっていく様子をリアルタイムで操作・体感できます。
3. **シロクマ先生 & ペンギン生徒のコミカルな解説対話**:
   - 2頭身のキュートなキャラクターによるマンガ感覚の吹き出しチュートリアル。
4. **エンジニア向けモダンUI & シンタックスハイライト**:
   - ダークモード完全対応。複数ファイルタブ切り替え＆ワンクリックコピー。
5. **将来の拡張性に優れたデータ駆動設計**:
   - `src/data/chapters/` に第4章、第5章を追加し、`src/data/chapters.ts` に登録するだけでナビゲーションやルーティングが自動連動。
6. **ローカル実行可能なC++プロジェクト一式同梱**:
   - `cpp-projects/` 配下に各章のWindowsコンソール向け実動C++ソースコード、`CMakeLists.txt`、ワンクリックビルド用 `run.bat` を完備。

---

## 🚀 Webサイトの起動方法（ローカル環境）

Node.js (v18+) がインストールされた環境で以下を実行してください。

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` を開くとWebサイトが立ち上がります。

### プロダクションビルド
```bash
npm run build
```
`dist/` フォルダに静的サイト一式が生成されます。

---

## 📁 ディレクトリ構造

```
cpp-study/
├── package.json              # 依存パッケージ定義
├── vite.config.ts            # Vite設定
├── tailwind.config.js        # Tailwind CSS設定
├── index.html                # HTMLエントリポイント
│
├── src/
│   ├── main.tsx              # Reactエントリポイント
│   ├── App.tsx               # アプリケーションルート（ルーティング・状態管理）
│   ├── index.css             # Tailwind & Prismスタイル
│   │
│   ├── types/
│   │   └── curriculum.ts     # 章、会話、コードファイル、クイズの型定義
│   │
│   ├── data/
│   │   ├── characters.ts     # シロクマ先生＆ペンギン生徒のキャラ設定
│   │   ├── chapters.ts       # 全章集約 ＆ 続編ロードマップ定義
│   │   └── chapters/
│   │       ├── chapter1.ts   # 第1章：スパゲティコード
│   │       ├── chapter2.ts   # 第2章：クラス化とファイル分割
│   │       └── chapter3.ts   # 第3章：動的生成と寿命管理
│   │
│   └── components/
│       ├── common/
│       │   └── Avatar.tsx    # 2頭身SVGキャラクタ（表情変化付き）
│       ├── curriculum/
│       │   ├── DialogueBubble.tsx # 会話吹き出しUI
│       │   ├── CodeViewer.tsx     # 複数ファイルタブ＆ハイライト＆コピー
│       │   ├── ConceptDiagram.tsx # カプセル化・メモリ寿命の図解
│       │   └── ChapterView.tsx    # 章コンテンツ統括ビュー
│       ├── emulator/
│       │   └── GameEmulator.tsx   # ブラウザ内レトロコンソールシミュレータ
│       └── layout/
│           ├── Navbar.tsx         # ヘッダーナビゲーション
│           ├── Sidebar.tsx        # サイドバー（章一覧・進捗・ロードマップ）
│           ├── Footer.tsx         # フッター
│           └── SourceModal.tsx    # C++ソースコードガイドモーダル
│
└── cpp-projects/             # 読者が実際にPCでコンパイルできる実機コード
    ├── chapter1/             # 第1章（main.cpp, CMakeLists.txt, run.bat）
    ├── chapter2/             # 第2章（Player, Invader, Bullet, main, run.bat）
    ├── chapter3/             # 第3章（Particle, Game, Player, Invader, run.bat）
    └── README.md             # コンパイル・実行ガイド
```

---

## 💻 C++実機コードのコンパイル方法（Windows）

各章の `cpp-projects/chapterX/` フォルダにある `run.bat` をダブルクリックするか、MinGW (g++) を使用して以下のようにビルドできます：

```bash
# 第3章（豪華版）のビルド例
cd cpp-projects/chapter3
g++ -std=c++17 main.cpp Game.cpp Player.cpp Invader.cpp Bullet.cpp Particle.cpp -o invader.exe
./invader.exe
```

---

## 🔮 第4章以降の拡張方法（開発者向け）

1. `src/data/chapters/chapter4.ts` を作成（`Chapter` 型を実装）。
2. `src/data/chapters.ts` の `ALL_CHAPTERS` 配列にインポートして追加。
3. これだけで、サイドバー、進捗管理、URLハッシュルーティングに自動反映されます。

