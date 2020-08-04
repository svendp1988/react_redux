import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseForm from "./CourseForm";
import {newCourse} from '../../../tools/mockData';
import Spinner from "../common/Spinner";
import {toast} from 'react-toastify';
// import {notification} from 'antd';
// import '../../notification.css';

/*  Cannot destructure course directly as an argument because it would cause ambiguity between
    the argument and the course const declared below. So the rest operator is used instead to
    store the rest of the arguments in a variable called props. This way I can access the course
    object that is on props when calling the useState hook.
 */


export function ManageCoursePage({
                                     courses,
                                     authors,
                                     loadAuthors,
                                     loadCourses,
                                     saveCourse,
                                     history,
                                     ...props
                                 }) {
    /* Prefer to use React state over Redux state here because only this component cares about
        this state. This reduces complexity over Redux state. Forms are a good example of components
        that are preferably written using React state.
     */
    const [course, setCourse] = useState({...props.course});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const emptyCourse = {
        id: null,
        title: "",
        authorId: null,
        category: ""
    }


    useEffect(() => {
        if (courses.length === 0) {
            loadCourses()
                .catch(error => {
                    alert("Loading courses failed " + error);
                });
        } else {
            setCourse({
                ...props.course
            })
        }
        if (authors.length === 0) {
            loadAuthors()
                .catch(error => {
                    alert('Loading authors failed ' + error);
                })
        }
    }, [props.course]);

    /*
    *   Assignment: show a message when you try to leave the courseform-page with unsaved changes.
    *   Solution:
    *       1) The variable isBlocking is set to true in the onChange event and is passed down as a prop to the
    *          CourseForm. This triggers a prompt if anything has been typed in the form and you try to leave the
    *          page by using the windows back-navigation or trying to reload the page.
    *       2) window.onbeforeunload gets triggered in the same way.
    *   Questions:
    *       1) Does the window.onbeforeunload belong in the cleanup method of useEffect? In a class component
    *          this seems to me like something that would be written in componentWillUnmount.
    *       2) Should this component therefor be written as a React class component?
    *       3) The way it works now, once the prompt has been triggered (something has been typed in any of the fields
    *          and you try to leave without submitting the form), it also pops up if you clear the fields and then try
    *          leave the page. It was not very clear to me if this behaviour could/should be avoided?
    */

    window.onbeforeunload = () => isBlocking ? true : null;

    function handleChange(event) {
        const {name, value} = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }))
        setIsBlocking(course != emptyCourse);
    }

    function formIsValid() {
        const {title, authorId, category} = course;
        const errors = {};
        if (!title) errors.title = 'Title is required.';
        if (!authorId) errors.author = 'Author is required.';
        if (!category) errors.category = 'Category is required.';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }


    function handleSave(event) {
        event.preventDefault();
        if (!formIsValid()) return;
        setSaving(true);
        saveCourse(course)
            .then(() => {
                toast.success('Course saved.');
                setIsBlocking(false);
                history.push("/courses");
            })
            .catch(error => {
                setSaving(false);
                setErrors({onSave: error.message})
            });
    }


    return (
        authors.length === 0 || courses.length === 0
            ? (<Spinner/>)
            : (<React.Fragment>
                <CourseForm
                    course={course}
                    errors={errors}
                    authors={authors}
                    onChange={handleChange}
                    onSave={handleSave}
                    saving={saving}
                    isBlocking={isBlocking}
                />
            </React.Fragment>)
    )
}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired,
    authors: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    saveCourse: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
}

// Selector -> more info: https://www.saltycrane.com/blog/2017/05/what-are-redux-selectors-why-use-them/
export function getCourseBySlug(courses, slug) {
    return courses.find(course =>
        course.slug === slug)
        || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
    const course =
        slug && state.courses.length > 0
            ? getCourseBySlug(state.courses, slug)
            : newCourse;
    return {
        // shorthand syntax -> is the same as course: course
        course,
        courses: state.courses,
        authors: state.authors
    }
}

const mapDispatchToProps = {
    loadCourses: courseActions.loadCourses,
    saveCourse: courseActions.saveCourse,
    loadAuthors: authorActions.loadAuthors
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageCoursePage);

// const onOpenNotificationWarning = () => {
//
//     notification.warn({
//
//         message: 'AO.Flight Application',
//
//         className: 'warnNotification',
//
//         description: (<div>Flight AFR123 has been delayed.</div>),
//
//         closeIcon: (
//
//             <span className="notification-buttons">
//
//           </span>
//
//         ),
//
//         placement: "bottomRight",
//
//         duration: 0
//
//     });
//
// };
//
//
// const onOpenNotificationSuccess = () => {
//
//     notification.success({
//
//         message: 'DNP Application',
//
//         className: 'successNotification',
//
//         description: (<div>Network plan of 1st APRIL 2020 and weather assessment has been published.</div>),
//
//         placement: "bottomRight",
//
//         duration: 0
//
//     });
//
// };
//
//
// const onOpenNotificationAlert = () => {
//
//     notification.error({
//
//         message: 'DNP Application',
//
//         className: 'errorNotification',
//
//         description: (<div>Network plan of 1st APRIL 2020 and weather assessment has not been published.</div>),
//
//         placement: "bottomRight",
//
//         duration: 0
//
//     });
//
// };
