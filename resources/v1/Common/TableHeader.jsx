import React, {Component} from 'react';

export default class TableHeader extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <thead>
                <tr>
                    {
                        this.props.data.map((head, key) => (
                            <th key={key} className={head?.class} scope={head.scope}>{head.label}</th>
                        ))
                    }
                </tr>
            </thead>
        )
    }
}
