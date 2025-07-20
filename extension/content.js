// // content.js

console.log('[Content Script] ✅ Injected');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'fetchCompanyInfo') return;

  console.log('[Content Script] ⚙️ Scraping started…');

  const aboutLink = Array.from(document.querySelectorAll('a'))
    .find(a => /\/company\/[^\/]+\/(about\/?)?$/.test(a.href) && /about/i.test(a.innerText));
  if (aboutLink) aboutLink.click();

  setTimeout(() => {
    try {
      const companyName = document.querySelector('h1')?.innerText.trim() || null;
      const tagline = document.querySelector('.org-top-card-summary-info__tagline')?.innerText.trim() || null;

      const info = {};
      document.querySelectorAll('dt').forEach(dt => {
        const key = dt.innerText.trim().replace(/\s+/g, ' ');
        const dd = dt.nextElementSibling;
        if (!dd) return;
        let value;
        const links = Array.from(dd.querySelectorAll('a'));
        value = links.length ? links.map(a => a.href || a.innerText).join(', ') : dd.innerText.trim();
        info[key] = value || null;
      });

      if (!info['Website']) {
        const ext = Array.from(document.querySelectorAll('a[href^="http"]'))
          .find(a => !a.href.includes('linkedin.com'));
        info['Website'] = ext ? ext.href.trim() : null;
      }

      if (!info['Headquarters'] && info['Location']) {
        info['Headquarters'] = info['Location'];
      }

      info['LinkedIn URL'] = window.location.href;
      info['Scraped At'] = new Date().toISOString();

      const scrapedData = { companyName, tagline, ...info };
      console.log('[Content Script] ✅ Scraped data:', scrapedData);
      sendResponse(scrapedData);
    } catch (err) {
      console.error('[Content Script] ❌ Error during scrape:', err);
      sendResponse({ error: 'Scraping failed' });
    }
  }, 2500);

  return true;
});
