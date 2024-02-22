import React from 'react'

const GSTTable = ({ gstRows, deleteGSTTableRows, handleGSTChange, disabled }) => {
    return (
        gstRows && gstRows.length > 0 && gstRows?.map((data, index) => {
            const { gstStateCode, gstNo, billingAddress, serviceName, contactDetails } = data;
            return (
                <tr key={index}>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{gstStateCode}</p>
                            :
                            <input type="text" onChange={(e) => handleGSTChange(index, e)} value={gstStateCode} name="gstStateCode" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{gstNo}</p>
                            :
                            <input type="text" onChange={(e) => handleGSTChange(index, e)} value={gstNo} name="gstNo" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{serviceName}</p>
                            :
                            <input type="text" onChange={(e) => handleGSTChange(index, e)} value={serviceName} name="serviceName" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{contactDetails}</p>
                            :
                            <input type="text" onChange={(e) => handleGSTChange(index, e)} value={contactDetails} name="contactDetails" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            <p className="text-xs p-2.5">{billingAddress}</p>
                            :
                            <input type="text" onChange={(e) => handleGSTChange(index, e)} value={billingAddress} name="billingAddress" disabled={disabled} className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td>
                        {disabled ?
                            ""
                            :
                            <button className="btn btn-danger" onClick={() => (deleteGSTTableRows(index))} disabled={disabled}>x</button>
                        }
                    </td>
                </tr>
            )
        })

    )

}

export default GSTTable