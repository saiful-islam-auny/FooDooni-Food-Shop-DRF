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
