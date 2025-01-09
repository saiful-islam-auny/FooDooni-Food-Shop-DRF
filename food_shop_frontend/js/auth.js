const handleRegistration = (event) => {
    event.preventDefault();
    const name = getValue("name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
    const tc = document.querySelector('input[name="tc"]').checked;

    const info = { name, email, password, password2: confirm_password, tc }; 
    console.log(info);

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
                })
                .catch(async (err) => {
                    const errorData = await err;
                    console.error("Error:", errorData);
                    document.getElementById("error").innerText =
                        JSON.stringify(errorData.errors);
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
