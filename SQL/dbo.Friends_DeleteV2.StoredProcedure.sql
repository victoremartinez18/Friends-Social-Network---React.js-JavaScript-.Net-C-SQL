
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE proc [dbo].[Friends_DeleteV2]
	@Id int
	
as
/*
		Declare @Id int = 1

		Select *
			From dbo.FriendsV2 as f inner join dbo.Images as i 
				on f.PrimaryImageId = i.Id
			WHERE f.Id = @Id
			
		Declare @Id int = 281
		Execute dbo.Friends_DeleteV2
							@Id

		Declare @ImageId int = (Select PrimaryImageId From dbo.FriendsV2 Where Id = @Id)

		Select *
			From dbo.FriendsV2 as f 
			WHERE f.Id = @Id

		Select *
			From dbo.Images as i
			WHERE i.Id = @ImageId
*/

BEGIN
	Declare @ImageId int = (Select PrimaryImageId From dbo.FriendsV2 Where Id = @Id)

	DELETE FROM [dbo].[FriendsV2]
      WHERE Id = @Id

	  DELETE FROM [dbo].Images
      WHERE Id = @ImageId

END


GO
