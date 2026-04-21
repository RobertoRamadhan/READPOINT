'use client';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  isTextarea?: boolean;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  options,
  isTextarea,
  rows = 3,
}: FormFieldProps) {
  const inputClasses = `w-full px-4 py-2 border-2 rounded-lg transition-all ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400 focus:border-blue-600'
  } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : options ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled} className={inputClasses}>
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}

      {error && <p className="text-sm text-red-600 font-medium">✗ {error}</p>}
    </div>
  );
}
