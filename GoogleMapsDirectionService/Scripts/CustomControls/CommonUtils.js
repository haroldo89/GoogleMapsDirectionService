// ===================================================================================================
// Desarrollado Por		    :   Harold Caicedo.
// Fecha de Creación		:   2014/04/10.
// Empresa			        :   Wizenz Technologies
// Proyecto			        :   NAVI30
// Cliente			        :   Varios.
// ===================================================================================================
// Versión	        Descripción
// 1.0.0.0	        Funciones generales de la aplicacion.
// ===================================================================================================
// HISTORIAL DE CAMBIOS:
// ===================================================================================================
// Ver.	 Fecha		    Autor					Descripción
// ---	 -------------	----------------------	------------------------------------------------------
// XX	 yyyy/MM/dd	    [Nombre Completo]	    [Razón del cambio realizado] 
// ===================================================================================================
function CommonUtils() { }

CommonUtils.isNullOrEmpty = function (text) {
    try {
        //La variable esta definida
        if (text != undefined) {
            //La variable no es nula
            if (text != null) {
                //La variable posee contenido
                if (text.length > 0) {
                    //La variable no posee el contenido 'null'
                    if (text != 'null') {
                        return false;
                    }
                }
            }
        }
        return true;
    } catch (e) {
        return true;
    }
}

CommonUtils.parseToBool = function (text) {
    if (text == 'true') {
        return true;
    }
    else if (text == 'false') {
        return false;
    }
    else {
        return null;
    }
}

//Separador de miles
CommonUtils.addMilesSeparator = function (number, milesSeparator) {
    var separator = String.format("1{0}", milesSeparator);
    number = number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, separator);
    var index = number.lastIndexOf('.');
    number = number.substring(0, index);
    return number;
}

//Oculta mensaje
CommonUtils.hideMessage = function (lblMessage) {
    var lblContainer = String.format('#{0}', lblMessage);
    $(lblContainer).css("display", "none");
}

//Muestra mensaje
CommonUtils.showMessage = function (lblMessage, messageText, isSuccesful) {
    var lblContainer = String.format('#{0}', lblMessage);
    $(lblContainer).removeClass();
    $(lblContainer).css("display", "inline")
    if (isSuccesful && isSuccesful == true) {
        $(lblContainer).addClass("SucessMessage");
    }
    else {
        $(lblContainer).addClass("ErrorMessage");
    }
    $(lblContainer).text(messageText);

}

//Permite convertir un color en codigo hexadecimal a Microsoft.Maps.Color
CommonUtils.toHexToColor = function (hex) {
    //remueve el caracter de hash de hexadecimal
    if ((hex.charAt(0) == "#")) {
        hex = hex.substring(1, 8);
    }
    //Convierte el codigo hexadecimal en valores RGB en numeros enteros base 16
    var r = parseInt((hex).substring(2, 4), 16);
    var g = parseInt((hex).substring(4, 6), 16);
    var b = parseInt((hex).substring(6, 8), 16);
    var a = 255 * 0.75;
    return new Microsoft.Maps.Color(a, r, g, b);
}

//Mensajes de idioma para la extension de jQuery de jTable
CommonUtils.getJTableLanguageSettings = function () {
    var languageSettings = {};
    //Mensajes de idioma
    var messageSettings = {
        serverCommunicationError: Resources.jQuery_jTable_serverCommunicationError_Text,
        loadingMessage: Resources.jQuery_jTable_loadingMessage_Text,
        noDataAvailable: Resources.jQuery_jTable_noDataAvailable_Text,
        addNewRecord: Resources.jQuery_jTable_addNewRecord_Text,
        editRecord: Resources.jQuery_jTable_editRecord_Text,
        areYouSure: Resources.jQuery_jTable_areYouSure_Text,
        deleteConfirmation: Resources.jQuery_jTable_deleteConfirmation_Text,
        save: Resources.jQuery_jTable_save_Text,
        saving: Resources.jQuery_jTable_saving_Text,
        cancel: Resources.jQuery_jTable_cancel_Text,
        deleteText: Resources.jQuery_jTable_deleteText_Text,
        deleting: Resources.jQuery_jTable_deleting_Text,
        error: Resources.jQuery_jTable_error_Text,
        close: Resources.jQuery_jTable_close_Text,
        cannotLoadOptionsFor: Resources.jQuery_jTable_cannotLoadOptionsFor_Text,
        pagingInfo: Resources.jQuery_jTable_pagingInfo_Text,
        canNotDeletedRecords: Resources.jQuery_jTable_canNotDeletedRecords_Text,
        deleteProggress: Resources.jQuery_jTable_deleteProggress_Text,
        pageSizeChangeLabel: Resources.jQuery_jTable_pageSizeChangeLabel_Text,
        gotoPageLabel: Resources.jQuery_jTable_gotoPageLabel_Text
    };
    languageSettings = messageSettings;
    return languageSettings;
}

//Mensajes de idioma para la extension de jQuery de DataTable
CommonUtils.getDataTableLanguageSettings = function () {
    var languageSettings = {};
    //Mensajes de idioma
    var messageSettings = {
        "sProcessing": Resources.jQuery_DataTable_sProcessing_Text,
        "sLengthMenu": Resources.jQuery_DataTable_sLengthMenu_Text,
        "sZeroRecords": Resources.jQuery_DataTable_sZeroRecords_Text,
        "sEmptyTable": Resources.jQuery_DataTable_sEmptyTable_Text,
        "sInfo": Resources.jQuery_DataTable_sInfo_Text,
        "sInfoEmpty": Resources.jQuery_DataTable_sInfoEmpty_Text,
        "sInfoFiltered": Resources.jQuery_DataTable_sInfoFiltered_Text,
        "sInfoPostFix": Resources.jQuery_DataTable_sInfoPostFix_Text,
        "sSearch": Resources.jQuery_DataTable_sSearch_Text,
        "sUrl": Resources.jQuery_DataTable_sUrl_Text,
        "sInfoThousands": Resources.jQuery_DataTable_sInfoThousands_Text,
        "sLoadingRecords": Resources.jQuery_DataTable_sLoadingRecords_Text,
        "oPaginate": {
            "sFirst": Resources.jQuery_DataTable_oPaginatesFirst_Text,
            "sLast": Resources.jQuery_DataTable_oPaginatesLast_Text,
            "sNext": Resources.jQuery_DataTable_oPaginatesNext_Text,
            "sPrevious": Resources.jQuery_DataTable_oPaginatesPrevious_Text
        },
        "oAria": {
            "sSortAscending": Resources.jQuery_DataTable_oAriasSortAscending_Text,
            "sSortDescending": Resources.jQuery_DataTable_oAriasSortDescending_Text
        }
    };
    languageSettings = messageSettings;
    return languageSettings;
}

//Permite obtener la Longitud apartir de un GeoText en formato de SQL Server Spatial Data
CommonUtils.getLongitude = function (geoText) {
    var longitudeElement = null;
    var FULL_POINT_SEPARATOR = ' ';
    if (geoText != undefined && geoText != null && geoText.length > 0) {
        geoText = $.trim(geoText);
        var pointParts = geoText.split(FULL_POINT_SEPARATOR);
        //Obtener componentes de longitud
        var longitudePart = pointParts[1];
        //Obtener entero que representa la longitud total del string
        var longitudeLength = longitudePart.length;
        //Obtener longitud
        var longitudeElement = longitudePart.substring(1, longitudeLength);
    }
    return longitudeElement;
}

//Permite obtener la Latitud apartir de un GeoText en formato de SQL Server Spatial Data
CommonUtils.getLatitude = function (geoText) {
    var latitudeElement = null;
    var FULL_POINT_SEPARATOR = ' ';
    if (geoText != undefined && geoText != null && geoText.length > 0) {
        geoText = $.trim(geoText);
        var pointParts = geoText.split(FULL_POINT_SEPARATOR);
        //Obtener componentes de latitud
        var latitudePart = pointParts[2];
        //Obtener entero que representa la longitud total del string
        var latitudeLength = latitudePart.length;
        //Obtener latitud
        var latitudeElement = latitudePart.substring(0, latitudeLength - 1);
    }
    return latitudeElement;
}

//Cambia el separador decimal de una cantidad de ',' a '.'
CommonUtils.formatDecimalString = function (decimal) {
    return decimal.replace(",", ".");
}

//Adiciona un numero de horas determinado a un valor de fecha
CommonUtils.addHours = function (inputDate, hours) {
    var resultDate = CommonUtils.addMinutes(inputDate, hours * 60);
    return resultDate;
}

//Adiciona un numero de minutos determinado a un valor de fecha.
CommonUtils.addMinutes = function (inputDate, minutes) {
    var resultDate = new Date();
    if (inputDate) {
        var minutesMilliseconds = minutes * 60 * 1000;
        resultDate = new Date(inputDate.getTime() + minutesMilliseconds);
    }
    return resultDate;
}

//Tranforma un valor en grados a radianes
CommonUtils.DegrestoRadians = function (x) {
    return x * Math.PI / 180;
}

//Permite dar formato un registro tipo fecha 
Date.prototype.format = function (format) //author: meizz
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//Funcion string.Format en javascript
if (!String.format) {
    String.format = function (format) {

        var args = Array.prototype.slice.call(arguments, 1);
        var sprintfRegex = /\{(\d+)\}/g;

        var sprintf = function (match, number) {
            return number in args ? args[number] : match;
        };

        return format.replace(sprintfRegex, sprintf);
    };
}

//Evalua si una cadena de caracteres inicia con el texto especificado.
CommonUtils.startsWith = function (inputString, textToEvaluate) {
    return inputString.slice(0, textToEvaluate.length) == textToEvaluate;
}

//Funcion para formato de numero en javascript
if (!Number.numberFormat) {
    Number.prototype.numberFormat = function (decimals, dec_point, thousands_sep) {
        dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
        thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';
        var parts = this.toFixed(decimals).toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
        return parts.join(dec_point);
    }
}

//Funcion para agregar dias a una fecha especificada
if (!Date.addDays) {
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
}

//Funcion para agregar meses a una fecha especificada
if (!Date.addMonths) {
    Date.prototype.addMonths = function (months) {
        var dat = new Date(this.valueOf());
        dat.setMonth(dat.getMonth() + months);
        return dat;
    }
}

CommonUtils.getFormatHourDateAMPM = function (date) {
    if (date) {
        var currentTime = new Date(date);
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()
        if (minutes < 10)
            minutes = "0" + minutes;

        var suffix = "AM";
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }
        var current_time = hours + ":" + minutes + " " + suffix;
        return current_time;
    }
    return "";
}