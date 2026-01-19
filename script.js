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
let speed = 5;
const LIMIT = 120;

function createFruit() {
    if (!gameRunning) return; 
    
    activeFruit = {
        x: Math.random() * (canvas.width - 60) + 30,
        y: -30,
        radius: 15,
        color: '#FFD700'
    };
}

function update() {
    if (!gameRunning) return;

    if (activeFruit) {
        activeFruit.y += speed;

        // Çarpışma kontrolü
        baskets.forEach(basket => {
            if (activeFruit &&
                activeFruit.x > basket.x && 
                activeFruit.x < basket.x + basket.width &&
                activeFruit.y + activeFruit.radius > basket.y) {
                
                basket.height += 20; 
                basket.y -= 20;      
                activeFruit = null; 

                if (basket.height >= LIMIT) {
                    gameRunning = false;
                    setTimeout(() => {
                        alert("💥 GÜÜÜM! " + basket.name + " PATLADI! 💥");
                        location.reload();
                    }, 100);
                } else {
                    // Bir sonraki meyveyi oluştur
                    setTimeout(createFruit, 400);
                }
            }
        });

        // Ekranın altına ulaşıp kaçarsa
        if (activeFruit && activeFruit.y > canvas.height) {
            activeFruit = null;
            setTimeout(createFruit, 400);
        }
    } else {
        // Eğer oyun çalışıyor ama meyve yoksa (ilk başlangıç anı gibi)
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
        ctx.stroke();
        ctx.closePath();
    }

    if (gameRunning) {
        update();
        requestAnimationFrame(draw);
    }
}

// Kontroller
document.addEventListener('keydown', (e) => {
    if (activeFruit && gameRunning) {
        if (e.key === "ArrowLeft" && activeFruit.x > 25) activeFruit.x -= 35;
        if (e.key === "ArrowRight" && activeFruit.x < canvas.width - 25) activeFruit.x += 35;
    }
});

// BAŞLATMA FONKSİYONU - GARANTİLİ
startButton.onclick = function() {
    if (!gameRunning) {
        gameRunning = true;
        startButton.style.display = 'none';
        console.log("Oyun Başlatıldı");
        createFruit(); // İlk meyveyi oluştur
        draw(); // Çizim döngüsünü başlat
    }
};