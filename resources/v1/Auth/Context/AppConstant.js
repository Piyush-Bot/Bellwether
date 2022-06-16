/**
 * All app level constant for Auth Section
 * required to configure in this file.
 *
 * This ranges from base, api's & unchanged variables/keys
 */
// IP = localhostgit
import jsonUrls from "../../724892.json";

/**
 * BASE URL
 */
export const BASE_URL = jsonUrls.loginApp;

/**
 * API to generate OTP
 */
export const GENERATE_OTP = BASE_URL + "generate/otp";

/**
 * To validate otp for login
 */
export const VERIFY_OTP = BASE_URL + "verify/otp";

/**
 * To validate existing token
 */
export const VALIDATE_TOKEN = BASE_URL + "verify/token";

/**
 *RBCA BASE URL
 */
export const RBCA_BASE_URL = jsonUrls.uselessApp;

export const CHARGING_POINT_BASE_URL = jsonUrls.chargingApp;

export const ORDER_MANAGEMENT_BASE_URL = jsonUrls.omsApp;

export const TASK_MANAGEMENT_BASE_URL = jsonUrls.tmsApp;

export const HRMS_BASE_URL = jsonUrls.hrms;

export const ROLES_DATA = RBCA_BASE_URL + "access/role/list";

export const ROLES_DATA_EDIT = RBCA_BASE_URL + "access/role/view";

export const ROLES_SELECT_DATA = RBCA_BASE_URL + "access/role/list-ll-roles";

export const ALL_MODULES = RBCA_BASE_URL + "access/modules/list";

export const MODULES_DATA = RBCA_BASE_URL + "access/module/page/list";

export const ACTION_DATA = RBCA_BASE_URL + "access/action/list";
export const ALL_ACTIONS_DATA = RBCA_BASE_URL + "access/action/list/all";

export const STORE_ACTION =
  RBCA_BASE_URL + "access/role/module/page/action/add";

export const VENDORS_LIST = RBCA_BASE_URL + "access/vendor/list";

export const VENDORS_LIST_BY_MODULE =
  RBCA_BASE_URL + "access/vendor/by-module-code";

export const ROLE_HAS_MODULE_DATA = RBCA_BASE_URL + "access/role/module/list";

export const USERS_DATA = RBCA_BASE_URL + "user/list";

export const MODULE_DATA = RBCA_BASE_URL + "module/list";

export const MODULE_VIEW = RBCA_BASE_URL + "module/view";

export const ADD_MODULE_DATA = RBCA_BASE_URL + "module/add";

export const ALL_MODULES_DATA = RBCA_BASE_URL + "module/list-all";

export const PAGE_DATA = RBCA_BASE_URL + "page/list";

export const ALL_PAGE_DATA =
  RBCA_BASE_URL + "page-action-mapping/page/list-all";

export const PAGE_VIEW = RBCA_BASE_URL + "page/view";

export const ADD_PAGE_DATA = RBCA_BASE_URL + "page/add";

export const ACTIONS_DATA = RBCA_BASE_URL + "actions/list";

export const ACTIONS_VIEW = RBCA_BASE_URL + "actions/view";

export const ADD_ACTIONS_DATA = RBCA_BASE_URL + "actions/add";

export const ALL_PAGE_ACTION_MAPPING_DATA =
  RBCA_BASE_URL + "page-action-mapping/list-all";

export const PAGE_ACTION_MAPPING_DATA_BY_MODULE_ID =
  RBCA_BASE_URL + "page-action-mapping/actionpagemodules";

export const STORE_PAGE_MAPPING_ACTIONS =
  RBCA_BASE_URL + "page-action-mapping/add";

export const GET_USER_ROLE_PERMISSION =
  RBCA_BASE_URL + "access/user/role/permission";

export const CHECK_TASK_ROLE_PERMISSION =
  RBCA_BASE_URL + "access/check/ui/role/permission";

export const SOCKET_LIST = CHARGING_POINT_BASE_URL + "charging/socket/list";

export const NEAR_BY_SOCKET =
  CHARGING_POINT_BASE_URL + "charging/socket/search/nearBySocket";

export const SOCKET_VIEW = CHARGING_POINT_BASE_URL + "charging/socket/view";

export const SOCKET_UPDATE = CHARGING_POINT_BASE_URL + "charging/socket/update";

export const SOCKET_STORE =
  CHARGING_POINT_BASE_URL + "charging/socket/basic-details";

export const UPDATE_SOCKET_STATUS =
  CHARGING_POINT_BASE_URL + "charging/socket/update-status";

export const SOCKET_DATA_ENTRY_UPDATE =
  CHARGING_POINT_BASE_URL + "charging/socket/data-entry/update";

export const SOCKET_MODEL_LIST =
  CHARGING_POINT_BASE_URL + "charging/socket/model/list";

export const SOCKET_MODULE = CHARGING_POINT_BASE_URL + "get-modules";

export const RE_VENDOR_LIST = CHARGING_POINT_BASE_URL + "re-vendor";

export const RE_VENDOR_LOCATION =
  CHARGING_POINT_BASE_URL + "re-vendor-location";

export const BOOKING_HISTORY =
  CHARGING_POINT_BASE_URL + "charging/socket/v2/booking-history";

export const BOOKING_LIST =
  CHARGING_POINT_BASE_URL + "charging/socket/booking/list";

export const SOCKET_BOOKING_LIST =
  CHARGING_POINT_BASE_URL + "charging/socket/booking/global-booking-list";

export const BOOKING_DETAIL_LIST = CHARGING_POINT_BASE_URL + "sockets/booking";

export const BOOKED_DATA_BASED_LOC =
  CHARGING_POINT_BASE_URL + "charging/socket/booking/data/based-loc";

export const UPDATE_BOOKING_STATUS =
  CHARGING_POINT_BASE_URL + "charging/socket/booking/update-booking-status";

export const SOCKET_MODEL_EDIT =
  CHARGING_POINT_BASE_URL + "charging/socket/model/edit/";

export const SOCKET_CHANGE_HISTORY =
  CHARGING_POINT_BASE_URL + "charging/socket/status/change/history/";

export const ACCESS_MODULE_PAGE = RBCA_BASE_URL + "access-management/page-list";

export const ACCESS_CONFIGURATION =
  CHARGING_POINT_BASE_URL + "configuration/list";

export const ADD_CONFIGURATION = CHARGING_POINT_BASE_URL + "configuration/add";

export const ADD_CONFIGURATION_SUBDOCUMENT =
  CHARGING_POINT_BASE_URL + "configuration/add/sub-document/";

export const ACCESS_CONFIGURATION_SUBLIST =
  CHARGING_POINT_BASE_URL + "configuration/sub/list";

export const UPDATE_CONFIGURATION_DATA =
  CHARGING_POINT_BASE_URL + "configuration/update/";

export const ACCESS_COMMON_MODULE_LIST =
  CHARGING_POINT_BASE_URL + "common/module/list";

export const ADD_COMMON_MODULE = CHARGING_POINT_BASE_URL + "common/module/add";

export const ADD_SUB_MODULE =
  CHARGING_POINT_BASE_URL + "common/module/sub/add/";

export const ACCESS_COMMON_MODULE_SUBLIST =
  CHARGING_POINT_BASE_URL + "common/module/sub/list";

export const UPDATE_SUB_MODULE_DATA =
  CHARGING_POINT_BASE_URL + "common/module/sub/update/";

export const SUB_MODULE_DETAILS =
  CHARGING_POINT_BASE_URL + "common/module/sub/module/details";

export const GET_AMS_LOCATION = CHARGING_POINT_BASE_URL + "ams-location";

export const GET_AMS_ASSET = CHARGING_POINT_BASE_URL + "ams-asset-purchase/";

export const GET_ORDERS = ORDER_MANAGEMENT_BASE_URL + "order/list";

export const GET_TASK = TASK_MANAGEMENT_BASE_URL + "web/task/list";

export const GET_TASK_MASTER_DATA = TASK_MANAGEMENT_BASE_URL + "task/masters";

export const GET_TASK_DETAIL =
  TASK_MANAGEMENT_BASE_URL + "web/task/detail-view/";

export const UPDATE_TASK = TASK_MANAGEMENT_BASE_URL + "web/task/status/update/";

export const HISTORY = TASK_MANAGEMENT_BASE_URL + "web/task/history/list/";

export const COMMENTS_LIST =
  TASK_MANAGEMENT_BASE_URL + "web/task/comments/list/";

export const ADD_COMMENT = TASK_MANAGEMENT_BASE_URL + "web/task/add/comment/";

export const GET_NON_RIDER_LIST =
  TASK_MANAGEMENT_BASE_URL + "task/non-rider/list";

export const GET_MASTER_LIST = TASK_MANAGEMENT_BASE_URL + "task/masters";

export const CREATE_TASK = TASK_MANAGEMENT_BASE_URL + "web/task/create";

export const GET_ORDERS_DETAIL = ORDER_MANAGEMENT_BASE_URL + "order/details/";

export const UPLOAD_FILE = TASK_MANAGEMENT_BASE_URL + "task/web/upload/file/";

export const DOWNLOAD_FILE = TASK_MANAGEMENT_BASE_URL + "task/read/file/";

export const DELETE_FILE = TASK_MANAGEMENT_BASE_URL + "task/delete/file/";

export const EDIT_TASK = TASK_MANAGEMENT_BASE_URL + "web/task/edit/";

/******** Task - Bulk Upload  Code Start *******/
export const UPLOAD_FILE_BULK =
  TASK_MANAGEMENT_BASE_URL + "web/task/create/bulk";

export const GET_TASK_ID =
  TASK_MANAGEMENT_BASE_URL + "web/task/auto/generate/taskId/";

export const FIND_USER_IDS = TASK_MANAGEMENT_BASE_URL + "web/task/find/userIds";

export const UPDATE_TASK_COUNT =
  TASK_MANAGEMENT_BASE_URL + "web/task/bulk/update/count/";

export const GET_BULK_UPLOAD_TASK_HISTORY =
  TASK_MANAGEMENT_BASE_URL + "web/task/bulk/history";

/******** Task - Bulk Upload  Code End *******/

export const ADD_XL_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/add";

export const DOWNLOAD_XL_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/downloadxlsdata";

export const LIST_XL_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/listuploads";

export const VIEW_XL_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/view";

export const UPDATE_XL_DATA =
  CHARGING_POINT_BASE_URL + "excelupload/listuploads/update";

export const STATE_CITY_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/list-state-city";

export const CHECKIN_CHECKOUT_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/list-check-in-out";

export const HUB_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/list-hub";

export const CLIENT_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/list-client";

export const STATES_CITY_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/states-city";

export const CITY_HUB_DATA = ORDER_MANAGEMENT_BASE_URL + "reports/city-hub";

export const CHECKIN_CHECKOUT_EXCEL_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/download-checkin-list";

export const DAILY_COUNT_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/list-checkin";

export const RIDER_SNAPSHOT_DATA =
  ORDER_MANAGEMENT_BASE_URL + "reports/checkin-snapshot";

export const RIDER_SNAPSHOT_DATA_DATEWISE =
  ORDER_MANAGEMENT_BASE_URL + "reports/checkin-snapshot-list";

export const DOWNLOAD_SNAPSHOT_DATA_DATEWISE =
  ORDER_MANAGEMENT_BASE_URL + "reports/download-checkin-snapshot-list";
