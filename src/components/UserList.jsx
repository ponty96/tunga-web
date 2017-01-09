import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import UserCard from './UserCard';

export default class UserList extends React.Component {

    static propTypes = {
        Auth: PropTypes.object.isRequired,
        users: PropTypes.array.isRequired,
        updateConnection: PropTypes.func.isRequired,
        deleteConnection: PropTypes.func.isRequired,
        createConnection: PropTypes.func.isRequired,
        filter: PropTypes.string.isRequired
    }
    render() {
        const {
            Auth,
            updateConnection,
            deleteConnection,
            createConnection,
            filter,
            users} = this.props;
            console.log(users)
        return (
            <div>
                <div className="row flex-row">
                    {users.map((user,id) => {
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
            </div>
        );
    }
}


