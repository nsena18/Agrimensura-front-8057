import currency from 'currency.js';

module.exports = {
    DateTimeFormatter(date) {
        var fecha = new Date(date);
        var fecha_str = "";

        var dia = fecha.getDate();
        if (dia < 10)
            fecha_str += "0" + dia;
        else
            fecha_str += dia;
        fecha_str += "/";
        var month = fecha.getMonth();
        if (month < 10)
            fecha_str += "0" + month;
        else
            fecha_str += month;
        fecha_str += "/";
        var Year = fecha.getFullYear();
        fecha_str += Year;
        fecha_str += " ";
        var Hour = fecha.getHours();
        if (Hour < 10)
            fecha_str += "0" + Hour;
        else
            fecha_str += Hour;
        fecha_str += ":";
        var Minutes = fecha.getMinutes();
        if (Minutes < 10)
            fecha_str += "0" + Minutes;
        else
            fecha_str += Minutes;

        return fecha_str;
    },
    DateFormatter(date) {
        var fecha = new Date(date);
        var fecha_str = "";

        var dia = fecha.getDate();
        if (dia < 10)
            fecha_str += "0" + dia;
        else
            fecha_str += dia;
        fecha_str += "/";
        var month = fecha.getMonth();
        if (month < 10)
            fecha_str += "0" + month;
        else
            fecha_str += month;
        fecha_str += "/";
        var Year = fecha.getFullYear();
        fecha_str += Year;

        return fecha_str;
    },
    formatCurrency(num) {
        var config = {
            cantidadDecimales: 2,
            caracterDecimales: ',',
            caracterMiles: '.',
        }
        
        if (config.caracterDecimales === '') config.caracterDecimales = ',';

        let formattedNum = currency(num, {
            separator: '',
            decimal: config.caracterDecimales,
            precision: config.cantidadDecimales
        });
        return formattedNum.format();
    }
}