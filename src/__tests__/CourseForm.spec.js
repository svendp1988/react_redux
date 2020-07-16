import React from 'react';
import renderer from 'react-test-renderer';
import CourseForm from "../components/courses/CourseForm";
import { courses, authors } from '../../tools/mockData';
import {shallow} from "enzyme";
import {cleanup, render} from 'react-testing-library';

describe('CourseForm Snapshot Test', function () {
    it('should set button label "Saving..." when saving is true', function () {
        const tree = renderer.create(
            <CourseForm
                onChange={jest.fn()}
                authors={authors}
                onSave={jest.fn()}
                course={courses[0]}
                saving
            />
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('CourseForm Enzyme Test', () => {
    function renderCourseForm(args) {
        const defaultProps = {
            authors: [],
            course: {},
            saving: false,
            errors: {},
            onSave: () => {},
            onChange: () => {}
        };
        const props = {...defaultProps, ...args};
        return shallow(<CourseForm {...props}/>);
    }

    it('should set button label "Saving..." when saving is true', function () {
        const wrapper = renderCourseForm({ saving: true });
        expect(wrapper.find('button').text()).toBe('Saving...');
    });

    it('should set button label "Save." when saving is false', function () {
        const wrapper = renderCourseForm();
        expect(wrapper.find('button').text()).toBe('Save');
    });
})

describe('CourseForm ReactTestingLibrary Test', () => {

    afterEach(cleanup);

    function renderCourseForm(args) {
        const defaultProps = {
            authors: [],
            course: {},
            saving: false,
            errors: {},
            onSave: () => {
            },
            onChange: () => {
            }
        };
        const props = {...defaultProps, ...args};
        return render(<CourseForm {...props}/>);
    }

    it('should set button label "Saving..." when saving is true', function () {
        const { getByText } = renderCourseForm({saving: true});
        getByText('Saving...');
    });

    it('should set button label "Save" when saving is false', function () {
        const { getByText, debug } = renderCourseForm();
        debug();
        getByText('Save');
    });
})
