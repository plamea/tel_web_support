import React, {useState} from 'react';
import { Pagination as PaginationFlowbite } from 'flowbite-react';

const Pagination = ({totalPages, currentPage, setCurrentPage}) => {

    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className="flex overflow-x-auto  my-4">
            <PaginationFlowbite currentPage={currentPage } totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
};

export default Pagination;
