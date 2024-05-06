import React from "react";

function FriendForm(props) {
  const formData = props.formData;
  const onFormFieldChange = props.onFormFieldChange;
  return (
    <React.Fragment>
      <div className="container mb-3">
        <div className="row justify-content-center mt-1 "></div>

        <form className={`card p-3 shadow mx-auto`}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter title"
              value={formData.title}
              onChange={onFormFieldChange}
              name="title"
            />
          </div>
          <div className="form-group">
            <label className="mt-2">Bio</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter bio"
              value={formData.bio}
              onChange={onFormFieldChange}
              name="bio"
            />
          </div>
          <div className="form-group">
            <label className="mt-2">Summary</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter summary"
              value={formData.summary}
              onChange={onFormFieldChange}
              name="summary"
            />
          </div>

          <div className="form-group">
            <label className="mt-2">Headline</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter headline"
              value={formData.headline}
              onChange={onFormFieldChange}
              name="headline"
            />
          </div>
          <div className="form-group">
            <label className="mt-2">Slug</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter slug"
              value={formData.slug}
              onChange={onFormFieldChange}
              name="slug"
            />
          </div>

          <div className="form-group">
            <label className="mt-2">Primary Image</label>
            <input
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter primary image"
              value={formData.primaryImage}
              onChange={onFormFieldChange}
              name="primaryImage"
            />
          </div>

          <button
            type="submit"
            onClick={props.onFriendSubmitClicked}
            className={`btn btn-${formData.id ? "warning" : "primary"} mt-2 col-8 mx-auto`}
            name={formData.id ? "Update" : "Submit"}
          >
            {formData.id ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}

export default FriendForm;
