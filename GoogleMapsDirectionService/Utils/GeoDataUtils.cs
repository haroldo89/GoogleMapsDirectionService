using AlbatrosSoft.Common;
using GoogleMapsDirectionService.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;

namespace GoogleMapsDirectionService.Utils
{
    public static class GeoDataUtils
    {
        /// <summary>
        /// Obtiene el conjunto de puntos que forman una linea que representa una vía.
        /// </summary>
        /// <param name = "geoText" > Texto geográfico que representa la vía(LINESTRING).</param>
        /// <returns>Conjunto de puntos o vertices que forman la vía.</returns>
        public static IEnumerable<LocationPointInfo> GetRoutePoints(string geoText)
        {
            NumberStyles numberStyle = NumberStyles.Any;
            List<LocationPointInfo> routePoints = null;
            const string POINT_SEPARATOR = ",";
            const string COORDINATE_SEPARATOR = " ";
            if (!string.IsNullOrEmpty(geoText))
            {
                //Obtener texto con las coordenadas de los puntos
                var pointsText = StringUtils.GetStringInBetween("(", ")", geoText);
                var points = pointsText.Split(new char[] { Convert.ToChar(POINT_SEPARATOR, CultureInfo.InvariantCulture) }, StringSplitOptions.RemoveEmptyEntries);
                if (points.Any())
                {
                    //Obtener los puntos de la vía.
                    routePoints = new List<LocationPointInfo>();
                    foreach (var pointInfo in points)
                    {
                        //Obtener coordenadas del punto
                        var pointCoordinates = pointInfo.Split(new char[] { Convert.ToChar(COORDINATE_SEPARATOR, CultureInfo.InvariantCulture) }, StringSplitOptions.RemoveEmptyEntries);
                        if (pointCoordinates.Any())
                        {
                            //Construir punto
                            double latitude = 0, longitude = 0;
                            var longitudeResult = double.TryParse(pointCoordinates.FirstOrDefault(), numberStyle, CultureInfo.InvariantCulture, out longitude);
                            var latitudeResult = double.TryParse(pointCoordinates.LastOrDefault(), numberStyle, CultureInfo.InvariantCulture, out latitude);
                            if (latitudeResult && longitudeResult)
                            {
                                LocationPointInfo pointLocation = new LocationPointInfo(longitude, latitude);
                                if (pointLocation != null)
                                {
                                    //Agregar punto a la vía.
                                    routePoints.Add(pointLocation);
                                }
                            }
                        }
                    }
                }
            }
            return routePoints;
        }

        /// <summary>
        /// Permite obtener la definición de una polilinea de geocerca en formato de texto geográfico de SQL
        /// Server Spatial Data a partir de los vertices que la forman.
        /// </summary>
        /// <param name = "polygonPoints" > Conjunto de vértices que forman el polígono de la geocerca.</param>
        /// <returns>Texto geográfico que representa a la geocerca.</returns>
        public static string ToPolylineGeoText(IEnumerable<LocationPointInfo> polylinePoints)
        {
            string geoText = string.Empty;
            const string POINT_SEPARATOR = ",";
            if (polylinePoints != null && polylinePoints.Any())
            {
                StringBuilder sbGeoText = new StringBuilder();
                foreach (LocationPointInfo point in polylinePoints)
                {
                    sbGeoText.AppendFormat("{0} {1}{2} ", point.Longitude.ToString("G", CultureInfo.InvariantCulture), point.Latitude.ToString("G", CultureInfo.InvariantCulture), POINT_SEPARATOR);
                }
                geoText = string.Format(CultureInfo.InvariantCulture, "LINESTRING({0})", sbGeoText.ToString());
                geoText = geoText.Replace(", )", ")");
            }
            return geoText;
        }
    }
}