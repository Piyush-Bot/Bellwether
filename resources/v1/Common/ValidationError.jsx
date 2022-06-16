import React, {useEffect, useState} from "react";

const ValidationError = (props) => {
    const [error, setError] = useState('');
    useEffect(() => {
        setError('');
        const length = props.array.length;
       // const result = props.array.filter(param => props.param === param.param);
        for (let i = 0; i < length; i++) {
            props.array[i].param === props.param ? setError( props.array[i].msg) : '';
        }
    }, [props.array.length]);
    return (
        <>
            <span id="error" style={{ color: 'red' }}>{error}</span>
        </>
    )
}
export default ValidationError;