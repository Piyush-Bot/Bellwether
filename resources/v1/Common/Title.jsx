import React, {Component} from 'react';

export default class Title extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="col-sm-6">
                <h4 className="page-title mt-1 width-auto">{this.props.title}</h4>
            </div>
        )
    }
}
