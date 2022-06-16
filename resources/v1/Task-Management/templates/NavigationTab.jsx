import React, {useEffect} from "react";
import TaskContext from "../Context/TaskContext";

const NavigationTab = (props) => {
    useEffect(() => {

    }, []);

    const { masterData, cb } = props;

    return (
        <ul className="nav nav-tabs py-4" role="tablist">
            <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" onClick={() => cb('All')}
                   href="#all" role="tab" aria-selected="true">
                    <span className="d-none d-md-block">All</span><span
                    className="d-block d-md-none"><i className="mdi mdi-home-variant h5"> </i></span>
                </a>
            </li>
            {
                masterData && masterData.task_status && masterData.task_status.map((value, i) => (
                    <li className="nav-item" key={i}>
                        <a className="nav-link" data-toggle="tab" href="#all" role="tab" onClick={() => cb(value._id)}
                           aria-selected="true" >
                            <span className="d-none d-md-block">{value.module_name}</span><span
                            className="d-block d-md-none"><i className="mdi mdi-email h5"> </i>
                                           </span>
                        </a>
                    </li>
                ))
            }
        </ul>
    )
}

export default NavigationTab;