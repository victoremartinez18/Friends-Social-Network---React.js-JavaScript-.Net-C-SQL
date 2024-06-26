
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_SelectAllV2]
	
as
/*
	Declare @Id int = 1
	Execute dbo.Friends_SelectAllV2
*/

BEGIN
	SELECT f.[Id]
      ,[Title]
      ,[Bio]
      ,[Summary]
      ,[Headline]
      ,[Slug]
      ,[StatusId]
      ,[PrimaryImageId]
	  ,[UserId]
      ,[DateCreated]
      ,[DateModified]
      
  FROM [dbo].[FriendsV2] as f inner join dbo.Images as i
				on f.PrimaryImageId = i.Id

END
GO
