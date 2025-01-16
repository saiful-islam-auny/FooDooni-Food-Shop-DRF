const handleRegistration = (event) => {
  event.preventDefault();
  const name = getValue("name");
  const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const tc = document.querySelector('input[name="tc"]').checked;

  const info = { name, email, password, password2: confirm_password, tc };

  if (password === confirm_password) {
    document.getElementById("error").innerText = "";
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      })
        .then((res) => {
          if (!res.ok) {
            throw res.json();
          }
          return res.json();
        })
        .then((data) => {
          console.log("Success:", data);
          // Show success message
          document.getElementById("error").innerText = ""; // Clear error message
          document.getElementById("success").innerText = data.msg; // Show success message
        })
        .catch(async (err) => {
          const errorData = await err;
          console.error("Error:", errorData);
          document.getElementById("error").innerText = JSON.stringify(
            errorData.errors
          );
        });
    } else {
      document.getElementById("error").innerText =
        "Password must contain eight characters, at least one letter, one number, and one special character.";
    }
  } else {
    document.getElementById("error").innerText =
      "Password and confirm password do not match.";
  }
};

const getValue = (id) => {
  return document.getElementById(id).value;
};

const handleLogin = (event) => {
  event.preventDefault();

  // Get values from form inputs
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;

  console.log(email, password);

  if (email && password) {
    // Call the login API
    fetch("http://127.0.0.1:8000/api/user/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.token) {
          // Store the token in localStorage or sessionStorage for future use
          localStorage.setItem("token", data.token.access);
          // Redirect the user to the home page or another page
          window.location.href = "index.html";
        } else if (data.error) {
          // Handle error (e.g., account not activated)
          alert(data.error);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
      });
  } else {
    alert("Please enter both email and password.");
  }
};


document.addEventListener("DOMContentLoaded", function () {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  // console.log("Token found:", token);

  // Select navbar elements
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutLink = document.getElementById("logoutLink");
  const profileLink = document.getElementById("profileLink");

  if (token) {
    // User is logged in
    loginLink.classList.add("d-none");
    signupLink.classList.add("d-none");
    logoutLink.classList.remove("d-none");
    profileLink.classList.remove("d-none");

    // Add event listener for logout
    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("token"); // Clear token
      window.location.href = "/login.html"; // Redirect to login page
    });
  } else {
    // User is not logged in
    loginLink.classList.remove("d-none");
    signupLink.classList.remove("d-none");
    logoutLink.classList.add("d-none");
    profileLink.classList.add("d-none");
  }
});



// profile showing
const API_PROFILE_URL = "http://127.0.0.1:8000/api/user/profile/";
const API_CHANGE_PASSWORD_URL = "http://127.0.0.1:8000/api/user/changepassword/";
const API_RESET_PASSWORD_URL = "http://127.0.0.1:8000/api/user/send-reset-password-email/";


function showToastProfile(message, type = "info") {
  let container = document.getElementById("toast-profile-container");
  
  // If the container doesn't exist, create it
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-profile-container";
    document.body.appendChild(container); // You can append it to any other parent
  }

  const toast = document.createElement("div");
  toast.className = `toast-profile ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  toast.style.opacity = "1";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300); // Match fade-out duration
  }, 3000);
}


// Fetch user profile
function fetchUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    Profile("Please log in to access your profile.", "error");
    window.location.href = "./login.html";
    return;
  }

  fetch(API_PROFILE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-email").textContent = data.email;
    })
    .catch((error) => {
      console.error(error);
      Profile("Error fetching profile data.", "error");
    });
  console.log(container); // This should not be null
}

// Handle password change
function setupChangePasswordModal() {
  const changePasswordModal = document.getElementById("change-password-modal");
  const closeBtn = document.getElementById("close-change-password");
  const changePasswordForm = document.getElementById("change-password-form");

  // Show the modal when the button is clicked
  document.getElementById("change-password-btn").addEventListener("click", () => {
    changePasswordModal.style.display = "block";
  });

  // Close the modal when the close button is clicked
  closeBtn.addEventListener("click", () => {
    console.log("Closing modal..."); // Debugging line
    changePasswordModal.style.display = "none";
  });


  // Handle form submission
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      showToastProfile("Passwords do not match!", "error");
      return;
    }

    // Send the password change request
    fetch(API_CHANGE_PASSWORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword, password2: confirmPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Failed to change password");
          });
        }
        return response.json();
      })
      .then(() => {
        // Close the modal first, then show the success toast
        changePasswordModal.style.display = "none";
        showToastProfile("Password changed successfully!", "success");
      })
      .catch((error) => {
        console.error(error);
        showToastProfile("Error changing password.", "error");
      });
  });
}

setupChangePasswordModal();


// Handle reset password
document.getElementById("reset-password-btn").addEventListener("click", () => {
  const email = document.getElementById("user-email").textContent;

  fetch(API_RESET_PASSWORD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }
      return response.json();
    })
    .then(() => {
      Profile("Reset password email sent!", "success");
    })
    .catch((error) => {
      console.error(error);
      Profile("Error sending reset email.", "error");
    });
});

// Initialize
fetchUserProfile();
setupChangePasswordModal();



