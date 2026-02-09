export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${hover ? 'hover:shadow-lg hover:border-primary transition duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
