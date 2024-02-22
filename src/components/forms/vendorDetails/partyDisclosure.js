import React from 'react'

const PartyDisclosure = ({ partyRows, deletePartyTableRows, handlePartyChange, disabled }) => {
    return (
        partyRows && partyRows.length > 0 && partyRows?.map((data, index) => {
            const { vendorPartyName, vendorRole, vendorInterestedPartyName, detailsOfInterest } = data;
            return (
                <tr key={index}>
                    <td className="px-3">
                        {disabled ?
                            <p className="py-1">{index + 1}</p> :
                            index + 1
                        }
                    </td>
                    <td className="px-3">
                        {disabled ?
                            <p className="py-1">{vendorPartyName}</p> :
                            <input type="text" onChange={(e) => handlePartyChange(index, e)} disabled={disabled} value={vendorPartyName} name="vendorPartyName" className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td className="px-3">
                        {disabled ?
                            <p className="py-1">{vendorRole}</p> :
                            <input type="text" onChange={(e) => handlePartyChange(index, e)} disabled={disabled} value={vendorRole} name="vendorRole" className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td className="px-3">
                        {disabled ?
                            <p className="py-1">{vendorInterestedPartyName}</p> :
                            <input type="text" onChange={(e) => handlePartyChange(index, e)} disabled={disabled} value={vendorInterestedPartyName} name="vendorInterestedPartyName" className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td className="px-3">
                        {disabled ?
                            <p className="py-1">{detailsOfInterest}</p> :
                            <input type="text" onChange={(e) => handlePartyChange(index, e)} disabled={disabled} value={detailsOfInterest} name="detailsOfInterest" className="glass shadow-none border-none text-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        }
                    </td>
                    <td className="px-3">
                        {disabled ?
                            "" :
                            <button className="btn btn-danger" type='button' onClick={() => (deletePartyTableRows(index))} disabled={disabled}>x</button>
                        }
                    </td>
                </tr>
            )
        })
    )
}

export default PartyDisclosure