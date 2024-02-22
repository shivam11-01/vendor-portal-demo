import React from 'react'

const GeneralQuestionsTable = ({ generalObj, deleteGeneralQuestionsRows, handleGeneralTableChange, disabled }) => {
    return (
        generalObj && generalObj.length > 0 && generalObj?.map((data, index) => {
            const { companyName, refName, refNumber } = data;
            return (
                <tr key={index}>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{companyName}</p>
                            :
                            <input type="text" onChange={(e) => handleGeneralTableChange(index, e)} value={companyName} name="companyName" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{refName}</p>
                            :
                            <input type="text" onChange={(e) => handleGeneralTableChange(index, e)} value={refName} name="refName" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{refNumber}</p>
                            :
                            <input type="text" onChange={(e) => handleGeneralTableChange(index, e)} value={refNumber} name="refNumber" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            ""
                            :
                            <button className="btn btn-danger" type="button" onClick={() => (deleteGeneralQuestionsRows(index))} disabled={disabled}>x</button>
                        }
                    </td>
                </tr>
            )
        })

    )

}

export default GeneralQuestionsTable