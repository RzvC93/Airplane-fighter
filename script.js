const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const rectWidth = 20;
const rectHeight = 120;
let x = canvas.width / 2 - rectWidth / 2;
let y = canvas.height - rectHeight - 10;

function drawPlane() {
	ctx.beginPath();
	ctx.fillStyle = "#66828a";
	ctx.strokeStyle = "black";
	ctx.rect(x, y, rectWidth, rectHeight);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	const startX = x;
	const startY = y + rectHeight / 2;

	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.moveTo(startX, startY);
	ctx.lineTo(startX - 40, startY + 60);
	ctx.lineTo(startX, startY + 30);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.moveTo(startX + rectWidth, startY);
	ctx.lineTo(startX + 60, startY + 60);
	ctx.lineTo(startX + rectWidth, startY + 30);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.arc(x + rectWidth / 2, y, rectWidth / 2, Math.PI, 0);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
drawPlane();
