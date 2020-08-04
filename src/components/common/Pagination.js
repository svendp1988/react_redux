import React from 'react';

export const Pagination = ({resultsPerPage, totalResults, handleChangePage, currentPage}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li
                        key={number}
                        className="page-item"
                    >
                        <a
                            onClick={() => handleChangePage(number)}
                            className="page-link"
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
