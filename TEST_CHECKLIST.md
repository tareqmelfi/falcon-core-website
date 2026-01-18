# Testing & QA Checklist for fc.sa

## Phase 1: Articles Fetching ✅

### Testing Steps:
- [ ] Navigate to `/articles` page
- [ ] Verify all 5 articles are displayed:
  - [ ] "The Future of AI in Business Automation"
  - [ ] "Cybersecurity: Protecting Your Business in the Digital Age"
  - [ ] "Cloud Infrastructure: Choosing the Right Solution for Your Business"
  - [ ] "Digital Marketing Trends Shaping 2025: Strategies for Success"
  - [ ] "Modern Web Development: Best Practices and Emerging Technologies in 2025"
- [ ] Click on each article and verify content loads correctly
- [ ] Verify article metadata (author, date, read time, tags) displays
- [ ] Test category filtering
- [ ] Test search functionality
- [ ] Check responsive design on mobile

### Expected Results:
- All articles load without errors
- No console errors related to Builder.io API
- Featured images load correctly
- Hero section displays properly

---

## Phase 2: Services Section ✅

### Testing Steps:
- [ ] Navigate to home page (`/`)
- [ ] Scroll to "Services" section
- [ ] Verify all 4 services display:
  - [ ] "Process Automation & Workflow Optimization"
  - [ ] "Cloud Infrastructure & Data Solutions"
  - [ ] "Digital Marketing & Growth Strategy"
  - [ ] "AI Agents & Intelligent Automation"
- [ ] Verify updated descriptions are correct
- [ ] Check hover effects on service cards
- [ ] Test mobile responsive layout

### Expected Results:
- Services cards render with correct text
- Icons display properly
- Hover animations work smoothly
- No text truncation on mobile

---

## Phase 3: Free Phone Number ✅

### Testing Steps:
- [ ] Navigate to `/contact` page
- [ ] Verify phone number is displayed: **800111011**
- [ ] Test clicking the phone number (should trigger tel: link)
- [ ] Check Footer for phone number
- [ ] Verify both English and Arabic translations show correctly
- [ ] Test on mobile device (phone number should be clickable)

### Expected Results:
- Phone number displays in Contact page info section
- Phone number displays in Footer
- `tel:800111011` link works
- Text shows as "Free Call: 800111011" or "رقم مجاني: 800111011"

---

## Phase 4: Admin Dashboard ✅

### Testing Steps:

#### Login Page:
- [ ] Navigate to `/admin/login`
- [ ] Page should show login form
- [ ] Enter wrong password - should show error "Invalid password"
- [ ] Enter correct password: `Fc8787965@!`
- [ ] Should redirect to `/admin` dashboard
- [ ] Session should persist (reload page, should stay logged in)
- [ ] Logout button should work and redirect to home

#### Dashboard:
- [ ] Verify welcome message displays: "Welcome back, Tareq!"
- [ ] Verify metric cards display:
  - [ ] Total Visitors: 2,847
  - [ ] Published Articles: 5
  - [ ] Page Views: 8,392
  - [ ] Active Users: 142
- [ ] Verify "Important Updates" section displays
- [ ] Check Quick Actions links:
  - [ ] "Manage Articles" links to Builder.io
  - [ ] "View Analytics" links to Google Analytics
  - [ ] "Builder.io CMS" links to Builder.io
- [ ] Verify all navigation works (sidebar links)

#### Session Management:
- [ ] Login with correct password
- [ ] Close browser and reopen - session should persist (8 hour timeout)
- [ ] Click Logout - should clear session
- [ ] Trying to access `/admin` without login should redirect to `/admin/login`

### Expected Results:
- Admin login works with password: `Fc8787965@!`
- Dashboard displays all metrics and updates
- Session persists correctly
- Logout works properly
- Security is enforced

---

## Phase 5: Monitoring Dashboard ✅

### Testing Steps:
- [ ] Log into admin dashboard
- [ ] Navigate to `/admin/monitoring`
- [ ] Verify page loads and displays:
  - [ ] Website Status (should show "✓ Running")
  - [ ] Response Time (shows milliseconds)
  - [ ] Performance Score (percentage)
  - [ ] Security Score (percentage)
- [ ] Click "Refresh" button
  - [ ] Button should show loading state
  - [ ] Data should update
  - [ ] Toast notification should show
- [ ] Verify "Detailed Metrics" section displays
- [ ] Check responsive design on different screen sizes

### Expected Results:
- Monitoring dashboard loads without errors
- All metrics display correctly
- Refresh button works
- No console errors
- Layout is responsive

---

## Overall Testing

### Performance:
- [ ] Test on slow 3G connection
- [ ] All pages should load within 3 seconds
- [ ] No layout shifts or jank
- [ ] Images load properly

### Responsive Design:
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] All pages should be readable and usable

### Browser Compatibility:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Accessibility:
- [ ] All links are keyboard accessible
- [ ] Form inputs are properly labeled
- [ ] Color contrast is sufficient
- [ ] Images have alt text

### Cross-browser Testing:
- [ ] No console errors in any browser
- [ ] Layout consistency across browsers
- [ ] No broken functionality

---

## Deployment Checklist

### Pre-Deployment:
- [ ] All tests pass
- [ ] No console errors
- [ ] Admin login works
- [ ] Articles load from Builder.io
- [ ] Phone number displays correctly
- [ ] Services section updated

### Post-Deployment (on fc.sa):
- [ ] Site loads on fc.sa domain
- [ ] SSL certificate is valid (lock icon visible)
- [ ] All pages load correctly
- [ ] Articles display
- [ ] Admin login accessible at fc.sa/admin/login
- [ ] Monitoring dashboard works

---

## Known Issues / Notes

- Monitoring service will run on backend with 5-minute intervals
- Alert system will send emails to tareq@fc.sa when issues occur
- Admin session expires after 8 hours of inactivity
- Performance metrics are simulated in frontend (real monitoring on backend)

---

## Sign-off

- [ ] All tests completed
- [ ] No critical issues remaining
- [ ] Ready for production deployment

**Tested by:** ________________  
**Date:** ________________  
**Result:** ✅ PASS / ❌ FAIL

