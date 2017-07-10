import * as Cookies from "js-cookie";
import {
  DEVELOPER_FEE,
  PM_FEE,
  TUNGA_PERCENTAGE_DEVELOPER,
  STATUS_SUBMITTED,
  STATUS_APPROVED,
  STATUS_ACCEPTED,
  TASK_TYPE_WEB,
  TASK_TYPE_MOBILE,
  TASK_TYPE_OTHER
} from "../constants/Api";

import { isAdmin, getUser } from "../utils/auth";
import { parseNumber } from "../utils/helpers";
import { getTaskTypeUrl, getScopeUrl } from "../utils/tracking";

export function setEditToken(token) {
  Cookies.set("taskEditToken", token);
}

export function getEditToken() {
  return Cookies.get("taskEditToken");
}

export function parse_task_status(task) {
  let work_type = task.is_project ? "project" : "task";
  var task_status = {
    message: `This ${work_type} is open for applications`,
    css: "open"
  };
  if (!task.approved && !task.is_developer_ready && task.pm) {
    task_status.message = `This ${work_type} is being estimated`;
    task_status.css = "in-progress";
  } else if (task.closed) {
    task_status.message = `This ${work_type} is closed`;
    task_status.css = "closed";
  } else if (!task.apply) {
    task_status.message = `Applications are closed for this ${work_type}`;
    task_status.css = "in-progress";
  }
  return task_status;
}

export const DLP_WEB_TAGS = [
  "php",
  "wordpress",
  "jquery",
  "node.js",
  "bootstrap",
  "react.js",
  "angularjs",
  "rails",
  "django",
  "express.js",
  "ruby on rails",
  "html",
  "css",
  "css3",
  "html5",
  "javascript",
  "flask"
];
export const DLP_MOBILE_TAGS = [
  "android",
  "ios",
  "windows mobile",
  "ionic",
  "react native",
  "apache cordova",
  "cordova"
];

export function getDLPTaskType(tag) {
  if (tag) {
    tag = tag.toLowerCase();
    if (DLP_WEB_TAGS.indexOf(tag) > -1) {
      return TASK_TYPE_WEB;
    } else if (DLP_MOBILE_TAGS.indexOf(tag) > -1) {
      return TASK_TYPE_MOBILE;
    }
  }
  return null;
}

export function getAcquisitionUrl(task, completed = false) {
  if (task.id) {
    var suffix = "";
    const scope_url = getScopeUrl(task.scope);
    if (scope_url) {
      suffix = "/scope/" + scope_url + suffix;
    }

    const type_url = getTaskTypeUrl(task.type);
    if (type_url) {
      suffix = "/type/" + type_url + suffix;
    }
    return (
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? `:${window.location.port}` : "") +
      `/track/${task.analytics_id || "no_id"}/acquisition` +
      (task.source == 2 ? "/new" : "/member") +
      `/${task.id}/${completed ? "complete" : "start"}` +
      suffix
    );
  }
  return null;
}

export function hasStarted(task) {
  var started = false;

  if (task.participation) {
    task.participation.forEach(item => {
      if (item.status == STATUS_ACCEPTED) {
        started = true;
      }
    });
  }
  return started;
}

export function getDevFee(hours) {
  if (!hours) {
    return 0;
  }
  return parseNumber(hours * DEVELOPER_FEE * (1 - TUNGA_PERCENTAGE_DEVELOPER));
}

export function getTotalFee(hours) {
  if (!hours) {
    return 0;
  }
  return parseNumber(hours * DEVELOPER_FEE);
}

export function getDevHours(activities) {
  if (!activities || !activities.length) {
    return 0;
  }
  return activities
    .map(function(activity) {
      return activity.hours;
    })
    .reduce((a, b) => {
      return parseFloat(a) + parseFloat(b);
    });
}

export function getPayDetails(activities) {
  let dev_hours = getDevHours(activities);
  var details = {
    dev: {
      hours: dev_hours,
      fee: parseNumber(DEVELOPER_FEE * dev_hours)
    }
  };

  details.pm = {
    hours: parseNumber(0.15 * dev_hours),
    fee: parseNumber(PM_FEE * 0.15 * dev_hours)
  };

  details.total = {
    hours: parseNumber(
      parseFloat(details.dev.hours) + parseFloat(details.pm.hours)
    ),
    fee: parseNumber(DEVELOPER_FEE * dev_hours + PM_FEE * 0.15 * dev_hours)
  };
  return details;
}

export function estimateDevHoursForFee(fee) {
  if (!fee) {
    return 0;
  }
  return parseNumber(fee / (DEVELOPER_FEE * 1.0));
}

export function isTaskOwner(task) {
  return task.user && task.user.id == getUser().id;
}

export function isTaskPM(task) {
  return task.pm == getUser().id;
}

export function canAddEstimate(task) {
  return !task.estimate && (isAdmin() || isTaskPM(task));
}

export function canEditEstimate(task) {
  return (
    task.estimate &&
    ([STATUS_SUBMITTED, STATUS_ACCEPTED, STATUS_APPROVED].indexOf(
      task.estimate.status
    ) == -1 &&
      (isAdmin() || isTaskPM(task)))
  );
}

export function canModerateEstimate(task) {
  return task.estimate && task.estimate.status == STATUS_SUBMITTED && isAdmin();
}

export function canReviewEstimate(task) {
  return (
    task.estimate &&
    task.estimate.status == STATUS_APPROVED &&
    (isTaskOwner(task) || (isAdmin() && (__PRERELEASE__ || __DEV__)))
  );
}

export function canViewEstimate(task) {
  return task.estimate && (isAdmin() || isTaskPM(task) || isTaskOwner(task));
}

export function isEstimationComplete(task) {
  return task.estimate && task.estimate.status == STATUS_ACCEPTED;
}

export function canAddQuote(task) {
  return (
    isEstimationComplete(task) && !task.quote && (isAdmin() || isTaskPM(task))
  );
}

export function canEditQuote(task) {
  return (
    task.quote &&
    ([STATUS_SUBMITTED, STATUS_ACCEPTED, STATUS_APPROVED].indexOf(
      task.quote.status
    ) == -1 &&
      (isAdmin() || isTaskPM(task)))
  );
}

export function canModerateQuote(task) {
  return task.quote && task.quote.status == STATUS_SUBMITTED && isAdmin();
}

export function canReviewQuote(task) {
  return (
    task.quote &&
    task.quote.status == STATUS_APPROVED &&
    (isTaskOwner(task) || (isAdmin() && (__PRERELEASE__ || __DEV__)))
  );
}

export function canViewQuote(task) {
  return task.quote && (isAdmin() || isTaskPM(task) || isTaskOwner(task));
}
