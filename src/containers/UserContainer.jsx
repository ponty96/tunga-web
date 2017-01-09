import React, { PropTypes } from 'react';
import UserList from './../components/UserList';
import SearchBox from './../components/SearchBox';
import { Link, IndexLink } from 'react-router';
import LoadMore from './../components/status/LoadMore';
import Progress from './../components/status/Progress';

export default class UserContainer extends React.Component {
  static propTypes = {
        Auth: PropTypes.object.isRequired,
        User: PropTypes.object.isRequired,
        UserActions: PropTypes.shape({
          updateConnection: PropTypes.func.isRequired,
          deleteConnection: PropTypes.func.isRequired,
          createConnection: PropTypes.func.isRequired, 
          listUsers: PropTypes.func.isRequired,
          listMoreUsers: PropTypes.func.isRequired,
        })
    }

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
        {this.props.hide_header ? null : (
          <div>
            <div className="clearfix">
              <div className="pull-right">
                <SearchBox placeholder="Search by name or skills"
                  filter={{ filter, skill }}
                  onSearch={listUsers}
                  count={User.list.count} />
              </div>
              <h2 className="pull-left">People</h2>
            </div>
            <div className="nav-top-filter">
              <Link to="/people/filter/developers" activeClassName="active">Coders</Link>
              {Auth.isAuthenticated ? (
                [
                  Auth.user.is_staff ? (
                    <Link to="/people/filter/clients" key="clients"
                      activeClassName="active">Clients</Link>) : null,
                  <Link to="/people/filter/team" activeClassName="active" key="team">
                    {Auth.user.is_developer ? 'My friends' : 'My team'}
                  </Link>,
                  Auth.user.is_developer ? (
                    <Link to="/people/filter/my-clients" key="my-clients" activeClassName="active">My Clients</Link>
                  ) : null,
                  <Link to="/people/filter/requests" activeClassName="active" key="requests"
                    style={{ marginLeft: '20px' }}>
                    Requests {requests ? <span className="badge">{requests}</span> : null}
                  </Link>,
                  Auth.user.is_project_owner || Auth.user.is_staff ? (
                    <Link to="/people/filter/relevant" key="relevant" activeClassName="active">Relevant to
                                            me</Link>
                  ) : null
                ]
              ) : null}
              {skill ? (
                <Link to={`/people/skill/${skill}/`} className="active" style={{ marginLeft: '20px' }}>
                  <i className="tunga-icon-tag" /> {skill}
                </Link>
              ) : null}
            </div>
          </div>
        )}
        <div>
          {this.renderUserList()}
        </div>
      </div>
    );
  }

  renderUserList = () => {
    const {
      Auth,
      User,
      updateConnection,
      deleteConnection,
      createConnection,
      listMoreUsers,
      filter} = this.props;

    if (User.list.isFetching) {
      return <Progress />
    } else {
      return (
        <div>
          <UserList
            updateConnection={updateConnection}
            deleteConnection={deleteConnection}
            createConnection={createConnection}
            Auth={Auth}
            User={User}
            users={this.getUsers(User)}
            filter={filter} />
          <LoadMore url={User.list.next} callback={listMoreUsers}
            loading={User.list.isFetchingMore} />
          {User.list.ids.length ? null : (
            <div className="alert alert-info">No users match your query</div>
          )}
        </div>
      )

    }
  }

  getUsers = (User) => {
    console.log(User)
    if (User.list.count > 0) {
      return User.list.ids.map(id => (User.list.users[id]))
    }
    return []
  }
}