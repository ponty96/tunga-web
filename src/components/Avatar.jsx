import React from "react";

export default class Avatar extends React.Component {
  render() {
    const { src, size, icon, badge } = this.props;
    const image = src;
    return (
      <div className="avatar-wrapper">
        {badge
          ? <span className="badge">
              {badge}
            </span>
          : null}
        <div
          className={"avatar " + (image ? "" : " avatar-icon ") + (size || "")}
          style={image ? { backgroundImage: `url(${image})` } : {}}
        >
          {image
            ? null
            : <span className={"glyphicon " + (icon || "glyphicon-user")} />}
        </div>
      </div>
    );
  }
}

Avatar.propTypes = {
  src: React.PropTypes.string,
  size: React.PropTypes.string,
  icon: React.PropTypes.string,
  iconType: React.PropTypes.string,
  badge: React.PropTypes.number
};
