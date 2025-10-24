export default function Button({ children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }) {
  const baseClasses = 'font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#EF5350] hover:bg-[#E53935] text-white',
    secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

