import moment from 'moment-timezone';

const horaCierre = { hora: 22, minutos: 0 };
const horaApertura = { hora: 7, minutos: 30 };

function verificarHorario(ctx, provider) {
    const ahora = moment().tz('Etc/GMT+4'); // Obtener la fecha y hora actual en GMT-4
    const horaActual = ahora.hours() + ahora.minutes() / 60;
    const diaActual = ahora.day();

    const horaCierreDecimal = horaCierre.hora + horaCierre.minutos / 60;
    const horaAperturaDecimal = horaApertura.hora + horaApertura.minutos / 60;

    if (diaActual === 0) {
        provider.sendText(`${ctx.from}@c.us`, 'Lo sentimos, nuestro horario de atención es de lunes a sábado. Por favor, regrese mañana a partir de las 7:30 AM.' );
        return true;
    }

    if (horaActual < horaAperturaDecimal || horaActual >= horaCierreDecimal) {
        provider.sendText(`${ctx.from}@c.us`, 'Lo sentimos, nuestro servicio a domicilio cierra a las 10:00 PM. Por favor, regrese mañana a partir de las 7:30 AM.' );
        return true;
    }

    return false;
}

export default verificarHorario;
