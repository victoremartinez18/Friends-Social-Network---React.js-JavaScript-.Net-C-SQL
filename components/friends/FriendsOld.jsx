import React, { useState, useEffect } from "react";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";

import friendsService from "../../services/friendsService";
import Friend from "./Friend";
import ModalForm from "../general/ModalForm";

function Friends() {
  const [friendsArrayObj, setFriendsArrayObj] = useState({
    arrayOfFriends: [],
    friendsComponents: [],
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

  const dataChecker = (dataObj) => {
    var dataObjKeysArray = Object.values(dataObj);

    console.log(dataObj);

    var keyValueCounter = 0;
    for (let i = 0; i < dataObjKeysArray.length; i++) {
      if (dataObjKeysArray[i] || typeof dataObjKeysArray[i] === "boolean") {
        keyValueCounter++;
      }
    }

    if (keyValueCounter === dataObjKeysArray.length) {
      // Validates that the form is complete.
      return true;
    } else {
      return false;
    }
  };

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
          if (friendObj.id !== idToBeDeleted) {
            return true;
          }
        }

        newFriendState.arrayOfFriends = filteredFriendsArr;

        newFriendState.friendsComponents = filteredFriendsArr.map(friendMapper);

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

      newFriendsArrayObj.friendsComponents = newFriendsArray.map(friendMapper);

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

  const onShowFriendsClicked = () => {
    setFriendsArrayObj((prevState) => {
      const newFriendsArrayObj = { ...prevState };

      newFriendsArrayObj.show = !newFriendsArrayObj.show;
      return newFriendsArrayObj;
    });
  };

  const onFormFieldChange = (event) => {
    const newFieldValue = event.target.value;
    const nameOfField = event.target.name;

    setSearchState((prevState) => {
      const newSearchState = { ...prevState };

      newSearchState[nameOfField] = newFieldValue;

      return newSearchState;
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

      newFriendsArray.friendsComponents = searchResult.map(friendMapper);
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

  const onResetClicked = () => {
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
      <main role="main">
        <div className="container col-9 mt-3 rounded-3 ">
          <div className=" row justify-content-center mt-1 ">
            <h1 className="col-md-auto">Friends</h1>
            <button
              type="button"
              onClick={onShowFriendsClicked}
              className={`shadow m-2 col-auto btn ${
                friendsArrayObj.show ? "btn-warning" : "btn-primary"
              }`}
              id="show-friends"
            >
              {friendsArrayObj.show ? "Hide" : "Show"} Friends
            </button>
            <button
              to="/friends/new"
              type="button"
              onClick={renderFormModal}
              className="shadow m-2 col-auto btn btn-primary"
              id="show-friends"
            >
              Add Friend
            </button>
            <div
              className="d-flex col-auto my-auto"
              style={{
                width: "20em",
                height: "40px",
              }}
            >
              <form className="input-group col-auto ">
                <input
                  type="text"
                  className=" form-control"
                  placeholder="Search"
                  value={searchState.search}
                  onChange={onFormFieldChange}
                  name="search"
                />
                <button
                  type="submit"
                  onClick={onSearchClicked}
                  className="btn btn-primary col-auto"
                >
                  Search
                </button>
              </form>
              {searchState.active && (
                <button
                  type="submit"
                  onClick={onResetClicked}
                  className="ms-3 btn btn-danger col-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center col-auto my-auto pt-2">
            {friendsArrayObj.show && (
              <Pagination
                className="my-auto"
                current={pageState.current}
                pageSize={pageState.pageSize}
                defaultPageSize={4}
                total={pageState.totalCount}
                defaultCurrent={1}
                locale={locale}
                onChange={pageChange}
              />
            )}
          </div>
          <div className="row justify-content-center ">
            {friendsArrayObj.show && friendsArrayObj.friendsComponents}
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Friends;
