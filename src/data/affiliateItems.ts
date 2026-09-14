export interface AffiliateItem {
  id: string;
  category: 'busy' | 'reward';
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  emoji: string;
  buttonText: string;
  linkUrl: string; // ここにASP（A8.net、もしもアフィリエイト、楽天等）の提携リンクURLを挿入
  isExternal?: boolean;
}

export interface PromoTheme {
  title: string;
  subtitle: string;
  mascotSpeaker: 'shirokuma' | 'penguin';
  mascotComment: string;
  items: AffiliateItem[];
}

// ① 「仕事や勉強で忙しいあなたへ」向け商材（時短・宅配食・ミールキット）
export const BUSY_PROMO_THEME: PromoTheme = {
  title: '仕事や勉強で忙しいあなたへ。開発に集中できる時短ごはん',
  subtitle: 'プログラミングで脳をフル回転させた後は、手軽で栄養満点な食事を。電子レンジ数分で本格おかずが揃う冷凍宅食やミールキットで、自炊の手間をゼロにして開発・学習時間を最大化しよう！',
  mascotSpeaker: 'shirokuma',
  mascotComment: 'コードを書く頭には上質な栄養と休息が必須じゃ！レンチン数分でサッと食べて、万全のコンディションで開発に没頭するのじゃ！',
  items: [
    {
      id: 'nosh-style',
      category: 'busy',
      badge: '低糖質・高たんぱく冷凍宅食',
      emoji: '🍱',
      title: 'シェフ監修・ヘルシー冷凍宅配弁当',
      subtitle: 'レンジで温めるだけ！糖質30g以下・塩分2.5g以下',
      description: '全60種類以上の豊富なメニューから自由に選べる。洗い物ゼロで、プログラミングや勉強の合間に本格的な温かいごはんが完成します。',
      points: [
        'レンジで温めるだけで即完成（調理・片付け時間ゼロ）',
        '専属シェフと管理栄養士が開発した安心の栄養設計',
        '環境にやさしい紙容器でゴミ捨てもラクラク'
      ],
      buttonText: 'メニューと初回割引を見る',
      linkUrl: 'https://www.google.com/search?q=%E5%86%B7%E5%87%8D%E5%AE%85%E9%85%8D%E5%BC%8F+%E3%83%8A%E3%83%83%E3%82%B7%E3%83%A5', // ※提携後にアフィリエイトURLへ差し替え可能
      isExternal: true,
    },
    {
      id: 'oisix-style',
      category: 'busy',
      badge: '厳選食材時短ミールキット',
      emoji: '🥗',
      title: '主菜＋副菜が20分で完成する食材セット',
      subtitle: '有機野菜とカット済み食材で手軽にプロの味',
      description: 'レシピと計量済み食材がまるごと届く。献立を考えるリソースをコードに集中させたい共働き・エンジニア学習者に大好評の時短キット。',
      points: [
        '必要な食材がピッタリ届くから食品ロスなし',
        '味付けタレ付きで失敗しない本格レストラン品質',
        'おためしセットでお得にスタート可能'
      ],
      buttonText: 'おためしセットをチェック',
      linkUrl: 'https://www.google.com/search?q=Oisix+%E3%81%8A%E3%81%9F%E3%82%81%E3%81%97%E3%82%BB%E3%83%83%E3%83%88', // ※提携後にアフィリエイトURLへ差し替え可能
      isExternal: true,
    },
  ],
};

// ② 「勉強を頑張った自分へご褒美を」向け商材（高級和牛・カニ・うなぎ）
export const REWARD_PROMO_THEME: PromoTheme = {
  title: '難関C++をやり遂げた自分へ。極上お取り寄せグルメでご褒美を！',
  subtitle: 'ポインタ演算やメモリ管理、オブジェクト指向の壁を乗り越えた達成感とともに。産地直送のブランド和牛やプリップリの海鮮で、頑張った頭と体を満たそう！',
  mascotSpeaker: 'penguin',
  mascotComment: '難関章のクリアおめでとうございますっ！今夜は極上の和牛やズワイガニを囲んで、最高の気分で優勝しちゃいましょう〜！！',
  items: [
    {
      id: 'wagyu-steak',
      category: 'reward',
      badge: '最高級A5ランク黒毛和牛',
      emoji: '🥩',
      title: '特選A5黒毛和牛 サーロイン＆すき焼き',
      subtitle: 'とろける霜降りと芳醇な香り。特別な夜の贅沢ディナー',
      description: '職人が厳選した最高格付けA5等級。一口食べればジュワッと広がる上質な脂の甘み。難解なバグ修正をやり遂げた記念日にふさわしい逸品。',
      points: [
        '名産地から産地直送！抜群の鮮度でお届け',
        'ステーキ用・すき焼き用・焼肉用から選べる',
        '高級感あふれる木箱・風呂敷包装でギフトにも最適'
      ],
      buttonText: '特選和牛のラインナップを見る',
      linkUrl: 'https://www.google.com/search?q=%E9%BB%92%E6%AF%9B%E5%92%8C%E7%89%9B+A5+%E3%81%8A%E5%8F%96%E3%82%8A%E5%AF%84%E3%81%9B', // ※提携後にアフィリエイトURLへ差し替え可能
      isExternal: true,
    },
    {
      id: 'crab-seafood',
      category: 'reward',
      badge: '極上オホーツク海鮮',
      emoji: '🦀',
      title: '本ズワイガニ棒肉＆特大毛ガニセット',
      subtitle: '身入りぎっしり！濃厚なカニ味噌と極甘の旨み',
      description: '水揚げ直後に浜茹で急速冷凍。殻むき不要のポーションや姿茹でなど、届いて解凍するだけで極上の海鮮宴会が始まります。',
      points: [
        'ぎっしり詰まった極太の脚肉は食べ応え抜群',
        '濃厚でコク深い甲羅カニ味噌に地酒を注いで甲羅酒も',
        'カニ鍋やバター焼きなど多彩な楽しみ方'
      ],
      buttonText: '獲れたてカニ特集を見る',
      linkUrl: 'https://www.google.com/search?q=%E3%82%BA%E3%83%AF%E3%82%A4%E3%82%AC%E3%83%88+%E6%AF%9B%E3%82%AC%E3%83%88+%E3%81%8A%E5%8F%96%E3%82%8A%E5%AF%84%E3%81%9B', // ※提携後にアフィリエイトURLへ差し替え可能
      isExternal: true,
    },
    {
      id: 'unagi-kabayaki',
      category: 'reward',
      badge: '熟練職人手焼き国産鰻',
      emoji: '🍱',
      title: '特大国産うなぎ 蒲焼き・白焼きセット',
      subtitle: '外は香ばしく中はふっくら。秘伝のタレが染み渡る',
      description: '清流で育った厳選国産うなぎをじっくり炭火手焼き。香ばしい香りとふっくら肉厚な食感で、酷使した脳と体に活力をチャージ。',
      points: [
        '安心の完全国産（浜名湖・宮崎・鹿児島等）',
        '湯せんやトースターで温めるだけの本格鰻重',
        '山椒・秘伝のタレ付き'
      ],
      buttonText: '国産うなぎ蒲焼きを見る',
      linkUrl: 'https://www.google.com/search?q=%E5%9B%BD%E7%94%A3%E3%81%86%E3%81%AA%E3%81%8E+%E8%92%B2%E7%84%BC%E3%81%8D+%E3%81%8A%E5%8F%96%E3%82%8A%E5%AF%84%E3%81%9B', // ※提携後にアフィリエイトURLへ差し替え可能
      isExternal: true,
    },
  ],
};
