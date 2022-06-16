import React, {Component} from 'react';

export default class TableTitle extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="col-md-6">
                <h4 className="mt-0 header-title  pl-3">{this.props.title}</h4>
            </div>
        )
    }
}
