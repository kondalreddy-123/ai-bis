export default function SectionIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="card mb-6 p-5 md:p-6">
      <div className="section-title">{title}</div>
      <p className="body-lg mt-2 max-w-4xl text-slate-600">{text}</p>
    </div>
  );
}
