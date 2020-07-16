import React from "react";
import {Link} from "react-router-dom";

const HomePage = () => (
    <div className="jumbotron">
        <h1>My first React - Redux Application</h1>
        <p>Using React, Redux and React Router for responsive, testable web apps.</p>
        <Link to="about" className="btn btn-primary btn-lg">
            Learn more
        </Link>
    </div>
);

export default HomePage;
