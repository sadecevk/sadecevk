const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// İsimleri buradan değiştirebilirsin
const names = ["Nurinin Götü", "İlyasın Götü", "Barışın Götü"];

let baskets = [
    { x: 20, y: 530, width: 100, height: 40, color: '#e74c3c', name: names[0] },
    { x: 150, y: 530, width: 100, height: 40, color: '#f1c40f', name: names[1] },
    { x: 280, y: 530, width: 100, height: 40, color: '#3498db', name: names[2] }
];

let fruits = [];
let gameRunning = false;
let speed = 4;
const LIMIT = 120; // Patlama yüksekliği sınırı

function createFruit() {
    if (!gameRunning) return;
    fruits.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        radius: 15,
        color: '#FFD700' // Muz sarısı
    });
    // Her 1.2 saniyede bir yeni meyve düşer
    setTimeout(createFruit, 1200);
}

function update() {
    if (!gameRunning) return;

    for (let i = fruits.length - 1; i >= 0; i--) {
        fruits[i].y += speed;

        baskets.forEach(basket => {
            // Basit çarpışma kontrolü
            if (fruits[i] &&
                fruits[i].x > basket.x && 
                fruits[i].x < basket.x + basket.width &&
                fruits[i].y + fruits[i].radius > basket.y) {
                
                // Sepet yukarı doğru büyür
                basket.height += 15; 
                basket.y -= 15;      
                fruits.splice(i, 1);

                // Patlama kontrolü
                if (basket.height >= LIMIT) {
                    gameRunning = false;
                    setTimeout(() => {
                        alert("💥 GÜÜÜM! " + basket.name + " PATLADI! 💥");
                        location.reload();
                    }, 100);
                }
            }
        });

        if (fruits[i] && fruits[i].y > canvas.height) {
            fruits.splice(i, i);
        }
    }
}

function draw() {
    // Arka planı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    baskets.forEach(basket => {
        // Sepeti (Götü) çiz
        ctx.fillStyle = basket.color;
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        
        // Kenarlık
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(basket.x, basket.y, basket.width, basket.height);

        // İSİMLER BURADA: Sepetin altına sabitlendi
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(basket.name, basket.x + (basket.width / 2), 585);
    });

    // Meyveleri (Muzları) çiz
    fruits.forEach(fruit => {
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = fruit.color;
        ctx.fill();
        ctx.strokeStyle = "#DAA520";
        ctx.stroke();
        ctx.closePath();
    });

    if (gameRunning) {
        update();
        requestAnimationFrame(draw);
    }
}

// Kontroller: En son çıkan meyveyi yönetir
document.addEventListener('keydown', (e) => {
    if (fruits.length > 0) {
        let activeFruit = fruits[fruits.length - 1];
        if (e.key === "ArrowLeft" && activeFruit.x > 20) activeFruit.x -= 25;
        if (e.key === "ArrowRight" && activeFruit.x < canvas.width - 20) activeFruit.x += 25;
    }
});

startButton.addEventListener('click', () => {
    gameRunning = true;
    startButton.style.display = 'none';
    createFruit();
    draw();
});