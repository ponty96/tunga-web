import React from "react";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as UtilityActions from "../actions/UtilityActions";
import Success from "../components/status/Success";
import Error from "../components/status/Error";
import ShowcaseContainer from "../containers/ShowcaseContainer";

import ComponentWithModal from "../components/ComponentWithModal";
import LargeModal from "../components/LargeModal";
import MetaTags from "../components/MetaTags";

import {
  OFFER_REQUEST_ITEMS,
  TASK_SCOPE_TASK,
  TASK_SCOPE_PROJECT
} from "../constants/Api";
import { openCalendlyWidget } from "../utils/router";

let checkMark = <i className="fa fa-check" />;

let crossMark = <i className="fa fa-times" />;

const OFFER_DETAILS = [
  {
    title: "Tasks",
    sub: "Post your task on Tunga",
    description: (
      <div>
        <p>Instant access to developers</p>
        <p>Clean up your features backlog</p>
        <p>Get bugs squashed on the fly</p>
      </div>
    ),
    icon: "tunga-icon-do-it-yourself",
    key: OFFER_REQUEST_ITEMS.self_guided,
    cta: {
      text: "Get your task started",
      link: `/start/?scope=${TASK_SCOPE_TASK}`
    },
    perks: [
      "FREE",
      "€19/hr",
      "< 8 hours",
      "< 21 hours",
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      crossMark,
      crossMark
    ]
  },
  {
    title: "Projects",
    sub: "Post your project on Tunga",
    description: (
      <div>
        <p>Discuss your project with project engineers</p>
        <p>Get an estimate within 48 hrs</p>
        <p>Experienced project managers on demand</p>
      </div>
    ),
    icon: "tunga-icon-intensive-guildance",
    key: OFFER_REQUEST_ITEMS.onboarding,
    cta: {
      text: "Get your project started",
      link: `/start/?scope=${TASK_SCOPE_PROJECT}`
    },
    perks: [
      "FREE",
      "€19/hr",
      "< 48 hours",
      "> 21 hours",
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      "€39/hr (optional)"
    ]
  },
  {
    title: "Remote Team",
    sub: "Hire developers for your ongoing software need",
    description: (
      <div>
        <p>Find a great match</p>
        <p>On-board developers to your workflow</p>
        <p>No long-term commitments</p>
      </div>
    ),
    icon: "tunga-icon-dedicated-monitor",
    key: OFFER_REQUEST_ITEMS.project,
    cta: {
      text: "Talk with us",
      action: function() {
        openCalendlyWidget();
      }
    },
    perks: [
      "FREE",
      "€19/hr",
      "< 72 hours",
      "> 40 hours",
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      checkMark,
      "€39/hr (optional)"
    ]
  }
];

class PricingPage extends ComponentWithModal {
  renderHeaderContent() {
    return (
      <div>
        <h1>Flexible and affordable</h1>
      </div>
    );
  }

  render() {
    let meta_title = "Tunga | Pricing";
    let meta_description =
      "Tunga offers flexible and affordable pricing. Choose from 3 different plans.";

    return (
      <ShowcaseContainer
        className="pricing-page"
        headerContent={this.renderHeaderContent()}
      >
        <MetaTags title={meta_title} description={meta_description} />

        <section className="pricing-options">
          <div className="container">
            <div className="pricing-table">
              <div className="step-slider four-sm clearfix">
                <ul>
                  <li className="table-key">
                    <div>
                      <p>Browse and connect with developers</p>
                      <p>Hourly fee</p>
                      <p>Response time</p>
                      <p>Workload</p>
                      <p>Verified skills guarantee</p>
                      <p>Progress tracking</p>
                      <p>Quality tracking</p>
                      <p>Access to custom integrations</p>
                      <p>Daily progress reports</p>
                      <p>Weekly progress reports</p>
                      <p>Dedicated project manager (optional)</p>
                    </div>
                  </li>
                  {OFFER_DETAILS.map((offer, idx) => {
                    return (
                      <li key={offer.key}>
                        <div className="slide">
                          <h2>
                            {offer.title}
                          </h2>
                          <div className="description">
                            {offer.description}
                          </div>
                          <div className="perks">
                            {offer.perks &&
                              offer.perks.map(comp => {
                                return (
                                  <p>
                                    {comp}
                                  </p>
                                );
                              })}
                          </div>
                          <div>
                            {offer.cta
                              ? offer.cta.action
                                ? <button
                                    className="btn"
                                    onClick={offer.cta.action.bind(this)}
                                  >
                                    {offer.cta.text}
                                  </button>
                                : offer.cta.link
                                  ? <Link to={offer.cta.link} className="btn">
                                      {offer.cta.text}
                                    </Link>
                                  : null
                              : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ShowcaseContainer>
    );
  }
}

function mapStateToProps(state) {
  return { Utility: state.Utility };
}

function mapDispatchToProps(dispatch) {
  return {
    UtilityActions: bindActionCreators(UtilityActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PricingPage);
