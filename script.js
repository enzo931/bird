const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const FLAP = -10;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;  // Espaçamento entre os canos
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;

let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;

let pipes = [];
let score = 0;
let gameInterval;
let pipeInterval;
let gameOver = false;

canvas.width = 800;
canvas.height = 600;

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !gameOver) {
    birdFlap = true;
  }
});

function startGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("finalScore").textContent = score;

  // Inicia o loop do jogo a 60 FPS
  gameInterval = setInterval(updateGame, 1000 / 60); 

  // Gera os canos a cada 3 segundos
  pipeInterval = setInterval(createPipe, 2000); 
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  birdVelocity += GRAVITY;
  birdY += birdVelocity;

  if (birdY + BIRD_HEIGHT > canvas.height || birdY < 0) {
    gameOver = true;
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").style.display = "block";
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
  }

  if (birdFlap) {
    birdVelocity = FLAP;
    birdFlap = false;
  }

  movePipes();
  detectCollisions();
  drawBird();
  drawPipes();
  drawScore();
}

function createPipe() {
  const height = Math.floor(Math.random() * (canvas.height - PIPE_SPACING - 50)); // Evitar que o cano ultrapasse o limite superior
  pipes.push({ x: canvas.width, height, passed: false });
}

function movePipes() {
  pipes.forEach((pipe) => {
    pipe.x -= 2; // Velocidade do movimento dos canos
  });

  pipes = pipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0); // Remover canos que saíram da tela
}

function detectCollisions() {
    pipes.forEach((pipe) => {
      // Verificar colisão com qualquer parte do cano verde
      if (
        (50 + BIRD_WIDTH > pipe.x && 50 < pipe.x + PIPE_WIDTH) && // Verificar se o pássaro está dentro da área X do cano
        (birdY < pipe.height || birdY + BIRD_HEIGHT > pipe.height + PIPE_SPACING) // Verificar colisão com o topo ou o fundo do cano
      ) {
        gameOver = true;
        document.getElementById("finalScore").textContent = score;
        document.getElementById("gameOver").style.display = "block";
        clearInterval(gameInterval);
        clearInterval(pipeInterval);
      }
  
      // Verificar se o pássaro passou por um cano
      if (pipe.x + PIPE_WIDTH < 50 && !pipe.passed) {
        pipe.passed = true;
        score += 10; // Pontos por passar um cano
      }
    });
  }
  

// Carregar a imagem do pássaro
const birdImage = new Image();
birdImage.src = "src/img.png"; // Substitua pelo caminho da imagem desejada

function drawBird() {
  // Primeiro, desenha o ponto amarelo (quadrado)
  ctx.fillStyle = "#ffcc00"; 
  ctx.fillRect(50, birdY, BIRD_WIDTH, BIRD_HEIGHT);

  // Depois, desenha a imagem sobre o ponto amarelo
  ctx.drawImage(birdImage, 50, birdY - 0, BIRD_WIDTH, BIRD_HEIGHT); // Ajuste o "-30" para a posição desejada da imagem
}


function drawPipes() {
  ctx.fillStyle = "#228B22"; // Cor verde dos canos
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height); // Topo do cano (parte verde)
    ctx.fillRect(pipe.x, pipe.height + PIPE_SPACING, PIPE_WIDTH, canvas.height); // Fundo do cano (parte verde)
  });
}

function drawScore() {
  ctx.fillStyle = "#fff"; // Cor branca para a pontuação
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

startGame();



