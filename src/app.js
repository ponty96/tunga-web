import 'babel-polyfill'; // Add Promises polyfill to global environment

//Import local css
import 'react-widgets/lib/less/react-widgets.less';
import "css/style.less";

// Local JS
import "script!js/js.cookie.js";

import React from 'react';
import ReactDOM  from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import store from './store';
import history from './history';


if(__PRODUCTION___) {
    history.listen(location => {
        window.ga('send', 'pageview');
        window.twq('track', 'PageView');
    });
}

import App from 'containers/App';
import AppWrapper from 'containers/AppWrapper';
import LandingPage from 'containers/LandingPage';
import PricingPage from 'containers/PricingPage';
import HowItWorksPage from 'containers/HowItWorksPage';
import Home from 'containers/Home';
import SignInPage from 'containers/SignInPage';
import AccountType from 'containers/AccountType';
import SignUpPage from 'containers/SignUpPage';
import DeveloperApplication from 'containers/DeveloperApplication';
import PasswordResetPage from 'containers/PasswordResetPage';
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage';
import SettingsPage from 'containers/SettingsPage';
import ProjectPage from 'containers/ProjectPage';
import ProjectForm from 'components/ProjectForm';
import Project from 'components/Project';
import ProjectDetail from 'components/ProjectDetail';
import TaskPage from 'containers/TaskPage';
import TaskList from 'components/TaskList';
import TaskForm from 'components/TaskForm';
import Task from 'components/Task';
import ApplicationForm from 'components/ApplicationForm';
import TaskWorflow from 'components/TaskWorflow';
import ApplicationList from 'components/ApplicationList';
import MilestonePage from 'containers/MilestonePage';
import Milestone from 'components/Milestone';
import IntegrationList from 'components/IntegrationList';
import TaskPay from 'components/TaskPay';
import Participation from 'components/Participation';
import RateDevelopers from 'components/RateDevelopers';
import UserPage from 'containers/UserPage';
import UserList from 'components/UserList';
import UserContainer from 'containers/UserContainer';
import User from 'components/User';
import InviteDeveloper from 'containers/InviteDeveloper';
import MessagePage from 'containers/MessagePage';
import ChannelContainer from 'containers/ChannelContainer';
import ChannelForm from 'components/ChannelForm';
import ChatBox from 'components/ChatBox';
import MessageList from 'components/MessageList';
import ProfilePage from 'containers/ProfilePage';
import Profile from 'components/Profile';
import Stack from 'components/Stack';
import CompanyProfile from 'components/CompanyProfile';
import PaymentMethod from 'components/PaymentMethod';
import Account from 'components/Account';
import IDDocument from 'components/IDDocument';
import ProfilePicture from 'components/ProfilePicture';
import PasswordChangeForm from 'components/PasswordChangeForm';
import ProfileType from 'components/ProfileType';
import PaymentList from 'components/PaymentList';
import SupportPage from 'containers/SupportPage';
import SupportSectionList from 'components/SupportSectionList';
import SupportPageDetail from 'components/SupportPageDetail';
import SearchPage from 'containers/SearchPage';
import SupportPageList from 'components/SupportPageList';

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={LandingPage} unauthedOnly={true}/>
                <Route unauthedOnly={true}>
                    {/* No Auth Pages */}
                    <Route path="how-it-works" component={HowItWorksPage}/>
                    <Route path="pricing" component={PricingPage}/>
                    <Route path="press" component={LandingPage}/>
                    <Route path="FAQ" component={LandingPage}/>
                    <Route path="signin" component={SignInPage}/>
                    <Route path="signup">
                        <IndexRoute component={AccountType} />
                        <Route path="project-owner" component={SignUpPage} />
                        <Route path="developer">
                            <IndexRoute component={DeveloperApplication}/>
                            <Route path=":confirmationKey" component={SignUpPage} />
                            <Route path="invite/:invitationKey" component={SignUpPage} />
                        </Route>
                    </Route>
                    <Route path="reset-password" component={PasswordResetPage} />
                    <Route path="reset-password/confirm/:uid/:token" component={PasswordResetConfirmPage} />
                    {/* End of No Auth Pages */}
                </Route>

                <Route component={AppWrapper} authedOrEmailOnly={true}>
                    {/* Auth or Email Only Pages */}
                    <Route authedOnly={true}>
                        {/* Auth Only Pages */}
                        <Route path="home" component={Home} />
                        <Route path="profile" component={ProfilePage}>
                            <IndexRedirect to="personal"/>
                            <Route path="personal" component={Profile} />
                            <Route path="stack" component={Stack} />
                            <Route path="company" component={CompanyProfile} />
                            <Route path="payment" component={PaymentMethod} />
                            <Route path="payment/:provider" component={PaymentMethod} />
                            <Route path="account" component={Account} />
                            <Route path="id-document" component={IDDocument} />
                            <Route path="photo" component={ProfilePicture} />
                            <Route path="security" component={PasswordChangeForm} />
                            <Route path="security" component={PasswordChangeForm} />
                            <Route path="complete" component={ProfileType} />
                            <Redirect path="*" to="personal" />
                        </Route>
                        <Route path="settings" component={SettingsPage} />
                        <Route path="project" component={ProjectPage}>
                            <IndexRedirect to="new"/>
                            <Route path="new" component={ProjectForm} />
                            <Route path=":projectId" component={Project}>
                                <IndexRoute component={ProjectDetail}/>
                                <Route path="edit" component={ProjectForm} crumb="Edit"/>
                                <Route path="task" component={TaskForm} crumb="Create Task"/>
                            </Route>
                        </Route>
                        <Route path="task" component={TaskPage}>
                            <IndexRoute component={TaskList}/>
                            <Route path="new" component={TaskForm} />
                            <Route path="filter/:filter" component={TaskList} />
                            <Route path="skill/:skill(/:filter)" component={TaskList} />
                            <Route path=":taskId" component={Task}>
                                <IndexRoute component={TaskWorflow} />
                                <Route path="edit" component={TaskForm} crumb="Edit"/>
                                <Route path="apply" component={ApplicationForm} crumb="Apply"/>
                                <Route path="applications" component={ApplicationList} crumb="Applications"/>
                                <Route path="integrations" component={IntegrationList} crumb="Integrations">
                                    <IndexRedirect to="github" />
                                    <Route path=":provider" crumb="Integrations"/>
                                </Route>
                                <Route path="pay" component={TaskPay} crumb="Pay"/>
                                <Route path="participation" component={Participation} crumb="Participation shares"/>
                                <Route path="rate" component={RateDevelopers} crumb="Rate Developers"/>
                                <Route path="event" component={MilestonePage}>
                                    <Route path=":eventId" component={Milestone}/>
                                </Route>
                            </Route>
                        </Route>
                        <Route path="conversation" component={MessagePage}>
                            <IndexRedirect to="start"/>
                            <Route path="start" component={ChannelForm}>
                                <Route path=":recipientId" />
                            </Route>
                            <Route path=":channelId" component={ChannelContainer}>
                                <IndexRedirect to="messages" />
                                <Route path="edit" component={ChannelForm} />
                                <Route path=":channelView" component={ChatBox} />
                            </Route>
                        </Route>
                        <Redirect path="message*" to="channel"/>
                        <Redirect path="channel*" to="conversation*"/>
                        <Route path="payments" component={TaskPage}>
                            <IndexRoute component={PaymentList}/>
                            <Route path=":filter" component={PaymentList}/>
                        </Route>
                        <Route path="help" component={MessagePage}>
                            <Route path=":channelId" component={ChannelContainer}>
                                <IndexRoute component={ChatBox} />
                            </Route>
                        </Route>
                        {/* End Auth Only Pages */}
                    </Route>

                    <Route path="people" component={UserPage}>
                        <IndexRedirect to="filter/developers" />
                        <Route path="filter/:filter" component={UserContainer} />
                        <Route path="skill/:skill(/:filter)" component={UserContainer} />
                        <Route path="invite" component={InviteDeveloper} />
                        <Route path=":userId" component={User} />
                    </Route>
                    <Redirect path="member*" to="people*"/>
                    <Route path="support" component={SupportPage}>
                        <IndexRoute component={SupportSectionList}/>
                        <Route path=":section">
                            <IndexRoute component={SupportPageList}/>
                            <Route path="tag/:tag" component={SupportPageList} />
                            <Route path=":page" component={SupportPageDetail} />
                        </Route>
                    </Route>
                    <Route path="search" component={SearchPage}>
                        <IndexRedirect to="people"/>
                        <Route path="people" component={UserContainer} />
                        <Route path="developers" component={UserContainer} />
                        <Route path="tasks" component={TaskList} authedOnly={true}/>
                        <Route path="messages" component={MessageList} authedOnly={true}/>
                        <Route path="support" component={SupportPageList} />
                    </Route>
                    {/* End Auth Only or Email Pages */}
                </Route>
                <Route path="customer/help/:chatId" component={LandingPage} unauthedOnly={true}/>
                <Redirect path="*" to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
