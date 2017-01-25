import axios from 'axios';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
        }
    },
    xhrFields: {
        withCredentials: true
    }
});

var BACKEND_PATH = __BACKEND_ROOT_URL__ || (__PRODUCTION___?'/':'http://test.tunga.io/');
var API_PATH = 'api/';
var SOCIAL_LOGIN_PATH = 'accounts/social/';

const API_ROOT = BACKEND_PATH + API_PATH;
export default API_ROOT;

export const SOCIAL_LOGIN_PREFIX = BACKEND_PATH + SOCIAL_LOGIN_PATH;

function createSocialLoginUrl(provider) {
    return SOCIAL_LOGIN_PREFIX + provider + '/';
}

export const SOCIAL_PROVIDERS = {
    facebook: 'facebook',
    google: 'google',
    linkedin: 'linkedin',
    github: 'github',
    coinbase: 'coinbase',
    slack: 'slack'
};

export const SOCIAL_LOGIN_URLS = {
    facebook: createSocialLoginUrl('facebook'),
    google: createSocialLoginUrl('google'),
    linkedin: createSocialLoginUrl('linkedin_oauth2'),
    github: createSocialLoginUrl('github'),
    coinbase: createSocialLoginUrl('coinbase'),
    slack: createSocialLoginUrl('slack')
};

function getEndpointUrl(path) {
    return API_ROOT + path;
}

export const ENDPOINT_LOGIN = getEndpointUrl('auth/login/');
export const ENDPOINT_LOGOUT = getEndpointUrl('auth/logout/');
export const ENDPOINT_VERIFY = getEndpointUrl('auth/verify/');
export const ENDPOINT_REGISTER = getEndpointUrl('auth/register/');
export const ENDPOINT_EMAIL_VISITOR = getEndpointUrl('auth/visitor/');
export const ENDPOINT_APPLY = getEndpointUrl('apply/');
export const ENDPOINT_INVITE = getEndpointUrl('invite/');
export const ENDPOINT_CHANGE_PASSWORD = getEndpointUrl('auth/password/change/');
export const ENDPOINT_RESET_PASSWORD = getEndpointUrl('auth/password/reset/');
export const ENDPOINT_RESET_PASSWORD_CONFIRM = getEndpointUrl('auth/password/reset/confirm/');
export const ENDPOINT_PROFILE = getEndpointUrl('me/profile/');
export const ENDPOINT_NOTIFICATION = getEndpointUrl('me/notification/');
export const ENDPOINT_ACCOUNT_INFO = getEndpointUrl('me/account/');
export const ENDPOINT_ACCOUNT_SETTINGS = getEndpointUrl('me/settings/');
export const ENDPOINT_USER_INFO = getEndpointUrl('me/user/');
export const ENDPOINT_USER_EDUCATION = getEndpointUrl('me/education/');
export const ENDPOINT_USER_WORK = getEndpointUrl('me/work/');
export const ENDPOINT_MY_APPS = getEndpointUrl('me/app/');
export const ENDPOINT_PROJECT = getEndpointUrl('project/');
export const ENDPOINT_TASK = getEndpointUrl('task/');
export const ENDPOINT_USER = getEndpointUrl('user/');
export const ENDPOINT_COMMENT = getEndpointUrl('comment/');
export const ENDPOINT_CHANNEL = getEndpointUrl('channel/');
export const ENDPOINT_DIRECT_CHANNEL = getEndpointUrl('channel/direct/');
export const ENDPOINT_MESSAGE = getEndpointUrl('message/');
export const ENDPOINT_REPLY = getEndpointUrl('reply/');
export const ENDPOINT_CONNECTION = getEndpointUrl('connection/');
export const ENDPOINT_APPLICATION = getEndpointUrl('application/');
export const ENDPOINT_SAVED_TASK = getEndpointUrl('saved-task/');
export const ENDPOINT_MILESTONE = getEndpointUrl('progress-event/');
export const ENDPOINT_PROGRESS_REPORT = getEndpointUrl('progress-report/');
export const ENDPOINT_SKILL = getEndpointUrl('skill/');
export const ENDPOINT_COUNTRIES = getEndpointUrl('countries/');
export const ENDPOINT_CONTACT_REQUEST = getEndpointUrl('contact-request/');
export const ENDPOINT_SUPPORT_SECTION = getEndpointUrl('support/section/');
export const ENDPOINT_SUPPORT_PAGE = getEndpointUrl('support/page/');
export const ENPOINT_TIME_ENTRY = getEndpointUrl('time-entry');

export const USER_TYPE_DEVELOPER = 1;
export const USER_TYPE_PROJECT_OWNER = 2;

export const USER_TYPE_CHOICES = [
    {id: USER_TYPE_DEVELOPER, name: 'Developer'},
    {id: USER_TYPE_PROJECT_OWNER, name: 'Project Owner'}
];

export const PAYMENT_METHOD_BTC_WALLET = 'btc_wallet';
export const PAYMENT_METHOD_BTC_ADDRESS = 'btc_address';
export const PAYMENT_METHOD_MOBILE_MONEY = 'mobile_money';

export const PAYMENT_METHOD_CHOICES = [
    {id: PAYMENT_METHOD_BTC_WALLET, name: 'Bitcoin Wallet'},
    {id: PAYMENT_METHOD_MOBILE_MONEY, name: 'Mobile Money'},
    {id: PAYMENT_METHOD_BTC_ADDRESS, name: 'Bitcoin Address'},
];

export const BTC_WALLET_PROVIDER_COINBASE = 'coinbase';


export const VISIBILITY_DEVELOPERS = 1;
export const VISIBILITY_MY_TEAM = 2;
export const VISIBILITY_CUSTOM = 3;
export const VISIBILITY_ONLY_ME = 4;

export const TASK_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All developers'},
    {id: VISIBILITY_MY_TEAM, name: 'Only my team'},
    {id: VISIBILITY_CUSTOM, name: 'Select developer(s)'}
];

export const SETTINGS_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All developers'},
    {id: VISIBILITY_MY_TEAM, name: 'Only my team'},
    {id: VISIBILITY_ONLY_ME, name: 'Only me'}
];

export const UPDATE_INTERVAL_UNIT_HOURLY = 1
export const UPDATE_INTERVAL_UNIT_DAILY = 2
export const UPDATE_INTERVAL_UNIT_WEEKLY = 3
export const UPDATE_INTERVAL_UNIT_MONTHLY = 4
export const UPDATE_INTERVAL_UNIT_QUATERLY = 5
export const UPDATE_INTERVAL_UNIT_ANNUALLY = 6

export const UPDATE_SCHEDULE_CHOICES = [
    {number: 1, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Daily'},
    {number: 2, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 2 Days'},
    {number: 3, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 3 Days'},
    {number: 4, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 4 Days'},
    {number: 1, unit: UPDATE_INTERVAL_UNIT_WEEKLY, name: 'Weekly'},
];

export const RATING_CRITERIA_CODING = 1;
export const RATING_CRITERIA_COMMUNICATION = 2;
export const RATING_CRITERIA_SPEED = 3;

export const RATING_CRITERIA_CHOICES = [
    {id: RATING_CRITERIA_CODING, name: 'Coding skills'},
    {id: RATING_CRITERIA_COMMUNICATION, name: 'Communication skills'},
    {id: RATING_CRITERIA_SPEED, name: 'Speed'}
];

export const PROGRESS_EVENT_TYPE_DEFAULT = 1;
export const PROGRESS_EVENT_TYPE_PERIODIC = 2;
export const PROGRESS_EVENT_TYPE_MILESTONE = 3;
export const PROGRESS_EVENT_TYPE_SUBMIT = 4;

export const PROGRESS_REPORT_STATUS_ON_SCHEDULE = 1;
export const PROGRESS_REPORT_STATUS_BEHIND = 2;
export const PROGRESS_REPORT_STATUS_STUCK = 3;

export const PROGRESS_REPORT_STATUS_CHOICES = [
    {id: PROGRESS_REPORT_STATUS_ON_SCHEDULE, name: 'On schedule'},
    {id: PROGRESS_REPORT_STATUS_BEHIND, name: 'Behind'},
    {id: PROGRESS_REPORT_STATUS_STUCK, name: 'Stuck'}
];

export const INTEGRATION_TYPE_REPO = 1;
export const INTEGRATION_TYPE_ISSUE = 2;

export const INTEGRATION_TYPE_CHOICES = [
    {id: INTEGRATION_TYPE_REPO, name: 'Repository'},
    {id: INTEGRATION_TYPE_ISSUE, name: 'Issue'},
];

export const INTEGRATION_EVENT_PUSH = 'push';
export const INTEGRATION_EVENT_BRANCH = 'branch';
export const INTEGRATION_EVENT_TAG = 'tag';
export const INTEGRATION_EVENT_COMMIT_COMMENT = 'commit_comment';
export const INTEGRATION_EVENT_PULL_REQUEST = 'pull_request';
export const INTEGRATION_EVENT_PULL_REQUEST_COMMENT = 'pull_request_comment';
export const INTEGRATION_EVENT_ISSUE = 'issue';
export const INTEGRATION_EVENT_ISSUE_COMMENT = 'issue_comment';
export const INTEGRATION_EVENT_WIKI = 'wiki';
export const INTEGRATION_EVENT_RELEASE = 'release';

export const INTEGRATION_EVENT_COMMUNICATION = 'communication';
export const INTEGRATION_EVENT_PROGRESS = 'progress';
export const INTEGRATION_EVENT_APPLICATION = 'application'

export const GIT_INTEGRATION_EVENT_CHOICES = [
    {'id': INTEGRATION_EVENT_PUSH, 'name': 'Push events'},
    {'id': INTEGRATION_EVENT_BRANCH, 'name': 'Branch creation and deletion'},
    {'id': INTEGRATION_EVENT_TAG, 'name': 'Tag creation and deletion'},
    {'id': INTEGRATION_EVENT_COMMIT_COMMENT, 'name': 'Commit comments'},
    {'id': INTEGRATION_EVENT_PULL_REQUEST, 'name': 'Pull requests'},
    {'id': INTEGRATION_EVENT_PULL_REQUEST_COMMENT, 'name': 'Pull request comments'},
    {'id': INTEGRATION_EVENT_ISSUE, 'name': 'Issue creation and modification'},
    {'id': INTEGRATION_EVENT_ISSUE_COMMENT, 'name': 'Issue comments'},
    {'id': INTEGRATION_EVENT_WIKI, 'name': 'Wiki updates'}
];

export const CHAT_INTEGRATION_EVENT_CHOICES = [
    {'id': INTEGRATION_EVENT_COMMUNICATION, 'name': 'Comments and file uploads'},
    {'id': INTEGRATION_EVENT_PROGRESS, 'name': 'Progress reports and milestone updates'},
    {'id': INTEGRATION_EVENT_APPLICATION, 'name': 'Developer applications and invitations'}
];

export const TASK_PAYMENT_METHOD_BITONIC = 'bitonic';
export const TASK_PAYMENT_METHOD_BITCOIN = 'bitcoin';
export const TASK_PAYMENT_METHOD_BANK = 'bank';

export const TASK_PAYMENT_METHOD_CHOICES = [
    {
        id: TASK_PAYMENT_METHOD_BITONIC,
        name: 'Pay with iDeal (NL)',
        meta: '3% payment fee',
        icon_class: 'tunga-icon-iDeal',
        details: "Our payment partner Bitonic makes it possible to send bitcoins to our developers in Africa. Tunga uses Bitcoins because it is the easiest and fastest way of sending money to Africa. Our developers in Africa can very conveniently convert the received Bitcoins to local currency. if you continue with paying with iDeal you will be directed to the website of Bitonic where you can complete the payment. Note: When it is your first time paying via Bitonic you need to verify your bank account. This process will take less than a minute. "
    },
    {
        id: TASK_PAYMENT_METHOD_BITCOIN,
        name: 'Pay with bitcoin',
        meta: 'No payment fee',
        icon_class: 'fa fa-bitcoin',
        details: "Click on continue to view the BTC address the payment needs to be send to or scan our QR code."
    },
    {
        id: TASK_PAYMENT_METHOD_BANK,
        name: 'Pay by bank transfer via invoice',
        meta: '5% payment fee',
        icon_class: 'fa fa-bank',
        details: "Click on continue to be able to download the invoice. Please make the payment within a week. To be able to perform a bank transfer you need to fill in VAT number on your profile."
    }
];


export const CHANNEL_TYPES = {
    direct: 1,
    topic: 2,
    support: 3,
    developer: 4
};

export const OFFER_REQUEST_ITEMS = {
    self_guided: "self_guided",
    onboarding: "onboarding",
    onboarding_special: "onboarding_special",
    project: "project"
};

export const OFFER_ITEM_NAMES = {
    self_guided: "Do-it-yourself",
    onboarding: "Intensive Guidance & Support",
    onboarding_special: "Onboarding Special Offer",
    project: "Dedicated Monitor & Troubleshooter"
};
