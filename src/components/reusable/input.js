import React from "react";

const Input = ({ label, onChange, inputName, ...props}) => {
    return (
        <>
            <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-300"
            >
                {label}
            </label>
            <input
                type="text"
                name={inputName}
                onChange={onChange}
                className="glass mb-2 shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                autoComplete="none"
                {...props}
            />
        </>
    );
};

// const Inputs = ({ labelList, onChange, inputNameList }, ...props) => {
//     return (
//         <>
//             {labelList && labelList.length > 0 ? labelList.map((label) => (
//                 <label
//                     htmlFor="name"
//                     className="block mb-2 text-sm font-medium text-gray-300"
//                 >
//                     {label}
//                 </label>
//             )) : ""}
//             <input
//                 type="text"
//                 name={inputName}
//                 onChange={onChange}
//                 className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 autoComplete="none"
//                 {...props}
//             />
//         </>
//     );
// };

export { Input };