/**
 * Module for handling pointer events for drawing and erasing.
 * @module pointerEvents
 * @requires module:history
 */

import { pushState, getCurrentState } from './history.js';

let isDrawing = false;
let isErasing = false;
let currentPath;
let hasDrawn = false;

/**
 * Initializes pointer event listeners for drawing and erasing on the SVG canvas.
 */
export function initPointerEvents() {
    const svg = document.getElementById('svg-board');

    svg.addEventListener('pointerdown', startDrawing);
    svg.addEventListener('pointermove', draw);
    svg.addEventListener('pointerup', stopDrawing);
    svg.addEventListener('pointerleave', stopDrawing);
}

/**
 * Starts the drawing process when a pointerdown event is triggered.
 * @param {Event} event - The pointerdown event.
 */
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

/**
 * Stops the drawing process when a pointerup or pointerleave event is triggered.
 */
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

/**
 * Draws on the SVG canvas when a pointermove event is triggered.
 * @param {Event} event - The pointermove event.
 */
function draw(event) {
    if (!isDrawing) return;
    if (isErasing) {
        erasePath(event);
    } else {
        addToPath(event, currentPath);
    }
}

/**
 * Adds a new path element to the SVG canvas.
 * @param {Event} event - The event that triggered the path creation.
 * @returns {SVGPathElement} - The created path element.
 */
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

/**
 * Gets the pointer coordinates relative to the SVG canvas.
 * @param {Event} event - The event that contains the pointer coordinates.
 * @param {SVGSVGElement} svg - The SVG canvas element.
 * @returns {{x: number, y: number}} - The pointer coordinates relative to the SVG canvas.
 */
function getPointerCoordinates(event, svg) {
    const svgRect = svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    return {x, y};
}

/**
 * Adds a point to the current path.
 * @param {Event} event - The event that triggered the addition of a point to the path.
 * @param {SVGPathElement} path - The path element to add a point to.
 */
function addToPath(event, path) {
    const svg = document.getElementById('svg-board');
    const {x, y} = getPointerCoordinates(event, svg);
    const currentD = path.getAttribute('d');
    const newPathD = `${currentD} L ${x} ${y}`;
    path.setAttribute('d', newPathD);
    hasDrawn = true;
}

/**
 * Erases a path at the current pointer location.
 * @param {Event} event - The event that triggered the path erasure.
 */
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

/**
 * Checks if a point is on a path.
 * @param {SVGPathElement} path - The path element to check.
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @returns {boolean} - Returns true if the point is on the path, otherwise false.
 */
function isPointOnPath(path, x, y) {
    const svg = document.getElementById('svg-board');
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return path.isPointInStroke(point);
}


