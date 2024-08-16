import LeftLayout from '../components/ui/online-lobby/LeftLayout'

const OnlineLobby = () => {

    return (
        <div className="w-full flex-grow flex flex-col max-h-screen p-24 bg-gradient-to-r from-cyan-400 to-blue-400">
            <div className="grid grid-cols-10 flex-grow border-t-2 border-t-cyan-400 rounded-xl w-full h-full 
      bg-white/80 shadow-xl shadow-slate-200">
                <div className='col-span-2 h-full flex justify-center bg-white/40'>
                    <LeftLayout />
                </div>
                <div className='col-span-8 h-full'>

                </div>
            </div>
        </div>
    )
}

export default OnlineLobby