import "babel-polyfill"; // Add Promises polyfill to global environment

//Import local css
import "react-widgets/lib/less/react-widgets.less";
import "css/tour.scss";
//import 'react-joyride/lib/react-joyride.scss';
import "css/style.less";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Redirect
} from "react-router";
import store from "./store";
import history from "./history";

history.listen(location => {
  if (__PRODUCTION__) {
    window.ga("send", "pageview");
    window.twq("track", "PageView");
  }
  console.log("Page View sent", location.pathname);
});

if (__PRODUCTION__) {
  // Configure raven
  Raven.config(
    "https://3b4b870154ce496c9d3dd9673a529bb9@sentry.io/121717"
  ).install();
}

import App from "containers/App";
import AppWrapper from "containers/AppWrapper";
import LandingPage from "routes/LandingPage";
import PricingPage from "routes/PricingPage";
import QualityPage from "routes/QualityPage";
import Home from "routes/Home";
import SignInPage from "routes/SignInPage";
import SignUpPage from "routes/SignUpPage";
import PasswordResetPage from "containers/PasswordResetPage";
import PasswordResetConfirmPage from "containers/PasswordResetConfirmPage";
import Agreement from "routes/Agreement";
import PrivacyPolicy from "routes/PrivacyPolicy";
import CodeOfConduct from "routes/CodeOfConduct";
import SettingsPage from "containers/SettingsPage";
import ProjectBoard from "components/ProjectBoard";
import ProjectTaskForm from "components/ProjectTaskForm";
import TaskContainer from "containers/TaskContainer";
import TaskList from "components/TaskList";
import TaskForm from "components/TaskForm";
import EditTaskSectionForm from "components/EditTaskSectionForm";
import TaskDetailPage from "routes/TaskDetailPage";
import ApplicationForm from "components/ApplicationForm";
import TaskWorflow from "components/TaskWorflow";
import ApplicationList from "components/ApplicationList";
import ApplicationDetail from "components/ApplicationDetail";
import MilestoneContainer from "containers/MilestoneContainer";
import Milestone from "components/Milestone";
import MilestoneList from "components/MilestoneList";
import IntegrationList from "components/IntegrationList";
import TaskPay from "components/TaskPay";
import Participation from "components/Participation";
import RateDevelopers from "components/RateDevelopers";
import UserPage from "routes/UserPage";
import UserList from "components/UserList";
import User from "components/User";
import InviteDeveloper from "containers/InviteDeveloper";
import MessagePage from "routes/MessagePage";
import ChannelContainer from "containers/ChannelContainer";
import ChannelForm from "components/ChannelForm";
import ChatBox from "components/ChatBox";
import MessageList from "components/MessageList";
import ProfilePage from "routes/ProfilePage";
import Profile from "components/Profile";
import Stack from "components/Stack";
import CompanyProfile from "components/CompanyProfile";
import PaymentMethod from "components/PaymentMethod";
import TaxInfo from "components/TaxInfo";
import Account from "components/Account";
import IDDocument from "components/IDDocument";
import ProfilePicture from "components/ProfilePicture";
import PasswordChangeForm from "components/PasswordChangeForm";
import ProfileType from "components/ProfileType";
import PaymentList from "components/PaymentList";
import SupportPage from "routes/SupportPage";
import SupportSectionList from "components/SupportSectionList";
import SupportPageDetail from "components/SupportPageDetail";
import SearchPage from "routes/SearchPage";
import SupportPageList from "components/SupportPageList";
import EstimateContainer from "containers/EstimateContainer";
import EstimateDetailContainer from "containers/EstimateDetailContainer";
import EstimateForm from "components/EstimateForm";
import EstimateDetail from "components/EstimateDetail";
import QuoteContainer from "containers/QuoteContainer";
import QuoteDetailContainer from "containers/QuoteDetailContainer";
import QuoteForm from "components/QuoteForm";
import QuoteDetail from "components/QuoteDetail";
import TaskWizard from "routes/TaskWizard";
import StoryPage from "routes/StoryPage";
import TaskWizardLander from "routes/TaskWizardLander";
import Planning from "components/Planning";
import MilestoneListContainer from "containers/MilestoneListContainer"

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={LandingPage} unauthedOnly={true} />
        <Route unauthedOnly={true}>
          {/* No Auth Pages */}
          <Route path="welcome">
            <IndexRoute component={TaskWizardLander} />
          </Route>
          <Route path="start">
            <IndexRoute component={TaskWizard} />
            <Route path=":phase/:taskId" component={TaskWizard} />
            <Route path=":phase/:taskId/*" component={TaskWizard} />
            <Route path="*" component={TaskWizard} />
          </Route>
          <Route path="start-welcome">
            <IndexRoute component={TaskWizard} />
            <Route path=":phase/:taskId" component={TaskWizard} />
            <Route path=":phase/:taskId/*" component={TaskWizard} />
            <Route path="*" component={TaskWizard} />
          </Route>
          <Route path="start-outsource">
            <IndexRoute component={TaskWizard} />
            <Route path=":phase/:taskId" component={TaskWizard} />
            <Route path=":phase/:taskId/*" component={TaskWizard} />
            <Route path="*" component={TaskWizard} />
          </Route>
          <Route path="call" component={LandingPage} showCallWidget={true} />
          <Route path="our-story" component={StoryPage} />
          <Route path="quality" component={QualityPage} />
          <Route path="pricing" component={PricingPage} />
          <Route path="press" component={LandingPage} />
          <Route path="FAQ" component={LandingPage} />
          <Route path="press" component={LandingPage} />
          <Route path="agreement" component={Agreement} />
          <Route path="privacy" component={PrivacyPolicy} />
          <Route path="code-of-conduct" component={CodeOfConduct} />
          <Route path="signin" component={SignInPage} />
          <Route path="signup">
            <IndexRedirect to="/signin" />
            <Route path="project-owner" component={SignUpPage} />
            <Route path="invite/:invitationKey" component={SignUpPage} />
            <Route path="developer">
              <Route path="invite/:invitationKey" component={SignUpPage} />
              <Route path=":confirmationKey" component={SignUpPage} />
            </Route>
          </Route>
          <Route path="reset-password" component={PasswordResetPage} />
          <Route
            path="reset-password/confirm/:uid/:token"
            component={PasswordResetConfirmPage}
          />
          {/* End of No Auth Pages */}
        </Route>

        <Route component={AppWrapper} authedOrEmailOnly={true}>
          {/* Auth or Email Only Pages */}
          <Route authedOnly={true}>
            {/* Auth Only Pages */}
            <Route path="home" component={Home} />
            <Route path="profile" component={ProfilePage}>
              <IndexRedirect to="personal" />
              <Route path="personal" component={Profile} />
              <Route path="stack" component={Stack} />
              <Route path="company" component={CompanyProfile} />
              <Route path="payment" component={PaymentMethod} />
              <Route path="payment/:provider" component={PaymentMethod} />
              <Route path="tax" component={TaxInfo} />
              <Route path="account" component={Account} />
              <Route path="id-document" component={IDDocument} />
              <Route path="photo" component={ProfilePicture} />
              <Route path="security" component={PasswordChangeForm} />
              <Route path="security" component={PasswordChangeForm} />
              <Route path="complete" component={ProfileType} />
              <Redirect path="*" to="personal" />
            </Route>
            <Route path="estimate" component={EstimateContainer}>
              <Route path="new" component={EstimateForm} />
            </Route>
            <Route path="settings" component={SettingsPage} />
            <Route path="work" component={TaskContainer}>
              <IndexRoute component={TaskList} />
              <Route path="new" component={TaskForm} />
              <Route path="filter/:filter" component={TaskList} />
              <Route path="skill/:skill(/:filter)" component={TaskList} />
              <Route path=":taskId" component={TaskDetailPage}>
                <IndexRoute component={TaskWorflow} />
                <Route path="edit" crumb="Edit">
                  <IndexRoute component={TaskForm} />
                  {/*<Route path="complete-task" component={EditTaskSectionForm} crumb="Finalize Task"/>*/}
                  <Route
                    path=":editSection"
                    component={EditTaskSectionForm}
                    crumbs={{
                      trello: "Trello",
                      "google-drive": "Google Drive"
                    }}
                  />
                  <Route path="*" component={TaskForm} />
                </Route>
                <Route path="apply" component={ApplicationForm} crumb="Apply" />
                <Route
                  path="estimate"
                  component={EstimateContainer}
                  crumb="Estimate"
                >
                  <IndexRedirect to="new" />
                  <Route path="new" component={EstimateForm} />
                  <Route path=":estimateId" component={EstimateDetailContainer}>
                    <IndexRoute component={EstimateDetail} />
                    <Route path="edit" component={EstimateForm} />
                  </Route>
                </Route>
                <Route path="quote" component={QuoteContainer} crumb="Quote">
                  <IndexRedirect to="new" />
                  <Route path="new" component={QuoteForm} />
                  <Route path=":quoteId" component={QuoteDetailContainer}>
                    <IndexRoute component={QuoteDetail} />
                    <Route path="edit" component={QuoteForm} />
                  </Route>
                </Route>
                <Route path="quote" component={EstimateForm} crumb="Quote" />
                <Route path="applications">
                  <IndexRoute
                    component={ApplicationList}
                    crumb="Applications"
                  />
                  <Route path=":applicationId" component={ApplicationDetail} />
                </Route>
                <Route
                  path="board"
                  component={ProjectBoard}
                  crumb="Project Board"
                />
                <Route
                  path="task/new"
                  component={ProjectTaskForm}
                  crumb="Add task"
                />
                <Route
                  path="task/new/*"
                  component={ProjectTaskForm}
                  crumb="Add task"
                />
                <Route path="integrations" crumb="Integrations">
                  <IndexRedirect to="github" component={IntegrationList} />
                  <Route path="trello" component={TaskForm} crumb="Trello" />
                  <Route
                    path="google"
                    component={TaskForm}
                    crumb="Google Drive"
                  />
                  <Route
                    path=":provider"
                    component={IntegrationList}
                    crumb="Integrations"
                    crumbs={{ slack: "Slack", github: "GitHub" }}
                  />
                </Route>
                <Route path="pay" component={TaskPay} crumb="Make Payment" />
                <Route
                  path="participation"
                  component={Participation}
                  crumb="Participation shares"
                />
                <Route
                  path="rate"
                  component={RateDevelopers}
                  crumb="Rate Developers"
                />
                <Route path="event" component={MilestoneContainer}>
                  <Route path=":eventId" component={Milestone} />
                </Route>
                <Route
                  path="planning"
                  component={MilestoneListContainer}
                  crumb="Planning"
                >
                  <IndexRoute component={Planning} />
                </Route>
              </Route>
              <Route path="*" component={TaskForm} />
            </Route>
            <Redirect path="task*" to="work*" />
            <Route path="conversation" component={MessagePage}>
              <IndexRedirect to="start" />
              <Route path="start" component={ChannelForm}>
                <Route path=":recipientId" />
                <Route path="task/:taskId" />
              </Route>
              <Route path=":channelId" component={ChannelContainer}>
                <IndexRedirect to="messages" />
                <Route path="edit" component={ChannelForm} />
                <Route path=":channelView" component={ChatBox} />
              </Route>
            </Route>
            <Redirect path="message*" to="channel" />
            <Redirect path="channel*" to="conversation*" />
            <Route path="payments" component={TaskContainer}>
              <IndexRoute component={PaymentList} />
              <Route path=":filter" component={PaymentList} />
            </Route>
            <Route path="help" component={MessagePage}>
              <Route path=":channelId" component={ChannelContainer}>
                <IndexRoute component={ChatBox} />
              </Route>
            </Route>
            <Route path="dashboard">
              <Route path="updates" component={MilestoneContainer}>
                <IndexRoute component={MilestoneList} />
                <Route path="filter/:filter" component={MilestoneList} />
              </Route>
            </Route>
            {/* End Auth Only Pages */}
          </Route>

          <Route path="people" component={UserPage}>
            <IndexRedirect to="filter/developers" />
            <Route path="filter/:filter" component={UserList} />
            <Route path="skill/:skill(/:filter)" component={UserList} />
            <Route path="invite" component={InviteDeveloper} />
            <Route path=":userId" component={User} />
          </Route>
          <Redirect path="member*" to="people*" />
          <Route path="support" component={SupportPage}>
            <IndexRoute component={SupportSectionList} />
            <Route path=":section">
              <IndexRoute component={SupportPageList} />
              <Route path="tag/:tag" component={SupportPageList} />
              <Route path=":page" component={SupportPageDetail} />
            </Route>
          </Route>
          <Route path="search" component={SearchPage}>
            <IndexRedirect to="people" />
            <Route path="people" component={UserList} />
            <Route path="developers" component={UserList} />
            <Route path="tasks" component={TaskList} authedOnly={true} />
            <Route path="messages" component={MessageList} authedOnly={true} />
            <Route path="support" component={SupportPageList} />
          </Route>
          {/* End Auth Only or Email Pages */}
        </Route>
        <Route
          path="customer/help/:chatId"
          component={LandingPage}
          unauthedOnly={true}
        />
        <Redirect path="*" to="home" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("content")
);
