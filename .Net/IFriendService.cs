using Sabio.Models;
using Sabio.Models.Domain.Friends;
using Sabio.Models.Requests.Friends;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IFriendService
    {
        int Add(FriendAddRequest model, int UserId);
        void Delete(int Id);
        Friend Get(int Id);
        List<Friend> GetAll();
        void Update(FriendUpdateRequest model, int UserId);

        FriendV3 GetV3(int Id);
        List<FriendV3> GetAllV3();
        Paged<FriendV3> Pagination(int pageIndex, int pageSize);
        Paged<FriendV3> SearchPaginated(int pageIndex, int pageSize, string query);
        int AddV3(FriendAddRequestV3 model, int userId);
        public void UpdateV3(FriendUpdateRequestV3 model, int userId);
        public void DeleteV3(int Id);
    }
}