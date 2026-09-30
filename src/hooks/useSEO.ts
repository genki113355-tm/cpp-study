import { useEffect } from 'react';
import { Chapter } from '../types/curriculum';

interface UseSEOProps {
  currentSlug: string;
  chapter?: Chapter;
}

const STATIC_PAGE_META: Record<string, { title: string; desc: string }> = {
  privacy: {
    title: 'プライバシーポリシー ＆ 免責事項 | シロクマC++ラボ',
    desc: 'シロクマC++ラボのプライバシーポリシー、Google AdSenseによる広告配信、Cookieの取扱い、免責事項、著作権指針について明記しています。',
  },
  about: {
    title: '当サイトについて（運営体制・E-E-A-T・検証環境） | シロクマC++ラボ',
    desc: 'シロクマC++ラボの運営理念、現役エンジニアによる技術監修体制（E-E-A-T）、検証環境（GCC/Clang/MSVC）、教材の品質方針をご紹介します。',
  },
  contact: {
    title: 'お問い合わせ窓口 | シロクマC++ラボ',
    desc: 'シロクマC++ラボへのご質問、教材の誤植・改善要望、取材・技術提携等のお問い合わせはこちらから。',
  },
  sitemap: {
    title: 'サイトマップ（全カリキュラム目録） | シロクマC++ラボ',
    desc: 'シロクマC++ラボで公開中の全52記事（クラシックC++編、モダンC++編、読解演習、技術解説コラム）を一覧できるHTMLサイトマップです。',
  },
};

export const useSEO = ({ currentSlug, chapter }: UseSEOProps) => {
  useEffect(() => {
    const siteBaseTitle = 'シロクマC++ラボ 〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜';
    const siteBaseDesc = 'インベーダーゲーム風の固定画面シューティング開発の実践を通じて、レガシーC++（C++03・生ポインタ）からモダンC++（C++17・スマートポインタ・ECS設計・TDD・UML設計書）までを体系的に学べるオブジェクト指向プログラミング実践学習メディア。';
    const baseUrl = 'https://shirokuma-cpp.jp';

    // 1. タイトルと概要の決定
    let pageTitle = siteBaseTitle;
    let pageDesc = siteBaseDesc;
    let pageUrl = `${baseUrl}/`;

    if (STATIC_PAGE_META[currentSlug]) {
      pageTitle = STATIC_PAGE_META[currentSlug].title;
      pageDesc = STATIC_PAGE_META[currentSlug].desc;
      pageUrl = `${baseUrl}/${currentSlug}`;
    } else if (currentSlug !== 'top' && chapter) {
      pageTitle = `${chapter.title} | シロクマC++ラボ`;
      pageDesc = `${chapter.subtitle}。${chapter.description.slice(0, 120)}...`;
      pageUrl = `${baseUrl}/${chapter.slug}`;
    }

    document.title = pageTitle;

    // 2. メタタグの更新用ヘルパー関数
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/meta\[property="([^"]+)"\]/)?.[1];
          if (prop) el.setAttribute('property', prop);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // 3. 基本メタタグの更新
    setMetaTag('meta[name="description"]', 'content', pageDesc);

    // 4. OGPタグの更新
    setMetaTag('meta[property="og:title"]', 'content', pageTitle);
    setMetaTag('meta[property="og:description"]', 'content', pageDesc);
    setMetaTag('meta[property="og:url"]', 'content', pageUrl);

    // 5. Twitter Cardタグの更新
    setMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', pageDesc);

    // 6. Canonical URLの更新
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', pageUrl);

    // 7. 動的 JSON-LD 構造化データの注入
    let scriptEl = document.getElementById('dynamic-page-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-page-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    if (STATIC_PAGE_META[currentSlug]) {
      const jsonLdGraph = [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          'name': pageTitle,
          'description': pageDesc,
          'url': pageUrl,
          'inLanguage': 'ja',
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'TOP',
                'item': `${baseUrl}/`,
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': STATIC_PAGE_META[currentSlug].title.split('|')[0].trim(),
                'item': pageUrl,
              },
            ],
          },
        },
      ];
      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph,
      });
    } else if (currentSlug !== 'top' && chapter) {
      const jsonLdGraph: any[] = [
        {
          '@type': 'TechArticle',
          '@id': `${pageUrl}#article`,
          'headline': chapter.title,
          'description': chapter.subtitle,
          'inLanguage': 'ja',
          'url': pageUrl,
          'author': {
            '@type': 'Organization',
            'name': 'シロクマC++ラボ',
            'url': baseUrl,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'シロクマC++ラボ',
            'logo': {
              '@type': 'ImageObject',
              'url': `${baseUrl}/images/characters_mission.jpg`,
            },
          },
          'image': `${baseUrl}/images/characters_mission.jpg`,
          'about': {
            '@type': 'ComputerLanguage',
            'name': 'C++',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'TOP',
              'item': `${baseUrl}/`,
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': chapter.badge,
              'item': pageUrl,
            },
          ],
        },
      ];

      // クイズが存在する場合は FAQPage 構造化データを自動追加（検索結果のリッチリザルト展開用）
      if (chapter.quiz && chapter.quiz.length > 0) {
        jsonLdGraph.push({
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          'mainEntity': chapter.quiz.map((q) => ({
            '@type': 'Question',
            'name': q.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `正解：${q.options[q.correctIndex]}。\n解説：${q.explanation}`,
            },
          })),
        });
      }

      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph,
      });
    } else {
      scriptEl.textContent = '';
    }
  }, [currentSlug, chapter]);
};
