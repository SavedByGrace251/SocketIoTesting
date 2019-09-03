export const fadeColor = (col, amt) => {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}


export const getTextColor = (hexCode) => {
    var r = parseInt(hexCode.slice(0, 2), 16) / 255;
    r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
    var g = parseInt(hexCode.slice(2, 4), 16) / 255;
    g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
    var b = parseInt(hexCode.slice(4, 6), 16) / 255;
    b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4
    var L = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    var textColor = L > 0.179 ? "black" : "white";
    return textColor
}