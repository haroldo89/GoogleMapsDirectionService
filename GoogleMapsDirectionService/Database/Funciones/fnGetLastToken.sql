IF OBJECT_ID (N'dbo.fnGetLastToken') IS NOT NULL
   DROP FUNCTION dbo.fnGetLastToken
GO
-- ========================================================================================
-- Autor          :	Harold Caicedo
-- Fecha Creación : 2014-03-14
-- Descripción    :	Devuelve el último token de una cadena con valores delimitados por un 
--					carácter en específico
-- ========================================================================================
CREATE FUNCTION dbo.fnGetLastToken
(
	@inputString VARCHAR(MAX),
	@separator CHAR(1)	
)
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @lastToken VARCHAR(MAX);
	IF LEN(@inputString) > 0 AND CHARINDEX(@separator, @inputString) > 0
	BEGIN
		DECLARE @reverseString VARCHAR(MAX) = REVERSE(@inputString);		
		SET @lastToken = REVERSE(LEFT(@reverseString, CHARINDEX(@separator, @reverseString) - 1));
	END
	RETURN ISNULL(@lastToken, '');
END
