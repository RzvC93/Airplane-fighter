const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// variables
const TEN = 10;
const TWENTY = 20;
const THIRTY = 30;
const FORTY = 40;
const SIXTY = 60;
const EIGHTY = 80;
const ONE_HUNDRED = 100;
const ONE_HUNDRED_TWENTY = 120;
const ONE_HUNDRED_EIGHTY = 180;
const THREE_HUNDRED = 300;
const createObjInterval = 1500;

// airplane width, height and position
const airplaneBaseWidth = 20;
const airplaneBaseHeight = 120;
let airplaneXPos = canvas.width / 2 - airplaneBaseWidth / 2;
let airplaneYPos = canvas.height - airplaneBaseHeight - 10;

// score
let time = 0;
let avoided = 0;
let destroyed = 0;

// time
let elapsedTime = 0;
const oneSecond = 1000;

// airplane movement
let dX = 10;
let dY = 10;

// intervals
let canvasUpdateInterval;
let timeIncreaseInterval;
let objectCreationInterval;
let bombCreationInterval;

// game over
let gameOver = false;

// array of objects and bombs
let objects = [];
let bombs = [];

// style of the airplane
function style(fillStyle, strokeStyle, globalAlpha) {
	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;
	ctx.globalAlpha = globalAlpha;
}

// function for drawing objects
function drawObject(
	type,
	x,
	y,
	width,
	height,
	radius,
	startAngle,
	endAngle,
	startX1,
	startY1,
	endX2,
	endY2,
	fillStyle,
	strokeStyle,
	globalAlpha
) {
	style(fillStyle, strokeStyle, globalAlpha);
	ctx.beginPath();
	if (type === "body") {
		ctx.rect(x, y, width, height);
	} else if (type === "head") {
		ctx.arc(x, y, radius, startAngle, endAngle);
	} else if (type === "wing") {
		ctx.moveTo(x, y);
		ctx.lineTo(x + startX1, y + startY1);
		ctx.lineTo(x + endX2, y + endY2);
	}
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// drawing the airplane
function drawPlane() {
	// body
	drawObject(
		"body",
		airplaneXPos,
		airplaneYPos,
		airplaneBaseWidth,
		airplaneBaseHeight,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		"white",
		"red",
		1.0
	);

	// left wing
	const wingXPosStart = airplaneXPos;
	const wingYPosStart = airplaneYPos + airplaneBaseHeight / 2;
	drawObject(
		"wing",
		wingXPosStart,
		wingYPosStart,
		null,
		null,
		null,
		null,
		null,
		-40,
		60,
		0,
		30,
		"white",
		"red",
		1.0
	);

	// right wing
	drawObject(
		"wing",
		wingXPosStart + airplaneBaseWidth,
		wingYPosStart,
		null,
		null,
		null,
		null,
		null,
		40,
		60,
		0,
		30,
		"white",
		"red",
		1.0
	);

	// head
	drawObject(
		"head",
		wingXPosStart + airplaneBaseWidth / 2,
		airplaneYPos,
		null,
		null,
		airplaneBaseWidth / 2,
		Math.PI,
		0,
		null,
		null,
		null,
		null,
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
	const xPosition = Math.min(TWENTY, canvas.width - scoreWidth - TWENTY);
	ctx.fillText(`Time: ${time}`, xPosition, FORTY);
}

drawScoreByTime();

function drawScoreByAvoidedObjects() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	const avoidedWidth = ctx.measureText(`Avoided: ${avoided}`).width;
	const xPosition = Math.min(TWENTY, canvas.width - avoidedWidth - TWENTY);
	ctx.fillText(`Avoided: ${avoided}`, xPosition, EIGHTY);
}

drawScoreByAvoidedObjects();

function drawScoreByDestroyedObjects() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	const destroyedWidth = ctx.measureText(`Destroyed: ${destroyed}`).width;
	const xPosition = Math.min(TWENTY, canvas.width - destroyedWidth - TWENTY);
	ctx.fillText(`Destroyed: ${destroyed}`, xPosition, ONE_HUNDRED_TWENTY);
}

drawScoreByDestroyedObjects();

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
		clearInterval(bombCreationInterval);

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
		ctx.fillText(
			`Avoided Objects:  ${avoided}`,
			canvas.width / 2 - ONE_HUNDRED,
			canvas.height / 2 + ONE_HUNDRED_TWENTY
		);
		ctx.fillText(
			`Destroyed Objects:  ${destroyed}`,
			canvas.width / 2 - ONE_HUNDRED,
			canvas.height / 2 + ONE_HUNDRED_EIGHTY
		);

		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlane();
	drawObjects();
	drawScoreByTime();
	drawScoreByAvoidedObjects();
	drawScoreByDestroyedObjects();
	drawTimer();
	drawBomb();
}

function startGameBtn() {
	document.getElementById("start-game-btn").disabled = true;
	document.addEventListener("keydown", keyDownHandler, false);
	canvasUpdateInterval = setInterval(updateCanvas, ONE_HUNDRED / SIXTY);
	timeIncreaseInterval = setInterval(increaseTime, TEN);
	objectCreationInterval = setInterval(createObject, createObjInterval);
	bombCreationInterval = setInterval(createBomb, THREE_HUNDRED);
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

		// checking the collision between the airplane and the object
		if (collisionPlaneObj(objects[i])) {
			objects.splice(i, 1);
			--i;
			gameOver = true;
			return;
		}

		// Check if the object has reached the bottom of the canvas
		if (objects[i].y + objects[i].height >= canvas.height) {
			objects.splice(i, 1);
			--i;
			++avoided;
		}

		// checking the collision between bomb and object
		for (let j = 0; j < bombs.length; ++j) {
			if (collisionBombObj(bombs[j], objects[i])) {
				objects.splice(i, 1);
				bombs.splice(j, 1);
				--i;
				--j;
				++destroyed;
				return;
			}
		}
	}
}

function createBomb() {
	const bomb = {
		radius: 5,
		x: airplaneXPos + airplaneBaseWidth / 2,
		y: airplaneYPos,
		speed: 5,
	};
	bombs.push(bomb);
}

function drawBomb() {
	for (let i = 0; i < bombs.length; ++i) {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(bombs[i].x, bombs[i].y, bombs[i].radius, 0, Math.PI * 2);
		bombs[i].y -= bombs[i].speed;
		ctx.fill();
		ctx.closePath();
	}
}

function collisionPlaneObj(object) {
	if (
		airplaneXPos < object.x + object.width &&
		airplaneXPos + airplaneBaseWidth > object.x &&
		airplaneYPos < object.y + object.height &&
		airplaneYPos + airplaneBaseHeight > object.y
	) {
		return true;
	}
	return false;
}

function collisionBombObj(bomb, object) {
	// Check if the bomb touches the right side of the rectangle
	if (
		bomb.x + bomb.radius > object.x &&
		bomb.x - bomb.radius < object.x + object.width
	) {
		// Check if the bomb touches the bottom of the rectangle
		if (
			bomb.y + bomb.radius > object.y &&
			bomb.y - bomb.radius < object.y + object.height
		) {
			return true;
		}
	}
	return false;
}
