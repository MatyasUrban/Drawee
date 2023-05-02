import {getHistoryStack} from './history.js'
import {showToast} from "./toast.js"

export function saveDrawing(drawingName) {
    localStorage.setItem(drawingName, JSON.stringify(getHistoryStack()))
    showToast(true, 'Success', `Drawing saved as "${drawingName}".`)
}

export function deleteDrawing(drawingName) {
    if (isKeyInLocalStorage(drawingName)){
        localStorage.removeItem(drawingName)
        showToast(true, 'Success', `Drawing "${drawingName}" deleted.`)
    } else {
        showToast(false, 'Failure', `There is no drawing named "${drawingName}".`)
    }
}

function isKeyInLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value !== null;
}

export function getDrawingKeys() {
    const drawingKeys = []
    for (let i = 0; i < localStorage.length; i++) {
        drawingKeys.push(localStorage.key(i))
    }
    return drawingKeys
}

export function loadDrawing(drawingName) {
    if (localStorage.getItem(drawingName)) {
        return JSON.parse(localStorage.getItem(drawingName))
    }
    return null
}

export function populateSelectFromLocalStorage(selectId) {
    const select = document.getElementById(selectId)

    // Empty out the select element
    select.innerHTML = ''

    // Add an empty option
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.innerHTML = ''
    emptyOption.selected = true
    select.appendChild(emptyOption)

    // Add options from local storage keys
    const localStorageKeys = getLocalStorageKeys()
    localStorageKeys.forEach(key => {
        const option = document.createElement('option')
        option.value = key
        option.innerHTML = key
        select.appendChild(option)
    })
}

function getLocalStorageKeys() {
    const localStorageKeys = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageKeys.push(key);
    }

    return localStorageKeys;
}


