document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const scoreDisplay = document.getElementById('scoreDisplay');

    const ROW = 20;
    const COL = 10;
    const SQ = 30; // KARE BOYUTU
    const VACANT = "BLACK"; // Boş kare rengi

    let board = [];
    let score = 0;
    let gameOver = false;
    let dropInterval;

    // Board'u oluştur
    function drawBoard() {
        for (let r = 0; r < ROW; r++) {
            board[r] = [];
            for (let c = 0; c < COL; c++) {
                board[r][c] = VACANT;
            }
        }
    }

    // Kare çiz
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
        ctx.strokeStyle = "Gainsboro";
        ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }

    // Tahtayı çiz
    function drawBoardSquares() {
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }

    // Parça nesneleri (basitçe bir kare, diğer şekilleri sonradan ekleriz)
    const PIECES = [
        [ [0,0], [1,0], [0,1], [1,1] ] // Kare (O-piece)
    ];
    const COLORS = ["red"]; // Şekil renkleri

    class Piece {
        constructor(tetromino, color) {
            this.tetromino = tetromino;
            this.color = color;
            this.x = COL / 2 - 1; // Başlangıç X
            this.y = -1; // Başlangıç Y (ekranın biraz üstünden)
        }

        fill(color) {
            for (let r = 0; r < this.tetromino.length; r++) {
                for (let c = 0; c < this.tetromino[r].length; c++) {
                    if (this.tetromino[r][c]) { // Şeklin dolu olan kısmı
                        drawSquare(this.x + c, this.y + r, color);
                    }
                }
            }
        }

        draw() {
            this.fill(this.color);
        }

        unDraw() {
            this.fill(VACANT);
        }

        moveDown() {
            if (!this.collision(0, 1)) {
                this.unDraw();
                this.y++;
                this.draw();
            } else {
                this.lock();
                p = randomPiece(); // Yeni parça
            }
        }

        collision(x, y) {
            for (let r = 0; r < this.tetromino.length; r++) {
                for (let c = 0; c < this.tetromino[r].length; c++) {
                    if (!this.tetromino[r][c]) continue; // Şeklin boş kısmı

                    let newX = this.x + c + x;
                    let newY = this.y + r + y;

                    if (newX < 0 || newX >= COL || newY >= ROW) return true; // Sınır kontrolü
                    if (newY < 0) continue; // Ekranın üstündeyse çarpışma olmaz
                    if (board[newY][newX] !== VACANT) return true; // Başka parçayla çarpışma
                }
            }
            return false;
        }

        lock() {
            for (let r = 0; r < this.tetromino.length; r++) {
                for (let c = 0; c < this.tetromino[r].length; c++) {
                    if (!this.tetromino[r][c]) continue;
                    // Oyun bitti mi kontrolü
                    if (this.y + r < 0) {
                        gameOver = true;
                        startButton.disabled = false;
                        resetButton.disabled = false;
                        clearInterval(dropInterval);
                        alert("Oyun Bitti! Puanınız: " + score);
                        return;
                    }
                    board[this.y + r][this.x + c] = this.color;
                }
            }
            // Satır temizleme
            for (let r = 0; r < ROW; r++) {
                let isRowFull = true;
                for (let c = 0; c < COL; c++) {
                    if (board[r][c] === VACANT) {
                        isRowFull = false;
                        break;
                    }
                }
                if (isRowFull) {
                    for (let y = r; y > 1; y--) {
                        for (let c = 0; c < COL; c++) {
                            board[y][c] = board[y - 1][c];
                        }
                    }
                    for (let c = 0; c < COL; c++) {
                        board[0][c] = VACANT;
                    }
                    score += 10; // Puan ekle
                }
            }
            scoreDisplay.textContent = score;
            drawBoardSquares(); // Yeniden çiz
        }

        moveLeft() {
            if (!this.collision(-1, 0)) {
                this.unDraw();
                this.x--;
                this.draw();
            }
        }

        moveRight() {
            if (!this.collision(1, 0)) {
                this.unDraw();
                this.x++;
                this.draw();
            }
        }
    }

    // Rastgele parça oluştur
    function randomPiece() {
        let r = Math.floor(Math.random() * PIECES.length);
        return new Piece(PIECES[r], COLORS[0]);
    }

    let p = randomPiece(); // İlk parça

    function drop() {
        if (!gameOver) {
            p.moveDown();
        }
    }

    function startGame() {
        drawBoard();
        drawBoardSquares();
        score = 0;
        scoreDisplay.textContent = score;
        gameOver = false;
        startButton.disabled = true;
        resetButton.disabled = false;
        p = randomPiece();
        p.draw();
        dropInterval = setInterval(drop, 1000); // Her saniye düşer
    }

    function resetGame() {
        clearInterval(dropInterval);
        gameOver = true; // Oyunun durduğundan emin ol
        startButton.disabled = false;
        resetButton.disabled = true;
        score = 0;
        scoreDisplay.textContent = score;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas'ı temizle
        // Yeniden board oluştur ve çiz (içini boşaltır)
        drawBoard();
        drawBoardSquares();
    }

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);

    // Klavye kontrolleri
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft') {
            p.moveLeft();
        } else if (e.key === 'ArrowRight') {
            p.moveRight();
        } else if (e.key === 'ArrowDown') {
            p.moveDown();
        }
    });

    // İlk tahta çizimi (oyun başlamadan önce)
    drawBoard();
    drawBoardSquares();
    resetButton.disabled = true; // Başlangıçta reset tuşu pasif

});
