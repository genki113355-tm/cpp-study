export type AffiliateCategory = 'school' | 'career' | 'travel';

export interface A8BannerItem {
  id: string;
  category: AffiliateCategory;
  name: string;
  description: string;
  badge?: string;
  linkUrl: string;
  bannerImgUrl: string;
  trackingPixelUrl: string;
  width: number;
  height: number;
}

export interface BannerGroup {
  category: AffiliateCategory;
  type?: string; // 後方互換用
  title: string;
  subtitle: string;
  badge: string;
  mascotSpeaker: 'shirokuma' | 'penguin';
  mascotComment: string;
  banners: A8BannerItem[];
}

// 🎓 ① プログラミングスクール・学習サポート（3件）
export const SCHOOL_BANNERS: BannerGroup = {
  category: 'school',
  type: 'busy', // 後方互換
  badge: 'スキルアップ・スクール特集',
  title: '独学の壁を最速で突破！厳選プログラミングスクール＆学習講座',
  subtitle: '基礎を掴んだら次のステージへ。実務レベルの開発力や資格取得をサポートする信頼のオンライン学習サービス。',
  mascotSpeaker: 'shirokuma',
  mascotComment: '独学で行き詰まった時は、体系的なカリキュラムやプロのメンターを頼るのも上達への賢い近道じゃ！一気に突き抜けるのじゃ！',
  banners: [
    {
      id: 'school-1',
      category: 'school',
      name: 'デイトラ',
      description: '業界最安級のオンラインWebスクール。実践重視のカリキュラムで現場で通用するスキルを習得。',
      badge: '人気No.1コスパ',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BACLE+3WIBJM+5IZ2+5YZ75',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260823362236&wid=001&eno=01&mid=s00000025787001003000&mc=1',
      trackingPixelUrl: 'https://www16.a8.net/0.gif?a8mat=4BACLE+3WIBJM+5IZ2+5YZ75',
      width: 300,
      height: 250,
    },
    {
      id: 'school-2',
      category: 'school',
      name: 'オンスク.JP',
      description: '月額定額で資格・ビジネススキルが学び放題！スキマ時間を活用してスマートにスキルアップ。',
      badge: '月額定額ウケホーダイ',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BADDJ+5K1O1E+408S+5ZMCH',
      bannerImgUrl: 'https://www25.a8.net/svt/bgt?aid=260824375336&wid=001&eno=01&mid=s00000018694001006000&mc=1',
      trackingPixelUrl: 'https://www15.a8.net/0.gif?a8mat=4BADDJ+5K1O1E+408S+5ZMCH',
      width: 300,
      height: 250,
    },
    {
      id: 'school-3',
      category: 'school',
      name: 'Programming Hacks',
      description: '質問サポート無期限！実戦的なプログラミング技術を徹底的に身につける買い切り型本格講座。',
      badge: '永久質問サポート',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BADDI+84XAEQ+4K3S+60WN5',
      bannerImgUrl: 'https://www28.a8.net/svt/bgt?aid=260824374492&wid=001&eno=01&mid=s00000021268001012000&mc=1',
      trackingPixelUrl: 'https://www15.a8.net/0.gif?a8mat=4BADDI+84XAEQ+4K3S+60WN5',
      width: 300,
      height: 250,
    },
  ],
};

// 💼 ② エンジニア転職・キャリアアップ（2件）
export const CAREER_BANNERS: BannerGroup = {
  category: 'career',
  badge: 'エンジニア転職・キャリア支援',
  title: '培った技術力を市場価値へ。IT・Web専門の転職支援',
  subtitle: '低レイヤからモダンWebまで。あなたの開発経験・学習成果を正当に評価し、年収アップ・理想の就業環境を実現。',
  mascotSpeaker: 'penguin',
  mascotComment: '実戦コードが書けるようになったら市場価値は急上昇っ！専任アドバイザーにまずは気軽に無料相談してみませんか〜？',
  banners: [
    {
      id: 'career-1',
      category: 'career',
      name: 'TECH GO（IT・Web特化転職）',
      description: 'エンジニア目線に立った親身なキャリアサポート。非公開の優良開発プロジェクトをご紹介。',
      badge: '無料キャリア相談',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BACLI+D8W8C2+5B0Y+HVNAP',
      bannerImgUrl: 'https://www28.a8.net/svt/bgt?aid=260823366801&wid=001&eno=01&mid=s00000024757003003000&mc=1',
      trackingPixelUrl: 'https://www18.a8.net/0.gif?a8mat=4BACLI+D8W8C2+5B0Y+HVNAP',
      width: 300,
      height: 250,
    },
    {
      id: 'career-2',
      category: 'career',
      name: 'TECH GO（年収UP支援）',
      description: '確かな技術力を適正に評価する求人が多数。年収アップと働きやすい開発環境を目指す転職。',
      badge: '年収UP・優良求人',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BACLI+D8W8C2+5B0Y+I0KRL',
      bannerImgUrl: 'https://www21.a8.net/svt/bgt?aid=260823366801&wid=001&eno=01&mid=s00000024757003026000&mc=1',
      trackingPixelUrl: 'https://www18.a8.net/0.gif?a8mat=4BACLI+D8W8C2+5B0Y+I0KRL',
      width: 300,
      height: 250,
    },
  ],
};

// 🏖️ ③ 旅行・宿泊・週末リフレッシュ（10件）
export const TRAVEL_BANNERS: BannerGroup = {
  category: 'travel',
  type: 'reward', // 後方互換
  badge: '学習達成のご褒美・リフレッシュ旅',
  title: '頭をフル回転させた後は！週末リフレッシュ＆ご褒美旅行',
  subtitle: '難解な設計やデバッグをやり遂げた自分へ。癒やしの名湯・極上のホテル・週末の息抜きでお得な旅へ出かけよう！',
  mascotSpeaker: 'penguin',
  mascotComment: '難関章の読破お疲れ様でした〜！たまにはPCを閉じて、温泉や美味しい料理で脳をしっかりリフレッシュさせましょうっ！',
  banners: [
    {
      id: 'travel-1',
      category: 'travel',
      name: 'Agoda（アゴダ）',
      description: '国内・海外のホテル・宿泊施設が最大手ならではのベストプライス。直前割引や限定プランも充実。',
      badge: '国内・海外ホテル',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCEVP+4UG10Y+4X1W+5ZMCH',
      bannerImgUrl: 'https://www22.a8.net/svt/bgt?aid=260919637293&wid=001&eno=01&mid=s00000022946001006000&mc=1',
      trackingPixelUrl: 'https://www12.a8.net/0.gif?a8mat=4BCEVP+4UG10Y+4X1W+5ZMCH',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-2',
      category: 'travel',
      name: 'Yahoo!トラベル（国内宿泊）',
      description: '全国の厳選ホテル・旅館をお得に予約。予約時にポイントが即時利用できておトク！',
      badge: 'ポイント即時利用',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+63WO1',
      bannerImgUrl: 'https://www24.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001026000&mc=1',
      trackingPixelUrl: 'https://www15.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+63WO1',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-3',
      category: 'travel',
      name: 'Yahoo!トラベル（お得なクーポン）',
      description: '季節の特別割引クーポン配布中！憧れの高級宿もクーポン併用でお得に泊まれる。',
      badge: '割引クーポン配布中',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+626XT',
      bannerImgUrl: 'https://www24.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001018000&mc=1',
      trackingPixelUrl: 'https://www17.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+626XT',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-4',
      category: 'travel',
      name: 'Yahoo!トラベル（癒やしの温泉旅）',
      description: '名湯の露天風呂と美食で心身ともに極上リセット。頑張った週末のご褒美にぴったり。',
      badge: '名湯・露天風呂',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6NU9D',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001119000&mc=1',
      trackingPixelUrl: 'https://www16.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6NU9D',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-5',
      category: 'travel',
      name: 'Yahoo!トラベル（人気ホテル・お宿）',
      description: '口コミ高評価の人気ホテルセレクション。快適なステイでワーケーションにもおすすめ。',
      badge: '高評価おすすめ宿',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6GZCH',
      bannerImgUrl: 'https://www21.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001087000&mc=1',
      trackingPixelUrl: 'https://www19.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6GZCH',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-6',
      category: 'travel',
      name: 'Yahoo!トラベル（出張＆週末ステイ）',
      description: '駅チカ・高速Wi-Fi完備のビジネスホテルから都市型ホテルまでスマートに予約。',
      badge: '出張・ワーケーション',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6BU5T',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001063000&mc=1',
      trackingPixelUrl: 'https://www13.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6BU5T',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-7',
      category: 'travel',
      name: 'Yahoo!トラベル（レジャー＆リゾート）',
      description: 'テーマパーク周辺ホテルや高原リゾート。家族・仲間との休日や気ままな一人旅程にも。',
      badge: 'リゾート＆レジャー',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6DJW1',
      bannerImgUrl: 'https://www23.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001071000&mc=1',
      trackingPixelUrl: 'https://www10.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6DJW1',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-8',
      category: 'travel',
      name: 'Yahoo!トラベル（タイムセール特集）',
      description: '期間限定のウルトラバリュープラン！お得なプランを見つけたら即予約がおすすめ。',
      badge: '限定タイムセール',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6KESX',
      bannerImgUrl: 'https://www25.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001103000&mc=1',
      trackingPixelUrl: 'https://www16.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6KESX',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-9',
      category: 'travel',
      name: 'Yahoo!トラベル（PayPayポイント還元）',
      description: 'PayPayポイントがどんどん貯まる・使える。日常のポイ活と旅行を賢く連携。',
      badge: 'PayPayポイントお得',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+24SXTE+4ZCO+6IP2P',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260822356129&wid=001&eno=01&mid=s00000023244001095000&mc=1',
      trackingPixelUrl: 'https://www12.a8.net/0.gif?a8mat=4BABTG+24SXTE+4ZCO+6IP2P',
      width: 300,
      height: 250,
    },
    {
      id: 'travel-10',
      category: 'travel',
      name: 'じゃらんnet',
      description: '日本最大級の宿・ホテル予約サイト。季節の特集やじゃらん限定プランが盛りだくさん。',
      badge: '国内宿・じゃらん限定',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BABTG+247I7M+14CS+6GZCH',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260822356128&wid=001&eno=01&mid=s00000005230001087000&mc=1',
      trackingPixelUrl: 'https://www17.a8.net/0.gif?a8mat=4BABTG+247I7M+14CS+6GZCH',
      width: 300,
      height: 250,
    },
  ],
};

// 全ジャンルマップ
export const AFFILIATE_GROUPS: Record<AffiliateCategory, BannerGroup> = {
  school: SCHOOL_BANNERS,
  career: CAREER_BANNERS,
  travel: TRAVEL_BANNERS,
};

// 後方互換用エイリアス
export const BUSY_BANNERS = SCHOOL_BANNERS;
export const REWARD_BANNERS = TRAVEL_BANNERS;
