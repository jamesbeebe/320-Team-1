export default function Input({ label, type = 'text', placeholder, value, onChange, required = false, className = '', name = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all text-black bg-white placeholder-gray-400"
        style={{ color: '#000000', backgroundColor: '#ffffff' }}
      />
    </div>
  );
}

