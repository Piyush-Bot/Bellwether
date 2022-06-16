import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <footer className="footer">
                © { new Date().getFullYear() } LightningLogistics, All rights reserved.
            </footer>
        )
    }
}
