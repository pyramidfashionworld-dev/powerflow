# 🚀 Powerflow Dashboard v2.0 - Quick Start

## ⚡ 3-Step Installation (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 🔐 Login

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | user | user123 |

---

## 📚 Main Features

### 1️⃣ Dashboard
- View all consumers in cards
- Search by name, ID, mobile
- Quick stats: Active, Pending, Disconnected
- Upload CSV/Excel files

### 2️⃣ Consumer Details
- Click "View" on any consumer card
- See all 11 fields:
  - Name, ID, Mobile, Address
  - Class, Device, Due Date
  - Due Range, Outstanding Dues
  - Status, Agency
- Edit any field and save

### 3️⃣ Agency Management
- Tab: "🏢 Agency Management"
- Left: Select agency from list
- Right: See all consumers in that agency
- Update status (Active/Pending/Disconnected)

### 4️⃣ Admin Panel (admin only)
- Tab: "⚙️ Admin Panel"
- View system statistics
- Add new agencies
- See consumer distribution

---

## 📤 Upload Consumer Data

### File Format (CSV)
```csv
id,name,mobile,address,class,device,dueDate,dueRange,outstandingDues,status,agency
C001,Rajesh Kumar,9876543210,123 Main St,A,Smart Meter,2024-06-30,30 days,5000,Active,Kolkata North
```

### Required Columns (exact names)
- `id` - Consumer ID
- `name` - Full name
- `mobile` - Phone number
- `address` - Full address
- `class` - Consumer class (A/B/C)
- `device` - Meter type
- `dueDate` - Due date (YYYY-MM-DD)
- `dueRange` - Duration (e.g., "30 days")
- `outstandingDues` - Amount owed
- `status` - Active/Pending/Disconnected
- `agency` - Agency name

### Supported Formats
✅ CSV (.csv)
✅ Excel (.xlsx)
✅ Legacy Excel (.xls)

### Steps
1. Click "Upload CSV/Excel File"
2. Select your file
3. Click "Upload"
4. Sample data replaced automatically ✨

---

## 🎯 Typical Workflows

### Workflow 1: Upload & Review
```
1. Dashboard → Upload CSV
2. Select file → Click Upload
3. All consumers appear in dashboard
4. Search to find specific consumer
5. Click "View" for details
```

### Workflow 2: Update Consumer Details
```
1. Dashboard → Click "View"
2. Consumer Detail Page → Click "Edit"
3. Modify any field
4. Click "Save Changes"
5. Back to dashboard (updated)
```

### Workflow 3: Manage Agency Status
```
1. Agency Management tab
2. Click agency name (left panel)
3. See all consumers in that agency
4. Click "Update Status" on consumer
5. Select new status
6. Click "Save"
```

---

## 🎨 Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| Active | 🟢 Green | Consumer is active |
| Pending | 🟡 Yellow | Awaiting action |
| Disconnected | 🔴 Red | Service disconnected |

---

## 📊 Sample Data (Included)

File: `sample_consumers.csv`

8 sample consumers included:
- Multiple agencies
- Various statuses
- Different outstanding amounts
- Test all features

---

## ⚠️ Important Notes

### Data Storage
- ⚠️ Data stored in browser memory only
- Resets on page refresh
- For persistence → add database backend

### Backup
- Use "Export CSV" to backup data
- Admin Panel → "Create Backup"

### Admin Access
- Only admin user sees Admin Panel tab
- Only admin can add agencies

---

## 🆘 Common Issues

### Issue: Upload fails
**Solution**: Check CSV format matches template
```csv
id,name,mobile,address,class,device,dueDate,dueRange,outstandingDues,status,agency
```

### Issue: Data disappeared
**Solution**: Data resets on page refresh (expected)
- Re-upload CSV file to restore
- Use Export CSV to backup

### Issue: Admin panel blank
**Solution**: 
- Logout (button top right)
- Login again as admin
- Reload page (F5)

### Issue: Port 5173 in use
**Solution**:
```bash
npm run dev -- --port 3000
```

---

## 🔥 Power Features

### Search
- Real-time search
- Search by: name, ID, mobile
- Filters dashboard instantly

### Export
- Dashboard → "Export CSV"
- Exports filtered consumers
- Date-stamped filename

### Multi-Select
- Hold Ctrl+Click to select multiple
- Upcoming: bulk operations

---

## 📦 Project Structure

```
├── App.jsx                 # Main dashboard
├── pages/
│   ├── ConsumerDetail.jsx  # Detail view
│   ├── AdminPanel.jsx      # Admin only
│   └── AgencyModule.jsx    # Agency management
├── package.json            # Dependencies
├── vite.config.js          # Config
└── sample_consumers.csv    # Test data
```

---

## 🎓 Field Explanations

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| id | Text | C001 | Unique identifier |
| name | Text | Rajesh Kumar | Consumer name |
| mobile | Text | 9876543210 | Phone number |
| address | Text | 123 Main St | Full address |
| class | A/B/C | A | Consumer class |
| device | Text | Smart Meter | Meter type |
| dueDate | Date | 2024-06-30 | Payment due date |
| dueRange | Text | 30 days | Duration text |
| outstandingDues | Number | 5000 | Amount owed (₹) |
| status | Enum | Active | Current status |
| agency | Text | Kolkata North | Assigned agency |

---

## 🚀 Deployment Checklist

- [ ] Test all features locally
- [ ] Upload real consumer data
- [ ] Verify all fields display correctly
- [ ] Test on mobile (Ctrl+Shift+M)
- [ ] Run: `npm run build`
- [ ] Deploy `dist/` folder
- [ ] Test on production URL

---

## 📞 Quick Help

- **Lost password?** Use demo credentials (admin/admin123)
- **Need to reset?** Clear browser cache (Ctrl+Shift+Delete)
- **Check version?** v2.0 (check in code)
- **File template?** Use `sample_consumers.csv`

---

## ✨ What's New in v2.0

✅ Full consumer details (11 fields)
✅ Inline editing on detail page
✅ Excel/CSV upload with parsing
✅ Agency management module
✅ Status update system
✅ Beautiful gradient UI
✅ Mobile responsive
✅ Real-time search
✅ Data export
✅ Admin statistics

---

**You're all set! Start the server and explore! 🎉**

```bash
npm run dev
```

Then visit: **http://localhost:5173**

**Default login**: admin / admin123
