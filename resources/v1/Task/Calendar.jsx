import React, {Component, useEffect, useState,} from 'react';
import {Link} from "react-router-dom";
import TaskContext from "./Context/TaskContext";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'moment-timezone';
import {
    GET_TASK
} from "../Auth/Context/AppConstant";

import toast from "react-hot-toast";

import BreadCrumb from "../Common/BreadCrumb";
import {parseTwoDigitYear} from "moment";
import moment from "moment";

let token = localStorage.getItem('app-ll-token');
let previousCount = 0;
let nextCount = 0;
const Calendar = () => {

    const breadCrumbs = [
        {name: "Task", url: "/app/task-app", class: "breadcrumb-item"},
        {name: "Calendar View", url: "/app/task-app", class: "breadcrumb-item active"}
    ];
    const events = [{title: "today's event", date: new Date()}];
    const [view, setView] = useState("timeGridWeek")
    useEffect(() => {
        document.querySelector('.fc-next-button').onclick = function() {
            nextCount = nextCount + 1;
            nextButtonClick();
        };

    }, [view]);

    const previousButtonClick = () => {

    }

    const nextButtonClick = () => {
        let currentDate = moment().format('YYYY-MM-DD');

       /* console.log("Next Button Click",  moment(currentDate).add(nextCount, 'M').format('YYYY-MM-DD'));*/

        //alert("The current date of the calendar is " + moment().format('YYYY-MM-DD'));
    }

    const list = async () => {
        await axios.get(GET_TASK)
            .then(res => {
                    if (res.data && res.data.success) {

                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    const handleDateClick = (arg) => { // bind with an arrow function
        alert(arg.dateStr)
    }

    const renderEventContent = (eventInfo) => {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        )
    }

    const renderEvent = (events) => {
        return [
            {title: 'event 1', date: '2022-02-03'},
            {title: 'event 2', date: '2022-02-04'}
        ]
    }

    const handleEventClick = () => {
        console.log("CallEvent");
    }
    const getCalendarData = () => {
        console.log("check");
    }


    return (
        <TaskContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className='demo-app'>
                            <div className='demo-app-sidebar'>
                                <div className='demo-app-sidebar-section'>
                                    <h2>Instructions</h2>
                                </div>
                            </div>
                            <div className='demo-app-main'>
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay',

                                    }}
                                    navLinks={{
                                        click: () => {
                                            console.log('previous');
                                        }
                                    }

                                    }
                                    /*customButtons={{
                                        prev: {
                                            click: () => {
                                                console.log('previous');
                                            }
                                        },
                                        next: {
                                            click: () => {
                                                console.log('next');
                                            }
                                        }
                                    }}*/
                                    /*customButtons={{
                                        dayGridMonth: {
                                            text: 'Month',
                                            click: () => {

                                                setView("dayGridMonth");
                                                console.log('view', view);
                                            }
                                        },

                                        timeGridWeek: {
                                            text: 'Week',
                                            click: () => {
                                                setView("timeGridWeek");
                                                console.log('timeGridWeek', view);
                                            }
                                        },

                                        timeGridDay: {
                                            text: 'Day',
                                            click: () => {
                                                setView("timeGridDay");
                                                console.log('timeGridDay', view);
                                            }
                                        },
                                    }}*/

                                    initialView="dayGridMonth"
                                    dayHeaders={handleDateClick}
                                    eventContent={renderEventContent}
                                    eventClick={handleEventClick}
                                    events={events}

                                />
                            </div>
                        </div>

                    </React.Fragment>
                )
            }
        </TaskContext.Consumer>
    );
}

export default Calendar;