# playwright_fetcher.py

from playwright.sync_api import sync_playwright

def fetch_full_company_data(linkedin_url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(linkedin_url, timeout=60000)

        # Wait for About section or company name to load
        page.wait_for_selector('h1')  # Or more specific selector

        # Extract various info (examples)
        data = {
            'name': page.query_selector('h1').inner_text(),
            'location': page.query_selector('[data-test="location"]').inner_text(),
            'website': page.query_selector('[data-test="website"]').get_attribute('href'),
            # Add more selectors here...
        }

        browser.close()
        return data
