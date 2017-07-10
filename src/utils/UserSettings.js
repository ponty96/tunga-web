// Visibility
export const PROFILE_VISIBILITY = "profile_visibility";
export const SOCIAL_LINKS = "social_links";
export const LOCATION_DETAILS = "location_details";

// Switches
export const DAILY_UPDATE_EMAIL = "daily_update_email";

// Messages
export const DIRECT_MESSAGES_EMAIL = "direct_messages_email";

// Connections
export const NEW_FRIEND_REQUEST_EMAIL = "new_friend_request_email";
export const TEAM_INVITATION_RESPONSE_EMAIL = "team_invitation_response_email";
export const FRIEND_REQUEST_RESPONSE_EMAIL = "friend_request_response_email";
export const JOIN_TEAM_REQUEST_RESPONSE_EMAIL =
  "join_team_request_response_email";
export const NEW_TEAM_INVITATION_EMAIL = "new_team_invitation_email";

// Tasks
export const NEW_TASK_EMAIL = "new_task_email";
export const NEW_TASK_APPLICATION_EMAIL = "new_task_application_email";
export const TASK_APPLICATION_RESPONSE_EMAIL =
  "task_application_response_email";
export const NEW_TASK_INVITATION_EMAIL = "new_task_invitation_email";
export const TASK_INVITATION_RESPONSE_EMAIL = "task_invitation_response_email";
export const TASK_PROGRESS_REPORT_REMINDER_EMAIL =
  "task_progress_report_reminder_email";
export const TASK_ACTIVITY_UPDATE_EMAIL = "task_activity_update_email";

// Payments
export const PAYMENT_REQUEST_EMAIL = "payment_request_email";
export const PAYMENT_UPDATE_EMAIL = "payment_update_email";

export const VISIBILITY_SETTINGS = [
  { name: PROFILE_VISIBILITY, label: "Profile visibility" },
  { name: SOCIAL_LINKS, label: "Social links" },
  { name: LOCATION_DETAILS, label: "Location details" }
];

const notify_buttons = { on: "send an email", off: "notifications only" };

export const SWITCH_SETTINGS = [
  { name: DAILY_UPDATE_EMAIL, label: "Daily update e-mail" },
  {
    name: DIRECT_MESSAGES_EMAIL,
    label: "Direct messages",
    buttons: notify_buttons
  },
  {
    name: NEW_FRIEND_REQUEST_EMAIL,
    label: "New friend request",
    buttons: notify_buttons
  },
  // owner
  {
    name: TEAM_INVITATION_RESPONSE_EMAIL,
    label: "Response to team invitation",
    buttons: notify_buttons
  },
  //dev
  {
    name: FRIEND_REQUEST_RESPONSE_EMAIL,
    label: "Response to friend request",
    buttons: notify_buttons
  },
  {
    name: JOIN_TEAM_REQUEST_RESPONSE_EMAIL,
    label: "Response to join team request",
    buttons: notify_buttons
  },
  {
    name: NEW_TEAM_INVITATION_EMAIL,
    label: "Invitation to join a team",
    buttons: notify_buttons
  },
  // dev end
  { name: NEW_TASK_EMAIL, label: "New task created", buttons: notify_buttons }, //dev
  {
    name: NEW_TASK_APPLICATION_EMAIL,
    label: "New application for a task",
    buttons: notify_buttons
  }, //owner
  {
    name: TASK_APPLICATION_RESPONSE_EMAIL,
    label: "Task application accepted or rejected",
    buttons: notify_buttons
  }, //owner
  {
    name: NEW_TASK_INVITATION_EMAIL,
    label: "Invitation to a task",
    buttons: notify_buttons
  }, //owner
  {
    name: TASK_INVITATION_RESPONSE_EMAIL,
    label: "Task invitation accepted or rejected",
    buttons: notify_buttons
  }, //owner
  {
    name: TASK_PROGRESS_REPORT_REMINDER_EMAIL,
    label:
      "Reminders about upcoming reports for milestones and scheduled updates",
    buttons: notify_buttons
  },
  {
    name: TASK_ACTIVITY_UPDATE_EMAIL,
    label: "Task activity updates",
    buttons: notify_buttons
  },
  {
    name: PAYMENT_REQUEST_EMAIL,
    label: "Payment requests",
    buttons: notify_buttons
  }, //owner
  {
    name: PAYMENT_UPDATE_EMAIL,
    label: "Payment updates",
    buttons: notify_buttons
  } //dev
];
