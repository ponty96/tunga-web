import React from 'react';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SearchActions from '../actions/SearchActions';

import { SEARCH_PATH } from '../constants/patterns';


class SearchBox extends React.Component {

    constructor(props){
        super(props);
        this.onSearch = _.debounce(this.onSearch, 250);
        this.state = {q: ''};
    }

    componentWillMount() {
        if(this.context.location.query && this.context.location.query.q) {
            let q = this.context.location.query.q;
            this.setState({q});
        }
    }

    componentDidMount() {
        if(this.state.q) {
            this.performSearch();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.q != prevState.q) {
            this.performSearch();
        }
    }

    onSearchChange(e) {
        e.preventDefault();
        var q = e.target.value;
        this.setState({q});
    }

    onSearch(e) {
        e.preventDefault();
        this.performSearch();
        return;
    }

    performSearch() {
        if(this.props.onSearch) {
            var filter = this.props.filter || {};
            this.props.onSearch({search: this.state.q, ...filter});
        } else {
            this.props.SearchActions.searchStart(this.state.q);
            const { router, location } = this.context;
            if(!SEARCH_PATH.test(location.pathname)) {
                router.replace('/search');
            }
        }
    }

    render() {
        const { Search } = this.props;
        const count = this.props.count || Search.count;

        return (
            <div className="search-box">
                <form name="search" role="form" onSubmit={this.onSearch.bind(this)}>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input type="text" name="q" className="form-control" placeholder={this.props.placeholder || "Search"} value={this.state.q} onChange={this.onSearchChange.bind(this)}/>
                    </div>
                </form>
                {!this.props.hide_results && this.state.q?(
                <div className="results">{count?count:"Search"} results for "<strong>{this.state.q}</strong>"</div>
                    ):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Auth: state.Auth, Search: state.Search};
}

function mapDispatchToProps(dispatch) {
    return {
        SearchActions: bindActionCreators(SearchActions, dispatch),
    }
}

SearchBox.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
