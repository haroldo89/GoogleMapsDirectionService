// ===================================================================================================
// Desarrollado Por		    :   Harold Caicedo.
// Fecha de Creación		:   2014/01/21.
// Producto o sistema	    :   Wizenz.Navi
// Empresa			        :   Wizenz Technologies
// Proyecto			        :   NAVI30
// Cliente			        :   Varios.
// ===================================================================================================
// Versión	        Descripción
// 1.0.0.0	        Funciones javascript de utilidad general para el modulo de mantenimiento.
// ===================================================================================================
// HISTORIAL DE CAMBIOS:
// ===================================================================================================
// Ver.	 Fecha		    Autor					Descripción
// ---	 -------------	----------------------	------------------------------------------------------
// XX	 yyyy/MM/dd	    [Nombre Completo]	    [Razón del cambio realizado] 
// ===================================================================================================

function LayoutHelper() { }

//Deshabilita el menu por defecto del clic derecho sobre el mapa
LayoutHelper.disableRightClic = function () {
    document.oncontextmenu = function () { return false; }
}

/** Impide se haga post cuando se presiona "enter" */
LayoutHelper.noenter = function () {
    return !(window.event && window.event.keyCode === 13);
}

//Permite establecer la opcion seleccionada en el menu principal de la pagina
LayoutHelper.setSelectedModule = function (selectedOptionId) {
    //Eliminar estilos de todo el menu de navegacion.
    $("ul#menu li").removeAttr('style').removeAttr('class');
    var selectedOptionMenuSelector = String.format("#{0}", selectedOptionId);
    var selectedOptionMenuControl = $(selectedOptionMenuSelector);
    if (selectedOptionMenuControl) {
        //Agregar estilo al link en donde se hace clic para dejar resaltado
        selectedOptionMenuControl.addClass("itemSelected");
    }
}

//Permite seleccionar o deseleccionar los item de un control selectable.
LayoutHelper.setSelectbleSelectItems = function (controlId, select) {
    if (controlId) {
        var controlSelectorId = String.format('#{0} li', controlId);
        if (select == true) {
            //var control = $("ui-unselecting", controlSelectorId);
            var control = $(controlSelectorId);
            if (control) {
                // adiciona a todos los elementos del control de selectable el estilo de seleccionado.
                control.removeClass("ui-unselecting").addClass("ui-selected");
            }
        }
        else {
            //var control = $("ui-selected", controlSelectorId);
            var control = $(controlSelectorId);
            if (control) {
                // adiciona a todos los elementos del control de selectable el estilo de deseleccionado.
                control.removeClass("ui-selected").addClass("ui-unselecting");
            }
        }
    }
}

/** 
* Esconde la barra superior 
*/
LayoutHelper.hideTopBar = function () {
    document.getElementById("header").setAttribute("style", "display:none");
    document.getElementById("content").setAttribute("style", "top:0px");
}
/**
* Muestra la Barra superior
*/
LayoutHelper.showTopBar = function () {
    document.getElementById("header").setAttribute("style", "display:inline");
    document.getElementById("content").setAttribute("style", "top:35px");
}

/*
Oculta la barra correspondiente a la configuracion del idioma 
*/
LayoutHelper.hideLanguageSetting = function () {
    $("#menuLanguage").css('display', 'none');
    $(".contentLanguage").css('display', 'none');
}

/*
Muestra la barra correspondiente a la configuracion del idioma 
*/
LayoutHelper.showLanguageSetting = function () {
    //Muestra Div de login
    document.getElementById("menuLanguage").setAttribute("style", "display:inline");
    //Le da la posicion al div en la posicion deseada
    $("#menuLanguage").position({
        my: "right top",
        at: "right bottom",
        collision: "fit fit",
        of: "#lnkLanguage"
    });

    $("#menuLanguage").css('top', '35px');

    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $(".contentLanguage").slideToggle(400, function () {
        //Validar si el div esta visible
        if (!$(".contentLanguage").is(":visible")) {
            LayoutHelper.hideLanguageSetting();
        }
    });
}

//Mostrar panel de alertas globales.
LayoutHelper.showGlobalAlerts = function () {
    //Muestra Div de alertas globales
    document.getElementById("globalAlerts").setAttribute("style", "display:inline");
    //Le da la posicion al div en la posicion deseada
    $("#globalAlerts").position({
        my: "center top",
        at: "center bottom",
        collision: "fit fit",
        of: "#mainLayout"
    });
    $(".headerAlerts").css('heigth', '30px');
    $("#globalAlerts").css('top', '0px');
}


//Comportamiento de slide del panel global de alertas.
LayoutHelper.slideGlobalAlerts = function () {
    $("#divHeaderAlerts").click(function () {
        $("#divContentAlerts").slideToggle(300, function () {

        });
    });
}

//Ocultar panel de alertas globales
LayoutHelper.hideGlobalAlerts = function () {
    //Muestra Div de alertas globales
    document.getElementById("globalAlerts").setAttribute("style", "display:none");
}

LayoutHelper.SlideUpMenu = function () {
    if ($(".content").is(":visible") || $(".contentLanguage").is(":visible")) {
        //cierra el slide del div
        $(".content").slideUp();
        $(".contentLanguage").slideUp();
    }
}

//Reproducir archivo de sonido formato .mp3
LayoutHelper.playSound = function (audioElementName, soundUrl) {
    var audioElement = document.getElementById(audioElementName);
    if (audioElement) {
        audioElement.src = soundUrl;
        audioElement.play();
    }
}

LayoutHelper.boldStyle = function (text) {
    return '<B>' + text + '</B>';
}

/*Construye un elemento de selección de una lista desplegable HTML*/
LayoutHelper.createSelectListItem = function (itemText, itemValue) {
    var optionElementTemplate = "<option value='{0}'>{1}</option>";
    return String.format(optionElementTemplate, itemValue, itemText);
}

//Visibilidad de un control html
LayoutHelper.setVisible = function (controlName, visible) {
    var controlSelector = String.format('#{0}', controlName);
    var control = $(controlSelector);
    if (control) {
        var visibilityAttribute = visible ? "inline" : "none";
        control.css('display', visibilityAttribute);
    }
}

//Devuelve el valor booleano de un control si es visible o no.
LayoutHelper.isVisible = function (controlName) {
    var isVisible = false;
    var controlSelector = String.format('#{0}', controlName);
    var control = $(controlSelector);
    if (control) {
        //var visibilityAttribute = control.attr('style', 'display');
        var visibilityAttribute = control.css('display');
        isVisible = visibilityAttribute != "none";
    }
    return isVisible;
}

//Obtener numero de registros por defecto para el control de datatable, segun resolucion de pantalla.
LayoutHelper.getRowsPerPage = function () {
    var rowsPerPage = 20
    var screenWidth = screen.width;
    if (screenWidth < 1600) {
        rowsPerPage = 10;
    }
    else {
        rowsPerPage = 20;
    }
    return rowsPerPage;
}

//Carga los servicios habilitados para el modulo de configuración
LayoutHelper.authorizeConfigurationModuleServices = function () {
    //Establece los servicios habilitados del modulo de configuración
    var configurationModuleServicesResult = $("#hdnConfigurationModuleService").val();
    if (!CommonUtils.isNullOrEmpty(configurationModuleServicesResult)) {
        var configurationModuleServices = jQuery.parseJSON(configurationModuleServicesResult);
        //Trae todos los servicios que no son core del modulo de configuración
        var configurationServices = $("li[id|='Serv']");

        //Establece que servicio se encuentra habilitado para el modulo de configuración
        $.each(configurationServices, function (i, configurationService) {
            var serviceMenuId = configurationService.id;
            var serviceAvailable = Enumerable.from(configurationModuleServices.viewModuleConfigurationService).firstOrDefault(function (m) { return m.serviceMenuId.trim() == serviceMenuId });
            if (!serviceAvailable) {
                $("#" + serviceMenuId).remove();
            }
        });
    }
    else {
        $("#liConfiguration").remove();
    }
}