for (let i = 0; i < 15; i++) {
    const el = document.createElement("div");
    el.classList.add("bg-shape");
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.width = el.style.height = 40 + Math.random() * 60 + "px";
    el.style.border = "1px solid #1A4FFF55";
    el.style.position = "absolute";
    el.style.borderRadius = "50%";
    document.getElementById("background-floating").appendChild(el);

    anime({
        targets: el,
        translateY: [0, 30],
        duration: 4000 + Math.random() * 2000,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine"
    });
}

anime({
    targets: '.example-tag',
    translateX: ['150%', '-150%'],
    duration: 12000,
    easing: 'linear',
    loop: true,
    delay: anime.stagger(1000)
});

anime({
    targets: '.fake-card',
    opacity: [0, 0.2],
    duration: 2500,
    easing: 'easeInOutQuad',
    loop: true,
    delay: anime.stagger(1500)
});

function submitPrompt() {
    const value = document.getElementById("promptInput").value;
    if (!value) return;
    alert("Prompt envoyé (local front only):\n\n" + value);
}

