const fill1 = "gray";
const fill2 = "#15848e";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const states = { PRISON: 0, CLONES: 1, PLAY: 2, END: 3 };
let state = states.PRISON;

const size = Math.min(window.innerWidth, window.innerHeight);
const numItems = 10;
const itemSize = size / numItems;
canvas.width = size;
canvas.height = size;

let switchFill = false;
for (let i = 0; i < numItems; i++) {
    for (let j = 0; j < numItems; j++) {
        switchFill = (i + j) % 2;
        ctx.fillStyle = switchFill ? fill1 : fill2;
        ctx.fillRect(i * itemSize, j * itemSize, itemSize, itemSize);
    }
}

const prison = document.getElementById("prison");
const clones = document.getElementById("clones");
const play = document.getElementById("play");

const prisonList = [];
let cloneList = [];

function prisonEvent(e) {
    const square = ([x, y] = closestSquare(e));
    let draw = false;

    if (prisonList.length === 0 && x === 1 && y === 1) {
        draw = true;
    } else {
        for (let [px, py] of prisonList) {
            if ((x === px && y == py + 1) || (y === py && x == px + 1)) {
                draw = true;
            }
        }
    }

    if (draw) {
        prisonList.push(square);
        cornerX = x * itemSize - itemSize;
        cornerY = y * itemSize - itemSize;
        ctx.strokeStyle = "#d34d3d";
        ctx.strokeRect(cornerX, cornerY, itemSize, itemSize);
    }
}

function cloneEvent(e) {
    const clone = ([x, y] = closestSquare(e));
    for (let [px, py] of prisonList) {
        if (x === px && y === py) {
            drawCircle(e);
            cloneList.push(clone);
        }
    }
}

function playEvent(e) {
    let square = ([x, y] = closestSquare(e));
    const stringCloneList = cloneList.map(JSON.stringify);
    if (
        stringCloneList.includes(JSON.stringify(square)) &&
        !stringCloneList.includes(JSON.stringify([x, y + 1])) &&
        !stringCloneList.includes(JSON.stringify([x + 1, y]))
    ) {
        cornerX = x * itemSize - itemSize;
        cornerY = y * itemSize - itemSize;
        ctx.fillStyle = (x + y) % 2 == 0 ? fill2 : fill1;
        ctx.fillRect(cornerX, cornerY, itemSize, itemSize);
        drawCircle(e, 0, 1);
        drawCircle(e, 1, 0);
        cloneList = cloneList.filter(
            v => JSON.stringify(v) != JSON.stringify([x, y])
        );
        cloneList.push([x, y + 1]);
        cloneList.push([x + 1, y]);
    }
}

function endEvent(e) {
    console.log("YOU WIN!");
    alert("YOU WIN!");
}

function drawCircle(e, offsetX = 0, offsetY = 0) {
    const [x, y] = center(e, offsetX, offsetY);
    ctx.fillStyle = "#cc7722";
    ctx.beginPath();
    ctx.arc(x, y, itemSize * 0.4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

canvas.addEventListener("click", function(e) {
    switch (state) {
        case states.PRISON:
            prisonEvent(e);
            break;
        case states.CLONES:
            cloneEvent(e);
            break;
        case states.PLAY:
            playEvent(e);
            break;
        case states.END:
            endEvent(e);
            break;
    }
});

canvas.addEventListener("click", function(e) {
    state = cloneList.length && !cloneList.map(JSON.stringify).filter(x => prisonList.map(JSON.stringify).includes(x)).length ? states.END : state;
});

prison.addEventListener("click", function(e) {
    state = states.PRISON;
});
clones.addEventListener("click", function(e) {
    state = states.CLONES;
});
play.addEventListener("click", function(e) {
    state = states.PLAY;
});

function closestSquare(e) {
    const { offsetX, offsetY } = e;
    const itemX = Math.ceil(offsetX / itemSize);
    const itemY = Math.ceil(offsetY / itemSize);
    return [itemX, itemY];
}

function center(e, offsetX = 0, offsetY = 0) {
    let [itemX, itemY] = closestSquare(e);
    itemX += offsetX;
    itemY += offsetY;
    const x = itemX * itemSize - itemSize / 2;
    const y = itemY * itemSize - itemSize / 2;
    return [x, y];
}
