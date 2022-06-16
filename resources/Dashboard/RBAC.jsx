import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    ROLES_DATA, MODULES_DATA, ACTION_DATA, ALL_MODULES,
    STORE_ACTION, ROLE_HAS_MODULE_DATA
} from "../Auth/Context/AppConstant";
import helper from "../helpers";

let moduleId = '';
let pageId = '';
let roleId = '';
let checkedAction = [];
let actionData = [];
let previousPages = [];

const token = localStorage.getItem('app-ll-token');
console.log('Check user', JSON.stringify(localStorage.getItem('user-data')));
const RBAC = () => {
    const [roleHasModule, setRoleHasModule] = useState([]);
    useEffect(() => {
        if (roleId) {
            axios.post(ROLE_HAS_MODULE_DATA, {role_id: roleId})
                .then(res => {
                    if (res.data && res.data.success) {
                        setRoleHasModule(res.data.data.module_details);
                    }
                })
        }
    }, [roleId]);

    return (
        <div className="content-page">
            <div className="content">
                <div className="row">

                    <div className="col-md-12 col-lg-7">
                        <div className="row">
                            <Roles/>
                            <Modules RoleHasModule={roleHasModule}/>
                        </div>
                    </div>
                    <Actions RoleHasModule={roleHasModule}/>
                </div>
            </div>
        </div>
    )
};

const Roles = () => {
    const [rolesData, setRolesData] = useState([]);
    const [selectRole, setSelectedRole] = useState('');

    useEffect(() => {
        axios.get(ROLES_DATA)
            .then(res => {
                if (res.data.success) {
                    setRolesData(res.data.data.role_details);
                }
            }).catch(function (error) {
                if(!Error) {
                    alert(error.response.data.errors);
                }
                else {
                    alert ('unauthorized action');
                }
        });
    }, []);

    const clickRole = (rolesId) => {
        setSelectedRole(rolesId);
        roleId = rolesId;
        moduleId = '';
    };

    return (
        <div className="col-md-4">
            <div className="card">
                <h6>Roles</h6>
                <ul className="card-list">
                    {
                        rolesData.length > 0 ? rolesData.map(role =>
                                <li className={selectRole === role.id ? 'list-active' : ''} key={helper.generateUuid()}>
                                    <a href="#" onClick={() => clickRole(role.id)}>{role.role}</a>
                                </li>) :
                            <li>No Roles</li>
                    }
                </ul>
            </div>
        </div>
    )
};

const Modules = ({RoleHasModule}) => {
    const [modulesData, setModulesData] = useState([]);
    useEffect(() => {
        axios.get(ALL_MODULES)
            .then(res => {
                if (res.data.success) {
                    setModulesData(res.data.data);
                }
            }).catch(function (error) {
            if(!Error) {
                alert(error.response.data.errors);
            }
            else {
                alert ('unauthorized action');
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
        <React.Fragment>
            <div className="col-md-4">
                <div className="card">
                    <h6>Modules</h6>
                    <ul className="card-list">
                        {
                            modulesData.length > 0 ? modulesData.map(module =>
                                    <li className={moduleId === module.id ? 'list-active' : ''}
                                        key={helper.generateUuid()}>
                                        <a href="#" onClick={() => selectModule(module.id)}>
                                            {module.name}
                                            {
                                                helper.inArray(module.id, helper.frameIDFromArray(RoleHasModule)) === true ?
                                                    <span className="tick-icon">
                                            <i className="icon-check icons text-success">
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
            <Pages ModulePages={RoleHasModule}/>
        </React.Fragment>
    );
};

const Pages = ({ModulePages}) => {

    actionData = [];
    const [selectedPagesData, setSelectedPagesData] = useState([]);
    const selectedPages = (id) => {
        pageId = id;
    };
    useEffect(() => {
        axios.get(MODULES_DATA)
            .then(res => {
                if (res.data.success) {
                    setSelectedPagesData([]);
                    const filt = res.data.data.module_details.filter((e) => e.id === moduleId ? e : '');

                    setSelectedPagesData(filt && filt[0] ? filt[0].pages : []);
                    previousPages = filt && filt[0] ? filt[0].pages : [];
                }
            }).catch(function (error) {
            if(!Error) {
                alert(error.response.data.errors);
            }
            else {
                alert ('unauthorized action');
            }
        });
    }, [moduleId]);

    return (
        <>
            <div className="col-md-4">
                <div className="card">
                    <h6>Pages</h6>
                    {<ul className="card-list">
                        {
                            selectedPagesData.length > 0 ? selectedPagesData.map(module => <li
                                    className={pageId === module.id ? 'list-active' : ''} key={helper.generateUuid()}>
                                    <a href="#" onClick={() => selectedPages(module.id)}>{module.name}
                                        {
                                            ModulePages.map((e) => e.id === moduleId && helper.findCheckedPages(e.pages, 'id', module.id) === true ?
                                                <span className="tick-icon" key={helper.generateUuid()}>
                                            <i className="icon-check icons text-success">
                                            </i>
                                            </span>
                                                : '')
                                        }

                                    </a>
                                </li>) :
                                <li>No Pages</li>
                        }
                    </ul>}
                </div>
            </div>

        </>
    );
};

const Actions = ({RoleHasModule}) => {
    const [actionDatas, setActionData] = useState([]);
    const [selectedPagesArray, setSelectedPagesArray] = useState({actions: []});

    useEffect(() => {

        if (pageId !== '') {
            setSelectedPagesArray({actions: []});
            checkedAction = [];

            axios.post(ACTION_DATA, {
                module_id: moduleId,
                page_id: pageId
            }).then(res => {
                if (res.data.success) {
                    actionData = [...res.data.data.action_details];
                    actionData.map(action => {
                        action.uuid = helper.generateUuid();
                    });
                    setActionData(actionData);
                }
            })
        }

        const module = helper.findObject(RoleHasModule, 'id', moduleId);
        if (module) {
            const pagesSelectedLocal = helper.findObject(module.pages, 'id', pageId);
            if (pagesSelectedLocal && pagesSelectedLocal.actions) {
                pagesSelectedLocal.actions.map((e) => checkedAction.push(e.id));
                setSelectedPagesArray(pagesSelectedLocal);
            }
        }
    }, [pageId]);

    const storeAction = (checkedValue, id) => {
        checkedAction = checkedValue === true ? [id, ...checkedAction] : checkedAction.filter((e) => e !== id);
        if (checkedValue === true) {
            const action = helper.findObject(actionDatas, 'id', id);
            if (selectedPagesArray !== undefined) {
                let array = {...selectedPagesArray};
                array.actions.push(action);
                setSelectedPagesArray(array);
            }
        } else {
            const unSelectData = selectedPagesArray.actions.length > 0 ? selectedPagesArray.actions.filter((e) => e.id !== id) : '';
            setSelectedPagesArray({"actions": unSelectData});
        }
    };

    return (
        <div className="col-md-12 col-lg-5">
            <div className="card">
                <h6>Actions</h6>
                <div className="row">
                    {
                        actionData.length > 0 ?
                            actionDatas.map(action =>
                                <div className="col-md-4" key={helper.generateUuid()}>
                                    <div className="check-cus">
                                        <input type="checkbox" key={action.uuid} id={'check-' + action.uuid}
                                               onChange={(e) => storeAction(e.currentTarget.checked, action.id)}
                                               checked={selectedPagesArray && helper.findCheckedPages(selectedPagesArray.actions, 'id', action.id)}/>
                                        <label htmlFor={'check-' + action.uuid}
                                               key={action.id}>{action.name}</label>
                                    </div>
                                </div>
                            ) : <div className="col-md-4" key={helper.generateUuid()}>
                                <div className="check-cus">No Actions</div>
                            </div>
                    }
                </div>
                <div className="row">
                    <div className="col-md-12 text-right mt-5">
                        <button type="button" className="btn btn-success btn-sm"
                                onClick={() => submit(checkedAction)}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const submit = (checkedActionData) => {
    if (helper.isEmpty(moduleId) === true || helper.isEmpty(pageId) === true
        || helper.isEmpty(roleId) === true) {
        alert('Select All Required Fields');
        return false;
    }
    if (pageId !== '') {
        axios.post(STORE_ACTION, {
            module_id: moduleId,
            page_id: pageId,
            role_id: roleId,
            action_id: checkedActionData.toString()
        }).then(res => {
            if (res.data.success) {
                alert(res.data.msg);
                window.location.reload();
            }
        }).catch(function (error) {
            console.log(error.response.data.errors);
            alert(error.response.data.errors);
        });
    }
};
export default RBAC;
