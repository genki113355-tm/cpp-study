import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const baseUrl = 'https://shirokuma-cpp.jp';
const siteTitle = 'シロクマC++ラボ 〜ゲーム開発で学ぶオブジェクト指向開発 レガシー設計からモダン設計まで〜';
const siteDesc = '1本のインベーダーゲームを10段階でリファクタリングしながら学ぶ！レガシー生ポインタからモダンC++17、ECS設計、TDD、UML設計書、C++基本文法総覧まで完全網羅したオブジェクト指向実践学習メディア。';
const ogImage = `${baseUrl}/images/characters_mission.jpg`;

async function generateSEO() {
  console.log('🚀 Starting SEO Prerender & Sitemap/Feed Generator...');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory does not exist! Please run "vite build" first.');
    process.exit(1);
  }

  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html does not exist!');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Vite を使って TypeScript データを直接インポート
  const server = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { ALL_ARTICLES } = await server.ssrLoadModule('./src/data/chapters.ts');
  await server.close();

  console.log(`📚 Loaded ${ALL_ARTICLES.length} articles from curriculum data.`);

  // 2. 各記事の静的 HTML を生成 (dist/${slug}/index.html)
  for (const article of ALL_ARTICLES) {
    const articleDir = path.join(distDir, article.slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const pageTitle = `${article.title} | シロクマC++ラボ`;
    const pageDesc = `${article.subtitle}。${article.description.slice(0, 130)}...`;
    const pageUrl = `${baseUrl}/${article.slug}`;

    // 構造化データグラフの構築
    const jsonLdGraph = [
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        'headline': article.title,
        'description': article.subtitle,
        'inLanguage': 'ja',
        'url': pageUrl,
        'image': ogImage,
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
            'url': ogImage
          }
        },
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
            'name': article.badge,
            'item': pageUrl
          }
        ]
      }
    ];

    if (article.quiz && article.quiz.length > 0) {
      jsonLdGraph.push({
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        'mainEntity': article.quiz.map((q) => ({
          '@type': 'Question',
          'name': q.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `正解：${q.options[q.correctIndex]}。\n解説：${q.explanation}`
          }
        }))
      });
    }

    const jsonLdString = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': jsonLdGraph
    });

    // 初期セマンティックHTML（JSオフのクローラー・ボット用）
    const initialContent = `
      <div style="max-width: 900px; margin: 40px auto; padding: 20px; font-family: sans-serif; line-height: 1.6; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>${article.badge}</span>
        </nav>
        <h1 style="font-size: 28px; margin-bottom: 12px; color: #ffffff;">${article.title}</h1>
        <p style="font-size: 18px; color: #38bdf8; margin-bottom: 20px;"><strong>${article.subtitle}</strong></p>
        <p style="font-size: 16px; color: #94a3b8; margin-bottom: 30px;">${article.description}</p>
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
        <div style="background: #040810; padding: 20px; border-radius: 12px; border: 1px solid #0ea5e9;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">🐻‍❄️ シロクマC++ラボ インタラクティブ学習システム</h2>
          <p style="color: #cbd5e1;">JavaScriptを実行すると、ブラウザ内インベーダーゲームエミュレータ、メモリマップ可視化、UMLクラス図、対話型解説、理解度クイズが起動します。</p>
          <p><a href="/#${article.slug}" style="display: inline-block; padding: 10px 20px; background: #0284c7; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">インタラクティブ学習を開始する →</a></p>
        </div>
      </div>
    `;

    // HTMLテンプレートの置換
    let pageHtml = baseHtml;

    // Title 置換
    pageHtml = pageHtml.replace(
      /<title>.*?<\/title>/s,
      `<title>${escapeHtml(pageTitle)}</title>`
    );

    // Meta Description 置換
    pageHtml = pageHtml.replace(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(pageDesc)}" />`
    );

    // Canonical URL 置換
    pageHtml = pageHtml.replace(
      /<link rel="canonical" href=".*?" \/>/s,
      `<link rel="canonical" href="${pageUrl}" />`
    );

    // OGP 置換
    pageHtml = pageHtml.replace(
      /<meta property="og:title" content=".*?" \/>/s,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta property="og:description" content=".*?" \/>/s,
      `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta property="og:url" content=".*?" \/>/s,
      `<meta property="og:url" content="${pageUrl}" />`
    );

    // Twitter Card 置換
    pageHtml = pageHtml.replace(
      /<meta name="twitter:title" content=".*?" \/>/s,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta name="twitter:description" content=".*?" \/>/s,
      `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`
    );

    // 構造化データの注入
    pageHtml = pageHtml.replace(
      /<script type="application\/ld\+json">.*?<\/script>/s,
      `<script type="application/ld+json">${jsonLdString}</script>`
    );

    // root 内に初期セマンティックコンテンツを注入
    pageHtml = pageHtml.replace(
      /<div id="root"><\/div>/s,
      `<div id="root">${initialContent}</div>`
    );

    fs.writeFileSync(path.join(articleDir, 'index.html'), pageHtml, 'utf8');
  }

  console.log(`✅ Successfully prerendered all ${ALL_ARTICLES.length} static HTML pages!`);

  // 3. RSS 2.0 フィード (feed.xml) の生成
  const now = new Date().toUTCString();
  const rssItems = ALL_ARTICLES.map((article) => {
    const link = `${baseUrl}/${article.slug}`;
    return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${article.subtitle} - ${article.description}]]></description>
      <category><![CDATA[${article.badge}]]></category>
      <pubDate>${now}</pubDate>
    </item>`;
  }).join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${baseUrl}/</link>
    <description><![CDATA[${siteDesc}]]></description>
    <language>ja</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(distDir, 'feed.xml'), rssFeed, 'utf8');
  const publicFeedPath = path.join(rootDir, 'public', 'feed.xml');
  fs.writeFileSync(publicFeedPath, rssFeed, 'utf8');
  console.log('✅ Generated feed.xml (RSS 2.0)');

  // 4. 最新の sitemap.xml を完全生成（L11含む）
  const sitemapUrls = [
    `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-09-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...ALL_ARTICLES.map((a) => {
      const isGuide = a.category === 'guide' || a.category === 'column';
      const priority = isGuide ? '0.9' : '0.8';
      return `  <url>
    <loc>${baseUrl}/${a.slug}</loc>
    <lastmod>2026-09-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
  ].join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('✅ Generated updated sitemap.xml with 25 articles');

  console.log('🎉 SEO Generation Finished Successfully!');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

generateSEO().catch((err) => {
  console.error('❌ Error generating SEO:', err);
  process.exit(1);
});
