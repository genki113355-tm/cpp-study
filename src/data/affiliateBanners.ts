export interface A8BannerItem {
  id: string;
  category: 'busy' | 'reward';
  linkUrl: string;
  bannerImgUrl: string;
  trackingPixelUrl: string;
  width: number;
  height: number;
}

export interface BannerGroup {
  type: 'busy' | 'reward';
  title: string;
  subtitle: string;
  mascotSpeaker: 'shirokuma' | 'penguin';
  mascotComment: string;
  banners: A8BannerItem[];
}

// ① 「仕事や勉強で忙しいあなたへ」向けバナー（食材・冷凍食品の宅配サービス 3件）
export const BUSY_BANNERS: BannerGroup = {
  type: 'busy',
  title: '仕事や勉強で忙しいあなたへ。開発・学習に集中できる時短ごはん',
  subtitle: 'プログラミングや勉強で脳をフル回転させた後は、手軽で栄養満点な食事を。電子レンジで温めるだけの冷凍宅配食や食材キットで、自炊の手間を省いて開発時間を最大化！',
  mascotSpeaker: 'shirokuma',
  mascotComment: 'コードを書く頭には上質な栄養が必須じゃ！レンチン数分でサッと食べて、万全のコンディションで開発に没頭するのじゃ！',
  banners: [
    {
      id: 'busy-1',
      category: 'busy',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+BD0U56+5U1E+61Z81',
      bannerImgUrl: 'https://www29.a8.net/svt/bgt?aid=260914580687&wid=002&eno=01&mid=s00000027221001017000&mc=1',
      trackingPixelUrl: 'https://www15.a8.net/0.gif?a8mat=4BCAZ8+BD0U56+5U1E+61Z81',
      width: 300,
      height: 250,
    },
    {
      id: 'busy-2',
      category: 'busy',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+B8USWQ+5VTA+5ZEMP',
      bannerImgUrl: 'https://www26.a8.net/svt/bgt?aid=260914580680&wid=002&eno=01&mid=s00000027451001005000&mc=1',
      trackingPixelUrl: 'https://www19.a8.net/0.gif?a8mat=4BCAZ8+B8USWQ+5VTA+5ZEMP',
      width: 300,
      height: 250,
    },
    {
      id: 'busy-3',
      category: 'busy',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+929L22+3RK+2U0MI9',
      bannerImgUrl: 'https://www27.a8.net/svt/bgt?aid=260914580548&wid=002&eno=01&mid=s00000000488017135000&mc=1',
      trackingPixelUrl: 'https://www11.a8.net/0.gif?a8mat=4BCAZ8+929L22+3RK+2U0MI9',
      width: 300,
      height: 250,
    },
  ],
};

// ② 「勉強を頑張った自分へご褒美を」向けバナー（お取り寄せグルメ 7件）
export const REWARD_BANNERS: BannerGroup = {
  type: 'reward',
  title: '勉強を頑張った自分へご褒美を！極上お取り寄せグルメ',
  subtitle: '難解なC++のポインタや設計、デバッグをやり遂げた達成感とともに。極上の和牛や海の幸、うなぎ・カニで、頑張った自分へ最高のご褒美を！',
  mascotSpeaker: 'penguin',
  mascotComment: '難関章の読破おめでとうございますっ！今夜は贅沢なお肉や海鮮を囲んで、最高の気分で優勝しちゃいましょう〜！！',
  banners: [
    {
      id: 'reward-1',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9CZDY2+26LQ+6FWRL',
      bannerImgUrl: 'https://www23.a8.net/svt/bgt?aid=260914580566&wid=002&eno=01&mid=s00000010187001082000&mc=1',
      trackingPixelUrl: 'https://www18.a8.net/0.gif?a8mat=4BCAZ8+9CZDY2+26LQ+6FWRL',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-2',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9U8YHM+5KSW+5YZ75',
      bannerImgUrl: 'https://www24.a8.net/svt/bgt?aid=260914580595&wid=002&eno=01&mid=s00000026024001003000&mc=1',
      trackingPixelUrl: 'https://www17.a8.net/0.gif?a8mat=4BCAZ8+9U8YHM+5KSW+5YZ75',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-3',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+A7XXEI+4H2M+6BEQ9',
      bannerImgUrl: 'https://www20.a8.net/svt/bgt?aid=260914580618&wid=002&eno=01&mid=s00000020875001061000&mc=1',
      trackingPixelUrl: 'https://www18.a8.net/0.gif?a8mat=4BCAZ8+A7XXEI+4H2M+6BEQ9',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-4',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9ERORE+4UKG+626XT',
      bannerImgUrl: 'https://www24.a8.net/svt/bgt?aid=260914580569&wid=002&eno=01&mid=s00000022624001018000&mc=1',
      trackingPixelUrl: 'https://www15.a8.net/0.gif?a8mat=4BCAZ8+9ERORE+4UKG+626XT',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-5',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9ERORE+4UKG+64Z8X',
      bannerImgUrl: 'https://www27.a8.net/svt/bgt?aid=260914580569&wid=002&eno=01&mid=s00000022624001031000&mc=1',
      trackingPixelUrl: 'https://www13.a8.net/0.gif?a8mat=4BCAZ8+9ERORE+4UKG+64Z8X',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-6',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9FD4D6+3IG8+HXKQP',
      bannerImgUrl: 'https://www28.a8.net/svt/bgt?aid=260914580570&wid=002&eno=01&mid=s00000016388003012000&mc=1',
      trackingPixelUrl: 'https://www14.a8.net/0.gif?a8mat=4BCAZ8+9FD4D6+3IG8+HXKQP',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-7',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9R9SGQ+462S+64Z8X',
      bannerImgUrl: 'https://www26.a8.net/svt/bgt?aid=260914580590&wid=002&eno=01&mid=s00000019450001031000&mc=1',
      trackingPixelUrl: 'https://www11.a8.net/0.gif?a8mat=4BCAZ8+9R9SGQ+462S+64Z8X',
      width: 300,
      height: 250,
    },
    {
      id: 'reward-8',
      category: 'reward',
      linkUrl: 'https://px.a8.net/svt/ejp?a8mat=4BCAZ8+9SGMWI+4OBG+626XT',
      bannerImgUrl: 'https://www24.a8.net/svt/bgt?aid=260914580592&wid=001&eno=01&mid=s00000021814001018000&mc=1',
      trackingPixelUrl: 'https://www10.a8.net/0.gif?a8mat=4BCAZ8+9SGMWI+4OBG+626XT',
      width: 300,
      height: 250,
    },
  ],
};
