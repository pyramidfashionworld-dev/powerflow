# Powerflow Admin Dashboard v2.0 - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Extract & Navigate
```bash
cd powerflow-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open: `http://localhost:5173`

### Step 4: Login
- **Admin**: username: `admin` | password: `admin123`
- **User**: username: `user` | password: `user123`

---

## 📋 Complete Feature Walkthrough

### 1. **Dashboard - Consumer Management**

#### Home View
- **Total Consumers**: Shows all uploaded consumers
- **Status Cards**: Active, Pending, Disconnected counts
- **Search Bar**: Search by name, ID, or mobile number in real-time
- **Consumer Cards**: Grid view with quick info
  - Name, ID, Mobile, Agency
  - Outstanding dues amount
  - Status badge with color coding
  - View & Delete buttons

#### Importing Data

**Step 1: Prepare Your CSV File**
Required columns (must match exactly):
```
id, name, mobile, address, class, device, dueDate, dueRange, outstandingDues, status, agency
```

**Example Format:**
```csv
id,name,mobile,address,class,device,dueDate,dueRange,outstandingDues,status,agency
C001,Rajesh Kumar,9876543210,123 Main Street,A,Smart Meter,2024-06-30,30 days,5000,Active,Kolkata North
C002,Priya Singh,9876543211,456 Park Avenue,B,Analog Meter,2024-07-15,15 days,2500,Pending,Bangalore Metro
```

**Supported File Types:**
- `.csv` (comma-separated values)
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

**Step 2: Upload File**
1. Click "Upload CSV/Excel File" button
2. Select your file
3. System automatically:
   - Parses the file
   - Maps column headers
   - Replaces sample data
   - Shows confirmation with number of consumers imported

**Step 3: Verify Data**
- All consumers appear in dashboard
- Search works correctly
- Status badges show properly

---

### 2. **Consumer Detail Page**

Click "View" on any consumer card to access full details.

#### View Mode
Shows all information:
- **Name & ID**: Consumer identification
- **Contact**: Mobile number
- **Location**: Complete address
- **Class**: Consumer classification (A/B/C)
- **Device**: Meter type (Smart/Analog/Digital)
- **Due Date**: Payment due date
- **Due Range**: Days until/after due
- **Outstanding Dues**: Amount owed (₹)
- **Status**: Current status
- **Agency**: Assigned agency

#### Edit Mode
1. Click "Edit" button
2. Modify any field:
   - Name, Mobile, Address
   - Class, Device
   - Due Date, Due Range
   - Outstanding Dues
   - Status, Agency
3. Click "Save Changes" to update
4. Click "Cancel" to discard changes

---

### 3. **Agency Management**

Access via "🏢 Agency Management" tab.

#### Left Panel - Agency List
- All agencies listed with consumer count
- Click any agency to view its consumers
- Color highlights selected agency
- Shows total count for quick overview

#### Right Panel - Consumer List by Agency
Shows table with:
- **Consumer ID**: Unique identifier
- **Name**: Consumer name
- **Mobile**: Contact number
- **Outstanding Dues**: Amount owed
- **Status**: Current status (color-coded)
- **Action**: Update Status button

#### Update Consumer Status
1. Click "Update Status" button for any consumer
2. Select new status from dropdown:
   - **Active**: Consumer is active
   - **Pending**: Awaiting action
   - **Disconnected**: Service disconnected
3. Click "Save" to confirm
4. Click "Cancel" to abort

---

### 4. **Admin Panel** (Admin Only)

Access via "⚙️ Admin Panel" tab (shows only for admin login).

#### System Overview
- **Total Consumers**: Complete count
- **Active Consumers**: Currently active
- **Disconnected**: Service disconnected
- **Total Outstanding Dues**: Sum of all dues
- **Average Outstanding**: Per consumer average
- **Active Rate**: Percentage of active consumers

#### Agency Management
- **Add New Agency**: Type name and click "Add"
- Creates new agency with initial consumer
- **Current Agencies**: List all existing agencies
- Shows consumer count per agency

#### Consumer Status Distribution
Visual progress bars showing:
- **Active**: Percentage and count
- **Pending**: Percentage and count
- **Disconnected**: Percentage and count

#### Quick Actions
- **Reset to Sample Data**: Restore original sample consumers
- **Check System Health**: Verify system status
- **Create Backup**: Backup current data

---

## 📊 Data Structure

### Consumer Object
```javascript
{
  id: "C001",              // Unique ID
  name: "Rajesh Kumar",    // Full name
  mobile: "9876543210",    // Phone number
  address: "123 Main St",  // Full address
  class: "A",              // Class (A/B/C)
  device: "Smart Meter",   // Meter type
  dueDate: "2024-06-30",   // Due date (YYYY-MM-DD)
  dueRange: "30 days",     // Duration text
  outstandingDues: 5000,   // Amount (number)
  status: "Active",        // Status (Active/Pending/Disconnected)
  agency: "Kolkata North"  // Agency name
}
```

---

## 🔧 Technical Details

### File Structure
```
powerflow-dashboard/
├── App.jsx              # Main dashboard component
├── main.jsx             # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── pages/
│   ├── ConsumerDetail.jsx    # Detail view component
│   ├── AdminPanel.jsx        # Admin panel component
│   └── AgencyModule.jsx      # Agency management component
└── sample_consumers.csv # Test data
```

### State Management
- **currentUser**: Logged-in user data
- **consumers**: All consumer data (in-memory)
- **selectedConsumer**: Currently viewed consumer
- **searchTerm**: Search filter text
- **currentPage**: Active page/module

### Data Persistence
⚠️ **Note**: Data is stored in browser memory and resets on page refresh.
For persistent storage, implement database (MongoDB, Firebase, etc.)

---

## 🎨 Styling

### Color Scheme
- **Primary**: Linear gradient (667eea → 764ba2)
- **Success**: #d4edda (Active)
- **Warning**: #fff3cd (Pending)
- **Danger**: #f8d7da (Disconnected)

### Responsive Design
- Mobile: Single column card view
- Tablet: 2 columns
- Desktop: 3+ columns
- Tables adapt to screen size

---

## ✅ Testing Checklist

- [ ] Login works (admin/user credentials)
- [ ] Dashboard displays 4 sample consumers
- [ ] Search filters by name/ID/mobile
- [ ] View consumer detail shows all 11 fields
- [ ] Edit consumer detail and save changes
- [ ] Upload sample_consumers.csv replaces data
- [ ] New data appears in dashboard
- [ ] Agency tab shows all agencies
- [ ] Click agency filters consumers correctly
- [ ] Update status in agency module works
- [ ] Admin panel shows statistics
- [ ] Admin can add new agency
- [ ] Export CSV downloads correctly
- [ ] Responsive design works on mobile

---

## 🐛 Troubleshooting

### Problem: Blank Admin Panel
**Solution**: Reload page (F5), login again as admin

### Problem: CSV Upload Fails
**Solution**: 
- Ensure headers match exactly: id, name, mobile, address, class, device, dueDate, dueRange, outstandingDues, status, agency
- Use CSV format, not Excel directly
- Check for special characters in quotes
- Use sample_consumers.csv as template

### Problem: Search Not Working
**Solution**: 
- Make sure consumers are loaded in dashboard
- Try searching by full name or exact ID
- Clear search and try again

### Problem: Changes Not Persisting
**Solution**: 
- Data is in-memory only, resets on page refresh
- Implement backend database for persistence

### Problem: Port 5173 Already in Use
**Solution**: 
```bash
npm run dev -- --port 3000
# Or kill process on port 5173
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Run Preview
```bash
npm run preview
```

### Deploy
Copy contents of `dist/` folder to your hosting service:
- Netlify
- Vercel
- GitHub Pages
- Your own server

---

## 📝 File Format Examples

### Valid CSV
```csv
id,name,mobile,address,class,device,dueDate,dueRange,outstandingDues,status,agency
C001,John Doe,9876543210,123 Street,A,Smart Meter,2024-06-30,30 days,5000,Active,Agency A
```

### Invalid CSV (wrong headers)
```csv
consumer_id,fullname,phone,address,class...  # ❌ Wrong column names
```

### Invalid CSV (missing data)
```csv
C001,John Doe,9876543210,,A,Smart Meter,2024-06-30,30 days,5000  # ❌ Missing status, agency
```

---

## 💡 Tips & Tricks

1. **Quick Search**: Press Ctrl+F after opening consumer list
2. **Bulk Updates**: Use Agency module to quickly update multiple consumers' status
3. **Data Export**: Use "Export CSV" to backup current state
4. **Admin Password**: Default credentials are demo-only, change in production
5. **Mobile Friendly**: All features work on mobile and tablet

---

## 📞 Support

For issues:
1. Check this guide's troubleshooting section
2. Reload the page (F5)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors (F12)

---

## 📅 Version History

### v2.0 (Current)
✅ Consumer detail page with all 11 fields
✅ Excel/CSV upload with data replacement
✅ Agency management module
✅ Status update functionality
✅ Enhanced UI with gradient styling
✅ Mobile responsive design

### v1.0 (Previous)
- Basic dashboard
- Sample data only
- Table view
- Limited features

---

## 🎯 Next Steps

1. ✅ Extract & install
2. ✅ Run development server
3. ✅ Test login
4. ✅ Explore dashboard
5. ✅ Upload your consumer data
6. ✅ Test all features
7. ✅ Deploy to production

**You're all set! Happy managing! 🎉**
