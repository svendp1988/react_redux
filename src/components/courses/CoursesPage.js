import React from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import CourseList from "./CourseList";
import {Redirect} from 'react-router-dom';
import Spinner from "../common/Spinner";
import {toast} from "react-toastify";
import FilterResults from 'react-filter-search';

class CoursesPage extends React.Component {
    state = {
        redirectToAddCoursePage: false,
        value: '',
        currentPage: 1,
        resultsPerPage: 5
    };

    componentDidMount() {
        const {courses, actions, authors} = this.props;
        if (courses.length === 0) {
            actions.loadCourses()
                .catch(error => {
                    alert("Loading courses failed " + error);
                });
        }
        if (authors.length === 0) {
            actions.loadAuthors()
                .catch(error => {
                    alert('Loading authors failed ' + error);
                })
        }
    }

    handleDeleteCourse = async course => {
        toast.success('Course deleted');
        try {
            await this.props.actions
                .deleteCourse(course)
        } catch (error) {
            toast.error("Delete failed. " + error.message, {autoClose: false})
        }
    }

    handleChange = event => {
        const {value} = event.target;
        this.setState({value});
    };

    handleChangePage = currentPage => this.setState({
        currentPage
    });

    render() {
        const indexOfLastResult = this.state.currentPage * this.state.resultsPerPage;
        const indexOfFirstResult = indexOfLastResult - this.state.resultsPerPage;
        const value = this.state.value;
        const courses = this.props.courses.sort(((a, b) => a.title.localeCompare(b.title)));
        return (
            <React.Fragment>
                {this.state.redirectToAddCoursePage && <Redirect to="/course"/>}
                <h2>Courses [{courses.length}]</h2>
                {this.props.loading
                    ? <Spinner/>
                    : (
                        <React.Fragment>
                            <div className='row'>
                                <button
                                    style={{marginBottom: 20}}
                                    className='btn btn-primary add-course col-sm'
                                    onClick={() => this.setState({
                                        redirectToAddCoursePage: true
                                    })}
                                >
                                    Add Course
                                </button>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={this.handleChange}
                                    placeholder='Search...'
                                />
                            </div>
                            <FilterResults
                                value={value}
                                data={this.props.courses}
                                renderResults={results => (
                                    <CourseList
                                        onDeleteClick={this.handleDeleteCourse}
                                        courses={results.slice(indexOfFirstResult, indexOfLastResult)}
                                        resultsPerPage={this.state.resultsPerPage}
                                        totalResults={results.length}
                                        handleChangePage={this.handleChangePage}
                                    />
                                )}
                            />
                        </React.Fragment>
                    )}
            </React.Fragment>
        )
    }
}

CoursesPage.propTypes = {
    courses: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
    return {
        courses: state.authors.length === 0
            ? []
            : state.courses.map(course => {
                return {
                    ...course,
                    authorName: state.authors.find(author => author.id === course.authorId).name
                };
            }),
        authors: state.authors,
        loading: state.apiCallsInProgress > 0,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
            loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
            deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
