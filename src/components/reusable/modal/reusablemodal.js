import React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from './modal';


const ReusableModal = ({ show, onClose, recall, setrecall, title, subtitle, confirmButton, cancelButtom }) => {

    return (
        <>
            {show ? (
                <>
                    <Modal>
                        <ModalHeader close={onClose}>
                            <div className='text-white text-2xl'>
                                Note
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="block">
                                <p className="text-white text-lg">{title}</p>
                                <p className="text-gray-400 text-sm mt-3 ">{subtitle}</p>
                                <div className="p-2">

                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <>
                                <div className='-mt-3'>
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={onClose}
                                    >
                                        {cancelButtom}
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        onClick={() => {
                                            setrecall && setrecall(!recall);
                                            onClose();
                                        }}
                                    >
                                        {confirmButton}
                                    </button>
                                </div>
                            </>
                        </ModalFooter>
                    </Modal>
                </>
            ) : null}

        </>
    )
}

export default ReusableModal