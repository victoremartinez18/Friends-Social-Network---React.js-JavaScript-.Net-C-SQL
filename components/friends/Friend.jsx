import React from "react";
import swal from "sweetalert";

function Friend(props) {
  const friend = props.friend;

  const handleDeleteClicked = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this friend!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
        props.onFriendClicked(friend.id);
      }
    });
  };

  const handleEditClicked = () => {
    console.log("Edit works!", friend.id);

    const stateForTransports = { type: "FRIEND_STATE", payload: friend };
    props.formModalCalled(stateForTransports);
  };

  return (
    <React.Fragment>
      <div className="card templateCard shadow m-3" style={{ width: "220px" }}>
        <img
          src={friend.primaryImage.url}
          style={{ width: "195px", height: "195px" }}
          className="card-img-top pt-3 px-2"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{friend.title}</h5>
          <p className="card-text">{friend.summary}</p>
          <div className="row justify-content-center">
            <button type="button" onClick={handleDeleteClicked} className="col-5 btn btn-danger">
              Delete
            </button>
            <button type="button" onClick={handleEditClicked} className="col-5 ms-3 btn btn-info">
              Edit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Friend;
