/**
 * Main module for a drawing application.
 * @module main
 */

import { initPointerEvents } from './script-modules/pointerEvents.js';
import { undo, redo, pushState, getCurrentState, clearHistory, loadNewHistoryStack} from './script-modules/history.js';
import { exportSVGtoPNG } from './script-modules/export.js';
import {saveDrawing, deleteDrawing, loadDrawing, populateSelectFromLocalStorage} from "./script-modules/localStorage.js";
import {showToast, handleVisibilityChange} from "./script-modules/toast.js";
import {isInCzechia, translateToCzech} from "./script-modules/localize.js"

/**
 * Initializes the application, adds event listeners, and sets up the initial state.
 */
window.onload = async () => {
    // initializes board and stroke preview
    updateStrokePreview()
    initPointerEvents()
    pushState(getCurrentState())
    // prevents scrolling on touch devices when interacting with the board
    const svgBoard = document.getElementById('svg-board');
    svgBoard.addEventListener('touchstart', (event) => {
        event.preventDefault();
    });

    svgBoard.addEventListener('touchmove', (event) => {
        event.preventDefault();
    });

    svgBoard.addEventListener('touchend', (event) => {
        event.preventDefault();
    });
    // updates stroke preview when user changes color or width
    document.getElementById('stroke-color').addEventListener('change', () => {
        updateStrokePreview()
    });
    document.getElementById('stroke-width').addEventListener('change', () => {
        updateStrokePreview()
    });
    // button to clean the entire board
    document.getElementById('new').addEventListener('click', (event) => {
        event.preventDefault()
        const svg = document.getElementById('svg-board');
        svg.innerHTML = ''
        clearHistory()
    });
    // sets up the undo and redo buttons
    document.getElementById('undo').addEventListener('click', () => {
        undo()
    });
    document.getElementById('redo').addEventListener('click', () => {
        redo()
    });
    // sets up forms and their respective opener divs
    const saveDiv = document.getElementById('save')
    const saveForm = document.getElementById('save-form')
    const loadDiv = document.getElementById('load')
    const loadForm = document.getElementById('load-form')
    const exportDiv = document.getElementById('export')
    const exportForm = document.getElementById('export-form')
    const deleteDiv = document.getElementById('delete')
    const deleteForm = document.getElementById('delete-form')
    saveDiv.addEventListener("click", () => {
        if (saveForm.classList.contains('hidden')) {
            saveForm.classList.add('hidden')
            loadForm.classList.add('hidden')
            exportForm.classList.add('hidden')
            deleteForm.classList.add('hidden')
            saveForm.classList.remove('hidden')
        } else {
            saveForm.classList.add('hidden')
        }
    })
    saveForm.addEventListener("submit", (event) => {
        event.preventDefault()
        let drawingName = document.getElementById('saving-name-input').value.trim()
        saveDrawing(drawingName)
    })
    loadDiv.addEventListener("click", () => {
        if (loadForm.classList.contains('hidden')) {
            populateSelectFromLocalStorage('saved-drawings-load-select')
            saveForm.classList.add('hidden')
            loadForm.classList.add('hidden')
            exportForm.classList.add('hidden')
            deleteForm.classList.add('hidden')
            loadForm.classList.remove('hidden')
        } else {
            loadForm.classList.add('hidden')
        }
    })
    loadForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const savedDrawingsDropdown = document.getElementById('saved-drawings-load-select');
        const selectedDrawingName = savedDrawingsDropdown.value;
        if (selectedDrawingName === '') {
            showToast(false, 'Failure', 'Please select a drawing to load')
        } else {
            const loadedHistoryStack = loadDrawing(selectedDrawingName)
            if (loadedHistoryStack) {
                const svg = document.getElementById('svg-board')
                svg.innerHTML = '';
                loadNewHistoryStack(loadedHistoryStack);
                showToast(true, 'Drawing loaded', 'You can now proceed to editing')
            } else {
                showToast(false, 'Drawing not loaded', `Failed to load "${selectedDrawingName}".`)
                alert(`Failed to load the drawing "${selectedDrawingName}".`)
            }
        }
    })
    exportDiv.addEventListener("click", () => {
        if (exportForm.classList.contains('hidden')) {
            saveForm.classList.add('hidden')
            loadForm.classList.add('hidden')
            exportForm.classList.add('hidden')
            deleteForm.classList.add('hidden')
            exportForm.classList.remove('hidden')
        } else {
            exportForm.classList.add('hidden')
        }
    })
    exportForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const svgBoard = document.getElementById('svg-board')
        const pixelDensity = document.getElementById('quality-range-input').value;
        const background = document.getElementById('desired-background').value
        exportSVGtoPNG(svgBoard, pixelDensity, background);
    });
    deleteDiv.addEventListener("click", () => {
        if (deleteForm.classList.contains('hidden')) {
            populateSelectFromLocalStorage('saved-drawings-delete-select')
            saveForm.classList.add('hidden')
            loadForm.classList.add('hidden')
            exportForm.classList.add('hidden')
            deleteForm.classList.add('hidden')
            deleteForm.classList.remove('hidden')
        } else {
            deleteForm.classList.add('hidden')
        }
    })
    deleteForm.addEventListener("submit", (event) => {
        event.preventDefault()
        deleteDrawing(document.getElementById('saved-drawings-delete-select').value)
        populateSelectFromLocalStorage('saved-drawings-delete-select')
    })
    // showing and closing the learning video
    document.getElementById('show-video').addEventListener('click', () => {
        if (navigator.onLine) {
            const videoOverlay = document.getElementById('video-overlay');
            videoOverlay.classList.remove('hidden');
        } else {
            showToast(false, "You're offline", "Restore your internet connection first")
        }
    });
    document.getElementById('close-video').addEventListener('click', () => {
        const videoOverlay = document.getElementById('video-overlay');
        videoOverlay.classList.add('hidden');
        const video = document.getElementById('show-video');
    });
    // managing online and offline states
    window.addEventListener('offline', () => {
        const videoOverlay = document.getElementById('video-overlay');
        if (!videoOverlay.classList.contains('hidden')) {
            videoOverlay.classList.add('hidden');
            const video = document.getElementById('show-video');
            showToast(false, "You're offline", "Restore your internet connection first")
        }
    });
    window.addEventListener('online', () => {
        showToast(true, "You're online", "Enjoy your stay")
    });
    //
    document.addEventListener("visibilitychange", () => {
        handleVisibilityChange();
    })
    // personalized localization
    const inCzechia = await isInCzechia();
    if (inCzechia) {
        translateToCzech()
    }
};


function updateStrokePreview() {
    const color = document.getElementById('stroke-color').value;
    const width = document.getElementById('stroke-width').value;
    const strokePreview = document.getElementById('stroke-preview');

    const previewSize = 50;
    const strokeWidth = Math.min(width, previewSize / 2);

    strokePreview.style.width = `${previewSize}px`;
    strokePreview.style.height = `${strokeWidth}px`;
    strokePreview.style.backgroundColor = color;
    strokePreview.style.transform = `translateY(${(previewSize - strokeWidth) / 2}px)`;
}












