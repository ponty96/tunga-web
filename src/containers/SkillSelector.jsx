import React from "react";
import _ from "lodash";
import connect from "../utils/connectors/SkillSelectionConnector";

class SkillSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skill: "", skills: [], suggested: [] };
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.handleGetSuggestions = _.debounce(this.handleGetSuggestions, 250);
  }

  componentDidMount() {
    const { SkillSelectionActions, skills, suggested } = this.props;
    SkillSelectionActions.invalidateSkillSuggestions();
    SkillSelectionActions.clearSkillSelections();

    if (skills && Array.isArray(skills)) {
      this.setState({
        skills: Array.from(new Set([...this.state.skills, ...skills]))
      });
    }

    if (suggested && Array.isArray(suggested)) {
      this.setState({ suggested });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { SkillSelectionActions, skills, suggested } = this.props;
    if (prevProps.skills != skills && skills && Array.isArray(skills)) {
      this.setState({
        skills: Array.from(new Set([...this.state.skills, ...skills]))
      });
    }

    if (
      prevProps.suggested != suggested &&
      suggested &&
      Array.isArray(suggested)
    ) {
      this.setState({ suggested });
    }
  }

  handleSkillChange(e) {
    const { SkillSelectionActions } = this.props;
    var skill = e.target.value;
    this.setState({ skill: skill });
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSelectSkill(skill);
    }
    if (!skill) {
      SkillSelectionActions.invalidateSkillSuggestions();
      return;
    }
    this.handleGetSuggestions();
  }

  handleGetSuggestions() {
    const { SkillSelectionActions } = this.props;
    SkillSelectionActions.getSkillSuggestions({ search: this.state.skill });
  }

  handleSelectSkill(skill) {
    const { SkillSelectionActions, onChange } = this.props;
    SkillSelectionActions.invalidateSkillSuggestions();
    let new_skills = Array.from(new Set([...this.state.skills, skill]));
    if (onChange) {
      onChange(new_skills);
    }
    this.setState({ skill: "", skills: new_skills });
  }

  handleRemoveSkill(skill) {
    var idx = this.state.skills.indexOf(skill);
    if (idx > -1) {
      const { onChange } = this.props;
      let new_skills = Array.from(
        new Set([
          ...this.state.skills.slice(0, idx),
          ...this.state.skills.slice(idx + 1)
        ])
      );
      if (onChange) {
        onChange(new_skills);
      }
      this.setState({ skills: new_skills });
    }
  }

  handleComponentClick(e) {
    e.stopPropagation();
  }

  render() {
    const { SkillSelection, showTitle } = this.props;

    return (
      <div
        className="skill-selector tag-selector"
        onClick={this.handleComponentClick.bind(this)}
      >
        <div className="selections">
          {showTitle && this.state.suggested && this.state.suggested.length
            ? <label className="control-label">Skills or products</label>
            : null}
          {this.state.skills && this.state.skills.length
            ? <div>
                {this.state.skills.map(skill => {
                  return (
                    <div key={skill} className="list-group-item selected-item">
                      {skill}
                      <a
                        onClick={this.handleRemoveSkill.bind(this, skill)}
                        className="close"
                      >
                        <i className="fa fa-remove" />
                      </a>
                    </div>
                  );
                })}
              </div>
            : <div className="alert alert-info">
                {this.state.suggested && this.state.suggested.length
                  ? "Click on some suggestions or a"
                  : "A"}dd some tags with the widget
              </div>}
        </div>
        {this.state.suggested && this.state.suggested.length
          ? <div className="selections">
              <label className="control-label">Quick Suggestions</label>
              {this.state.suggested.map(skill => {
                if (this.state.skills.indexOf(skill) > -1) {
                  return null;
                }
                return (
                  <div key={skill} className="list-group-item selected-item">
                    <a onClick={this.handleSelectSkill.bind(this, skill)}>
                      {skill}
                    </a>
                  </div>
                );
              })}
            </div>
          : null}

        <div className="input-group">
          <span className="input-group-addon">
            <i className="tunga-icon-tag" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Type here to get more suggestions or to add a new tag"
            onChange={this.handleSkillChange}
            onKeyPress={this.handleSkillChange}
            value={this.state.skill}
          />
        </div>

        <div className="list-group suggestions">
          {SkillSelection.isValid
            ? SkillSelection.suggestions.map(skill => {
                return (
                  <a
                    className="list-group-item"
                    key={skill.id}
                    onClick={this.handleSelectSkill.bind(this, skill.name)}
                  >
                    {skill.name}
                  </a>
                );
              })
            : ""}
        </div>
      </div>
    );
  }
}

SkillSelector.propTypes = {
  skills: React.PropTypes.array,
  suggested: React.PropTypes.array,
  showTitle: React.PropTypes.bool
};

SkillSelector.defaultProps = {
  skills: [],
  suggested: [],
  showTitle: true
};

export default connect(SkillSelector);
