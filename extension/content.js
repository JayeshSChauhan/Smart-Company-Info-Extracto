// content.js
// Visible page marker so you know this script ran:
// document.body.style.border = '5px solid red';

console.log('[Content Script] Loaded on this page');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchCompanyInfo') {
    console.log('[Content Script] Got fetch request');
    // 1. Scrape real fields; update selectors via DevTools:
    const companyName = document
      .querySelector('h1')                        // e.g. the main <h1> on the page
      ?.innerText
      .trim() || '';

    const location = document
      .querySelector('.org-top-card-summary__headquarter') // example class
      ?.innerText
      .trim() || '';

    const website = document
      .querySelector('a.org-top-card-primary-content__website') // hypothetical selector
      ?.href
      .trim() || '';

    // 2. Send back the real data
    sendResponse({ companyName: 'Demo Corp' });
    sendResponse({ companyName, location, website });
  }
  return true;
});

