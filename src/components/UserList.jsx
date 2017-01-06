import React from 'react';
import { Link, IndexLink } from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import UserCard from './UserCard';
import SearchBox from './SearchBox';

export default class UserList extends React.Component {

    render() {
        const {
            Auth,
            User,
            updateConnection,
            deleteConnection,
            createConnection,
            listUsers,
            listMoreUsers,
            filter,
            skill,
            requests} = this.props;

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
                {User.list.isFetching ?
                    (<Progress />)
                    :
                    (<div>
                        <div className="row flex-row">
                            {User.list.ids.map((id) => {
                                const user = User.list.users[id];
                                return (
                                    <div className="col-sm-6 col-md-4" key={id}>
                                        <UserCard Auth={Auth} user={user}
                                            deleteConnection={deleteConnection}
                                            createConnection={createConnection}
                                            updateConnection={updateConnection}
                                            hideOnDisconnect={filter == 'team'} />
                                    </div>
                                );
                            })}
                        </div>
                        <LoadMore url={User.list.next} callback={listMoreUsers}
                            loading={User.list.isFetchingMore} />
                        {User.list.ids.length ? null : (
                            <div className="alert alert-info">No users match your query</div>
                        )}
                    </div>)
                }
            </div>
        );
    }
}
