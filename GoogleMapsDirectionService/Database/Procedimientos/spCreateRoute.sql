IF OBJECT_ID (N'dbo.spCreateRoute') IS NOT NULL
   DROP PROCEDURE dbo.spCreateRoute
GO
-- ========================================================================================
-- Autor              : Harold Caicedo
-- Fecha Creación	  : 2016-03-29
-- Descripción        : Permite crear rutas.
--
-- ========================================================================================
CREATE PROCEDURE dbo.spCreateRoute
(
	@routeName VARCHAR(50),
	@routeLineString VARCHAR(MAX),
	@resultMessage VARCHAR(200) OUTPUT
)
AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	BEGIN TRY
		BEGIN TRANSACTION;
			IF EXISTS (SELECT RouteId FROM Route WHERE LTRIM(RTRIM(Name)) = LTRIM(RTRIM(@routeName)))
			BEGIN
				SELECT @resultMessage = 'El nombre de la ruta ya existe en el sistema, favor intentar con una distinta.';
				--print 'El nombre de la ruta ya existe en el sistema, favor intentar con una distinta.';
			END
			ELSE
			BEGIN
				-- Declaracion de variables.
				DECLARE @minRowId INT, @maxRowId INT, @routeDeparturePointValue VARCHAR(100), @routeArrivalPointValue VARCHAR(100),
						@departurePoint GEOGRAPHY, @arrivalPoint GEOGRAPHY, @departurePointId INT, @arrivalPointId INT, @routeId INT,
						@routeGeoInfo GEOGRAPHY, @partialRouteGeoInfo GEOGRAPHY;
				-- Depurar cadena de texto.
				set @routeLineString =  REPLACE(@routeLineString,'...','');
				set @routeLineString =  REPLACE(@routeLineString,'LINESTRING(','');
				set @routeLineString =  REPLACE(@routeLineString,')','');		
				
				DECLARE @polylineInfoTable TABLE
				(
					Row INT,
					Longitude VARCHAR(50),
					Latitude VARCHAR(50),
					Item VARCHAR(200)
				)
				INSERT INTO @polylineInfoTable
				SELECT CAST(ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS INT) AS Row, 
					dbo.fnGetFirstToken(Item, ' ') AS Longitude, dbo.fnGetLastToken(Item, ' ') AS Latitude, 
					Item 
				FROM dbo.fnSplitData(@routeLineString, DEFAULT)
				WHERE LEN(dbo.fnGetFirstToken(Item, ' ')) > 0 and LEN(dbo.fnGetLastToken(Item, ' ')) > 0;
				-- Obtener primer registro y ultimo registro de la lista de puntos de la polilinea
				SELECT @minRowId = MIN(Row), @maxRowId = MAX(Row)
				FROM @polylineInfoTable
				-- Obtener punto inicial del viaje
				SELECT @routeDeparturePointValue = Item
				FROM @polylineInfoTable
				WHERE Row = @minRowId
				-- Establecer valor de punto inicial
				EXEC spCreatePointLocation @pointName = 'I', @radius = 50, @pointValue = @routeDeparturePointValue, @pointId = @departurePointId OUTPUT; 
				-- Obtener punto final del viaje
				SELECT @routeArrivalPointValue = Item
				FROM @polylineInfoTable
				WHERE Row = @maxRowId
				-- Establecer valor de punto final
				EXEC spCreatePointLocation @pointName = 'F', @radius = 50, @pointValue = @routeArrivalPointValue, @pointId = @arrivalPointId OUTPUT; 
				-- Establecer valor geografico de la ruta.
				SET @routeGeoInfo = GEOGRAPHY::STLineFromText('LINESTRING(' + @routeLineString + ')', 4326);
				--SELECT @g, @g.ToString();
				-- Crear maestro de rutas
				INSERT INTO [dbo].[Route]
				(
					[Name],[GeoInfo],[GeoInfoText],[DeparturePointId],[ArrivalPointId]
				)
				VALUES
				(
					@routeName, @routeGeoInfo, @routeGeoInfo.ToString(), @departurePointId, @arrivalPointId
				)
				-- Obtener id de punto creado.
				SELECT @routeId = @@IDENTITY;
				-- Crear particiones de ruta.
				DECLARE @count INT = 1;
				WHILE @count < @maxRowId
				BEGIN
					-- Obtener punto inicial del viaje
					SELECT @routeDeparturePointValue = Item
					FROM @polylineInfoTable
					WHERE Row = @count
					-- Establecer valor de punto inicial
					EXEC spCreatePointLocation @pointName = 'MI', @radius = 50, @pointValue = @routeDeparturePointValue, @pointId = @departurePointId OUTPUT;
					-- Obtener punto final de particion de ruta
					SELECT @routeArrivalPointValue = Item
					FROM @polylineInfoTable
					WHERE Row = @count + 1
					-- Establecer valor de punto final
					EXEC spCreatePointLocation @pointName = 'MF', @radius = 50, @pointValue = @routeArrivalPointValue, @pointId = @arrivalPointId OUTPUT;
					-- Establecer valor geografico de la ruta.
					SET @partialRouteGeoInfo = GEOGRAPHY::STLineFromText('LINESTRING(' + @routeDeparturePointValue + ',' + @routeArrivalPointValue + ' )', 4326);
					-- Crear detalle de ruta
					INSERT INTO [dbo].[RouteDetail]
					(
						[Name],[GeoInfo],[GeoInfoText],[DeparturePointId],[ArrivalPointId],[RouteId], [Index], [Percent]
					)
					VALUES
					(
						@routeName, @partialRouteGeoInfo, @partialRouteGeoInfo.ToString(), @departurePointId, @arrivalPointId, @routeId, @count, (SELECT(CAST(@count AS float)/CAST(@maxRowId AS float) * 100))
					)
				   SET @count = @count + 1;
				END;
			END
		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		select @resultMessage = ' Error desconocido creando nueva ruta:  ' + CAST(ERROR_MESSAGE() AS VARCHAR(MAX)) + ' ' + 'En la linea : ' +  CAST(ERROR_LINE() AS varchar(MAX));
		--print ' Error desconocido creando nueva ruta:  ' + CAST(ERROR_MESSAGE() AS VARCHAR(MAX)) + ' ' + 'En la linea : ' +  CAST(ERROR_LINE() AS varchar(MAX));
	END CATCH;		   
END