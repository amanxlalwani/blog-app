import { ChangeEventHandler } from "react";

export function TextArea({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {name}
      </label>
      <textarea
        id="message"
        value={value}
        rows={4}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
        placeholder={placeholder}
        onChange={onChange}
      ></textarea>
    </>
  );
}
