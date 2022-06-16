import React, {Component} from 'react';

export default class TableNoDataFound extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <tr>
                <td colSpan={this.props.frontSpan}> </td>
                <td>{this.props.message}</td>
                <td colSpan={this.props.backSpan}> </td>
            </tr>
        )
    }
}
