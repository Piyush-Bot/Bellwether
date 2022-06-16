import React, {useEffect, useState,} from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import {
    useParams
} from "react-router-dom";
import {
    MODULES_DATA, ACTION_DATA, ALL_MODULES,
    STORE_ACTION, ROLE_HAS_MODULE_DATA, ACCESS_MODULE_PAGE, ALL_ACTIONS_DATA
} from "../Auth/Context/AppConstant";
import helper from "../../helpers";
import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";


let moduleId = '';
let pageId = '';
let roleId = 1;
let checkedAction = [];
let actionData = [];

const RolesEdit = (props) => {
    const [roleHasModule, setRoleHasModule] = useState([]);
    let { id } = useParams();
    let { name } = useParams();
    roleId = id;

    const breadCrumbs = [
        { name: "Access Control",  url: "#", class:"breadcrumb-item"},
        { name: "Roles",  url: "/app/access-app/role/list", class: "breadcrumb-item"},
        { name: name,  url: "#", class: "breadcrumb-item active"},
    ];

    const backButton = {
        label: 'Back',
        url: "/app/access-app/role/list"
    };

    useEffect(() => {
        pageId = '';
        checkedAction = [];
    }, []);

    /**
     * To redirect
     */
    const redirectFunction = (url) => {
        return props.history.push(url);
    };

    return (
        <React.Fragment>

            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <Title title={name} />
                        </div>

                        <BreadCrumb breadCrumbs={breadCrumbs} backButton={backButton} />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <Modules RoleHasModule={roleHasModule}/>
                                <Pages ModulePages={roleHasModule}/>
                            </div>
                        </div>
                    </div>
                    <Actions RoleHasModule={roleHasModule} redirectFunction={redirectFunction} />
                </div>
            </div>

        </React.Fragment>
    )
}

const Modules = ({RoleHasModule}) => {
    const [modulesData, setModulesData] = useState([]);
    useEffect(() => {
        setModulesData([]);
        axios.get(ALL_MODULES + '?module_id=' + moduleId + '&role_id=' + roleId)
            .then(res => {
                if (res.data.success) {
                    moduleId = '';
                    setModulesData(res.data.data);
                }
                else {
                    moduleId = '';
                }

            }).catch(function (error) {
            if (error) {
                alert(error.response.data.errors);
            } else {
                alert('unauthorized action');
            }
        });
    }, []);

    const selectModule = (selectedId) => {
        if (helper.isEmpty(roleId) === true) {
            alert('Select Role');
            return false;
        }
        moduleId = selectedId;
        pageId = '';
    };
    return (
        <div className="col-md-6">
            <div className="acess-card card">
                <h6>Modules</h6>
                <ul className="card-list">
                    {
                        modulesData.length > 0 ? modulesData.map(module =>
                                <li className={  moduleId === module.id ? 'list-active' : ''}
                                    key={helper.generateUuid()}>
                                    <a href="#" onClick={() => selectModule(module.id)}>
                                        {module.name} - {module.module_code}
                                        {
                                            module && module.selected ?
                                                <span className="tick-icon">
                                            <i className="icon-check-mark text-success">
                                            </i>
                                            </span> : ''
                                        }
                                    </a>
                                </li>) :
                            <li>No Modules</li>

                    }
                </ul>
            </div>
        </div>

    )
};

const Pages = ({ModulePages}) => {
    actionData = [];
    const [selectedPagesData, setSelectedPagesData] = useState([]);
    const selectedPages = (id) => {
        pageId = id;
    };
    useEffect(() => {
        setSelectedPagesData([]);
        console.log('Module_id', moduleId);
        axios.get(ACCESS_MODULE_PAGE + '?module_id=' + moduleId + '&role_id=' + roleId)
            .then(res => {
                if (res.data.success) {
                    setSelectedPagesData([]);
                    setSelectedPagesData(res.data.data);
                }
                else {
                    setSelectedPagesData([]);
                }
            }).catch(function (error) {
            if (error) {
                toast.error(error && error.response && error.response.data && error.response.data.errors);
            } else {
                toast.error('unauthorized action');
            }
        });
    }, [moduleId]);
    return (
        <div className="col-md-6">
            <div className="acess-card card">
                <h6>Pages</h6>
                <ul className="card-list">
                    {
                        selectedPagesData.length > 0 ? selectedPagesData.map(module => <li
                                className={pageId === module.id ? 'list-active' : ''} key={helper.generateUuid()}>
                                <a href="#" onClick={() => selectedPages(module.id)}>{module.name} - {module.page_code}
                                    {
                                        module.selected ? <span className="tick-icon" key={helper.generateUuid()}>
                                            <i className="icon-check-mark text-success">
                                            </i>
                                            </span> : null
                                    }

                                </a>
                            </li>) :
                            <li>No Pages</li>
                    }
                </ul>
            </div>
        </div>
    )
}

const Actions = ({redirectFunction}) => {
    const [actionDatas, setActionData] = useState([]);
    const [selectedActionArray, setSelectedActionArray] = useState([]);

    useEffect(() => {
        setSelectedActionArray([]);
        if (pageId !== '') {
            checkedAction = [];

            axios.get(ALL_ACTIONS_DATA + '?module_id=' + moduleId + '&role_id=' + roleId + '&page_id=' + pageId).then(res => {
                if (res.data.success) {
                    actionData = [...res.data.data.action_details];
                    actionData.map(action => {
                        action.uuid = helper.generateUuid();
                        if(action.selected) {
                            checkedAction.push(action.id);
                        }
                    });
                    setSelectedActionArray(checkedAction);
                    setActionData(actionData);
                }
            });
        }
    }, [pageId]);

    const storeAction = (checkedValue, id) => {
        checkedAction = checkedValue === true ? [id, ...checkedAction] : checkedAction.filter((e) => e !== id);
        if(checkedValue === false) {
            const unCheckedAction = checkedAction.filter((e) => e !== id);
            setSelectedActionArray(unCheckedAction);
        }


    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="acess-card action-card card">
                    <h6>Actions</h6>
                    <div className="row">
                        {
                            pageId && actionDatas.length > 0 ?
                                actionDatas.map(action =>
                                    <div className="col-md-4" key={helper.generateUuid()}>
                                        <div className="check-cus">
                                            <input type="checkbox" key={action.uuid} id={'check-' + action.uuid}
                                                   onChange={(e) => storeAction(e.currentTarget.checked, action.id)}
                                                   checked={ helper.findArrayElementByValue(selectedActionArray, action.id, )} />
                                            <label htmlFor={'check-' + action.uuid}
                                                   key={action.id}>{action.name} - {action.action_code}</label>
                                        </div>
                                    </div>
                                ) : <div className="col-md-4" key={helper.generateUuid()}>
                                    <div className="check-cus">No Actions</div>
                                </div>
                        }
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-right mt-5">
                            <button type="button" className="btn btn-success btn-sm" onClick={() => submit(checkedAction, redirectFunction)}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const submit = (checkedActionData, redirectFunction) => {
    if (helper.isEmpty(moduleId) === true || helper.isEmpty(pageId) === true
        || helper.isEmpty(roleId) === true) {
        toast.error('Select All Required Fields');
        return false;
    }
    if (pageId !== '') {
        axios.post(STORE_ACTION, {
            module_id: moduleId,
            page_id: pageId,
            role_id: roleId,
            action_id: checkedActionData
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.msg);
               // return redirectFunction('/app/access-app/role/list');
            }
        }).catch(function (error) {
            toast.error(error.response.data.errors);
        });
    }
};
export default RolesEdit;
