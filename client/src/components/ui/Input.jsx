const Input = ({ name, type, label, placeholder, value, onChange, icon, rightIcon, error, ...rest }) => {
  return (
    <div>
      {label && <label className="block text-sm font-semibold mb-2">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        
        <input
          name={name}               
          type={type}
          value={value}          
          onChange={onChange}     
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-all duration-200 ${
            error ? 'border-red-500' : 'border-primary'
          }`}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 mt-1 text-red-500 text-sm">
          <FiAlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;