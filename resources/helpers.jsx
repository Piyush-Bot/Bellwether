import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { VALIDATE_TOKEN } from "./v1/Auth/Context/AppConstant";

import { useLocation } from "react-router-dom";

import { MomentDateFormat } from "../resources/v1/Common/MomentDateFormat";
const moment = require("moment");

/**
 * All the common helper methods are build here
 *
 * Common methods which can be used anywhere between modules & components
 * which doesn't depend on any state full components
 */

const helper = {
  /**
   * Generate UUID
   */
  generateUuid() {
    return uuidv4();
  },

  findObjectRecursively: function (object, key, predicate) {
    if (object && key && predicate) {
      if (object.hasOwnProperty(key) && predicate(key, object[key]) === true)
        return object;

      for (let i = 0; i < Object.keys(object).length; i++) {
        if (typeof object[Object.keys(object)[i]] === "object") {
          let o = this.findObjectRecursively(
            object[Object.keys(object)[i]],
            key,
            predicate
          );
          if (o != null) return o;
        }
      }
    }
    return null;
  },

  findArrayElementByValue: function (array, value) {
    return array.find((element) => {
      return element === value ? true : false;
    });
  },

  /*Validate Empty && undefind && null */
  isEmpty(value) {
    if (value === "" || value === "undefind" || value === null || value === 0) {
      return true;
    }
    return false;
  },

  // custom in array
  inArray: function (needle, haystack) {
    const length = haystack.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        console.log("Result ");
        if (parseInt(haystack[i]) === parseInt(needle)) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  },

  // find by object i array
  findObject: function (array, key, value) {
    return array.find((val) => val[key] === value);
  },

  // find by value from array of object
  findvaluefromObject: function (array, key, value) {
    const result = array.find((val) => val[key] === value);
    return result ? result.description : "-";
  },
  // find value from json object
  findNamefromObject: function (array, key, value, column) {
    // console.log(array,key, value, column)

    const result = array.find((val) => val[key] === value);

    return result ? result[column] : "-";
  },

  // find by object i array
  findCheckedPages: function (array, key, value) {
    if (array !== undefined) {
      const data = array.find((val) => val[key] === value);
      if (data && data.id) return true;
      return false;
    }
    return false;
  },

  //custom frame only id in array
  frameIDFromArray: function (array) {
    let id = [];
    array.length > 0 && array !== "undefined"
      ? array.map((e) => id.push(e.id))
      : [];
    return id;
  },

  // Frame header request
  headerRequest: function (token) {
    return { headers: { Authorization: `llBearer ${token}` } };
  },

  /**
   * Handle pre request header & config globally
   */
  handlePreRequest() {
    axios.interceptors.request.use(
      function (request) {
        // Do something with response data
        request.headers["Authorization"] = `llBearer ${localStorage.getItem(
          "app-ll-token"
        )}`;
        return request;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  },

  /**
   * Handle common errors & invalid api requests
   */
  handleErrors() {
    axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        if (!error.response) {
          // alert('There is a network error, please reload the page.');
          console.log("There is a network error, please reload the page.");
          console.log(error);
        }

        if (error.response.status === 401) {
          window.location.reload();
        }
        // Do something with response error
        return Promise.reject(error);
      }
    );
  },

  /**
   * validate browser token to allow component load
   */
  validateBrowserToken(token) {
    axios
      .get(VALIDATE_TOKEN, {
        headers: {
          Authorization: "llBearer " + token, //the token is a variable which holds the token
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/";
      });
  },

  /**
   * @param errors - Array
   * @param messageContainer - object
   */
  validationParsers(errors, messageContainer) {
    if (errors.length > 0) {
      errors.map((err) => {
        if (messageContainer.hasOwnProperty(err.param)) {
          messageContainer[err.param].push(err.msg);
        }
      });
    }
    return messageContainer;
  },

  /**
   * To display error messages
   * @param messages - Array
   */
  displayMessage(messages) {
    if (messages.length > 0)
      return messages.map((message, key) => (
        <span style={{ display: "block" }} key={key} className={"text-danger"}>
          {message}
        </span>
      ));

    return null;
  },
  /**
   * Change first letter to caps in each words.
   */
  capitalizeTheFirstLetterOfEachWord(words) {
    if (words !== undefined) {
      var separateWord = words.toLowerCase().split(" ");
      for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }
      return separateWord.join(" ");
    }
    return null;
  },

  /**
   * Replace underscore with single space and change the  word to uppercase.
   */
  replaceUderscoreWithSpace(word) {
    const searchRegExp = "_";
    const replaceWith = " ";
    const convertedWord = word
      .replaceAll(searchRegExp, replaceWith)
      .toUpperCase();

    return this.capitalizeTheFirstLetterOfEachWord(convertedWord);
  },

  /**
   *
   * @returns the query parameter
   */
  useQueryParams() {
    return new URLSearchParams(useLocation().search);
  },
  /**
   * create array of string
   * @param {*} array
   *
   * @returns
   */
  createArrayOfString: function (array) {
    let loggedInUserDetail = [];
    array.length > 0 && array !== "undefined"
      ? array.map((e) => loggedInUserDetail.push(e.role))
      : [];
    return loggedInUserDetail;
  },

  /**
   * For access control Side menu and individual page
   */

  showSocketAndBookingControlMenu: function (loggedInUserDetails) {
    return (
      loggedInUserDetails &&
      (loggedInUserDetails.includes("Fleet Technician") ||
        loggedInUserDetails.includes("Fleet Manager") ||
        loggedInUserDetails.includes("Dashboard IT Support Admin") ||
        loggedInUserDetails.includes("Dashboard IT Support") ||
        loggedInUserDetails.includes("Dashboard Membership"))
    );
  },

  /**
   * For access control Side menu and individual page
   */

  showAccessControlMenu: function (loggedInUserDetails) {
    return (
      loggedInUserDetails &&
      (loggedInUserDetails.includes("Dashboard IT Support Admin") ||
        loggedInUserDetails.includes("Dashboard IT Support"))
    );
  },

  showConfigurationMenu: function (loggedInUserDetails) {
    return (
      loggedInUserDetails &&
      loggedInUserDetails.includes("Dashboard IT Support Admin")
    );
  },

  /**
   * For access control Side menu and individual page
   */

  showAccessControlSubMenu: function (loggedInUserDetails) {
    return loggedInUserDetails.includes("Dashboard IT Support Admin");
  },

  findDocumentType: function (documents, key) {
    for (let i = 0; i < documents.length; i++) {
      if (documents[i] != null) {
        if (documents[i].identification_type_id === key) {
          return documents[i].unique_no;
        }
      }
    }
  },

  /**
   * Get the rider checkin type
   */
  checkinMode: function (typevalue) {
    if (typevalue != null) {
      if (
        typevalue == 754 ||
        typevalue == 755 ||
        typevalue == 753 ||
        typevalue == 796
      ) {
        return " LL360";
      } else if (
        typevalue == 10032 ||
        typevalue == 10033 ||
        typevalue == 10012 ||
        typevalue == 10013
      ) {
        return "Charging APP";
      }
    }
  },

  /**
   * Gets the mdoule value based on module id
   *
   * @param {*} dataAarray
   * @param {*} key
   * @returns
   */
  getModuleValue: function (dataAarray, key) {
    if (key == 755 || key == 10033 || key == 10013 || key == 753) {
      return "Company Vehicle";
    }

    if (key == 754 || key == 10032 || key == 10012 || key == 752) {
      return "Own Vehicle";
    }

    if (key == 652) {
      return "Lead Rider Verified";
    }

    if (dataAarray.length > 0) {
      let descriptionValue = "";

      for (let i = 0; i < dataAarray.length; i++) {
        if (dataAarray[i].id == key) {
          descriptionValue = dataAarray[i].description;
        }
      }
      return descriptionValue;
    }
  },

  /**
   * used to calculate the date difference
   */
  dateDifference: function (now, then) {
    if (now != null && then != null) {
      let start = moment(now).format("DD-MM-YYYY HH:mm:ss");
      let end = moment(then).format("DD-MM-YYYY HH:mm:ss");

      var now = start;
      var then = end;
      var ms = moment(end, "DD/MM/YYYY HH:mm:ss").diff(
        moment(start, "DD/MM/YYYY HH:mm:ss")
      );

      var d = moment.duration(ms);
      var s = d.format("HH:mm:");

      if (s.indexOf(":") > 0) {
        var date1 = s.split(":");
        return date1[0] + " Hrs " + date1[1] + " mins";
      } else {
        return s + " mins";
      }
    } else {
      return "No Checkout Done";
    }
  },
};

export default helper;
