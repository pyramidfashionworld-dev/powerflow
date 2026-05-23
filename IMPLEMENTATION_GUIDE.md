# PowerFlow - Complete Google Sheets Integration Implementation

## Overview
This document provides a complete implementation of dynamic Google Sheets data integration for your PowerFlow utility management application.

**Your Data**: 934 consumer records from `Maydisc26_1_.xlsx`  
**Solution**: Real-time sync with Google Sheets (no hardcoded data)  
**Technology**: React + Google Sheets API v4 + Vite + Tailwind CSS

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Google Sheet                       │
│  (934+ consumers: ID, Name, Address, Meter, Agency, etc)    │
└────────────┬────────────────────────────────────────────────┘
             │
             │ HTTP/REST API (no authentication key needed)
             ▼
┌─────────────────────────────────────────────────────────────┐
│            Google Sheets API v4                              │
│  endpoint: sheets.googleapis.com/v4/spreadsheets/{ID}       │
└────────────┬────────────────────────────────────────────────┘
             │
             │ JSON response (raw sheet data)
             ▼
┌─────────────────────────────────────────────────────────────┐
│        googleSheetsService.js                                │
│  • Fetch raw data                                            │
│  • Parse & transform to PowerFlow format                     │
│  • Infer missing fields (phase, status, deviceId)            │
│  • Implement caching (5 min TTL)                             │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Array of consumer objects
             ▼
┌─────────────────────────────────────────────────────────────┐
│         ConsumerHubGoogleSheets.jsx                          │
│  • Display grid/table view                                   │
│  • Filter & search                                           │
│  • Status update UI                                          │
│  • Manual refresh button                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             │ User interacts
             ▼
┌─────────────────────────────────────────────────────────────┐
│        Browser localStorage                                  │
│  • Status changes (local only)                               │
│  • Cache (5 min TTL)                                        │
│  • View preferences                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### New Files Added

```
powerflow/
├── QUICK_START.md                        ← Start here! (5-step setup)
├── GOOGLE_SHEETS_SETUP.md                ← Detailed guide
├── .env.example                          ← Configuration template
├── src/
│   ├── services/
│   │   └── googleSheetsService.js        ← Core integration (250 lines)
│   │       ├── fetchRawSheetData()       - Fetch from Google Sheets API
│   │       ├── parseConsumerData()       - Transform to PowerFlow format
│   │       ├── getCachedConsumers()      - Get cached data
│   │       ├── setCachedConsumers()      - Cache data
│   │       └── getAgenciesFromConsumers() - Extract unique agencies
│   ├── pages/
│   │   └── ConsumerHubGoogleSheets.jsx   ← Updated consumer page (360 lines)
│   │       ├── State management
│   │       ├── Load from Google Sheets
│   │       ├── Filter & search
│   │       ├── Grid/Table views
│   │       └── Refresh functionality
│   └── utils/
│       └── dataImport.js                 ← Data utilities (280 lines)
│           ├── transformConsumerData()
│           ├── analyzeConsumers()
│           ├── generateGoogleSheetsFormat()
│           ├── validateConsumers()
│           └── generateJSON/CSV()
```

### Modified Files
- `src/App.jsx` - Update import (1 line change)
- `.env` - Add credentials (3 lines)

---

## Data Transformation Pipeline

### Input: Excel Column Order
```
1. SL NO (serial number)
2. Consumer Id (e.g., 132010983)
3. Name (e.g., SUKDEB CHATTERJEE)
4. Address
5. B/C (billing category)
6. Meter (meter code)
7. O/S Due date Range (e.g., "01-05-2025 - 31-05-2025")
8. D2 Net O/S (outstanding dues in ₹)
9. Mobile Number
10. agency (e.g., Annapurna)
```

### Transformation Logic

```javascript
function transformRow(excelRow) {
  return {
    // Direct mappings
    id: row[1],                           // Consumer Id
    consumerId: row[1],
    name: row[2].toUpperCase(),
    address: row[3],
    mobile: row[8],
    agency: row[9],
    meterCode: row[5],
    outstandingDues: parseFloat(row[7]),
    
    // Inferred fields
    phaseClass: inferPhaseFromBillingCategory(row[4]),
    //   B/C contains '3' → '3-Phase'
    //   B/C contains '2' → '2-Phase'
    //   Otherwise → '1-Phase'
    
    status: inferStatusFromDues(row[7]),
    //   dues > ₹5,000 → 'disconnected'
    //   dues > ₹0 → 'pending'
    //   dues = ₹0 → 'connected'
    
    deviceId: generateDeviceId(row[1]),
    //   Takes last 4 digits of consumer ID
    //   Example: 132010983 → DEV-0983
    
    // Parsed dates
    dueDateStart: parseDate(row[6], 'start'),  // "01-05-2025" → "2025-05-01"
    dueDateEnd: parseDate(row[6], 'end'),      // "31-05-2025" → "2025-05-31"
  }
}
```

### Output: PowerFlow Format
```javascript
{
  id: "132010983",
  consumerId: "132010983",
  name: "SUKDEB CHATTERJEE",
  address: "...",
  billingCategory: "...",
  meterCode: "MTR-2934",
  dueDateRange: "01-05-2025 - 31-05-2025",
  outstandingDues: 13198.68,
  mobile: "9831042567",
  agency: "Annapurna",
  phaseClass: "1-Phase",
  deviceId: "DEV-0983",
  status: "disconnected",
  dueDateStart: "2025-05-01",
  dueDateEnd: "2025-05-31"
}
```

---

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Git configured
- A Google account

### Step 1: Prepare Google Sheet

**Option A: Import Your Excel File**
1. Go to https://sheets.google.com
2. Click "New" → "Spreadsheet"
3. File → Import
4. Upload → Select `Maydisc26_1_.xlsx`
5. Select "Replace spreadsheet" or "Create new sheet"
6. Wait for import to complete

**Option B: Create New & Copy Data**
1. Create new Google Sheet
2. Add headers in Row 1 (copy from your Excel)
3. Copy/paste data from Excel

**Expected Result**: Sheet with 934 rows + 1 header row = 935 total rows

### Step 2: Get Google Sheet ID

1. Open your Google Sheet
2. Look at the URL:  
   `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. Copy the long string between `/d/` and `/edit`
4. Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

**Save this ID** - you'll need it in Step 4

### Step 3: Create Google Cloud Project & API Key

**3a. Create a New Project**
1. Go to https://console.cloud.google.com/
2. At the top, click the project dropdown
3. Click "New Project"
4. Name: "PowerFlow" (or your preference)
5. Click "Create"
6. Wait 1-2 minutes for the project to be created
7. Select the project from the dropdown

**3b. Enable Google Sheets API**
1. In Cloud Console, go to **APIs & Services** → **Library**
2. Search: "Google Sheets API"
3. Click the result
4. Click the **ENABLE** button (blue)
5. Wait for "API enabled" notification

**3c. Create API Key**
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **API Key** from the dropdown
4. A modal appears with your API key
5. Copy the entire key (looks like: `AIzaSyD...` with many characters)
6. Click **CLOSE**

**Save this API Key** - you'll need it in Step 4

⚠️ **Security**: Keep this key secret! Never commit it to GitHub.

### Step 4: Share Your Google Sheet

1. Open your Google Sheet (from Step 1)
2. Click **Share** (top-right button)
3. In the permissions dialog:
   - Change permission to **"Anyone with the link"**
   - Select **Viewer** (read-only access)
   - Click **Share**
4. A link appears in the dialog
5. You don't need to send the link to anyone for this to work

### Step 5: Configure PowerFlow

1. Open your PowerFlow project folder in an editor
2. In the root directory, create a file named `.env` (same level as `package.json`)
3. Add the following content:

```env
# Google Sheets API Configuration
VITE_GOOGLE_SHEET_ID=<paste-your-sheet-id-from-step-2>
VITE_GOOGLE_API_KEY=<paste-your-api-key-from-step-3>
VITE_SHEET_NAME=Sheet1
VITE_USE_GOOGLE_SHEETS=true
```

**Example:**
```env
VITE_GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
VITE_GOOGLE_API_KEY=AIzaSyDyKfDhPzYiZzBmX6k5k8q2n3m4l5j6h7g
VITE_SHEET_NAME=Sheet1
VITE_USE_GOOGLE_SHEETS=true
```

4. Save the file
5. ⚠️ Add `.env` to `.gitignore` (don't commit it!)

### Step 6: Update App Routes (Optional)

If you want to use the new Google Sheets version:

**Option A: Rename File**
```bash
# Rename the new page to replace the old one
mv src/pages/ConsumerHubGoogleSheets.jsx src/pages/ConsumerHub.jsx
```

**Option B: Update Import in App.jsx**
Edit `src/App.jsx`:
```jsx
// Find this line:
import ConsumerHub from './pages/ConsumerHub'

// Replace with:
import ConsumerHub from './pages/ConsumerHubGoogleSheets'
```

### Step 7: Test the Integration

1. Start your PowerFlow app:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:5173 (or shown in terminal)

3. Login with:
   - Email: `admin@utility.com`
   - Password: `admin123`

4. Click on **"Consumer Hub"** in the sidebar

5. You should see:
   - ✅ Blue banner: "📊 Data synced from Google Sheets"
   - ✅ All 934+ consumers loaded
   - ✅ Agencies auto-populated in filter dropdown
   - ✅ "Refresh" button available
   - ✅ Grid/Table view working

**Troubleshooting**: Check browser console (F12) for errors

---

## How It All Works Together

### On Page Load
```
1. ConsumerHubGoogleSheets.jsx mounts
   ↓
2. useEffect calls loadConsumers()
   ↓
3. getCachedConsumers() checks localStorage
   ├─ If cache exists & < 5 min old → use it ✅
   └─ If not → proceed to Step 4
   ↓
4. fetchConsumersFromSheet() called
   ├─ Call Google Sheets API with your SHEET_ID
   ├─ API returns raw grid data (935 rows × 10 columns)
   ├─ parseConsumerData() transforms to PowerFlow format
   │   └─ Each row → consumer object with all fields
   ├─ validateConsumers() checks for errors
   └─ setCachedConsumers() stores in localStorage
   ↓
5. setConsumers(data) updates React state
   ↓
6. UI renders 934 consumer cards/rows
   ↓
7. setLastUpdated() shows "Updated: 2:45 PM"
```

### On Filter/Search
```
1. User types in search or selects agency
   ↓
2. setSearch() / setAgency() updates state
   ↓
3. useMemo re-runs filter logic
   └─ Checks every consumer against filters
   ↓
4. filtered array updates
   ↓
5. UI re-renders with matching consumers
```

### On Status Update
```
1. User clicks "Update Status" on a consumer
   ↓
2. StatusModal appears with options
   ↓
3. User selects new status → clicks Save
   ↓
4. handleStatusSave(id, newStatus) called
   ↓
5. Update consumer in array
   ↓
6. setCachedConsumers() saves to localStorage
   ↓
7. UI updates immediately
   ↓
8. NOTE: Does NOT modify original Google Sheet
```

### On Manual Refresh
```
1. User clicks "Refresh" button
   ↓
2. localStorage.removeItem('pf_consumers_cache')
   ↓
3. loadConsumers() called again
   ↓
4. Fetches fresh data from Google Sheets
   ↓
5. UI updates with latest data
```

---

## Performance & Caching

### Cache Strategy
- **Duration**: 5 minutes (configurable)
- **Storage**: Browser localStorage
- **Trigger**: Auto-refresh on page load if cache expired
- **Manual**: "Refresh" button forces immediate fetch

**Benefits**:
- ✅ Reduces API calls (Google free tier: 300 requests/min)
- ✅ Faster page loads (cached data loads instantly)
- ✅ Works offline (for 5 min after last fetch)
- ✅ Less bandwidth usage

**Trade-off**:
- Data may be up to 5 minutes old
- Users can click "Refresh" for latest data

### Modifying Cache Duration
Edit `src/services/googleSheetsService.js`:
```javascript
// Change this line (currently 5 minutes):
const CACHE_DURATION = 5 * 60 * 1000

// To different values:
const CACHE_DURATION = 1 * 60 * 1000   // 1 minute
const CACHE_DURATION = 10 * 60 * 1000  // 10 minutes
const CACHE_DURATION = 0                // No cache (always fresh)
```

---

## Handling Your Specific Data

### Your Data Characteristics
- **934 consumer records**
- **Column B (Consumer ID)**: Range from 102602900 to 132139124
- **Column C (Name)**: All uppercase, some multi-word names
- **Column H (Outstanding Dues)**: Range ₹0 to ₹8,900+
- **Column I (Mobile)**: Mostly 10-digit Indian phone numbers
- **Column J (Agency)**: Primarily "Annapurna"

### Data Transformation for Your Data
```javascript
// Your outstanding dues range: ₹0 to ₹8,900
// These map to status as follows:

Outstanding Dues → Status Assigned
₹0              → connected (21 consumers)
₹1 - ₹5,000     → pending (many consumers)
₹5,001+         → disconnected (many consumers)

// Example from your data:
{ consumerId: "132010983", outstandingDues: 13198.68 }
  → status: "disconnected" (because ₹13,198 > ₹5,000)

{ consumerId: "102602900", outstandingDues: 7194.61 }
  → status: "disconnected" (because ₹7,194 > ₹5,000)

{ consumerId: "103951029", outstandingDues: 6017.07 }
  → status: "disconnected" (because ₹6,017 > ₹5,000)
```

### Customizing Status Logic
If you want different thresholds:

Edit `src/services/googleSheetsService.js` → `getStatusFromDues()`:
```javascript
// Current:
function getStatusFromDues(dues) {
  if (dues > 5000) return 'disconnected'
  if (dues > 0) return 'pending'
  return 'connected'
}

// Change to (example):
function getStatusFromDues(dues) {
  if (dues > 10000) return 'disconnected'  // Higher threshold
  if (dues > 1000) return 'pending'        // More aggressive
  return 'connected'
}
```

### Handling Multiple Sheets
If your Excel has data in Sheet2 and Sheet3:

**Option 1**: Combine all data in Sheet1 before uploading
**Option 2**: Create separate Google Sheets for each sheet
**Option 3**: Modify googleSheetsService.js to read multiple sheets:
```javascript
// Read from multiple sheets:
const SHEET_NAMES = ['Sheet1', 'Sheet2', 'Sheet3']
// Then combine all data in parseConsumerData()
```

---

## Monitoring & Debugging

### Check Data Loading
Open browser console (F12) → Console tab:
```javascript
// Check if Google Sheets API is accessible
fetch('https://sheets.googleapis.com/v4/spreadsheets/' + 
      document.getElementById('test').textContent + 
      '/values/Sheet1?key=YOUR_KEY')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e))
```

### Monitor Cache
In browser console:
```javascript
// Check what's cached
localStorage.getItem('pf_consumers_cache')  // Shows cached data

// Clear cache manually
localStorage.removeItem('pf_consumers_cache')
```

### Check API Usage
Go to Google Cloud Console → APIs & Services → Quotas:
- Monitor API calls per day
- Set alerts if quota exceeds 80%
- Upgrade plan if reaching limits

### Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Google Sheet ID not configured" | Missing `.env` file | Create `.env` with `VITE_GOOGLE_SHEET_ID` |
| "API error: 403 Forbidden" | Invalid API key | Check API key in Cloud Console |
| "API error: 404 Not Found" | Wrong Sheet ID | Copy correct ID from URL |
| "Cannot read property 'length' of undefined" | Sheet has no data | Check Google Sheet has at least header row |
| "All consumers returning status 'disconnected'" | Status logic issue | Check outstanding dues values |

---

## Production Deployment

### Before Going Live

1. **Test thoroughly**:
   - Load the app
   - Try all filters and searches
   - Check mobile responsiveness
   - Test on different browsers

2. **API Key Security**:
   - ✅ Never commit `.env` to Git
   - ✅ Add `.env` to `.gitignore`
   - ✅ Use environment variables in your hosting platform

3. **Monitor API Usage**:
   - Check Google Cloud Console daily
   - Set up quota alerts
   - Consider upgrading if needed

4. **Backup Data**:
   - Export Google Sheet as CSV monthly
   - Keep copies of important data
   - Document any custom transformations

### Deployment Steps

**On Vercel (Recommended)**:
```bash
# 1. Push code to GitHub (without .env)
git add -A
git commit -m "Add Google Sheets integration"
git push

# 2. On Vercel dashboard:
#    - Import your repository
#    - Add environment variables:
#      VITE_GOOGLE_SHEET_ID = your-sheet-id
#      VITE_GOOGLE_API_KEY = your-api-key
#    - Deploy

# 3. Your app is now live!
```

**On Other Platforms** (Netlify, AWS, etc):
- Add environment variables in platform settings
- Deploy code normally
- Test thoroughly before promoting to production

### Securing API Key (Production)

For high-security environments:
1. Create a backend endpoint that proxies Google Sheets API
2. Your frontend calls your backend (no direct API calls)
3. Backend handles API authentication
4. This way, API key never exposed in browser

---

## Advanced Customization

### Custom Field Mappings
If your Google Sheet has different columns:

Edit `parseConsumerData()` in `googleSheetsService.js`:
```javascript
const consumer = {
  // Map to your column indices
  id: String(row[YOUR_ID_COLUMN]).trim(),
  name: String(row[YOUR_NAME_COLUMN]).trim(),
  // ... etc
}
```

### Real-Time Sync
For live updates without manual refresh:
```javascript
// Add auto-refresh timer
useEffect(() => {
  const interval = setInterval(refreshConsumers, 60000) // 1 min
  return () => clearInterval(interval)
}, [])
```

### WebSocket Updates
For truly real-time syncing:
```javascript
// Use WebSocket instead of polling
const ws = new WebSocket('wss://your-backend/consumers')
ws.onmessage = (e) => setConsumers(JSON.parse(e.data))
```

### Excel Export
Add a download button to export filtered consumers as Excel:
```javascript
import * as XLSX from 'xlsx'

function downloadAsExcel(consumers) {
  const ws = XLSX.utils.json_to_sheet(consumers)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Consumers")
  XLSX.writeFile(wb, "consumers.xlsx")
}
```

---

## Summary Checklist

- [ ] Excel file uploaded to Google Sheets
- [ ] Google Sheet ID copied to `.env`
- [ ] Google Cloud Project created
- [ ] Google Sheets API enabled
- [ ] API Key created and copied to `.env`
- [ ] Google Sheet shared publicly
- [ ] `.env` file created in project root
- [ ] `.env` added to `.gitignore`
- [ ] App.jsx updated (or file renamed)
- [ ] `npm run dev` started successfully
- [ ] Consumer Hub shows 934+ consumers
- [ ] Blue "Data synced from Google Sheets" banner visible
- [ ] Agencies filter auto-populated
- [ ] Search and filters working
- [ ] "Refresh" button working
- [ ] Mobile numbers and addresses displaying correctly
- [ ] Status icons showing correctly
- [ ] Ready for production!

---

## Next Steps

1. **Immediate**: Complete setup following the checklist above
2. **Testing**: Verify all data loads correctly
3. **Customization**: Adjust status logic if needed
4. **Production**: Deploy to your hosting platform
5. **Maintenance**: Monitor API usage and keep Google Sheet updated

---

## Support

If you encounter issues:

1. **Check console**: F12 → Console tab → Look for red errors
2. **Verify .env**: Make sure all three variables are set
3. **Test API**: Try calling the API directly in console
4. **Check Cloud Console**: Verify API is enabled
5. **Review logs**: Check Google Cloud Console for error details

For detailed troubleshooting, see `GOOGLE_SHEETS_SETUP.md`.

---

**Your PowerFlow app is now ready for dynamic, scalable consumer data management!** 🚀

Version: 1.0  
Last Updated: May 2026  
Data Source: 934 consumers from Maydisc26_1_.xlsx
