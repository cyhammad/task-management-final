import React, { useState } from "react";
import {
    ArrowLeftIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline"

export const Pagination = ({ perPage , totalData, paginate, currentPage} ) => {

    const pageNumber = []
 
    const style =  'bg-primary-100 text-secondary-300'

    for(let i = 1 ; i  <= Math.ceil(totalData / perPage) ; i++){
        pageNumber.push(i)
    }

    const prevPage = () => {
        if(currentPage !== 1){
            paginate(currentPage-1)
        }
    }

    const nextPage = () => {
        if(currentPage !== pageNumber.length){
            paginate(currentPage+1)
        }
    }

    // if()
    
    return(
        <div className="flex justify-between items-center">
            <p className="text-lg">{currentPage * perPage - perPage + 1} - {currentPage * perPage} of {totalData}</p>     
            <nav className="flex flex-row justify-end mr-12 mt-4">
                <ul className="pagination flex flex-row justify-between">
                <div className={` ${currentPage === 1 ? "text-gray-500 cursor-context-menu " : "hover:bg-secondary-300 hover:text-primary-100 prev  cursor-pointer  " } px-1 py-1 ml-3 shadow-md`}
                onClick={prevPage}
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </div>

                <div className={`${currentPage === pageNumber.length ? "text-gray-500 cursor-context-menu " : "hover:bg-secondary-300 hover:text-primary-100 next  cursor-pointer  " } py-1 px-1 ml-3 shadow-md`} onClick={nextPage}>
                    <ArrowRightIcon className="h-6 w-6" />
                </div>
                </ul>
            </nav>
        </div>
    )
}