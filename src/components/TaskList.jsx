import React from 'react';
import { Link, IndexLink } from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import TaskCard from './TaskCard';
import SearchBox from './SearchBox';

export default class TaskList extends React.Component {

    componentDidMount() {
        this.props.TaskActions.listTasks({filter: this.getFilter(), skill: this.getSkill(), ...this.props.filters, search: this.props.search});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location && this.props.location && prevProps.location.pathname != this.props.location.pathname || prevProps.search != this.props.search) {
            this.props.TaskActions.listTasks({filter: this.getFilter(), skill: this.getSkill(), ...this.props.filters, search: this.props.search});
        }
    }

    getFilter() {
        if(this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    getSkill() {
        if(this.props.params && this.props.params.skill) {
            return this.props.params.skill;
        }
        return null;
    }

    render() {
        const { Auth, Task, TaskActions, hide_header } = this.props;
        let filter = this.getFilter();
        let skill = this.getSkill();

        return (
            <div>
                {hide_header?null:(
                <div>
                    <h2>{filter == 'my-tasks' && !Auth.user.is_developer?'My ':''}Tasks</h2>
                    {filter == 'my-tasks' && !Auth.user.is_developer?null:(
                    <ul className="nav nav-pills nav-top-filter">
                        <li role="presentation"><IndexLink to="/task" activeClassName="active">All Tasks</IndexLink></li>
                        <li role="presentation"><Link to="/task/filter/skills" activeClassName="active">My Skills</Link></li>
                        <li role="presentation"><Link to="/task/filter/project-owners" activeClassName="active">My Clients</Link></li>
                        {skill?(
                            <li role="presentation" style={{marginLeft: '20px'}}>
                                <Link to={`/task/skill/${skill}`} activeClassName="active"><i className="tunga-icon-tag"/> {skill}</Link>
                            </li>
                        ):null}
                    </ul>
                        )}
                    <SearchBox placeholder="Search for tasks"
                               filter={{filter, skill, ...this.props.filters}}
                               onSearch={TaskActions.listTasks}
                               count={Task.list.count}/>
                </div>
                    )}
                {Task.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {Task.list.ids.map((id) => {
                                const task = Task.list.tasks[id];
                                return(
                                <div className="col-sm-6 col-md-4" key={id}>
                                    <TaskCard Auth={Auth} Task={Task} task={task} TaskActions={TaskActions}/>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={Task.list.next} callback={TaskActions.listMoreTasks} loading={Task.list.isFetchingMore}/>
                        {Task.list.ids.length?'':(
                        <div className="alert alert-info">No tasks match your query</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
