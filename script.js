const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const names = ["Nurinin Götü", "İlyasın Götü", "Barışın Götü"];

let baskets = [
    { x: 20, y: 530, width: 100, height: 40, color: '#e74c3c', name: names[0] },
    { x: 150, y: 530, width: 100, height: 40, color: '#f1c40f', name: names[1] },
    { x: 280, y: 530, width: 100, height: 40, color: '#3498db', name: names[2] }
];

let activeFruit = null; // Sadece tek bir aktif meyve olacak
let gameRunning = false;
let speed = 5;
const LIMIT = 120;

function createFruit() {
    if (!gameRunning || activeFruit !== null) return; 
    
    activeFruit = {
        x: Math.random() * (canvas.width - 40) + 20,
        y: -20,
        radius: 15,
        color: '#FFD700'
    };
}

function update() {
    if (!gameRunning || !activeFruit) return;

    activeFruit.y += speed;

    // Çarpışma kontrolü
    baskets.forEach(basket => {
        if (activeFruit &&
            activeFruit.x > basket.x && 
            activeFruit.x < basket.x + basket.width &&
            activeFruit.y + activeFruit.radius > basket.y) {
            
            basket.height += 20; 
            basket.y -= 20;      
            activeFruit = null; // Meyve sepete girdi, yok et

            if (basket.height >= LIMIT) {
                gameRunning = false;
                setTimeout(() => {
                    alert("💥 GÜÜÜM! " + basket.name + " PATLADI! 💥");
                    location.reload();
                }, 100);
            } else {
                // Sepete girdi ama patlamadıysa yeni meyve oluştur
                setTimeout(createFruit, 500);
            }
        }
    });

    // Ekranın altına ulaşıp kaçarsa
    if (activeFruit && activeFruit.y > canvas.height) {
        activeFruit = null;
        setTimeout(createFruit, 500);
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