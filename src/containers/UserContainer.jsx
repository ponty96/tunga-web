import React from 'react';
import UserList from './../components/UserList';

export default class UserContainer extends React.Component {
  componentDidMount() {
    this.props.UserActions.listUsers({
      filter: this.getFilter(),
      skill: this.getSkill(), ...this.props.filters,
      search: this.props.search
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location && this.props.location && prevProps.location.pathname != this.props.location.pathname || prevProps.search != this.props.search) {
      this.props.UserActions.listUsers({
        filter: this.getFilter(),
        skill: this.getSkill(), ...this.props.filters,
        search: this.props.search
      });
    }
  }

  getFilter() {
    if (this.props.params && this.props.params.filter) {
      return this.props.params.filter;
    }
    return null;
  }

  getSkill() {
    if (this.props.params && this.props.params.skill) {
      return this.props.params.skill;
    }
    return null;
  }

  render() {
    const {Auth, User, Notification,
      UserActions: {
        updateConnection,
        deleteConnection,
        createConnection,
        listUsers,
        listMoreUsers
      }, params} = this.props;
    const requests = Notification && Notification.notifications ? Notification.notifications.requests : 0;

    let filter = this.getFilter();
    let skill = this.getSkill();
    return (
      <div>
        <UserList
          updateConnection={updateConnection}
          deleteConnection={deleteConnection}
          createConnection={createConnection}
          listUsers={listUsers}
          listMoreUsers={listMoreUsers}
          filter={filter}
          skills={skill}
          request={requests}
          Auth={Auth}
          User={User} />
      </div>
    );
  }
}