import React, {Component} from 'react';
import {Link} from "react-router-dom";

export default class BreadCrumb extends Component {
    breadCrumbs;
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <ol className="breadcrumb">
                        {
                            this.props.breadCrumbs.map((value, key) =>
                                <li key={key} className={value.class}><a href={value.url}>{value.name}</a></li>
                            )
                        }
                    </ol>
                </div>

                {
                    this.props.backButton ?
                        <div className="col-md-6  text-right">
                            <Link className="btn btn-primary btn-sm" to={this.props.backButton.url}>
                                <i className="fa fa-angle-left" aria-hidden="true"> </i>
                                {' '} {this.props.backButton.label}
                            </Link>
                        </div> : null
                }
            </div>
        )
    }
}
