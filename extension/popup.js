// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const fetchButton = document.getElementById('fetchButton');
  const downloadButton = document.getElementById('downloadButton');

  if (fetchButton) {
    fetchButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchCompanyInfo' }, response => {
          if (!response || response.error) {
            alert('❌ Failed to fetch company info');
            return;
          }

          chrome.storage.local.get({ companies: [] }, result => {
            const updatedCompanies = [...result.companies, response];
            chrome.storage.local.set({ companies: updatedCompanies }, () => {
              alert(`✅ Company info saved!\n📦 Total companies stored: ${updatedCompanies.length}`);
            });
          });
        });
      });
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      chrome.storage.local.get({ companies: [] }, result => {
        const data = result.companies;

        if (!data.length) {
          alert('⚠️ No company data to download.');
          return;
        }

        const csvContent = convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'company_data.csv';
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }
});

function convertToCSV(data) {
  const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  const header = allKeys.join(',');
  const rows = data.map(obj =>
    allKeys.map(key => `"${(obj[key] || '').replace(/"/g, '""')}"`).join(',')
  );
  return [header, ...rows].join('\n');
}

