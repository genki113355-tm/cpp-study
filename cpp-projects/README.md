# C++ インベーダーゲーム教材 ソースコード一式

このディレクトリには、Webサイト「C++ インベーダー育成型オブジェクト指向プログラミング講座」で解説されている第1章〜第3章のWindowsコンソール用実機コードが同梱されています。

---

## フォルダ構成

```
cpp-projects/
├── chapter1/      # 第1章：1ファイルで作るスパゲティコード（ビフォー）
├── chapter2/      # 第2章：クラス化とファイルの分割（アフター）
├── chapter3/      # 第3章：動的配列 std::vector とパーティクル演出
├── chapter4/      # 第4章：継承とポリモーフィズム（Enemy基底と多彩な敵）
├── chapter5/      # 第5章：スマートポインタとRAII（unique_ptr / shared_ptr）
├── chapter6/      # 第6章：ゲームパターン（Stateによるシーン管理 & Observer実績）
└── chapter7/      # 第7章：モダンC++テンプレートとECS完結編（継承より合成）
```

---

## ビルド＆実行方法

### 方法1: バッチファイルを実行（MinGW / g++ がある場合）
各フォルダ内の `run.bat` をダブルクリックするだけで、ワンクリックでコンパイル＆実行されます。

### 方法2: コマンドラインから直接コンパイル（g++）
```powershell
# 例：第3章の場合
cd cpp-projects/chapter3
g++ -std=c++17 main.cpp Game.cpp Player.cpp Invader.cpp Bullet.cpp Particle.cpp -o invader.exe
./invader.exe
```

### 方法3: CMakeを使用する場合
```powershell
cd cpp-projects/chapter3
mkdir build
cd build
cmake ..
cmake --build . --config Release
./invader_ch3.exe
```

---

## 操作方法
- **A** または **←** : 自機を左に移動
- **D** または **→** : 自機を右に移動
- **スペースキー** : 弾を発射（第3章では3連射可能！）
- **Q** : ゲーム終了

