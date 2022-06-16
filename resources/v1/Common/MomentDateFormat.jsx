import React, {Component} from 'react';
import Moment from 'react-moment';
export const MomentDateFormat = (props) =>{
    return(
        <Moment date={props.datetime} format="DD-MM-YYYY hh:mm:ss A" />
    )
}