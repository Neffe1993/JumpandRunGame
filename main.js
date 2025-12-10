const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const hpEl = document.getElementById('hp');
const restartBtn = document.getElementById('restart');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const WORLD_WIDTH = 3200;
const GRAVITY = 0.6;
const MOVE_SPEED = 6;
const JUMP_FORCE = 16;
const MAX_FALL = 16;
const COYOTE_FRAMES = 10;

const GRAVITY = 0.65;
const MOVE_SPEED = 4.2;
const JUMP_FORCE = 12.5;
const MAX_FALL = 16;

const input = {
  left: false,
  right: false,
  jump: false,
};

const platforms = [
  { x: 0, y: HEIGHT - 40, w: WORLD_WIDTH, h: 40 },
  { x: 120, y: HEIGHT - 140, w: 180, h: 22 },
  { x: 410, y: HEIGHT - 220, w: 160, h: 20 },
  { x: 700, y: HEIGHT - 160, w: 150, h: 18 },
  { x: 1020, y: HEIGHT - 240, w: 200, h: 20 },
  { x: 1350, y: HEIGHT - 110, w: 220, h: 20 },
  { x: 1700, y: HEIGHT - 190, w: 180, h: 20 },
  { x: 2050, y: HEIGHT - 260, w: 210, h: 20 },
  { x: 2380, y: HEIGHT - 160, w: 220, h: 20 },
  { x: 2720, y: HEIGHT - 120, w: 160, h: 20 },
];

const coins = [
  { x: 160, y: HEIGHT - 200, r: 10, collected: false },
  { x: 450, y: HEIGHT - 270, r: 10, collected: false },
  { x: 760, y: HEIGHT - 210, r: 10, collected: false },
  { x: 1090, y: HEIGHT - 300, r: 10, collected: false },
  { x: 1400, y: HEIGHT - 160, r: 10, collected: false },
  { x: 1750, y: HEIGHT - 240, r: 10, collected: false },
  { x: 2110, y: HEIGHT - 310, r: 10, collected: false },
  { x: 2460, y: HEIGHT - 210, r: 10, collected: false },
  { x: 2760, y: HEIGHT - 170, r: 10, collected: false },
  { x: 3050, y: HEIGHT - 80, r: 10, collected: false },
];

const hazards = [
  { x: 620, y: HEIGHT - 72, w: 90, h: 72 },
  { x: 1600, y: HEIGHT - 72, w: 70, h: 72 },
  { x: 2320, y: HEIGHT - 72, w: 120, h: 72 },
];

function hazardHitbox(h) {
  return {
    x: h.x + 6,
    y: h.y - 12,
    w: h.w - 12,
    h: h.h + 18,
  };
}


  { x: 620, y: HEIGHT - 40, w: 90, h: 32 },
  { x: 1600, y: HEIGHT - 40, w: 70, h: 32 },
  { x: 2320, y: HEIGHT - 40, w: 120, h: 32 },
];

class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 50;
    this.y = HEIGHT - 120;
    this.w = 32;
    this.h = 48;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.hp = 3;
    this.score = 0;
    this.hurtCooldown = 0;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
  }

  update(delta) {
    this.vx = 0;
    if (input.left) this.vx -= MOVE_SPEED;
    if (input.right) this.vx += MOVE_SPEED;

    if (this.jumpBuffer > 0 && (this.grounded || this.coyoteTimer > 0)) {
      this.vy = -JUMP_FORCE;
      this.grounded = false;
      this.coyoteTimer = 0;
      this.jumpBuffer = 0;
    if (input.jump && this.grounded) {
      this.vy = -JUMP_FORCE;
      this.grounded = false;
    }

    this.vy = Math.min(this.vy + GRAVITY, MAX_FALL);

    this.x += this.vx * delta;
    this.handleHorizontalCollisions();
    this.y += this.vy * delta;
    this.handleVerticalCollisions();

    this.coyoteTimer = this.grounded
      ? COYOTE_FRAMES
      : Math.max(0, this.coyoteTimer - delta);

    this.jumpBuffer = Math.max(0, this.jumpBuffer - delta);

    this.x = Math.max(0, Math.min(WORLD_WIDTH - this.w, this.x));

    if (this.hurtCooldown > 0) {
      this.hurtCooldown -= delta * 16;
    }
  }

  queueJump() {
    this.jumpBuffer = COYOTE_FRAMES;
  }

  handleHorizontalCollisions() {
    for (const p of platforms) {
      if (this.intersects(p)) {
        if (this.vx > 0) {
          this.x = p.x - this.w;
        } else if (this.vx < 0) {
          this.x = p.x + p.w;
        }
        this.vx = 0;
      }
    }
  }

  handleVerticalCollisions() {
    this.grounded = false;
    for (const p of platforms) {
      if (this.intersects(p)) {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.grounded = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
        }
        this.vy = 0;
      }
    }
  }

  intersects(obj) {
    return (
      this.x < obj.x + obj.w &&
      this.x + this.w > obj.x &&
      this.y < obj.y + obj.h &&
      this.y + this.h > obj.y
    );
  }

  takeDamage() {
    if (this.hurtCooldown > 0) return;
    this.hp = Math.max(0, this.hp - 1);
    this.hurtCooldown = 60;
    if (this.hp === 0) {
      this.respawn();
    }
  }

  respawn() {
    this.x = 50;
    this.y = HEIGHT - 120;
    this.vx = 0;
    this.vy = 0;
    this.hp = 3;
    this.score = 0;
    for (const coin of coins) {
      coin.collected = false;
    }
  }
}

const player = new Player();
let lastTime = 0;
let cameraX = 0;

function updateCamera() {
  const target = player.x + player.w / 2 - WIDTH / 2;
  cameraX += (target - cameraX) * 0.08;
  cameraX = Math.max(0, Math.min(WORLD_WIDTH - WIDTH, cameraX));
}

function renderBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#1d2335');
  gradient.addColorStop(1, '#0b1220');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-cameraX * 0.3, 0);
  ctx.fillStyle = '#111827';
  for (let x = 0; x < WORLD_WIDTH; x += 220) {
    ctx.beginPath();
    ctx.moveTo(x, HEIGHT);
    ctx.lineTo(x + 80, HEIGHT - 120);
    ctx.lineTo(x + 160, HEIGHT);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function renderPlatforms() {
  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  for (const p of platforms) {
    ctx.fillRect(p.x - cameraX, p.y, p.w, p.h);
  }
}

function renderHazards() {
  ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
  for (const h of hazards) {
    ctx.beginPath();
    const spikes = 6;
    const spikeWidth = h.w / spikes;
    for (let i = 0; i < spikes; i++) {
      const startX = h.x + i * spikeWidth - cameraX;
      ctx.moveTo(startX, h.y + h.h);
      ctx.lineTo(startX + spikeWidth / 2, h.y);
      ctx.lineTo(startX + spikeWidth, h.y + h.h);
    }
    ctx.fill();
  }
}

function renderCoins() {
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 2;
  for (const c of coins) {
    if (c.collected) continue;
    ctx.beginPath();
    ctx.arc(c.x - cameraX, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function renderPlayer() {
  ctx.save();
  ctx.translate(player.x - cameraX, player.y);
  ctx.fillStyle = player.hurtCooldown > 0 ? 'rgba(239, 68, 68, 0.8)' : '#22c55e';
  ctx.fillRect(0, 0, player.w, player.h);

  ctx.fillStyle = '#1f2937';
  ctx.fillRect(6, 10, 8, 6);
  ctx.fillRect(player.w - 14, 10, 8, 6);
  ctx.restore();
}

function renderGoal() {
  const goalX = WORLD_WIDTH - 80 - cameraX;
  const goalY = HEIGHT - 120;
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(goalX, goalY, 40, 120);
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(goalX - 10, goalY + 20, 10, 80);
}

function drawHudText() {
  ctx.save();
  ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillText('← → laufen | W/Leertaste springen | Ziel: alle Münzen & Portal', 20, 30);
  ctx.restore();
}

function checkCoinCollection() {
  for (const c of coins) {
    if (c.collected) continue;
    const dx = player.x + player.w / 2 - c.x;
    const dy = player.y + player.h / 2 - c.y;
    if (Math.hypot(dx, dy) < player.w / 2 + c.r) {
      c.collected = true;
      player.score += 10;
    }
  }
}

function checkHazards() {
  for (const h of hazards) {
    const hitbox = hazardHitbox(h);
    if (player.intersects(hitbox)) {
    if (player.intersects(h)) {
      player.takeDamage();
      if (player.hp === 0) return;
      player.vy = -10;
    }
  }
}

function checkGoal() {
  const goal = { x: WORLD_WIDTH - 80, y: HEIGHT - 120, w: 40, h: 120 };
  if (player.intersects(goal) && coins.every((c) => c.collected)) {
    showWinMessage();
  }
}

let winTimer = 0;

function showWinMessage() {
  winTimer = 150;
}

function renderWin() {
  if (winTimer <= 0) return;
  winTimer -= 1;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(WIDTH / 2 - 160, HEIGHT / 2 - 60, 320, 120);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.strokeRect(WIDTH / 2 - 160, HEIGHT / 2 - 60, 320, 120);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '22px "Segoe UI", sans-serif';
  ctx.fillText('Glückwunsch! Level geschafft.', WIDTH / 2 - 140, HEIGHT / 2 - 20);
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillText('Drücke "Neustart" für eine neue Runde.', WIDTH / 2 - 140, HEIGHT / 2 + 14);
  ctx.restore();
}

function updateHud() {
  scoreEl.textContent = player.score;
  hpEl.textContent = player.hp;
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 16, 2);
  lastTime = timestamp;

  player.update(delta);
  updateCamera();
  checkCoinCollection();
  checkHazards();
  checkGoal();

  renderBackground();
  renderPlatforms();
  renderHazards();
  renderCoins();
  renderGoal();
  renderPlayer();
  drawHudText();
  renderWin();

  updateHud();
  requestAnimationFrame(gameLoop);
}

function handleKey(e, isDown) {
  if (['ArrowLeft', 'a', 'A'].includes(e.key)) input.left = isDown;
  if (['ArrowRight', 'd', 'D'].includes(e.key)) input.right = isDown;
  if (['ArrowUp', 'w', 'W', ' '].includes(e.key)) {
    input.jump = isDown;
    if (isDown) player.queueJump();
  }
  if (['ArrowUp', 'w', 'W', ' '].includes(e.key)) input.jump = isDown;
}

window.addEventListener('keydown', (e) => {
  handleKey(e, true);
});
window.addEventListener('keyup', (e) => {
  handleKey(e, false);
});

restartBtn.addEventListener('click', () => {
  player.reset();
  cameraX = 0;
  winTimer = 0;
  updateHud();
});

requestAnimationFrame(gameLoop);
