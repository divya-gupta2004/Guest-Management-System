tsParticles.load("tsparticles", {
  background: { color: "#1e1e2f" },
  particles: {
    number: { value: 60 },
    color: { value: "#fff" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    move: { enable: true, speed: 1.2 },
    links: { enable: true, distance: 120, color: "#fff", opacity: 0.2, width: 1 }
  }
});

let guests = [];  

function render() {
  const tbody = document.getElementById("guestTable");
  if (!tbody) return;
  tbody.innerHTML = guests.map((g, i) => `
    <tr>
      <td>${g.name}</td>
      <td>${g.loc}</td>
      <td>${g.date}</td>
      <td>${g.checkIn ? new Date(g.checkIn).toLocaleString() : '-'}</td>
      <td>${g.checkOut ? new Date(g.checkOut).toLocaleString() : '-'}</td>
      <td>${g.checkIn ? getElapsedTime(g.checkIn) : '-'}</td>
      <td>${actionButtons(i)}</td>
    </tr>
  `).join('');

  const totalEl = document.getElementById("totalGuests");
  if (totalEl) totalEl.textContent = guests.length;
}

function actionButtons(i) {
  return `
    <button class="checkin-btn" onclick="checkIn(${i})">Check-In</button>
    <button class="checkout-btn" onclick="checkOut(${i})">Check-Out</button>
    <button class="edit-btn" onclick="editGuest(${i})">Edit</button>
    <button class="delete-btn" onclick="deleteGuest(${i})">Delete</button>`;
}


function getElapsedTime(checkIn) {
  const diff = Date.now() - new Date(checkIn).getTime();
  const mins = Math.floor(diff / 60000);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function saveGuests() {
  localStorage.setItem("guests", JSON.stringify(guests));
  render();
}

function addGuest() {
  const nameEl = document.getElementById("guestName");
  const locEl  = document.getElementById("guestLocation");
  const name = nameEl.value.trim();
  const loc = locEl.value.trim();

  if (!name || !loc) {
    alert("Please fill all fields.");
    return;
  }

  guests.push({ 
    name, loc, 
    date: new Date().toLocaleDateString(), 
    checkIn: null, 
    checkOut: null 
  });

  nameEl.value = "";
  locEl.value = "";
  saveGuests();
}

function editGuest(i) {
  const g = guests[i];
  const newName = prompt("Edit Name:", g.name);
  const newLoc = prompt("Edit Location:", g.loc);
  if (newName && newLoc) {
    guests[i] = { ...g, name: newName, loc: newLoc };
    saveGuests();
  }
}

function deleteGuest(i) {
  if (!confirm("Remove this guest?")) return;
  guests.splice(i, 1);
  saveGuests();
}

function checkIn(i) {
  if (!confirm("Confirm check-in?")) return;
  guests[i].checkIn = new Date().toISOString();
  saveGuests();
}

function checkOut(i) {
  if (!guests[i].checkIn) {
    alert("Please check-in the guest before checking out.");
    return;
  }

  if (!confirm("Confirm check-out?")) return;
  guests[i].checkOut = new Date().toISOString();
  saveGuests();
}

function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "../index/index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      return window.location.href = "../index/index.html";
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const me = storedUsers.find(u => u.email === user.email);
    if (!me || me.role !== "Admin") {
      alert("Admins only!");
      return window.location.href = "../not-found.html";
    }

    guests = JSON.parse(localStorage.getItem("guests") || "[]");
    render();

    const addBtn = document.getElementById("addGuestBtn");
    if (addBtn) addBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submission
    addGuest();
});

  });
});



