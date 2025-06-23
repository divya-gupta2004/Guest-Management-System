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

function renderGuests() {
  const tbody = document.getElementById("guestTable");
  tbody.innerHTML = guests.map(g =>
    `<tr><td>${g.name}</td><td>${g.loc}</td><td>${g.date}</td></tr>`
  ).join("");
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
    if (!user) return window.location.href = "../index/index.html";

    const stored = JSON.parse(localStorage.getItem("users") || "[]");
    const me = stored.find(u => u.email === user.email);

    if (!me || me.role !== "Guest") {
      alert("Access restricted to Guest users only.");
      return window.location.href = "../not-found.html";
    }

    document.getElementById("username").textContent = me.name;
    guests = JSON.parse(localStorage.getItem("guests") || "[]");
    renderGuests();
  });
});


