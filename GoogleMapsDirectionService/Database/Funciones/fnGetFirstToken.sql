IF OBJECT_ID (N'dbo.fnGetFirstToken') IS NOT NULL
   DROP FUNCTION dbo.fnGetFirstToken
GO
-- ========================================================================================
-- Autor          :	Harold Caicedo
-- Fecha Creación : 2014-03-14
-- Descripción    :	Devuelve el primer token de una cadena con valores delimitados por un 
--					carácter en específico
-- ========================================================================================
CREATE FUNCTION dbo.fnGetFirstToken
(
	@inputString VARCHAR(MAX),
	@separator CHAR(1)	
)
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @firstToken VARCHAR(MAX);
	DECLARE @separatorIndex INT = CHARINDEX(@separator, @inputString);
	IF LEN(@inputString) > 0 AND @separatorIndex > 0
	BEGIN				
		SET @firstToken = SUBSTRING(@inputString, 1, @separatorIndex - 1);
	END
	RETURN ISNULL(@firstToken, '');
END
