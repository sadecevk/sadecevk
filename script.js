const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startButton');
const modal = document.getElementById('explosionModal');
const modalText = document.getElementById('explosionText');

const names = ["Nurinin Götü", "İlyasın Götü", "Barışın Götü"];
let baskets = [
    { x: 20, y: 530, width: 100, height: 40, color: '#e74c3c', name: names[0] },
    { x: 150, y: 530, width: 100, height: 40, color: '#f1c40f', name: names[1] },
    { x: 280, y: 530, width: 100, height: 40, color: '#3498db', name: names[2] }
];

let activeFruit = null; 
let gameRunning = false;
let speed = 6;
const LIMIT = 130;

function createFruit() {
    if (!gameRunning) return;
    activeFruit = {
        x: Math.random() * (canvas.width - 60) + 30,
        y: -30,
        radius: 18,
        color: '#FFD700'
    };
}

function gameLoop() {
    if (!gameRunning) return;

    // UPDATE
    if (activeFruit) {
        activeFruit.y += speed;

        baskets.forEach(basket => {
            if (activeFruit &&
                activeFruit.x > basket.x && 
                activeFruit.x < basket.x + basket.width &&
                activeFruit.y + activeFruit.radius > basket.y) {
                
                basket.height += 25; 
                basket.y -= 25;      
                activeFruit = null; 

                if (basket.height >= LIMIT) {
                    gameRunning = false;
                    modalText.innerHTML = "💥 GÜÜÜM! <br>" + basket.name.toUpperCase() + " PATLADI! 💥";
                    modal.style.display = "flex";
                } else {
                    setTimeout(createFruit, 300);
                }
            }
        });

        if (activeFruit && activeFruit.y > canvas.height) {
            activeFruit = null;
            setTimeout(createFruit, 300);
        }
    } else {
        createFruit();
    }

    // DRAW
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    baskets.forEach(basket => {
        ctx.fillStyle = basket.color;
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(basket.name, basket.x + (basket.width / 2), 585);
    });

    if (activeFruit) {
        ctx.beginPath();
        ctx.arc(activeFruit.x, activeFruit.y, activeFruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeFruit.color;
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(gameLoop);
}

// KONTROLLER
function move(dir) {
    if (!activeFruit || !gameRunning) return;
    if (dir === 'L' && activeFruit.x > 30) activeFruit.x -= 45;
    if (dir === 'R' && activeFruit.x < canvas.width - 30) activeFruit.x += 45;
}

window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") move('L');
    if (e.key === "ArrowRight") move('R');
});

canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    if (x < canvas.width / 2) move('L'); else move('R');
    e.preventDefault();
}, {passive: false});

// BAŞLATMA
startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.style.display = 'none';
        gameLoop();
    }
});