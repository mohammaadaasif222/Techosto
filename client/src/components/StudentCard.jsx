import { Link } from "react-router-dom";

export default function StudentCard({ student }) {
  return (
    <div className="bg-white border flex flex-col sm:flex-row sm:items-center justify-center border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full">
      <img
        className="rounded sm:w-1/4 sm:order-2 p-3"
        src={student.gravatar}
        alt=""
      />

      <div className="p-5 flex flex-col  sm:w-1/3 sm:order-1">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {student.name.toUpperCase()}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 gap-2 flex">
        {student.fieldOfIntrest.map((item, index) => {
            return (
              <span className="bg-slate-50 p-1 rounded-lg text-xs" key={item}>
                {item}
              </span>
            );
          })}
        </p>
        {/* <div className="flex flex-wrap gap-2">
          {student.fieldOfIntrest.map((item, index) => {
            return (
              <span className="bg-slate-200 p-2 rounded text-xs" key={item}>
                {item}
              </span>
            );
          })}
        </div> */}
        <div className="flex flex-wrap gap-2">
          {student.techStacks.map((item, index) => {
            return (
              <span className="bg-slate-200 p-2 rounded text-xs" key={item}>
                {item}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center items-center space-x-2 px-5 py-3">
        <button
          type="button"
          className="text-white bg-[#b32f2f] hover:bg-[#b32f2f]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded w-full sm:w-auto text-xs px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        >
          Delete
        </button>
        <button
          type="button"
          className="text-white bg-[#e3aa37] hover:bg-[#e3aa37]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded w-full sm:w-auto text-xs px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        >
          DM Student
        </button>
        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded w-full sm:w-auto text-xs px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        >
          <Link to={`/student-profile/${student._id}`}>View Profile</Link>
        </button>
      </div>
    </div>
  );
}
