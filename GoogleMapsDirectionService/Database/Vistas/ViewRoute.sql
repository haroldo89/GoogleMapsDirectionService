IF OBJECT_ID (N'dbo.ViewRoute') IS NOT NULL
   DROP VIEW dbo.ViewRoute
GO
-- ========================================================================================
-- Autor              : Harold Caicedo
-- Fecha Modificación : 2016-03-30
-- Descripción        : Lista las rutas del sistema.
--
-- ========================================================================================
CREATE VIEW dbo.ViewRoute
AS
	SELECT RouteId, Name, GeoInfoText, GETUTCDATE() AS TimeStamp FROM Route
GO