import {handleResponse, handleError} from "./apiUtils";
import * as courseApi from '../api/courseApi'

const baseUrl = process.env.API_URL + "/authors/";
const courseUrl = process.env.API_URL + "/courses/";


export function getAuthors() {
    return fetch(baseUrl)
        .then(handleResponse)
        .catch(handleError);
}

export function saveAuthor(author) {
    return fetch(baseUrl + (author.id || ''), {
        method: author.id ? 'PUT' : 'POST',
        headers: {"content-type": "application/json"},
        body: JSON.stringify(author)
    })
        .then(handleResponse)
        .catch(handleError);
}

export async function deleteAuthor(authorId) {
    const courses = courseApi.getCourses()
        .then(courses =>
            courses.filter(
                course => course.authorId === authorId
            ));
    if (courses) {
        throw Error("Cannot delete author because he still has courses assigned.")
    }
    return fetch(baseUrl + authorId, {
        method: 'DELETE'
    })
        .then(handleResponse)
        .catch(handleError);
}
