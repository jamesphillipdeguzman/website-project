// register.js
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".register-form");
    const registerMessage = document.getElementById("register-message");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Optional: Set user_type to Client by default
        const user_type = "Client";

        // Basic validation
        if (!name || !email || !password) {
            registerMessage.textContent = "Please fill out all fields.";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/.netlify/functions/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, user_type }),
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.textContent = data.message;
                registerMessage.style.color = "green";
                registerForm.reset(); // Clear the form
            } else {
                registerMessage.textContent = data.error || "Registration failed.";
                registerMessage.style.color = "red";
            }
        } catch (err) {
            console.error(err);
            registerMessage.textContent = "An error occurred. Please try again.";
            registerMessage.style.color = "red";
        }
    });
});
