const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startButton');
const modal = document.getElementById('explosionModal');
const modalText = document.getElementById('explosionText');

// Görselleri Yükle
const imgAgiz = new Image(); imgAgiz.src = 'ibrahim_agiz.png';
const imgGot = new Image(); imgGot.src = 'ibrahim_got.png';

let baskets = [
    { x: 30, y: 500, width: 150, height: 80, img: imgAgiz, name: "İbrahimin ağzına ver" },
    { x: 220, y: 500, width: 150, height: 80, img: imgGot, name: "İbrahimin götüne sok" }
];

let activeFruit = null; 
let gameRunning = false;
let speed = 7; // Biraz hızlandırdık
const LIMIT = 200; // Daha fazla şişebilsin

function createFruit() {
    if (!gameRunning) return;
    activeFruit = { x: Math.random() * 340 + 30, y: -20, radius: 18 };
}

function loop() {
    if (!gameRunning) return;

    // UPDATE
    if (!activeFruit) createFruit();
    activeFruit.y += speed;

    baskets.forEach(b => {
        if (activeFruit && activeFruit.x > b.x && activeFruit.x < b.x + b.width && activeFruit.y > b.y) {
            b.height += 30; // Yakaladıkça daha çok şişer
            b.y -= 30;      
            activeFruit = null;
            
            if (b.height >= LIMIT) {
                gameRunning = false;
                modalText.innerHTML = "💥 GÜÜÜM! 💥<br>" + b.name.toUpperCase() + " PATLADI!";
                modal.style.display = "flex";
            }
        }
    });

    if (activeFruit && activeFruit.y > 600) activeFruit = null;

    // DRAW
    ctx.clearRect(0, 0, 400, 600);
    baskets.forEach(b => {
        // Görseli çiz
        ctx.drawImage(b.img, b.x, b.y, b.width, b.height);
        
        // İsmi çiz
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(b.name, b.x + (b.width / 2), 590);
    });

    if (activeFruit) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(activeFruit.x, activeFruit.y, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(loop);
}

// KONTROLLER
function move(dir) {
    if (activeFruit && gameRunning) {
        if (dir === 'L' && activeFruit.x > 30) activeFruit.x -= 50;
        if (dir === 'R' && activeFruit.x < 370) activeFruit.x += 50;
    }
}

window.addEventListener('keydown', e => {
    if (e.key === "ArrowLeft") move('L');
    if (e.key === "ArrowRight") move('R');
});

canvas.addEventListener('touchstart', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    move(x < canvas.width/2 ? 'L' : 'R');
    e.preventDefault();
}, {passive: false});

startBtn.onclick = () => {
    gameRunning = true;
    startBtn.style.display = 'none';
    loop();
};