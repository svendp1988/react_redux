import * as types from "./actionTypes";
import * as authorApi from '../../api/authorApi';
import {apiCallError, beginApiCall} from "./apiStatusActions";

export function loadAuthorsSuccess(authors) {
    return {type: types.LOAD_AUTHORS_SUCCESS, authors}
}

export function createAuthorSuccess(author) {
    return {type: types.CREATE_AUTHOR_SUCCESS, author}
}

export function updateAuthorSuccess(author) {
    return {type: types.UPDATE_AUTHOR_SUCCESS, author}
}

export function deleteAuthorSuccess(author) {
    return {type: types.DELETE_AUTHOR_SUCCESS, author}
}

export function loadAuthors() {
    return function (dispatch) {
        dispatch(beginApiCall())
        return authorApi.getAuthors()
            .then(authors => {
                dispatch(loadAuthorsSuccess(authors));
            })
            .catch(error => {
                dispatch(apiCallError(error));
                throw error;
            })
    }
}

export function saveAuthor(author) {
    return function (dispatch) {
        dispatch(beginApiCall());
        return authorApi
            .saveAuthor(author)
            .then(savedAuthor => {
                author.id
                    ? dispatch(updateAuthorSuccess(savedAuthor))
                    : dispatch(createAuthorSuccess(savedAuthor));
            })
            .catch(error => {
                dispatch(apiCallError(error));
                throw error;
            });
    };
}

export function deleteAuthor(author) {
    return function (dispatch) {
        dispatch(beginApiCall());
        return authorApi
            .deleteAuthor(author.id)
            .then(() => dispatch(deleteAuthorSuccess(author)))
            .catch(error => {
                dispatch(apiCallError(error));
                throw error;
            });
    };
}
