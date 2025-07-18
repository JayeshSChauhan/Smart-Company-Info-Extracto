// popup.js

// grab the status div
const status = document.getElementById('status');

document.getElementById('fetchBtn').addEventListener('click', async () => {
  console.log('[Popup] 🔘 Fetch button clicked');
  status.textContent = 'Loading…';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes('linkedin.com/company')) {
    alert('Please navigate to a LinkedIn company profile.');
    status.textContent = 'Error: wrong page';
    return;
  }

  try {
    // inject & message
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    chrome.tabs.sendMessage(tab.id, { action: 'fetchCompanyInfo' }, async (response) => {
      if (chrome.runtime.lastError || !response) {
        console.error('[Popup] ❌ sendMessage error:', chrome.runtime.lastError);
        status.textContent = 'Error fetching data';
        return;
      }

      console.log('[Popup] ✅ Scraped data:', response);

      // send to backend
      const res = await fetch('http://127.0.0.1:5000/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
      const result = await res.json();
      console.log('[Backend] Saved:', result);

      status.textContent = 'Done!';
    });

  } catch (err) {
    console.error('[Popup] Backend error:', err);
    status.textContent = 'Error!';
  }
});
