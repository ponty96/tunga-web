import React from "react";
import Progress from "./../components/status/Progress";
import FormStatus from "./../components/status/FormStatus";
import VisibilitySetting from "./../components/VisibilitySetting";
import SwitchSetting from "./../components/SwitchSetting";
import connect from "../utils/connectors/SettingsConnector";

import * as UserSettings from "../utils/UserSettings";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { switches: null, visibility: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { SettingsActions } = this.props;
    SettingsActions.retrieveSettings();
  }

  onVisibilitySettingChange(setting) {
    this.setState({ visibility: { ...this.state.visibility, ...setting } });
  }

  onSwitchSettingChange(setting) {
    this.setState({ switches: { ...this.state.switches, ...setting } });
  }

  handleSubmit(e) {
    e.preventDefault();
    var settings = {
      switches: this.state.switches,
      visibility: this.state.visibility
    };

    const { SettingsActions } = this.props;

    SettingsActions.updateSettings(settings);
    return;
  }

  render() {
    const { Auth, Settings } = this.props;
    const { settings } = Settings;

    var user_switches = [
      UserSettings.DAILY_UPDATE_EMAIL,
      //UserSettings.DIRECT_MESSAGES_EMAIL,
      UserSettings.NEW_FRIEND_REQUEST_EMAIL
    ];

    if (Auth.user.is_developer) {
      user_switches = user_switches.concat([
        UserSettings.FRIEND_REQUEST_RESPONSE_EMAIL,
        UserSettings.JOIN_TEAM_REQUEST_RESPONSE_EMAIL,
        UserSettings.NEW_TEAM_INVITATION_EMAIL
        //UserSettings.NEW_TASK_EMAIL,
        //UserSettings.NEW_TASK_INVITATION_EMAIL,
        //UserSettings.TASK_APPLICATION_RESPONSE_EMAIL,
        //UserSettings.TASK_PROGRESS_REPORT_REMINDER_EMAIL
      ]);
    } else {
      user_switches = user_switches.concat([
        UserSettings.TEAM_INVITATION_RESPONSE_EMAIL
        //UserSettings.NEW_TASK_APPLICATION_EMAIL,
        //UserSettings.TASK_INVITATION_RESPONSE_EMAIL
      ]);
    }

    user_switches.push(UserSettings.TASK_ACTIVITY_UPDATE_EMAIL);

    if (Auth.user.is_developer) {
      user_switches.push(UserSettings.PAYMENT_UPDATE_EMAIL);
    } else {
      user_switches.push(UserSettings.PAYMENT_REQUEST_EMAIL);
    }

    return (
      <div className="form-wrapper settings">
        <h2>Settings</h2>
        {Settings.isRetrieving
          ? <Progress />
          : <div>
              <div>
                <FormStatus
                  loading={Settings.isSaving}
                  success={Settings.isSaved}
                  message={"Settings updated successfully"}
                  error={Settings.error.update || Settings.error.update}
                />

                {Auth.user.is_developer
                  ? null
                  : <div>
                      <h4 className="title">Privacy settings</h4>
                      {UserSettings.VISIBILITY_SETTINGS.map(setting => {
                        return (
                          <div key={setting.name} className="form-group row">
                            <div className="col-md-3">
                              {setting.label}
                            </div>
                            <div className="col-md-9">
                              <VisibilitySetting
                                name={setting.name}
                                visibility={settings.visibility[setting.name]}
                                onChange={this.onVisibilitySettingChange.bind(
                                  this
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>}

                <h4 className="title">Email Settings</h4>
                {UserSettings.SWITCH_SETTINGS.map(setting => {
                  if (user_switches.indexOf(setting.name) == -1) {
                    return null;
                  }
                  return (
                    <div key={setting.name} className="form-group row">
                      <div className="col-md-3">
                        {setting.label}
                      </div>
                      <div className="col-md-9">
                        <SwitchSetting
                          name={setting.name}
                          status={settings.switches[setting.name]}
                          buttons={setting.buttons}
                          onChange={this.onSwitchSettingChange.bind(this)}
                        />
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className="btn "
                  disabled={Settings.isSaving}
                  onClick={this.handleSubmit}
                >
                  Save Changes
                </button>
                <div className="clearfix" />
              </div>
            </div>}
      </div>
    );
  }
}

export default connect(Settings);
