import React from 'react'

interface ReponseModalProps {
    isError: boolean
    head: string
    title: string
    isAccurate?: boolean
    body: string
    onClose: () => void
    onConfirm: () => void
    reportData: {
        accuracy: number
        precision: number
        recall: number
        f1: number
    }
}

const ClassificationTrainResponseModal: React.FC<ReponseModalProps> = ({
    isError,
    head,
    title,
    isAccurate,
    body,
    onClose,
    onConfirm,
    reportData,
}) => {
    return (
        <div className='absolute w-[100%] h-full z-[100000] flex justify-center'>
            <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                <div
                    style={{ backdropFilter: 'blur(8px)' }}
                    className='min-w-[720px] max-w-6xl h-auto rounded-xl border-4 border-white shadow-md shadow-white bg-white/25'>
                    <div className={` py-4 ${isError === true ? "bg-red-400/80" : " bg-cyan-400/50"}`}>
                        <h1 className='text-center text-3xl font-bold text-white'>{head}</h1>
                    </div>
                    <div className='p-4 text-center'>
                        <p className={`text-xl font-bold ${isAccurate !== null && isAccurate === false ? "text-red-200" : "text-green-200"}`}>{title}</p>
                        <p className='text-lg font-medium text-white'>{body}</p>
                    </div>
                    {reportData && reportData !== null &&
                        <>
                            <div className='px-16'>
                                <h2 className='text-xl font-bold text-green-200 mb-2'>Report Data</h2>
                                <div className='flex flex-col gap-y-4'>
                                    <div className='flex justify-between'>
                                        <p className='text-lg font-medium text-white'>Accuracy</p>
                                        <p className='text-lg font-medium text-white'>{reportData.accuracy.toFixed(2)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg font-medium text-white'>Precision</p>
                                        <p className='text-lg font-medium text-white'>{reportData.precision.toFixed(2)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg font-medium text-white'>Recall</p>
                                        <p className='text-lg font-medium text-white'>{reportData.recall.toFixed(2)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg font-medium text-white'>F1</p>
                                        <p className='text-lg font-medium text-white'>{reportData.f1.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <div className='flex justify-center gap-x-4 pb-4'>
                        <button
                            onClick={onConfirm}
                            className='bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md'>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ClassificationTrainResponseModal