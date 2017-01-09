import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import UserCardProfile from './UserCardProfile';
import TagList from './TagList';

export default class UserCard extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        updateConnection: PropTypes.func.isRequired,
        deleteConnection: PropTypes.func.isRequired,
        createConnection: PropTypes.func.isRequired,
    }
    handleConnectRequest() {
        const { createConnection, user } = this.props;
        createConnection({ to_user: user.id });
    }

    handleConnectResponse(accepted = false) {
        const { updateConnection, user } = this.props;
        updateConnection(user.request, { accepted, responded: true });
    }

    handleDeleteConnection() {
        const { deleteConnection, user, hideOnDisconnect } = this.props;
        if (user.connection) {
            deleteConnection(user.connection.id, user, hideOnDisconnect);
        }
    }

    render() {
        const { Auth, user } = this.props;
        var connection_msg = 'Send friend request';
        var remove_msg = 'Remove friend';
        if (Auth.user.is_project_owner) {
            connection_msg = 'Add to my team';
            remove_msg = 'Remove from my team';
        } else if (user.is_project_owner) {
            connection_msg = 'Send request to join team';
            remove_msg = 'Leave team';
        }

        return (
            <div className="card user-card">
                <UserCardProfile user={user} />
                <div style={{ minHeight: user.is_developer ? '20px' : '40px' }}>
                    {user.profile ? (
                        <div>
                            {!user.is_developer ? (
                                <div className="secondary">Skills I need:</div>
                            ) : null}
                            {user.profile.skills.length ? (
                                <TagList tags={user.profile.skills} max={3} linkPrefix="/people/skill/" moreLink={`/people/${user.username}/`} />
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="short-description">
                    {user.profile ? (
                        <div dangerouslySetInnerHTML={{ __html: user.profile.bio }} />
                    ) : null}
                </div>
                <div className="actions">
                    <div className="row">
                        <div className="col-sm-12">
                            <Link to={`/people/${user.username}/`} className="btn btn-block ">Go to profile</Link>
                        </div>
                    </div>

                    {user.can_connect ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <button type="button" className="btn btn-block "
                                    onClick={this.handleConnectRequest.bind(this)}>{connection_msg}</button>
                            </div>
                        </div>
                    ) : (
                            user.request ? (
                                <div className="row">
                                    <div className="col-sm-6">
                                        <button type="button" className="btn btn-block "
                                            onClick={this.handleConnectResponse.bind(this, true)}>Accept Request</button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button type="button" className="btn btn-block "
                                            onClick={this.handleConnectResponse.bind(this, false)}>Decline Request</button>
                                    </div>
                                </div>
                            ) : null)}
                    {user.connection && user.connection.accepted ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <button type="button" className="btn btn-block "
                                    onClick={this.handleDeleteConnection.bind(this)}>{remove_msg}</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
