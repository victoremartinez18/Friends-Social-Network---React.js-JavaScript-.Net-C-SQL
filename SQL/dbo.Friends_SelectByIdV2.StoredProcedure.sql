
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_SelectByIdV2]
	@Id int

as
/*
	Declare @Id int = 3
	Execute dbo.Friends_SelectByIdV2
		@Id
*/



BEGIN
	SELECT f.[Id]
      ,[Title]
      ,[Bio]
      ,[Summary]
      ,[Headline]
      ,[Slug]
      ,[StatusId]
	  ,i.Id
	  ,TypeId
	  ,Url
	  ,[UserId]
      ,[DateCreated]
      ,[DateModified]
      
  FROM [dbo].[FriendsV2] as f inner join dbo.Images as i
				on f.PrimaryImageId = i.Id
  Where f.Id = @Id
END
GO
