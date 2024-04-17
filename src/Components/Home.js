import React, { Component, Fragment } from 'react';
import moment from 'moment';
import './Home.css';
import { Link } from 'react-router-dom';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { IconButton } from '@mui/material';

import { db } from '../../src/index';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookableDays: [],
            bookedTimes: [],
            selectedDay: moment().format('ddd,MMM D'),
            selectedDayTimes: [],
            times: [],
            employee: this.props.employee,
        }

    }

    componentDidMount() {
        this.setTimes();
        this.getBookedTimes();
        if(moment().format('ddd') === "Sun"){
            this.setState({
                selectedDay: moment().add(1, 'days').format('ddd,MMM D')
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedDay !== this.state.selectedDay){
            this.getBookedTimes();
        }
    }

    setBookedTimes = (newBookedTimes) => {
        db.collection("times")
            .doc(this.state.selectedDay)
            .set({
                bookedTimes: newBookedTimes
                // [this.state.selectedDay]: newBookedTimes
            })
            .then(function () {
                // console.log("Successfully written to Firebase!");
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    };

    getBookedTimes = () => {
        let bookedTimesResponse;
        let selectedDayTimesResponse;
        const dbRef = db.collection('times').doc(this.state.selectedDay)

        // check if document exists before doing stuff
        dbRef.get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                dbRef.set({bookedTimes: []}) // create the document
                this.setState({
                    bookedTimes: []
                })
                // dbRef.onSnapshot((doc) => {
                // // do stuff with the data
                // });
            } 
        });

        db.collection("times")
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.map((doc) => {
                    if(doc.id === this.state.selectedDay){
                        bookedTimesResponse = doc.data().bookedTimes;
                        // selectedDayTimesResponse = doc.data()[this.state.selectedDay];
                        this.setState({
                            bookedTimes: bookedTimesResponse,
                            // selectedDayTimes: selectedDayTimesResponse
                        })
                    }
                });
            });
    };

    setTimes = () => {
        var x = 30;
        var times = [];
        var tt = 60*9;
        var ap = ['am', 'pm'];

        for (var i=0;tt<20*60; i++) {
            var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
            var mm = (tt%60); // getting minutes of the hour in 0-55 format
            times[i] = ("" + ((hh===12)?12:hh%12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }

        let bookableDays = []

        for(let dayCount = 0; dayCount < 6; dayCount++){
            if(moment().add(dayCount, 'days').format('ddd') !== "Sun") {
                bookableDays.push(moment().add(dayCount, 'days').format('ddd,MMM D'))
            }
        }
        if(bookableDays.length === 5){
            bookableDays.push(moment().add(6, 'days').format('ddd,MMM D'))
        }
        
        this.setState({
            times: times,
            bookableDays: bookableDays
        })
    }

    handleDaySelect = (day) => {
        this.setState({
            selectedDay: day
        })
    }

    handleTimeBooked = (time, deskNumber) => {
        let bookedTimes = this.state.bookedTimes;
        let masterTimeObj = this.state.bookedTimes?.filter((x) => {
            return (x.time === time && x.employee === this.state.employee && x.deskNumber === deskNumber);
        })
        let timeObj = {
            "time": time,
            "employee": this.state.employee,
            "deskNumber": deskNumber
        }

        if(!masterTimeObj?.find(x => (x.time === time && x.employee === this.state.employee && x.deskNumber === deskNumber))){
            bookedTimes?.push(timeObj)
            this.setState({
                bookedTimes: bookedTimes
            })
            this.setBookedTimes(bookedTimes);
        }
        else{
            this.setState({bookedTimes: this.state.bookedTimes?.filter((t)=> {
                return ( (t.time !== timeObj.time) || (t.employee !== timeObj.employee) || (t.deskNumber !== timeObj.deskNumber) ) ; 
            })}, () => this.setBookedTimes(this.state.bookedTimes))
        }
    }

    render() {
        return (
            <div>
                <div className='scheduling-header'>
                    <Link to="/">
                        <IconButton>
                            <ArrowCircleUpIcon fontSize="large" style={{ color: "#2069e0", transform: "rotate(270deg)" }}/>
                        </IconButton>
                    </Link>
                    <div className='header-title'>Scheduling for {this.props?.employee}</div>
                </div>
                <div className="bookable-days-container">
                    {this.state.bookableDays.map((day, idx) => {
                        return (
                            <button 
                                key={`bookable-day-${idx}`} 
                                className={this.state.selectedDay === day ? 'bookable-day-btn bookable-day-btn-selected' : 'bookable-day-btn'} 
                                onClick={ () => this.handleDaySelect(day)}
                            >
                                <b>{day.split(',')[0]}</b>
                                <br/>
                                {day.split(',')[1]}
                            </button>
                        )
                    })}
                </div>
                <div className='timeslots-container'>
                    <table >
                        <tbody>
                            {this.state.times.map((time, idx) => {
                                let temptime = this.state.bookedTimes?.filter((x) => {
                                    return x.time === time
                                })
                                let bookedEmployeeOne = temptime?.find(o => o.deskNumber === 1)?.employee
                                let bookedEmployeeTwo = temptime?.find(o => o.deskNumber === 2)?.employee
                                return (
                                    <React.Fragment key={`timeslot-${idx}`} >
                                        <tr key={idx}>
                                            <td className='table-time-column'>
                                                <span>{time}</span>
                                            </td>
                                            <td>
                                                <button 
                                                    className={(bookedEmployeeOne) ? bookedEmployeeOne : 'desk-btn'} 
                                                    onClick={ 
                                                        (bookedEmployeeOne === this.state.employee || !bookedEmployeeOne)
                                                            ? () => this.handleTimeBooked(time, 1) 
                                                            : () => console.log("ERR: you can't edit someone else's time")
                                                    }
                                                >
                                                    
                                                    {(bookedEmployeeOne ) ? ((bookedEmployeeOne === "Jameso") ? "James O." : bookedEmployeeOne) : "OPEN"}
                                                    {/* {(bookedEmployeeOne === "Jameso") ? "James O." : "OPEN"} */}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className={(bookedEmployeeTwo) ? bookedEmployeeTwo : 'desk-btn'} 
                                                    onClick={ 
                                                        (bookedEmployeeTwo === this.state.employee || !bookedEmployeeTwo) 
                                                            ? () => this.handleTimeBooked(time, 2) 
                                                            : () => console.log("ERR: you can't edit someone else's time")
                                                    }
                                                >
                                                    {(bookedEmployeeTwo ) ? ((bookedEmployeeTwo === "Jameso") ? "James O." : bookedEmployeeTwo) : "OPEN"}
                                                    {/* {(bookedEmployeeTwo ) ? bookedEmployeeTwo : "OPEN"} */}
                                                </button>
                                            </td>
                                       </tr>
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {this.props.employee === "Jared" &&
                    <div className='timesheet-link'>
                        <a href="https://docs.google.com/spreadsheets/d/1dmddfvBoCvSj77azzDF9r4Stdoru77n5JMrFXGdj1EQ/edit#gid=0">Link to Timesheet</a>
                    </div>
                }{this.props.employee === "James O." &&
                    <div className='timesheet-link'>
                        <a href="https://docs.google.com/spreadsheets/d/1DhuNwaFzaZnV8EXnYR6HY-i5fiHkq5QeM4EngnR5rq4/edit#gid=0">Link to Timesheet</a>
                    </div>
                }
                {this.props.employee === "Joey" &&
                    <div className='timesheet-link'>
                        <a href="https://docs.google.com/spreadsheets/d/1pX8x3YHm8gkQwiPh1zoQ_ZJxgvETavMok4xzMwuagVo/edit?usp=sharing">Link to Timesheet</a>
                    </div>
                }
                {this.props.employee === "Gavin" &&
                    <div className='timesheet-link'>
                        <a href="https://docs.google.com/spreadsheets/d/1R6kEnnuMotIhRVGkbTTriJxIcn43pKvidObXPAZaEDk/edit#gid=0">Link to Timesheet</a>
                    </div>
                } 
                {/* 
                {this.props.employee === "Stephanie" &&
                    <div className='timesheet-link'>
                        <a href="https://docs.google.com/spreadsheets/d/1F0PBcQlnmEUVAdc7Il3KZabvhFAR9wuldXB3cvPbUZ4/edit">Link to Timesheet</a>
                    </div>
                } */}
            </div>
        );
    }
}

Home.propTypes = {

};

export default Home;