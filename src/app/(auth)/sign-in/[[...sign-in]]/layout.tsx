export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center fixed inset-0">
      {children}
    </div>
  );
}
