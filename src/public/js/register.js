// register.js
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".register-form");
    const registerMessage = document.getElementById("register-message");
    const timeInput = document.getElementById("form_start_time");

    // Track when form was displayed to enforce human fill duration
    const pageLoadedAt = Date.now();
    if (timeInput) {
        timeInput.value = pageLoadedAt;
    }

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const company_fax = document.getElementById("company_fax")?.value || "";
        const form_start_time = timeInput?.value || pageLoadedAt;

        // Optional: Set user_type to Client by default
        const user_type = "Client";

        // Basic validation
        if (!name || !email || !password) {
            registerMessage.textContent = "Please fill out all fields.";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    user_type,
                    company_fax,
                    form_start_time,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.textContent = data.message || "Registration successful!";
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
