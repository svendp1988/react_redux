import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Header from "../components/common/Header";

describe('Header', function () {
    it('should look for Navlinks in shallow render', function () {
        const numNavs = shallow(<Header/>).find('NavLink').length;
        expect(numNavs).toBe(3);
    });

    it('should look for anchor tags in mount render', function () {
        const numAs = mount(
            <MemoryRouter>
                <Header/>
            </MemoryRouter>).find('a').length;
        expect(numAs).toBe(3);
    });
});
