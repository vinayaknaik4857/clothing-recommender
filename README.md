StyleMatch 👗✦
Smart Clothing Recommender for Indian Shoppers
StyleMatch is a full-stack web app that recommends clothing from Amazon, Flipkart, Myntra, and Meesho based on your age, body type, style preference, and budget. Built with HTML, CSS, JavaScript, and Node.js.
🔗 Live Site: your-netlify-url.netlify.app
🖥️ Backend API: stylematch-api-s0qv.onrender.com
📦 GitHub: github.com/vinayaknaik4857/clothing-recommender

✨ Features

Enter your age, height, weight, gender, style, and budget
App calculates your body type using BMI automatically
Smart scoring engine matches you with the best products
Results show product name, price, platform badge, and match score
Filter results by platform — Amazon, Flipkart, Myntra, or Meesho
Every product links directly to the shopping platform
Fully mobile responsive


🛠️ Tech Stack
LayerTechnologyFrontendHTML, CSS, Vanilla JavaScriptBackendNode.js + ExpressProduct DataJSON file (7,500+ products)Frontend HostingNetlify (free)Backend HostingRender (free)

📁 Folder Structure
clothing-recommender/
│
├── client/                        ← Frontend (what users see)
│   ├── index.html                 ← Main page with form and results
│   ├── index-standalone.html      ← Works without backend, open directly
│   ├── style.css                  ← All styling
│   └── app.js                     ← Form logic, API calls, rendering
│
└── server/                        ← Backend (recommendation engine)
    ├── server.js                  ← Express server and scoring logic
    ├── package.json               ← Node.js dependencies
    └── data/
        └── products.json          ← 7,500+ product catalog

⚙️ How Recommendations Work
Step 1 — Body Type from BMI
BMI = weight (kg) / height (m)²

BMI < 18.5        → slim
BMI 18.5 – 24.9   → athletic
BMI 25 – 29.9     → regular
BMI 30+           → plus
Step 2 — Age Group
Under 18   → teen
18 – 29    → young_adult
30 – 44    → adult
45+        → mature
Step 3 — Product Scoring
Every product in the catalog gets a score based on how well it matches the user:
+3   gender matches (or product is unisex)
+3   style matches exactly
+2   body type is in product's suitableFor list
+2   age group is in product's ageGroup list
+1   price is mid-range within budget (good value signal)
Products are sorted by score and the top 12 are returned. Users can filter by platform on the results page without making a new API request.

🚀 Running Locally
Option A — No setup (standalone)
Just open client/index-standalone.html by double-clicking it in File Explorer. Everything runs in the browser with no backend needed.
Option B — Full stack

Install Node.js from nodejs.org — choose LTS version
Open Command Prompt inside the server folder
Run these commands:

bashnpm install
node server.js

Open client/index.html in your browser

The backend runs at http://localhost:3000. Keep the terminal open while using the site.

🌐 Deployment (Free)
This project is deployed using two free services:
Backend → Render
SettingValueRoot DirectoryserverBuild Commandnpm installStart Commandnode server.jsInstance TypeFree
Frontend → Netlify
SettingValueBase DirectoryclientPublish DirectoryclientBuild Command(leave empty)
After deploying the backend on Render, update this line in client/app.js:
javascriptconst API_BASE = "https://stylematch-api-s0qv.onrender.com";
Then push to GitHub — Netlify will auto-redeploy.

⚠️ Note: Render's free tier sleeps after 15 minutes of inactivity. The first request after sleep takes around 30 seconds to wake up. This is normal behaviour on the free plan.


🛒 Product Catalog
The catalog has 7,500+ products covering:
CategoryDetailsStylesCasual, Formal, Streetwear, Partywear, Sportswear, TraditionalGendersMale, Female, UnisexBody TypesSlim, Athletic, Regular, PlusAge GroupsTeen, Young Adult, Adult, MaturePlatformsAmazon, Flipkart, Myntra, MeeshoPrice Range₹499 – ₹7,999
To add your own products, open server/data/products.json and add a new entry:
json{
  "id": 7537,
  "name": "Black Cotton Casual T-Shirt",
  "price": 799,
  "platform": "amazon",
  "image": "https://your-image-url.com/photo.jpg",
  "url": "https://www.amazon.in/s?k=black+cotton+casual+tshirt",
  "style": "casual",
  "gender": "male",
  "suitableFor": ["slim", "athletic", "regular"],
  "ageGroup": ["young_adult", "adult"],
  "category": "T-Shirt"
}

🔮 Future Plans

 AI-powered recommendations using Claude API
 Real product listings via Amazon / Flipkart affiliate APIs
 User accounts to save preferences and wishlist
 Filter by color, size, and season
 Product ratings and reviews
 Dark mode


📄 License
MIT — free to use, modify, and distribute.

Built with ♥ by vinayaknaik4857
