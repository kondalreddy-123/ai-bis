export default function TrustNotice() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
      <div className="font-extrabold">DEMO DATA — NOT OFFICIAL BIS DATA</div>
      <p className="mt-1 text-sm leading-6">
        The included street-light records are synthetic and exist only to demonstrate the workflow.
        Do not use their standard numbers, titles, certificates, prices or ratings for procurement.
      </p>
    </div>
  );
}
