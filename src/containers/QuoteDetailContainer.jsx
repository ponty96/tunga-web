import React from "react";

export default class QuoteDetailContainer extends React.Component {
  componentDidMount() {
    this.props.QuoteActions.retrieveQuote(this.getQuoteId());
  }

  getQuoteId() {
    const { quoteId, params } = this.props;
    if (quoteId) {
      return quoteId;
    }
    if (params && params.quoteId) {
      return params.quoteId;
    }
    return null;
  }

  renderChildren() {
    const { Quote } = this.props;

    return React.Children.map(
      this.props.children,
      function(child) {
        return React.cloneElement(child, {
          Auth: this.props.Auth,
          Quote: this.props.Quote,
          QuoteActions: this.props.QuoteActions,
          quote: this.props.Quote.detail.quote,
          isRetrieving: Quote.detail.isRetrieving,
          isSaving: Quote.detail.isSaving,
          isSaved: Quote.detail.isSaved,
          errors: Quote.detail.error,
          task: this.props.task
        });
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        {this.renderChildren()}
      </div>
    );
  }
}

QuoteDetailContainer.propTypes = {
  quoteId: React.PropTypes.number
};

QuoteDetailContainer.defaultProps = {
  quoteId: null
};
