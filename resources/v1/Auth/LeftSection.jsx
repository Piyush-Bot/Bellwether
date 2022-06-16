import React, {Component} from 'react';

export default class LeftSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="login-left">
                <img src="/v1/images/login-img.png" alt="logo"/>
                <div className="welcome-text">
                    <h5 className="mb-1">{this.props.text}</h5>
                </div>
            </div>
        )
    }
}
