export function exportSVGtoPNG(svgElement, pixelDensity, backgroundColor) {
    const svgString = new XMLSerializer().serializeToString(svgElement);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width * pixelDensity;
    canvas.height = svgSize.height * pixelDensity;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    img.onload = () => {
        ctx.save();
        ctx.scale(pixelDensity, pixelDensity);
        ctx.drawImage(img, 0, 0, svgSize.width, svgSize.height);
        ctx.restore();

        const a = document.createElement('a');
        a.download = 'image.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    };

    // Add viewBox attribute to ensure proper scaling
    const encodedSvgString = encodeURIComponent(svgString.replace('<svg', `<svg viewBox="0 0 ${svgSize.width} ${svgSize.height}"`));
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodedSvgString));
}
