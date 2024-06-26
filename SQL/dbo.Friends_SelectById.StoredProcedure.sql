
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_SelectById]
					@Id int

as
/*
	Declare @Id int = 1
	Execute dbo.Friends_SelectById
		@Id
*/

BEGIN
	SELECT [Id]
      ,[Title]
      ,[Bio]
      ,[Summary]
      ,[Headline]
      ,[Slug]
      ,[StatusId]
      ,[PrimaryImageUrl]
	  ,[UserId]
      ,[DateCreated]
      ,[DateModified]
      
  FROM [dbo].[Friends]
  Where Id = @Id
END
GO
