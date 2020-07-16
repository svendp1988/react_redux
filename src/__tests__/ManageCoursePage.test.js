import React from 'react';
import { mount } from 'enzyme';
import { authors, courses, newCourse } from '../../tools/mockData';
import {ManageCoursePage} from "../components/courses/ManageCoursePage";

describe('ManageCoursePage', function () {
    function renderManageCoursePage(args) {
        const defaultProps = {
            courses,
            authors,
            loadAuthors: jest.fn(),
            loadCourses: jest.fn(),
            saveCourse: jest.fn(),
            history: {},
            course: newCourse,
            match: {}
        }
        const props = {...defaultProps, ...args};
        return mount(<ManageCoursePage {...props} />);
    }

    it('should set error when attempting to save without filling in a title', function () {
        const wrapper = renderManageCoursePage();
        wrapper.find('form').simulate('submit');
        const error = wrapper.find('.alert').first();
        expect(error.text()).toBe('Title is required.');
    });
});
