import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";
import TaskContext from "./Context/TaskContext";
import { Modal } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import "flatpickr/dist/themes/material_green.css";
import axios from "axios";
import {
  GET_NON_RIDER_LIST,
  CHECK_TASK_ROLE_PERMISSION,
} from "../Auth/Context/AppConstant";
import Select from "react-select";
import toast from "react-hot-toast";

const CloseButton = (props) => {
  const { closeModal } = props;
  return (
    <button
      type="button"
      className="close"
      data-dismiss="modal"
      aria-label="Close"
    >
      <span
        aria-hidden="true"
        onClick={() => {
          closeModal(false);
        }}
      >
        &times;
      </span>
    </button>
  );
};

const Filter = () => {
  const [showModal, setShowModal] = useState(false);
  const [nonRider, setNonRider] = useState();
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [bulkUpload, setBulkUpload] = useState(false);

  useEffect(() => {
    nonRiderList();
    checkBulkUploadPermission();
  }, []);

  const nonRiderList = () => {
    axios
      .get(GET_NON_RIDER_LIST)
      .then((res) => {
        if (res.data && res.data.success) {
          setNonRider(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const checkBulkUploadPermission = () => {
    axios
      .get(
        CHECK_TASK_ROLE_PERMISSION +
          "?module_name=task&module_value=bulk_upload"
      )
      .then((res) => {
        if (res.data && res.data.success) {
          console.log(res.data.success);
          setBulkUpload(true);
        }
      })
      .catch((error) => {
        // toast.error(err);
      });
  };

  return (
    <TaskContext.Consumer>
      {(context) => (
        <Fragment>
          <div className="row align-items-center mb-4 px-3">
            <div className="col-sm-4">
              <div className="search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" Search Task Id/ Task / User"
                  onChange={(e) =>
                    context.handleFilterInputsChangeEvent(
                      "search_text",
                      e.target.value
                    )
                  }
                  value={context.filters.search_text}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      context.handleFilterTask();
                    }
                  }}
                />
                <div className="search-icons">
                  <button
                    type="button"
                    onClick={() => context.handleFilterTask()}
                  >
                    <i className="fa fa-search mr-2"> </i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-8 pr-0 text-right">
              <a
                className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                data-toggle="modal"
                data-target=".filter-popup"
                onClick={() => context.resetFilter()}
              >
                <i className="fa fa-refresh mr-1"> </i>Reset
              </a>

              <a
                className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                onClick={() => setShowModal(true)}
              >
                <i className="fa fa-filter mr-1"> </i>Filter
              </a>

              <div className="btn-group dropdown ml-2">
                <a
                  href="/app/task-app/add"
                  className="btn btn-primary btn-sm waves-effect waves-light"
                >
                  <i className="fa fa-plus mr-1"></i>Add New
                </a>
                {bulkUpload && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary-dark btn-sm waves-effect waves-light dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu">
                      <a
                        className="dropdown-item"
                        href="/app/task-app/bulk/upload"
                      >
                        Bulk Upload
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Modal show={showModal}>
            <Modal.Body>
              <div className="row">
                <CloseButton closeModal={setShowModal} />

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Assign To User<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select User"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={nonRider}
                      onChange={(e) =>
                        context.handleFilterInputsChangeEvent(
                          "assigned_to_user",
                          e
                        )
                      }
                      defaultValue={context.filters.assigned_to_user_obj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Assign By User<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select User"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={nonRider}
                      onChange={(e) =>
                        context.handleFilterInputsChangeEvent(
                          "assigned_by_user",
                          e
                        )
                      }
                      defaultValue={context.filters.assigned_by_user_obj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="trans-type">Date Range</label>
                    <Flatpickr
                      className="form-control"
                      options={{ mode: "range", dateFormat: "Y-m-d" }}
                      defaultValue={context.filters.date_range}
                      onChange={(date, dateStr) =>
                        context.handleFilterInputsChangeEvent("date", dateStr)
                      } //minDate: moment().format('YYYY-MM-DD'),
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="act-links mt-2 text-center">
                    <a
                      onClick={() => {
                        context.handleFilterTask();
                        setShowModal(false);
                      }}
                      className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                    >
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Fragment>
      )}
    </TaskContext.Consumer>
  );
};

export default Filter;
