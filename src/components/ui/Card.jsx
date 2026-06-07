export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`glass-card p-6 animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
