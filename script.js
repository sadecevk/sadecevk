const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreDisplay');

const ROW = 20;
const COL = 10;
const SQ = 30;
const VACANT = "BLACK"; 

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "#444";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

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

// TÜM TETRİS ŞEKİLLERİ VE DÖNÜŞLERİ
const I = [[ [0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0] ],[ [0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0] ],[ [0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0] ],[ [0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0] ]];
const J = [[ [1,0,0],[1,1,1],[0,0,0] ],[ [0,1,1],[0,1,0],[0,1,0] ],[ [0,0,0],[1,1,1],[0,0,1] ],[ [0,1,0],[0,1,0],[1,1,0] ]];
const L = [[ [0,0,1],[1,1,1],[0,0,0] ],[ [0,1,0],[0,1,0],[0,1,1] ],[ [0,0,0],[1,1,1],[1,0,0] ],[ [1,1,0],[0,1,0],[0,1,0] ]];
const O = [[ [1,1],[1,1] ]];
const S = [[ [0,1,1],[1,1,0],[0,0,0] ],[ [0,1,0],[0,1,1],[0,0,1] ],[ [0,0,0],[0,1,1],[1,1,0] ],[ [1,0,0],[1,1,0],[0,1,0] ]];
const T = [[ [0,1,0],[1,1,1],[0,0,0] ],[ [0,1,0],[0,1,1],[0,1,0] ],[ [0,0,0],[1,1,1],[0,1,0] ],[ [0,1,0],[1,1,0],[0,1,0] ]];
const Z = [[ [1,1,0],[0,1,1],[0,0,0] ],[ [0,0,1],[0,1,1],[0,1,0] ],[ [0,0,0],[1,1,0],[0,1,1] ],[ [0,1,0],[1,1,0],[1,0,0] ]];

const PIECES = [ [I,"cyan"],[J,"blue"],[L,"orange"],[O,"yellow"],[S,"green"],[T,"purple"],[Z,"red"] ];

function randomPiece(){
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN = 0; 
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.x = 3;
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
            p = randomPiece();
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

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        if(!this.collision(0,0,nextPattern)){
            this.unDraw();
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
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
                if(newY < 0){ continue;