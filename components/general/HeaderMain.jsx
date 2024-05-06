import React from "react";

import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";

function HeaderMain(props) {
  const pageName = props.pageName;

  const ArrayObj = props.ArrayObj;
  const searchState = props.searchState;
  const onShowClicked = props.onShowClicked;
  const renderFormModal = props.renderFormModal;
  const onSearchClicked = props.onSearchClicked;
  const onResetClicked = props.onResetClicked;

  const pageState = props.pageState;
  const pageChange = props.pageChange;
  const setSearchState = props.setSearchState;

  const onFormFieldChange = (event) => {
    const newFieldValue = event.target.value;
    const nameOfField = event.target.name;

    setSearchState((prevState) => {
      const newSearchState = { ...prevState };

      newSearchState[nameOfField] = newFieldValue;

      return newSearchState;
    });
  };

  return (
    <React.Fragment>
      <main role="main">
        <div className="container col-9 mt-3 rounded-3 ">
          <div className=" row justify-content-center mt-1 ">
            <h1 className="col-md-auto">{pageName}</h1>
            <button
              type="button"
              onClick={onShowClicked}
              className={`shadow m-2 col-auto btn ${ArrayObj.show ? "btn-warning" : "btn-primary"}`}
              id="show-friends"
            >
              {ArrayObj.show ? "Hide" : "Show"} {pageName}
            </button>
            <button
              to="/friends/new"
              type="button"
              onClick={renderFormModal}
              className="shadow m-2 col-auto btn btn-primary"
              id="show-friends"
            >
              Add {pageName}
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
            {ArrayObj.show && (
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
          <div className="row justify-content-center ">{ArrayObj.show && ArrayObj.components}</div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default HeaderMain;
