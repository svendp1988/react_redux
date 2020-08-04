import  React from 'react';
import Dropdown from "bootstrap/js/src/dropdown";
import DropdownButton from 'bootstrap/js/src/button';

const Sort = () => (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item href="#/action-1">Title</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Author</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Category</Dropdown.Item>
    </DropdownButton>
);

export default Sort;
