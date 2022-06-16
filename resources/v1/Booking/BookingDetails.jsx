import React, { useEffect, useState, } from 'react';
import {useParams, useLocation, Link} from "react-router-dom";
import { BOOKING_DETAIL_LIST,SOCKET_MODULE,UPDATE_BOOKING_STATUS } from "../Auth/Context/AppConstant";
import axios from "axios";
import 'moment-timezone';
import helpers from "../../helpers";
import BreadCrumb from "../Common/BreadCrumb";
let moment = require('moment');
import toast from "react-hot-toast";
import {MomentDateFormat} from "../Common/MomentDateFormat";
import ValidationError from "../Common/ValidationError";

const BookingDetails = (props) => {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [socketDetails, setSocketDetails] = useState([]);
    const [riderDetails, setRiderDetails] = useState([]);
    const [vendorDetails, setVendorDetails] = useState([]);
    const [actionHistory, setActionHistory] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [showMore, setShowMore] = useState('false');
    const [showStatus, setShowStatus] = useState('false');
    const [editStatus, setEditStatus] = useState('true');
    const [showEditOption,setShowEditOption] = useState('false');
    const [showLess, setShowLess] = useState('true');
    const [showLoadMore,setShowLoadMore] = useState('true');
    const[socketId, setSocketId] = useState('');
    const[bookingStatus, setBookingStatus] = useState('');
    
    const [errors, setErrors] = useState([]);

    let statusArrry =['COMPLETED','CANCEL'];

    let { id } = useParams();
   
    let queryParam = helpers.useQueryParams();
    const breadCrumbs = [
        {name: "Bookings", url: "/app/booking-app", class: "breadcrumb-item"},
        {name: "Socket Details", url: "", class: "breadcrumb-item active"}
    ];
      
    useEffect(() => {
        getModuleData();
        axios.get(BOOKING_DETAIL_LIST + '/' + id+"/detail")
            .then(res => {
                if (res.data && res.data.success) {
                    setBookingDetails(res.data.data);
                    setSocketDetails(res.data.data.socket_detail);
                    setSocketId(res.data.data.socket_detail._id)
                    setActionHistory(res.data.data.ll_dp_transaction);
                    setRiderDetails(res.data.data.rider);
                    setVendorDetails(res.data.data.vendor);
 
                }
                
                let statusExists = statusArrry.includes(res.data.data.booking_status);
                
                if(statusExists) 
                {
                    setShowEditOption(false);
                  
                }else{
                    setShowEditOption(true);
                  
                }
            })
    }, []);

    
    
   let minsdiff = moment.duration(moment().diff(moment(bookingDetails.updated_at))).asMinutes();

    const getModuleData = () => {
        axios.get(SOCKET_MODULE)
            .then(res => {
                if (res.data && res.data.success) {
                    setModuleData(res.data.data);
                   
                }
            })
    };

    const loadMoreData = () =>{
        setShowMore(true);
        setShowLoadMore(false);
    }

    const loadStatusSelect = () =>{
        setShowStatus(true);
        setEditStatus(false)
    }

    const onFieldChangeHandler = (value) => {
        setBookingStatus(value);
    };

   const showStatusValue = () =>{
    setShowStatus(false);
    setShowEditOption(false);

   }

    const updateStatus = () =>{

       
        
        let postData = {
            booking_id: id,
            socket_id: socketId,
            booking_status: bookingStatus
        };

        axios.post(UPDATE_BOOKING_STATUS, postData)
        .then(res => {
            setErrors([]);
            if (res.data && res.data.success) {
                toast.success(res.data.msg);
                showStatusValue();
                window.location.href = '/app/booking-app/booking/details/'+id+'?src=bkg';
               
            }
        })
        .catch((error) => {
            if(error && error.response && error.response.data && error.response.data.errors.length > 0) {
                setErrors(error.response.data.errors);
            }

            if (error && error.response.status === 401) {
                toast.error('unauthorised action');
            }
        })

        
            
    }

    
    return (
        <React.Fragment>
            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <h4 className="page-title mt-1 width-auto">Booking Details</h4>
                                <div className="font-15 width-auto ml-3">
                                    <span className="badge badge-pill badge-primary">{bookingDetails.booking_type ? helpers.replaceUderscoreWithSpace(bookingDetails.booking_type) : ''}</span>
                                </div>
                                
                            </div>
                        </div>
                        <BreadCrumb breadCrumbs={breadCrumbs}></BreadCrumb>

                        <div className="col-md-12  text-right">
                            {
                                queryParam.get("src") === "map" ?
                                    <Link to={'/app/booking-app/booking/map/view'} className="btn btn-primary btn-sm"><i className="fa fa-angle-left" aria-hidden="true"></i> Back</Link> :
                                    <a href={queryParam.get("src")==="crg" ?'/app/charging-app/socket/details/'+queryParam.get("id")+'?src=bkg&id='+id :'/app/booking-app'} className="btn btn-primary btn-sm"><i className="fa fa-angle-left" aria-hidden="true"></i> Back</a>
                            }

                        </div>
                    </div>
                  
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body">
                                    <h4 className="mt-0 header-title  width-auto">Basic Details</h4>
                                   
                                    { (showEditOption === true  && minsdiff >= 180) &&
                                    <div className="float-right width-auto  pencil-icon">
										<a className="edit" onClick={() => loadStatusSelect()} href="#"><i className="icon-pen"></i></a>
									</div>
                                   }
                                    <div className="row">
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Booking Id</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.ll_booking_no}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Region</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.ll_region_id}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Booked For</label>
                                                <span className="d-block mt-1 font-weight-600"><MomentDateFormat datetime={bookingDetails.start_time ?  bookingDetails.start_time : ''}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Booking Type</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.booking_type ? helpers.replaceUderscoreWithSpace(bookingDetails.booking_type) : ''}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Employee Id</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.created_user_id}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Name</label>
                                                <span className="d-block mt-1 font-weight-600">{riderDetails.name}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Mobile No</label>
                                                <span className="d-block mt-1 font-weight-600">+91 {riderDetails.mobile}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vendor Socket id</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.ll_vendor_socket_id}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Socket id</label>
                                                <span className="d-block mt-1 font-weight-600"><a className="id-link" href={'/app/charging-app/socket/details/' + bookingDetails.socket_id + '?src=bkg&id='+id}>{socketDetails.ll_sno}</a></span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Is Public</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.is_public ? helpers.findNamefromObject(moduleData, 'id', bookingDetails.is_public, 'description') : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vendor</label>
                                                <span className="d-block mt-1 font-weight-600">{vendorDetails.ll_vendor_name}</span>
                                            </div>
                                        </div>
                                        
                                        { editStatus &&
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Booking Status</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.booking_status ? helpers.replaceUderscoreWithSpace(bookingDetails.booking_status) : ''}</span>
                                            </div>
                                            
                                        </div>
                                        }

                                        { showStatus === true &&
                                            <div className="col-md-6 col-lg-4">
                                                <select className="form-control"  onChange={(e) =>onFieldChangeHandler( e.target.value)}>
                                                    <option>Select Booking Status</option>
                                                    <option value="COMPLETED">Completed</option>
                                                    <option value="CANCEL">Cancel</option>
                                                </select>
                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'booking_status'}> </ValidationError> : ''
                                                }
                                                <div >
                                                <a href="#" className="btn btn-danger waves-effect waves-light padding-top" onClick={() => showStatusValue()}>Cancel</a>
                                                <span>&nbsp;&nbsp;</span>
                                                <a href="#"
                                                               className="btn btn-success waves-effect waves-light padding-top" onClick={() => updateStatus()} >Save</a>
                                            </div>
                                            </div>
                                            }
                                        
                                         
                                        

                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Socket Address</label>
                                                <span className="d-block mt-1 font-weight-600">{socketDetails.address}</span>
                                            </div>
                                        </div>
                                                                               
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body">
                                    <h4 className="mt-0 header-title  width-auto">Usage and Billing Details</h4>

                                    <div className="row">
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Time Consumed (Minutes)</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.duration_in_minutes ? parseFloat(bookingDetails.duration_in_minutes).toFixed(2) : 0}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Unit Consumed (kWh)</label>
                                                <span className="d-block mt-1 font-weight-600">{bookingDetails.units_consumed ? (bookingDetails.units_consumed /1000): 0}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Per unit cost </label>
                                                <span className="d-block mt-1 font-weight-600">₹{bookingDetails.rate_per_unit ? bookingDetails.rate_per_unit : 0 }</span>
                                            </div>
                                        </div>
                                       
                                       
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Billing Cost</label>
                                                <span className="d-block mt-1 font-weight-600">₹0</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4"> 
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Charging Start Date & Time</label> 
                                                <span className="d-block mt-1 font-weight-600"><MomentDateFormat datetime={bookingDetails.actual_start_time ? bookingDetails.actual_start_time : bookingDetails.start_time}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4"> 
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Charging End Date & Time</label> 
                                                <span className="d-block mt-1 font-weight-600"><MomentDateFormat datetime={bookingDetails.actual_end_time ? bookingDetails.actual_end_time : bookingDetails.end_time}/></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                   <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body table-card">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="mt-0 header-title  pl-3">Action History</h4>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">S.No</th>
                                                    <th scope="col">User</th>
                                                    <th scope="col">Action Date & Time</th>
                                                    <th scope="col">User Location</th>
                                                    <th scope="col">Indicate if done by system</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {

                                                    actionHistory.length > 0 ? actionHistory.map((action, i) => (
                                                        <React.Fragment key={i}>
                                                            {i < 10 && showLess &&

                                                                <tr key={i}  >
                                                                    <td>{i + 1}</td>
                                                                    <td>{action.created_user_id === bookingDetails.created_user_id ? riderDetails.name : 'System'}</td>
                                                                    <td><MomentDateFormat datetime={action.created_at ? action.created_at : ''}/></td>
                                                                    <td> {action.latitude > 5 ? action.latitude + ',' + action.longitude : '-'}</td>
                                                                    <td>{action.created_user_id === bookingDetails.created_user_id ? 'No' : 'Yes'}</td>
                                                                    <td>{action.action ? helpers.replaceUderscoreWithSpace(action.action) : '-'} </td>
                                                                </tr>

                                                            }
                                                            {i === 11 && showLoadMore &&
                                                                <tr ><td colSpan="6"><div className="text-center load-more"><span onClick={loadMoreData}>Load More...</span></div></td></tr>
                                                            }

                                                            {showMore === true && i > 9 &&
                                                                <tr key={i} >
                                                                    <td>{i + 1}</td>
                                                                    <td>{action.created_user_id === bookingDetails.created_user_id ? riderDetails.name : 'System'}</td>
                                                                    <td><MomentDateFormat datetime={action.created_at ? action.created_at : ''}/></td>
                                                                    <td> {action.latitude > 5 ? action.latitude + ',' + action.longitude : '-'}</td>
                                                                    <td>{action.created_user_id === bookingDetails.created_user_id ? 'No' : 'Yes'}</td>
                                                                    <td>{action.action ? helpers.replaceUderscoreWithSpace(action.action) : '-'} </td>

                                                                </tr>
                                                            }
                                                        </React.Fragment>

                                                    )) :

                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td> No Booking  Actions</td>
                                                        <td></td>
                                                        <td></td>

                                                    </tr>

                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                  
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
        </React.Fragment>
    )
}

export default BookingDetails