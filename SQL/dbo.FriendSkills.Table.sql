
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FriendSkills](
	[FriendId] [int] NOT NULL,
	[SkillId] [int] NOT NULL,
 CONSTRAINT [PK_FriendSkills] PRIMARY KEY CLUSTERED 
(
	[FriendId] ASC,
	[SkillId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[FriendSkills]  WITH CHECK ADD  CONSTRAINT [FK_FriendSkills_FriendsV2] FOREIGN KEY([FriendId])
REFERENCES [dbo].[FriendsV2] ([Id])
GO
ALTER TABLE [dbo].[FriendSkills] CHECK CONSTRAINT [FK_FriendSkills_FriendsV2]
GO
ALTER TABLE [dbo].[FriendSkills]  WITH CHECK ADD  CONSTRAINT [FK_FriendSkills_Skills] FOREIGN KEY([SkillId])
REFERENCES [dbo].[Skills] ([Id])
GO
ALTER TABLE [dbo].[FriendSkills] CHECK CONSTRAINT [FK_FriendSkills_Skills]
GO
