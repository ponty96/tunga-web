import React from "react";
import _ from "lodash";

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = _.debounce(this.onSearch, 250);
    this.state = { q: "" };
  }

  componentWillMount() {
    if (this.props.query) {
      this.setState({ q: this.props.query });
    }
  }

  componentDidMount() {
    if (this.state.q) {
      this.performSearch();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.q != prevState.q) {
      this.performSearch();
    }
  }

  onSearchChange(e) {
    e.preventDefault();
    var q = e.target.value;
    this.setState({ q });
  }

  onSearch(e) {
    e.preventDefault();
    this.performSearch();
    return;
  }

  performSearch() {
    if (this.props.onSearch) {
      var filter = this.props.filter || {};
      this.props.onSearch({ search: this.state.q, ...filter });
    }
  }

  render() {
    const { count } = this.props;

    return (
      <div className="search-box">
        <form name="search" role="form" onSubmit={this.onSearch.bind(this)}>
          <div className="input-group">
            <span className="input-group-addon">
              <i className="fa fa-search" />
            </span>
            <input
              type="text"
              name="q"
              className="form-control"
              placeholder={this.props.placeholder || "Search"}
              value={this.state.q}
              onChange={this.onSearchChange.bind(this)}
            />
          </div>
        </form>
        {!this.props.hide_results && this.state.q
          ? <div className="results">
              {count ? count : "Search"} results for "<strong>{this.state.q}</strong>"
            </div>
          : null}
      </div>
    );
  }
}
