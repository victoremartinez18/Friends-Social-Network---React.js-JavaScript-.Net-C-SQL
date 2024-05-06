import axios from "axios";

const friendsService = {
  endpoint: "https://localhost:50001/api/v3/friends",
};

friendsService.getFriends = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: friendsService.endpoint + `/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

friendsService.deleteFriend = (id) => {
  const config = {
    method: "DELETE",
    url: friendsService.endpoint + `/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

friendsService.addFriend = (payload) => {
  const config = {
    method: "POST",
    url: friendsService.endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

friendsService.updateFriend = (payload) => {
  const config = {
    method: "PUT",
    url: friendsService.endpoint + `/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(() => {
    return payload;
  });
};

friendsService.getById = (id) => {
  const config = {
    method: "GET",
    url: friendsService.endpoint + `/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

friendsService.searchByQuery = (pageIndex, pageSize, query) => {
  console.log("getFriends is executed.");
  console.log("This is query: ", query);

  const config = {
    method: "GET",
    url:
      friendsService.endpoint +
      `/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

export default friendsService;
