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

// Contact form (placeholder)
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thanks! We’ll reach out within 24 hours.");
});

// Chat widget logic
const chatButton = document.getElementById("evoxa-chat-button");
const chatWindow = document.getElementById("evoxa-chat-window");
const chatMessages = document.getElementById("evoxa-chat-messages");
const chatInput = document.getElementById("evoxa-chat-input");
const chatSend = document.getElementById("evoxa-chat-send");
const typingIndicator = document.getElementById("evoxa-chat-typing");

// Toggle window
chatButton.onclick = () => {
    chatWindow.style.display =
        chatWindow.style.display === "flex" ? "none" : "flex";
};

// Add message
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial welcome message
addMessage("Hey, I’m Evoxa’s AI assistant. Ask me anything about our services, pricing, or how we work.", "ai");

// Send message
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    typingIndicator.style.display = "block";

    try {
        const res = await fetch("https://YOUR_BACKEND_URL/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                user_id: "website-visitor"
            })
        });

        const data = await res.json();
        typingIndicator.style.display = "none";
        addMessage(data.reply || "Something went wrong, please try again.", "ai");
    } catch (err) {
        typingIndicator.style.display = "none";
        addMessage("I couldn’t reach the server. Please try again later.", "ai");
    }
}

chatSend.onclick = sendMessage;
chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
