# PowerFlow - Google Sheets Integration Setup Guide

## Overview
PowerFlow now supports dynamic consumer data from Google Sheets. This means you can update consumer records in a Google Sheet, and they'll automatically sync to your PowerFlow app.

---

## Step 1: Prepare Your Google Sheet

### Option A: Upload Your Excel Data to Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Click on "File" → "Import" → "Upload"
4. Select your `Maydisc26_1_.xlsx` file
5. Choose to create a new spreadsheet
6. The data will be automatically formatted

### Option B: Create a New Google Sheet with Your Data
If you prefer to start fresh:
1. Open [Google Sheets](https://sheets.google.com)
2. Create a blank spreadsheet
3. Add column headers in Row 1:
   ```
   SL NO | Consumer Id | Name | Address | B/C | Meter | O/S Due date Range | D2 Net O/S | Mobile Number | agency
   ```
4. Copy your data from the Excel file

### Column Mapping
Your Google Sheet should have these columns (in order):
- **Column A**: SL NO (Serial number)
- **Column B**: Consumer Id (e.g., 132010983)
- **Column C**: Name (Consumer name)
- **Column D**: Address
- **Column E**: B/C (Billing Category - used to infer phase)
- **Column F**: Meter (Meter code)
- **Column G**: O/S Due date Range (e.g., "01-05-2025 - 31-05-2025")
- **Column H**: D2 Net O/S (Outstanding dues amount)
- **Column I**: Mobile Number
- **Column J**: agency (Agency name)

---

## Step 2: Get Your Google Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. Copy the long string between `/d/` and `/edit` - that's your **SHEET_ID**
4. Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## Step 3: Create a Google Cloud Project & Get API Key

### Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter project name: `PowerFlow` (or your preference)
5. Click "Create"
6. Wait for the project to be created (1-2 minutes)

### Enable Google Sheets API
1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it
4. Click the **ENABLE** button
5. Wait for activation (usually instant)

### Create an API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **API Key**
4. A dialog will appear with your API key
5. Copy the full API key (it looks like: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx`)
6. Click **CLOSE**

⚠️ **Important**: Keep your API key secret! Don't commit it to GitHub.

---

## Step 4: Share Your Google Sheet

You have two options:

### Option 1: Public Sharing (Easiest for Testing)
1. Open your Google Sheet
2. Click **Share** (top right)
3. In the dialog, change permission to **Anyone with the link** → **Viewer**
4. Click **Share**

### Option 2: Service Account (Better for Production)
[Advanced setup - see Google Sheets API documentation]

---

## Step 5: Configure PowerFlow

### Create .env File
1. In your PowerFlow project root, create a file named `.env` (or copy `.env.example`)
2. Add your credentials:

```env
# Your Google Sheet ID (from Step 2)
VITE_GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p

# Your Google API Key (from Step 3)
VITE_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx

# Sheet name (usually "Sheet1", change if different)
VITE_SHEET_NAME=Sheet1

# Enable Google Sheets integration
VITE_USE_GOOGLE_SHEETS=true
```

### Update App Routing
In `src/App.jsx`, update the import to use the new ConsumerHub:

```jsx
// Before:
import ConsumerHub from './pages/ConsumerHub'

// After:
import ConsumerHub from './pages/ConsumerHubGoogleSheets'
```

Or rename `ConsumerHubGoogleSheets.jsx` to `ConsumerHub.jsx`.

---

## Step 6: Test the Integration

1. Start your PowerFlow app:
   ```bash
   npm run dev
   ```

2. Navigate to the **Consumer Hub**

3. You should see:
   - All 934+ consumers loaded from your Google Sheet
   - A blue banner: "📊 Data synced from Google Sheets"
   - A "Refresh" button to manually fetch latest data
   - Dynamic agency filters based on your sheet data

4. Changes made to consumer status are cached locally

---

## How It Works

### Data Flow
```
Google Sheet
    ↓
Google Sheets API v4
    ↓
googleSheetsService.js (fetch & parse)
    ↓
ConsumerHubGoogleSheets.jsx (display)
    ↓
Browser localStorage cache (5 min TTL)
```

### Auto-Refresh Strategy
- **On Load**: Fetches from Google Sheets (or uses cached data)
- **Cache Duration**: 5 minutes
- **Manual Refresh**: Click the "Refresh" button to force update
- **Status Changes**: Stored locally (doesn't modify Google Sheet)

### Data Transformation
The service automatically:
- Maps Excel columns to PowerFlow format
- Infers phase class from billing category
- Generates device IDs from consumer IDs
- Determines connection status from outstanding dues
- Parses date ranges

---

## Handling Your Specific Data

Your Excel file has these characteristics:
- **934 consumer records** with Annapurna agency data
- **Outstanding dues** range from ₹0 to ₹8000+
- **Mobile numbers** in various formats
- **No predefined phases** - inferred from billing category

### Status Auto-Assignment
The system assigns status based on outstanding dues:
```javascript
if (dues > ₹5,000)  → 'disconnected'
if (dues > ₹0)      → 'pending'
if (dues = ₹0)      → 'connected'
```

You can modify this logic in `googleSheetsService.js` → `getStatusFromDues()`

---

## Troubleshooting

### "Google Sheet ID not configured"
- Ensure `.env` file exists in project root
- Check `VITE_GOOGLE_SHEET_ID` is set correctly
- Restart the dev server: `npm run dev`

### "Google Sheets API error: 403"
- Your API key is invalid or disabled
- Check that Google Sheets API is ENABLED in Cloud Console
- Verify you created an API Key (not OAuth 2.0)

### "No consumers found"
- Check that your Google Sheet has data in columns A-J
- Verify the sheet name matches `VITE_SHEET_NAME` (default: "Sheet1")
- Check browser console for error messages

### Data Not Updating
- Click the "Refresh" button on the Consumer Hub page
- Clear browser cache: Press Ctrl+Shift+Del → Clear cookies
- Check that your Google Sheet is publicly accessible

### API Rate Limits
- Google Sheets API has generous free quotas
- For production, consider upgrading your Cloud project

---

## Next Steps

### 1. Advanced Customization
Edit `googleSheetsService.js` to:
- Change date format parsing
- Modify status assignment logic
- Add custom field mappings
- Implement real-time sync with WebSockets

### 2. Backup Strategy
- Regularly export your Google Sheet as CSV/Excel
- Keep a copy of your API key in a password manager
- Document any custom transformations

### 3. Production Deployment
- Use environment variables in your hosting platform
- Don't commit `.env` to GitHub
- Consider using a service account for production
- Monitor API usage in Google Cloud Console

### 4. Team Collaboration
- Share the Google Sheet with team members
- They can update data directly
- PowerFlow will automatically reflect changes
- No need to redeploy the app!

---

## File Reference

### New Files Created
- `src/services/googleSheetsService.js` - Google Sheets API integration
- `src/pages/ConsumerHubGoogleSheets.jsx` - Updated consumer page
- `.env.example` - Configuration template

### Modified Files
- `src/App.jsx` - Update import if needed
- `.env` - Add your credentials

---

## API Documentation

### `fetchConsumersFromSheet()`
Fetches and parses consumers from Google Sheet in one call.
```javascript
const consumers = await fetchConsumersFromSheet()
// Returns: Array of consumer objects or null if error
```

### `getCachedConsumers()`
Retrieves cached data if still valid (< 5 min old).
```javascript
const cached = getCachedConsumers()
// Returns: Array or null
```

### `getAgenciesFromConsumers(consumers)`
Extracts unique agencies from consumer list.
```javascript
const agencies = getAgenciesFromConsumers(consumers)
// Returns: ['Annapurna', 'ROXY', ...]
```

---

## Support

For issues or questions:
1. Check the console for error messages (F12 → Console tab)
2. Verify all .env variables are set correctly
3. Test your Google Sheet is publicly accessible
4. Ensure Google Sheets API is enabled in Cloud Console

Happy syncing! 🚀
