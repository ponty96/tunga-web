import React from 'react';
import {Link} from 'react-router';
import YouTube from 'react-youtube';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {showCallWidget, openCalendlyWidget} from '../utils/router';
import {TESTIMONIALS} from '../constants/data';

import {
  sendGAEvent,
  GA_EVENT_CATEGORIES,
  GA_EVENT_ACTIONS,
  GA_EVENT_LABELS,
} from '../utils/tracking';

const STEP_DETAILS = [
  {
    title: 'Tell us what you want to build.',
    icon: 'tunga-icon-how-needs',
  },
  {
    title: 'Tunga matches developers with objectively verified skills.',
    icon: 'tunga-icon-how-matches',
  },
  {
    title:
      'Developers start working in your workflow or set one up for you.',
    icon: 'tunga-icon-how-workflow',
  },
  {
    title: 'Get daily feedback reports on progress & quality.',
    icon: 'tunga-icon-how-feedback',
  }
];

const NETWORK_EXPERTISE = [
  {
	title: 'Full stack capacity for web API development All Popular JS frameworks Backend Development',
    icon: 'tunga-icon-service-web',
  },
  {
	title: 'Excellent Native App Development Dedicated iOS and Android Teams App maintenance and improvements',
    icon: 'tunga-icon-service-app',
  },
  {
	title: 'Dedicated Project Managers Available Daily updates from developers Full Overview of progress',
    icon: 'tunga-icon-service-pm',
  },
  {
    title: 'Easily customize your workflow with Slack, Trello, Google Drive and Github on Tunga',
    icon: 'tunga-icon-service-workflow',
  }
];

export default class LandingPage extends ComponentWithModal {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      play: false,
      step: 0,
      pageClass: '',
      showVideo: true,
      youtubeOpts: {height: '360px'},
    };
  }

  componentDidMount() {
    if (showCallWidget(this.props.routes)) {
      openCalendlyWidget();
    }

    let lp = this;

    let updateBg = function() {
      let windowWidth = $(window).innerWidth();
      let width = windowWidth / 2;
      let height = 60;
      if (windowWidth <= 360) {
        height = 30;
        lp.setState({youtubeOpts: {width: `${windowWidth}px`}});
      } else {
        lp.setState({youtubeOpts: {height: '360px'}});
      }
      $('.ribbon').css('borderWidth', `${height}px ${width}px 0`);

      $(this).scroll(function() {
        var currentPos = $(this).scrollTop();
        var cta = $('header .btn-callout.btn-main-cta');
        if (!cta.size()) {
          cta = $('.lander .task-wizard .btn.cta-action');
        }

        if (cta.size()) {
          var ctaPos = cta.offset().top;
          var navActions = $('.nav.nav-actions');

          if (currentPos >= ctaPos + 50) {
            navActions.addClass('show-launch');
          } else {
            navActions.removeClass('show-launch');
          }
        }

        var outsourceWidget = $('.outsource-widget');
        var outWidgetPos = $('footer').offset().top;
        if (currentPos >= outWidgetPos - 500) {
          if (outsourceWidget.hasClass('slideOutRight')) {
            outsourceWidget.removeClass('open animated slideOutRight');
          }
          outsourceWidget.addClass('open animated slideInRight');
        } else if (currentPos <= outWidgetPos - 1000) {
          if (outsourceWidget.hasClass('slideInRight')) {
            outsourceWidget.removeClass('slideInRight');
            outsourceWidget.addClass('animated slideOutRight');
          }
        }
      });
    };

    $(document).ready(updateBg);
    $(window).resize(updateBg);
  }

  onScheduleCall() {
    openCalendlyWidget();
  }

  onVideoReady(e) {
    var player = e.target;
    if (player) {
      this.setState({player: e.target});
    }
  }

  onPlayVideo() {
    this.setState({play: true});
    if (this.state.player) {
      this.state.player.playVideo();
      sendGAEvent(
        GA_EVENT_CATEGORIES.VIDEO,
        GA_EVENT_ACTIONS.PLAY,
        GA_EVENT_LABELS.INTRO_VIDEO,
      );
    }
  }

  onPauseVideo() {
    sendGAEvent(
      GA_EVENT_CATEGORIES.VIDEO,
      GA_EVENT_ACTIONS.PAUSE,
      GA_EVENT_LABELS.INTRO_VIDEO,
    );
  }

  onCloseVideo() {
    this.setState({play: false});
    if (this.state.player) {
      this.state.player.stopVideo();
    }
  }

  onChangeSliderStep(step) {
    this.setState({step});
  }

  getDLPTag() {
    const {location} = this.props;
    if (location && location.query.dlp_tag) {
      return location.query.dlp_tag;
    }
    return null;
  }

  getDLPDesc() {
    const {location} = this.props;
    if (
      location &&
      location.query.dlp_desc &&
      ['developers', 'coders', 'programmers'].indexOf(location.query.dlp_desc) >
        -1
    ) {
      return location.query.dlp_desc;
    }
    return null;
  }

  getDLPPhrase() {
    const tag = this.getDLPTag();
    const desc = this.getDLPDesc();
    if (tag || desc) {
      return `${this.getDLPTag()} ${this.getDLPDesc()}`;
    }
    return null;
  }

  onRevealNumber(target) {
    $(document).ready(function() {
      var numAnim = new CountUp(target, 0, parseInt($('#' + target).html()));
      numAnim.start();
    });
  }

  renderHeaderContent() {
    const dlp_phrase = this.getDLPPhrase();

    return (
      <div>
        <div className="head-desc">
          <h1>
            Getting software projects done is hard.<br />
            We make it easy.
          </h1>
          <div className="details">
            Tunga enables you to have super-bright{' '}
            {this.getDLPDesc() || 'developers'} from Africa work on your
            software project in a productive, friendly and worthwhile way.
          </div>
          <div>
            <Link to="/start/" className="btn btn-callout btn-main-cta">
              <i className="tunga-icon-rocket" />{' '}
              {dlp_phrase ? `Start hiring ${dlp_phrase}` : 'Start your project'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let slider_settings = {
      dots: true,
      arrows: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [
        {breakpoint: 481, settings: {slidesToShow: 1}},
        {breakpoint: 769, settings: {slidesToShow: 2}},
        {breakpoint: 1025, settings: {slidesToShow: 3}},
      ],
    };

    let meta_title = 'Tunga | Software outsourcing done right';
    let meta_description = `Getting software projects done is hard. We make it easy.`;

    return (
      <ShowcaseContainer
        className={`landing-page ${this.state.pageClass}`}
        headerContent={this.renderHeaderContent()}
        headerVideo={false && this.state.showVideo}
        hasArrow={true}
        chatId={this.props.params ? this.props.params.chatId : null}>
        <MetaTags title={meta_title} description={meta_description} />

        <section id="video-section">
          <div className="container">
            <div className="row">
				<div className="col-md-5">
				<section id="how-it-works">
					<div className="section-heading text-center">How we make it easy</div>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
					</p>
				</section>
				</div>
				<div className="col-md-1" />
				<div className="col-md-6">
				<YouTube
					videoId="RVVtyapBmuo"
					opts={this.state.youtubeOpts}
					onReady={this.onVideoReady.bind(this)}
					onPause={this.onPauseVideo.bind(this)}
					/>
				</div>
			</div>
            <div className="step-slider four-sm clearfix">
            	<ul>
                	{STEP_DETAILS.map((step, idx) => {
                    	return (
                          <li key={idx}>
                            <a
                              href="#"
                              onClick={this.onChangeSliderStep.bind(this, idx)}
                              onMouseOver={this.onChangeSliderStep.bind(this, idx)}
                              className={`slide ${this.state.step == idx
                                ? 'active'
                                : ''} animated fadeInRight`}
                              style={{animationDelay: `${idx}s`}}>
                              <div className="icon">
                                <i className={step.icon} />
                              </div>
                              <span dangerouslySetInnerHTML={{__html: step.title}} />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
          </div>
        </section>

        <section id="press">
          <div className="container ">
            <Reveal effect="animated fadeInLeft">
              <div>
                <ul className="press-links">
                  <li>
                    <a
                      href="http://www.bbc.co.uk/news/world-africa-38294998"
                      target="_blank">
                      <img src={require('../images/press/bbc.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                      target="_blank">
                      <img src={require('../images/press/campus-party.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                      target="_blank">
                      <img src={require('../images/press/OWlogo.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://trendwatching.com/blog/featured-innovator-tunga/"
                      target="_blank">
                      <img
                        src={require('../images/press/trend-watching.png')}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://soundcloud.com/african-tech-round-up/a-chat-with-ernesto-spruyt-of-tungaio?in=african-tech-round-up/sets/quick-chats"
                      target="_blank">
                      <img
                        src={require('../images/press/African-Tech-Round-Up.png')}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://spendmatters.com/2016/04/01/tunga-wip-of-the-week/"
                      target="_blank">
                      <img src={require('../images/press/Spend-Matters.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.nabc.nl/africa-business-news/5/technology/377/tunga-founder-ernesto-spruyt-we-create-21st-century-jobs-in-africa"
                      target="_blank">
                      <img
                        src={require('../images/press/netherlands-african-business-council.png')}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

		<section id="image-section">
			<a>How we verifiy our Developers</a>
		</section>

        <section id="clients-testmonial">
          <div className="container">
            <div className="section-heading text-center">What our clients say</div>
            <Slider
              className="testimonials-slider text-center"
              {...slider_settings}>
              {TESTIMONIALS.map(testimonial => {
                return (
                  <div className="testimonial">
                    <div className="body">
                      <div>
                        <i className="fa fa-quote-left pull-left" />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: testimonial.message,
                          }}
                        />
                        <i className="fa fa-quote-right pull-right" />
                      </div>
                    </div>
                    <div
                      className="image"
                      style={{backgroundImage: `url(${testimonial.image})`}}
                    />
                    <div className="author">
                      {testimonial.name}
                    </div>
                    <div className="company">
                      {testimonial.company}
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </section>

        <section id="what-we-can-do">
          <div className="container">
            <div className="step-slider four-sm clearfix">
            	<ul>
                	{NETWORK_EXPERTISE.map((step, idx) => {
                    	return (
                          <li key={idx}>
                            <a
                              href="#"
                              onClick={this.onChangeSliderStep.bind(this, idx)}
                              onMouseOver={this.onChangeSliderStep.bind(this, idx)}
                              className={`slide transparent ${this.state.step == idx
                                ? 'active'
                                : ''} animated fadeInRight`}
                              style={{animationDelay: `${idx}s`}}>
                              <div className="icon">
                                <i className={step.icon} />
                              </div>
                              <span dangerouslySetInnerHTML={{__html: step.title}} />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
          </div>
        </section>

		<section id="network-section">
			<div className="container">
				<div className="col-md-4">
					<h2 className="figure">154</h2>
					<span className="desc">Developers and project managers</span>
				</div>
				<div className="col-md-4">
					<h2 className="figure">89</h2>
					<span className="desc">Different Development Skils Available</span>
				</div>
				<div className="col-md-4">
					<h2 className="figure">70k+</h2>
					<span className="desc">Lnes of code written</span>
				</div>
			</div>
		</section>

        <section id="clients-testmonial">
          <div className="container">
            <div className="section-heading text-center">Search Developers on Tunga</div>
			 <div className="col-md-push-1 col-md-4 text-center padBottom">
				 <h5>.NET Development</h5>
				 <h5>Android Development</h5>
				 <h5>Angular Development</h5>
				 <h5>C# Development</h5>
				 <h5>C++ Development</h5>
				 <h5>Cake.PHP Development</h5>
				 <h5>Cordova Development</h5>
				 <h5>Django Development</h5>
			 </div>
			 <div className="col-md-push-1 col-md-4 text-center padBottom">
				 <h5>.NET Development</h5>
				 <h5>Android Development</h5>
				 <h5>Angular Development</h5>
				 <h5>C# Development</h5>
				 <h5>C++ Development</h5>
				 <h5>Cake.PHP Development</h5>
				 <h5>Cordova Development</h5>
				 <h5>Django Development</h5>
			 </div>
			 <div className="col-md-push-1 col-md-4 text-center padBottom">
				 <h5>.NET Development</h5>
				 <h5>Android Development</h5>
				 <h5>Angular Development</h5>
				 <h5>C# Development</h5>
				 <h5>C++ Development</h5>
				 <h5>Cake.PHP Development</h5>
				 <h5>Cordova Development</h5>
				 <h5>Django Development</h5>
			 </div>
          </div>
        </section>

        <div className="outsource-widget">
          <div>Ready to outsource the right way?</div>
          <form
            name="task"
            role="form"
            ref="task_form"
            action="/start-outsource/">
            <input
              type="email"
              name="email"
              className="form-control"
              ref="email"
              required
              placeholder="Your email address"
            />
            <button className="btn">Go</button>
          </form>
        </div>

        <ShowCaseFooter />
      </ShowcaseContainer>
    );
  }
}
