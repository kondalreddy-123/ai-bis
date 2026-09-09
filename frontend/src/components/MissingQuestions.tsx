type Props = { items: {field: string; options: string[]}[]; onSelect?: (field: string, value: string) => void };

export default function MissingQuestions({ items, onSelect }: Props) {
  if (!items?.length) return null;
  return (
    <div className="card border-amber-300 p-5">
      <h2 className="text-lg font-extrabold text-amber-900">A few details are missing</h2>
      <p className="mt-1 text-slate-600">Choose an option so the recommendation can be more specific. “Not sure” is always okay.</p>
      <div className="mt-4 space-y-5">
        {items.map(item => (
          <div key={item.field}>
            <div className="font-bold">{item.field}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.options.map(option => (
                <button key={option} onClick={() => onSelect?.(item.field, option)}
                  className="focus-ring rounded-xl border bg-white px-4 py-2 text-sm font-bold hover:border-blue-500 hover:bg-blue-50">
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
