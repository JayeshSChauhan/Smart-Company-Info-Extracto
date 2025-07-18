// content.js
console.log('[Content Script] ✅ Injected and running');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'fetchCompanyInfo') return;
  console.log('[Content Script] ⚙️ Starting full scrape…');

  // 1️⃣ Auto‑click About tab
  const aboutLink = Array.from(document.querySelectorAll('a'))
    .find(a => /\/company\/[^\/]+\/(about\/?)?$/.test(a.href) && /about/i.test(a.innerText));
  if (aboutLink) aboutLink.click();

  // 2️⃣ Delay to allow dynamics
  setTimeout(() => {
    // Header info
    const companyName = document.querySelector('h1')?.innerText.trim() || null;
    const tagline = document.querySelector('.org-top-card-summary-info__tagline')?.innerText.trim() || null;

    // 3️⃣ Gather all <dt>/<dd> pairs
    const info = {};
    document.querySelectorAll('dt').forEach(dt => {
      const key = dt.innerText.trim().replace(/\s+/g, ' ');
      const dd = dt.nextElementSibling;
      if (!dd) return;
      let value;
      const links = Array.from(dd.querySelectorAll('a'));
      if (links.length) {
        value = links.map(a => a.href.trim() || a.innerText.trim()).join(', ');
      } else {
        value = dd.innerText.trim();
      }
      info[key] = value || null;
    });

    // 4️⃣ Ensure essential fields
    if (!info['Website']) {
      const ext = Array.from(document.querySelectorAll('a[href^="http"]'))
        .find(a => !a.href.includes('linkedin.com'));
      info['Website'] = ext ? ext.href.trim() : null;
    }
    if (!info['Headquarters'] && info['Location']) {
      info['Headquarters'] = info['Location'];
    }

    // Final payload
    const scrapedData = { companyName, tagline, ...info };
    console.log('[Content Script] ✅ Scraped data:', scrapedData);
    sendResponse(scrapedData);
  }, 3000);

  return true;
});