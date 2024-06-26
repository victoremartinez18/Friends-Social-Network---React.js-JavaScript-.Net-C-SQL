
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE proc [dbo].[Friends_Update]
			@Title nvarchar(50)
			,@Bio nvarchar(50) 
			,@Summary nvarchar(50)
			,@Headline nvarchar(50)
			,@Slug nvarchar(50)
			,@StatusId int
			,@PrimaryImageUrl nvarchar(50)
			,@UserId int
			,@Id int
			
as
/* --- Test Code ---
	Declare @Title nvarchar(50) = 'Mark Doe'
		,@Bio nvarchar(50) = 'Bio Text'
		,@Summary nvarchar(50) = 'Summary Text'
		,@Headline nvarchar(50) = 'Headline Text'
		,@Slug nvarchar(50) = 'Slug1234'
		,@StatusId int = 1
		,@PrimaryImageUrl nvarchar(50) = 'ImageURL.com'
		,@UserId int = 54321
		,@Id int = 2

	Select *
	From dbo.Friends
	Where Id = @Id

	Execute dbo.Friends_Update
						@Title
					   ,@Bio
					   ,@Summary
					   ,@Headline
					   ,@Slug
					   ,@StatusId
					   ,@PrimaryImageUrl
					   ,@UserId
					   ,@Id
	Select *
	From dbo.Friends
	Where Id = @Id
*/

Declare @DateModified datetime2(7) = GETUTCDATE()

BEGIN
	UPDATE [dbo].[Friends]
   SET [Title] = @Title
      ,[Bio] = @Bio
      ,[Summary] = @Summary
      ,[Headline] = @Headline
      ,[Slug] = @Slug
      ,[StatusId] = @StatusId
      ,[PrimaryImageUrl] = @PrimaryImageUrl
      ,[DateModified] = @DateModified
      ,[UserId] = @UserId
    WHERE Id = @Id
END
GO
