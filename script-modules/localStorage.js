/**
 * Module for managing local storage of drawings.
 * @module localStorage
 * @requires module:history
 * @requires module:toast
 */

import {getHistoryStack} from './history.js'
import {showToast} from "./toast.js"

/**
 * Saves a drawing to local storage with the given name.
 * @param {string} drawingName - The name for the drawing to be saved.
 */
export function saveDrawing(drawingName) {
    localStorage.setItem(drawingName, JSON.stringify(getHistoryStack()))
    showToast(true, 'Success', `Drawing saved as "${drawingName}".`)
}

/**
 * Deletes a drawing with the given name from local storage.
 * @param {string} drawingName - The name of the drawing to be deleted.
 */
export function deleteDrawing(drawingName) {
    if (isKeyInLocalStorage(drawingName)){
        localStorage.removeItem(drawingName)
        showToast(true, 'Success', `Drawing "${drawingName}" deleted.`)
    } else {
        showToast(false, 'Failure', `There is no drawing named "${drawingName}".`)
    }
}

/**
 * Checks if a key exists in local storage.
 * @param {string} key - The key to check for in local storage.
 * @returns {boolean} - Returns true if the key exists, otherwise false.
 */
function isKeyInLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value !== null;
}

/**
 * Loads a drawing with the given name from local storage.
 * @param {string} drawingName - The name of the drawing to be loaded.
 * @returns {Array|null} - Returns the loaded drawing as an array if it exists, otherwise null.
 */
export function loadDrawing(drawingName) {
    if (localStorage.getItem(drawingName)) {
        return JSON.parse(localStorage.getItem(drawingName))
    }
    return null
}

/**
 * Populates a select element with options based on the keys in local storage.
 * @param {string} selectId - The ID of the select element to populate.
 */
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

/**
 * Retrieves all keys from local storage.
 * @returns {Array} - An array of all keys in local storage.
 */
function getLocalStorageKeys() {
    const localStorageKeys = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageKeys.push(key);
    }

    return localStorageKeys;
}


