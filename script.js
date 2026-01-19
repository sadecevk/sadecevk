const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

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
        color: '#FFD700' // Muz Sarısı
    };
}

function update() {
    if (!gameRunning) return;

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
                    setTimeout(() => {
                        alert("💥 GÜÜÜM! " + basket.name + " PATLADI! 💥");
                        location.reload();
                    }, 100);
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
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    baskets.forEach(basket => {
        ctx.fillStyle = basket.color;
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(basket.x, basket.y, basket.width, basket.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(basket.name, basket.x + (basket.width / 2), 585);
    });

    if (activeFruit) {
        ctx.beginPath();
        ctx.arc(activeFruit.x, activeFruit.y, activeFruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeFruit.color;
        ctx.fill();
        ctx.strokeStyle = "#DAA520";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    if (gameRunning) {
        update();
        requestAnimationFrame(draw);
    }
}

// --- KONTROL MEKANİZMASI ---

function handleMove(direction) {
    if (!gameRunning || !activeFruit) return;
    if (direction === 'left' && activeFruit.x > 30) activeFruit.x -= 45;
    if (direction === 'right' && activeFruit.x < canvas.width - 30) activeFruit.x += 45;
}

// Klavye
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") handleMove('left');
    if (e.key === "ArrowRight") handleMove('right');
});

// Mobil & Mouse Dokunma
const inputHandler = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    
    if (x < canvas.width / 2) handleMove('left');
    else handleMove('right');
    
    if (e.cancelable) e.preventDefault();
};

canvas.addEventListener('touchstart', inputHandler, {passive: false});
canvas.addEventListener('mousedown', inputHandler);

// BAŞLATMA
startButton.onclick = (e) => {
    e.preventDefault();
    if (!gameRunning) {
        gameRunning = true;
        startButton.style.display = 'none';
        createFruit();
        draw();
    }
};