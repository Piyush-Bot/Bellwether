import React, {useEffect, useState} from "react";
import {Modal, Button} from 'react-bootstrap';
import Select from "react-select";

const Filter = (props) => {
    const [FilterPopupShow, setFilterPopupShow] = useState(false);
    const [filterData, SetFilterData] = useState({});
    useEffect(() => {
    }, []);

     const search = () => {
        props.handleFilterEvent();
        setFilterPopupShow(false);
    };


    const frameFilterData = (key, value) => {
        props.getSearchData(state => ({
            ...state,
            [key]: {...value}
        }));
        SetFilterData(state => ({
            ...state,
            [key]: {...value}
        }));

    };


    return (
        <React.Fragment>
            <a
                className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                data-toggle="modal" data-target=".filter-popup"
                onClick={() => { setFilterPopupShow(true)}}>
                <i className="fa fa-filter mr-1"> </i>Filter</a>
            {
                <Modal show={FilterPopupShow}>
                    <Modal.Body>
                        <div className="row">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" onClick={() => {
                                            setFilterPopupShow(false);
                                        }}>&times;</span>
                            </button>
                            <>
                                {
                                    props.filterData.length > 0 ? props.filterData.map((value, i) => (
                                        <div className="col-md-12" key={i}>
                                            <div className="form-group" key={i}>
                                                <label htmlFor="trans-type">{value.label}</label>
                                                {
                                                    value.type === 'select' ?
                                                        value.data ?
                                                            <Select defaultValue={props.selectedValues[value.name]}
                                                                    onChange={(e) => {
                                                                        frameFilterData(value.name, e);
                                                                    }}
                                                                    options={value.name === 'qr_status' || value.name === 'is_public' ? value.data.module_values : value.data}
                                                                    getOptionLabel={(option) => option[value.display_column_name]}
                                                                    getOptionValue={(option) => option.id}
                                                            /> : null
                                                        : null
                                                }

                                            </div>
                                        </div>

                                    )) : null
                                }
                            </>

                            <div className="col-md-12">
                                <div className="act-links mt-2 text-center">
                                    <a className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                       onClick={search}>Search</a>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </React.Fragment>
    );
}

export default Filter;
