import React from 'react';
import {Link} from 'react-router';
import {Affix} from 'react-overlays';

import {openCalendlyWidget} from '../utils/router';

import ChatWindow from '../containers/ChatWindow';

export default class ShowcaseContainer extends React.Component {
  render() {
    return (
      <div className={'showcase ' + this.props.className}>
        <header
          style={
            this.props.headerVideo
              ? {overflow: 'hidden', position: 'relative'}
              : null
          }>
          {this.props.headerVideo
            ? <video
                autoPlay
                loop
                style={{
                  position: 'absolute',
                  top: '0',
                  left: 0,
                  width: '100%',
                  minHeight: '100%',
                }}
                muted>
                <source
                  src={require('../video/homepagetunga.mp4')}
                  type="video/mp4"
                />
              </video>
            : null}
          {this.props.headerVideo ? <div className="video-overlay" /> : null}
          <Affix affixClassName="navbar-fixed-top" offsetTop={60}>
            <nav className="navbar navbar-fixed-top">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-expanded="false"
                  aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <i className="fa fa-ellipsis-v fa-lg" />
                </button>
                <Link className="navbar-brand" to="/">
                  <img src={require('../images/logo.png')} />
                </Link>
              </div>

              <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-right nav-actions">
                  <li className="schedule">
                    <a
                      className="primary"
                      onClick={() => {
                        openCalendlyWidget();
                      }}>
                      Schedule call
                    </a>
                  </li>
                  <li className="launch">
                    <Link className="primary" to="/start/">
                      <i className="tunga-icon-rocket fa-lg" /> Start your
                      project
                    </Link>
                  </li>
                  <li>
                    <Link to="/signin" activeClassName="active">
                      Login
                    </Link>
                  </li>
                </ul>
                <ul className="nav navbar-nav navbar-left nav-main">
                  <li>
                    <Link to="/our-story" activeClassName="active">
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link to="/quality" activeClassName="active">
                      Quality
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" activeClassName="active">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <a href="https://blog.tunga.io" target="_blank">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </Affix>
          <div className="content">
            <div className="container">
              {this.props.headerContent}
            </div>
          </div>
        </header>

        {this.props.children}

        <ChatWindow channelId={this.props.chatId || null} />
      </div>
    );
  }
}
