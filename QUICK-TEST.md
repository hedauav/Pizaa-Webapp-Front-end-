# 🍕 Quick Test Checklist - SliceMaster Pizza

## ✅ Servers Running
- Backend: http://localhost:8081
- Frontend: http://localhost:5500
- **CORS Fixed:** Backend now accepts requests from frontend

---

## 🧪 Start Testing (In Order):

### ✅ 1. Register a New User
**Steps:**
1. Click **"Login"** (top-right)
2. Click **"Sign Up"**
3. Fill form:
   - First Name: Test
   - Last Name: User  
   - Email: test@pizza.com
   - Phone: +91 9876543210
   - Password: password123
4. Click **"Create Account"**

**Expected:** Success toast, modal closes, "Hi Test" appears

---

### ✅ 2. Login
**Steps:**
1. Click **"Login"** again
2. Enter:
   - Email: test@pizza.com
   - Password: password123
3. Click **"Sign In"**

**Expected:** Success message, you're logged in

---

### ✅ 3. Browse Pizzas
**Check:**
- Pizza cards load automatically
- You see pizza names, prices, images
- Categories work (click Vegetarian, Non-Veg)

---

### ✅ 4. Add to Cart
**Steps:**
1. Click **"Add to Cart"** on any pizza
2. Watch for:
   - Green success toast
   - Cart icon shows (1)
   - Cart sidebar opens

---

###  5. View Cart
**Steps:**
1. Click cart icon
2. See your items
3. Change quantity (+/-)
4. Try removing an item

---

### ✅ 6. Checkout
**Steps:**
1. Click **"Proceed to Checkout"**
2. **Step 1:** Fill address form
3. **Step 2:** Select "Cash on Delivery"
4. **Step 3:** Click "Place Order"

**Expected:** Order success page with order number

---

### ✅ 7. Check Console (F12)
**Should see:**
- ✅ "Auth module initialized"
- ✅ "Menu module initialized"
- ✅ "Cart module initialized"
- ❌ NO red errors about CORS

---

## 🔍 Quick Tests

| Test | Action | Expected Result |
|------|--------|----------------|
| API Working | Open http://localhost:8081/api/v1/pizzas | See JSON data |
| Database | Open http://localhost:8081/h2-console | Login with sa/(empty) |
| Pizza Menu | Scroll down | See pizza cards |
| Filter | Click "Vegetarian" | Menu filters |
| Toast | Add to cart | Green notification |

---

## 🐛 If You See CORS Errors:

**The backend was just updated to fix CORS!**

If you still see:
```
blocked by CORS policy
```

**Solution:** 
1. Close all Edge/Chrome windows
2. Reopen http://localhost:5500
3. Try again

---

## 💡 Pro Tips:

- **Press F12** - See console logs and network calls
- **Network Tab** - Watch API calls to localhost:8081
- **Console Tab** - Check for errors (should be none!)
- **Admin Login** - admin@slicemaster.com / Admin@123

---

## ✅ Success Indicators:

✓ No CORS errors  
✓ Pizza menu loads  
✓ Can register/login  
✓ Cart works  
✓ Can place order  
✓ WebSocket connects (check console)  

---

**Start with Test #1 (Register) and work your way down! 🚀**
