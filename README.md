# Smart Company Info Extracto

A Chrome Extension to scrape LinkedIn company profiles (name, location, website, etc.) and export them in one consolidated CSV **entirely in the browser** — no backend needed.

## 🎯 Features

- **One‑click scrape**: From any `linkedin.com/company/...` page  
- **Multi‑field extraction**: Grabs name, tagline, headquarters, website, industry, company size, specialties, founded year, and more  
- **Local storage**: Accumulates multiple company records in Chrome’s storage  
- **CSV download**: Export all stored records to a single `company_data.csv`  

## 🚀 Installation

1. **Download** the `extension/` folder.  
2. In Chrome, go to `chrome://extensions`.  
3. Enable **Developer mode** (top right).  
4. Click **Load unpacked**, then select the `extension/` folder.  
5. Pin the **Smart Company Info Extracto** icon for easy access.

## smart-company-info-extracto/
├── extension/
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── manifest.json
│   └── icons/
│       ├── icon16.pngs
│       ├── icon48.png
│       └── icon128.png
└── README.md

## 🛠️ Usage

1. **Navigate** to a LinkedIn company page, e.g. `https://www.linkedin.com/company/google/`.  
2. Click the **Smart Company Info Extracto** icon.  
3. Hit **“Fetch Company Info”** to scrape and store that company.  
4. Repeat for any other company.  
5. When you’re ready, click **“Download All Companies CSV”** — a single CSV file with all your data will be downloaded.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (git checkout -b feature-xyz)
3. Commit your changes (git commit -m 'Add xyz feature')
4. Push to the branch (git push origin feature-xyz)
5. Open a Pull Request

## Jayesh S Chauhan