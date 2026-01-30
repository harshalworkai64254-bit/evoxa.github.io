const BACKEND_URL = "https://evoxa.onrender.com";

// Scroll animations
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-up');

function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;

    animatedElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) {
            el.style.animationName = 'fadeInUp';
            el.style.animationPlayState = 'running';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Signup logic (create Evoxa ID)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;

        try {
            const res = await fetch(`${BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (data.error) {
                alert("Signup failed: " + data.error);
            } else {
                alert("Account created. A verification email will be sent via Zoho.");
            }
        } catch (err) {
            alert("Could not reach server. Try again later.");
        }
    });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (data.error) {
                alert("Login failed: " + data.error);
            } else if (data.created) {
                alert("New account created. A verification email will be sent via Zoho.");
            } else {
                alert("Login successful. Redirecting to dashboard...");
                window.location.href = "dashboard.html";
            }
        } catch (err) {
            alert("Could not reach server. Try again later.");
        }
    });
}

// Contact Us form logic
const contactUsForm = document.getElementById("contactUsForm");
if (contactUsForm) {
    contactUsForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("cuName").value;
        const email = document.getElementById("cuEmail").value;
        const phone = document.getElementById("cuPhone").value;
        const message = document.getElementById("cuMessage").value;

        try {
            const res = await fetch(`${BACKEND_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, message })
            });

            const data = await res.json();
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Message sent successfully. We'll get back to you soon.");
                contactUsForm.reset();
            }
        } catch (err) {
            alert("Could not reach server. Try again later.");
        }
    });
}

// Chat widget logic
const chatButton = document.getElementById("evoxa-chat-button");
const chatWindow = document.getElementById("evoxa-chat-window");
const chatMessages = document.getElementById("evoxa-chat-messages");
const chatInput = document.getElementById("evoxa-chat-input");
const chatSend = document.getElementById("evoxa-chat-send");
const typingIndicator = document.getElementById("evoxa-chat-typing");

if (chatButton && chatWindow) {
    chatButton.onclick = () => {
        chatWindow.style.display =
            chatWindow.style.display === "flex" ? "none" : "flex";
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
    addMessage("Hey, I’m Evoxa’s AI assistant. Ask me anything about our services, pricing, or how we work.", "ai");
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
