using AlbatrosSoft.Common;
using GoogleMapsDirectionService.DAL;
using GoogleMapsDirectionService.Models;
using GoogleMapsDirectionService.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace GoogleMapsDirectionService.Controllers
{
    public class HomeController : Controller
    {
        RouteRepository RouteRepository;

        public HomeController()
        {
            this.RouteRepository = new RouteRepository(new DataContext());
        }

        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// Guardar ruta en base de datos.
        /// </summary>
        /// <param name="routeName">Nombre de la ruta a crear</param>
        /// <param name="lineString"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveRoute(string routeName = "", string lineString = "")
        {
            ActionResult result = null;
            string resultMessage = string.Empty;
            try
            {
                if (string.IsNullOrWhiteSpace(routeName))
                {
                    throw new ArgumentNullException("routeName", "El valor del nombre de la polilinea no puede ser un valor nulo o vacio.");
                }
                if (string.IsNullOrWhiteSpace(lineString))
                {
                    throw new ArgumentNullException("lineString", "El valor de la polilinea no puede ser un valor nulo o vacio.");
                }
                // Ejecucion de procedimiento almacenado.
                resultMessage = this.RouteRepository.TryAdd(routeName, lineString);
                if (string.IsNullOrWhiteSpace(resultMessage))
                {
                    result = this.Json(new { resultMessage = "La polilinea fue agregada satisfactoriamente" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new ApplicationException(resultMessage);
                }
            }
            catch (Exception exc)
            {
                result = this.Json(new { errorMessage = exc.Message }, JsonRequestBehavior.AllowGet);
            }
            return result;
        }

        /// <summary>
        /// Obtener puntos de ruta.
        /// </summary>
        /// <param name="lineString"></param>
        /// <returns></returns>
        private IEnumerable<LocationPointInfo> GetLocationPointInfosFromRoute(string lineString)
        {
            IEnumerable<LocationPointInfo> routePoints = Enumerable.Empty<LocationPointInfo>();
            routePoints = GeoDataUtils.GetRoutePoints(lineString);
            return routePoints;
        }
    }
}
