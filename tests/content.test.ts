import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allArticles } from '../src/content/articles';
import { articleBodies } from '../src/content/articles/bodies';
import { readingMinutes, wordCount } from '../src/content/articles/types';
import { services } from '../src/content/services';
import { faqs, faqCategories } from '../src/content/faqs';
import { testimonials } from '../src/content/testimonials';
import { stats } from '../src/content/stats';
import { INLINE_JS_FLAG, inlineScriptHash } from '../scripts/lib/html';
import fs from 'node:fs';

describe('content rules', () => {
  it('every article has a body of roughly 600 words and a correct reading time', () => {
    for (const a of allArticles) {
      const body = articleBodies[a.slug];
      if (!body) throw new Error(`${a.slug} has no body`);
      const words = wordCount(body.blocks);
      assert.ok(words >= 500, `${a.slug}: ${words} words`);
      assert.equal(a.readingMinutes, readingMinutes(words), `${a.slug} readingMinutes`);
    }
  });
  it('each service page has 6–10 inclusions, 5–6 FAQs and 3 engagement models', () => {
    for (const s of services) {
      assert.ok(s.included.length >= 6 && s.included.length <= 10, s.slug);
      assert.ok(s.faqs.length >= 5 && s.faqs.length <= 6, s.slug);
      assert.equal(s.engagement.length, 3);
    }
  });
  it('has 20–25 FAQs covering every category, with 5 featured', () => {
    assert.ok(faqs.length >= 20 && faqs.length <= 25);
    for (const c of faqCategories)
      assert.ok(
        faqs.some((f) => f.category === c),
        c,
      );
    assert.equal(faqs.filter((f) => f.featured).length, 5);
  });
  it('sample data stays flagged until replaced', () => {
    assert.ok(testimonials.length >= 6 && testimonials.length <= 9);
    assert.ok(stats.every((s) => typeof s.isSample === 'boolean'));
  });
  it('never promises guaranteed outcomes in positive form', () => {
    const text = JSON.stringify({ services, faqs });
    assert.doesNotMatch(text, /\bguaranteed (admission|placement|publication|acceptance)\b/i);
    assert.doesNotMatch(text, /\b100% (success|placement|acceptance)\b/i);
  });
});

describe('security headers', () => {
  it('CSP in vercel.json and public/_headers contains the inline flag-script hash', () => {
    const hash = inlineScriptHash();
    assert.ok(INLINE_JS_FLAG.length > 0);
    assert.ok(fs.readFileSync('vercel.json', 'utf8').includes(hash), 'vercel.json');
    assert.ok(fs.readFileSync('public/_headers', 'utf8').includes(hash), 'public/_headers');
  });
});
