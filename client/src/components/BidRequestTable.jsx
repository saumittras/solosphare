/* eslint-disable react/prop-types */
import { format } from "date-fns";


const BidRequestTable = ({bid, handleStatusChange}) => {
  const {title, category, price, status, bidDeadline,_id, email} = bid || {}

    return (
        <tr>
          {/* Title */}
        <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
          {title}
        </td>

        {/* email */}
        <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
          {email}
        </td>

          {/*Delivery Deadline*/}
        <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
          {format(new Date(bidDeadline), "P")}
        </td>

        {/* Price */}
        <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
          ${price}
        </td>

        {/* Category */}
        <td className='px-4 py-4 text-sm whitespace-nowrap'>
          <div className='flex items-center gap-x-2'>
            <p  className={`px-3 py-1  text-blue-800 bg-blue-100/60 text-xs  rounded-full ${category==="Digital Marketing"?"bg-red-300":category==="Web Development"?"bg-green-300":category==="Graphics Design"?"bg-blue-300":""}`}>
              {category}
            </p>
          </div>
        </td>

        {/* Status */}
        <td className='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
          <div className='inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100/60 text-yellow-500'>
            <span className='h-1.5 w-1.5 rounded-full bg-green-500'></span>
            <h2 className='text-sm font-normal '>{status}</h2>
          </div>
        </td>
        {/* Action Button */}
        <td className='px-4 py-4 text-sm whitespace-nowrap'>
          <div className='flex items-center gap-x-6'>
            {/* Accept button */}
            <button disabled={status ==='In Progess' || status === 'Completed'} onClick={()=>handleStatusChange(_id, status, "In Progess")} className='disabled:cursor-not-allowed text-gray-500 transition-colors duration-200   hover:text-red-500 focus:outline-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m4.5 12.75 6 6 9-13.5'
                />
              </svg>
              
            </button>


            {/* Reject button */}
            <button disabled={status === "Reject" || status === "Completed"} onClick={()=>handleStatusChange(_id, status, "Reject")} className='disabled:cursor-not-allowed text-gray-500 transition-colors duration-200   hover:text-yellow-500 focus:outline-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636'
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
};

export default BidRequestTable;