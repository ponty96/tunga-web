import React from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';
import MessageForm from './MessageForm';
import ActivityList from './ActivityList';


export default class ChatBox extends React.Component {

    getView() {
        if(this.props.channelView) {
            return this.props.channelView;
        }
        return null;
    }

    onSendMessage(body, attachments) {
        const { MessageActions, Channel } = this.props;
        const { channel } = Channel.detail;
        MessageActions.createMessage({channel: channel.id, body}, attachments);
    }

    onUpload(files) {
        const { Channel, ChannelActions } = this.props;
        const { channel } = Channel.detail;
        ChannelActions.updateChannel(channel.id, null, files);
    }

    render() {
        const { Auth, Channel, ChannelActions, Message } = this.props;
        const { channel, attachments } = Channel.detail;
        let view = this.getView();

        return (
            <div className="list-box">
                {view == 'files'?(
                    <div className="attachment-list">
                        {attachments?(
                            <div>
                                <h4>Files</h4>
                                {attachments.map(upload => {
                                    return (
                                        <div key={upload.id} className="file">
                                            <a href={upload.url}><i className="fa fa-download"/> {upload.name} <strong>[{upload.display_size}]</strong></a>
                                        </div>
                                    );
                                })}
                            </div>
                        ):null}
                    </div>
                ):null}

                {view == 'people'?(
                    <div className="people-list">
                        <h4>People</h4>
                        {channel.details && channel.details.participants?(
                            <div className="row">
                                {channel.details.participants.map(user => {
                                    return (
                                        <div key={user.id} className="col-md-6">
                                            <div className="media card">
                                                <div className="media-left">
                                                    <Avatar src={user.avatar_url} size=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div><Link to={`/people/${user.username}`}>{user.display_name}</Link></div>
                                                    <div className="secondary">@{user.username}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ):null}
                    </div>
                ):null}

                {['files', 'people'].indexOf(view) == -1?(
                    [
                        <ActivityList
                            Auth={Auth}
                            activities={Channel.detail.activity.items}
                            isLoading={Channel.detail.activity.isFetching}
                            isLoadingMore={Channel.detail.activity.isFetchingMore}
                            loadMoreUrl={Channel.detail.activity.next}
                            loadMoreCallback={ChannelActions.listMoreChannelActivity}
                            loadMoreText="Show older messages"
                            last_read={Channel.detail.last_read} />,
                        <MessageForm
                            messageCallback={this.onSendMessage.bind(this)}
                            messageSaved={Message.detail.isSaved}
                            uploadCallback={this.onUpload.bind(this)}
                            uploadSaved={Channel.detail.isSaved}
                            isSending={Message.detail.isSaving || Channel.detail.isSaving}
                            canUpload={Auth.isAuthenticated} />
                    ]
                ):null}
            </div>
        );
    }
}
