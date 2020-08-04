import React from 'react';
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import CoursesPage from "./courses/CoursesPage";
// eslint-disable-next-line import/no-named-as-default
import ManageCoursePage from "./courses/ManageCoursePage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line import/no-named-as-default
import ManageAuthorPage from "./authors/ManageAuthorPage";
import AuthorsPage from "./authors/AuthorsPage";

function App() {
    return (
        <div className="container-fluid">
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/about" component={AboutPage}/>
                    <Route path="/courses" component={CoursesPage}/>
                    <Route path="/course/:slug" component={ManageCoursePage}/>
                    <Route path="/course" component={ManageCoursePage}/>
                    <Route path='/authors' component={AuthorsPage}/>
                    <Route path='/author/:id' component={ManageAuthorPage}/>
                    <Route path='/author' component={ManageAuthorPage}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </Router>
            <ToastContainer autoClose={3000} hideProgressBar/>
        </div>
    );
}

export default App;
