import React from "react"

const STEP_DETAILS = [
  {
    title: 'Tell us what you want to build.',
    icon: 'tunga-icon-how-needs',
    tag: 1
  },
  {
    title: 'Tunga matches developers with objectively verified skills.',
    icon: 'tunga-icon-how-matches',
    tag: 2
  },
  {
    title:
      'Developers start working in your workflow or set one up for you.',
    icon: 'tunga-icon-how-workflow',
    tag: 3
  },
  {
    title: 'Get daily feedback reports on progress & quality.',
    icon: 'tunga-icon-how-feedback',
    tag: 4
  }
];

export default class StepSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
  }
  onChangeSliderStep(step) {
    this.setState({step});
  }
  render(){
    return (
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
                                <span>{step.tag}</span>
                                <i className={step.icon} />
                              </div>
                              <span dangerouslySetInnerHTML={{__html: step.title}} />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
    )
  }
}