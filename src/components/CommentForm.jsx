import React from "react";
import MessageForm from "./MessageForm";

export default class CommentForm extends React.Component {
  onComment(body, attachments) {
    const { CommentActions, object_details } = this.props;
    CommentActions.createComment({ ...object_details, body }, attachments);
  }

  onUpload(files) {
    if (this.props.uploadCallback) {
      this.props.uploadCallback(files);
    }
  }

  render() {
    const { Comment } = this.props;
    return (
      <MessageForm
        messageCallback={this.onComment.bind(this)}
        messageSaved={Comment.detail.isSaved}
        uploadCallback={this.props.uploadCallback}
        uploadSaved={this.props.uploadSaved}
        isSending={Comment.detail.isSaving || this.props.isSaving}
        placeholder="Write your comment here"
      />
    );
  }
}

CommentForm.propTypes = {
  uploadCallback: React.PropTypes.func,
  uploadSaved: React.PropTypes.bool,
  isSaving: React.PropTypes.bool
};
