// ===================================================================================================
// Desarrollado Por		    :   Harold Caicedo.
// Fecha de Creación		:   2016/02/27.
// ===================================================================================================
// Versión	        Descripción
// 1.0.0.0	        Funciones javascript de vista parcial de Route.
// ===================================================================================================
// HISTORIAL DE CAMBIOS:
// ===================================================================================================
// Ver.	 Fecha		    Autor					Descripción
// ---	 -------------	----------------------	------------------------------------------------------
// XX	 yyyy/MM/dd	    [Nombre Completo]	    [Razón del cambio realizado] 
// ===================================================================================================
function RouteIndex() { }

/**
 * Adiciona un vehiculo en el mapa
 */
RouteIndex.UNSELECTED_ITEM = 0;

/**
 * Adiciona un vehiculo en el mapa
 *
 * @param {objet} vehicleInfo informacion de vehiculos a mostrar en el mapa.
 * @param {int} zIndex posicion del elemento en el mapa.
 * @return {void}
 *
 */
RouteIndex.initializeComponents = function (listCmd, deleteCmd, updateCmd, createCmd) {
    var containerHTML = String.format('#{0}', 'divRouteTableContainerValue');
    //Establecer funcion de busqueda sobre la tabla
    var sender = String.format('#{0}', 'btnSearch');
    var senderNewSearch = String.format('#{0}', 'btnNewSearch');
    RouteIndex.initializeNewSearch(senderNewSearch, containerHTML);
    RouteIndex.initializeSearch(sender, containerHTML);
    //Inicializar tabla
    RouteIndex.initializeTable(containerHTML, listCmd, deleteCmd, updateCmd, createCmd);
};

/**
 * Adiciona un vehiculo en el mapa
 *
 * @param {objet} vehicleInfo informacion de vehiculos a mostrar en el mapa.
 * @param {int} zIndex posicion del elemento en el mapa.
 * @return {void}
 *
 */
RouteIndex.initializeNewSearch = function (sender, containerHTML) {
    CommonUtils.hideMessage('lblMessage');
    //Re-load records when user click 'load records' button.
    $(sender).click(function (e) {
        e.preventDefault();
        $(containerHTML).jtable('load');
        $('#txtName').val('');
    });
};

/**
 * Adiciona un vehiculo en el mapa
 *
 * @param {objet} vehicleInfo informacion de vehiculos a mostrar en el mapa.
 * @param {int} zIndex posicion del elemento en el mapa.
 * @return {void}
 *
 */
RouteIndex.initializeSearch = function (sender, containerHTML) {
    //Re-load records when user click 'load records' button.
    $(sender).click(function (e) {
        e.preventDefault();
        $(containerHTML).jtable('load', {
            name: $('#txtName').val(),
        });
        CommonUtils.hideMessage('lblMessage');
    });
};

/**
 * Adiciona un vehiculo en el mapa
 *
 * @param {objet} vehicleInfo informacion de vehiculos a mostrar en el mapa.
 * @param {int} zIndex posicion del elemento en el mapa.
 * @return {void}
 *
 */
RouteIndex.initializeTable = function (containerHTML, listCmd, deleteCmd, updateCmd, createCmd) {
    $(containerHTML).jtable({
        title: 'Rutas',
        paging: true,
        pageSize: 20,
        sorting: true,
        defaultSorting: 'Name ASC',
        selecting: true,
        actions: {
            listAction: listCmd
            //deleteAction: deleteCmd,
            //updateAction: updateCmd,
            //createAction: createCmd
        },
        fields: {
            RouteId: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            Name: {
                title: 'Nombre',
                inputClass: 'validate[required, maxSize[60]]'

            }
        },
        //Register to selectionChanged event to hanlde events
        selectionChanged: function () {
            //Get all selected rows
            var $selectedRows = $(containerHTML).jtable('selectedRows');
            //$('#SelectedRowList').empty();
            if ($selectedRows.length > 0) {
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    var routeId = record.RouteId;
                    RouteIndex.showRouteOnMap(routeId);
                });
            } else {
                //No rows selected
                $('#SelectedRowList').append('No row selected! Select rows to see here...');
            }
        },
        //Registro Insertado
        recordAdded: function (event, data) {
            var dataName = data.record.Name;
            var resultMessage = String.format("Registro {0} ingresado correctamente", dataName);
            CommonUtils.showMessage('lblMessage', resultMessage);
        },
        //Registro Actualizado
        recordUpdated: function (event, data) {
            var dataName = data.record.Name;
            var resultMessage = String.format("Registro {0} actualizado correctamente", dataName);
            CommonUtils.showMessage('lblMessage', resultMessage);
        },
        //Registro Eliminado
        recordDeleted: function (event, data) {
            var dataName = data.record.Name;
            var resultMessage = String.format("Registro {0} eliminado correctamente", dataName);
            CommonUtils.showMessage('lblMessage', resultMessage);
        },
        formCreated: function (event, data) {
            data.form.validationEngine({ promptPosition: "bottomLeft" });
        },
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        }
    });
    $(containerHTML).jtable('load');
};

RouteIndex.showRouteOnMap = function (routeId) {
    $("#divDialogMap").dialog({
        height: 450, width: 450, resizable: false, autoOpen: false, modal: true,
        title: 'Vista Previa',
        open: function (event, ui) {
            RouteIndex.loadRouteonMap(routeId);
        }
    });
    $("#divDialogMap").dialog('open');
}

RouteIndex.loadRouteonMap = function (routeId) {
    $.ajax({
        url: '/Route/GetRouteInfo',
        data: {
            routeId: routeId
        },
        cache: false,
        success: function (result) {
            RouteIndex.loadRouteonMap_onSucces(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            RouteIndex.loadRouteonMap_onError(jqXHR, textStatus, errorThrown);
        }
    });
}

RouteIndex.loadRouteonMap_onSucces = function (result) {
    if (result.errorMessage == null) {
        // Opciones de mapa.
        var mapOptions = {
            zoom: 5,
            center: { lat: 4.6750, lng: -75.4300 },
            scaleControl: true
        }
        // Contenedor del mapa
        var containerMap = document.getElementById('divDialogContentMap');
        // Crear mapa.
        var map = GoogleMapsHelper.initializeMap(containerMap, mapOptions);
        //Array de puntos
        var pointLocations = new Array();
        var bounds = new google.maps.LatLngBounds();
        $.each(result.routePoints, function (e, point) {
            var pointLocation = new google.maps.LatLng(point.Latitude, point.Longitude);
            pointLocations.push(pointLocation);
            bounds.extend(pointLocation);
        })
        var routePolyline = GoogleMapsHelper.createPolyline({ path: pointLocations, strokeColor: '#C83939', strokeOpacity: 1, strokeWeight: 4, geodesic: true });
        routePolyline.setMap(map);
        map.fitBounds(bounds);
    }
    else {
        alert(result.errorMessage);
    }
}

RouteIndex.loadRouteonMap_onError = function (jqXHR, textStatus, errorThrown) {
    alert(textStatus);
}