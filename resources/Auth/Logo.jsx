import React, {Component} from 'react';

export default class Logo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text-center m-t-0 mb-3">
                <a href="#" className="logo logo-admin">
                    <img
                        src="/images/logo.png" alt="LL Logo" height="auto"/></a>
            </div>
        )
    }
}
