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

// airplane details
const airplane = {
	width: 20,
	height: 120,
	x: canvas.width / 2 - 20 / 2,
	y: canvas.height - 120 - 10,
	speedX: 10,
	speedY: 10,
};

// score
let time = 0;
let avoided = 0;
let destroyed = 0;

// time
let startTime = 0;
const oneSecond = 1000;

// intervals
let canvasUpdateInterval;
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
		airplane.x,
		airplane.y,
		airplane.width,
		airplane.height,
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
	const wingXPosStart = airplane.x;
	const wingYPosStart = airplane.y + airplane.height / 2;
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
		wingXPosStart + airplane.width,
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
		wingXPosStart + airplane.width / 2,
		airplane.y,
		null,
		null,
		airplane.width / 2,
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

function updateCanvas() {
	if (gameOver) {
		clearInterval(canvasUpdateInterval);
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

	time = Math.floor((Date.now() - startTime) / 1000);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlane();
	drawObjects();
	drawScore("Time", time, 40);
	drawScore("Avoided", avoided, 80);
	drawScore("Destroyed", destroyed, 120);
	drawTimer();
	drawBomb();
}

function drawScore(text, value, yPosition) {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	const scoreText = `${text}: ${value}`;
	const scoreWidth = ctx.measureText(scoreText).width;
	const xPosition = Math.min(20, canvas.width - scoreWidth - 20);
	ctx.fillText(scoreText, xPosition, yPosition);
}

function drawTimer() {
	ctx.font = "30px bold Permanent Marker";
	ctx.fillStyle = "white";
	ctx.globalAlpha = 0.3;

	// If startTime = 0, display "00:00:000"
	let timerText;
	if (startTime === 0) {
		timerText = "00:00:000";
	} else {
		// Calculate the total elapsed time.
		const elapsedTime = Date.now() - startTime;

		let milliseconds = elapsedTime % oneSecond;
		let seconds = Math.floor(elapsedTime / oneSecond) % SIXTY;
		let minutes = Math.floor(elapsedTime / oneSecond / SIXTY);

		// Format the timer
		timerText = `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
	}

	// Calculate the width of the text to position it correctly.
	const timerTextWidth = ctx.measureText(timerText).width;
	const xPosition = Math.max(canvas.width - timerTextWidth - TWENTY, TWENTY);

	// Draw the text on canvas.
	ctx.fillText(timerText, xPosition, FORTY);
	ctx.globalAlpha = 1.0;
}

drawTimer();

function startGameBtn() {
	document.getElementById("start-game-btn").disabled = true;
	document.addEventListener("keydown", keyDownHandler, false);
	startTime = Date.now();
	canvasUpdateInterval = setInterval(updateCanvas, ONE_HUNDRED / SIXTY);
	objectCreationInterval = setInterval(createObject, createObjInterval);
	bombCreationInterval = setInterval(createBomb, THREE_HUNDRED);
}

function keyDownHandler(e) {
	if (e.key == "ArrowRight" || e.key == "Right") {
		airplane.x = Math.min(
			airplane.x + airplane.speedX,
			canvas.width - airplane.width - FORTY
		);
	} else if (e.key == "ArrowLeft" || e.key == "Left") {
		airplane.x = Math.max(airplane.x - airplane.speedX, 0 + FORTY);
	} else if (e.key == "ArrowUp" || e.key == "Up") {
		airplane.y = Math.max(airplane.y - airplane.speedY, TEN);
	} else if (e.key == "ArrowDown" || e.key == "Down") {
		airplane.y = Math.min(
			airplane.y + airplane.speedY,
			canvas.height - airplane.height
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
		if (
			checkCollision(
				airplane.x,
				airplane.y,
				airplane.width,
				airplane.height,
				objects[i].x,
				objects[i].y,
				objects[i].width,
				objects[i].height
			)
		) {
			objects.splice(i, 1);
			--i;
			gameOver = true;
		}

		// Check if the object has reached the bottom of the canvas
		if (objects[i].y + objects[i].height >= canvas.height) {
			objects.splice(i, 1);
			--i;
			++avoided;
		}

		// checking the collision between bomb and object
		for (let j = 0; j < bombs.length; ++j) {
			if (
				checkCollision(
					bombs[j].x,
					bombs[j].y,
					0,
					0,
					objects[i].x,
					objects[i].y,
					objects[i].width,
					objects[i].height,
					true,
					bombs[j].radius
				)
			) {
				objects.splice(i, 1);
				bombs.splice(j, 1);
				--i;
				--j;
				++destroyed;
			}
		}
	}
}

function createBomb() {
	const bomb = {
		radius: 5,
		x: airplane.x + airplane.width / 2,
		y: airplane.y,
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

function checkCollision(
	x1,
	y1,
	w1,
	h1,
	x2,
	y2,
	w2,
	h2,
	isBomb = false,
	radius = 0
) {
	if (isBomb) {
		return (
			x1 + radius > x2 &&
			x1 - radius < x2 + w2 &&
			y1 + radius > y2 &&
			y1 - radius < y2 + h2
		);
	}
	return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
