import React, { useState } from "react";
import { useEffect } from "react";
import toastr from "toastr";
// import { useLocation } from "react-router-dom";

import friendsService from "../../services/friendsService";
import FriendForm from "../friends/FriendForm";
import jobsService from "../../services/jobsService";
import JobForm from "../jobs/jobForm";
import companyService from "../../services/companyService";
import CompanyForm from "../techcompanies/companyForm";

function GeneralForm(props) {
  const [sourceState, setSourceState] = useState("");

  const [friendFormData, setFriendFormData] = useState({
    id: 0,
    title: "",
    bio: "",
    summary: "",
    headline: "",
    slug: "",
    statusId: 1,
    primaryImage: "",
  });

  const [jobFormData, setJobFormData] = useState({
    id: 0,
    statusId: "Active",
    title: "",
    description: "",
    summary: "",
    pay: "",
    slug: "",
    techCompanyId: 0,
    skillsString: "",
    skills: [],
  });

  const [companyFormData, setCompanyFormData] = useState({
    id: 0,
    statusId: "Active",
    name: "",
    profile: "",
    summary: "",
    headline: "",
    slug: "",
    contactInformation: "",
    images: "",
    urls: ["string"],
    tags: ["string"],
    friendIds: [0],
  });

  //   //   #############################  Edit Friend  ###################################

  // const { state } = useLocation(); //This hook is used to get access to the state being sent by the Friend.jsx componet (the friend card) so the state in the form can be updated and automatically populate the form.
  const state = props.updatePayload;

  useEffect(() => {
    if (state?.type === "FRIEND_STATE" && state?.payload) {
      setFriendFormData((prevState) => {
        return {
          ...prevState,
          ...state.payload,
          primaryImage: state.payload.primaryImage.url, // This property is to populate the primaryImage input in the form.
        };
      });
    } else if (state?.type === "JOB_STATE" && state?.payload) {
      // console.log("JOB_STATE, Payload: ", state?.payload);

      const payload = state.payload;
      const mappedSkill = payload.skills.map((skill) => {
        return skill.name ? skill.name : skill;
      });

      // console.log("mappedSkill: ", mappedSkill);

      setJobFormData((prevState) => {
        return {
          ...prevState,
          id: payload.id,
          title: payload.title,
          description: payload.description,
          summary: payload.summary,
          pay: payload.pay,
          slug: payload.slug,
          techCompanyId: payload.techCompany.id,
          skillsString: mappedSkill.join(", "),
          skills: mappedSkill,
        };
      });
    } else if (state?.type === "COMPANY_STATE" && state?.payload) {
      // console.log("Company Payload: ", state?.payload);

      const payload = state.payload;

      setCompanyFormData((prevState) => {
        return {
          ...prevState,
          id: payload.id,
          name: payload.name,
          profile: payload.profile,
          summary: payload.summary,
          headline: payload.headline,
          slug: payload.slug,
          contactInformation: payload.contactInformation.data,
          images: payload.images[0].imageUrl,
        };
      });
    }

    setSourceState(props.source);
  }, []);

  //   //   #############################  Edit Friend  ###################################

  const onFormFieldChange = (event) => {
    console.log("Changing Email Field", event.target.value);

    //the event.target will represent the input
    const target = event.target;

    //this is the value of the input, the value in the text box the user types into
    const newFieldValue = target.value;

    //this is the name (so be sure to give your form fields a name attribute)
    const nameOfField = target.name;

    console.log({ nameOfField, newFieldValue });

    const setUpdater = (prevState) => {
      console.log("updater onChange");

      // copy the personData object from state using the spread operator
      const newObject = {
        ...prevState,
      };

      //change the value of the copied object using the name and using bracket notation
      newObject[nameOfField] = newFieldValue;

      return newObject;
    };

    (sourceState === "friends" || friendFormData.id) &&
      setFriendFormData(setUpdater(friendFormData));

    (sourceState === "jobs" || jobFormData.id) && setJobFormData(setUpdater(jobFormData));

    (sourceState === "company" || companyFormData.id) &&
      setCompanyFormData(setUpdater(companyFormData));
  };

  const onFriendSubmitClicked = (e) => {
    e.preventDefault();

    if (friendFormData.id) {
      friendsService
        .updateFriend(friendFormData)
        .then(onUpdateFriendSuccess)
        .catch(onUpdateFriendError);
    } else {
      friendsService.addFriend(friendFormData).then(onAddFriendSuccess).catch(onAddFriendError);
    }
  };

  const onJobSubmitClicked = (e) => {
    e.preventDefault();

    let newJobFormDataState = {};
    let skillsArray = [];

    setJobFormData((prevState) => {
      newJobFormDataState = { ...prevState };

      skillsArray = newJobFormDataState.skillsString.split(", ");

      console.log("skillsArray: ", skillsArray);

      newJobFormDataState.skills = skillsArray;

      return {
        ...newJobFormDataState,
      };
    });

    console.log("Reformated jobFormData after setter: ", jobFormData);

    setTimeout(() => {
      if (jobFormData.id) {
        jobsService.updateJob(newJobFormDataState).then(onUpdateJobSuccess).catch(onUpdateJobError);
      } else {
        console.log("Reformated jobFormData before sending for to jobsService: ", jobFormData);
        jobsService.addJob(jobFormData).then(onAddJobSuccess).catch(onAddJobdError);
      }
    }, 500);
  };

  const onCompanySubmitClicked = (e) => {
    e.preventDefault();

    let newCompanyFormDataState = { ...companyFormData };

    newCompanyFormDataState.images = [{ imageTypeId: 2, imageUrl: companyFormData.images }];

    if (companyFormData.id) {
      companyService
        .updateCompany(newCompanyFormDataState)
        .then(onUpdateCompanySuccess)
        .catch(onUpdateCompanyError);
    } else {
      // console.log("Reformated jobFormData before sending for to companyService: ", companyFormData);
      console.log("This the payload for adding: ", companyFormData);

      companyService
        .addCompany(newCompanyFormDataState)
        .then(onAddCompanySuccess)
        .catch(onAddCompanydError);
    }

    console.log("Company Click Works");
  };

  //   #############################  Add Success  ###################################

  const onAddFriendSuccess = (response) => {
    console.log("This is the response (new Friend) id: ", response.data.item);

    toastr.success("New Friend Added!");

    const newFriendId = response.data.item;

    setFriendFormData((prevState) => {
      return { ...prevState, id: newFriendId };
    });

    props.pageSetProp((prevState) => {
      const newPageSte = { ...prevState };

      newPageSte.totalCount = newPageSte.totalCount + 1;
      newPageSte.default = true;

      return { ...prevState, totalCount: newPageSte.totalCount };
    });

    props.onResetClicked();
  };

  const onAddFriendError = (error) => {
    console.error(error);
    toastr.error("Adding new Friend Failed");
  };

  const onAddJobSuccess = (response) => {
    console.log("This is the response (new Job) id: ", response.data.item);

    toastr.success("New Job Added!");

    const newJobId = response.data.item;

    setJobFormData((prevState) => {
      return { ...prevState, id: newJobId };
    });

    props.pageSetProp((prevState) => {
      const newPageSte = { ...prevState };

      newPageSte.totalCount = newPageSte.totalCount + 1;

      return { ...prevState, totalCount: newPageSte.totalCount };
    });

    props.onResetClicked();
  };

  const onAddJobdError = (error) => {
    console.error(error);
    toastr.error("Adding new Job Failed");
  };

  const onAddCompanySuccess = (response) => {
    console.log("This is the response (new Job) id: ", response.data.item);
    toastr.success("New Company Added!");

    const newCompanyId = response.data.item;

    setCompanyFormData((prevState) => {
      return { ...prevState, id: newCompanyId };
    });

    props.pageSetProp((prevState) => {
      const newPageSte = { ...prevState };

      newPageSte.totalCount = newPageSte.totalCount + 1;

      return { ...prevState, totalCount: newPageSte.totalCount };
    });

    props.onResetClicked();
  };

  const onAddCompanydError = (error) => {
    console.error(error);
    toastr.error("Adding new Company Failed");
  };

  //   ###################### Update Friend Success ##################################

  const onUpdateFriendSuccess = (response) => {
    // console.log("This is the response: ", response);

    toastr.success("Update Successful");

    const newFriendData = response;

    setFriendFormData(newFriendData);

    props.setFriendsArrayObj((prevState) => {
      let newFriendState = { ...prevState };

      const arrayToMap = newFriendState.arrayOfFriends;

      const mappedFriendsArr = arrayToMap.map(friendMapper);

      function friendMapper(friendObj) {
        // console.log("This is FriendObj: ", friendObj);

        if (friendObj.id === newFriendData.id) {
          return {
            ...friendObj,
            ...newFriendData,
            primaryImage: { ...friendObj.primaryImage, url: newFriendData.primaryImage },
          };
        } else {
          return friendObj;
        }
      }
      console.log("This is filteredFriendsArr: ", mappedFriendsArr);

      newFriendState.arrayOfFriends = mappedFriendsArr;

      newFriendState.components = mappedFriendsArr.map(props.mapper);

      return newFriendState;
    });
  };

  const onUpdateFriendError = (error) => {
    console.error(error);
    toastr.error("Updating new Friend Failed");
  };

  //   ######################### Update Job Success ##################################

  const onUpdateJobSuccess = (response) => {
    toastr.success("Update Successful");
    console.log("This is the onUpdateJobSuccess response: ", response);

    const newJobData = response;

    setJobFormData(newJobData);

    props.setjobsArrayState((prevState) => {
      let newJobsArrayState = { ...prevState };
      const arrayToMap = newJobsArrayState.arrayOfJobs;

      const mappedJobssArr = arrayToMap.map(jobMapper);

      function jobMapper(jobObj) {
        // console.log("This is FriendObj: ", friendObj);

        if (jobObj.id === newJobData.id) {
          return {
            ...jobObj,
            ...newJobData,
          };
        } else {
          return jobObj;
        }
      }

      console.log("This is mappedJobssArr: ", mappedJobssArr);

      newJobsArrayState.arrayOfJobs = mappedJobssArr;

      newJobsArrayState.components = mappedJobssArr.map(props.mapper);
      return newJobsArrayState;
    });
  };

  const onUpdateJobError = (error) => {
    console.error(error);
    toastr.error("Updating Job Failed");
  };

  //   ###################### Update Company Success #################################

  const onUpdateCompanySuccess = (response) => {
    toastr.success("Update Successful");
    console.log("This is the onUpdateCompanySuccess response: ", response);

    const newCompanyData = response;
    // setCompanyFormData(newCompanyData);

    props.setCompaniesArrayState((prevState) => {
      let newCompaniesArrayState = { ...prevState };
      const arrayToMap = newCompaniesArrayState.arrayOfCompanies;

      const mappedCompaniesArr = arrayToMap.map(companyMapper);

      function companyMapper(companyObj) {
        console.log("This is companyObj: ", companyObj);

        if (companyObj.id === newCompanyData.id) {
          return {
            ...companyObj,
            ...newCompanyData,
          };
        } else {
          return companyObj;
        }
      }

      console.log("This is mappedCompaniesArr: ", mappedCompaniesArr);

      newCompaniesArrayState.arrayOfCompanies = mappedCompaniesArr;

      newCompaniesArrayState.components = mappedCompaniesArr.map(props.mapper);
      return newCompaniesArrayState;
    });
  };

  const onUpdateCompanyError = (error) => {
    console.error(error);
    toastr.error("Updating Company Failed");
  };

  let formToRender = null;
  switch (props.source) {
    case "friends":
      formToRender = (
        <FriendForm
          formData={friendFormData}
          onFormFieldChange={onFormFieldChange}
          onFriendSubmitClicked={onFriendSubmitClicked}
        ></FriendForm>
      );
      break;
    case "jobs":
      formToRender = (
        <JobForm
          formData={jobFormData}
          onFormFieldChange={onFormFieldChange}
          onJobSubmitClicked={onJobSubmitClicked}
        ></JobForm>
      );
      break;
    case "company":
      formToRender = (
        <CompanyForm
          formData={companyFormData}
          onFormFieldChange={onFormFieldChange}
          onCompanySubmitClicked={onCompanySubmitClicked}
        ></CompanyForm>
      );
      break;
    default:
      return formToRender;
  }

  return <React.Fragment>{formToRender}</React.Fragment>;
}

export default GeneralForm;
