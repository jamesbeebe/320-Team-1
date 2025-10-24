# Testing ClassMatch Frontend Flow

## 🚀 Server is Running!
**URL**: http://localhost:3000

---

## 📱 Test the Complete User Flow

### Step 1: Login/Signup Flow
1. **Open**: http://localhost:3000
   - Should redirect to login page
   
2. **Click "Sign Up"** (bottom of the page)
   - Enter any username (e.g., "testuser")
   - Enter any email (e.g., "test@example.com")
   - Enter any password (e.g., "password123")
   - Click "Create Account"
   - ✅ Should redirect to onboarding page

### Step 2: Onboarding - Add Classes
3. **Search for Classes**
   - Type "CS" in the search box
   - See CS 311, CS 225 appear
   - Click "Add" button on CS 311
   - Click "Add" button on CS 225
   
4. **Try Other Searches**
   - Type "MATH" - see MATH 241
   - Type "PHYS" - see PHYS 211
   - Add a few more classes
   
5. **Go to Dashboard**
   - Click "View My Dashboard" button
   - ✅ Should redirect to dashboard

### Step 3: Dashboard
6. **View Your Classes**
   - See all added classes as cards
   - Each card shows:
     - Course code & name
     - Semester (Fall 2025)
     - Student avatars
     - Student count
   
7. **Add More Classes**
   - Click the dashed "+ Add a new class" card
   - ✅ Returns to onboarding

### Step 4: Class Details - Study Groups Tab
8. **Click on CS 311 Card**
   - Opens class details page
   - Default tab: "Study Groups"
   
9. **View Study Groups**
   - See "Midterm 1 Review" group
   - Date: October 10, 2025
   - Time: 3:00 PM - 5:00 PM
   - Location: Library Study Room 204
   - Spots: 2/5 filled
   - Click "Join" button (mock - will need backend)
   
10. **See Other Groups**
    - "Dynamic Programming Practice" (Zoom)
    - "Final Project Discussion"
    
11. **Create New Group**
    - Click "+ Create New Study Group" button
    - (Will need modal/form - ready for implementation)

### Step 5: Classmates Tab
12. **Click "Classmates" Tab**
    - See list of classmates
    - Each has:
      - Name (e.g., "Brian C.")
      - Initials in circle (BC)
      - **Compatibility score** (95%, 88%, 82%, etc.)
      - Progress bar (color-coded)
    
13. **Check Compatibility Colors**
    - 95% - Dark green (highest)
    - 88% - Green
    - 82% - Green
    - 78% - Yellow-green
    - 75% - Yellow
    - ✅ Sorted by highest compatibility first

### Step 6: Chat Tab
14. **Click "Chat" Tab**
    - See channel sidebar on left
    - "CS 311 General" channel (active)
    - Study group channels below
    
15. **View Messages**
    - See conversation between classmates
    - User avatars (initials)
    - Timestamps (2:30 PM, 2:32 PM, etc.)
    - Your messages aligned right (red background)
    - Others' messages aligned left (gray background)
    
16. **Switch Channels**
    - Click "Midterm 1 Review" in sidebar
    - Channel switches (ready for messages)
    - Click "Dynamic Programming" 
    
17. **Send a Message**
    - Type in "Type a message..." input at bottom
    - Click send button (paper plane icon)
    - (Will need WebSocket for real-time - ready for backend)

### Step 7: Navigation
18. **Go Back to Dashboard**
    - Click back arrow (top left)
    - OR click "ClassMatch" logo in header
    - ✅ Returns to dashboard
    
19. **Try Another Class**
    - Click on "MATH 241" card
    - See different study groups, classmates, chat
    
20. **Header Features**
    - Click notification bell icon (ready for notifications)
    - Click profile avatar (JD) - ready for profile page

---

## 🎨 UI/UX Features to Notice

### Design Quality
- ✅ Clean, modern interface
- ✅ Red color scheme (#EF5350)
- ✅ Smooth hover effects on cards and buttons
- ✅ Proper spacing and typography
- ✅ Icons (calendar, clock, location, people)

### Responsive Design
- ✅ Resize browser window
- ✅ Try mobile view (DevTools)
- ✅ Cards reorganize in grid
- ✅ Chat interface adapts

### Interactive Elements
- ✅ Buttons change on hover
- ✅ Cards have shadow on hover
- ✅ Tabs change on click
- ✅ Forms validate input (try submitting empty)
- ✅ Search filters in real-time

---

## 🔍 What to Check

### ✅ Page Transitions
- [ ] Login → Signup → Login (links work)
- [ ] Signup → Onboarding → Dashboard
- [ ] Dashboard → Class Details → Dashboard
- [ ] Class Details tabs switch smoothly

### ✅ Mock Data Working
- [ ] Classes appear in search
- [ ] Dashboard shows enrolled classes
- [ ] Study groups display with details
- [ ] Classmates show compatibility scores
- [ ] Chat shows message history

### ✅ Forms Working
- [ ] Login form accepts input
- [ ] Signup form validates
- [ ] Class search filters results
- [ ] Chat message input works

### ✅ Layout & Style
- [ ] Header shows on correct pages
- [ ] Logo links to dashboard
- [ ] Profile avatar displays
- [ ] Cards look good
- [ ] Colors match design (#EF5350)

---

## 📊 Expected Behavior (Mock Data)

### Since there's no backend yet:
- ✅ Login/Signup will "work" but not save data
- ✅ Adding classes shows in UI (not persisted)
- ✅ Clicking "Join" doesn't actually join (needs backend)
- ✅ Sending messages doesn't send (needs WebSocket)
- ✅ Compatibility scores are hardcoded (95%, 88%, etc.)

**This is normal!** The UI is complete and ready for backend integration.

---

## 🎯 Key Features to Test

### 1. Authentication UI ✅
- Clean login/signup forms
- Error message display (try)
- Loading states
- Smooth transitions

### 2. Class Management ✅
- Real-time search filtering
- Add/remove classes (UI only)
- Beautiful dashboard cards
- Student previews

### 3. Study Groups ✅
- List view with details
- Date/time/location display
- Spot availability
- Join button

### 4. Compatibility System ✅
- Percentage scores (95%, 88%, etc.)
- Color-coded progress bars
- Sorted by score
- Visual hierarchy

### 5. Chat Interface ✅
- Channel navigation
- Message display
- Send message UI
- User avatars
- Timestamps

---

## 🐛 Known Limitations (Expected)

### These are NORMAL with mock data:
1. **Refresh loses data** - No backend storage yet
2. **Can't actually join groups** - Needs API
3. **Messages don't persist** - Needs WebSocket
4. **All users see same data** - Needs user sessions
5. **Compatibility is static** - Needs matching algorithm

---

## ✨ What Should Work Perfectly

- ✅ All page navigation
- ✅ UI responsiveness
- ✅ Tab switching
- ✅ Form input and validation
- ✅ Search filtering
- ✅ Hover effects
- ✅ Layout on all screen sizes
- ✅ Color scheme and styling

---

## 📸 Screenshots to Take (Optional)

1. Login page
2. Onboarding with search results
3. Dashboard with class cards
4. Study Groups tab
5. Classmates with compatibility bars
6. Chat interface

---

## 🎉 Success Criteria

You've successfully tested the frontend if:
- ✅ Can navigate through all pages
- ✅ Forms accept input
- ✅ UI looks clean and professional
- ✅ Matches Figma designs
- ✅ No console errors (check DevTools)
- ✅ Responsive on different screen sizes

---

## 🚀 Next Steps After Testing

1. **Looks Good?** 
   - Connect backend API
   - See `BACKEND_INTEGRATION.md`

2. **Found Issues?**
   - Note what's not working
   - Check browser console for errors
   - Can be easily fixed

3. **Ready to Deploy?**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, etc.

---

**Enjoy testing your ClassMatch frontend!** 🎓✨

**Questions?** Check the other documentation files or browser console for debugging.

