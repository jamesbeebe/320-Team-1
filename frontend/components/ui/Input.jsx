export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  className = '', 
  name = '',
  disabled = false,
  error = '',
  helperText = '',
  min,
  max
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-black placeholder-gray-400 ${
          error 
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
            : 'border-gray-400 focus:ring-red-400 focus:border-red-400'
        } ${
          disabled 
            ? 'bg-gray-50 cursor-not-allowed opacity-70 border-gray-300' 
            : 'bg-white'
        }`}
        style={{ color: '#000000' }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

