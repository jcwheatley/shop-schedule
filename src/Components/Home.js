import React, { Component } from 'react';
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

    getBookedTimes = () => {
        console.log("getBOOKEDTIMES CALLED");
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
                        // console.log("doc data: ", doc.data());
                        bookedTimesResponse = doc.data().bookedTimes;
                        // selectedDayTimesResponse = doc.data()[this.state.selectedDay];
                        this.setState({
                            bookedTimes: bookedTimesResponse,
                            // selectedDayTimes: selectedDayTimesResponse
                        })
                        console.log("Booked times resolved");
                    }
                });
            });
    };

    setBookedTimes = (newBookedTimes) => {
        // console.log("Adding bookedTimes to firebase: ", newBookedTimes);
        db.collection("times")
            .doc(this.state.selectedDay)
            .set({
                bookedTimes: newBookedTimes
                // [this.state.selectedDay]: newBookedTimes
            })
            .then(function () {
                console.log("Successfully written to Firebase!");
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    };

    updateBookedTimes = (newBookedTimes) => {

        const dbRef = db.collection('times').doc('bookedtimes')

        // check if document exists before doing stuff
        dbRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                dbRef.onSnapshot((doc) => {
                // do stuff with the data
                });
            } else {
                // dbRef.set({...}) // create the document
            }
        });

        db.collection("times")
            .doc("bookedtimes")
            .update({
                [this.state.selectedDay]: newBookedTimes
            })
            .then(function () {
                console.log("Successfully written to Firebase!");
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    }

    componentDidMount() {
        this.setTimes();
        this.getBookedTimes();
    }

    setTimes = () => {
        var x = 30; //minutes interval
        var times = []; // time array
        var tt = 60*9; // start time
        var ap = ['am', 'pm']; // AM-PM

        //loop to increment the time and push results in array
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

    componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedDay !== this.state.selectedDay){
            console.log("Selected day changed to: ", this.state.selectedDay);
            this.getBookedTimes();
        }
    }

    handleDaySelect = (day) => {
        this.setState({
            selectedDay: day
        })
    }

    handleTimeBooked = (time, deskNumber) => {
        let bookedTimes = this.state.bookedTimes;
        // let timeObj = bookedTimes.find(x => (x.time === time && x.employee === this.state.employee));
        let masterTimeObj = this.state.bookedTimes?.filter((x) => {
            return (x.time === time && x.employee === this.state.employee && x.deskNumber === deskNumber);
        })

        let timeObj = {
            "time": time,
            "employee": this.state.employee,
            "deskNumber": deskNumber
        }

        if(!masterTimeObj?.find(x => (x.time === time && x.employee === this.state.employee && x.deskNumber === deskNumber))){
            console.log("Adding object: ", timeObj);
            bookedTimes?.push(timeObj)
            this.setState({
                bookedTimes: bookedTimes
            })
            this.setBookedTimes(bookedTimes);
        }
        else{
            console.log("removing object: ", timeObj);
            this.setState({bookedTimes: this.state.bookedTimes?.filter((t)=> {
                return ( (t.time !== timeObj.time) || (t.employee !== timeObj.employee) || (t.deskNumber !== timeObj.deskNumber) ) ; 
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
                        <IconButton className='back-btn' aria-label="back">
                            <ArrowCircleUpIcon style={{ color: "#2069e0", transform: "rotate(270deg)" }}/>
                        </IconButton>
                    </Link>
                    <div className='header-title'>Scheduling for {this.props?.employee}</div>
                </div>
                
                <div className={"bookable-days"}>
                    {this.state.bookableDays.map((day, idx) => {
                        return (
                            <button 
                                key={idx} 
                                className={this.state.selectedDay === day ? 'day-btn day-btn-selected' : 'day-btn'} 
                                onClick={ () => this.handleDaySelect(day)}
                            >
                                {day.split(',')[0]}
                                <br/>
                                {day.split(',')[1]}
                            </button>
                        )
                    })}
                </div>
                <div className='timeslots'>
                    <table >
                        <tbody>
                            {console.log("===================")}
                            {this.state.times.map((time, idx) => {
                                let temptime = this.state.bookedTimes?.filter((x) => {
                                    return x.time === time
                                })
                                console.log(time, temptime);
                                let bookedEmployeeOne = temptime?.find(o => o.deskNumber === 1)?.employee
                                let bookedEmployeeTwo = temptime?.find(o => o.deskNumber === 2)?.employee
                                return (
                                    <>
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
                                                    {(bookedEmployeeOne ) ? bookedEmployeeOne : "OPEN"}
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
                                                    {(bookedEmployeeTwo ) ? bookedEmployeeTwo : "OPEN"}
                                                </button>
                                            </td>
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