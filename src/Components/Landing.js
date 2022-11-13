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

        const tiffany = {
            pathname: "/schedule",
            state: { employee: "Tiffany"}
        }

        const stephanie = {
            pathname: "/schedule",
            state: { employee: "Stephanie"}
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
            <div className='landing-view'>
                <div className='logo-container'>
                    <img src={`${process.env.PUBLIC_URL}/assets/img/threaded-logo.png`} width={100}></img>
                </div>
                <div className='landing-container'>
                    <div className='employee-container'>
                        <h2>Shop Scheduler</h2>
                        <Link to={annie}>
                            Annie
                        </Link>
                        <Link to={john}>
                            John
                        </Link>
                        <Link to={scott}>
                            Scott
                        </Link>
                        <Link to={stephanie}>
                            Stephanie
                        </Link>
                        <Link to={tiffany}>
                            Tiffany
                        </Link>
                        <Link to={james}>
                            James
                        </Link>

                    </div>
                </div>
                
            </div>
        );
    }
}

Landing.propTypes = {

};

export default Landing;