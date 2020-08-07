
namespace GoogleMapsDirectionService.Models
{
    /// <summary>
    /// Representacion de un punto en el mapa.
    /// </summary>
    public class LocationPointInfo
    {
        /// <summary>
        /// Latitud
        /// </summary>
        public double Latitude { get; set; }

        /// <summary>
        /// Longitud
        /// </summary>
        public double Longitude { get; set; }

        /// <summary>
        /// Constructor que instancia un nuevo objeto de LocationPointInfo
        /// </summary>
        public LocationPointInfo()
        {

        }

        /// <summary>
        /// Constructor que recibe latitud y longitud para crear un nuevo 
        /// objeto de LocationPointInfo
        /// </summary>
        /// <param name="latitude">Latitud</param>
        /// <param name="longitude">Longitud</param>
        public LocationPointInfo(double longitude, double latitude)
        {
            this.Latitude = latitude;
            this.Longitude = longitude;
        }
    }
}