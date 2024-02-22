function Modal(props) {
    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-2xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#0a2644] outline-none focus:outline-none">
                        {props.children}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}

function ModalBody(props) {
    return (
        <div className="relative p-3 flex-auto">
            <div className="text-slate-500 text-sm leading-relaxed">
                {props.children}
            </div>
        </div>
    );
}

function ModalFooter(props) {
    return (
        <div className="flex items-center justify-end p-3 rounded-b">
            {props.children}
        </div>
    );
}

function ModalHeader(props) {
    return (
        <div className="flex items-start align-middle justify-between p-3 rounded-t">
            <p className="text-xl text-gray-400">
                {props.children}
            </p>
            <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={props.close}
            >
                <span className="text-gray-400 h-6 w-6 text-2xl block">
                    ×
                </span>
            </button>
        </div>
    );
}

export {
    Modal, ModalBody, ModalFooter, ModalHeader
};