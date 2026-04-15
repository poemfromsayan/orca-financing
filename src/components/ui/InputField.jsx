/**
 * InputField — Campo de texto con label.
 * Basado en el componente "Input Field" del Figma de ORCA.
 *
 * label:       texto sobre el input (neutral-400, 14px)
 * placeholder: texto gris dentro del input (neutral-600)
 * type:        "text" | "email" | "password"
 */

export default function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-sm text-neutral-400 font-normal">
          {label}
        </label>
      )}
      <div className="bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 flex items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full bg-transparent text-body text-neutral-50
            placeholder:text-neutral-600
            outline-none border-none
            font-normal
          "
          {...props}
        />
      </div>
    </div>
  )
}
