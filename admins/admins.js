// Ensure this script runs after DOM and Firebase SDK have loaded
document.addEventListener("DOMContentLoaded", () => {

  // Firebase auth check
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Not logged in then go back to login
      return window.location.href = "../index/index.html";
    }

    // Grab stored user with role
    const me = JSON.parse(localStorage.getItem("loggedInUser") 
                     || sessionStorage.getItem("loggedInUser"));
    if (!me || me.role !== "Admin") {
      alert("Admins only!");
      return window.location.href = "../not-found.html";
    }

    // Now that auth is confirmed, render the admin table
    renderAdmins();
  });

});

// Renders the admin users table
function renderAdmins() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const table = document.getElementById("adminTable");
  if (!table) {
    console.error("⚠️ No element with ID 'adminTable' found in the DOM!");
    return;
  }

  table.innerHTML = users
    .map((u, i) => {
      if (u.role !== "Admin") return "";  // skip non-admin users
      return `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td><button class="delete-btn" onclick="deleteAdmin(${i})">Delete</button></td>
        </tr>`;
    })
    .join("");
}

// Deletes an admin, preventing deletion of the currently logged-in admin
function deleteAdmin(i) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const toDelete = users[i];
  const me = JSON.parse(localStorage.getItem("loggedInUser") 
                   || sessionStorage.getItem("loggedInUser"));
  
  if (toDelete.email === me.email) {
    return alert("🚫 You can't delete yourself while logged in.");
  }

  if (!confirm(`Are you sure you want to delete admin '${toDelete.name}'?`)) return;

  users.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  renderAdmins();
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "../index/index.html";
  });
}


