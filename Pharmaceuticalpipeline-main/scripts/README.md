# Scripts

This directory contains utility scripts for development and testing.

## Available Scripts

### `test-scraper.mjs`

Test script for the ClinicalTrials.gov scraper.

**Usage:**

```bash
# Node.js (if package.json has type: "module")
node scripts/test-scraper.mjs

# Or using tsx (if you prefer TypeScript)
tsx scripts/test-scraper.mjs
```

**What it does:**

1. Tests connection to ClinicalTrials.gov API
2. Tests connection to Supabase
3. Runs a small test scrape (5 studies) to verify data parsing

**Prerequisites:**

- Set up your `.env` file with Supabase credentials
- Have internet connection (for ClinicalTrials.gov API)

**Output:**

The script will report:
- ✅/❌ API connection status
- ✅/❌ Supabase connection status
- Sample studies from test scrape
- Instructions for running the full scraper

## Adding New Scripts

When adding new utility scripts:

1. Make them executable if they're shell scripts: `chmod +x scripts/your-script.sh`
2. Add TypeScript support using `tsx` if needed
3. Document usage and prerequisites in this README
4. Consider adding npm scripts to `package.json` for convenience
