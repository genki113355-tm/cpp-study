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
const siteDesc = '1本のインベーダーゲーム風のゲームを10段階でリファクタリングしながら学ぶ！レガシー生ポインタからモダンC++17、ECS設計、TDD、UML設計書、C++基本文法総覧まで完全網羅したオブジェクト指向実践学習メディア。';
const ogImage = `${baseUrl}/images/characters_mission.jpg`;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const footerNavHtml = `
  <footer style="margin-top: 40px; padding: 24px 20px; border-top: 1px solid #1e293b; background: #070b14; text-align: center; font-size: 13px; color: #94a3b8;">
    <nav aria-label="フッター主要ナビゲーション" style="margin-bottom: 20px;">
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
        <li><a href="/" style="color: #38bdf8; text-decoration: underline;">🏠 ホーム (TOP)</a></li>
        <li><a href="/about" style="color: #38bdf8; text-decoration: underline;">当サイトについて (About)</a></li>
        <li><a href="/privacy" style="color: #38bdf8; text-decoration: underline;">プライバシーポリシー ＆ 免責事項</a></li>
        <li><a href="/contact" style="color: #38bdf8; text-decoration: underline;">お問い合わせ窓口</a></li>
        <li><a href="/sitemap" style="color: #38bdf8; text-decoration: underline;">サイトマップ</a></li>
      </ul>
    </nav>
    <nav aria-label="姉妹メディア公式相互リンク" style="margin-bottom: 20px;">
      <div style="font-weight: bold; color: #cbd5e1; margin-bottom: 8px;">🔗 公式姉妹メディア（相互リンク）</div>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; font-size: 12px;">
        <li><a href="https://shirokuma-auto-cpp.jp/" target="_blank" rel="noopener" style="color: #38bdf8; text-decoration: none;">⚡ シロクマC++自動化ラボ ↗</a></li>
        <li><a href="https://shirokuma-qt-cpp.jp/" target="_blank" rel="noopener" style="color: #34d399; text-decoration: none;">🖥️ シロクマQt×C++ラボ ↗</a></li>
        <li><a href="https://sonar-guide.jp/" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: none;">🌊 水中音響・ソナー技術入門 ↗</a></li>
      </ul>
    </nav>
    <div style="font-size: 12px; color: #64748b;">
      © 2026 シロクマC++ラボ (shirokuma-cpp.jp). All rights reserved.
    </div>
  </footer>
`;

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

  const { ALL_ARTICLES, CLASSIC_CHAPTERS, MODERN_CHAPTERS, READING_CHAPTERS, SPECIAL_GUIDES } = await server.ssrLoadModule('./src/data/chapters.ts');
  await server.close();

  console.log(`📚 Loaded ${ALL_ARTICLES.length} articles from curriculum data.`);

  // ヘルパー: 単一HTMLページの生成・保存
  function renderAndSavePage({ targetDir, pageTitle, pageDesc, pageUrl, jsonLdGraph, rootHtml }) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

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
    const jsonLdString = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': jsonLdGraph
    });
    pageHtml = pageHtml.replace(
      /<script type="application\/ld\+json">.*?<\/script>/s,
      `<script type="application/ld+json">${jsonLdString}</script>`
    );

    // root 内に初期セマンティックコンテンツを注入
    pageHtml = pageHtml.replace(
      /<div id="root">[\s\S]*?<\/div>/s,
      `<div id="root">${rootHtml}</div>`
    );

    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf8');
  }

  // 2. 各カリキュラム記事の静的 HTML を生成 (dist/${slug}/index.html)
  for (const article of ALL_ARTICLES) {
    const articleDir = path.join(distDir, article.slug);
    const pageTitle = `${article.title} | シロクマC++ラボ`;
    const pageDesc = `${article.subtitle}。${article.description.slice(0, 130)}...`;
    const pageUrl = `${baseUrl}/${article.slug}`;

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

    let navLinksHtml = '';
    if (article.prevChapterSlug || article.nextChapterSlug) {
      navLinksHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 30px 0; padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; font-size: 14px;">
          <div>
            ${article.prevChapterSlug ? `<a href="/${article.prevChapterSlug}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">← 前の章へ進む</a>` : '<span style="color: #64748b;">（最初の章）</span>'}
          </div>
          <div>
            ${article.nextChapterSlug ? `<a href="/${article.nextChapterSlug}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">次の章へ進む →</a>` : '<span style="color: #64748b;">（最終章）</span>'}
          </div>
        </div>
      `;
    }

    let sectionsHtml = '';
    if (article.sections && article.sections.length > 0) {
      sectionsHtml = article.sections.map((sec) => {
        let dialogueHtml = '';
        if (sec.dialogueBefore && sec.dialogueBefore.length > 0) {
          dialogueHtml = `
            <div style="margin: 20px 0; display: flex; flex-direction: column; gap: 12px;">
              ${sec.dialogueBefore.map(d => {
                const isShirokuma = d.speaker === 'shirokuma';
                const speakerName = isShirokuma ? '🐻‍❄️ シロクマ先生' : '🐧 ペンギン先輩';
                const borderColor = isShirokuma ? '#0284c7' : '#059669';
                const bgColor = isShirokuma ? '#0c1b33' : '#06281e';
                return `
                  <div style="padding: 14px 18px; border-left: 4px solid ${borderColor}; background: ${bgColor}; border-radius: 8px; font-size: 14px;">
                    <div style="font-weight: bold; color: ${isShirokuma ? '#38bdf8' : '#34d399'}; margin-bottom: 6px;">${speakerName}</div>
                    <div style="color: #e2e8f0; line-height: 1.6;">${escapeHtml(d.text)}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }

        let codeFilesHtml = '';
        if (sec.codeFiles && sec.codeFiles.length > 0) {
          codeFilesHtml = sec.codeFiles.map(cf => `
            <div style="margin: 20px 0; border-radius: 10px; overflow: hidden; border: 1px solid #334155; background: #030712;">
              <div style="padding: 8px 16px; background: #0f172a; border-bottom: 1px solid #1e293b; color: #94a3b8; font-family: monospace; font-size: 12px; font-weight: bold;">
                📄 ${escapeHtml(cf.filename)}
              </div>
              <pre style="margin: 0; padding: 16px; overflow-x: auto; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.5; color: #f8fafc;"><code>${escapeHtml(cf.code)}</code></pre>
            </div>
          `).join('');
        }

        let takeawaysHtml = '';
        if (sec.takeaways && sec.takeaways.length > 0) {
          takeawaysHtml = `
            <div style="margin: 20px 0; padding: 16px; background: #1e1b4b; border: 1px solid #4338ca; border-radius: 10px;">
              <div style="font-weight: bold; color: #a5b4fc; font-size: 14px; margin-bottom: 8px;">💡 このセクションの重要ポイント</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #e0e7ff; line-height: 1.6;">
                ${sec.takeaways.map(t => `<li><strong>${escapeHtml(t.title)}</strong>: ${escapeHtml(t.description)}</li>`).join('')}
              </ul>
            </div>
          `;
        }

        return `
          <section style="margin: 40px 0; padding-bottom: 30px; border-bottom: 1px solid #1e293b;">
            <h2 style="font-size: 22px; color: #38bdf8; margin-bottom: 12px;">${escapeHtml(sec.title)}</h2>
            ${sec.leadText ? `<p style="font-size: 15px; color: #94a3b8; margin-bottom: 16px; line-height: 1.6;">${escapeHtml(sec.leadText)}</p>` : ''}
            ${dialogueHtml}
            ${sec.explanationText ? `<div style="font-size: 15px; color: #cbd5e1; line-height: 1.7; margin: 20px 0;">${escapeHtml(sec.explanationText).replace(/\n/g, '<br/>')}</div>` : ''}
            ${codeFilesHtml}
            ${takeawaysHtml}
          </section>
        `;
      }).join('');
    }

    let quizHtml = '';
    if (article.quiz && article.quiz.length > 0) {
      quizHtml = `
        <section style="margin: 40px 0; padding: 24px; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px;">
          <h2 style="font-size: 20px; color: #fbbf24; margin-top: 0; margin-bottom: 16px;">📝 理解度チェッククイズ</h2>
          ${article.quiz.map((q, qIdx) => `
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed #334155;">
              <div style="font-weight: bold; color: #f8fafc; font-size: 15px; margin-bottom: 10px;">Q${qIdx + 1}. ${escapeHtml(q.question)}</div>
              <ul style="list-style: none; padding: 0; margin: 0 0 12px 0; font-size: 14px; color: #94a3b8;">
                ${q.options.map((opt, oIdx) => `<li style="padding: 4px 0;">${oIdx + 1}. ${escapeHtml(opt)}</li>`).join('')}
              </ul>
              <details style="background: #020617; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #38bdf8; border: 1px solid #1e293b;">
                <summary style="cursor: pointer; font-weight: bold;">正解と解説を見る</summary>
                <div style="margin-top: 8px; color: #cbd5e1; line-height: 1.5;">
                  <strong style="color: #34d399;">正解：${escapeHtml(q.options[q.correctIndex])}</strong><br />
                  ${escapeHtml(q.explanation)}
                </div>
              </details>
            </div>
          `).join('')}
        </section>
      `;
    }

    const initialContent = `
      <div style="max-width: 900px; margin: 40px auto; padding: 20px; font-family: sans-serif; line-height: 1.6; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>${escapeHtml(article.badge)}</span>
        </nav>
        <h1 style="font-size: 28px; margin-bottom: 12px; color: #ffffff;">${escapeHtml(article.title)}</h1>
        <p style="font-size: 18px; color: #38bdf8; margin-bottom: 20px;"><strong>${escapeHtml(article.subtitle)}</strong></p>
        <p style="font-size: 16px; color: #94a3b8; margin-bottom: 30px;">${escapeHtml(article.description)}</p>

        ${navLinksHtml}
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
        ${sectionsHtml}
        ${quizHtml}
        ${navLinksHtml}

        <div style="background: #040810; padding: 20px; border-radius: 12px; border: 1px solid #0ea5e9; margin-top: 40px;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">🐻‍❄️ シロクマC++ラボ インタラクティブ学習システム</h2>
          <p style="color: #cbd5e1;">ブラウザでJavaScriptを有効にすると、ブラウザ内インベーダーゲームエミュレータ、メモリマップ可視化、UMLクラス図、対話型解説、理解度クイズが起動します。</p>
          <p><a href="/#${article.slug}" style="display: inline-block; padding: 10px 20px; background: #0284c7; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">インタラクティブ学習を開始する →</a></p>
        </div>

        ${footerNavHtml}
      </div>
    `;

    renderAndSavePage({
      targetDir: articleDir,
      pageTitle,
      pageDesc,
      pageUrl,
      jsonLdGraph,
      rootHtml: initialContent
    });
  }

  console.log(`✅ Successfully prerendered all ${ALL_ARTICLES.length} static chapter pages!`);

  // 3. 必須固定ページ (privacy, about, contact, sitemap) の静的 HTML 生成
  console.log('📄 Prerendering essential static legal & utility pages...');

  // 3-1. /privacy
  {
    const privacyDir = path.join(distDir, 'privacy');
    const pageTitle = 'プライバシーポリシー ＆ 免責事項 | シロクマC++ラボ';
    const pageDesc = 'シロクマC++ラボのプライバシーポリシー、Google AdSense による広告配信、Cookie の取扱い、免責事項、著作権指針について明記しています。';
    const pageUrl = `${baseUrl}/privacy`;
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
            { '@type': 'ListItem', 'position': 1, 'name': 'TOP', 'item': `${baseUrl}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'プライバシーポリシー ＆ 免責事項', 'item': pageUrl }
          ]
        }
      }
    ];
    const rootHtml = `
      <div style="max-width: 900px; margin: 40px auto; padding: 30px; font-family: sans-serif; line-height: 1.7; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>プライバシーポリシー ＆ 免責事項</span>
        </nav>
        <h1 style="font-size: 28px; color: #ffffff; margin-bottom: 8px;">プライバシーポリシー ＆ 免責事項</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 30px;">制定日: 2026年9月19日 / 最終改定日: 2026年9月30日 / 運営者: シロクマC++ラボ 技術編集部</p>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">1. 広告の配信（Google AdSense 等）について</h2>
          <p>当サイト（https://shirokuma-cpp.jp）では、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。</p>
          <p>Google などの第三者広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他のウェブサイトへのアクセス情報に基づき「Cookie（クッキー）」を使用することがあります。Cookieには氏名、住所、メールアドレス、電話番号などの個人を特定する情報は含まれません。</p>
          <p>Cookie を無効にする方法や Google AdSense に関する詳細・パーソナライズ広告の無効化（オプトアウト）については、<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; font-weight: bold;">Google 広告設定</a> または <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; font-weight: bold;">www.aboutads.info</a> をご参照ください。</p>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">2. アクセス解析ツール（Google アナリティクス）について</h2>
          <p>当サイトでは、サイトの利用状況を把握し、教材コンテンツの品質向上を図るため、Google によるアクセス解析ツール「Google アナリティクス」を使用しています。</p>
          <p>Google アナリティクスはトラフィックデータの収集のために Cookie を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。ブラウザの設定で Cookie を無効にすることで、データ収集を拒否することが可能です。</p>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">3. 免責事項</h2>
          <p>当サイトに掲載されている情報・プログラムコード・解説については、可能な限り正確を期して作成しておりますが、その正確性、安全性、有用性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
          <p style="color: #fbbf24;">※クラシック基礎編等に含まれるレガシー/アンチパターンコードは、設計の破綻やメモリリークを体感するための教育用コードです。プロダクション環境へのコピペ転用はお控えください。</p>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">4. 著作権・商標について</h2>
          <p>当サイトに掲載されている文章、画像、教材プログラムの著作権は、当サイト運営者に帰属します。私的使用その他法律によって明示的に認められる範囲を超えて、無断転載・複製・二次利用することを禁止します。</p>
          <p style="font-size: 13px; color: #94a3b8;">※「スペースインベーダー（SPACE INVADERS）」は株式会社タイトーの登録商標です。当サイトで提供する「RETRO SPACE SHOOTER」等のプログラムおよび解説は、古典的な固定画面シューティングゲームのアルゴリズムやオブジェクト指向設計を自作・学習するための完全オリジナルの教育コンテンツであり、株式会社タイトーとは一切関係ありません。</p>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">5. 技術監修体制（E-E-A-T）</h2>
          <p>当サイトのカリキュラムおよび教材プログラムは、現役の組込みソフトウェア・制御システム開発に従事するC++エンジニアが技術監修を行っています。GCC 13+、Clang 17+、MSVC 2022の主要3大コンパイラにてC++11〜C++20標準規格に準拠したビルドおよび動作検証を行っています。</p>
        </section>

        ${footerNavHtml}
      </div>
    `;
    renderAndSavePage({ targetDir: privacyDir, pageTitle, pageDesc, pageUrl, jsonLdGraph, rootHtml });
  }

  // 3-2. /about
  {
    const aboutDir = path.join(distDir, 'about');
    const pageTitle = '当サイトについて（運営体制・E-E-A-T・検証環境） | シロクマC++ラボ';
    const pageDesc = 'シロクマC++ラボの運営理念、現役エンジニアによる技術監修体制（E-E-A-T）、検証環境（GCC/Clang/MSVC）、教材の品質方針をご紹介します。';
    const pageUrl = `${baseUrl}/about`;
    const jsonLdGraph = [
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#aboutpage`,
        'name': pageTitle,
        'description': pageDesc,
        'url': pageUrl,
        'inLanguage': 'ja'
      }
    ];
    const rootHtml = `
      <div style="max-width: 900px; margin: 40px auto; padding: 30px; font-family: sans-serif; line-height: 1.7; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>当サイトについて (About)</span>
        </nav>
        <h1 style="font-size: 28px; color: #ffffff; margin-bottom: 8px;">シロクマC++ラボについて</h1>
        <p style="color: #38bdf8; font-size: 16px; margin-bottom: 24px;">〜ゲーム開発の実践を通じて学ぶオブジェクト指向設計 レガシー生ポインタからモダンC++17/20・ECS・TDDまで〜</p>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">🎯 ミッションと理念</h2>
          <p>単なる文法暗記ではなく、<strong>「1本のインベーダー風シューティングゲーム（RETRO SPACE SHOOTER）」を10段階でリファクタリングしながら進化させていく実践カリキュラム</strong>を通じて、オブジェクト指向の神髄とモダンC++設計を体系的にマスターできる学習プラットフォームです。</p>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">🛡️ 運営体制・技術監修体制（E-E-A-T）</h2>
          <p>組込み制御ソフトウェア・リアルタイム通信システムの実務開発に従事する現役C++エンジニア陣が企画・執筆・技術監修を担当。「生ポインタ撲滅・RAIIリソース管理・ゼロオーバーヘッド原則」を体系化しています。</p>
          <div style="margin-top: 16px; padding: 16px; background: #030712; border-radius: 8px; border: 1px solid #334155; font-size: 13px;">
            <p><strong>運営組織:</strong> シロクマC++ラボ 技術編集部</p>
            <p><strong>検証コンパイラ:</strong> GCC 13+ / Clang 17+ / MSVC 2022 (C++11〜C++20規格)</p>
            <p><strong>運営拠点:</strong> 日本国内</p>
          </div>
        </section>

        ${footerNavHtml}
      </div>
    `;
    renderAndSavePage({ targetDir: aboutDir, pageTitle, pageDesc, pageUrl, jsonLdGraph, rootHtml });
  }

  // 3-3. /contact
  {
    const contactDir = path.join(distDir, 'contact');
    const pageTitle = 'お問い合わせ窓口 | シロクマC++ラボ';
    const pageDesc = 'シロクマC++ラボへのご質問、教材の誤植・改善要望、取材・技術提携等のお問い合わせはこちらから。';
    const pageUrl = `${baseUrl}/contact`;
    const jsonLdGraph = [
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#contactpage`,
        'name': pageTitle,
        'description': pageDesc,
        'url': pageUrl,
        'inLanguage': 'ja'
      }
    ];
    const rootHtml = `
      <div style="max-width: 900px; margin: 40px auto; padding: 30px; font-family: sans-serif; line-height: 1.7; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>お問い合わせ窓口</span>
        </nav>
        <h1 style="font-size: 28px; color: #ffffff; margin-bottom: 8px;">お問い合わせ窓口</h1>
        <p style="color: #94a3b8; font-size: 15px; margin-bottom: 30px;">シロクマC++ラボに関するご質問、教材コードの誤植報告、改善要望、技術提携のお問い合わせはこちらから受け付けております。</p>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; color: #38bdf8; margin-top: 0;">📬 お問い合わせ方法</h2>
          <p>コードの不具合や改善提案は、GitHub Issue にて公開受付しております：</p>
          <p><a href="https://github.com/genki113355-tm/cpp-study/issues" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; font-weight: bold; text-decoration: underline;">GitHub リポジトリ / Issue 報告 ↗</a></p>
          <p style="margin-top: 16px;">ブラウザでJavaScriptを有効にすると、専用のWebお問い合わせフォームから直接メッセージを送信いただけます。</p>
        </section>

        ${footerNavHtml}
      </div>
    `;
    renderAndSavePage({ targetDir: contactDir, pageTitle, pageDesc, pageUrl, jsonLdGraph, rootHtml });
  }

  // 3-4. /sitemap
  {
    const sitemapDir = path.join(distDir, 'sitemap');
    const pageTitle = 'サイトマップ（全カリキュラム目録） | シロクマC++ラボ';
    const pageDesc = 'シロクマC++ラボで公開中の全52記事（クラシックC++編、モダンC++編、読解演習、技術解説コラム）を一覧できるHTMLサイトマップです。';
    const pageUrl = `${baseUrl}/sitemap`;
    const jsonLdGraph = [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#sitemappage`,
        'name': pageTitle,
        'description': pageDesc,
        'url': pageUrl,
        'inLanguage': 'ja'
      }
    ];

    const classicListHtml = CLASSIC_CHAPTERS.map(ch => `
      <li style="margin-bottom: 8px;">
        <a href="/${ch.slug}" style="color: #fbbf24; font-weight: bold; text-decoration: none;">${escapeHtml(ch.title)}</a>
        <div style="color: #94a3b8; font-size: 12px;">${escapeHtml(ch.subtitle)}</div>
      </li>
    `).join('');

    const modernListHtml = MODERN_CHAPTERS.map(ch => `
      <li style="margin-bottom: 8px;">
        <a href="/${ch.slug}" style="color: #38bdf8; font-weight: bold; text-decoration: none;">${escapeHtml(ch.title)}</a>
        <div style="color: #94a3b8; font-size: 12px;">${escapeHtml(ch.subtitle)}</div>
      </li>
    `).join('');

    const readingListHtml = READING_CHAPTERS.map(ch => `
      <li style="margin-bottom: 8px;">
        <a href="/${ch.slug}" style="color: #c084fc; font-weight: bold; text-decoration: none;">${escapeHtml(ch.title)}</a>
        <div style="color: #94a3b8; font-size: 12px;">${escapeHtml(ch.subtitle)}</div>
      </li>
    `).join('');

    const guideListHtml = SPECIAL_GUIDES.map(g => `
      <li style="margin-bottom: 8px;">
        <a href="/${g.slug}" style="color: #34d399; font-weight: bold; text-decoration: none;">${escapeHtml(g.title)}</a>
        <div style="color: #94a3b8; font-size: 12px;">${escapeHtml(g.subtitle)}</div>
      </li>
    `).join('');

    const rootHtml = `
      <div style="max-width: 900px; margin: 40px auto; padding: 30px; font-family: sans-serif; line-height: 1.7; color: #e2e8f0; background: #0b1322; border-radius: 16px; border: 1px solid #1e293b;">
        <nav style="margin-bottom: 20px; font-size: 14px;">
          <a href="/" style="color: #38bdf8; text-decoration: none;">🏠 TOP</a> / <span>サイトマップ (HTML Sitemap)</span>
        </nav>
        <h1 style="font-size: 28px; color: #ffffff; margin-bottom: 8px;">サイトマップ（全カリキュラム目録）</h1>
        <p style="color: #94a3b8; font-size: 15px; margin-bottom: 30px;">シロクマC++ラボで公開中の全52記事および固定ページ一覧です。</p>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 18px; color: #38bdf8; margin-top: 0;">🏛️ 基本固定ページ</h2>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            <li><a href="/" style="color: #38bdf8;">ホーム (TOP)</a></li>
            <li><a href="/about" style="color: #38bdf8;">当サイトについて (About)</a></li>
            <li><a href="/privacy" style="color: #38bdf8;">プライバシーポリシー ＆ 免責事項</a></li>
            <li><a href="/contact" style="color: #38bdf8;">お問い合わせ窓口</a></li>
            <li><a href="/sitemap" style="color: #38bdf8;">サイトマップ</a></li>
          </ul>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 18px; color: #fbbf24; margin-top: 0;">🏛️ レガシーC++編（全12章）</h2>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            ${classicListHtml}
          </ul>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 18px; color: #38bdf8; margin-top: 0;">🚀 モダンC++編（全14章）</h2>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            ${modernListHtml}
          </ul>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 18px; color: #c084fc; margin-top: 0;">🧭 現場コード読解編（全13章）</h2>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            ${readingListHtml}
          </ul>
        </section>

        <section style="margin-bottom: 30px; padding: 20px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 18px; color: #34d399; margin-top: 0;">📚 特集解説・リファレンス（全13編）</h2>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            ${guideListHtml}
          </ul>
        </section>

        ${footerNavHtml}
      </div>
    `;
    renderAndSavePage({ targetDir: sitemapDir, pageTitle, pageDesc, pageUrl, jsonLdGraph, rootHtml });
  }

  console.log('✅ Successfully prerendered all 4 essential static legal & utility pages!');

  // 4. RSS 2.0 フィード (feed.xml) の生成
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

  // 5. 最新の sitemap.xml を完全生成（固定ページ4件 + 記事52件 + TOP = 計57ページ）
  const staticPageUrls = ['about', 'privacy', 'contact', 'sitemap'].map(slug => `  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const sitemapUrls = [
    `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    staticPageUrls,
    ...ALL_ARTICLES.map((a) => {
      const isGuide = a.category === 'guide' || a.category === 'column';
      const priority = isGuide ? '0.9' : '0.8';
      return `  <url>
    <loc>${baseUrl}/${a.slug}</loc>
    <lastmod>2026-09-30</lastmod>
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
  console.log(`✅ Generated updated sitemap.xml with ${ALL_ARTICLES.length + 5} URLs`);

  console.log('🎉 SEO Generation Finished Successfully!');
}

generateSEO().catch((err) => {
  console.error('❌ Error generating SEO:', err);
  process.exit(1);
});
