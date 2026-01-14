
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const spriteSheet = new Image();
let tileSize, rows, cols, player, cars = [], animationFrameId;
const images = {};

let collisionState = false;
let collisionTimer = null;
let currentLevel = 1;
let gameWon = false;
let spriteFrame = 0;
let lastFrameTime = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('solarSprintHighScore')) || 0;
let lastY = 0;
let flashState = true;
let flashCounter = 0;

const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50;

spriteSheet.onload = () => console.log("Sprite sheet loaded");
spriteSheet.onerror = (err) => console.error("Sprite sheet error", err);
