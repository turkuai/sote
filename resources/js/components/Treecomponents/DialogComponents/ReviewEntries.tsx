function ReviewEntries({ data }) {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-2! text-sm font-semibold text-gray-500">Selected category</h3>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3!">
          {data.category.map((c: string, i: number) => (
            <span key={i} className="inline-flex items-center gap-2">
              {i > 0 && <span>→</span>}

              <p className={i == data.category.length - 1 && 'font-semibold text-red-700'}>{c}</p>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2! text-sm font-semibold text-gray-500">Problem description</h3>

        <p className="min-h-24 rounded-lg border border-gray-200 bg-white p-3! text-sm leading-6 whitespace-pre-wrap break-words text-gray-800">
          {data.description}
        </p>
      </section>
    </div>
  );
}

export default ReviewEntries;
