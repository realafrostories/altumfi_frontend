import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collectionGroup,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCF4I3704KZW6jmvasHGmdsK468ssAuebA",
    authDomain: "altumfi-f39f1.firebaseapp.com",
    projectId: "altumfi-f39f1",
    storageBucket: "altumfi-f39f1.firebasestorage.app",
    messagingSenderId: "838201454123",
    appId: "1:838201454123:web:c738f1938438c7dd9b446e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UI Elements
const tabPending = document.getElementById("tabPending");
const tabApproved = document.getElementById("tabApproved");
const tabDisapproved = document.getElementById("tabDisapproved");

const pendingSection = document.getElementById("pendingSection");
const approvedSection = document.getElementById("approvedSection");
const disapprovedSection = document.getElementById("disapprovedSection");

const pendingList = document.getElementById("pendingList");
const approvedList = document.getElementById("approvedList");
const disapprovedList = document.getElementById("disapprovedList");

// Load Deposits
async function loadDeposits() {
  const snapshot = await getDocs(collectionGroup(db, "records"));
  pendingList.innerHTML = "";
  approvedList.innerHTML = "";
  disapprovedList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const pathSegments = docSnap.ref.path.split("/");

    if (pathSegments.length === 4) {
      const userId = pathSegments[1];
      const depositId = pathSegments[3];

      const div = document.createElement("div");
      div.className = "deposit-item";

      let extraFields = "";

      if (data.method === "GiftCard") {
        if (data.cardType) extraFields += `<strong>Card Type:</strong> ${data.cardType}<br>`;
        if (data.cardValue) extraFields += `<strong>Card Value:</strong> $${data.cardValue}<br>`;
        if (data.claimedValue) extraFields += `<strong>Claimed USD:</strong> $${data.claimedValue}<br>`;
        if (data.proof)  extraFields += `<strong>Card Code:</strong> ${data.proof}<br>`;
        
      }

      div.innerHTML = `
        <div>
          <strong>User:</strong> ${userId}<br>
          <strong>Method:</strong> ${data.method}<br>
          <strong>Amount:</strong> $${data.amount}<br>
          <strong>Time:</strong> ${new Date(data.createdAt).toLocaleString()}<br>
          ${extraFields}
        </div>
      `;

      if (data.status === "pending") {
        // Approve Button
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.className = "approve-btn";
        approveBtn.addEventListener("click", async () => {
          const ref = doc(db, "Deposits", userId, "records", depositId);
          await updateDoc(ref, { status: "true" });
          alert(`✅ Approved deposit for user: ${userId}`);
          loadDeposits();
        });
        div.appendChild(approveBtn);

        // Disapprove Button
        const disapproveBtn = document.createElement("button");
        disapproveBtn.textContent = "Disapprove";
        disapproveBtn.className = "disapprove-btn";
        disapproveBtn.style.marginLeft = "10px";
        disapproveBtn.style.backgroundColor = "#e74c3c";
        disapproveBtn.style.color = "#fff";
        disapproveBtn.style.border = "none";
        disapproveBtn.style.padding = "6px 14px";
        disapproveBtn.style.borderRadius = "5px";
        disapproveBtn.style.cursor = "pointer";
        disapproveBtn.style.fontWeight = "600";
        disapproveBtn.addEventListener("click", async () => {
          const ref = doc(db, "Deposits", userId, "records", depositId);
          await updateDoc(ref, { status: "false" });
          alert(`❌ Disapproved deposit for user: ${userId}`);
          loadDeposits();
        });
        div.appendChild(disapproveBtn);

        pendingList.appendChild(div);
      }

      if (data.status === "true") {
        approvedList.appendChild(div);
      }

      if (data.status === "false") {
        disapprovedList.appendChild(div);
      }
    }
  });
}

loadDeposits();

// Tab Switching
tabPending.addEventListener("click", () => {
  tabPending.classList.add("active");
  tabApproved.classList.remove("active");
  tabDisapproved.classList.remove("active");

  pendingSection.classList.add("active");
  approvedSection.classList.remove("active");
  disapprovedSection.classList.remove("active");
});

tabApproved.addEventListener("click", () => {
  tabApproved.classList.add("active");
  tabPending.classList.remove("active");
  tabDisapproved.classList.remove("active");

  approvedSection.classList.add("active");
  pendingSection.classList.remove("active");
  disapprovedSection.classList.remove("active");
});

tabDisapproved.addEventListener("click", () => {
  tabDisapproved.classList.add("active");
  tabPending.classList.remove("active");
  tabApproved.classList.remove("active");

  disapprovedSection.classList.add("active");
  pendingSection.classList.remove("active");
  approvedSection.classList.remove("active");
});