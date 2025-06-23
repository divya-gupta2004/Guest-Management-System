// Initialize background
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

// Logout function
function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "../index/index.html";
  });
}

// Show Admin stats
function showStats() {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  document.getElementById("totalGuests").textContent = guests.length;
  document.getElementById("adminCount").textContent = users.filter(u => u.role === "Admin").length;
  document.getElementById("guestCount").textContent = users.filter(u => u.role === "Guest").length;
}

// Protect the page and initialize content
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    return window.location.href = "../index/index.html";
  }

  const me = JSON.parse(localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser"));
  if (!me || me.role !== "Admin") {
    alert("Admins only! Redirecting...");
    return window.location.href = "../not-found.html";
  }

  document.getElementById("username").textContent = me.name;
  showStats();
});



