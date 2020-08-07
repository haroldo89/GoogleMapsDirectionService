using GoogleMapsDirectionService.DAL;
using GoogleMapsDirectionService.Models;
using GoogleMapsDirectionService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace GoogleMapsDirectionService.Controllers
{
    public class RouteController : Controller
    {
        RouteRepository RouteRepository;

        //
        // GET: /Route/

        public RouteController()
        {
            this.RouteRepository = new RouteRepository(new DataContext());
        }
        public ActionResult Index()
        {
            return View();
        }


        #region Metodos jTable
        /// <summary>
        /// Obtener rutas.
        /// </summary>
        /// <param name="name">Nombre de rutas</param>
        /// <param name="jtStartIndex"></param>
        /// <param name="jtPageSize"></param>
        /// <param name="jtSorting"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetRoutes(string name = "", int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            ActionResult result = null;
            try
            {
                //Lista de rutas con filtro
                var routes = this.RouteRepository.GetRoutes(name, jtStartIndex, jtPageSize, jtSorting);
                //Conteo de rutas con filtros
                var routesCount = this.RouteRepository.GetRoutesCount(name);
                //Resultado para control de jtable.
                result = Json(new { Result = "OK", Records = routes.ToList(), TotalRecordCount = routesCount }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result = Json(new { Result = "ERROR", Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            return result;
        }

        /// <summary>
        /// Crear nuevo rutas.
        /// </summary>
        /// <param name="route">Informacion de usuario</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Createroute(ViewRoute route)
        {
            ActionResult result = null;
            string resultMessage = string.Empty;
            try
            {
                if (!this.ModelState.IsValid)
                {
                    throw new Exception("Form is not valid! Please correct it and try again.");
                }
                resultMessage = this.RouteRepository.TryAdd(route);
                if (string.IsNullOrEmpty(resultMessage))
                {
                    result = this.Json(new { Result = "OK", Record = route }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    result = this.Json(new { Result = "ERROR", Message = resultMessage }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                result = this.Json(new { Result = "ERROR", Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            return result;
        }

        /// <summary>
        /// Actualizar rutas
        /// </summary>
        /// <param name="route">Informacion de rutas</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Updateroute(ViewRoute route)
        {
            ActionResult result = null;
            string resultMessage = string.Empty;
            try
            {
                if (!this.ModelState.IsValid)
                {
                    throw new Exception("Form is not valid! Please correct it and try again.");
                }
                resultMessage = this.RouteRepository.TryUpdate(route);
                if (string.IsNullOrEmpty(resultMessage))
                {
                    result = Json(new { Result = "OK" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    result = Json(new { Result = "ERROR", Message = resultMessage }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                result = Json(new { Result = "ERROR", Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            return result;
        }

        /// <summary>
        /// Eliminar usuario
        /// </summary>
        /// <param name="routeId">Id de usuario</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult DeleteRoute(int routeId)
        {
            ActionResult result = null;
            string resultMessage = string.Empty;
            try
            {
                resultMessage = this.RouteRepository.TryDelete(routeId);
                if (string.IsNullOrEmpty(resultMessage))
                {
                    result = this.Json(new { Result = "OK" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    result = this.Json(new { Result = "ERROR", Message = resultMessage }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                result = this.Json(new { Result = "ERROR", Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            return result;
        }
        #endregion Metodos jTable

        /// <summary>
        /// Obtener informacion asociada a una ruta seleccionada.
        /// </summary>
        /// <param name="routeId"></param>
        /// <returns></returns>
        public ActionResult GetRouteInfo(int routeId)
        {
            ActionResult result = null;
            try
            {
                var routeInfo = this.RouteRepository.GetById(routeId);
                if (routeInfo == null)
                {
                    throw new ApplicationException("No existe informacion de la ruta seleccionada");
                }
                IEnumerable<LocationPointInfo> routePoints = this.GetLocationPointInfosFromRoute(routeInfo.GeoInfoText);
                result = this.Json(new { routeInfo = routeInfo, routePoints = routePoints.ToList() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exc)
            {
                result = this.Json(new { errorMessage = string.Format("{0} - {1}", exc.Message, exc.InnerException) }, JsonRequestBehavior.AllowGet);
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
