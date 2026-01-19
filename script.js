const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreDisplay');

const ROW = 20;
const COL = 10;
const SQ = 30;
const VACANT = "BLACK"; 

// Kare çizme fonksiyonu
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "#444";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// Oyun tahtasını oluşturma
let board = [];
for(r = 0; r < ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

function drawBoard(){
    for(r = 0; r < ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// Tetris Şekli (Sadece Kare Şekli)
const O = [
    [
        [1, 1],
        [1, 1]
    ]
];

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN = 0; 
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.x = 4;
        this.y = -2;
    }

    fill(color) {
        for(r = 0; r < this.activeTetromino.length; r++){
            for(c = 0; c < this.activeTetromino.length; c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    draw() { this.fill(this.color); }
    unDraw() { this.fill(VACANT); }

    moveDown() {
        if(!this.collision(0,1,this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            p = new Piece(O, "red");
        }
    }

    moveRight() {
        if(!this.collision(1,0,this.activeTetromino)){
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    moveLeft() {
        if(!this.collision(-1,0,this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    collision(x, y, piece) {
        for(r = 0; r < piece.length; r++){
            for(c = 0; c < piece.length; c++){
                if(!piece[r][c]){ continue; }
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if(newX < 0 || newX >= COL || newY >= ROW){ return true; }
                if(newY < 0){ continue; }
                if(board[newY][newX] != VACANT){ return true; }
            }
        }
        return false;
    }

    lock() {
        for(r = 0; r < this.activeTetromino.length; r++){
            for(c = 0; c < this.activeTetromino.length; c++){
                if(!this.activeTetromino[r][c]){ continue; }
                if(this.y + r < 0){
                    alert("Oyun Bitti!");
                    gameOver = true;
                    break;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // Satır kontrolü burada yapılabilir
        drawBoard();
    }
}

let p = new Piece(O, "red");
let gameOver = false;

function drop(){
    if(!gameOver){
        p.moveDown();
        setTimeout(drop, 1000);
    }
}

// Butonları bağlayalım
document.getElementById('startButton').addEventListener('click', () => {
    gameOver = false;
    drop();
});

document.getElementById('resetButton').addEventListener('click', () => {
    location.reload(); // En temiz sıfırlama yöntemi
});

// Klavye kontrolü
document.addEventListener("keydown", event => {
    if(event.keyCode == 37) p.moveLeft();
    else if(event.keyCode == 39) p.moveRight();
    else if(event.keyCode == 40) p.moveDown();
});