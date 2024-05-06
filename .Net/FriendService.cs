using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Friends;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Friends;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sabio.Services
{

    public class FriendService : IFriendService
    {
        IDataProvider _data = null;

        public FriendService(IDataProvider data)
        {
            _data = data;
        }


        #region FriendsV1
        public Friend Get(int Id)
        {
            Friend friend = null;

            string procName = "[dbo].[Friends_SelectById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                friend = MapSingleFriend(reader);
            });

            return friend;
        }

        public List<Friend> GetAll()
        {
            List<Friend> friendsList = null;

            string procName = "[dbo].[Friends_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (friendsList == null)
                    {
                        friendsList = new List<Friend>();
                    }

                    friendsList.Add(MapSingleFriend(reader));
                });
            return friendsList;
        }

        public int Add(FriendAddRequest model, int UserId)
        {
            string procName = "[dbo].[Friends_Insert]";

            int Id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                AddCommonParams(model, paramCollection, UserId);


                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                idOut.Direction = ParameterDirection.Output;

                paramCollection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnParamCollection)
            {
                object outId = returnParamCollection["@Id"].Value;

                int.TryParse(outId.ToString(), out Id);
            });
            return Id;
        }

        public void Update(FriendUpdateRequest model, int UserId)
        {
            string procName = "[dbo].[Friends_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                AddCommonParams(model, paramCollection, UserId);

                paramCollection.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public void Delete(int Id)
        {
            string procName = "[dbo].[Friends_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            },
            returnParameters: null);
        }
        #endregion

        private static void AddCommonParams(FriendAddRequest model, SqlParameterCollection paramCollection, int UserId)
        {
            paramCollection.AddWithValue("@Title", model.Title);
            paramCollection.AddWithValue("@Bio", model.Bio);
            paramCollection.AddWithValue("@Summary", model.Summary);
            paramCollection.AddWithValue("@Headline", model.Headline);
            paramCollection.AddWithValue("@Slug", model.Slug);
            paramCollection.AddWithValue("@StatusId", model.StatusId);
            paramCollection.AddWithValue("@PrimaryImageUrl", model.PrimaryImageUrl);
            paramCollection.AddWithValue("@UserId", UserId);

        }

        private static Friend MapSingleFriend(IDataReader reader)
        {
            Friend afriend = new Friend();

            int index = 0;

            afriend.Id = reader.GetSafeInt32(index++);
            afriend.Title = reader.GetString(index++);
            afriend.Bio = reader.GetString(index++);
            afriend.Summary = reader.GetString(index++);
            afriend.Headline = reader.GetString(index++);
            afriend.Slug = reader.GetString(index++);
            afriend.StatusId = reader.GetSafeInt32(index++);
            afriend.PrimaryImageUrl = reader.GetString(index++);
            afriend.UserId = reader.GetSafeInt32(index++);
            afriend.DateCreated = reader.GetSafeDateTime(index++);
            afriend.DateModified = reader.GetSafeDateTime(index++);
            return afriend;
        }

        ///////////////////////////////////////// FriendsV3

        #region FriendsV3
        public FriendV3 GetV3(int id)
        {
            FriendV3 friendV3 = null;

            string procName = "[dbo].[Friends_SelectByIdV3]";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                friendV3 = MapSingleFriendV3(reader);

            });

            return friendV3;
        }

        public List<FriendV3> GetAllV3()
        {
            List<FriendV3> friendV3List = null;
            string procName = "[dbo].[Friends_SelectAllV3]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    FriendV3 friendV3 = null;

                    friendV3 = MapSingleFriendV3(reader);

                    if (friendV3List == null)
                    {
                        friendV3List = new List<FriendV3>();
                    }

                    friendV3List.Add(friendV3);

                });

            return friendV3List;

        }

        public Paged<FriendV3> Pagination(int pageIndex, int pageSize)
        {
            Paged<FriendV3> pagedList = null;
            List<FriendV3> friendV3List = null;
            int totalCount = 0;

            string procName = "[dbo].[Friends_PaginationV3]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                FriendV3 friendV3 = null;
                friendV3 = MapSingleFriendV3(reader);

                totalCount = reader.GetSafeInt32(14);

                if (friendV3List == null)
                {
                    friendV3List = new List<FriendV3>();
                }

                friendV3List.Add(friendV3);
            });

            if (friendV3List != null)
            {
                pagedList = new Paged<FriendV3>(friendV3List, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<FriendV3> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            Paged<FriendV3> pagedList = null;
            List<FriendV3> friendV3List = null;
            int totalCount = 0;

            string procName = "[dbo].[Friends_Search_PaginationV3]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@Query", query);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                FriendV3 friendV3 = null;
                friendV3 = MapSingleFriendV3(reader);
                totalCount = reader.GetSafeInt32(14);

                if (friendV3List == null)
                {
                    friendV3List = new List<FriendV3>();
                }

                friendV3List.Add(friendV3);
            });

            if (friendV3List != null)
            {
                pagedList = new Paged<FriendV3>(friendV3List, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int AddV3(FriendAddRequestV3 model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Friends_InsertV3]";

            DataTable myParamValue = null;

            if (model.Skills != null)
            {
                myParamValue = MapSkillsToTable(model.Skills);
            }

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                AddCommonParamV3(model, paramCollection);

                paramCollection.AddWithValue("@UserId", userId);

                paramCollection.AddWithValue("@BatchSkills", myParamValue);


                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                idOut.Direction = ParameterDirection.Output;

                paramCollection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnParamCollection)
            {
                object outId = returnParamCollection["@Id"].Value;

                int.TryParse(outId.ToString(), out id);
            });

            return id;
        }

        public void UpdateV3(FriendUpdateRequestV3 model, int userId)
        {
            string procName = "[dbo].[Friends_UpdateV3]";
            DataTable myParamValue = null;

            if (model.Skills != null)
            {
                myParamValue = MapSkillsToTable(model.Skills);
            }

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                AddCommonParamUpdateV3(model, paramCollection);

                paramCollection.AddWithValue("@Id", model.Id);

                paramCollection.AddWithValue("@UserId", userId);

                paramCollection.AddWithValue("@BatchSkills", myParamValue);
            },
            returnParameters: null);
        }

        public void DeleteV3(int Id)
        {
            string procName = "[dbo].[Friends_DeleteV3]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            },
            returnParameters: null);
        } 
        #endregion

        private static void AddCommonParamV3(FriendAddRequestV3 model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Title", model.Title);
            paramCollection.AddWithValue("@Bio", model.Bio);
            paramCollection.AddWithValue("@Summary", model.Summary);
            paramCollection.AddWithValue("@Headline", model.Headline);
            paramCollection.AddWithValue("@Slug", model.Slug);
            paramCollection.AddWithValue("@StatusId", model.StatusId);
            paramCollection.AddWithValue("@ImageTypeId", model.ImageTypeId);
            paramCollection.AddWithValue("@ImageUrl", model.primaryImage);

        }

        private static void AddCommonParamUpdateV3(FriendAddRequestV3 model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Title", model.Title);
            paramCollection.AddWithValue("@Bio", model.Bio);
            paramCollection.AddWithValue("@Summary", model.Summary);
            paramCollection.AddWithValue("@Headline", model.Headline);
            paramCollection.AddWithValue("@Slug", model.Slug);
            paramCollection.AddWithValue("@StatusId", model.StatusId);
            paramCollection.AddWithValue("@ImageTypeId", model.ImageTypeId);
            paramCollection.AddWithValue("@primaryImage", model.primaryImage);

        }

        private DataTable MapSkillsToTable(List<SkillAddRequest> skills) 
        {
            DataTable tbl = new DataTable();

            tbl.Columns.Add("name", typeof(string));

            foreach (SkillAddRequest element in skills) 
            {
                DataRow dataRow = tbl.NewRow();

                int index = 0;

                dataRow[index++] = element.Name;

                tbl.Rows.Add(dataRow);
            }
            return tbl;
        }

        private static FriendV3 MapSingleFriendV3(IDataReader reader)
        {
            int index = 0;
            FriendV3 friendV3 = new FriendV3();

            friendV3.PrimaryImage = new Image();
            friendV3.Skills = new List<Skill>();

            friendV3.Id = reader.GetSafeInt32(index++);
            friendV3.Title = reader.GetSafeString(index++);
            friendV3.Bio = reader.GetSafeString(index++);
            friendV3.Summary = reader.GetSafeString(index++);
            friendV3.Headline = reader.GetSafeString(index++);
            friendV3.Slug = reader.GetSafeString(index++);
            friendV3.StatusId = reader.GetSafeInt32(index++);
           
            friendV3.PrimaryImage.Id = reader.GetSafeInt32(index++);
            friendV3.PrimaryImage.TypeId = reader.GetSafeInt32(index++);
            friendV3.PrimaryImage.Url = reader.GetSafeString(index++);

            friendV3.Skills = reader.DeserializeObject<List<Skill>>(index++);

            friendV3.UserId = reader.GetSafeInt32(index++);
            friendV3.DateCreated = reader.GetSafeDateTime(index++);
            friendV3.DateModified = reader.GetSafeDateTime(index++);

            return friendV3;
        }
    }
}
