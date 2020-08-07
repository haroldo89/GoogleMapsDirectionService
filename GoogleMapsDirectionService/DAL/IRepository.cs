using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMapsDirectionService.DAL
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();

        string TryAdd(T entity);

        string TryDelete(int entityId);

        string TryUpdate(T entity);
    }
}