import React, {useState} from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import TaskContext from "../Context/TaskContext";
import moment from "moment";
import {Modal, ModalBody} from 'react-bootstrap';
import {Link} from "react-router-dom";

let user_data = JSON.parse(localStorage.getItem('user-data'));
let searchString = '';
const Filter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [assignedUser, setAssignedUser] = useState('assigned_to_me');
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [searchData, setSearchData] = useState('');
    const [filterPopup, setFilterPopup] = useState(false)
    searchString = searchQuery + "&to_date=" + moment().format('YYYY-MM-DD') + "&assigned_to_user=" + user_data.id;
    const submit = () => {
        let assign_user = '';
        if (assignedUser === "assigned_to_me") {
            assign_user = "&assigned_to_user=" + user_data.id;
        } else if (assignedUser === "assigned_by_me") {
            assign_user = "&assigned_by_user=" + user_data.id
        }
        searchString = searchQuery + "&to_date=" + moment(selectedDate).format('YYYY-MM-DD') + assign_user;
        setSearchData(searchQuery + "&to_date=" + moment(selectedDate).format('YYYY-MM-DD') + assign_user);
        console.log("Search String", searchString);
    }
    return (
        <TaskContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="row align-items-center mb-4 px-3">
                            <div className="col-sm-4">
                                <div className="search-input">
                                    <input type="text" className="form-control" placeholder=" Search"
                                           value={context.filters.search_text}
                                           onChange={(e) => context.handleFilterInputEvent('search_text', e.target.value)}/>
                                    <div className="search-icons">
                                        <button onClick={context.getTaskData}><i className="fa fa-search mr-2"> </i></button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 pr-0 text-right">
                                <Link to={'/app/task-app/add'} className={"btn btn-primary btn-sm waves-effect waves-light"}>
                                    <i
                                        className="fa fa-plus mr-1"> </i>Add New
                                </Link>
                            </div>
                            <div className="col-md-1">
                                <div className="dropdown card-dropdown table-filter">
                                    <div className="dropdown-toggle card-dots" type="button" id="dropdownMenuButton">

                                        <a
                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                            onClick={() => {
                                                setFilterPopup(true)
                                            }}>
                                            <i className="fa fa-filter mr-1"> </i>Filter</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {
                            <Modal show={filterPopup}>
                                <Modal.Body>
                                    <div className="row">
                                        <button type="button" className="close" data-dismiss="modal"
                                                aria-label="Close">
                                        <span aria-hidden="true" onClick={() => {
                                            setFilterPopup(false);
                                        }}>&times;</span>
                                        </button>

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="trans-type">User</label>
                                                <select className="form-control" id="is_public" value={context.filters.assigned_user}
                                                        onChange={(e) => context.frameFilterData(e.target.value, e.target.value)}
                                                        name="assigned_user">
                                                    <option value={''} disabled={true}>Select</option>
                                                    <option value="assigned_to_me">{"Assigned to me"}</option>
                                                    <option value="assigned_by_me">{"Assigned by me"}</option>
                                                </select>
                                            </div>
                                        </div>


                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="trans-type">Date</label>
                                                <Flatpickr className="form-control"
                                                           options={{minDate: moment().format('YYYY-MM-DD')}}
                                                           value={selectedDate}
                                                           onChange={(date) => context.frameFilterData('to_date', date[0])}
                                                />
                                            </div>
                                        </div>


                                        <div className="col-md-12">
                                            <div className="act-links mt-2 text-center">
                                                <a className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                   onClick={() =>
                                                       context.getTaskData(setFilterPopup(false))
                                                   }>Search</a>
                                            </div>
                                        </div>
                                    </div>

                                </Modal.Body>
                            </Modal>

                        }
                    </React.Fragment>
                )
            }
        </TaskContext.Consumer>
    )
}
export default Filter;