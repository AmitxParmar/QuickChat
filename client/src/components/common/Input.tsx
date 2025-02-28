import React from "react";

interface InputProps {
  name: string;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  label?: boolean;
}

function Input({ name, state, setState, label = false }: InputProps) {
  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label htmlFor={name} className="text-teal-light text-lg px-1">
          {name}
        </label>
      )}
      <div>
        <input
          type="text"
          name={name}
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="bg-input-background text-start focus:outline-none text-white rounded-lg px-5 py-4 w-full"
        />
      </div>
    </div>
  );
}

export default Input;
