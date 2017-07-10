import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Progress from "../components/status/Progress";

import * as AuthActions from "../actions/AuthActions";
import * as NavActions from "../actions/NavActions";
import * as UserSelectionActions from "../actions/UserSelectionActions";
import * as SkillSelectionActions from "../actions/SkillSelectionActions";

import { PROFILE_COMPLETE_PATH } from "../constants/patterns";

import { initNavUIController } from "../utils/ui";
import { runOptimizely } from "../utils/html";
import {
  requiresAuth,
  requiresNoAuth,
  requiresAuthOrEmail
} from "../utils/router";

class App extends React.Component {
  getChildContext() {
    const { router } = this.context;
    return { router };
  }

  componentDidMount() {
    if (!this.props.Auth.isVerifying) {
      this.props.AuthActions.verify();
    }

    initNavUIController();

    runOptimizely();
  }

  componentDidUpdate(prevProps, prevState) {
    const { router } = this.context;
    const { Auth, location, NavActions, AuthActions, routes } = this.props;
    if (
      prevProps.location.pathname != location.pathname ||
      prevProps.Auth.isAuthenticated != Auth.isAuthenticated ||
      (prevProps.Auth.isVerifying != Auth.isVerifying && !Auth.isVerifying)
    ) {
      if (requiresNoAuth(routes) && Auth.isAuthenticated) {
        var next = Auth.next;
        if (!next) {
          next = location.query.next || "/home";
        }
        if (/^\/api\//i.test(next)) {
          window.location.href = next;
        } else {
          router.replace(next);
        }
        return;
      }

      if (
        requiresAuthOrEmail(routes) &&
        !Auth.isAuthenticated &&
        !Auth.isEmailVisitor
      ) {
        AuthActions.authRedirect(location.pathname);
        router.replace("/?next=" + location.pathname);
        return;
      }

      if (requiresAuth(routes) && !Auth.isAuthenticated) {
        AuthActions.authRedirect(location.pathname);
        router.replace("/?next=" + location.pathname);
        return;
      }
    }

    if (
      Auth.isAuthenticated &&
      !Auth.user.type &&
      !PROFILE_COMPLETE_PATH.test(location.pathname)
    ) {
      router.replace("/profile/complete?next=" + location.pathname);
      return;
    }

    if (
      Auth.isAuthenticated &&
      Auth.user.type &&
      PROFILE_COMPLETE_PATH.test(location.pathname)
    ) {
      router.replace("/home?next=" + location.pathname);
      return;
    }

    if (
      prevProps.Auth.isAuthenticating != Auth.isAuthenticating &&
      !Auth.isAuthenticating &&
      Auth.isEmailVisitor
    ) {
      router.replace("/people/");
    }

    if (prevProps.location.pathname != location.pathname) {
      NavActions.reportPathChange(
        prevProps.location.pathname,
        location.pathname
      );
    }

    runOptimizely();
  }

  handleAppClick() {
    const { UserSelectionActions, SkillSelectionActions } = this.props;
    UserSelectionActions.invalidateUserSuggestions();
    SkillSelectionActions.invalidateSkillSuggestions();
  }

  onClosePopup() {
    const { Auth, routes, location } = this.props;
    const { router } = this.context;

    this.close();
    if (requiresAuth(routes) && !Auth.isAuthenticated) {
      AuthActions.authRedirect(location.pathname);
      router.replace("/?next=" + location.pathname);
    }
  }

  renderChildren() {
    return React.Children.map(
      this.props.children,
      function(child) {
        return React.cloneElement(child, {
          Auth: this.props.Auth,
          AuthActions: this.props.AuthActions,
          location: this.props.location,
          onAppClick: this.handleAppClick.bind(this)
        });
      }.bind(this)
    );
  }

  render() {
    const { Auth } = this.props;
    return (
      <div style={{ height: "100%" }}>
        {Auth.isVerifying
          ? <div className="app-loading">
              <div>
                <img src={require("../images/logo.png")} height="50px" />
              </div>
              <Progress message="Initializing ..." />
            </div>
          : null}
        <div
          style={{
            height: "100%",
            display: Auth.isVerifying ? "none" : "block"
          }}
        >
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { Auth: state.Auth };
}

function mapDispatchToProps(dispatch) {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    NavActions: bindActionCreators(NavActions, dispatch),
    UserSelectionActions: bindActionCreators(UserSelectionActions, dispatch),
    SkillSelectionActions: bindActionCreators(SkillSelectionActions, dispatch)
  };
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

App.childContextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
