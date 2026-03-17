# 👗 StyleMatch — Smart Clothing Recommender

A beginner-friendly full-stack web app that recommends clothing from Amazon, Flipkart, Myntra, and Meesho based on user details.

---

## 📁 Folder Structure

```
clothing-recommender/
│
├── client/                   ← Everything the user sees (Frontend)
│   ├── index.html            ← Main HTML page
│   ├── style.css             ← All styles and layout
│   └── app.js                ← JavaScript logic (form, API call, render)
│
└── server/                   ← Backend (runs on your computer/server)
    ├── server.js             ← Express API server
    ├── package.json          ← Node.js dependencies
    └── data/
        └── products.json     ← Simulated product catalog
```

---

## 🏗️ System Architecture

```
User fills form
     ↓
[Frontend - index.html + app.js]
     ↓ POST /api/recommend (JSON body)
[Backend - server.js (Node + Express)]
     ↓ reads from
[data/products.json]
     ↓ applies scoring logic
     ↓ returns top 12 matches
[Frontend renders product cards]
     ↓ user clicks "Shop on Myntra"
[Opens e-commerce site in new tab]
```

---

## ⚙️ How Recommendations Work

1. **BMI Calculation** → `bmi = weight / (height/100)²`
   - BMI < 18.5 → "slim"
   - BMI 18.5–24.9 → "athletic"
   - BMI 25–29.9 → "regular"
   - BMI 30+ → "plus"

2. **Age Group Mapping**
   - Under 18 → "teen"
   - 18–29 → "young_adult"
   - 30–44 → "adult"
   - 45+ → "mature"

3. **Scoring System** (each product gets a score 0–11):
   - +3 if gender matches
   - +3 if style matches
   - +2 if body type is in suitableFor list
   - +2 if age group is in ageGroup list
   - +1 if price is mid-range (good value)

4. **Hard Filters** applied first:
   - Price must be within selected budget
   - Platform must match (if filtered)

5. Top 12 results by score are returned.

---

## 🚀 Setup & Running Locally

### Step 1: Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2: Install backend dependencies
```bash
cd server
npm install
```

### Step 3: Start the backend
```bash
node server.js
# You'll see: ✅ Server running at http://localhost:3000
```

### Step 4: Open the frontend
Just double-click `client/index.html` in your file manager,
OR open it in VS Code and use Live Server extension.

---

## 🌐 Free Deployment Options

### Option A: Deploy frontend on Netlify (free)
1. Go to https://netlify.com → Sign up free
2. Drag & drop the `client/` folder onto the Netlify dashboard
3. Your frontend is live! (e.g. `https://stylematch.netlify.app`)

### Option B: Deploy backend on Render (free)
1. Go to https://render.com → Sign up
2. New Web Service → connect your GitHub repo
3. Set Root Directory to `server`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Get your URL (e.g. `https://stylematch-api.onrender.com`)
7. Update `API_BASE` in `client/app.js` to this URL

### Option C: Both on Railway (simplest)
1. Go to https://railway.app
2. Deploy both frontend + backend together
3. Railway auto-detects Node.js

### Full Stack on Vercel (advanced)
- Use `vercel.json` to configure routes
- Frontend as static files, backend as serverless function

---

## 🔌 How Frontend Connects to Backend

In `app.js`:
```javascript
const API_BASE = "http://localhost:3000"; // Change to your deployed URL

const response = await fetch(`${API_BASE}/api/recommend`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ age, height, weight, gender, style, budget })
});
const data = await response.json();
```

---

## 🛒 Adding More Products

Open `server/data/products.json` and add a new object:
```json
{
  "id": 25,
  "name": "Your Product Name",
  "price": 1500,
  "platform": "amazon",          ← amazon | flipkart | myntra | meesho
  "image": "https://...",         ← product image URL
  "url": "https://amazon.in/s?k=your+product",
  "style": "casual",             ← casual | formal | streetwear | partywear | sportswear | traditional
  "gender": "male",              ← male | female | unisex
  "suitableFor": ["slim", "athletic"],
  "ageGroup": ["young_adult", "adult"],
  "category": "T-Shirt"
}
```

---

## 🔮 Future Improvements

- [ ] Connect to real Flipkart Affiliate API or Amazon Product API
- [ ] Add user login to save preferences
- [ ] Add more filter options (color, season, size)
- [ ] Add a wishlist feature
- [ ] Add product ratings

---

## 📄 License
MIT — free to use and modify.
