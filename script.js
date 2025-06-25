// 🔁 Fetch BTC Price from CoinGecko
let usdRate = 0;


async function loadBitcoinNews() {
  try {
    const response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?categories=BTC");
    const data = await response.json();

    const articles = data.Data.slice(0, 10).map(article => {
      return `<a href="${article.url}" target="_blank">📰 ${article.title}</a>`;
    });

    document.getElementById("newsContent").innerHTML = articles.join(" • ");
  } catch (err) {
    console.error("Error fetching news:", err);
    document.getElementById("newsContent").innerHTML = "⚠️ Could not load Bitcoin news.";
  }
}

loadBitcoinNews();
setInterval(loadBitcoinNews, 10 * 60 * 1000); // Update every 10 mins

async function getBTCPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    const price = data.bitcoin.usd;
    usdRate = price;
    document.getElementById("btc-price").innerText = `$${price.toLocaleString()}`;
  } catch (error) {
    document.getElementById("btc-price").innerText = "Error fetching price";
    console.error(error);
  }
}

getBTCPrice();
setInterval(getBTCPrice, 60000); // Refresh every minute

// 🪙 Simulated BTC Growth & Toggle
let btcAmount = 0;
let isBTC = true;
let usdtRate = 0;
const btcAddress = "17MWdxfjPYP2PYhdy885QtihfbW181r1rn"; // 🔁 Replace with your real BTC address

async function fetchBTCBalance() {
  try {
    const response = await fetch(`https://blockchain.info/q/addressbalance/${btcAddress}?confirmations=6`);
    const satoshis = await response.text();
    btcAmount = parseInt(satoshis) / 100000000;
    updateCounter();
  } catch (err) {
    console.error("Error fetching BTC balance:", err);
  }
}

document.getElementById("newsletterForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = this.querySelector("input").value;
  alert(`✅ Thanks for subscribing, ${email}!`);
  this.reset();
});

function calculateROI() {
  const amount = parseFloat(document.getElementById("amountInput").value);
  const planDays = parseInt(document.getElementById("planSelect").value);
  let roi = 0;

  if (isNaN(amount) || amount < 10) {
    document.getElementById("roiResult").innerText = "Enter $10 or more";
    return;
  }

  if (planDays === 7) roi = amount * 0.06;
  if (planDays === 30) roi = amount * 0.28;
  if (planDays === 90) roi = amount * 0.90;

  const total = amount + roi;

  document.getElementById("roiResult").innerText =
    `💰 ROI: $${roi.toFixed(2)}\n📈 Total: $${total.toFixed(2)}`;
}

// Toggle ROI Widget
const roiToggle = document.getElementById("roiToggle");
const roiPopup = document.getElementById("roiPopup");

roiToggle.addEventListener("click", () => {
  roiPopup.style.display = roiPopup.style.display === "block" ? "none" : "block";
});


function toggleChatbot() {
  const panel = document.getElementById("chatbotPanel");
  if (panel.classList.contains("show")) {
    panel.classList.remove("show");
    setTimeout(() => panel.style.display = "none", 300);
  } else {
    panel.style.display = "flex";
    setTimeout(() => panel.classList.add("show"), 10);
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  appendChatMessage(msg, "user-msg");
  input.value = "";

  setTimeout(() => {
    const response = getBotReply(msg.toLowerCase());
    appendChatMessage(response, "bot-msg");
  }, 600);
}

function appendChatMessage(text, className) {
  const chat = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.className = className;

  const avatar = document.createElement("div");
avatar.className = "avatar";
avatar.style.background = className === "bot-msg" ? "#fff" : "#1c8adb";
avatar.style.color = "#fff";
avatar.style.display = "flex";
avatar.style.alignItems = "center";
avatar.style.justifyContent = "center";
avatar.style.fontSize = "14px";
avatar.innerText = className === "bot-msg" ? "🤖" : "🧑";

  const msgText = document.createElement("div");
  msgText.className = "msg-text";
  msgText.innerText = text;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(msgText);
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

const walletWidget = document.getElementById('walletGrowthWidget');
const heroSection = document.getElementById('hero');

function handleWalletWidgetVisibility() {
  const heroBottom = heroSection.getBoundingClientRect().bottom;

  if (heroBottom < 0) {
    walletWidget.classList.add('hidden');
  } else {
    walletWidget.classList.remove('hidden');
  }
}

window.addEventListener('scroll', handleWalletWidgetVisibility);


function getBotReply(input) {
  const message = input.toLowerCase();

  const responses = [
    {
      keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
      reply: [
        "Hey there 👋! How can I assist you today?",
        "Hi! 👋 Need help with deposits or profits?",
        "Hello, friend! 😊 Ask me anything about your investments.",
      ],
    },
    {
      keywords: ["how are you", "how's it going", "what's up"],
      reply: [
        "I'm doing great! Thanks for asking 🤖💙",
        "All systems are running smooth 🟢. What can I help you with?",
        "Better now that you're here 😄 What can I do for you today?",
      ],
    },
    {
      keywords: ["withdraw", "payout", "cash out", "get my money"],
      reply: [
        "Withdrawals are processed within 24–48 hours 💸 straight to your BTC wallet.",
        "Once your investment matures, your BTC is sent out quickly 🚀.",
      ],
    },
    {
      keywords: ["deposit", "fund", "top up", "send bitcoin", "make payment"],
      reply: [
        "You can deposit BTC using your dashboard address 📥.",
        "Simply fund your account by sending BTC to your wallet. Need help?",
      ],
    },
    {
      keywords: ["profit", "earn", "return", "roi", "gain"],
      reply: [
        "We offer up to 25% ROI per cycle 📈.",
        "Watch your investment grow with guaranteed ROI! 💰",
      ],
    },
    {
      keywords: ["referral", "invite", "refer", "bonus"],
      reply: [
        "Refer your friends and earn 5% from their deposits! 👫💸",
        "Sharing is earning! Invite & earn commissions 📣.",
      ],
    },
    {
      keywords: ["support", "help", "contact", "problem", "issue"],
      reply: [
        "I'm always here to help 😊 or reach our team at support@bitfidelity.com.",
        "Need help? Just ask me or email support@bitfidelity.com 📧.",
      ],
    },
    {
      keywords: ["balance", "wallet", "funds", "my btc"],
      reply: [
        "Your BTC balance is updated live on your dashboard 🧾.",
        "Check your wallet section for real-time balances 💼.",
      ],
    },
    {
      keywords: ["plan", "investment", "options", "package"],
      reply: [
        "We offer Starter, Pro, and VIP plans — each with tailored ROI 🧠.",
        "Our plans start from as low as $10 💡. Want a recommendation?",
      ],
    },
    {
      keywords: ["signup", "register", "create account"],
      reply: [
        "You can sign up from the homepage — it takes just a few seconds! 📝",
        "Ready to start investing? Head to the sign-up section 💪.",
      ],
    },
    {
      keywords: ["login", "log in", "sign in"],
      reply: [
        "Click on the login button at the top and you're good to go! 🔐",
        "Log in to access your dashboard and manage your funds 🚪.",
      ],
    },
    {
      keywords: ["scam", "legit", "safe", "trust", "secure"],
      reply: [
        "BitFidelity is built on transparency and blockchain tech 🔒✅.",
        "We use encrypted systems to protect your data and funds 💎.",
      ],
    },
    {
      keywords: ["thank", "thanks", "appreciate"],
      reply: [
        "You're very welcome! 😊",
        "Anytime, happy to help! 💙",
      ],
    },
    {
      keywords: ["bye", "goodbye", "see you", "later"],
      reply: [
        "Bye for now 👋! Wishing you great profits!",
        "See you soon! Stay invested 💼.",
      ],
    },
  ];

  for (let response of responses) {
    if (response.keywords.some(keyword => message.includes(keyword))) {
      const replies = response.reply;
      return Array.isArray(replies)
        ? replies[Math.floor(Math.random() * replies.length)]
        : replies;
    }
  }

  // Friendly fallback
  const defaultReplies = [
    "🤖 Hmm, I didn't catch that. Try asking about plans, ROI, or withdrawals!",
    "I'm here to assist with anything from deposits to support — fire away 🔥!",
    "That’s an interesting question! Can you rephrase it a little?",
  ];
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}



const testimonials = [
  {
    name: "Emma Johnson",
    flag: "🇺🇸",
    text: "BitFidelity helped me grow my crypto safely. The platform is super intuitive.",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    rating: 5
  },
  {
    name: "Liam Carter",
    flag: "🇬🇧",
    text: "I started small and have already seen serious returns. Love the weekly insights.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4
  },
  {
    name: "Oluwatobi Adebayo",
    flag: "🇳🇬",
    text: "BitFidelity stands out in Nigeria. Transparent fees and instant payout.",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    rating: 5
  },
  {
    name: "Ava Martin",
    flag: "🇨🇦",
    text: "I appreciate their strong security and support. Excellent for long-term growth.",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    rating: 5
  },
  {
    name: "Lukas Schmidt",
    flag: "🇩🇪",
    text: "Solid BTC strategies. I recommend it to anyone looking to diversify.",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    rating: 4
  },
  {
    name: "Thabo Ndlovu",
    flag: "🇿🇦",
    text: "As a South African investor, I feel confident using BitFidelity daily.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5
  },
  {
    name: "Priya Singh",
    flag: "🇮🇳",
    text: "BitFidelity’s dashboard is super easy to use. Even beginners can benefit!",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    rating: 4
  },
  {
    name: "Julien Moreau",
    flag: "🇫🇷",
    text: "Secure platform, excellent ROI, and fast support. A real gem!",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    rating: 5
  },
  {
    name: "Camila Souza",
    flag: "🇧🇷",
    text: "It’s the most trusted BTC pltfrm I’ve found in Brazil.",
    avatar: "https://randomuser.me/api/portraits/women/40.jpg",
    rating: 4
  },
  {
    name: "Aisha Mwangi",
    flag: "🇰🇪",
    text: "Best in class! Withdrawals hit my wallet instantly. Very satisfied.",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    rating: 5
  }
];

const testimonialsGrid = document.getElementById("testimonialsGrid");

testimonials.forEach((t) => {
  const card = document.createElement("div");
  card.className = "testimonial-card";

  const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);

  card.innerHTML = `
    <img class="testimonial-avatar" src="${t.avatar}" alt="${t.name}">
    <div class="testimonial-name">
      <span class="flag">${t.flag}</span> ${t.name}
    </div>
    <div class="testimonial-stars">${stars}</div>
    <div class="testimonial-text">“${t.text}”</div>
  `;
  testimonialsGrid.appendChild(card);
});


function updateCounter() {
  const btcDisplay = document.getElementById("btcCounter");
  if (isBTC) {
    btcDisplay.innerText = `₿ ${btcAmount.toFixed(8)}`;
  } else {
    const usdValue = btcAmount * usdtRate;
    btcDisplay.innerText = `$ ${usdValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
}

// Update every 30 seconds
setInterval(fetchBTCBalance, 30000);
fetchBTCBalance(); // Initial load


// 🔘 Toggle Button Logic
const toggleBtn = document.getElementById("toggleCurrency");
toggleBtn.addEventListener("click", () => {
  isBTC = !isBTC;
  toggleBtn.innerText = isBTC ? "Switch to USD" : "Switch to BTC";
  updateCounter();
});

// 💳 Modal Logic
const modal = document.getElementById("depositModal");
const planTitle = document.getElementById("selectedPlanTitle");
const amountInput = document.getElementById("amount");

function openModal(planName) {
  modal.style.display = "block";
  planTitle.textContent = `Plan: ${planName}`;
  amountInput.value = '';
}

function closeModal() {
  modal.style.display = "none";
}

function submitInvestment(event) {
  event.preventDefault();

  const amount = parseFloat(amountInput.value);
  const plan = planTitle.textContent.replace("Plan: ", "");

  if (isNaN(amount) || amount < 10) {
    alert("Please enter a valid amount ($10 or more).");
    return;
  }

  const deposit = {
    plan: plan,
    amount: amount,
    date: new Date().toLocaleString(),
    id: Date.now()
  };

  let deposits = JSON.parse(localStorage.getItem("bitFidelityDeposits")) || [];
  deposits.push(deposit);
  localStorage.setItem("bitFidelityDeposits", JSON.stringify(deposits));

  alert(`✅ Deposit of $${amount} saved under "${plan}"!`);
  closeModal();
}




