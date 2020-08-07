/**
 * Servicio de direcciones y calculo en porcentaje de ruta.
 */
function DirectionsService() { }

/**
 * Marcador de punto inicial
 */
DirectionsService.startLocationMarker = null;

/**
 * Marcador de punto final
 */
DirectionsService.endLocationMarker = null;

/**
 * Marcador de punto cercano
 */
DirectionsService.nearestLocationMarker = null;

/**
 * Hubo retorno en ruta.
 */
DirectionsService.returnedRoute = false;

/**
 * Porcentaje en viaje
 */
DirectionsService.progressTripPercent = -1;

/**
 * Cadena de texto que representa un objeto lineString
 */
DirectionsService.routeLineString = '';

/**
 * Permite validar si la busqueda ha sido generada desde el comando del boton buscar
 */
DirectionsService.isSearchCommandEvent = false;


DirectionsService.getPointsLocationsData = function () {
    var principalCitiesOfColombia = [
  		['Bogota', 4.3400, -74.0000, 1],
  		['Cali', 3.2500, -76.3500, 2],
  		['Pereira', 4.6750, -75.4300, 3],
  		['Medellin', 6.1500, -75.3500, 4],
  		['Bucaramanga', 7.0000, -73.0000, 5],
  		['Cartagena', 10.3550, -75.5000, 6]
    ];
    return principalCitiesOfColombia;
};

/**
 * Limpiar controles
 * 
 * @returns {void}
 */
DirectionsService.clearMapControls = function () {
    DirectionsService.initMap();
    document.getElementById('tripGeneralInfo').innerHTML = "";
    document.getElementById('warnings-panel-content').innerHTML = "";
    document.getElementById('instructions-panel').innerHTML = "";
    //$("#infoLinestring-panel").html('');
    DirectionsService.routeLineString = '';
    return false;
}

/**
 * Inicializar componentes.
 */
DirectionsService.initializeComponents = function () {
    // unblock when ajax activity stops 
    $(document).ajaxStop($.unblockUI);
    DirectionsService.clearMapControls();
    $("#btnSaveRoute").click(DirectionsService.btnSaveRoute_Clik);
};

/**
 * Inicializar mapa
 */
DirectionsService.initMap = function () {
    var markerArray = [];
    // Instantiate a directions service.
    var directionsService = GoogleMapsHelper.createDirectionService();
    // Opciones de mapa.
    var mapOptions = {
        zoom: 5,
        center: { lat: 4.6750, lng: -75.4300 },
        scaleControl: true
    }
    // Contenedor del mapa
    var containerMap = document.getElementById('map');
    // Crear mapa.
    var map = GoogleMapsHelper.initializeMap(containerMap, mapOptions);

    // Opciones de servicio de renderizacion de direcciones.
    var directionRendererOptions = {
        suppressMarkers: true,
        'draggable': true,
        //suppressPolylines: true,
        map: map
    };

    // Crear servicio de renderizacion de direcciones.
    var directionsDisplay = GoogleMapsHelper.createDirectionsRenderer(directionRendererOptions);
    // Instantiate an info window to hold step text.
    var stepDisplay = GoogleMapsHelper.createInfoWindow();

    var startLocation = GoogleMapsHelper.pointLocation(4.710926077536297, -74.03278732299804);
    //Opciones para marcador en el mapa
    var startMarkerOptions = {
        position: startLocation,
        map: map,
        title: 'Inicio',
        draggable: true
    };
    //Crear marker
    DirectionsService.startLocationMarker = GoogleMapsHelper.createMarker(startMarkerOptions);

    var endLocation = GoogleMapsHelper.pointLocation(4.703836853382492, -74.03299522399902);
    //Opciones para marcador en el mapa
    var endMarkerOptions = {
        position: endLocation,
        map: map,
        title: 'Fin',
        draggable: true
    };
    //Crear marker
    DirectionsService.endLocationMarker = GoogleMapsHelper.createMarker(endMarkerOptions);

    // Declaracion de evento de buscar ruta
    var onSearchRoute = function () {
        var startTripPosition = DirectionsService.startLocationMarker.getPosition();
        var endTripPosition = DirectionsService.endLocationMarker.getPosition();
        DirectionsService.calculateAndDisplayRoute(directionsDisplay, directionsService, startTripPosition, endTripPosition, markerArray, stepDisplay, map);
        return false;
    }

    directionsDisplay.addListener('directions_changed', function (event, arg) {
        DirectionsService.showSteps(directionsDisplay.getDirections(), markerArray, stepDisplay, map);
    });

    // Evento de boton de limpiar mapa
    $("#btnClearMap").click(DirectionsService.clearMapControls);
    // Evento de boton de buscar.
    $("#btnSearch").click(onSearchRoute);
}

/**
 * Calcular y mostrar ruta.
 * 
 * @param {object} directionsDisplay
 * @param {object} directionsService
 * @param {object} startTripPosition
 * @param {object} endTripPosition
 * @param {object} markerArray
 * @param {object} stepDisplay
 * @param {object} map
 * 
 * @returns {void}
 */
DirectionsService.calculateAndDisplayRoute = function (directionsDisplay, directionsService, startTripPosition, endTripPosition, markerArray,
    stepDisplay, map) {
    // Se remueven todos los marker existentes en el mapa.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    // Se inicializa el servicio de direcciones de google maps 
    // con base la punto inicial y punto final marcados en el mapa
    // el calculo ser realiza con la opcion travelMode : google.maps.TravelMode.DRIVING (vehiculo) 
    directionsService.route({
        origin: startTripPosition,
        destination: endTripPosition,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
            var panel = document.getElementById('instructions-panel');
            panel.innerHTML = '';
            directionsDisplay.setDirections(response);
            directionsDisplay.setPanel(panel);
            DirectionsService.showSteps(response, markerArray, stepDisplay, map);
        }
        else {
            window.alert('Directions request failed due to ' + status);
            directionsDisplay.setPanel(null);
        }
    });
}

/**
 * Mostrar pasos del servicio de direcciones.
 * 
 * @param {object} directionResult
 * @param {object} markerArray
 * @param {object} stepDisplay
 * @param {object} map
 * 
 * @returns {void}
 */
DirectionsService.showSteps = function (directionResult, markerArray, stepDisplay, map) {
    //  Para cada paso, se adiciona un marker y se agrega un infobox con la informacion de la instruccion.
    // Se quitan todos los markers cuando se calcula una nueva ruta
    var myRoute = directionResult.routes[0].legs[0];
    //Puntos de la ruta.
    var routePoints = directionResult.routes[0].overview_path;
    var distance = myRoute.distance.value;
    var timeTrip = myRoute.duration.value;
    //var resultColor = isLocationNear ? 'green' : 'red';
    var stepMarker = {
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'orange',
            fillOpacity: 0.2,
            strokeColor: 'white',
            strokeWeight: 0.5,
            scale: 10
        }
    };
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || GoogleMapsHelper.createMarker(stepMarker);
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        var distanceToObjetive = myRoute.steps[i].distance.value;
        var timeToObjetive = myRoute.steps[i].duration.value;
        var instruction = myRoute.steps[i].instructions;
        var step = myRoute.steps[i];
        var message = instruction + "  Distancia: " + distanceToObjetive + "(mts) Tiempo :" + timeToObjetive + "(Seg)";
        //Mostrar en infobox instruccion para ese paso.
        DirectionsService.attachInstructionText(stepDisplay, marker, message, map, step);
    }
    // Obtener polilinea a partir de los puntos generados del servicio de direcciones.
    var routePolyline = GoogleMapsHelper.createPolyline({ path: [], strokeColor: '#C83939', strokeOpacity: 1, strokeWeight: 4, geodesic: true });
    var legs = directionResult.routes[0].legs;
    for (i = 0; i < legs.length; i++) {
        var steps = legs[i].steps;
        for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (k = 0; k < nextSegment.length; k++) {
                routePolyline.getPath().push(nextSegment[k]);
            }
        }
    }
    // generar valor de linestring de la polilinea dibujada por el servicio de direcciones.
    var polyLinePoints = routePolyline.getPath();
    DirectionsService.routeLineString = 'LINESTRING(';
    for (k = 0; k < polyLinePoints.length; k++) {
        var point = polyLinePoints.b[k];
        var longitudeValue = parseFloat(point.lng().toFixed(5));
        var latitudeValue = parseFloat(point.lat().toFixed(5));
        if ((longitudeValue.toString().indexOf('...') == -1) && (latitudeValue.toString().indexOf('...') == -1)) {
            if (!isNaN(longitudeValue) && !isNaN(latitudeValue)) {
                DirectionsService.routeLineString = DirectionsService.routeLineString + longitudeValue + '  ' + latitudeValue + ', ';
                //DirectionsService.routeLineString = DirectionsService.routeLineString + latitudeValue + '  ' + longitudeValue + ', ';
            }
        }
    }
    // Quitar ultima coma y espacio de separacion de puntos.
    DirectionsService.routeLineString = DirectionsService.routeLineString.slice(0, -2);
    // Cerrar objeto linestring.
    DirectionsService.routeLineString = DirectionsService.routeLineString + ')';
    // Establecer valor en panel de informacion de linestring.
    //$("#lblLinestringInfo").text(DirectionsService.routeLineString);
    // Dibujar polilinea resultado del servicio de direcciones en el mapa.
    //routePolyline.setMap(map);
    // Mostrar informacion general de la ruta.
    var distance = google.maps.geometry.spherical.computeLength(routePolyline.getPath());
    var tripMessage = "Distancia : " + Math.round(distance) + "(mts)";
    document.getElementById('tripGeneralInfo').innerHTML = '<b>' + tripMessage + '</b>';
    // Mostrar informacion de punto seleccionado en la polilinea.
    DirectionsService.showInfoRouteDirectionService(map, routePolyline);
    // Mostrar si el punto seleccionado en el mapa esta cerca a la polilinea.
    DirectionsService.showNearesPointLocation(map, routePolyline);
    // No mostrar marcadores de seleccion de ubicacion.
    DirectionsService.startLocationMarker.setMap(null);
    DirectionsService.endLocationMarker.setMap(null);
}

/**
 * Mostrar informacion de la polilinea, segun el punto seleccionado en el mapa.
 */
DirectionsService.showInfoRouteDirectionService = function (map, routePolyline) {
    google.maps.event.addListener(routePolyline, 'click', function (evt) {
        DirectionsService.showInfoPointLocation(evt, map, routePolyline);
    });
}

/**
 * 
 * Mostrar si el punto seleccionado en el mapa esta cercano a la polilinea 
 * generada por el servicio de direcciones
 * 
 * @param {object} map mapa seleccionado
 * @param {routePolyline} polilinea seleccionada
 * 
 * @returns {object} object marker sobre el mapa.
 * 
 */
DirectionsService.showNearesPointLocation = function (map, routePolyline) {
    // Manejador de evento clic sobre el mapa.
    google.maps.event.addListener(map, 'click', function (e) {
        DirectionsService.showInfoPointLocation(e, map, routePolyline);
    });
}

/**
 * Mostrar informacion de punto seleccionado en mapa.
 * 
 * @param {object} e
 * @param {object} map
 * @param {object} routePolyline
 * 
 * @returns {void}
 */
DirectionsService.showInfoPointLocation = function (e, map, routePolyline) {
    if (DirectionsService.nearestLocationMarker != null) {
        DirectionsService.nearestLocationMarker.setMap(null);
    }
    var selectedPointLocation = e.latLng;
    //Validar si donde ser hace clic en el mapa es un punto cercano a la polilinea.
    var isLocationNear = GoogleMapsHelper.isNearestPointLocationToPolyline(routePolyline, selectedPointLocation, 200);
    var resultColor = isLocationNear ? 'green' : 'red';
    var nearestMarker = {
        position: selectedPointLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: resultColor,
            fillOpacity: 0.2,
            strokeColor: 'white',
            strokeWeight: 0.5,
            scale: 10
        }
    };
    DirectionsService.nearestLocationMarker = GoogleMapsHelper.createMarker(nearestMarker);
    //Obtener distancia.
    var distance = GoogleMapsHelper.GetDistanceBetweenPolylineAndPoint(routePolyline, selectedPointLocation);
    var distanceText = "Distancia entre punto y polilinea : " + distance + " (mts)";
    // Valida si el punto se encuentra dentro de la georeferencia.
    var containLocation = GoogleMapsHelper.isContainsLocation(routePolyline, selectedPointLocation);
    var containLocationText = containLocation ? "Verdadero" : "Falso";
    // Obtener porcentaje de progreso en ruta.
    var currentProgressTripPercent = GoogleMapsHelper.progressInTrip(routePolyline, selectedPointLocation, 200);
    // Validar evento de retorno de ruta.
    var isReturnedRoute = DirectionsService.isReturnedRoute(currentProgressTripPercent);
    var isReturnedRouteText = isReturnedRoute ? "Verdadero" : "Falso";
    // Establecer progreso de ruta
    DirectionsService.progressTripPercent = currentProgressTripPercent;
    var progressInfoText = DirectionsService.progressTripPercent == null || DirectionsService.progressTripPercent == 0 ? "Evento de salida" : DirectionsService.progressTripPercent + "%";
    // Establecer distancia recorrida en ruta.
    var distanceInTrip = GoogleMapsHelper.distanceInTrip(routePolyline, selectedPointLocation, 200);
    var distanceInTripText = "Distancia Recorrida en Viaje : " + distanceInTrip + " (mts)";
    //Seleccionar time zone del punto seleccionado.
    var timeZone = GoogleMapsHelper.getTimeZone(selectedPointLocation);
    //Mostrar mensaje.
    document.getElementById('warnings-panel-content').innerHTML = distanceText + "</br>" +
        " Se encuentra el punto: " + containLocationText + "</br>" +
        " Porcentaje de viaje : " + progressInfoText + "</br>" +
        " Evento de retorno en ruta : " + isReturnedRouteText + "</br>" +
        distanceInTripText + "</br>" +
        " Zona horaria : " + timeZone;
}


/**
 * Mostrar informacion de instruccion del servicio de direcciones
 * 
 * @param {object} stepDisplay
 * @param {object} marker
 * @param {object} text
 * @param {object} map
 * @param {object} step
 * 
 * @returns {void}
 */
DirectionsService.attachInstructionText = function (stepDisplay, marker, text, map, step) {
    //Evento clic sobre el marcador.
    google.maps.event.addListener(marker, 'click', function () {
        // Abre un nuevo info box cuando se hace clic sobre el marker, 
        // el contenido del texto es la instruccion del servicio de direcciones
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
        var routeStepPath = '';
        for (var i = 0; i < step.path.length; i++) {
            var latitude = step.path[i].lat();
            var longitude = step.path[i].lng();
            var latitudeAndLongitude = "Latitud : " + latitude + " Longitud : " + longitude + "</br>";
            routeStepPath += latitudeAndLongitude;
        }
        document.getElementById('warnings-panel-content').innerHTML = routeStepPath;
    });
};

DirectionsService.isReturnedRoute = function (currentProgressTripPercent) {
    var isReturnedRoute = false;
    if (currentProgressTripPercent < DirectionsService.progressTripPercent) {
        isReturnedRoute = true;
    }
    return isReturnedRoute;
}

DirectionsService.saveRoute = function () {
    try {
        // Obtener valores para creacion de ruta.
        var routeNameValue = $("#txtRouteName").val();
        var routeLineString = DirectionsService.routeLineString;
        $.ajax({
            url: '/Home/SaveRoute',
            data: {
                routeName: routeNameValue,
                lineString: routeLineString
            },
            method: "POST",
            cache: false,
            success: function (result) {
                DirectionsService.saveRoute_onSucces(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                DirectionsService.saveRoute_onError(jqXHR, textStatus, errorThrown);
            }
        });
    } catch (e) {
        $.unblockUI();
    }
}

DirectionsService.saveRoute_onSucces = function (result) {
    if (result.errorMessage == null) {
        alert(result.resultMessage);
    }
    else {
        alert(result.errorMessage);
    }

};


DirectionsService.saveRoute_onError = function (jqXHR, textStatus, errorThrown) {
    alert(textStatus);
}

DirectionsService.btnSaveRoute_Clik = function (e) {
    $.blockUI();
    if (DirectionsService.routeLineString != '') {
        DirectionsService.saveRoute();
    }
    else {
        $.unblockUI();
    }
    e.preventDefault();
}