import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import Progress from './status/Progress';
import TagList from './TagList';
import Avatar from './Avatar';
import LargeModal from './ModalLarge';
import ApplicationForm from './ApplicationForm';
import ComponentWithModal from './ComponentWithModal';
import { render_excerpt } from '../utils/html';
import { parse_task_status } from '../utils/tasks';

export default class TaskCard extends ComponentWithModal {

    handleApplication() {
        this.open();
    }

    handleSaveTask() {
        const { TaskActions, task } = this.props;
        TaskActions.createSavedTask({task: task.id});
    }

    getSplitFee() {
        const { Auth, task } = this.props;
        var context_fee = 0;
        if(task && task.amount) {
            if(Auth.user.is_developer) {
                context_fee = task.amount.developer;
            } else {
                context_fee = task.amount.pledge;
            }
        }
        let float_fee = parseFloat(context_fee).toFixed(2);
        let whole_part = Math.floor(float_fee);
        return {whole: whole_part, decimal: float_fee.substring(whole_part.toString().length+1) || '00'}
    }

    render() {
        const { Auth, Task, TaskActions, task } = this.props;
        var task_status = parse_task_status(task);
        let split_fee = this.getSplitFee();

        return (
            <div className="card task-card">
                <LargeModal title={<div>Apply for Task: <Link to={`/task/${task.id}/`}>{task.title}</Link></div>} show={this.state.showModal} onHide={this.close.bind(this)}>
                    <ApplicationForm Auth={Auth} Task={Task} TaskActions={TaskActions} task={task}/>
                </LargeModal>
                <div className="time text-right">
                    Posted <TimeAgo date={moment.utc(task.created_at).local().format()}/>
                </div>
                <div className="top">
                    <h3 className="title"><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                    <div className="task-status"><i className={"fa fa-circle " + task_status.css}/> {task_status.message}</div>
                    <div className="pledge text-center">
                        {task.amount?task.amount.currency:'&euro;'}{split_fee.whole}
                        <span className="decimal" style={{fontSize: '50%'}}>{split_fee.decimal}</span>
                    </div>
                    <div className="media">
                        <div className="media-left">
                            <Avatar src={task.user.avatar_url}/>
                        </div>
                        <div className="media-body">
                            <Link to={`/people/${task.user.username}/`}>{task.user.display_name}</Link>
                            <div>{task.user.company}</div>
                        </div>
                    </div>
                    <div>
                        {task.deadline?"Deadline "+moment.utc(task.deadline).local().format('Do, MMMM YYYY'):<span dangerouslySetInnerHTML={{__html: '&nbsp;'}}/>}
                    </div>
                </div>
                <div className="middle">
                    {task.details.skills.length?(
                    <TagList tags={task.details.skills} max={3} linkPrefix="/task/skill/" moreLink={`/task/${task.id}/`}/>
                        ):(
                    <div style={{height: '20px'}}></div>
                        )}
                </div>
                <div className="bottom">
                    <div className="short-description" dangerouslySetInnerHTML={{__html: render_excerpt(task.excerpt)}}/>
                    <div className="actions">
                        {Auth.user.is_developer?(
                        <div className="row">
                            <div className="col-sm-12">
                                {task.can_apply?(
                                <Link to={`/task/${task.id}/apply`} className="btn btn-block">Apply for this task</Link>
                                    ):(task.closed || !task.apply?(
                                <div className="btn btn-block">Applications are closed for this task</div>
                                    ):(
                                <div className="btn btn-block" style={{visibility: 'hidden'}}></div>
                                    ))}
                            </div>
                        </div>
                            ):null}
                        <div className="row">
                            <div className="col-sm-12">
                                <Link to={`/task/${task.id}/`} className="btn btn-block">View detailed page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
