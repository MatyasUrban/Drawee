export async function isInCzechia() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();

        return data.address.country_code === 'cz';
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export function translateToCzech() {
    document.querySelector('label[for="brush"] span').innerHTML = 'Tužka'
    document.querySelector('label[for="eraser"] span').innerHTML = 'Guma'
    document.querySelector('label[for="saving-name-input"]').innerHTML = 'Název kresby:'
    document.querySelector('#saving-name-input').placeholder = 'Napište název'
    document.querySelector('#save-form input[type="submit"]').value = 'Uložit kresbu do local storage'
    document.querySelector('label[for="saved-drawings-load-select"]').innerHTML = 'Vyberte svou kresbu:'
    document.querySelector('#load-form input[type="submit"]').value = 'Načíst kresbu na plátno'
    document.querySelector('label[for="quality-range-input"]').innerHTML = 'Ostrost (nejmenší po největší):'
    document.querySelector('label[for="desired-background"]').innerHTML = 'Pozadí obrázku:'
    document.querySelector('#desired-background option[value="transparent"]').innerHTML = 'Průhledné'
    document.querySelector('#desired-background option[value="white"]').innerHTML = 'Bílé'
    document.querySelector('#desired-background option[value="black"]').innerHTML = 'Černé'
    document.querySelector('#export-form input[type="submit"]').value = 'Stáhnout kresbu jako PNG'
    document.querySelector('label[for="saved-drawings-delete-select"]').innerHTML = 'Vyberte svou kresbu:'
    document.querySelector('#delete-form input[type="submit"]').value = 'Odstranit kresbu z local storage'
}