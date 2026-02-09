import { getStatusColor, getPerformanceColor, capitalize } from '../../utils/helpers';

export default function Badge({ status, performance, children, className = '' }) {
  let colorClass = '';
  let label = children;

  if (status) {
    colorClass = getStatusColor(status);
    label = label || capitalize(status);
  } else if (performance) {
    colorClass = getPerformanceColor(performance);
    label = label || capitalize(performance);
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  );
}
