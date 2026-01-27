// Contact form
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thanks! We'll contact you within 24 hours.");
});

// Scroll animation trigger
const elements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-up');

function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;

    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) {
            el.style.animationPlayState = "running";
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Chatbot placeholder
document.getElementById("chatbot-container").innerHTML = `
    <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3A7AFE;
        padding: 14px 20px;
        border-radius: 50px;
        cursor: pointer;
        color: white;
        font-weight: bold;
    ">
        Chat with us
    </div>
`;
