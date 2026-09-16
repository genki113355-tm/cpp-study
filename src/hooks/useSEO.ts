import { useEffect } from 'react';
import { Chapter } from '../types/curriculum';

interface UseSEOProps {
  currentSlug: string;
  chapter?: Chapter;
}

export const useSEO = ({ currentSlug, chapter }: UseSEOProps) => {
  useEffect(() => {
    const siteBaseTitle = 'シロクマC++ラボ 〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜';
    const siteBaseDesc = 'インベーダーゲーム開発の実践を通じて、レガシーC++（C++03・生ポインタ）からモダンC++（C++17・スマートポインタ・ECS設計・TDD・UML設計書）までを体系的に学べるオブジェクト指向プログラミング実践学習メディア。';
    const baseUrl = 'https://shirokuma-cpp.jp';

    // 1. タイトルと概要の決定
    const pageTitle = currentSlug === 'top' || !chapter
      ? siteBaseTitle
      : `${chapter.title} | シロクマC++ラボ`;
    const pageDesc = currentSlug === 'top' || !chapter
      ? siteBaseDesc
      : `${chapter.subtitle}。${chapter.description.slice(0, 120)}...`;
    const pageUrl = currentSlug === 'top' || !chapter
      ? `${baseUrl}/`
      : `${baseUrl}/${chapter.slug}`;

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

    if (currentSlug !== 'top' && chapter) {
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
            'url': baseUrl
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'シロクマC++ラボ',
            'logo': {
              '@type': 'ImageObject',
              'url': `${baseUrl}/images/characters_mission.jpg`
            }
          },
          'image': `${baseUrl}/images/characters_mission.jpg`,
          'about': {
            '@type': 'ComputerLanguage',
            'name': 'C++'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'TOP',
              'item': `${baseUrl}/`
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': chapter.badge,
              'item': pageUrl
            }
          ]
        }
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
              'text': `正解：${q.options[q.correctIndex]}。\n解説：${q.explanation}`
            }
          }))
        });
      }

      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph
      });
    } else {
      scriptEl.textContent = '';
    }
  }, [currentSlug, chapter]);
};
