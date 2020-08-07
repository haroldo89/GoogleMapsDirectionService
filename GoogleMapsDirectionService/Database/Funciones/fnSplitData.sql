IF OBJECT_ID (N'dbo.fnSplitData') IS NOT NULL
	DROP FUNCTION dbo.fnSplitData
GO
-- ========================================================================================
-- Autor        : Harold Caicedo
-- Descripción  : Divide una cadena de entrada en múltiples elementos que están
--                separados por una subcadena o carácter en específico.
--
-- Parámetros   : @inputString - Cadena de Entrada con los elementos delimitados.
--                @delimiter - Delimitador que separa los elementos.
--
-- Retorno      : @elementList - Lista de elementos separados.
-- ========================================================================================
CREATE FUNCTION dbo.fnSplitData
(
    @inputString VARCHAR(MAX),
    @delimiter VARCHAR(MAX) = ','
)
RETURNS @elementList TABLE (item VARCHAR(MAX))    
BEGIN
	DECLARE @item VARCHAR(MAX);
	WHILE CHARINDEX(@delimiter,@inputString,0) <> 0
	BEGIN
    	SET @item = RTRIM(LTRIM(SUBSTRING(@inputString,1, CHARINDEX(@delimiter, @inputString, 0) - 1)));
    	SET @inputString = RTRIM(LTRIM(SUBSTRING(@inputString, CHARINDEX(@delimiter, @inputString, 0) + LEN(@delimiter), LEN(@inputString))));
    	--Si se obtuvo un nuevo item, se agrega a la lista de elementos retornados.
    	IF LEN(@item) > 0
		BEGIN
			INSERT INTO @elementList SELECT @item;
		END
	END
	--Agregar el ultimo elemento a la lista
	IF LEN(@inputString) > 0
		INSERT INTO @elementList SELECT @inputString;
	RETURN
END