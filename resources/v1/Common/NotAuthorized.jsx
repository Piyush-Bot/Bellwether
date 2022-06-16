import React from 'react'

const NotAuthorized = () => {
    
        return (
            <React.Fragment>
                <br/><br/>
                <div className="content">
                    <div className="container-fluid">
    
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body table-card">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <h4 className="text-center">You are not authorized to acess this page</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    
    
}

export default NotAuthorized
