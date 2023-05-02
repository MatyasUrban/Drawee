/**
 * Manages the undo/redo history for the SVG drawing board.
 * @module history
 */

let historyStack = [];
let historyIndex = -1;

/**
 * Returns the current SVG state of the drawing board.
 * @returns {string} The innerHTML of the SVG element.
 */
export function getCurrentState() {
    const svg = document.getElementById('svg-board');
    return svg.innerHTML;
}

/**
 * Pushes a new state onto the history stack and updates the browser's history.
 * @param {string} state - The new SVG state to push onto the history stack.
 */
export function pushState(state) {
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }
    historyIndex++;
    historyStack.push(state);
    // Update the browser's history
    window.history.pushState({ index: historyIndex }, '');
}

/**
 * Undoes the last change by moving back in the history stack and restoring the previous SVG state.
 */
export function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreDrawing(historyStack[historyIndex]);
    }
}

/**
 * Redoes the last undone change by moving forward in the history stack and restoring the next SVG state.
 */
export function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreDrawing(historyStack[historyIndex]);
    }
}

/**
 * Clears the history stack and resets the historyIndex. Also pushes the current state onto the history stack and updates the browser's history.
 */
export function clearHistory() {
    historyStack = [];
    historyIndex = -1;
    pushState(getCurrentState());
    window.history.go(-(window.history.length - 1));
}

/**
 * Returns the current history stack.
 * @returns {Array<string>} The history stack containing the SVG states.
 */
export function getHistoryStack() {
    return historyStack;
}

/**
 * Restores the drawing board to a specified SVG state.
 * @param {string} drawingState - The SVG state to restore the drawing board to.
 */
export function restoreDrawing(drawingState) {
    const svg = document.getElementById('svg-board');
    svg.innerHTML = drawingState;
}

/**
 * Loads a new history stack and sets the historyIndex to the last state. Also restores the drawing board to the last state in the new history stack.
 * @param {Array<string>} newHistoryStack - The new history stack to load.
 */
export function loadNewHistoryStack(newHistoryStack) {
    historyStack = newHistoryStack;
    historyIndex = historyStack.length - 1;
    restoreDrawing(historyStack[historyIndex]);
}


window.addEventListener('popstate', (event) => {
    if (event.state && event.state.index !== undefined) {
        historyIndex = event.state.index;
        restoreDrawing(historyStack[historyIndex]);
    }
});