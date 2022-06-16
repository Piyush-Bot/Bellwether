
import React, { useEffect, useState, } from 'react';
import RbacContext from "../Context/RbacContext";
import { useParams } from "react-router-dom";
import { VIEW_XL_DATA ,UPDATE_XL_DATA} from "../../Auth/Context/AppConstant";
import axios from "axios";
import helpers from "../../../helpers";
import toast from 'react-hot-toast';


const Edit = (props) => {

    
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [leadDetails, setLeadDetails] = useState([]);
    const [aadharCard,setAadharCard]=useState(0);
    const [drivingLicence, setDrivingLicence]=useState("");
    const [panCard,setPanCard]=useState("");
    const [recruiter,setRecruiter]=useState([""]);
    const [errors, setErrors] = useState([]);
  
    let { id } = useParams();

    useEffect(() => {
        axios.get(VIEW_XL_DATA + '/' + id)
            .then(res => {
                if (res.data && res.data.success) {
                    setPaymentDetails(res.data.data);
                    setLeadDetails(res.data.data.emplead)
                    setRecruiter(res.data.data.recuiter.recruiter);
                    setAadharCard(helpers.findDocumentType(res.data.data.documents,341));
                    setDrivingLicence(helpers.findDocumentType(res.data.data.documents,342));
                    setPanCard(helpers.findDocumentType(res.data.data.documents,343));

                  
                }
            })
    }, []);
    
    
    function onCreatePost(e) {
        e.preventDefault();
       
        const postData = paymentDetails;

         axios.post(UPDATE_XL_DATA, postData).then((res) => {

          
            setErrors([]);

           if(res.data.success=== true){
            toast.success("Updated Successfully");
            return props.history.push('/app/access-app/fileupload/list');
          
           }
           
            
           
        })
            .then(res => {

                if(res.data.success=== true){
                    toast.success("Updated Successfully");
                        return props.history.push('/app/access-app/fileupload/list');
                     
                   }
            })
            .catch((error) => {
                console.log(error)

                if (error) {
                   // toast.error(error && error.response && error.response.data && error.response.data.errors);
                } else {
                    toast.error('unauthorized action');
                }
              
                return props.history.push('/app/access-app/fileupload/list');
            })

    }

    const frameDataEntry = (key, value) => {
        setPaymentDetails(state => ({...state, [key]: value}));
    }

   
    return (
        <React.Fragment>
            <RbacContext.Consumer>
                {(context) => (

                    <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <div className="col-sm-6">
                                        <h4 className="page-title mt-1 width-auto">Employee Payment Details</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <ol className="breadcrumb mt-2">
                                            <li className="breadcrumb-item"><a href="/app/access-app/fileupload/list">Payments</a></li>
                                            <li className="breadcrumb-item active">Payments Details</li>
                                        </ol>
                                    </div>
                                    <div className="col-md-6  text-right mt-4">

                                        <a href="/app/access-app/fileupload/list" className="btn btn-primary btn-sm"><i className="fa fa-angle-left" aria-hidden="true"></i> Back</a>
                                    </div>
                                </div>
                            </div>
                    <form onSubmit={onCreatePost}>
                     <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body">
                                    <h4 className="mt-0 header-title  width-auto">Basic Details</h4>
                                    
                                    <div className="row">
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Month</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.month}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Year</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.year}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">EMPID</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.llemp_code}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Name</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    {leadDetails.llemp_firstname}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Gender</label>
                                                <span className="d-block mt-1 font-weight-600">{helpers.getModuleValue(context.moduleData, leadDetails.llemp_gender)}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Phone Numner</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    {leadDetails.llemp_contact_number}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">DOJ</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.llemp_date_of_join}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Driving Licence</label>
                                                <span className="d-block mt-1 font-weight-600">{drivingLicence}</span>
                                            </div>
                                        </div>
                                        
                                        
                    
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Aadhar No</label>
                                                <span className="d-block mt-1 font-weight-600">{aadharCard}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Pan Card</label>
                                                <span className="d-block mt-1 font-weight-600">{panCard}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">IFC</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.ifsc_code}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Unique Bank ID</label>
                                                <span className="d-block mt-1 font-weight-600">{"-"}</span>
                                            </div>
                                        </div>
                                      
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Bank Name</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.bank_name}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Bank Account Number</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.account_number}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Nominee</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.nominee_name}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Nominee Number</label>
                                                <span className="d-block mt-1 font-weight-600">{leadDetails.nominee_name}</span>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Recruiter</label>
                                                <span className="d-block mt-1 font-weight-600">{recruiter}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Client Emp Id</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.client_emp_id}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Client</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.client}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Hub Location</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.hub_location}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">City </label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.city}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">State</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.state}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Full Time</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.full_time}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vendor</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.vendor}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vendor Type</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.vendor_type}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vehicle</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.vehicle_type}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vehicle Model</label>
                                                <span className="d-block mt-1 font-weight-600">{paymentDetails.vehicle_model}</span>
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
                                    <h4 className="mt-0 header-title  width-auto">MIS Order Data</h4>

                                    <div className="row">
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Rate</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                <input className="form-control" type="text"   id="rate" value={paymentDetails.rate} 
                                                onChange={(e) => {
                                                    frameDataEntry('rate', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day1</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   name="day1" value={paymentDetails.day1}
                                                    onChange={(e) => {
                                                        frameDataEntry('day1', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day2</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"
                                                   id="day2" value={paymentDetails.day2} 
                                                   onChange={(e) => {
                                                    frameDataEntry('day2', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day3</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day3" value={paymentDetails.day3} 
                                                   onChange={(e) => {
                                                    frameDataEntry('day3', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day4</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day4" value={paymentDetails.day4}
                                                    onChange={(e) => {
                                                        frameDataEntry('day4', e.target.value)
                                                    }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day5</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day5" value={paymentDetails.day5} 
                                                    onChange={(e) => {
                                                        frameDataEntry('day5', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day6</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day6" value={paymentDetails.day6}
                                                    onChange={(e) => {
                                                        frameDataEntry('day6', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day7</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"
                                                   id="day7" value={paymentDetails.day7} 
                                                   onChange={(e) => {
                                                    frameDataEntry('day7', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day8</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day8" value={paymentDetails.day8} 
                                                    onChange={(e) => {
                                                        frameDataEntry('day8', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day9</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   id="day9" value={paymentDetails.day9} 
                                                    onChange={(e) => {
                                                        frameDataEntry('day9', e.target.value)
                                                    }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Da10</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day10}  id="day10" 
                                                onChange={(e) => {
                                                    frameDataEntry('day10', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day11</label>
                                                <span className="d-block mt-1 font-weight-600"
                                                ><input className="form-control" type="text"  value={paymentDetails.day11}  
                                                id="day11" onChange={(e) => {
                                                    frameDataEntry('day11', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day12</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day12}  id="day12" onChange={(e) => {
                                                    frameDataEntry('day12', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day13</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"
                                                value={paymentDetails.day13}   id="day13" onChange={(e) => {
                                                    frameDataEntry('day3', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day14</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text" value={paymentDetails.day14}  id="day14" 
                                                   onChange={(e) => {
                                                    frameDataEntry('day14', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day15</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day15}  id="day15" onChange={(e) => {
                                                    frameDataEntry('day15', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day16</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   value={paymentDetails.day16} id="day16" 
                                                    onChange={(e) => {
                                                        frameDataEntry('day16', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day17</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.day17} id="dau17" onChange={(e) => {
                                                    frameDataEntry('day17', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day18</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"  value={paymentDetails.day18} id="day18" 
                                                   onChange={(e) => {
                                                    frameDataEntry('day18', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day19</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day19}  id="day19" onChange={(e) => {
                                                    frameDataEntry('day19', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day20</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.day20} id="day20" onChange={(e) => {
                                                    frameDataEntry('day20', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day21</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day21}  id="day21" onChange={(e) => {
                                                    frameDataEntry('day21', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day22</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"   
                                                value={paymentDetails.day22} id="day22" onChange={(e) => {
                                                    frameDataEntry('day22', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day23</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day23}  id="day23" onChange={(e) => {
                                                    frameDataEntry('day23', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day24</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"   
                                                value={paymentDetails.day24} id="day24" onChange={(e) => {
                                                    frameDataEntry('day24', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day25</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day25}  id="day25" onChange={(e) => {
                                                    frameDataEntry('day25', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day26</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.day26}  id="day26" onChange={(e) => {
                                                    frameDataEntry('day26', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day27</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day27}  id="day27" onChange={(e) => {
                                                    frameDataEntry('day27', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day28</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text" value={paymentDetails.day28}  
                                                    id="day28" onChange={(e) => {
                                                        frameDataEntry('day28', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day29</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.day29}  id="day29" onChange={(e) => setDay29(e.target.value)} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day30</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"   value={paymentDetails.day30} 
                                                    id="day30" onChange={(e) => {
                                                        frameDataEntry('day30', e.target.value)
                                                    }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Day31</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.day31} id="day31" onChange={(e) => {
                                                    frameDataEntry('day31', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP1</label>
                                                <span className="d-block mt-1 font-weight-600">
                                                    <input className="form-control" type="text"  value={paymentDetails.tdp1}  id="tdp1" 
                                                   onChange={(e) => {
                                                    frameDataEntry('tdp1', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP2</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.tdp2}  id="tdp2" onChange={(e) => {
                                                    frameDataEntry('tdp2', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP3</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.tdp3}  id="tdp3" onChange={(e) => {
                                                    frameDataEntry('tdp3', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">FN1</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.fn1}  id="fn1" onChange={(e) => {
                                                    frameDataEntry('fn1', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-1">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">FN2</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.fn2} id="fn2" onChange={(e) => {
                                                    frameDataEntry('fn2', e.target.value)
                                                }} /></span>
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
                                    <h4 className="mt-0 header-title  width-auto">Orders</h4>

                                    <div className="row">
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Monthly Orders</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.monthy_orders}  id="monthy_orders" onChange={(e) => {
                                                    frameDataEntry('monthy_orders', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Monday</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.mondays}  id="mondays"  onChange={(e) => {
                                                    frameDataEntry('mondays', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Deductible days</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.deductible_days}  id="deductible_days" onChange={(e) => {
                                                    frameDataEntry('deductible_days', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Extra Paydays Based on Attn</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.extra_paydays_based_on_attn}  id="extra_paydays_based_on_attn" onChange={(e) => {
                                                    frameDataEntry('extra_paydays_based_on_attn', e.target.value)
                                                }} /></span>
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
                                    <h4 className="mt-0 header-title  width-auto">Additions</h4>

                                    <div className="row">
                                        
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Incentive</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.rate}  id="incentive" onChange={(e) => {
                                                    frameDataEntry('incentive', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Other incentive</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"   
                                                value={paymentDetails.other_incentive} id="other_incentive"  onChange={(e) => {
                                                    frameDataEntry('other_incentive', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Arrears Days/ Orders</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.arrears_days}  id="arrears_days" onChange={(e) => {
                                                    frameDataEntry('arrears_days', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Arrears salary</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.arrears_salary} 
                                                 id="arrears_salary" onChange={(e) => {
                                                    frameDataEntry('arrears_salary', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">No.oF Trip</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.no_of_trip} 
                                                 id="no_of_trip" onChange={(e) => {
                                                    frameDataEntry('no_of_trip', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">NJIT No.of.order</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.njit_no_of_order} 
                                                 id="njit_no_of_order" onChange={(e) => {
                                                    frameDataEntry('njit_no_of_order', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Amount</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.amount} 
                                                 id="amount" onChange={(e) => {
                                                    frameDataEntry('amount', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Van order count</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.van_order_count} 
                                                  id="van_order_count" onChange={(e) => {
                                                    frameDataEntry('van_order_count', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Van order Amount</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.van_order_amount} 
                                                  id="van_order_amount" onChange={(e) => {
                                                    frameDataEntry('van_order_amount', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Traning amount</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.traning_amount}
                                                 id="traning_amount" onChange={(e) => {
                                                    frameDataEntry('traning_amount', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Normal Order Count</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.normal_order_count} 
                                                  id="normal_order_count" onChange={(e) => {
                                                    frameDataEntry('normal_order_count', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Refund </label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.refund} 
                                                
                                                id="refund" onChange={(e) => {
                                                    frameDataEntry('refund', e.target.value)
                                                }} /></span>
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
                                    <h4 className="mt-0 header-title  width-auto">Deductions</h4>

                                    <div className="row">
                                        
                                        
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Traffic Challan</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.traffic_challan} 
                                                  id="traffic_challan" onChange={(e) => {
                                                    frameDataEntry('traffic_challan', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vehicle Damage</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.vehicle_damage} 
                                                  id="vehicle_damage" onChange={(e) => {
                                                    frameDataEntry('vehicle_damage', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Tshirt</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.tshirt} 
                                                  id="tshirt" onChange={(e) => {
                                                    frameDataEntry('tshirt', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Bag</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"   
                                                value={paymentDetails.bag} 
                                                id="bag" onChange={(e) => {
                                                    frameDataEntry('bag', e.target.value)
                                                }} /></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Short Cash</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.short_case} 
                                                  id="short_case" onChange={(e) => {
                                                    frameDataEntry('short_case', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Raincoat</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.rain_coat} 
                                                  id="rain_coat" onChange={(e) => {
                                                    frameDataEntry('rain_coat', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Vehicle Usage</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.vehicle_usage}
                                                 id="vehicle_usage" onChange={(e) => {
                                                    frameDataEntry('vehicle_usage', e.target.value)
                                                }}/></span>
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
                                    <h4 className="mt-0 header-title  width-auto">Net Pay</h4>

                                    <div className="row">
                                        
                                       <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP1</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                 value={paymentDetails.net_tdp1}
                                                 id="net_tdp1" onChange={(e) => {
                                                    frameDataEntry('net_tdp1', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP2</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                 value={paymentDetails.net_tdp2}
                                                 id="net_tdp2" onChange={(e) => {
                                                    frameDataEntry('net_tdp2', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">TDP3</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.net_tdp3}
                                                  id="net_tdp3" onChange={(e) => {
                                                    frameDataEntry('net_tdp3', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">FN1</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                value={paymentDetails.net_fn1}
                                                 id="net_fn1" onChange={(e) => {
                                                    frameDataEntry('net_fn1', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">FN2</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                value={paymentDetails.net_fn1}
                                                  id="net_fn2" onChange={(e) => {
                                                    frameDataEntry('net_fn2', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Monthly</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text" 
                                                 value={paymentDetails.monthly} 
                                                 id="monthly" onChange={(e) => {
                                                    frameDataEntry('monthly', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Remarks</label>
                                                <span className="d-block mt-1 font-weight-600"><input className="form-control" type="text"  
                                                 value={paymentDetails.remarks} 
                                                id="remarks" onChange={(e) => {
                                                    frameDataEntry('remarks', e.target.value)
                                                }}/></span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6  mt-5">

                            <button type="submit" className="btn btn-success btn-sm ml-3 " >Save</button>
                            <span>&nbsp;</span>

                        </div>

                    </div>

                </form>   


                    
                </div>
            </div>      
 )}

 </RbacContext.Consumer>
</React.Fragment>
);


}
export default Edit
