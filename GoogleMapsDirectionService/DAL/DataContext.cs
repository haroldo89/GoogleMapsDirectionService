using GoogleMapsDirectionService.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Web;

namespace GoogleMapsDirectionService.DAL
{
    public class DataContext : DbContext
    {
        public DataContext()
            : base("name=ProtektoTestEntities")
        {

        }

        private ProtektoTestEntities _ProtektoDataContext;

        public ProtektoTestEntities ProtektoDataContext
        {
            get
            {
                this._ProtektoDataContext = new ProtektoTestEntities();
                return this._ProtektoDataContext;
            }
        }

        public DbSet<ViewRoute> ViewRoute { get; set; }

        #region ViewRoute

        public IEnumerable<ViewRoute> spGetRoutes()
        {
            return this.ProtektoDataContext.spGetRoutes();
        }

        #endregion
    }


}


