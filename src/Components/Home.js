import React, { Component } from 'react';
import moment from 'moment';
import './Home.css';
import Landing from './Landing';
import { Link } from 'react-router-dom';
import {useLocation} from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import Add from './Add';
import FetchData from './FetchData';

import { db } from '../../src/index';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            bookedTimes: [],
            selectedDay: moment().format('dddd, MMM Do'),
            times: [],
            employee: this.props.employee,
        }

    }

    getBookedTimes = () => {
        let bookedTimesObj;
        db.collection("times")
        .get()
        .then((querySnapshot) => {
            console.log("firestore", querySnapshot);
            querySnapshot.docs.map((doc) => {
                if(doc.id === 'bookedtimes'){
                    console.log("doc data: ", doc.data());
                    bookedTimesObj = doc.data().bookedTimes;
                    this.setState({
                        bookedTimes: bookedTimesObj
                    })
                }
            });
        });
    };

    setBookedTimes = (newBookedTimes) => {
        console.log("Adding bookedTimes to firebase: ", newBookedTimes);
      db.collection("times")
        .doc("bookedtimes")
        .set({
          bookedTimes: newBookedTimes
        })
        .then(function () {
          console.log("Value successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing Value: ", error);
        });
    };

    componentDidMount() {
        this.setTimes();
        this.getBookedTimes();
    }

    setTimes = () => {
        var x = 30; //minutes interval
        var times = []; // time array
        var tt = 60*9; // start time
        var ap = ['AM', 'PM']; // AM-PM

        //loop to increment the time and push results in array
        for (var i=0;tt<21*60; i++) {
            var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
            var mm = (tt%60); // getting minutes of the hour in 0-55 format
            times[i] = ("" + ((hh===12)?12:hh%12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }

        let bookableDays = [
            moment().format('dddd, MMM Do'),
            moment().add(1, 'days').format('dddd, MMM D'),
            moment().add(2, 'days').format('dddd, MMM D'),
            moment().add(3, 'days').format('dddd, MMM D'),
            moment().add(4, 'days').format('dddd, MMM D')
        ]
        this.setState({
            times: times,
            bookableDays: bookableDays
        })
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleDaySelect = (day) => {
        this.setState({
            selectedDay: day
        })
    }

    handleTimeBooked = (time) => {
        let bookedTimes = this.state.bookedTimes;
        let timeObj = bookedTimes.find(x => (x.time === time && x.employee === this.state.employee));

        if(!timeObj){
            let newTime = {
                "time": time,
                "employee": this.state.employee
            }
            console.log("Adding object: ", newTime);
            bookedTimes.push(newTime)
            this.setState({
                bookedTimes: bookedTimes
            })
            this.setBookedTimes(bookedTimes);
        }
        else{
            let removeTime = {
                "time": time,
                "employee": this.state.employee
            }
            console.log("removing object: ", removeTime);

            this.setState({bookedTimes: this.state.bookedTimes.filter((t)=> {
                return ( (t.time !== removeTime.time) || (t.employee !== removeTime.employee) ) ; 
            })}, () => this.setBookedTimes(this.state.bookedTimes))
        }
    }

    render() {
        return (
            <div>
                {/* <Landing/> */}
                {/* <button onClick={() => console.log(this.state.bookedTimes)}>Print state</button> */}
                <div className='scheduling-header'>
                    <Link to="/">
                        <button className='back-btn'>
                            &#60; Back
                        </button>
                    </Link>
                    <h3>Scheduling for {this.props?.employee}</h3>
                </div>
                
                <div className={"bookable-days"}>
                    {this.state.bookableDays.map((day, idx) => {
                        return <button key={idx} className={this.state.selectedDay === day ? 'day-btn day-btn-selected' : 'day-btn'} onClick={ () => this.handleDaySelect(day) }>{day}</button>
                    })}
                </div>
                <div className='timeslots'>
                    <table >
                        <tbody>
                            {this.state.bookedTimes && this.state.times.map((time, idx) => {
                                // console.log("time: ", time)
                                let temptime = this.state.bookedTimes.find((x) => {
                                    return x.time === time
                                })
                                let bookedEmployee;
                                if(temptime){
                                    bookedEmployee = temptime.employee;
                                    console.log("temptime", temptime);
                                } 
                                return (
                                    <>
                                        <tr key={idx}>
                                            <td>{time}</td>
                                            {this.state.bookedTimes &&
                                                console.log("bookedTimes: ", this.state.bookedTimes)
                                            }
                                            
                                            <td>
                                                <button 
                                                    className={bookedEmployee ? bookedEmployee : 'desk-btn'} 
                                                    onClick={ () => this.handleTimeBooked(time)}>{bookedEmployee ? bookedEmployee : "OPEN"}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className='desk-btn' 
                                                    onClick={ () => this.handleTimeBooked(time)}>{this.state.bookedTimes.includes(time) ? this.state.employee : "OPEN"}
                                                </button>
                                            </td>
                                            {/* <td><button className={this.state.bookedTimes.find(x => x.time === time) ? 'booked-desk-btn' : 'desk-btn'} onClick={ () => this.handleTimeBooked(time)}>{this.state.bookedTimes.find(x => x.time === time) ? this.state.employee : "OPEN"}</button></td>
                                            <td><button className='desk-btn' onClick={ () => this.handleTimeBooked(time)}>{this.state.bookedTimes.includes(time) ? this.state.employee : "OPEN"}</button></td> */}
                                        </tr>
                                    </>
                                    
                                
                                )
                            })}
                        </tbody>

                    </table>
                    
                </div>

                {/* <Add bookedTimes={this.state.bookedTimes}/>
                <FetchData/> */}

            </div>
        );
    }
}

Home.propTypes = {

};

export default Home;