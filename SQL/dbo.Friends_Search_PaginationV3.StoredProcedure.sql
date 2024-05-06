
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_Search_PaginationV3]
								@PageIndex int 
								,@PageSize int
								,@Query nvarchar(50)
	
as
/*
	Declare @PageIndex int = 0
			,@PageSize int = 5
			,@Query nvarchar(50) = 'Pedro'

	Execute dbo.Friends_Search_PaginationV3
						@PageIndex 
						,@PageSize
						,@Query
	
*/

BEGIN
	
	Declare @offset int = @PageIndex * @PageSize

	SELECT     f.Id
			  ,f.Title
			  ,f.Bio
			  ,f.Summary
			  ,f.Headline
			  ,f.Slug
			  ,f.StatusId

			  ,i.Id as ImageId
			  ,i.TypeId
			  ,i.Url

			  ,Skills = (
					Select	s.Id
						   ,s.Name as name
					From	dbo.skills as s inner join dbo.FriendSkills as fs
												on s.Id = fs.SkillId

					WHERE	f.Id = fs.FriendId
					For JSON AUTO
					)

			  ,f.UserId
			  ,f.DateCreated
			  ,f.DateModified			  
			  
			  ,TotalCount = COUNT(1) OVER()
      
  FROM [dbo].[FriendsV2] as f inner join dbo.Images as i
			on f.PrimaryImageId = i.Id

			WHERE (Title LIKE '%' + @Query + '%')

  Order By f.Id

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY
  
END
GO
