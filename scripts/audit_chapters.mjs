import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runAudit() {
  const server = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { ALL_ARTICLES } = await server.ssrLoadModule('./src/data/chapters.ts');
  const { CODING_CHALLENGES } = await server.ssrLoadModule('./src/data/codingChallenges.ts');
  const { STEP_BY_STEP_LABS } = await server.ssrLoadModule('./src/data/stepByStepLabs.ts');
  await server.close();

  console.log(`Total ALL_ARTICLES: ${ALL_ARTICLES.length}`);

  let stats = {
    total: ALL_ARTICLES.length,
    withGame: 0,
    withoutGame: 0,
    withLab: 0,
    withChallenge: 0,
    withBothPractice: 0,
    withNoPractice: 0,
    withQuiz: 0,
    withoutQuiz: 0,
  };

  const issues = [];
  const trackCounts = {};

  ALL_ARTICLES.forEach((ch, idx) => {
    const track = ch.courseTrack || ch.category || 'unknown';
    trackCounts[track] = (trackCounts[track] || 0) + 1;

    const hasGame = Boolean(ch.gameVersion && ch.gameVersion !== 'none');
    const hasLab = Boolean(STEP_BY_STEP_LABS[ch.slug]);
    const hasChallenge = Boolean(CODING_CHALLENGES[ch.slug]);
    const hasQuiz = Boolean(ch.quiz && ch.quiz.length > 0);

    if (hasGame) stats.withGame++; else stats.withoutGame++;
    if (hasLab) stats.withLab++;
    if (hasChallenge) stats.withChallenge++;
    if (hasLab && hasChallenge) stats.withBothPractice++;
    if (!hasLab && !hasChallenge) stats.withNoPractice++;
    if (hasQuiz) stats.withQuiz++; else stats.withoutQuiz++;

    // 1. セクションが存在するか
    if (!ch.sections || ch.sections.length === 0) {
      issues.push(`[${ch.slug}] No sections found`);
    }

    // 2. 次・前スラッグの妥当性
    if (ch.nextChapterSlug) {
      const nextExists = ALL_ARTICLES.some(c => c.slug === ch.nextChapterSlug);
      if (!nextExists) {
        issues.push(`[${ch.slug}] nextChapterSlug "${ch.nextChapterSlug}" does not exist in ALL_ARTICLES`);
      }
    }
    if (ch.prevChapterSlug) {
      const prevExists = ALL_ARTICLES.some(c => c.slug === ch.prevChapterSlug);
      if (!prevExists) {
        issues.push(`[${ch.slug}] prevChapterSlug "${ch.prevChapterSlug}" does not exist in ALL_ARTICLES`);
      }
    }

    // 3. クイズの選択肢と正解インデックスの妥当性
    if (ch.quiz) {
      ch.quiz.forEach((q, qIdx) => {
        if (!q.options || q.options.length < 2) {
          issues.push(`[${ch.slug}] Quiz ${q.id || qIdx}: Less than 2 options`);
        }
        if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          issues.push(`[${ch.slug}] Quiz ${q.id || qIdx}: Invalid correctIndex ${q.correctIndex} (options: ${q.options?.length})`);
        }
      });
    }
  });

  console.log('\n--- Track Counts ---');
  console.log(JSON.stringify(trackCounts, null, 2));

  console.log('\n--- Summary Stats ---');
  console.log(JSON.stringify(stats, null, 2));

  console.log('\n--- Detailed Chapter Breakdown ---');
  ALL_ARTICLES.forEach((ch, i) => {
    const hasGame = Boolean(ch.gameVersion && ch.gameVersion !== 'none');
    const hasLab = Boolean(STEP_BY_STEP_LABS[ch.slug]);
    const hasChallenge = Boolean(CODING_CHALLENGES[ch.slug]);
    const hasQuiz = Boolean(ch.quiz && ch.quiz.length > 0);
    const quizCount = ch.quiz?.length || 0;
    const secCount = ch.sections?.length || 0;
    console.log(`${String(i+1).padStart(2, '0')}. [${ch.courseTrack || ch.category}] ${ch.slug} | Sec:${secCount} | Game:${hasGame ? ch.gameVersion : 'no'} | Lab:${hasLab ? 'YES' : 'no'} | CodeChal:${hasChallenge ? 'YES' : 'no'} | Quiz:${quizCount}`);
  });

  if (issues.length > 0) {
    console.log('\n--- Issues Found (' + issues.length + ') ---');
    issues.forEach(iss => console.log('  ⚠️ ' + iss));
  } else {
    console.log('\n✅ No broken links, empty sections, or invalid quiz indexes found!');
  }
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
});
