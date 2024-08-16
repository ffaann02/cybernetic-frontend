import React from 'react'

interface ReponseModalProps {
    isError: boolean
    head: string
    title: string
    isAccurate?: boolean
    body: string
    onClose: () => void
    onConfirm: () => void
}

const ReponseModal: React.FC<ReponseModalProps> = ({
    isError,
    head,
    title,
    isAccurate,
    body,
    onClose,
    onConfirm
}) => {
    return (
        <div className='absolute w-[100%] h-full z-[100000] flex justify-center'>
            <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                <div
                    style={{ backdropFilter: 'blur(8px)' }}
                    className='min-w-[960px] max-w-6xl h-[30vh] rounded-xl border-4 border-white shadow-md shadow-white bg-white/25'>
                    <div className={` py-4 ${isError === true ? "bg-red-400/80" : " bg-cyan-400/50"}`}>
                        <h1 className='text-center text-3xl font-bold text-white'>{head}</h1>
                    </div>
                    <div className='p-4 text-center'>
                        <p className={`text-xl font-bold ${isAccurate !== null && isAccurate === false ? "text-red-200" : "text-green-200"}`}>{title}</p>
                        <p className='text-lg font-medium text-white'>{body}</p>
                    </div>
                    <div className='flex justify-center gap-x-4'>
                        <button
                            onClick={onClose}
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'>
                            Close
                        </button>
                        <button
                            onClick={onConfirm}
                            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md'>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ReponseModal