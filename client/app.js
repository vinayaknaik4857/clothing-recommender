// =============================================
// app.js — StyleMatch Frontend Logic
// Handles form submission, API calls, rendering
// =============================================

// ---- CONFIG ----
// Change this URL to your deployed backend URL when hosting
const API_BASE = "http://localhost:3000";

// ---- Get DOM references ----
const form          = document.getElementById("recommendForm");
const formSection   = document.getElementById("formSection");
const resultsSection= document.getElementById("resultsSection");
const productsGrid  = document.getElementById("productsGrid");
const profileBadge  = document.getElementById("profileBadge");
const emptyState    = document.getElementById("emptyState");
const submitBtn     = document.getElementById("submitBtn");
const btnText       = submitBtn.querySelector(".btn-text");
const btnLoader     = submitBtn.querySelector(".btn-loader");
const formError     = document.getElementById("formError");
const backBtn       = document.getElementById("backBtn");
const filterTabs    = document.querySelectorAll(".filter-tab");

// ---- Store fetched results globally for client-side filtering ----
let allRecommendations = [];
let userProfile = {};

// =============================================
// FORM SUBMIT — collect inputs & call API
// =============================================
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the page from reloading

  // --- Gather values ---
  const age    = document.getElementById("age").value.trim();
  const height = document.getElementById("height").value.trim();
  const weight = document.getElementById("weight").value.trim();
  const gender = form.querySelector('input[name="gender"]:checked')?.value;
  const style  = form.querySelector('input[name="style"]:checked')?.value;
  const budget = form.querySelector('input[name="budget"]:checked')?.value;

  // --- Validate ---
  if (!age || !height || !weight || !gender || !style || !budget) {
    formError.hidden = false;
    formError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  formError.hidden = true;

  // --- Show loading state ---
  setLoading(true);
  showSkeletons();

  // --- Show results section immediately with skeletons ---
  formSection.hidden = true;
  resultsSection.hidden = false;

  try {
    // === CALL THE BACKEND API ===
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, height, weight, gender, style, budget, platform: "all" }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // data = { bodyType, ageGroup, recommendations: [...] }

    // Store globally
    allRecommendations = data.recommendations;
    userProfile = { age, height, weight, gender, style, budget, bodyType: data.bodyType, ageGroup: data.ageGroup };

    // Show profile info strip
    renderProfileBadge(userProfile);

    // Render products
    renderProducts(allRecommendations);

    // Reset filter tabs to "All"
    filterTabs.forEach(t => t.classList.remove("active"));
    document.querySelector('.filter-tab[data-platform="all"]').classList.add("active");

  } catch (err) {
    // Show a friendly error if API is unreachable
    productsGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px; color:#c0392b;">
        <p style="font-size:1.1rem">⚠️ Could not reach the backend server.</p>
        <p style="font-size:0.9rem; color:#888; margin-top:8px">
          Make sure the backend is running at <strong>${API_BASE}</strong><br/>
          Run: <code>node server.js</code> in the <code>/server</code> folder.
        </p>
      </div>
    `;
    console.error("API Error:", err);
  } finally {
    setLoading(false);
  }
});

// =============================================
// RENDER: Profile badge strip
// =============================================
function renderProfileBadge({ age, gender, style, budget, bodyType, ageGroup }) {
  const bodyLabels = {
    slim: "Slim Build",
    athletic: "Athletic Build",
    regular: "Regular Build",
    plus: "Plus Size"
  };
  const ageLabels = {
    teen: "Teen",
    young_adult: "Young Adult",
    adult: "Adult",
    mature: "Mature"
  };

  profileBadge.innerHTML = `
    ✦ &nbsp;
    <strong>${ageLabels[ageGroup] || ageGroup}</strong> ·
    <strong>${capitalize(gender)}</strong> ·
    <strong>${bodyLabels[bodyType] || bodyType}</strong> ·
    Style: <strong>${capitalize(style)}</strong> ·
    Budget: <strong>₹${budget}</strong>
  `;
}

// =============================================
// RENDER: Products grid
// =============================================
function renderProducts(products) {
  productsGrid.innerHTML = ""; // Clear previous content

  if (!products || products.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  products.forEach((product) => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

// =============================================
// CREATE: Single product card element
// =============================================
function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.platform = p.platform; // For client-side filtering

  card.innerHTML = `
    <div class="product-image-wrap">
      <img
        src="${p.image}"
        alt="${p.name}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80'"
      />
      <span class="platform-badge ${p.platform}">${capitalize(p.platform)}</span>
      <span class="score-badge" title="Match score">${p.score}</span>
    </div>
    <div class="product-info">
      <p class="product-name">${p.name}</p>
      <div class="product-meta">
        <span class="product-price">₹${p.price.toLocaleString("en-IN")}</span>
        <span class="product-category">${p.category}</span>
      </div>
      <a
        href="${p.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-shop ${p.platform}"
      >
        Shop on ${capitalize(p.platform)} →
      </a>
    </div>
  `;

  return card;
}

// =============================================
// FILTER: Platform tabs (client-side, no new API call)
// =============================================
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active tab style
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const platform = tab.dataset.platform;

    // Filter the cached recommendations
    if (platform === "all") {
      renderProducts(allRecommendations);
    } else {
      const filtered = allRecommendations.filter(p => p.platform === platform);
      renderProducts(filtered);
    }
  });
});

// =============================================
// BACK: Go back to form
// =============================================
backBtn.addEventListener("click", () => {
  resultsSection.hidden = true;
  formSection.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============================================
// SKELETON LOADER: Show placeholder cards while loading
// =============================================
function showSkeletons() {
  productsGrid.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    productsGrid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line btn"></div>
        </div>
      </div>
    `;
  }
}

// =============================================
// LOADING STATE: Disable/enable submit button
// =============================================
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.hidden = isLoading;
  btnLoader.hidden = !isLoading;
}

// =============================================
// UTIL: Capitalize first letter
// =============================================
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================
// DEMO MODE: If backend is not running,
// allow testing with local data
// =============================================
// Uncomment the block below and comment out the
// fetch() call in the submit handler to use local demo data

/*
async function getMockRecommendations(userInput) {
  // Simulate a small delay
  await new Promise(r => setTimeout(r, 800));

  // Return a subset of local data for demo purposes
  const localProducts = [
    {
      id: 1, name: "Classic White Oxford Shirt", price: 799,
      platform: "amazon", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
      url: "https://www.amazon.in/s?k=white+oxford+shirt", style: "formal",
      gender: "male", category: "Shirt", score: 8
    },
    // add more items here for demo...
  ];
  return { bodyType: "athletic", ageGroup: "young_adult", recommendations: localProducts };
}
*/
