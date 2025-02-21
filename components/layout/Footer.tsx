export default function Footer() {
  return (
    <footer className="my-12">
      <div className="container max-w-5xl mx-auto flex justify-between gap-4 items-center">
        <div>Invoice App &copy; {new Date().getFullYear()}</div>
        <div>All rights reversed. I mean reserved.</div>
      </div>
    </footer>
  );
}
