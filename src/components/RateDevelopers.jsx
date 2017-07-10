import React from "react";
import { Link } from "react-router";
import Rating from "react-rating";

import { RATING_CRITERIA_CHOICES } from "../constants/Api";
import { getUser } from "../utils/auth";

export default class RateDevelopers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ratings_map: null };
  }

  componentWillMount() {
    this.mapUserRatings(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.Task.detail.isSaved && !this.props.Task.detail.isSaved) {
      this.mapUserRatings(nextProps);
    }
  }

  mapUserRatings(props) {
    const { Task } = props;
    const { task } = Task.detail;
    if (task && task.ratings && task.ratings.length) {
      var ratings_map = {};
      task.ratings.forEach(rating => {
        if (rating.created_by.id == getUser().id) {
          ratings_map[rating.criteria] = rating.score;
        }
      });
      this.setState({ ratings_map });
    }
  }

  onRatingChange(criteria, rating) {
    const { TaskActions, Task } = this.props;
    TaskActions.updateTask(Task.detail.task.id, {
      ratings: [{ criteria, score: rating }]
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    return;
  }

  render() {
    const { Task } = this.props;
    const { task } = Task.detail;

    return (
      <div className="form-wrapper">
        <form
          onSubmit={this.handleSubmit.bind(this)}
          name="rate"
          role="form"
          ref="rate_form"
        >
          <h4 className="title">
            Rate Developer{task.details &&
            task.details.participation &&
            task.details.participation.length == 1
              ? ""
              : "s"}
          </h4>

          <div className="card">
            It would help the Tunga community a great deal if you could rate our
            developers. You can rate a developer on three scales. Please take 5
            seconds of your to rate our Developers. Thank you in advance
          </div>
          {RATING_CRITERIA_CHOICES.map(criteria => {
            return (
              <div key={criteria.id} style={{ margin: "15px 0" }}>
                <h5>
                  {criteria.name}
                </h5>
                <div className="rating large">
                  <Rating
                    start={0}
                    stop={10}
                    step={2}
                    fractions={2}
                    initialRate={
                      this.state.ratings_map
                        ? this.state.ratings_map[criteria.id]
                        : 0
                    }
                    empty={"fa fa-star-o"}
                    full={"fa fa-star"}
                    onChange={this.onRatingChange.bind(this, criteria.id)}
                  />
                </div>
              </div>
            );
          })}
          <Link to="/" className="btn">
            Done
          </Link>
        </form>
      </div>
    );
  }
}
