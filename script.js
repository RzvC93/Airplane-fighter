const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const airplaneBaseWidth = 20;
const airplaneBaseHeight = 120;
const TEN = 10;
const TWENTY = 20;
const THIRTY = 30;
const FORTY = 40;
const SIXTY = 60;
const ONE_HUNDRED = 100;
const createObjInterval = 1500;

let airplaneXPos = canvas.width / 2 - airplaneBaseWidth / 2;
let airplaneYPos = canvas.height - airplaneBaseHeight - 10;
let time = 0;
let elapsedTime = 0;
const oneSecond = 1000;
let dX = 10;
let dY = 10;

let canvasUpdateInterval;
let timeIncreaseInterval;
let objectCreationInterval;
let gameOver = false;
let objects = [];

// style of the airplane
function style(fillStyle, strokeStyle, globalAlpha) {
	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;
	ctx.globalAlpha = globalAlpha;
}

// function for drawing a airplane body
function drawRectangle(
	x,
	y,
	width,
	height,
	fillStyle,
	strokeStyle,
	globalAlpha
) {
	style(fillStyle, strokeStyle, globalAlpha);
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// function for drawing a airplane wing
function drawWing(
	startX,
	startY,
	offsetX1,
	offsetY1,
	offsetX2,
	offsetY2,
	fillStyle,
	strokeStyle,
	globalAlpha
) {
	style(fillStyle, strokeStyle, globalAlpha);
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(startX + offsetX1, startY + offsetY1);
	ctx.lineTo(startX + offsetX2, startY + offsetY2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// function for drawing a airplane head
function drawCircle(
	centerX,
	centerY,
	radius,
	startAngle,
	endAngle,
	fillStyle,
	strokeStyle,
	globalAlpha
) {
	style(fillStyle, strokeStyle, globalAlpha);
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// drawing the airplane
function drawPlane() {
	// head
	drawRectangle(
		airplaneXPos,
		airplaneYPos,
		airplaneBaseWidth,
		airplaneBaseHeight,
		"white",
		"red",
		1.0
	);

	// left wing
	const wingXPosStart = airplaneXPos;
	const wingYPosStart = airplaneYPos + airplaneBaseHeight / 2;
	drawWing(
		wingXPosStart,
		wingYPosStart,
		-FORTY,
		SIXTY,
		0,
		THIRTY,
		"white",
		"red",
		1.0
	);

	// right wing
	drawWing(
		wingXPosStart + airplaneBaseWidth,
		wingYPosStart,
		FORTY,
		SIXTY,
		0,
		THIRTY,
		"white",
		"red",
		1.0
	);

	// head
	drawCircle(
		wingXPosStart + airplaneBaseWidth / 2,
		airplaneYPos,
		airplaneBaseWidth / 2,
		Math.PI,
		0,
		"white",
		"red",
		1.0
	);
}

drawPlane();

function drawScoreByTime() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	const scoreWidth = ctx.measureText(`Time: ${time}`).width;
	const xPosition = Math.min(TWENTY, canvas.width - scoreWidth - FORTY);
	ctx.fillText(`Time: ${time}`, xPosition, FORTY);
}

drawScoreByTime();

function drawTimer() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	ctx.globalAlpha = 0.3;

	// Calculate the minutes, seconds and milliseconds of the total elapsed time.
	let milliseconds = elapsedTime % oneSecond;
	let seconds = Math.floor(elapsedTime / oneSecond) % SIXTY;
	let minutes = Math.floor(elapsedTime / oneSecond / SIXTY);

	// Format the timer
	const timerText = `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;

	// Calculate the width of the text to position it correctly.
	const timerTextWidth = ctx.measureText(timerText).width;
	const xPosition = Math.max(canvas.width - timerTextWidth - TWENTY, TWENTY);

	// Draw the text on canvas.
	ctx.fillText(timerText, xPosition, FORTY);
	ctx.globalAlpha = 1.0;
}

drawTimer();

function increaseTime() {
	elapsedTime += TEN;
	if (elapsedTime % oneSecond === 0) {
		time += 1;
	}
}

function updateCanvas() {
	if (gameOver) {
		clearInterval(canvasUpdateInterval);
		clearInterval(timeIncreaseInterval);
		clearInterval(objectCreationInterval);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "30px bold Permanent Marker";
		ctx.fillStyle = "white";
		ctx.fillText(
			"GAME OVER",
			canvas.width / 2 - ONE_HUNDRED,
			canvas.height / 2
		);
		ctx.fillText(
			`Score: ${time} points`,
			canvas.width / 2 - ONE_HUNDRED,
			canvas.height / 2 + SIXTY
		);

		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlane();
	drawObjects();
	drawScoreByTime();
	drawTimer();

	for (let i = 0; i < objects.length; ++i) {
		collisionDetection(objects[i]);
		if (gameOver) break;
	}
}

function startGameBtn() {
	document.getElementById("start-game-btn").disabled = true;
	document.addEventListener("keydown", keyDownHandler, false);
	canvasUpdateInterval = setInterval(updateCanvas, ONE_HUNDRED / SIXTY);
	timeIncreaseInterval = setInterval(increaseTime, TEN);
	objectCreationInterval = setInterval(createObject, createObjInterval);
}

function keyDownHandler(e) {
	if (e.key == "ArrowRight" || e.key == "Right") {
		airplaneXPos = Math.min(
			airplaneXPos + dX,
			canvas.width - airplaneBaseWidth - FORTY
		);
	} else if (e.key == "ArrowLeft" || e.key == "Left") {
		airplaneXPos = Math.max(airplaneXPos - dX, 0 + FORTY);
	} else if (e.key == "ArrowUp" || e.key == "Up") {
		airplaneYPos = Math.max(airplaneYPos - dY, TEN);
	} else if (e.key == "ArrowDown" || e.key == "Down") {
		airplaneYPos = Math.min(
			airplaneYPos + dY,
			canvas.height - airplaneBaseHeight
		);
	}
}

function createObject() {
	const object = {
		width: Math.random() * TWENTY + TWENTY,
		height: Math.random() * FORTY + TWENTY,
		x: Math.random() * (canvas.width - SIXTY),
		y: -SIXTY,
		speed: Math.random() * 2 + 0.5,
	};
	objects.push(object);
}

createObject();

function drawObjects() {
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

drawObjects();

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
