// ================== CONFIG ==================
const BACKEND_URL = "https://YOUR_BACKEND_URL"; // replace with your live backend URL

// ================== SCROLL ANIMATIONS ==================
const animatedElements = document.querySelectorAll(".fade-in, .fade-in-up, .slide-up");

function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;

    animatedElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) {
            el.style.animationName = "fadeInUp";
            el.style.animationPlayState = "running";
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ================== HELPERS ==================
function setButtonLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
        button.classList.add("loading");
        button.disabled = true;
    } else {
        button.classList.remove("loading");
        button.disabled = false;
    }
}

function showEmailPopup(messageHtml) {
    const popup = document.getElementById("emailPopup");
    if (!popup) return;

    const textEl = popup.querySelector(".popup-box p");
    if (textEl && messageHtml) {
        textEl.innerHTML = messageHtml;
    }

    popup.style.display = "flex";
}

function hideEmailPopup() {
    const popup = document.getElementById("emailPopup");
    if (!popup) return;
    popup.style.display = "none";
}

// Close popup button (if present)
const closePopupBtn = document.getElementById("closePopupBtn");
if (closePopupBtn) {
    closePopupBtn.addEventListener("click", hideEmailPopup);
}

// Optional "resend" button (for signup popup etc.)
const resendEmailBtn = document.getElementById("resendEmailBtn");
if (resendEmailBtn) {
    resendEmailBtn.addEventListener("click", () => {
        hideEmailPopup();
        alert("If you don’t see the email, please check spam or try signing up again.");
    });
}

// ================== SIGNUP LOGIC ==================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("signupEmail");
        const passwordInput = document.getElementById("signupPassword");
        const submitBtn = signupForm.querySelector("button[type='submit']");

        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        setButtonLoading(submitBtn, true);

        try {
            const res = await fetch(`${BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (!res.ok || data.error) {
                alert("Signup failed: " + (data.error || "Unknown error"));
            } else {
                showEmailPopup(
                    "Your account has been created.<br>" +
                    "We’ve sent a verification email—please check your inbox and spam folder."
                );
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Could not reach server. Try again later.");
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

// ================== LOGIN LOGIC ==================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const submitBtn = loginForm.querySelector("button[type='submit']");

        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        setButtonLoading(submitBtn, true);

        try {
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log("Login response:", data);

            if (!res.ok || data.error) {
                alert("Login failed: " + (data.error || "Unknown error"));
            } else {
                alert("Login successful. Redirecting to dashboard...");
                window.location.href = "dashboard.html";
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Could not reach server. Try again later.");
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

// ================== CONTACT FORM LOGIC ==================
const contactUsForm = document.getElementById("contactUsForm");
if (contactUsForm) {
    contactUsForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = contactUsForm.querySelector("button[type='submit']");
        setButtonLoading(submitBtn, true);

        const name = document.getElementById("cuName")?.value.trim();
        const email = document.getElementById("cuEmail")?.value.trim();
        const phoneInput = document.getElementById("cuPhone");
        const message = document.getElementById("cuMessage")?.value.trim();

        // Backend requires phone, but some forms may not have it → send "N/A" if missing
        let phone = phoneInput ? phoneInput.value.trim() : "";
        if (!phone) phone = "N/A";

        if (!name || !email || !message) {
            setButtonLoading(submitBtn, false);
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, message })
            });

            const data = await res.json();
            console.log("Contact form response:", data);

            if (!res.ok || data.error) {
                showEmailPopup(
                    "There was an error sending your message.<br>" +
                    "Please try again or email <strong>harshaladari@evoxa.co.uk</strong> directly."
                );
            } else {
                showEmailPopup(
                    "Your message has been sent.<br>" +
                    "We’ll reply to your inbox soon—check spam just in case."
                );
                contactUsForm.reset();
            }
        } catch (err) {
            console.error("Contact form error:", err);
            showEmailPopup(
                "We couldn’t reach the server.<br>" +
                "Please try again later or email <strong>harshaladari@evoxa.co.uk</strong>."
            );
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

// ================== CHAT WIDGET LOGIC ==================
const chatButton = document.getElementById("evoxa-chat-button");
const chatWindow = document.getElementById("evoxa-chat-window");
const chatMessages = document.getElementById("evoxa-chat-messages");
const chatInput = document.getElementById("evoxa-chat-input");
const chatSend = document.getElementById("evoxa-chat-send");
const typingIndicator = document.getElementById("evoxa-chat-typing");
const chatClose = document.getElementById("evoxa-chat-close");

if (chatButton && chatWindow) {
    chatButton.onclick = () => {
        chatWindow.style.display =
            chatWindow.style.display === "flex" ? "none" : "flex";
    };
}

if (chatClose && chatWindow) {
    chatClose.onclick = () => {
        chatWindow.style.display = "none";
    };
}

function addMessage(text, sender) {
    if (!chatMessages) return;
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (chatMessages) {
    addMessage(
        "Hey, I’m Evoxa’s AI assistant. Ask me anything about our websites, AI live chat, or AI voice receptionist.",
        "ai"
    );
}

async function sendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    if (typingIndicator) typingIndicator.style.display = "block";

    try {
        const res = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                user_id: "website-visitor"
            })
        });

        const data = await res.json();
        if (typingIndicator) typingIndicator.style.display = "none";
        addMessage(data.reply || "Something went wrong, please try again.", "ai");
    } catch (err) {
        console.error("Chat error:", err);
        if (typingIndicator) typingIndicator.style.display = "none";
        addMessage("I couldn’t reach the server. Please try again later.", "ai");
    }
}

if (chatSend) chatSend.onclick = sendMessage;
if (chatInput) {
    chatInput.addEventListener("keydown", e => {
        if (e.key === "Enter") sendMessage();
    });
}
