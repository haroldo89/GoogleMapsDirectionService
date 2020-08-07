IF OBJECT_ID (N'dbo.spGetRoutes') IS NOT NULL
   DROP PROCEDURE dbo.spGetRoutes
GO
-- ========================================================================================
-- Autor              : Harold Caicedo
-- Fecha Creación     : 2016-02-27
-- Descripción        : Permite obtener los datos de rutas.
--
-- ========================================================================================
CREATE PROCEDURE dbo.spGetRoutes

AS
BEGIN
	SET NOCOUNT ON;
    --Selecciona informacion de rutas.
	SELECT * FROM ViewRoute
END