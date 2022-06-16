import React from "react";

export const PaginationCount = ({
                                currentPage,
                                totalRecords
                            }) => {
    return (
        <p className="pb-0 mt-3 pl-3">
            Showing {totalRecords > 0 ? (currentPage * 10) - 9 : 0} to&nbsp;
            {(currentPage * 10) > totalRecords ? totalRecords : (currentPage * 10) }
            &nbsp;of {totalRecords} entries
        </p>
    );
};
