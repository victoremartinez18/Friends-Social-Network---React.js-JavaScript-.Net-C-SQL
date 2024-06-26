
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_UpdateV3]
			@Title nvarchar(50)
			,@Bio nvarchar(50) 
			,@Summary nvarchar(50)
			,@Headline nvarchar(50)
			,@Slug nvarchar(50)
			,@StatusId int
			,@UserId int
			,@ImageTypeId int
			,@primaryImage nvarchar(50)
			,@BatchSkills dbo.BatchSkills READONLY
			,@Id int
			
as
/* --- Test Code ---
	Declare @Title nvarchar(50) = 'Test Martinez'
		,@Bio nvarchar(50) = 'Bio Text'
		,@Summary nvarchar(50) = 'Summary Text'
		,@Headline nvarchar(50) = 'Headline Text'
		,@Slug nvarchar(50) = 'Slug1234'
		,@StatusId int = 1
		,@UserId int = 54321
		,@ImageTypeId int = 2
		,@primaryImage nvarchar(50) = 'Martinez.com'
		,@BatchSkills dbo.BatchSkills 
		,@Id int = 3

	Insert Into @BatchSkills (Name)
		Values ('Walk')
	Insert Into @BatchSkills (Name)
		Values ('Paint')

	execute Friends_SelectByIdV3 @Id

	Execute dbo.Friends_UpdateV3
						@Title
						,@Bio 
						,@Summary 
						,@Headline 
						,@Slug 
						,@StatusId 
						,@UserId 
						,@ImageTypeId 
						,@primaryImage 
						,@BatchSkills
						,@Id 
	
	execute Friends_SelectByIdV3 @Id
	
*/

Declare @DateModified datetime2(7) = GETUTCDATE()

Declare @PrimaryImageId int = (Select PrimaryImageId 
										From dbo.FriendsV2
										Where Id = @Id)

BEGIN
	UPDATE [dbo].[FriendsV2]
   SET [Title] = @Title
      ,[Bio] = @Bio
      ,[Summary] = @Summary
      ,[Headline] = @Headline
      ,[Slug] = @Slug
      ,[StatusId] = @StatusId
      ,[DateModified] = @DateModified
      ,[UserId] = @UserId

    WHERE Id = @Id 

UPDATE [dbo].[Images]
   SET [TypeId] = @ImageTypeId
      ,[Url] = @primaryImage

	  WHERE Id = @PrimaryImageId


	  /*
	  FROM dbo.FriendsV2 as f inner join dbo.Images as i
				on f.PrimaryImageId = i.Id
    WHERE f.Id = @Id
	*/

	
---------------------------------------- Delete --------------
	
	Delete From fs
	From @BatchSkills as b right outer join  dbo.Skills as s 
		on s.Name = b.Name inner join dbo.FriendSkills as fs
			on s.Id = fs.SkillId
		Where fs.FriendId = @Id and b.Name is Null 
											-- This section is redundant:
												/*
													And Exists (
																	Select *
																		From @BatchSkills as b right outer join  dbo.Skills as s 
																			on s.Name = b.Name inner join dbo.FriendSkills as fs
																				on s.Id = fs.SkillId
																			Where fs.FriendId = @Id
																)
																											*/
---------------------------------------- Insert --------------
	INSERT INTO dbo.Skills
			(Name)
		SELECT b.Name
			From @BatchSkills as b
		Where NOT EXISTS (
						Select 1
							From dbo.Skills as s 
						Where s.Name = b.Name
		)

	INSERT INTO dbo.FriendSkills
			(FriendId
			,SkillId)
	
		SELECT @Id
			  ,s.Id
			From dbo.Skills as s
		Where  Exists (
						Select 1
							From @BatchSkills as b
						Where b.Name = s.Name
						)
				And Not Exists (
								Select 1 
										From dbo.FriendSkills as fs
									Where fs.FriendId = @Id
										and fs.SkillId = s.Id
								)
END
GO
