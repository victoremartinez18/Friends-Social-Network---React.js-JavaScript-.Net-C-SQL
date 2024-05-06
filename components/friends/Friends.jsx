import React, { useState, useEffect } from "react";
import dataChecker from "../customJs/useDataChecker";

import swal from "sweetalert";

import HeaderMain from "../general/HeaderMain";

import friendsService from "../../services/friendsService";
import Friend from "./Friend";
import ModalForm from "../general/ModalForm";

function Friends() {
  const [friendsArrayObj, setFriendsArrayObj] = useState({
    arrayOfFriends: [],
    components: [],
    show: true,
  });

  const [searchState, setSearchState] = useState({
    search: "",
    active: false,
  });

  const [ModalState, setModalState] = useState({
    modal: [],
    toggle: false,
  });

  const [pageState, setPageState] = useState({
    current: 1,
    totalCount: 0,
    pageSize: 4,
    pageIndex: 0,
    default: true,
  });

  // const navigate = useNavigate();

  const onDeleteRequested = (id) => {
    const handler = getDeleteSuccessHandler(id);

    friendsService.deleteFriend(id).then(handler).catch(onDeleteFriendError);
  };

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    return () => {
      console.log("This is the deleted id: ", idToBeDeleted);

      setPageState((prevState) => {
        const newPageSte = { ...prevState };

        newPageSte.totalCount = newPageSte.totalCount - 1;

        return { ...prevState, totalCount: newPageSte.totalCount };
      });

      setFriendsArrayObj((prevState) => {
        let newFriendState = { ...prevState };

        const arrayToFilter = newFriendState.arrayOfFriends;

        const filteredFriendsArr = arrayToFilter.filter(friendFilter);

        function friendFilter(friendObj) {
          // console.log(friendObj);

          if (friendObj.id !== idToBeDeleted) {
            return true;
          }
        }

        newFriendState.arrayOfFriends = filteredFriendsArr;

        newFriendState.components = filteredFriendsArr.map(friendMapper);

        return newFriendState;
      });

      onResetClicked();
    };
  };

  const onDeleteFriendError = (error) => {
    console.error(error);
  };

  const friendMapper = (friend) => {
    return (
      <Friend
        friend={friend}
        onFriendClicked={onDeleteRequested}
        formModalCalled={renderFormModal}
        key={"ListA-" + friend.id}
      ></Friend>
    );
  };

  useEffect(() => {
    // console.log("useEffect triggerered!");

    if (searchState.active) {
      friendsService
        .searchByQuery(pageState.pageIndex, pageState.pageSize, searchState.search)
        .then(onSearchByQuerySuccess)
        .catch(onSearchByQueryError);
    } else {
      friendsService
        .getFriends(pageState.pageIndex, pageState.pageSize)
        .then(onGetFriendsSuccess)
        .catch(onGetFriendsError);
    }
  }, [pageState.current, pageState.default]);

  const onGetFriendsSuccess = (response) => {
    let newFriendsArray = response.data.item.pagedItems;

    setFriendsArrayObj((prevState) => {
      const newFriendsArrayObj = { ...prevState };

      newFriendsArrayObj.arrayOfFriends = newFriendsArray;

      newFriendsArrayObj.components = newFriendsArray.map(friendMapper);

      return newFriendsArrayObj;
    });

    setPageState((prevState) => {
      const newPageState = { ...prevState };

      newPageState.totalCount = response.data.item.totalCount;
      newPageState.pageIndex = response.data.item.pageIndex;

      return { ...newPageState };
    });
  };

  const onGetFriendsError = (error) => {
    console.error(error);
  };

  const onShowClicked = () => {
    setFriendsArrayObj((prevState) => {
      const newFriendsArrayObj = { ...prevState };

      newFriendsArrayObj.show = !newFriendsArrayObj.show; // !newFriendsArrayObj.show this represents the oposite value (tru if it is false and false if it is true.)

      return newFriendsArrayObj;
    });
  };

  const onSearchClicked = (e) => {
    e.preventDefault();

    const value = dataChecker(searchState);

    console.log("Value: ", value);

    if (dataChecker(searchState)) {
      friendsService
        .searchByQuery(0, pageState.pageSize, searchState.search)
        .then(onSearchByQuerySuccess)
        .catch(onSearchByQueryError);
    } else {
      console.log("Please enter search input.");
    }
  };

  const onSearchByQuerySuccess = (response) => {
    console.log("this is the response: ", response.data.item.pagedItems);

    const searchResult = response.data.item.pagedItems;

    setFriendsArrayObj((prevState) => {
      const newFriendsArray = { ...prevState };

      newFriendsArray.arrayOfFriends = searchResult;

      newFriendsArray.components = searchResult.map(friendMapper);
      newFriendsArray.show = true;

      return newFriendsArray;
    });

    setSearchState((prevState) => {
      const newSearchState = { ...prevState };

      newSearchState.active = true;

      return newSearchState;
    });

    setPageState((prevState) => {
      const newPageState = { ...prevState };

      newPageState.totalCount = response.data.item.totalCount;
      newPageState.pageIndex = response.data.item.pageIndex;
      newPageState.current = response.data.item.pageIndex + 1;

      return { ...newPageState };
    });
  };

  const onSearchByQueryError = (error) => {
    console.error("this is the error: ", error);

    swal({
      title: "No Friend found!",
      text: "Please try again!",
      icon: "warning",
      // buttons: true,
      dangerMode: false,
    });
  };

  const pageChange = (e) => {
    console.log("This is the event: ", e);

    setPageState((prevState) => {
      const newPageState = { ...prevState };

      newPageState.current = e;
      newPageState.pageIndex = e - 1;

      console.log("This is the newPageState: ", newPageState);

      return newPageState;
    });
  };

  const renderFormModal = (updatePayload) => {
    console.log("Test works");

    setModalState(() => {
      return {
        modal: [
          <ModalForm
            source={"friends"}
            setState={setModalState}
            pageStateSet={setPageState}
            updatePayload={updatePayload}
            setFriendsArrayObj={setFriendsArrayObj}
            mapper={friendMapper}
            onResetClicked={onResetClicked}
            key={"A-1"}
          />,
        ],
        toggle: true,
      };
    });
  };

  // This function is the reset Click handler but is used by the forms as well when adding or deleting a new element and the search is active.
  const onResetClicked = () => {
    // navigate(0);

    setPageState((prevState) => {
      const newPageState = { ...prevState };

      newPageState.default = !newPageState.default;
      newPageState.current = 1;
      newPageState.pageIndex = 0;

      return { ...newPageState };
    });

    setSearchState({ search: "", active: false });
  };

  return (
    <React.Fragment>
      {ModalState.toggle && ModalState.modal}
      <HeaderMain
        pageName="Friends"
        ArrayObj={friendsArrayObj}
        searchState={searchState}
        onShowClicked={onShowClicked}
        renderFormModal={renderFormModal}
        onSearchClicked={onSearchClicked}
        onResetClicked={onResetClicked}
        pageState={pageState}
        pageChange={pageChange}
        setSearchState={setSearchState}
      ></HeaderMain>
    </React.Fragment>
  );
}

export default Friends;
