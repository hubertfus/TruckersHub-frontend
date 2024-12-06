import React from 'react';

interface TextInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
}) => {
    return (
        <div className="form-control flex-1">
            <label className="label">
                <span className="label-text">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={`input input-bordered ${error ? 'input-error' : ''}`}
                value={value}
                onChange={onChange}
            />
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    );
};

export default TextInput;
