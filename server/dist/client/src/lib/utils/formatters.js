"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = formatTime;
exports.formatDate = formatDate;
exports.scorePerMinute = scorePerMinute;
exports.tickFormatter = tickFormatter;
function formatTime(seconds, type = 0, checker = false) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const paddedMinutes = String(minutes).padStart(2, '0');
    if (type === 0) {
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m`;
        }
        else {
            return '';
        }
    }
    else {
        const remainingSeconds = Math.round(seconds) % 60;
        const paddedSeconds = String(remainingSeconds).padStart(2, '0');
        if (hours > 0) {
            return `${hours}:${paddedMinutes}`;
        }
        else if (minutes > 0) {
            if (checker) {
                return `${minutes} minuto${minutes === 1 ? '' : 's'} y ${remainingSeconds} segundo${remainingSeconds === 1 ? '' : 's'}`;
            }
            else {
                return `${paddedMinutes}:${paddedSeconds}`;
            }
        }
        else {
            if (checker) {
                return `${remainingSeconds} segundo${remainingSeconds === 1 ? '' : 's'}`;
            }
            else {
                return `${paddedSeconds}s`;
            }
        }
    }
}
function formatDate(dateString, locale = 'es') {
    const date = new Date(dateString);
    const monthNamesEs = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const monthNamesEn = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthNames = locale === 'en' ? monthNamesEn : monthNamesEs;
    return `${day} ${locale === 'en' ? '' : 'de '}${monthNames[monthIndex]} ${locale === 'en' ? '' : 'de '}${year}`;
}
function scorePerMinute(score, playtime) {
    const totalScore = parseInt(String(score));
    const totalPlaytimeInMinutes = parseInt(String(playtime)) / 60;
    const spm = totalScore / totalPlaytimeInMinutes;
    return spm.toFixed(2);
}
function tickFormatter(value, index, data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return value;
    }
    if (data.length <= 4) {
        return value;
    }
    if (index % 4 !== 0) {
        return '';
    }
    return value;
}
//# sourceMappingURL=formatters.js.map