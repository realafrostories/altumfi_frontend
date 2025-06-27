import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCF4I3704KZW6jmvasHGmdsK468ssAuebA",
    authDomain: "altumfi-f39f1.firebaseapp.com",
    projectId: "altumfi-f39f1",
    storageBucket: "altumfi-f39f1.firebasestorage.app",
    messagingSenderId: "838201454123",
    appId: "1:838201454123:web:c738f1938438c7dd9b446e"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);



onAuthStateChanged(auth, (user) => {
  if (!user) return console.error("User not logged in");

  const userId = user.uid;
  const messagesRef = collection(db, "Support", userId, "messages");

  const typingRef = doc(db, "Support", userId);
  onSnapshot(typingRef, (docSnap) => {
    const data = docSnap.data();
    if (!data) return;
    data.typing ? showTypingIndicator() : hideTypingIndicator();
  });

  const supportModal = document.getElementById("supportModal");
  const openSupportBtn = document.getElementById("chatSupportBtn");
  const closeBtn = document.getElementById("closeSupportModal");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!supportModal || !openSupportBtn) return console.warn("Support modal or chat button not found in DOM.");

  const supportAvatar = "https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg";
  const agentNames = ["Zara", "Kofi", "Sophia", "James", "Lucy", "Lucas", "Hannah", "Ahmed"];
  let agent = sessionStorage.getItem("chatAgent");

  if (!agent) {
    agent = agentNames[Math.floor(Math.random() * agentNames.length)];
    sessionStorage.setItem("chatAgent", agent);
  }

  document.querySelector(".agent-name").textContent = `${agent} (Support)`;
  

  const q = query(messagesRef, orderBy("timestamp"));

  restoreAutoReplies();
  onSnapshot(q, (snapshot) => {
    chatMessages.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      appendMessage({
        text: data.text,
        sender: data.sender === "admin" ? "support" : "user"
      });
    });
  });

  openSupportBtn.addEventListener("click", () => {
    supportModal.classList.add("active");

    if (!sessionStorage.getItem("chatAgent")) {
      agent = agentNames[Math.floor(Math.random() * agentNames.length)];
      sessionStorage.setItem("chatAgent", agent);
    } else {
      agent = sessionStorage.getItem("chatAgent");
    }

    document.querySelector(".agent-name").textContent = `${agent} (Support)`;

    if (!sessionStorage.getItem("chatWelcomed")) {
      const welcomeMessages = [
        `👋 Hey there! ${agent} here. What can I help you with today?`,
        `🎧 Hi! I'm ${agent}, part of the BitFidelity support team.`,
        `👋 Hello! ${agent} reporting for support duty! How can I assist?`,
        `🙌 Welcome back! ${agent} is here to help.`,
        `😊 You're chatting with ${agent}. Let me know what you need!`
      ];
      const selected = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        appendMessage({ text: selected, sender: "support" });
      }, 1200);

      sessionStorage.setItem("chatWelcomed", "true");
    }
  });

  closeBtn.addEventListener("click", () => {
    appendMessage({
      text: `⚠️ Chat session ended with ${agent}.`,
      sender: "system"
    });
    supportModal.classList.remove("active");
    sessionStorage.removeItem("chatAgent");
    sessionStorage.removeItem("chatWelcomed");
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage({ text: message, sender: "user" });
    chatInput.value = "";

    await addDoc(messagesRef, {
      text: message,
      sender: "user",
      timestamp: serverTimestamp()
    });

    handleQuickReply(message.toLowerCase());
  });

  // 🔑 Place inside auth block so quickReplies is in scope
  const quickReplies = {
    btc: {
      response: `🪙 <strong>BTC Wallet:</strong><br>Address: <code>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code><br><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" alt="BTC QR" style="margin-top:6px;max-width:140px;">`,
      html: true
    },
    usdt: {
      response: `💵 <strong>USDT Wallet:</strong><br>TRC-20 Address: <code>TX7qkV1p8XkM9BkwZfbKfH9JvkmjZP1uyK</code><br><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TX7qkV1p8XkM9BkwZfbKfH9JvkmjZP1uyK" alt="USDT QR" style="margin-top:6px;max-width:140px;">`,
      html: true
    },
    eth: {
      response: `🌐 <strong>ETH Wallet:</strong><br>Address: <code>0xAbC1234567890defABC1234567890DefAbC12345</code><br><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0xAbC1234567890defABC1234567890DefAbC12345" alt="ETH QR" style="margin-top:6px;max-width:140px;">`,
      html: true
    },
    "how to deposit": {
      response: `📽️ Here's how to deposit crypto:\n👉 <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" style="color:blue;">Watch this Binance Deposit Guide</a>`,
      html: true
    },
    "how to fund": {
      response: `📽️ Here's how to fund your wallet:\n👉 <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" style="color:blue;">Watch this Binance Funding Tutorial</a>`,
      html: true
    },
    giftcard: { response: "" },
    verification: { response: "" },
    withdraw: { response: "" },
    scam: { response: "" },
    blocked: { response: "" }
  };

  // 🔄 Inside `handleQuickReply()` → update the reply display with thumbnail preview if it's a YouTube/video link
function handleQuickReply(text) {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/gi, '');
  for (let keyword in quickReplies) {
    if (normalizedText.includes(keyword)) {
      const reply = quickReplies[keyword];
      if (reply && reply.response) {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();

          if (reply.html) {
            const wrapper = document.createElement("div");
            wrapper.className = `chat-row support`;

            // 🖼️ Check for link to embed thumbnail (only YouTube-style here)
            const youtubeMatch = reply.response.match(/href="(https:\/\/www\.youtube\.com\/watch\?v=([^"]+))"/);
            let thumbnailHTML = "";

            if (youtubeMatch) {
              const videoId = youtubeMatch[2];
              thumbnailHTML = `
                <br>
                <a href="${youtubeMatch[1]}" target="_blank">
                  <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                       alt="Video Thumbnail" 
                       style="margin-top:8px;max-width:220px;border-radius:6px;" />
                </a>
              `;
            }

            wrapper.innerHTML = `
              <img src="${supportAvatar}" class="chat-avatar" />
              <div class="chat-message support">${reply.response}${thumbnailHTML}</div>
            `;

            chatMessages.appendChild(wrapper);

            // 🧠 Save to sessionStorage
            const replies = JSON.parse(sessionStorage.getItem("autoReplies") || "[]");
            replies.push({
              html: reply.response + thumbnailHTML,
              timestamp: Date.now()
            });
            sessionStorage.setItem("autoReplies", JSON.stringify(replies));

          } else {
            appendMessage({ text: reply.response, sender: "support" });
          }

          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1200);
      }
      break;
    }
  }
}


  function restoreAutoReplies() {
  const replies = JSON.parse(sessionStorage.getItem("autoReplies") || "[]");
  replies.forEach((replyObj) => {
    const wrapper = document.createElement("div");
    wrapper.className = `chat-row support`;
    wrapper.innerHTML = `
      <img src="${supportAvatar}" class="chat-avatar" />
      <div class="chat-message support">${replyObj.html}</div>
    `;
    chatMessages.appendChild(wrapper);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

});

// 🔄 Keep these global so typing and message appending still work
function appendMessage({ text, sender }) {
  const wrapper = document.createElement("div");
  wrapper.className = `chat-row ${sender}`;
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.textContent = text;

  if (sender === "support") {
    const avatar = document.createElement("img");
    avatar.src = "https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg";
    avatar.className = "chat-avatar";
    wrapper.appendChild(avatar);
  }

  wrapper.appendChild(msg);
  document.getElementById("chatMessages").appendChild(wrapper);
  document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
}

function showTypingIndicator() {
  const existing = document.getElementById("typingIndicator");
  if (existing) return;

  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className = "chat-row support";
  indicator.innerHTML = `
    <img src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg" class="chat-avatar" />
    <div class="chat-message support typing-bubble">
      Support is typing<span class="dots">...</span>
    </div>
  `;
  document.getElementById("chatMessages").appendChild(indicator);
  document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}
