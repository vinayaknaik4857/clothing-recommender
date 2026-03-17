// =============================================
// server.js — Main Express backend server
// Run this with: node server.js
// =============================================

const express = require("express");
const cors = require("cors");
const products = require("./data/products.json"); // Our product catalog

const app = express();
const PORT = 3000;

// ---- Middleware ----
app.use(cors()); // Allow frontend to talk to this backend
app.use(express.json()); // Parse incoming JSON requests

// =============================================
// HELPER: Infer body type from height & weight
// Uses BMI as a simple proxy
// =============================================
function getBodyType(heightCm, weightKg) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) return "slim";
  if (bmi < 25) return "athletic";
  if (bmi < 30) return "regular";
  return "plus";
}

// =============================================
// HELPER: Infer age group from age
// =============================================
function getAgeGroup(age) {
  if (age < 18) return "teen";
  if (age < 30) return "young_adult";
  if (age < 45) return "adult";
  return "mature";
}

// =============================================
// HELPER: Map budget label to min/max numbers
// =============================================
function parseBudget(budgetLabel) {
  if (budgetLabel === "500-1000") return { min: 500, max: 1000 };
  if (budgetLabel === "1000-3000") return { min: 1000, max: 3000 };
  return { min: 3000, max: Infinity }; // "3000+"
}

// =============================================
// RECOMMENDATION LOGIC
// Scores each product based on user inputs
// Returns top matches sorted by score
// =============================================
function recommendProducts(userInput) {
  const { age, height, weight, gender, style, budget, platform } = userInput;

  const bodyType = getBodyType(Number(height), Number(weight));
  const ageGroup = getAgeGroup(Number(age));
  const { min, max } = parseBudget(budget);

  // Score every product
  const scored = products
    .filter((p) => {
      // Hard filter: price must be within budget
      if (p.price < min || p.price > max) return false;
      // Hard filter: platform if selected
      if (platform && platform !== "all" && p.platform !== platform) return false;
      return true;
    })
    .map((p) => {
      let score = 0;

      // +3 if gender matches (or product is unisex)
      if (p.gender === gender || p.gender === "unisex") score += 3;

      // +3 if style matches exactly
      if (p.style === style) score += 3;

      // +2 if body type is listed as suitable
      if (p.suitableFor.includes(bodyType)) score += 2;

      // +2 if age group matches
      if (p.ageGroup.includes(ageGroup)) score += 2;

      // +1 bonus if mid-budget (good value signal)
      if (p.price >= min + (max - min) * 0.3 && p.price <= min + (max - min) * 0.7) score += 1;

      return { ...p, score, bodyType, ageGroup };
    })
    .filter((p) => p.score > 0) // Only include relevant items
    .sort((a, b) => b.score - a.score); // Best first

  // Return top 12 results
  return scored.slice(0, 12);
}

// =============================================
// API ROUTE: POST /api/recommend
// Frontend sends user details → gets recommendations
// =============================================
app.post("/api/recommend", (req, res) => {
  const { age, height, weight, gender, style, budget, platform } = req.body;

  // Basic validation
  if (!age || !height || !weight || !gender || !style || !budget) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const results = recommendProducts({ age, height, weight, gender, style, budget, platform });

  res.json({
    bodyType: getBodyType(Number(height), Number(weight)),
    ageGroup: getAgeGroup(Number(age)),
    recommendations: results,
  });
});

// =============================================
// Start the server
// =============================================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
