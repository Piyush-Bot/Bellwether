/**
 * All app level constant for Auth Section
 * required to configure in this file.
 *
 * This ranges from base, api's & unchanged variables/keys
 */
// IP = 3.108.182.167

/**
 * BASE URL
 */
export const BASE_URL = "https://testdashboard.lightninglogistics.in/api/";

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
export const RBCA_BASE_URL = "https://testdashboard.lightninglogistics.in/api/";

export const ROLES_DATA = RBCA_BASE_URL + "access/role/list";

export const ALL_MODULES = RBCA_BASE_URL + "access/modules/list";

export const MODULES_DATA = RBCA_BASE_URL + "access/module/page/list";

export const ACTION_DATA = RBCA_BASE_URL + "access/action/list";

export const STORE_ACTION =
  RBCA_BASE_URL + "access/role/module/page/action/add";

export const ROLE_HAS_MODULE_DATA = RBCA_BASE_URL + "access/role/module/list";
