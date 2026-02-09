export default function ProgressBar({ value, max = 100, className = '' }) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
