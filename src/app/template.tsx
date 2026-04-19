export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-transition flex min-h-0 min-w-0 flex-1 flex-col">
      {children}
    </div>
  );
}
