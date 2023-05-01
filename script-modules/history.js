let historyStack = [];
let historyIndex = -1;

export function getCurrentState() {
    const svg = document.getElementById('svg-board');
    return svg.innerHTML;
}

export function pushState(state) {
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }
    historyIndex++;
    historyStack.push(state);

    // Update the browser's history
    window.history.pushState({ index: historyIndex }, '');
}

export function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreDrawing(historyStack[historyIndex]);
    }
}

export function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreDrawing(historyStack[historyIndex]);
    }
}

export function clearHistory() {
    historyStack = [];
    historyIndex = -1;
    pushState(getCurrentState());
    window.history.go(-(window.history.length - 1));
}

export function getHistoryStack() {
    return historyStack;
}



export function restoreDrawing(drawingState) {
    const svg = document.getElementById('svg-board');
    svg.innerHTML = drawingState;
}

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