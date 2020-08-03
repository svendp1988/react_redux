import React from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import AuthorList from './AuthorList';
import {Redirect} from 'react-router-dom';
import Spinner from "../common/Spinner";
import {toast} from "react-toastify";

class AuthorsPage extends React.Component {
    state = {
        redirectToAddAuthorPage: false,
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

    handleDeleteAuthor = async author => {
        try {
            await this.props.actions
                .deleteAuthor(author)
            toast.success('Author deleted');
        } catch (error) {
            toast.error("Delete failed. " + error.message, {autoClose: false})
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.redirectToAddAuthorPage && <Redirect to="/author"/>}
                <h2>Authors</h2>
                {this.props.loading
                    ? <Spinner/>
                    : (
                        <React.Fragment>
                            <button
                                style={{marginBottom: 20}}
                                className='btn btn-primary add-course'
                                onClick={() => this.setState({
                                    redirectToAddAuthorPage: true
                                })}
                            >
                                Add Author
                            </button>
                            <AuthorList
                                onDeleteClick={this.handleDeleteAuthor}
                                authors={this.props.authors}
                            />
                        </React.Fragment>
                    )}
            </React.Fragment>
        )
    }
}

AuthorsPage.propTypes = {
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
            deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
