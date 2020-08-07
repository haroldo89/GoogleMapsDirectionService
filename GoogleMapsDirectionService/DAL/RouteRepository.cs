using AlbatrosSoft.Common;
using AlbatrosSoft.Common.Web;
using GoogleMapsDirectionService.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace GoogleMapsDirectionService.DAL
{
    public class RouteRepository : IRepository<ViewRoute>
    {
        /// <summary>
        /// Elemento no seleccionado
        /// </summary>
        private const int UNSELECTED_ITEM_VALUE = 0;

        /// <summary>
        /// Cadena de conexion a la base de datos.
        /// </summary>
        public string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["ProtektoTestDb"].ConnectionString;
            }
        }

        DataContext DataContext;

        public RouteRepository(DataContext dataContext)
        {
            this.DataContext = dataContext;
        }

        public IEnumerable<ViewRoute> GetAll()
        {
            return this.DataContext.spGetRoutes().ToList();
        }

        public ViewRoute GetById(int id)
        {
            return this.GetAll().FirstOrDefault(r => r.RouteId.Equals(id));
        }

        public string TryAdd(ViewRoute entity)
        {
            throw new NotImplementedException();
        }

        public string TryAdd(string routeName, string routeLineString)
        {
            string resultMessage = string.Empty;
            try
            {
                SqlConnection conection = new SqlConnection(this.ConnectionString);
                SqlCommand command = new SqlCommand();
                //Int32 rowsAffected;
                command.CommandText = "spCreateRoute";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@routeName", routeName);
                command.Parameters.AddWithValue("@routeLineString", routeLineString);
                command.Connection = conection;
                command.CommandTimeout = 0;
                command.Parameters.Add("@resultMessage", SqlDbType.VarChar, int.MaxValue).Direction = ParameterDirection.Output;
                conection.Open();
                command.ExecuteNonQuery();
                conection.Close();
                resultMessage = Convert.ToString(command.Parameters["@resultMessage"].Value);
            }
            catch (Exception exc)
            {
                resultMessage = string.Format("{0} - {1}", exc.InnerException.ToString(), exc.Message);

            }
            return resultMessage;
        }

        public string TryDelete(int entityId)
        {
            throw new NotImplementedException();
        }

        public string TryUpdate(ViewRoute entity)
        {
            throw new NotImplementedException();
        }


        #region Metodos jTable
        /// <summary>
        /// Obtener datos
        /// </summary>
        /// <param name="name">Nombre</param>
        /// <param name="description">Descripcion</param>
        /// <param name="startIndex">Indice inicial</param>
        /// <param name="count">total de registros</param>
        /// <param name="sorting">ordenamiento</param>
        /// <returns></returns>
        public IEnumerable<ViewRoute> GetRoutes(string name, int startIndex, int count, string sorting)
        {
            var routes = this.GetAll();
            //Filters
            routes = this.SearchInfo(routes, name);
            //Sorting
            routes = this.Sorting(sorting, routes);
            return count > 0
                       ? routes.Skip(startIndex).Take(count).ToList() //Paging
                       : routes.ToList(); //No paging
        }

        /// <summary>
        /// Obtener conteo de los datos busquedas
        /// </summary>
        /// <param name="name">Nombre de usuario</param>
        /// <returns></returns>
        public int GetRoutesCount(string name)
        {
            var Routes = this.GetAll();
            //Filters
            Routes = this.SearchInfo(Routes, name);
            //Conteo
            return Routes.Count();
        }

        #endregion Metodos jTable

        #region Busqueda y ordenamiento
        private IEnumerable<ViewRoute> SearchInfo(IEnumerable<ViewRoute> routes, string name)
        {
            var dataSource = routes;
            IEnumerable<ViewRoute> searchResult = null;
            Func<ViewRoute, bool> filterCriteria = p => true;
            var filterHelper = new FilterHelper<ViewRoute>();
            //Nombre
            if (!string.IsNullOrEmpty(name))
            {
                filterCriteria = filterHelper.AddFilterExpression(filterCriteria, p => p.Name.ToUpper(CultureInfo.InvariantCulture)
                    .Contains(name.ToUpper(CultureInfo.InvariantCulture)));
            }
            if (filterCriteria != null)
            {
                searchResult = dataSource.Where(filterCriteria);
                return searchResult;
            }
            return dataSource;
        }

        /// <summary>
        /// Ordenamiento
        /// </summary>
        /// <param name="sortExpression">Tipo de ordenamiento</param>
        /// <param name="routes">Lista a ordenar</param>
        /// <returns></returns>      
        private IEnumerable<ViewRoute> Sorting(string sortExpression, IEnumerable<ViewRoute> routes)
        {
            if (!string.IsNullOrEmpty(sortExpression))
            {
                string[] sortProperties = sortExpression.Split(' ');
                string sortColumn = sortProperties[0];
                string sortDirection = sortProperties[1];
                IEnumerable<ViewRoute> sortedData = null;
                if (routes != null)
                {
                    sortedData = SortingHelper<ViewRoute>.SortBy(routes, sortColumn, sortDirection);
                }
                return sortedData;
            }
            return routes;
        }

        #endregion Busqueda y ordenamiento
    }
}