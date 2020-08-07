
/** Implementa funciones varias para la manipulacion de objetos de google maps. */
function GoogleMapsHelper() { }

/**
 * Obtener valor en radianes de un flotante.
 * 
 * @param {float} x Valor a convertir en radianes.
 * 
 * @returns {float} Intancia de mapa de google.
 */
GoogleMapsHelper.Rad = function (x) {
    return x * Math.PI / 180;
};


/**
 * Obtener distancia entro dos puntos.
 * 
 * @param {object} firstPoint Primer punto.
 * @param {object} secondPoint Segundo punto.
 * 
 * @returns {void} 
 */
GoogleMapsHelper.GetDistanceBetweenPoint = function (firstPoint, secondPoint) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = GoogleMapsHelper.Rad(secondPoint.lat() - firstPoint.lat());
    var dLong = GoogleMapsHelper.Rad(secondPoint.lng() - firstPoint.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(GoogleMapsHelper.Rad(firstPoint.lat()))
        * Math.cos(GoogleMapsHelper.Rad(secondPoint.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};


/**
 * Inicializar mapa.
 * 
 * @param {object} container Contenedor para inicializar el mapa.
 * @param {object} options opciones asociadas la inicializacion del mapa.
 * 
 * @returns {object} Intancia de mapa de google.
 */
GoogleMapsHelper.initializeMap = function (container, options) {
    var map = new google.maps.Map(container, options);
    return map;
};


/**
 * Crear locacion.
 * 
 * @constructor
 * @param {float} latitude Latitude.
 * @param {float} longitude Longitud.
 * 
 * @returns {object} Retorna un punto.
 */
GoogleMapsHelper.pointLocation = function (latitude, longitude) {
    var location = { lat: latitude, lng: longitude };
    return location;
};

//

/**
 * Creacion de objet marker.
 *
 * @param {object} options opciones asociadas a la creacion de un marker para google maps.
 * 
 * @returns {object} Marker
 */
GoogleMapsHelper.createMarker = function (options) {
    var marker = new google.maps.Marker;
    if (options) {
        marker = new google.maps.Marker(options);
    }
    return marker;
};


/**
 * Creacion de objet Polyline.
 *
 * @param {object} options opciones asociadas a la creacion de una polilinea para google maps.
 * 
 * @returns {object} Polyline
 */
GoogleMapsHelper.createPolyline = function (options) {
    var polyline = new google.maps.Polyline(options);
    return polyline;
};

GoogleMapsHelper.createCircle = function (options) {
    //var optionsCircle = {
    //    strokeColor: '#FF0000',
    //    strokeOpacity: 0.8,
    //    strokeWeight: 2,
    //    fillColor: '#FF0000',
    //    fillOpacity: 0.35,
    //    map: map,
    //    center: citymap[city].center,
    //    radius: Math.sqrt(citymap[city].population) * 100
    //};
    var circle = new google.maps.Circle(options);
    return circle;
}

/**
 * Creacion de ventana de informacion en el mapa de google maps
 * 
 * @param {object} options Opciones asociadas a la creacoin de una ventana de informacion para google maps
 * 
 * @returns {object} InfoWindow
 */
GoogleMapsHelper.createInfoWindow = function (options) {
    var infoWindow = new google.maps.InfoWindow;
    if (options) {
        infoWindow = new google.maps.InfoWindow(options);
    }
    return infoWindow;
}

/**
 * Creacion de servicio de direccion de google maps.
 * 
 * @return {object} DirectionService
 */

GoogleMapsHelper.createDirectionService = function () {
    var directionService = new google.maps.DirectionsService;
    return directionService;
}

/**
 * Creacion del servicio de renderizacion de direcciones de google maps
 * 
 * @param {object} options Opciones asociadas a la creacion del servicio de renderizacion de direcciones de google maps.
 * 
 * @returns {object} DirectionsRenderer
 */
GoogleMapsHelper.createDirectionsRenderer = function (options) {
    var directionRenderer = new google.maps.DirectionsRenderer(options);
    return directionRenderer;
}


/**
 * Objeto a hacer zoom.
 *
 * @param {object} map mapa seleccionado.
 * @param {object} obj objeto de tipo poligono o polilinea.
 * 
 * @returns {void}
 */
GoogleMapsHelper.zoomToObject = function (map, obj) {
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length ; n++) {
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}

/**
 * Permite validar si un punto se encuentra cerca de la georeferencia seleccionado a una distancia 
 * especificada
 * 
 * @param {object} pointLocation Punto seleccionado
 * @param {object} geoReference Georeferencia seleccionada (Poligono o Polilinea).
 * @param {float} distance Distancia a la cual hacer validacion.
 *
 * @returns {bool} 
 */
GoogleMapsHelper.isLocationOnEdge = function (pointLocation, geoReference, distance) {
    var isLocationNear = google.maps.geometry.poly.isLocationOnEdge(pointLocation, geoReference, distance);
    return isLocationNear;
}

/**
 * Permite validar si un punto se encuentra dentro de la georeferencia seleccionado 
 *  
 * @param {object} pointLocation Punto seleccionado
 * @param {object} geoReference Georeferencia seleccionada (Poligono o Polilinea).
 * @param {float} distance Distancia a la cual hacer validacion.
 *
 * @returns {bool} 
 */
GoogleMapsHelper.containsLocation = function (pointLocation, geoReference) {
    var containsLocation = google.maps.geometry.poly.containsLocation(pointLocation, geoReference);
    return containsLocation;
}

/**
 * Obtener distancia entre punto y polilinea.
 * 
 * @param {object} geoReference Georeferencia seleccionada (Poligono o Polilinea).
 * @param {object} pointLocation Punto seleccionado
 *
 * @returns {int}  distancia en metros de un punto y una polilinea.
 */
GoogleMapsHelper.GetDistanceBetweenPolylineAndPoint = function (geoReference, pointLocation) {
    return Math.round(GeoUtilsDistanceToPolyMtrs(geoReference, pointLocation));
};

/**
 * Permite validar si un punto se encuentra cerca de la georeferencia seleccionado a una distancia 
 * especificada
 * 
 * @param {object} pointLocation Punto seleccionado
 * @param {object} geoReference Georeferencia seleccionada (Poligono o Polilinea).
 * @param {float} distance Distancia a la cual hacer validacion.
 *
 * @returns {bool} 
 */
GoogleMapsHelper.isNearestPointLocationToPolyline = function (geoReference, pointLocation, distance) {
    var isNearest = false;
    var distanceToObject = GoogleMapsHelper.GetDistanceBetweenPolylineAndPoint(geoReference, pointLocation);
    if (distanceToObject != null && distanceToObject <= distance) {
        isNearest = true;
    }
    return isNearest;
};

/**
 * Permite valirdar si un punto se encuentra especifico se encuentra dentro de la georeferencia seleccionada
 * 
 * @param {object} geoReference Georeferencia seleccionada (Poligono, Polilinea).
 * @param {object} pointLocation Punto seleccionado.
 * 
 * return {bool}
 */
GoogleMapsHelper.isContainsLocation = function (geoReference, pointLocation) {
    var isContainLocation = false;
    var distanceToObject = GoogleMapsHelper.GetDistanceBetweenPolylineAndPoint(geoReference, pointLocation);
    if (distanceToObject != null && distanceToObject == 0) {
        isContainLocation = true;
    }
    return isContainLocation;
};

/**
 * Obtener porcentaje en viaje.
 * @param {object} geoReference Georeferencia seleccionada (Polilinea).
 * @param {object} pointLocation Punto seleccionado.
 * 
 * @returns {int} porcentaje de viaje.
 */
GoogleMapsHelper.progressInTrip = function (geoReference, pointLocation, distance) {
    var progressTripInfo = null;
    // Validar que se encuentra cerca a un punto de la polillinea.
    if (GoogleMapsHelper.isNearestPointLocationToPolyline(geoReference, pointLocation, distance)) {
        progressTripInfo = Math.round(GeoUtilsDistanceInTripPercent(geoReference, pointLocation));
    }
    return progressTripInfo;
};


/**
 * Obtener distancia recorrida en viaje.
 * 
 * @param {object} geoReference Georeferencia seleccionada (Polilinea).
 * @param {object} pointLocation Punto seleccionado.
 * 
 * @returns {int} Distancia recorrida en viaje.
 */
GoogleMapsHelper.distanceInTrip = function (geoReference, pointLocation, distance) {
    var distanceInTrip = null;
    // Validar que se encuentra cerca a un punto de la polillinea.
    if (GoogleMapsHelper.isNearestPointLocationToPolyline(geoReference, pointLocation, distance)) {
        distanceInTrip = Math.round(GeoUtilsDistanceInTrip(geoReference, pointLocation));
    }
    return distanceInTrip;
}

GoogleMapsHelper.geolocate = function (options) {
    var geolocateInfo = null;
    if (options) {
        // Url para realizar request.
        var urlRequest = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyALkZJIHgyhQHkSj_tFsqby8M6V_XWk0sI"
        $.ajax({
            url: urlRequest,
            data: JSON.stringify(options),
            method: "POST",
            cache: false,
            contentType: "application/json",
            async: false
        }).done(function (response) {
            if (response != null) {
                geolocateInfo = response;
            }
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
    return geolocateInfo;
}

GoogleMapsHelper.getTimeZone = function (pointLocation) {
    var timeZone = "-5:00";
    // Url para realizar request.
    var urlRequest = "https://maps.googleapis.com/maps/api/timezone/json?location=" + pointLocation.lat() + "," + pointLocation.lng() + "&timestamp=" + (Math.round((new Date().getTime()) / 1000)).toString() + "&key=AIzaSyALkZJIHgyhQHkSj_tFsqby8M6V_XWk0sI";
    $.ajax({
        url: urlRequest,
        async: false
    }).done(function (response) {
        if (response.timeZoneId != null) {
            var selectedRawOffSet = (response.rawOffset) / 60
            timeZone = GoogleMapsHelper.getSelectedTimeZone(selectedRawOffSet);
        }
    });
    return timeZone;
}


GoogleMapsHelper.getTimeZonesOfTheWorld = function () {
    var timeZones = [["-720", "-12:00"], ["-660", "-11:00"], ["-600", "-10:00"], ["-540", "-9:00"], ["-480", "-8:00"], ["-420", "-7:00"],
	    ["-360", "-6:00"], ["-300", "-5:00"], ["-240", "-4:00"], ["-210", "-3:30"], ["-180", "-3:00"], ["-120", "-2:00"], ["-60", "-1:00"],
	    ["0", "0:00"], ["60", "+1:00"], ["120", "+2:00"], ["180", "+3:00"], ["210", "+3:30"], ["240", "+4:00"], ["270", "+4:30"],
	    ["300", "+5:00"], ["330", "+5:30"], ["360", "+6:00"], ["420", "+7:00"], ["480", "+8:00"], ["540", "+9:00"], ["570", "+9:30"],
	    ["600", "+10:00"], ["660", "+11:00"], ["720", "+12:00"]];
    return timeZones;
}

GoogleMapsHelper.getSelectedTimeZone = function (selectedRawOffSet) {
    var datasource = GoogleMapsHelper.getTimeZonesOfTheWorld();
    for (var i = 0; i < datasource.length; i++) {
        var timeZone = datasource[i];
        if (selectedRawOffSet == timeZone[0]) {
            return timeZone[1];
        }
    }
    return null;
}


//GoogleMapsHelper.progressInTrip = function (geoReference, pointLocation, distance) {
//    var progressTripInfo = null;
//    if (GoogleMapsHelper.isNearestPointLocationToPolyline(geoReference, pointLocation, distance)) {
//        var totalLength = google.maps.geometry.spherical.computeLength(geoReference.getPath());
//        var currentRouteLength = 0;
//        var currentRoutePolyline = GoogleMapsHelper.createPolyline({ path: [] });
//        currentRoutePolyline.getPath().push(DirectionsService.startLocationMarker.getPosition());
//        for (var i = 0; i < (geoReference.getPath().getLength() - 1) ; i++) {
//            currentRoutePolyline.getPath().push(geoReference.getPath().getAt(i));
//            currentRoutePolyline.getPath().push(geoReference.getPath().getAt(i + 1));
//            // Validar que se encuentra cerca a un punto de la polillinea.
//            var distancePolyline = geoReference.getPath().getAt(i).distanceFrom(pointLocation);
//            if (distancePolyline < 20) {
//                currentRouteLength = google.maps.geometry.spherical.computeLength(currentRoutePolyline.getPath());
//                break;
//            }
//        }
//        progressTripInfo = (currentRouteLength / totalLength) * 100;
//    }
//    return progressTripInfo;
//};
