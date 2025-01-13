const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const airplaneBaseWidth = 20;
const airplaneBaseHeight = 120;
let airplaneXPos = canvas.width / 2 - airplaneBaseWidth / 2;
let airplaneYPos = canvas.height - airplaneBaseHeight - 10;
let time = 0;
// let avoided = 0;
// let destroyed = 0;
let elapsedTime = 0;
const oneSecond = 1000;
let dX = 2;
let dY = 2;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let objects = [];

function drawPlane() {
	// body
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 1.0;
	ctx.rect(airplaneXPos, airplaneYPos, airplaneBaseWidth, airplaneBaseHeight);
	ctx.fill();
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.closePath();

	//left wing
	const wingXPosStart = airplaneXPos;
	const wingYPosStart = airplaneYPos + airplaneBaseHeight / 2;

	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 1.0;
	ctx.moveTo(wingXPosStart, wingYPosStart);
	ctx.lineTo(wingXPosStart - 40, wingYPosStart + 60);
	ctx.lineTo(wingXPosStart, wingYPosStart + 30);
	ctx.fill();
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.closePath();

	//right wing
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 1.0;
	ctx.moveTo(wingXPosStart + airplaneBaseWidth, wingYPosStart);
	ctx.lineTo(wingXPosStart + 60, wingYPosStart + 60);
	ctx.lineTo(wingXPosStart + airplaneBaseWidth, wingYPosStart + 30);
	ctx.fill();
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.closePath();

	// head
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 1.0;
	ctx.arc(
		wingXPosStart + airplaneBaseWidth / 2,
		airplaneYPos,
		airplaneBaseWidth / 2,
		Math.PI,
		0
	);
	ctx.fill();
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.closePath();
}
drawPlane();

function drawScoreByTime() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	//ctx.globalAlpha = 0.3;
	const scoreWidth = ctx.measureText(`Time: ${time}`).width;
	const xPosition = Math.min(20, canvas.width - scoreWidth - 20);
	ctx.fillText(`Time: ${time}`, xPosition, 40);
	//ctx.globalAlpha = 1.0;
}
drawScoreByTime();

// function drawScoreByAvoidedObjects() {
// 	ctx.font = "30px bold Permanent Marker";
// 	ctx.fillStyle = "white";
// 	ctx.globalAlpha = 0.3;
// 	const avoidedWidth = ctx.measureText(`Avoided: ${avoided}`).width;
// 	const xPosition = Math.min(20, canvas.width - avoidedWidth - 20);
// 	ctx.fillText(`Avoided: ${avoided}`, xPosition, 80);
// 	ctx.globalAlpha = 1.0;
// }
// drawScoreByAvoidedObjects();

// function drawScoreByDestroyedObjects() {
// 	ctx.font = "30px bold Permanent Marker";
// 	ctx.fillStyle = "white";
// 	ctx.globalAlpha = 0.3;
// 	const destroyedWidth = ctx.measureText(`Destroyed: ${destroyed}`).width;
// 	const xPosition = Math.min(20, canvas.width - destroyedWidth - 20);
// 	ctx.fillText(`Destroyed: ${destroyed}`, xPosition, 120);
// 	ctx.globalAlpha = 1.0;
// }
// drawScoreByDestroyedObjects();

function drawTimer() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	ctx.globalAlpha = 0.3;

	// Calculate the minutes, seconds and milliseconds of the total elapsed time.
	let milliseconds = elapsedTime % oneSecond;
	let seconds = Math.floor(elapsedTime / oneSecond) % 60;
	let minutes = Math.floor(elapsedTime / oneSecond / 60);

	// Format the timer
	const timerText = `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;

	// Calculate the width of the text to position it correctly.
	const timerTextWidth = ctx.measureText(timerText).width;
	const xPosition = Math.max(canvas.width - timerTextWidth - 20, 20);

	// Draw the text on canvas.
	ctx.fillText(timerText, xPosition, 40);
	ctx.globalAlpha = 1.0;
}
drawTimer();

function increaseTime() {
	elapsedTime += 10;
	if (elapsedTime % oneSecond === 0) {
		time += 1;
	}
}

function updateCanvas() {
	if (gameOver) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "30px bold Permanent Marker";
		ctx.fillStyle = "white";
		ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlane();
	drawObject();
	drawScoreByTime();
	// drawScoreByAvoidedObjects();
	// drawScoreByDestroyedObjects();
	drawTimer();

	for (let i = 0; i < objects.length; i++) {
		collisionDetection(objects[i]);
		if (gameOver) break;
	}

	if (rightPressed) {
		airplaneXPos = Math.min(
			airplaneXPos + dX,
			canvas.width - airplaneBaseWidth - 40
		);
	} else if (leftPressed) {
		airplaneXPos = Math.max(airplaneXPos - dX, 0 + 40);
	}

	if (upPressed) {
		airplaneYPos = Math.max(airplaneYPos - dY, 10);
	} else if (downPressed) {
		airplaneYPos = Math.min(
			airplaneYPos + dY,
			canvas.height - airplaneBaseHeight
		);
	}
}

function startGameBtn() {
	document.getElementById("start-game-btn").disabled = true;
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	setInterval(updateCanvas, 100 / 60);
	setInterval(increaseTime, 10);
	setInterval(createObject, 1500);
}

function keyDownHandler(e) {
	if (e.key === "right" || e.key === "ArrowRight") {
		rightPressed = true;
	} else if (e.key === "left" || e.key === "ArrowLeft") {
		leftPressed = true;
	} else if (e.key === "up" || e.key === "ArrowUp") {
		upPressed = true;
	} else if (e.key === "down" || e.key === "ArrowDown") {
		downPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key === "right" || e.key === "ArrowRight") {
		rightPressed = false;
	} else if (e.key === "left" || e.key === "ArrowLeft") {
		leftPressed = false;
	} else if (e.key === "up" || e.key === "ArrowUp") {
		upPressed = false;
	} else if (e.key === "down" || e.key === "ArrowDown") {
		downPressed = false;
	}
}

function createObject() {
	const object = {
		width: Math.random() * 20 + 20,
		height: Math.random() * 40 + 20,
		x: Math.random() * (canvas.width - 60),
		y: -60,
		speed: Math.random() * 2 + 0.5,
	};
	objects.push(object);
}
createObject();

function drawObject() {
	for (let i = 0; i < objects.length; ++i) {
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.rect(
			objects[i].x,
			objects[i].y,
			objects[i].width,
			objects[i].height
		);
		ctx.fill();
		ctx.closePath();
		objects[i].y += objects[i].speed;
	}
}
drawObject();

let gameOver = false;
function collisionDetection(object) {
	if (
		airplaneXPos < object.x + object.width &&
		airplaneXPos + airplaneBaseWidth > object.x &&
		airplaneYPos < object.y + object.height &&
		airplaneYPos + airplaneBaseHeight > object.y
	) {
		gameOver = true;
	}
}
