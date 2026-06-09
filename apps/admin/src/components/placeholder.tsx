export function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tightish">{title}</h1>
      <p className="text-sm text-neutral-500">This section is delivered in a later milestone.</p>
    </div>
  );
}
