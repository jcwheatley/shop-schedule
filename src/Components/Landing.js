import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'
// import logo from '../../assets/img/threaded-logo.png';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";

class Landing extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }


    render() {
        const annie = {
            pathname: "/schedule",
            state: { employee: "Annie"}
        }

        const john = {
            pathname: "/schedule",
            state: { employee: "John"}
        }

        const michele = {
            pathname: "/schedule",
            state: { employee: "Michele"}
        }

        const scott = {
            pathname: "/schedule",
            state: { employee: "Scott"}
        }

        const james = {
            pathname: "/schedule",
            state: { employee: "James"}
        }

        return (
            <div className='landing-container'>
                {/* <img src={}../../assets/img/threaded-logo.png" width="200"></img> */}
                <img src={`${process.env.PUBLIC_URL}/assets/img/threaded-logo.png`} width={100}></img>
                <div className='employee-container'>
                    <h2>Shop Scheduler</h2>
                    <Link to={annie}>
                        <button variant="outlined">
                            Annie
                        </button>
                    </Link>
                    <Link to={john}>
                        <button variant="outlined">
                            John
                        </button>
                    </Link>
                    <Link to={michele}>
                        <button variant="outlined">
                            Michele
                        </button>
                    </Link>
                    <Link to={scott}>
                        <button variant="outlined">
                            Scott
                        </button>
                    </Link>
                    <Link to={james}>
                        <button variant="outlined">
                            James
                        </button>
                    </Link>

                </div>

                
                {/* <button>Click may!!</button> */}
            </div>
        );
    }
}

Landing.propTypes = {

};

export default Landing;