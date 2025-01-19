// Open Reset Password Modal
function openResetPasswordModal() {
  const modal = document.getElementById("reset-password-modal");
  if (modal) {
    modal.style.display = "flex"; // Show modal
  } else {
    console.error("Modal element not found.");
  }
}

// Close Reset Password Modal
function closeResetPasswordModal() {
  const modal = document.getElementById("reset-password-modal");
  if (modal) {
    modal.style.display = "none"; // Hide modal
  } else {
    console.error("Modal element not found.");
  }
}

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Attach close button functionality
  const closeBtn = document.getElementById("close-reset-password");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeResetPasswordModal);
  } else {
    console.error("Close button not found.");
  }

  // Close modal on outside click
  const modal = document.getElementById("reset-password-modal");
  if (modal) {
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeResetPasswordModal();
      }
    });
  } else {
    console.error("Modal element not found.");
  }

  // Attach form submission listeners
  const emailForm = document.getElementById("resetEmailForm");
  if (emailForm) {
    emailForm.addEventListener("submit", handleSendResetEmail);
  } else {
    console.error("Reset email form not found.");
  }

  const resetForm = document.getElementById("resetPasswordForm");
  if (resetForm) {
    resetForm.addEventListener("submit", handleResetPassword);
  } else {
    console.error("Reset password form not found.");
  }
});

// Handle "Send Reset Email" form submission
function handleSendResetEmail(event) {
  event.preventDefault();

  const email = document.getElementById("reset-email").value; // Get email input
  const API_URL = "http://127.0.0.1:8000/api/user/send-reset-password-email/";

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Reset link sent to your email!");
      } else {
        alert(
          "Failed to send reset link. Please check the email and try again."
        );
      }
    })
    .catch((error) => {
      console.error("Error sending reset email:", error);
      alert("An error occurred. Please try again.");
    });
}

// Extract UID and token from the URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    uid: params.get("uid"),
    token: params.get("token"),
  };
}

// Handle "Reset Password" form submission
async function handleResetPassword(event) {
  event.preventDefault();

  const { uid, token } = getQueryParams(); // Extract UID and token from URL
  const password = document.getElementById("password").value; // Get new password
  const password2 = document.getElementById("password2").value; // Get confirm password

  if (!uid || !token) {
    alert("Invalid reset password link.");
    return;
  }

  const API_URL = `http://127.0.0.1:8000/api/user/reset-password/${uid}/${token}/`;
  const payload = { password, password2 };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Password reset successfully!");
      window.location.href = "/login.html"; // Redirect to login page
    } else {
      const data = await response.json();
      alert(
        data?.non_field_errors || "Error resetting password. Please try again."
      );
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Something went wrong. Please try again later.");
  }
}
