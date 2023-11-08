export function formatFriendlyDate(fecha: string) {
    const date = new Date();
    let dateToFormat = new Date(fecha);
    dateToFormat = new Date(
        dateToFormat.getFullYear(),
        dateToFormat.getMonth(),
        dateToFormat.getDate()
    );
    // Get only date's date component without time
    const currentDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

    // Compare dates
    if (dateToFormat.getTime() === currentDate.getTime()) {
        return "Hoy";
    } else if (dateToFormat.getTime() === tomorrowDate.getTime()) {
        return "Mañana";
    } else if (dateToFormat.getTime() === yesterdayDate.getTime()) {
        return "Ayer";
    } else if (dateToFormat > yesterdayDate && dateToFormat < currentDate) {
        const weekDays = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
        ];
        const day = weekDays[dateToFormat.getDay()];
        return day;
    } else {
        // Return date value as string
        return dateToFormat.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
}

export const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export function getMonthFromDate(fecha = new Date()) {
    console.log({ fecha });
    const mesActual = fecha.getMonth();

    return { mes: months[mesActual], index: mesActual };
}

export function formatUTCDateTime(date: string) {
    let dt = new Date(date);
    let formatDateTime = Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "medium",
        hourCycle: "h23",
        timeZone: "UTC",
    }).format(dt);
    return formatDateTime;
}
export function formatUTCDateTime12(date: string) {
    let dt = new Date(date);
    let formatDateTime = Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "medium",
        hourCycle: "h11",
        timeZone: "UTC",
    }).format(dt);
    return formatDateTime;
}
export function formatUTCTime(date: string) {
    let t = new Date(date);
    let formatTime = Intl.DateTimeFormat("es-MX", {
        timeStyle: "medium",
        hourCycle: "h23",
        timeZone: "UTC",
    }).format(t);
    return formatTime;
}
export function formatLocalTime(date: string) {
    let t = new Date(date);
    let formatTime = Intl.DateTimeFormat("es-MX", {
        timeStyle: "medium",
        hourCycle: "h12",
    }).format(t);
    return formatTime;
}
export function formatUTCDate(date: string) {
    let d = new Date(date);
    let formateDate = Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        hourCycle: "h23",
        timeZone: "UTC",
    }).format(d);
    return formateDate;
}
export function formatDate(date = new Date()) {
    let fecha = new Date(date);
    return `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${fecha.getDate().toString().padStart(2, "0")}`;
}
export function formatTime(date = new Date()) {
    let fecha = new Date(date);
    return `${fecha.getHours().toString().padStart(2, "0")}:${fecha
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${fecha.getSeconds().toString().padStart(2, "0")}`;
}
export function formatDateTime(date = new Date()) {
    let fecha = new Date(date);
    return `${formatDate(fecha)} ${formatTime(fecha)}`;
}

export function getFullFriendlyDate(fecha: string) {
    let formateado = formatFriendlyDate(fecha);
    let hora = formatLocalTime(fecha);
    return `${formateado} ${hora}`;
}