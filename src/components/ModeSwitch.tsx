interface ModeOption<T extends string> {
  value: T;
  label: string;
}

interface ModeSwitchProps<T extends string> {
  legend: string;
  name: string;
  options: readonly ModeOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Native radio group used to switch between calculation modes. */
export function ModeSwitch<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: ModeSwitchProps<T>) {
  return (
    <fieldset className="mode-switch">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label className="mode-switch__option" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
