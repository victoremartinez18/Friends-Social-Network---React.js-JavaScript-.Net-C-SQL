
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE proc [dbo].[Friends_Delete]
	@Id int
	

as
/*
		Declare @Id int = 1

		Select *
			From dbo.Friends
			WHERE Id = @Id

		Execute dbo.Friends_Delete
							@Id
		Select *
			From dbo.Friends
			WHERE Id = @Id
*/

BEGIN
	DELETE FROM [dbo].[Friends]
		
      WHERE Id = @Id
END


GO
