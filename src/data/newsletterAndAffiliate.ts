export interface BookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: 'C++設計バイブル' | 'モダンC++入門' | 'ゲーム設計パターン' | '最適化・低レイヤ';
  tag: string;
  description: string;
  recommendPoint: string;
  isbnOrKeyword: string;
  priceHint?: string;
  icon: string;
}

export interface ServiceAffiliateItem {
  id: string;
  name: string;
  category: 'course' | 'career' | 'qual' | 'travel' | 'shopping';
  badge: string;
  description: string;
  priceNote?: string;
  linkUrl: string;
  trackingPixelUrl?: string;
  icon: string;
  recommendPoint: string;
}

export const AMAZON_ASSOCIATE_TAG = 'shirokumatech00-22';

export const A8_RAKUTEN_BASE_URL =
  'https://rpx.a8.net/svt/ejp?a8mat=4BABTG+1RPEIA+2HOM+6GRMR&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26082247997_4BABTG_1RPEIA_2HOM_6GRMR%3Fpc%3D';

export const A8_RAKUTEN_TOP_URL =
  'https://rpx.a8.net/svt/ejp?a8mat=4BABTG+1RPEIA+2HOM+6DZBN&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26082247997_4BABTG_1RPEIA_2HOM_6DZBN%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F';

export const A8_RAKUTEN_TOP_PIXEL =
  'https://www18.a8.net/0.gif?a8mat=4BABTG+1RPEIA+2HOM+6DZBN';

export const getAmazonSearchUrl = (keyword: string): string => {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_ASSOCIATE_TAG}`;
};

export const getRakutenSearchUrl = (keyword: string): string => {
  const rawTargetUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return `${A8_RAKUTEN_BASE_URL}${encodeURIComponent(rawTargetUrl)}`;
};

export const CPP_RECOMMENDED_PRODUCTS: BookItem[] = [
  {
    id: 'book-effective-cpp',
    title: 'Effective Modern C++ ― C++11/14を最大限活かす55の技法',
    author: 'Scott Meyers 著',
    publisher: 'オライリー・ジャパン',
    category: 'C++設計バイブル',
    tag: '👑 全世界C++プログラマー必読の金字塔',
    icon: '📘',
    isbnOrKeyword: 'Effective Modern C++ Scott Meyers',
    priceHint: '定価 ¥4,620',
    description:
      '右辺値参照、ムーブセマンティクス、ラムダ式、スマートポインタ、std::make_uniqueの使い分けなど、モダンC++の最重要イディオムを徹底解説。',
    recommendPoint: 'シロクマ先生激推し！生ポインタやnew/deleteから脱却し、堅牢なオブジェクト指向設計を極めるなら必読じゃ。'
  },
  {
    id: 'book-game-programming-patterns',
    title: 'Game Programming Patterns ― ソフトウェア開発の問題解決メニュー',
    author: 'Robert Nystrom 著',
    publisher: 'ボーンデジタル',
    category: 'ゲーム設計パターン',
    tag: '🎮 ゲームループからECSまで動く設計論',
    icon: '📕',
    isbnOrKeyword: 'Game Programming Patterns ソフトウェア開発の問題解決メニュー',
    priceHint: '定価 ¥4,400 前後',
    description:
      'インベーダーやアクションゲームのアーキテクチャ設計に直結するデザインパターン（Command, Flyweight, State, Component）を平易なC++で図解。',
    recommendPoint: 'ペンギン生徒も愛読！当サイトのインベーダー設計の背景思想がスッキリ理解できる名著っす！'
  },
  {
    id: 'book-cpp20-pocket',
    title: 'C++20 基本＆実践プログラミングガイド',
    author: '技術書典・専門著者群',
    publisher: '技術評論社',
    category: 'モダンC++入門',
    tag: '⚡️ Concepts・Ranges・コルーチンの即効活用',
    icon: '📙',
    isbnOrKeyword: 'C++20 プログラミング',
    priceHint: '定価 ¥3,500 前後',
    description:
      'テンプレートの制約（Concepts）、美しいパイプライン処理（Ranges）、モジュール化など、C++20の劇的な進化をコード例中心にマスター。',
    recommendPoint: '古いC++しか知らないプログラマーが読むと、設計の簡潔さと型安全性に度肝を抜かれるぞ。'
  }
];

export const NEWSLETTER_SAMPLES = [
  {
    day: 'Day 01',
    previewSubject: '【モダンC++即答ドリル Day01】std::unique_ptrの所有権移動と生ポインタの排除',
    sender: 'シロクマ先生（シロクマTech C++設計室）<newsletter@shirokuma-tech.jp>',
    paragraphs: [
      'おはようございます、シロクマ先生です！',
      'モダンC++設計の第1歩は「生ポインタによる所有権管理の完全根絶」です。',
      '単独所有を表す【std::unique_ptr】はコピー不可（Non-copyable）であり、所有権の移譲には必ず【std::move】を使用します。',
      'これによりデストラクタで自動解放され、例外発生時でもメモリリークを100%防ぐRAII原則が達成されます。'
    ],
    quizQuestion: 'Q: std::unique_ptrインスタンスの所有権を別のポインタに移譲する関数は？',
    quizAnswer: 'A: std::move（所有権のムーブセマンティクスによる移動）'
  },
  {
    day: 'Day 02',
    previewSubject: '【モダンC++即答ドリル Day02】std::make_sharedの内部アロケーションと弱参照',
    sender: 'シロクマ先生（シロクマTech C++設計室）<newsletter@shirokuma-tech.jp>',
    paragraphs: [
      'おはようございます！今朝のテーマは共有所有ポインタ「std::shared_ptr」の最適化です。',
      'new std::shared_ptr<T>(new T()) と書くと制御ブロックとオブジェクト本体で2回のヒープ割当てが発生します。',
      '一方【std::make_shared<T>()】を使うと、単一の連続メモリブロックに両方を割り当てるためキャッシュ効率とパフォーマンスが大幅に向上します。'
    ],
    quizQuestion: 'Q: shared_ptrでヒープアロケーション回数を1回に抑える生成関数は？',
    quizAnswer: 'A: std::make_shared（制御ブロックと対象オブジェクトを単一確保）'
  },
  {
    day: 'Day 03',
    previewSubject: '【モダンC++即答ドリル Day03】Strategyパターンにおけるstd::functionと仮想関数の選択',
    sender: 'シロクマ先生（シロクマTech C++設計室）<newsletter@shirokuma-tech.jp>',
    paragraphs: [
      'おはようございます！本日は振る舞いを動的に切り替える「Strategyパターン」のC++20設計です。',
      '従来の基底抽象クラスと仮想関数テーブル（vtable）を用いる方法に加え、現代では【std::function】や【ラムダ式】をメンバに保持する軽量Strategy設計が多用されます。',
      'クラス階層を増やさずにインラインで動作を差し替えられる柔軟性がモダンC++の大きな魅力です。'
    ],
    quizQuestion: 'Q: クラス継承を伴わずにラムダ式を戦略として保持する標準ライブラリの型は？',
    quizAnswer: 'A: std::function（汎用関数ラッパー）または関数ポインタ'
  }
];

export const AFFILIATE_ITEMS: ServiceAffiliateItem[] = [
  {
    id: 'a8-rakuten-cpp',
    name: '楽天市場 C++技術書・キーボード・プログラミング機材',
    category: 'shopping',
    badge: 'ポイント還元',
    description: 'オライリー・技術評論社・インプレス書籍や開発用モニター・メカニカルキーボードをお得に購入。',
    priceNote: '楽天お買い物マラソン・ポイント最大利用',
    linkUrl: A8_RAKUTEN_TOP_URL,
    trackingPixelUrl: A8_RAKUTEN_TOP_PIXEL,
    icon: '🛒',
    recommendPoint: '技術書は定価が高いので、楽天ブックスの買い回りマラソンを活用するのが最安じゃ！'
  }
];
