import React, {Component} from 'react';
import Moment from 'react-moment';
export const ConvertUTCtoISTDateFormat = (props) =>{
    let convertDateTime = Moment(props.datetime).add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm A')
    return convertDateTime;
}