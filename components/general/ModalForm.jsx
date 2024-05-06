import React, { useState, useEffect } from "react";
import GeneralForm from "./GeneralForm";

import { useNavigate } from "react-router-dom";

import { Modal, ModalHeader } from "reactstrap";

function ModalForm(props) {
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const toggle = () => {
    setModal(!modal);

    if (modal === true) {
      console.log("This si the closing test.");
      switch (props.source) {
        case "friends":
          navigate("/friends", { replace: true });
          break;
        case "jobs":
          navigate("/jobs", { replace: true });
          break;
        case "company":
          navigate("/companies", { replace: true });
          break;
        default:
          return formTitle;
      }
    }

    props.setState((prevState) => {
      const newModalState = { ...prevState };
      newModalState.toggle = !newModalState.toggle;
      return newModalState;
    });
  };

  useEffect(() => {
    toggle();
  }, []);

  let formTitle = "Form";
  switch (props.source) {
    case "friends":
      formTitle = props.updatePayload.payload ? "Update Friend" : "Add Friend";
      break;
    case "jobs":
      formTitle = props.updatePayload.payload ? "Update Job" : "Add Job";
      break;
    case "company":
      formTitle = props.updatePayload.payload ? "Update Company" : "Add Company";
      break;
    default:
      return formTitle;
  }

  // function testing() {
  //   console.log("This si the closing test.");
  // }

  return (
    <React.Fragment>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{formTitle}</ModalHeader>

        <GeneralForm
          source={props.source}
          testing=" "
          updatePayload={props.updatePayload}
          pageSetProp={props.pageStateSet}
          setFriendsArrayObj={props.setFriendsArrayObj}
          setjobsArrayState={props.setjobsArrayState}
          setCompaniesArrayState={props.setCompaniesArrayState}
          onResetClicked={props.onResetClicked}
          mapper={props.mapper}
        ></GeneralForm>
      </Modal>
    </React.Fragment>
  );
}

export default ModalForm;
