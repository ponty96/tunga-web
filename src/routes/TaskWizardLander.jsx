import React from "react";

import TaskContainer from "../containers/TaskContainer";
import TaskDetailContainer from "../containers/TaskDetailContainer";
import TaskForm from "../components/TaskForm";
import LandingPage from "../routes/LandingPage";

import { getEditToken } from "../utils/tasks";

export default class TaskWizardLander extends LandingPage {
  constructor(props) {
    super(props);
    this.state = {
      title: (
        <span>
          Discuss your project within<br />
          24 hours!
        </span>
      ),
      subtitle: null,
      step: 1,
      pageClass: "task-wizard-page lander",
      showVideo: false
    };
  }

  onStepChange(step, idx, all_steps) {
    this.setState({
      title: step && step.title ? step.title : "",
      subtitle: step && step.subtitle ? step.subtitle : null,
      step: idx ? idx + 1 : -1
    });
  }

  getTaskId() {
    if (this.props.params) {
      return this.props.params.taskId;
    }
    return null;
  }

  renderHeaderContent() {
    const dlp_phrase = this.getDLPPhrase();

    return (
      <div className="row">
        <div className="col-sm-6 col-md-8">
          <div className="pitch">
            <h1>
              Software outsourcing<br />
              done right.
            </h1>
            <div className="details">
              Work with verified {this.getDLPDesc() || "developers"}
              <br />
              while in control of costs, progress and quality.
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="task-wizard">
            <div>
              {this.state.step == 1 && !this.getTaskId()
                ? <h3 className="">
                    Discuss your project within<br />
                    24 hours!
                  </h3>
                : <div className="heading-3 text-center">
                    {this.state.title}
                  </div>}
              <div>
                <form
                  name="task"
                  role="form"
                  ref="task_form"
                  action="/start-welcome/"
                >
                  <div className="form-group">
                    <div className="row">
                      <div className="col-xs-5">
                        <input
                          type="text"
                          name="first_name"
                          className="form-control"
                          ref="first_name"
                          required
                          placeholder="First Name"
                        />
                      </div>
                      <div className="col-xs-7">
                        <input
                          type="text"
                          name="last_name"
                          className="form-control"
                          ref="last_name"
                          required
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        ref="email"
                        required
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn cta-action">
                    <span>
                      <i className="tunga-icon-rocket fa-lg" />{" "}
                    </span>
                    {dlp_phrase
                      ? `Start hiring ${dlp_phrase}`
                      : "Get me started"}!
                  </button>
                </form>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </div>
      </div>
    );
  }
}
