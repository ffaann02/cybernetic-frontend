import React from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface DropdownObject {
    name: string;
    code: string;
}

interface CustomDropdownProps {
    label: string;
    placeholder: string;
    value: string;
    options: DropdownObject[];
    onChange: (e: DropdownChangeEvent) => void;
}

const SettingDropdonwn: React.FC<CustomDropdownProps> = ({ placeholder, label, value, options, onChange }) => {
    return (
        <>
            <div className='col-span-2 my-auto py-4'>
                <h3 className='text-2xl'>{label}</h3>
            </div>
            <div className="col-span-3 my-auto text-white">
                <Dropdown
                    placeholder={placeholder}
                    value={value}
                    defaultValue={value}
                    onChange={onChange}
                    options={options}
                    optionLabel="name"
                    className="w-2/3 h-12 items-center bg-black/10 text-white setting-dropdown" />
            </div>
        </>
    );
};

export default SettingDropdonwn;
