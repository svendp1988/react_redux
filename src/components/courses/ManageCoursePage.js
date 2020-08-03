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
// class ManageCoursePage extends React.Component {
//     state = {
//         course: {...this.props.course},
//         errors: {},
//         saving: false
//     }
//
//     componentDidMount() {
//         if (this.props.courses.length === 0) {
//             this.props.loadCourses()
//                 .catch(error => {
//                     alert("Loading courses failed " + error);
//                 });
//         } else {
//             this.setState({
//                 course: {...this.props.course}
//             })
//         }
//         if (this.props.authors.length === 0) {
//             this.props.loadAuthors()
//                 .catch(error => {
//                     alert('Loading authors failed ' + error);
//                 })
//         }
//     }
// }

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
    const emptyCourse = {
        id: null,
        title: "",
        authorId: null,
        category: ""
    };


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
        if (course != emptyCourse) {
            return window.onbeforeunload = () => '';
        }

    }, [props.course]);

    function handleChange(event) {
        const {name, value} = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }))
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
                toast.success('Course saved.')
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
                {/*<button onClick={onOpenNotificationWarning}>Click me for warning</button>*/}
                {/*<button onClick={onOpenNotificationSuccess}>Click me for Success</button>*/}
                {/*<button onClick={onOpenNotificationAlert}>Click me for Alert</button>*/}
                <CourseForm
                    course={course}
                    errors={errors}
                    authors={authors}
                    onChange={handleChange}
                    onSave={handleSave}
                    saving={saving}
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
