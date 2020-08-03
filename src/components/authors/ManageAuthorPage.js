import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import AuthorForm from "./AuthorForm";
import {newAuthor, newCourse} from '../../../tools/mockData';
import Spinner from "../common/Spinner";
import {toast} from 'react-toastify';
import {getCourseBySlug} from "../courses/ManageCoursePage";

/*  Cannot destructure course directly as an argument because it would cause ambiguity between
    the argument and the course const declared below. So the rest operator is used instead to
    store the rest of the arguments in a variable called props. This way I can access the course
    object that is on props when calling the useState hook.
 */
export function ManageAuthorPage({
                                     authors,
                                     loadAuthors,
                                     saveAuthor,
                                     history,
                                     ...props
                                 }) {
    /* Prefer to use React state over Redux state here because only this component cares about
        this state. This reduces complexity over Redux state. Forms are a good example of components
        that are preferably written using React state.
     */
    const [author, setAuthor] = useState({...props.author});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (authors.length === 0) {
            loadAuthors()
                .catch(error => {
                    alert("Loading authors failed " + error);
                });
        } else {
            setAuthor({
                ...props.author
            })
        }
    }, [props.author]);

    function handleChange(event) {
        console.log('Handling change');
        const {name, value} = event.target;
        setAuthor(prevAuthor => ({
            ...prevAuthor,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }))
    }

    function formIsValid() {
        const {name} = author;
        const errors = {};
        if (!name) errors.name = 'Name is required.';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    function handleSave(event) {
        event.preventDefault();
        if (!formIsValid()) return;
        setSaving(true);
        saveAuthor(author)
            .then(() => {
                toast.success('Author saved.')
                history.push("/authors");
            })
            .catch(error => {
                setSaving(false);
                setErrors({onSave: error.message})
            });
    }

    return (
        authors.length === 0
            ? (<Spinner/>)
            : (
                <React.Fragment>
                    <AuthorForm
                        author={author}
                        errors={errors}
                        onChange={handleChange}
                        onSave={handleSave}
                        saving={saving}
                        authors={authors}/>
                </React.Fragment>
            )
    )
}

ManageAuthorPage.propTypes = {
    author: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    saveAuthor: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
}

// Selector -> more info: https://www.saltycrane.com/blog/2017/05/what-are-redux-selectors-why-use-them/
export function getAuthorById(authors, id) {
    return authors.find(author =>
        author.id === parseInt(id))
        || null;
}

function mapStateToProps(state, ownProps) {
    const id = ownProps.match.params.id;
    const author =
        id && state.authors.length > 0
            ? getAuthorById(state.authors, id)
            : newAuthor;
    return {
        author,
        authors: state.authors
    }
}

const mapDispatchToProps = {
    saveAuthor: authorActions.saveAuthor,
    loadAuthors: authorActions.loadAuthors
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageAuthorPage);
