tsParticles.load("tsparticles", {
  fullScreen: { enable: false },
  background: { color: "#1e1e2f" },
  particles: {
    number: { value: 60 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    move: { enable: true, speed: 1.2 },
    links: { enable: true, distance: 120, color: "#ffffff", opacity: 0.2, width: 1 }
  }
});

// UI UTILITIES
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flip");
}

function shake(id) {
  const el = document.getElementById(id);
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 400);
}

// LOCAL STORAGE USERS FOR ROLE (Admin/Guest)
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUserLocally(user) {
  const users = getUsers();
  if (users.some(u => u.email === user.email)) return false;
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function getUserRole(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  return user ? user.role : "Guest";
}

// FLIP FUNCTION
function flipCard() {
  document.getElementById("card").classList.toggle("flip");
}

// SAVE USER IN LOCALSTORAGE AFTER REGISTRATION
function saveUserToLocal(email, name, role) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.some(u => u.email === email);
  if (!exists) {
    users.push({ email, name, role });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// REGISTER FUNCTION
function register(name, email, password, role) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      // Save to localStorage (for role handling)
      saveUserToLocal(email, name, role);
      alert("Registered successfully!");
      document.getElementById("registerForm").reset();
      flipCard();
    })
    .catch(error => {
      alert("Registration failed: " + error.message);
    });
}

// LOGIN FUNCTION
function login(email, password, rememberMe) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      const user = userCred.user;

      // Get role from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const match = users.find(u => u.email === email);

      if (!match) {
        alert("User role not found.");
        window.location.href = "../not-found.html";
        return;
      }

      // Save session
      if (rememberMe) {
        localStorage.setItem("loggedInUser", JSON.stringify(match));
      } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify(match));
      }

      alert(`Welcome ${match.role}!`);

      // Redirect based on role
      if (match.role === "Admin") {
        window.location.href = "../home/home.html";
      } else {
        window.location.href = "../guest-view/guest-view.html";
      }
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
}

// LOGIN FORM HANDLER
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = document.getElementById("loginBtn");
  btn.classList.add("loading");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  setTimeout(() => {
    btn.classList.remove("loading");
    login(email, password, rememberMe);
  }, 1000);
});

// Show/Hide password when eye icon clicked
function setupEyeToggle(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  icon.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.classList.toggle("fa-eye-slash", isHidden);
    icon.classList.toggle("fa-eye", !isHidden);
  });
}

setupEyeToggle("loginPassword", "toggleLogin");
setupEyeToggle("regPassword", "toggleReg");

// REGISTER FORM HANDLER
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = document.getElementById("registerBtn");
  btn.classList.add("loading");

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const isAdmin = document.getElementById("isAdmin").checked;
  const role = isAdmin ? "Admin" : "Guest";

  setTimeout(() => {
    btn.classList.remove("loading");
    register(name, email, password, role);
  }, 1000);
});

// FORGOT PASSWORD FUNCTION
function forgotPassword() {
  const email = prompt("Enter your registered email:");
  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}
