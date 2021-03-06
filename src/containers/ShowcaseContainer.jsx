import React from 'react';
import { Link } from 'react-router';

import ShowCaseFooter from './ShowCaseFooter';
import ChatWindow from '../containers/ChatWindow';

export default class ShowcaseContainer extends React.Component {

    render() {
        return (
            <div className={"showcase "+this.props.className}>
                <header>
                    <nav className="navbar">
                        <div className="container">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                    <span className="sr-only">Toggle navigation</span>
                                    <i className="fa fa-ellipsis-v fa-lg"/>
                                </button>
                                <Link className="navbar-brand" to="/"><img src={require('../images/header-logo.png')} /></Link>
                            </div>

                            <div id="navbar" className="collapse navbar-collapse">
                                <ul className="nav navbar-nav">
                                    <li><Link to="/how-it-works" activeClassName="active">How it works</Link></li>
                                    <li><Link to="/pricing" activeClassName="active">Pricing</Link></li>
                                    {/*<li><Link to="/press" activeClassName="active">Press</Link></li>
                                     <li><Link to="/FAQ" activeClassName="active">FAQ</Link></li>*/}
                                    <li><a href="https://blog.tunga.io" target="_blank">Blog</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right nav-actions">
                                    <li><Link to="/signup" className="join">JOIN</Link></li>
                                    <li><Link to="/signin" className="login">LOGIN</Link></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="container">
                        {this.props.headerContent}
                    </div>
                </header>

                {this.props.children}

                <ShowCaseFooter/>

                <ChatWindow channelId={this.props.chatId || null} />
            </div>
        );
    }
}
