import { pushState, getCurrentState } from './history.js';

let isDrawing = false;
let isErasing = false;
let currentPath;
let hasDrawn = false;
function startDrawing(event) {
    isDrawing = true;
    isErasing = document.getElementById('eraser').checked;
    currentPath = isErasing ? null : addPath(event);

    // Play the appropriate sound
    const scribblingSound = document.getElementById('scribbling-sound');
    const erasingSound = document.getElementById('erasing-sound');
    if (isErasing) {
        erasingSound.currentTime = 0;
        erasingSound.play();
    } else {
        scribblingSound.currentTime = 0;
        scribblingSound.play();
    }
}

function stopDrawing() {
    if (hasDrawn) {
        pushState(getCurrentState());
        hasDrawn = false;
    }
    isDrawing = false;

    // Stop the sounds
    const scribblingSound = document.getElementById('scribbling-sound');
    const erasingSound = document.getElementById('erasing-sound');
    scribblingSound.pause();
    erasingSound.pause();
}


function draw(event) {
    if (!isDrawing) return;
    if (isErasing) {
        erasePath(event);
    } else {
        addToPath(event, currentPath);
    }
}




function addPath(event) {
    const svg = document.getElementById('svg-board');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Get the selected color and width
    const color = document.getElementById('stroke-color').value;
    const width = document.getElementById('stroke-width').value;

    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', width);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill', 'none');

    const {x, y} = getPointerCoordinates(event, svg);
    path.setAttribute('d', `M ${x} ${y}`);

    svg.appendChild(path);
    return path;
}

function getPointerCoordinates(event, svg) {
    const svgRect = svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    return {x, y};
}

export function initPointerEvents() {
    const svg = document.getElementById('svg-board');

    svg.addEventListener('pointerdown', startDrawing);
    svg.addEventListener('pointermove', draw);
    svg.addEventListener('pointerup', stopDrawing);
    svg.addEventListener('pointerleave', stopDrawing);
}

function addToPath(event, path) {
    const svg = document.getElementById('svg-board');
    const {x, y} = getPointerCoordinates(event, svg);
    const currentD = path.getAttribute('d');
    const newPathD = `${currentD} L ${x} ${y}`;
    path.setAttribute('d', newPathD);
    hasDrawn = true;
}

function erasePath(event) {
    const svg = document.getElementById('svg-board');
    const {x, y} = getPointerCoordinates(event, svg);
    const paths = svg.querySelectorAll('path');

    paths.forEach((path) => {
        if (isPointOnPath(path, x, y)) {
            svg.removeChild(path);
            hasDrawn = true;
        }
    });
}


function isPointOnPath(path, x, y) {
    const svg = document.getElementById('svg-board');
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return path.isPointInStroke(point);
}


