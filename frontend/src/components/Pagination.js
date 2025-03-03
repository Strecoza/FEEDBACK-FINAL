import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;

    return (
            <div className="flex justify-center gap-4 w-full mt-6 gap-4">
                <button className="btn btn-outline-primary mx-2" 
                disabled= {page === 1} 
                onClick={() => setPage(page - 1)}> Previous</button>
                <span className="text-lg font-medium" >  Page {page} of {totalPages}</span>
                <button 
                className="btn btn-outline-primary mx-2" 
                disabled = {page === totalPages} 
                onClick= {() => setPage(page + 1)}>Next</button>
            </div>
    );
};

export default Pagination;