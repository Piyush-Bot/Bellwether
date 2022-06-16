import React, {useEffect, useState} from "react";
import BasicDetail from "./template/BasicDetail";
import {
    useParams
} from "react-router-dom";
import helpers from "../../helpers";
import axios from "axios";
import {
    SOCKET_LIST, ROLE_HAS_MODULE_DATA, SOCKET_UPDATE, SOCKET_VIEW, SOCKET_MODULE
} from "../Auth/Context/AppConstant";
import ModelDetail from "./template/ModelDetail";
import DataEntry from "./template/DataEntry";
import BookingHistory from "./template/BookingHistory";
import StausChangeHistory from "./template/StausChangeHistory";
import BreadCrumb from "../Common/BreadCrumb";
import {Link} from "react-router-dom";

let updated_model_id = 0;
let is_public = 0;
let re_type = 0;
let landmark = '';
const SocketDetail = () => {

    const [socketDetail, setSocketDetail] = useState([]);
    let {socket_id} = useParams();
    let queryParam = helpers.useQueryParams();

    const breadCrumbs = [
        {name: "Charging Sockets", url: "/app/charging-app", class: "breadcrumb-item"},
        {name: "Socket Details", url: "", class: "breadcrumb-item active"}
    ];

    useEffect(() => {
        getSocketData();
        updated_model_id = 0;
        is_public = 0;
        landmark = 0;
        re_type = 0;
        return () => { // This code runs when component is unmounted
            console.log("un mounted");
        }
    }, [updated_model_id, is_public, re_type, landmark]);

    const getSocketData = async () => {
        await axios.get(SOCKET_VIEW + '/' + socket_id)
            .then(res => {
                if (res.data && res.data.success) {
                    setSocketDetail(res.data.data);
                }
            })
    }

    const updatedStatus = (id) => {
        updated_model_id = id;
    }

    const isPublic = (id) => {
        is_public = id;
    }

    const reType = (id) => {
        re_type = id;
    }

    const landMark = (id) => {
        landmark = id;
    }


    return (
        <React.Fragment>
            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <h4 className="page-title mt-1 width-auto">Sockets Details</h4>
                                <div className="font-15 width-auto ml-3">
                                    <span
                                        className="badge badge-pill badge-primary">{socketDetail.socket_status ? helpers.replaceUderscoreWithSpace(socketDetail.socket_status) : ''}</span>
                                </div>
                            </div>

                        </div>
                        <BreadCrumb breadCrumbs={breadCrumbs}></BreadCrumb>
                        <div className="col-md-12  text-right">
                            {
                                queryParam.get("src") === "map" ?
                                    <Link to={"/app/charging-app/map-view"} className="btn btn-primary btn-sm"><i
                                        className="fa fa-angle-left" aria-hidden="true"></i> Back</Link>
                                    :
                                    <a href={queryParam.get("src") === "bkg" ? '/app/booking-app/booking/details/' + queryParam.get("id") + '?src=crg&id=' + socket_id : '/app/charging-app'}
                                       className="btn btn-primary btn-sm"><i className="fa fa-angle-left"
                                                                             aria-hidden="true"></i> Back</a>
                            }

                        </div>

                    </div>
                    {
                        socketDetail && socketDetail.ll_sno  ?
                                <>
                                    <BasicDetail socket_id={socket_id} socketData={socketDetail}
                                                 updatedStatus={updatedStatus} isPublic={isPublic} reType={reType}
                                                 landMark={landMark}> </BasicDetail>
                                    {
                                        socketDetail.model_id && <ModelDetail socket_id={socket_id}
                                                                              model_id={socketDetail.model_id}
                                                                              socketData={socketDetail}/>
                                    }
                                    <DataEntry socket_id={socket_id} socketData={socketDetail}/>
                                </>: null
                    }
                    <BookingHistory socket_id={socket_id}> </BookingHistory>
                    <StausChangeHistory socket_id={socket_id}> </StausChangeHistory>
                </div>
            </div>

        </React.Fragment>
    )
}
export default SocketDetail;
