import React, {Component} from 'react';
import BookingContext from './BookingContext';
import helper from "../../../helpers";
import axios from "axios";
import {SOCKET_MODULE} from "../../Auth/Context/AppConstant";
import helpers from "../../../helpers";
let token = localStorage.getItem('app-ll-token');
export default class BookingProvider extends Component {

    state = {
        isAuthenticated: true,
        status: [],
        bookingListFilter: [],
    };

    /**
     * Handle common errors & invalid api requests
     */
    handleErrors = () => {
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            if (!error.response) {
                // alert('There is a network error, please reload the page.');
                console.log('There is a network error, please reload the page.');
                console.log(error);
            }

            if (error.response.status === 401) {
                // window.location.reload();
            }
            // Do something with response error
            return Promise.reject(error);
        });
    };

    /**
     *Get ALL Modules
     * */
    getModuleData = () => {
        axios.get(SOCKET_MODULE, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({status:helpers.findObject(res.data.data, "module_code", 'MC14')},  () => {  this.setBookingFilterData();});
                }
            })
    }

    // frame socket filter data
    setBookingFilterData =  () => {

        this.setState({
            bookingListFilter: [
                {
                    label: 'Is Public',
                    type: 'select',
                    id: 'is_public',
                    name: 'is_public',
                    display_column_name: 'description',
                    data: this.state.status ? this.state.status : null,
                },
                {
                    label: 'Booking Status',
                    type: 'select',
                    id: 'booking_status',
                    name: 'booking_status',
                    display_column_name: 'name',
                    data: [
                        {name: 'Booked', id: 'BOOKED'},
                        {name: 'Cancel', id: 'CANCEL'},
                        {name: 'Start', id: 'START'},
                        {name: 'Pause', id: 'PAUSE'},
                        {name: 'Completed', id: 'COMPLETED'}
                        ]
                },
                {
                    label: 'Booking Type',
                    type: 'select',
                    id: 'booking_type',
                    name: 'booking_type',
                    display_column_name: 'name',
                    data: [
                        {name: 'Book Now', id: 'BOOK_NOW'},
                        {name: 'Book Later', id: 'BOOK_LATER'}]
                }
            ]
        })
    }

    // Life-Cycle Methods
    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handlePreRequest();
        this.handleErrors();
        this.getModuleData();

        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);

    }


    render() {
        return (
            <BookingContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                moduleData: this.state.moduleData,
                bookingListFilterData:  this.state.bookingListFilter,
            }}>
                {this.props.children}
            </BookingContext.Provider>
        )
    }
}
