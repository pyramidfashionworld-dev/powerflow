# PowerFlow Google Sheets Integration - Quick Start

## TL;DR - 5 Steps to Get Running

### Step 1: Upload Excel to Google Sheets (2 min)
- Go to https://sheets.google.com
- Click "New" → "Spreadsheet"
- File → Import → Upload your `Maydisc26_1_.xlsx`
- Select "Create new spreadsheet"

### Step 2: Get Your Sheet ID (1 min)
- Copy from URL: `https://docs.google.com/spreadsheets/d/{COPY_THIS}/edit`
- Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o`

### Step 3: Create API Key (3 min)
1. Go to https://console.cloud.google.com/
2. Create new project: "PowerFlow"
3. APIs & Services → Library → Search "Google Sheets API" → Enable
4. APIs & Services → Credentials → "+ CREATE CREDENTIALS" → API Key
5. Copy the API key: `AIzaSyD...` (long string)

### Step 4: Share Your Sheet (30 sec)
- Open your Google Sheet
- Click Share (top right)
- "Anyone with the link" → Viewer
- Copy the link

### Step 5: Configure PowerFlow (1 min)
Create `.env` file in project root:
```env
VITE_GOOGLE_SHEET_ID=your-sheet-id-from-step-2
VITE_GOOGLE_API_KEY=your-api-key-from-step-3
VITE_SHEET_NAME=Sheet1
VITE_USE_GOOGLE_SHEETS=true
```

**Done!** ✅ Your PowerFlow app now pulls live data from Google Sheets.

---

## Your Data Structure

### Excel File Info
- **File**: `Maydisc26_1_.xlsx`
- **Records**: 934 consumers
- **Agencies**: Annapurna (and others from Sheet2, Sheet3)

### Column Mapping
```
Excel          →  PowerFlow
─────────────────────────────
SL NO          →  (ignored)
Consumer Id    →  id, consumerId
Name           →  name
Address        →  address
B/C            →  billingCategory, phaseClass (inferred)
Meter          →  meterCode
Due date Range →  dueDateStart, dueDateEnd (parsed)
Net O/S        →  outstandingDues
Mobile Number  →  mobile
Agency         →  agency
```

### Auto-Generated Fields
- **deviceId**: Generated from consumer ID (e.g., DEV-0983)
- **phaseClass**: Inferred from B/C column (1/2/3-Phase)
- **status**: Auto-assigned based on outstanding dues:
  - dues > ₹5,000 → disconnected
  - dues > ₹0 → pending
  - dues = ₹0 → connected

---

## How It Works

### Data Flow Diagram
```
Your Google Sheet
       ↓
Google Sheets API v4 (reads data)
       ↓
googleSheetsService.js (transforms + validates)
       ↓
Consumer Hub Page (displays in grid/table)
       ↓
Browser Cache (5 min TTL for performance)
```

### Auto-Refresh Strategy
- **On Load**: Fetches from Google Sheets (or uses cache if < 5 min old)
- **Manual Refresh**: Click "Refresh" button to force new fetch
- **Status Updates**: Stored locally in browser (doesn't modify Google Sheet)
- **Cache Duration**: 5 minutes (configurable in googleSheetsService.js)

---

## File Changes Made

### New Files
```
powerflow/
├── src/
│   ├── services/
│   │   └── googleSheetsService.js    ← Google Sheets integration
│   ├── utils/
│   │   └── dataImport.js             ← Data transformation utilities
│   └── pages/
│       └── ConsumerHubGoogleSheets.jsx ← New consumer page
├── .env.example                      ← Template for config
└── GOOGLE_SHEETS_SETUP.md            ← Detailed setup guide
```

### To Use the New Page
Update `src/App.jsx`:
```jsx
// Before:
import ConsumerHub from './pages/ConsumerHub'

// After:
import ConsumerHub from './pages/ConsumerHubGoogleSheets'
```

Or rename the file:
```bash
mv src/pages/ConsumerHubGoogleSheets.jsx src/pages/ConsumerHub.jsx
```

---

## Testing

### Step 1: Check Console for Errors
Press `F12` → Console tab → Look for red errors

### Step 2: Manual API Test
In your browser console:
```javascript
// Test fetching from Google Sheets
import { fetchConsumersFromSheet } from './src/services/googleSheetsService'
const data = await fetchConsumersFromSheet()
console.log(data) // Should show your consumers
```

### Step 3: Verify Data Loading
- Open Consumer Hub page
- Should see blue banner: "📊 Data synced from Google Sheets"
- Should display all 934+ consumers
- Agency filter should auto-populate with your agencies

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| "Google Sheet ID not configured" | Check `.env` file has `VITE_GOOGLE_SHEET_ID` |
| "API error: 403" | Check API key is valid & Google Sheets API is enabled |
| "No data showing" | Click "Refresh" button • Check sheet is publicly accessible |
| "Mobile numbers look weird" | This is normal for large phone numbers stored as floats in Excel |
| "Status all wrong" | The auto-assignment is based on outstanding dues • Modify `getStatusFromDues()` in googleSheetsService.js if needed |

---

## Customization

### Change Status Logic
Edit `googleSheetsService.js` → `getStatusFromDues()`:
```javascript
function getStatusFromDues(dues) {
  if (dues > 3000) return 'disconnected'  // Changed from 5000
  if (dues > 0) return 'pending'
  return 'connected'
}
```

### Change Cache Duration
Edit `googleSheetsService.js` → `CACHE_DURATION`:
```javascript
const CACHE_DURATION = 10 * 60 * 1000  // Changed from 5 to 10 minutes
```

### Add More Agencies
Update Google Sheet with new agency names → App auto-detects them

### Custom Field Mapping
Edit `parseConsumerData()` in googleSheetsService.js to add custom logic

---

## Common Questions

**Q: Will it work offline?**
A: Only if you've already loaded the data (it's cached for 5 min)

**Q: Can I edit data in the app?**
A: Yes, but changes are stored locally (not reflected in Google Sheet)

**Q: How many consumers can it handle?**
A: Tested with 934+, should work with thousands

**Q: Can multiple people edit the Google Sheet?**
A: Yes! Changes will be fetched when the app refreshes

**Q: Is my API key visible to users?**
A: No, it's only used in the browser and isn't stored anywhere

---

## Security Notes

- ✅ API key is used only by the browser (not sent to any other server)
- ✅ .env file is NOT pushed to Git (add to .gitignore)
- ✅ Google Sheet is read-only from the app (no modifications)
- ⚠️ Keep your API key secret - don't share it

For production, consider:
- Using Google Cloud restrictions on API key (IP whitelist)
- Implementing a backend proxy
- Using service accounts instead of API keys

---

## Next Steps

1. **Complete Setup**: Follow the 5-step TL;DR above
2. **Test**: Load the app and check Consumer Hub
3. **Customize**: Modify status logic, date formats, etc as needed
4. **Deploy**: Push to production (remember to add .env to secrets)
5. **Maintain**: Keep Google Sheet updated, monitor API usage

---

## Support Resources

- **Google Sheets API Docs**: https://developers.google.com/sheets/api
- **Setup Guide**: `GOOGLE_SHEETS_SETUP.md` (full details)
- **Code Files**: 
  - `src/services/googleSheetsService.js` (main integration)
  - `src/pages/ConsumerHubGoogleSheets.jsx` (UI)
  - `src/utils/dataImport.js` (data utilities)

---

## Version Info

- PowerFlow with Google Sheets Integration v1.0
- Tested with: React 18.2, Vite 4.x
- Google Sheets API v4
- Data: 934 consumer records from Maydisc26_1_.xlsx

Good luck! 🚀
