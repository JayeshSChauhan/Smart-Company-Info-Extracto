document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('fetchBtn');
  btn.addEventListener('click', async () => {
    console.log('[Popup] Fetch button clicked');

    // 1. Find the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      console.error('[Popup] No active tab!');
      return;
    }

    // 2. Programmatically inject content.js into the page
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['content.js']
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('[Popup] Injection failed:', chrome.runtime.lastError.message);
          return;
        }
        console.log('[Popup] content.js injected');

        // 3. Now send your message
        chrome.tabs.sendMessage(
          tab.id,
          { action: 'fetchCompanyInfo' },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('[Popup] sendMessage error:', chrome.runtime.lastError.message);
              return;
            }
            console.log('[Popup] Scraped data:', response);

            // 4. Forward to backend
            fetch('http://localhost:5000/api/enrich', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            })
            .then(r => r.json())
            .then(res => console.log('[Backend] Saved:', res))
            .catch(err => console.error('[Backend] Error:', err));
          }
        );
      }
    );
  });
});
