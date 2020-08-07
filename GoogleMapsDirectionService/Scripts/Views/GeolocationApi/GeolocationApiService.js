/**
 * Servicio de direcciones y calculo en porcentaje de ruta.
 */
function GeolocationApiService() { }
GeolocationApiService.map = null;
/**
 * Marcador de punto inicial
 */
GeolocationApiService.geoLocationMarker = null;
/**
 * Marcador de punto final
 */
GeolocationApiService.endLocationMarker = null;
/**
 * Marcador de punto cercano
 */
GeolocationApiService.nearestLocationMarker = null;
GeolocationApiService.getPointsLocationsData = function () {
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
GeolocationApiService.clearMapControls = function () {
    GeolocationApiService.initMap();
    return false;
}
GeolocationApiService.initializeComponents = function () {
    // Inicializar mapa.
    GeolocationApiService.initMap();
    // Evento de boton de limpiar mapa
    $("#btnSearch").click(GeolocationApiService.searchLocation);
    // Evento de buscar geolocalizacion con servicio de googleMaps.
    $("#btnClearMap").click(GeolocationApiService.clearMapControls);
    $("#ulHeaderMenu > li").removeClass("active");
    $("#lnkGeolocationApi").addClass("active");
}
/**
 * Inicializar mapa
 */
GeolocationApiService.initMap = function () {
    // Opciones de mapa.
    var mapOptions = {
        zoom: 5,
        center: { lat: 4.6750, lng: -75.4300 },
        scaleControl: true
    }
    // Contenedor del mapa
    var containerMap = document.getElementById('map');
    // Crear mapa.
    GeolocationApiService.map = GoogleMapsHelper.initializeMap(containerMap, mapOptions);
}
GeolocationApiService.searchLocation = function () {
    var cellIdValue = $("#txtCellId").val();
    var locationAreaCodeValue = $("#txtLAC").val();
    if ((cellIdValue != null && cellIdValue != '') && (locationAreaCodeValue != null && locationAreaCodeValue != '')) {
        var cellId = parseInt(cellIdValue, 16);
        var locationAreaCode = parseInt(locationAreaCodeValue, 16);
        console.log("Cell Id : " + cellId);
        console.log("LAC : " + locationAreaCode);
        // Opciones de localizacion para el servicio de google.
        var geoLocationOptions = {
            //"homeMobileCountryCode": 732,
            //"homeMobileNetworkCode": 101,
            "radioType": "gsm",
            //"carrier": "Movistar",
            "cellTowers": [
             {
                 //"cellId": 39627456,
                 "cellId": cellId,
                 "locationAreaCode": locationAreaCode,
                 "mobileCountryCode": 732,
                 "mobileNetworkCode": 101,
                 "age": 0,
                 "signalStrength": -95
             }
            ]
        }
        // Pasar a formato json las opciones.
        var geoLocationOptionInJson = JSON.stringify(geoLocationOptions);
        // Respuesta del servicio de geolocation
        var geoLocate = GoogleMapsHelper.geolocate(geoLocationOptions);
        // Respuesta del servicio de geolocalizacion es diferente de null.
        if (geoLocate != null) {
            // Ubicacion del servicio de geolocalizacion.
            var geoLocation = GoogleMapsHelper.pointLocation(geoLocate.location.lat, geoLocate.location.lng);
            // Radio para servicio de geolocalizacion.
            var radiusLocation = geoLocate.accuracy
            // Construir mensaje.
            var resultMessage = "Cell Id : " + cellId + "</br>" +
                                "LAC : " + locationAreaCode + "</br>" +
                                "Latitude : " + geoLocation.lat + "</br>" +
                                "Longitude : " + geoLocation.lng + "</br>" +
                                "Radio(Acuracy) : " + radiusLocation;
            $("#warnings-panel-content").html(resultMessage);
            //document.getElementById('warnings-panel-content').innerHTML = resultMessage;
            // Opciones de circulo en el mapa.
            var circleOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: GeolocationApiService.map,
                center: geoLocation,
                radius: radiusLocation
            };
            // Dibujar circulo en el maps
            var geoFence = GoogleMapsHelper.createCircle(circleOptions);
            //Opciones para marcador en el mapa
            var geoMarkerOptions = {
                position: geoLocation,
                map: GeolocationApiService.map,
                title: radiusLocation,
                draggable: true
            };
            google.maps.event.addListener(geoFence, 'mouseover', function () {
                var messageTitle = radiusLocation + ' mts';
                this.getMap().getDiv().setAttribute('title', messageTitle);
            });
            google.maps.event.addListener(geoFence, 'mouseout', function () {
                this.getMap().getDiv().removeAttribute('title');
            });
            //Crear marker
            GeolocationApiService.geoLocationMarker = GoogleMapsHelper.createMarker(geoMarkerOptions);
            // Centrar mapa.
            GeolocationApiService.map.setZoom(15);
            GeolocationApiService.map.setCenter(geoLocation);
        }
    }
}