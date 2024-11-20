export default function Button({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <>
      <button
        className={
          "w-full rounded-md bg-black text-white px-2 py-3 mt-4 font-semibold "
        }
        onClick={() => {
          onClick();
        }}
      >
        {title}
      </button>
    </>
  );
}
