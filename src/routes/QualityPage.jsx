import React from "react";

import ShowcaseContainer from "../containers/ShowcaseContainer";
import MetaTags from "../components/MetaTags";

const STEP_DETAILS = [
  {
    title: "1. Soft skills",
    description:
      'We assess our developers on several "soft skills". Such as communication skills, management of expectations, work ethics, stress mangement and Time management. At Tunga we believe that soft skills are as much or more important than development skills',
    icon: "tunga-icon-soft-skills"
  },
  {
    title: "2. Coding skills",
    description:
      "When the developer has passed our soft skills assessment we thoroughly test their coding skills. We do this in several ways: Checking recent projects, coding tests and Skype interviews. We only select the best developers to go to the next stage of our program.",
    icon: "tunga-icon-coding-skills"
  },
  {
    title: "3. Learning on the job",
    description:
      "When a developer passed all our assessments he or she gets to work on a first project on Tunga. For the first couple of projects the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s).",
    icon: "tunga-icon-teamwork"
  }
];

export default class QualityPage extends React.Component {
  renderHeaderContent() {
    return (
      <div>
        <h1>Our quality assurance program</h1>
      </div>
    );
  }

  render() {
    let meta_title = "Tunga | Quality";
    let meta_description = "Our quality assurance program";

    return (
      <ShowcaseContainer
        className="quality-page"
        headerContent={this.renderHeaderContent()}
      >
        <MetaTags title={meta_title} description={meta_description} />

        <section>
          <div className="container">
            <div className="step-slider three-sm clearfix">
              <ul>
                {STEP_DETAILS.map((step, idx) => {
                  return (
                    <li key={idx}>
                      <div
                        className="slide animated slideInRight"
                        style={{ animationDelay: `${idx}s` }}
                      >
                        <div
                          className="title"
                          dangerouslySetInnerHTML={{ __html: step.title }}
                        />
                        <div className="icon">
                          {step.icon
                            ? <i className={step.icon} />
                            : <img src={step.image} />}
                        </div>
                        <div
                          className="description"
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </ShowcaseContainer>
    );
  }
}
