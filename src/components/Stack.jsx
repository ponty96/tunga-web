import React from "react";
import Linkify from "./Linkify";

import Progress from "./status/Progress";
import FormStatus from "./status/FormStatus";
import FieldError from "./status/FieldError";
import SkillSelector from "../containers/SkillSelector";
import LargeModal from "./LargeModal";
import WorkForm from "./WorkForm";
import EducationForm from "./EducationForm";

export default class Stack extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bio: "", skills: [], editWork: null, editEducation: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.addSkillsToState();
  }

  componentDidMount() {
    this.props.ProfileActions.retrieveProfile();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.Profile.profile.skills != prevProps.Profile.profile.skills) {
      this.addSkillsToState();
    }
  }

  onInputChange(key, e) {
    var new_state = {};
    new_state[key] = e.target.value;
    this.setState(new_state);
  }

  addSkillsToState() {
    const { Profile } = this.props;
    this.setState({
      skills: Profile.profile.skills
        ? Profile.profile.skills.map(skill => {
            return skill.name;
          })
        : []
    });
  }

  onSkillChange(skills) {
    this.setState({ skills: skills });
  }

  handleSubmit(e) {
    e.preventDefault();
    var website = this.refs.website ? this.refs.website.value.trim() : null;
    var bio = this.state.bio;
    const { Profile, ProfileActions } = this.props;
    const selected_skills = this.state.skills;
    const skills = selected_skills.join(",") || null;
    ProfileActions.updateProfile(Profile.profile.id, { website, bio, skills });
    return;
  }

  handleAddWork(work = null) {
    this.setState({
      modalContent: "work",
      modalTitle: "Work Experience",
      editWork: work
    });
    this.open();
  }

  handleAddEducation(education = null) {
    this.setState({
      modalContent: "education",
      modalTitle: "Education",
      editEducation: education
    });
    this.open();
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  renderModalContent() {
    const { ProfileActions, Profile, Auth } = this.props;
    return (
      <LargeModal
        title={this.state.modalTitle}
        show={this.state.showModal}
        onHide={this.close.bind(this)}
      >
        {this.state.modalContent == "work"
          ? <WorkForm
              Auth={Auth}
              Profile={Profile}
              ProfileActions={ProfileActions}
              work={this.state.editWork}
            />
          : null}
        {this.state.modalContent == "education"
          ? <EducationForm
              Auth={Auth}
              Profile={Profile}
              ProfileActions={ProfileActions}
              education={this.state.editEducation}
            />
          : null}
      </LargeModal>
    );
  }

  render() {
    const { Profile, Auth } = this.props;
    const { profile } = Profile;

    return (
      <div>
        {Profile.isRetrieving
          ? <Progress />
          : <form
              onSubmit={this.handleSubmit}
              name="profile"
              role="form"
              ref="profile_form"
            >
              <FormStatus
                loading={Profile.isSaving.profile}
                success={Profile.isSaved.profile}
                message={"Profile Saved"}
                error={Profile.error.profile}
              />

              {Profile.error.profile && Profile.error.profile.bio
                ? <FieldError message={Profile.error.profile.bio} />
                : null}
              <div className="form-group">
                <label className="control-label">Bio</label>
                <textarea
                  className="form-control"
                  onChange={this.onInputChange.bind(this, "bio")}
                  defaultValue={profile.bio}
                  ref="bio"
                  placeholder="Bio"
                />
              </div>

              {Auth.user.is_project_owner &&
              Profile.error.profile &&
              Profile.error.profile.website
                ? <FieldError message={Profile.error.profile.website} />
                : null}
              {Auth.user.is_project_owner
                ? <div className="form-group">
                    <label className="control-label">Website</label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        ref="website"
                        placeholder="Website"
                        defaultValue={Profile.profile.website}
                      />
                    </div>
                  </div>
                : null}

              {Profile.error.profile && Profile.error.profile.skills
                ? <FieldError message={Profile.error.profile.skills} />
                : null}
              <div className="form-group">
                <label className="control-label">Skills</label>
                <SkillSelector
                  filter={{ filter: null }}
                  onChange={this.onSkillChange.bind(this)}
                  skills={this.state.skills ? this.state.skills : []}
                />
              </div>

              {Auth.user.is_developer
                ? <div>
                    <div className="form-group">
                      <label className="control-label">Work Experience</label>
                      <div className="pull-right clearfix">
                        <button
                          type="button"
                          className="btn"
                          onClick={this.handleAddWork.bind(this)}
                        >
                          <i className="fa fa-plus-circle" /> Add Entry
                        </button>
                      </div>
                      <div className="clearfix" />
                      <div>
                        {Profile.work.ids.map(id => {
                          var item = Profile.work.items[id];
                          return (
                            <div
                              key={item.id}
                              className="card"
                              style={{ margin: "5px 0" }}
                            >
                              <div>
                                <strong>
                                  Position: {item.position}
                                </strong>
                              </div>
                              <div>
                                <strong>
                                  Company: {item.company}
                                </strong>
                              </div>
                              <div>
                                Period: {item.start_month_display}/{item.start_year}{" "}
                                -{" "}
                                {item.end_year
                                  ? `${item.end_month_display}/${item.end_year}`
                                  : "Present"}
                              </div>
                              <div className="short-description">
                                <Linkify properties={{ target: "_blank" }}>
                                  {item.details}
                                </Linkify>
                              </div>
                              <button
                                type="button"
                                className="btn"
                                onClick={this.handleAddWork.bind(this, item)}
                              >
                                <i className="fa fa-pencil" /> Edit
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="control-label">Education</label>
                      <div className="pull-right clearfix">
                        <button
                          type="button"
                          className="btn"
                          onClick={this.handleAddEducation.bind(this)}
                        >
                          <i className="fa fa-plus-circle" /> Add Entry
                        </button>
                      </div>
                      <div className="clearfix" />
                      <div>
                        {Profile.education.ids.map(id => {
                          var item = Profile.education.items[id];
                          return (
                            <div
                              key={item.id}
                              className="card"
                              style={{ margin: "5px 0" }}
                            >
                              <div>
                                <strong>
                                  Institution: {item.institution}
                                </strong>
                              </div>
                              <div>
                                <strong>
                                  Award: {item.award}
                                </strong>
                              </div>
                              <div>
                                Period: {item.start_month_display}/{item.start_year}{" "}
                                -{" "}
                                {item.end_year
                                  ? `${item.end_month_display}/${item.end_year}`
                                  : "Present"}
                              </div>
                              <div className="short-description">
                                <Linkify properties={{ target: "_blank" }}>
                                  {item.details}
                                </Linkify>
                              </div>
                              <button
                                type="button"
                                className="btn"
                                onClick={this.handleAddEducation.bind(
                                  this,
                                  item
                                )}
                              >
                                <i className="fa fa-pencil" /> Edit
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                : null}

              <button
                type="submit"
                className="btn  pull-right"
                disabled={Profile.isSaving.profile}
              >
                Save
              </button>
              <div className="clearfix" />
            </form>}
        {this.renderModalContent()}
      </div>
    );
  }
}
