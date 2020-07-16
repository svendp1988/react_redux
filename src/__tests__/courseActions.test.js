import * as courseActions from '../redux/actions/courseActions';
import * as types from '../redux/actions/actionTypes';
import { courses } from '../../tools/mockData';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import configureStore from 'redux-mock-store';

describe('courseAction', () => {
    it('should create a CREATE_COURSE_SUCCESS action', function () {
        // arrange
        const course = courses[0];
        const expectedAction = {
            type: types.CREATE_COURSE_SUCCESS,
            course
        }

        // act
        const action = courseActions.createCourseSuccess(course);

        // assert
        expect(action).toEqual(expectedAction);
    });
});

describe('Testing async actions', () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);

    afterEach(() => {
        fetchMock.restore();
    })

    it('should create BEGIN_API_CALL and LOAD_COURSES_SUCCESS when loading courses', function () {
        fetchMock.mock('*', {
            body: courses,
            headers: {'content-type': 'application/json'}
        });

        const expectedActions = [
            { type: types.BEGIN_API_CALL },
            { type: types.LOAD_COURSES_SUCCESS, courses }
        ]

        const store = mockStore({ courses: []});
        return store.dispatch(courseActions.loadCourses())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });
});
