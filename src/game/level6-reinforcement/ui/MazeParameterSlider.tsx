import React from 'react'

interface Props {
  label: string
  value: number
  minValue: number
  maxValue: number
  step: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  discription?: string
}

const MazeParameterSlider: React.FC<Props> = ({
  label,
  value,
  minValue,
  maxValue,
  step,
  onChange,
  discription
}) => {
  return (
    <div className='my-5'>
      <div className="w-full grid grid-cols-6 px-2 text-white">
        <div className='col-span-2'>
          <span className='text-xl'>{label}:</span>
          <span className='text-xl font-medium ml-4 text-white'>{value}</span>
        </div>
        <div className='col-span-4'>
          <input
            className="w-full accent-cyan-400 "
            type="range"
            id="trainSlider"
            min={minValue.toString()}
            max={maxValue.toString()}
            step={step}
            value={value}
            onChange={onChange}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <p className='text-white'>{discription}</p>
    </div>
  )
}

export default MazeParameterSlider