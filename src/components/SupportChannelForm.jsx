import React from 'react';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

export default class ChannelForm extends React.Component {

    componentWillReceiveProps(nextProps) {
        if(nextProps.Channel.detail.isSaved && !this.props.Channel.detail.isSaved) {
            const { Channel, Auth } = nextProps;
            this.refs.channel_form.reset();
            this.setState({participants: []});
            const { router } = this.context;
            if(Auth.isAuthenticated) {
                router.replace('/channel/' + Channel.detail.channel.id);
            }
        }
    }

    saveChannel(name=null, email=null, subject=null) {
        const { ChannelActions } = this.props;
        ChannelActions.createSupportChannel({name, email, subject});
    }

    handleSubmit(e) {
        e.preventDefault();
        var name = this.refs.name?this.refs.name.value.trim():null;
        var email = this.refs.email?this.refs.email.value.trim():null;
        var subject = this.refs.subject?this.refs.subject.value.trim():null;

        this.saveChannel(name, email, subject);
        return;
    }

    render() {
        const { Channel, Auth } = this.props;
        if(Auth.user.is_staff) {
            return  null;
        }
        let channel = this.props.channel || {};
        return (
            <div className="new-channel">
                <form onSubmit={this.handleSubmit.bind(this)} name="channel" role="form" ref="channel_form">
                    <FormStatus loading={Channel.detail.isSaving}
                                success={Channel.detail.isSaved}
                                message={'Channel created'}
                                error={Channel.detail.error.create}/>


                    {Auth.isAuthenticated?(
                        <div>
                            <h3 className="title">Create a new inquiry</h3>

                            {(Channel.detail.error.create && Channel.detail.error.create.subject)?
                                (<FieldError message={Channel.detail.error.create.subject}/>):null}
                            <div className="form-group">
                                <label className="control-label">Subject {Auth.isAuthenticated?'*':null}</label>
                                <div>
                                    <input type="text" className="form-control" ref="subject" placeholder="Subject" required/>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div>
                            <h3 className="title"><i className="fa fa-comments"/> Start a chat</h3>

                            {(Channel.detail.error.create && Channel.detail.error.create.name)?
                                (<FieldError message={Channel.detail.error.create.name}/>):null}
                            <div className="form-group">
                                <label className="control-label">Name *</label>
                                <div>
                                    <input type="text" className="form-control" ref="name" placeholder="Name" required/>
                                </div>
                            </div>

                            {(Channel.detail.error.create && Channel.detail.error.create.email)?
                                (<FieldError message={Channel.detail.error.create.email}/>):null}
                            <div className="form-group">
                                <label className="control-label">E-mail (optional)</label>
                                <div>
                                    <input type="email" className="form-control" ref="email" placeholder="E-mail address (optional)"/>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <button type="submit" className="btn" disabled={Channel.detail.isSaving}>Start</button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>
        );
    }
}

ChannelForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
