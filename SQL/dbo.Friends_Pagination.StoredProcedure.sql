
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE proc [dbo].[Friends_Pagination]
								@PageIndex int 
								,@PageSize int
	
as
/*
	Declare @PageIndex int = 0
			,@PageSize int = 5

	Execute dbo.Friends_Pagination
						@PageIndex 
						,@PageSize

	
	
*/

BEGIN
	
	Declare @offset int = @PageIndex * @PageSize

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
	  ,TotalCount = COUNT(1) OVER()

        
  FROM [dbo].[Friends]

  Order By Id

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY
  
END
GO
