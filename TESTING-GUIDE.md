# 🍕 SliceMaster - Complete Testing Guide

## ✅ Fixed Issue
**Critical Bug Fixed:** Removed HTML template code from `auth.js` that was causing JavaScript syntax errors.

---

## 🚀 How to Start the Application

### Step 1: Start the Backend
1. **Double-click** `START-BACKEND.bat` in the Pizza folder
2. **Wait** for this message (takes 20-30 seconds):
   ```
   Started SliceMasterPizzeriaApplication in X.XXX seconds
   ```
3. **Keep this window open** - don't close it!

### Step 2: Open the Frontend
1. **Right-click** `Pizaa-Webapp-Front-end-\index.html`
2. Select **"Open with Live Server"** (or any web server)
3. **OR** simply open it in Chrome/Edge browser

---

## 🧪 What You Can Test Now

### ✅ 1. **User Registration & Login** (NOW WORKING!)
**Test Registration:**
- Click **"Login"** button in top-right navbar
- Click **"Sign Up"** in the modal
- Fill in the form:
  - First Name: Test
  - Last Name: User
  - Email: test@example.com
  - Phone: +91 9876543210
  - Password: password123
- Click **"Create Account"**
- **Expected:** Success message, modal closes, "Hi Test" shows in navbar

**Test Login:**
- Click **"Login"** again
- Use credentials:
  - Email: test@example.com
  - Password: password123
- Click **"Sign In"**
- **Expected:** Success message, you're logged in

**Admin Login:**
- Email: admin@slicemaster.com
- Password: Admin@123
- **Expected:** Admin access (can manage pizzas)

---

### ✅ 2. **Browse Pizza Menu**
- Scroll to **"Trending Pizzas"** section
- **Expected:** See dynamic pizza cards loaded from backend
- Click **"View Details"** on any pizza
- **Expected:** Modal shows pizza details, customization options

**Test Filtering:**
- Click category buttons (Vegetarian, Non-Veg, etc.)
- **Expected:** Menu filters based on category

---

### ✅ 3. **Shopping Cart**
**Add to Cart:**
- Click **"Add to Cart"** on any pizza
- **Expected:** 
  - Success toast notification
  - Cart icon updates with item count
  - Cart sidebar opens automatically

**Cart Operations:**
- Click cart icon to open/close cart sidebar
- Change quantity using **+/-** buttons
- Click **"Remove"** to delete items
- **Expected:** Cart syncs with backend (check Network tab for API calls to `/api/v1/cart`)

---

### ✅ 4. **Checkout Process** (Requires Login)
**3-Step Checkout:**
1. **Step 1 - Delivery Address:**
   - Fill in address form OR select saved address
   - Click **"Continue to Payment"**

2. **Step 2 - Payment Method:**
   - Select: Card / UPI / Cash on Delivery / Crypto (dummy)
   - Click **"Review Order"**

3. **Step 3 - Confirmation:**
   - Review order summary
   - Click **"Place Order"**
   - **Expected:** Order success page with order ID

---

### ✅ 5. **Real-time Order Tracking** (After Placing Order)
- Click **"Track Order"** on success page
- **Expected:** 
  - WebSocket connection established
  - Order timeline showing current status
  - Real-time updates as status changes (simulated)

**Test WebSocket:**
- Open browser DevTools (F12) → **Console** tab
- Look for: `[WebSocket] Connected to order tracking`
- You should see order status updates every few seconds

---

### ✅ 6. **Order History**
- Click **"My Orders"** in user menu (top-right)
- **Expected:** List of all your past orders
- Click **"Track"** to see order timeline
- Click **"Reorder"** to add items back to cart

---

### ✅ 7. **Backend APIs** (Direct Testing)

**Test Endpoints in Browser:**

```
http://localhost:8081/api/v1/categories
http://localhost:8081/api/v1/pizzas
http://localhost:8081/api/v1/pizzas/1
http://localhost:8081/h2-console (Database UI)
```

**H2 Database Console:**
- URL: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:mem:slicemaster_db`
- Username: `sa`
- Password: *(leave empty)*
- **Expected:** See all database tables (users, pizzas, orders, cart_items, etc.)

**SQL Queries to Try:**
```sql
SELECT * FROM users;
SELECT * FROM pizzas;
SELECT * FROM orders;
SELECT * FROM cart_items WHERE user_id = 1;
```

---

### ✅ 8. **API Testing with Postman/Thunder Client**

**1. Register User:**
```
POST http://localhost:8081/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+91 9876543210",
  "password": "password123"
}
```

**2. Login:**
```
POST http://localhost:8081/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Copy the `token` from response for next requests**

**3. Get Cart (Authenticated):**
```
GET http://localhost:8081/api/v1/cart
Authorization: Bearer YOUR_TOKEN_HERE
```

**4. Add to Cart:**
```
POST http://localhost:8081/api/v1/cart/add
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "pizzaId": 1,
  "quantity": 2,
  "size": "MEDIUM",
  "crustType": "THIN"
}
```

---

## 🔍 Debugging & Troubleshooting

### Browser Console (F12)
**Check for:**
- ✅ No JavaScript errors
- ✅ API calls to `http://localhost:8081/api/v1/*`
- ✅ WebSocket connection messages
- ✅ Toast notifications appearing

### Network Tab (F12 → Network)
**Monitor:**
- API responses (200 = success, 401 = not logged in, 500 = server error)
- Request/Response payloads
- WebSocket connection (look for "ws" protocol)

### Backend Logs
**Look for in the terminal:**
- `Started SliceMasterPizzeriaApplication` = Ready
- SQL queries = Database operations working
- `Completed 200 OK` = Successful API calls
- Errors = Issues to fix

---

## 🐛 Known Limitations (What WON'T Work Yet)

❌ **Payment Processing:**
- PayPal/Crypto payments are NOT connected (endpoints missing)
- Use "Cash on Delivery" for testing

❌ **Email/SMS:**
- Email verification not sent (no SMTP configured)
- SMS notifications not sent (Twilio not configured)

❌ **Password Reset:**
- "Forgot Password" UI not implemented

❌ **Admin Panel:**
- Admin features limited (can't add/edit pizzas via UI yet)

---

## 📊 Test Checklist

Use this to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Pizza menu loads from backend
- [ ] Can add pizzas to cart
- [ ] Cart shows correct item count
- [ ] Cart syncs with backend
- [ ] Checkout flow completes all 3 steps
- [ ] Order gets created successfully
- [ ] Order tracking shows timeline
- [ ] WebSocket connects (check console)
- [ ] Can view order history
- [ ] Can reorder from history
- [ ] H2 console accessible
- [ ] Database has data (pizzas, users, orders)

---

## 🎯 Quick Start Command

**One-Step Launch:**
Just double-click `START-BACKEND.bat`, wait for startup, then open `index.html` in browser!

---

## 💡 Pro Tips

1. **Keep DevTools Open (F12)** - Helps you see what's happening
2. **Use Admin Login** - admin@slicemaster.com / Admin@123 for testing admin features
3. **Check H2 Console** - Verify data is being saved to database
4. **Watch Backend Logs** - See API calls and errors in real-time
5. **Test WebSocket** - Look for connection messages in browser console

---

## ❓ Still Not Working?

**Backend won't start:**
- Make sure port 8081 is not in use: `netstat -ano | findstr :8081`
- Kill any process using it: `taskkill /PID <process_id> /F`

**Frontend errors:**
- Hard refresh: `Ctrl+Shift+R`
- Clear browser cache
- Check browser console for specific errors

**Can't login:**
- Check Network tab for 401 errors
- Verify backend is running (http://localhost:8081/api/v1/pizzas should return JSON)

---

**Ready to test? Start with Step 1 above! 🚀**
