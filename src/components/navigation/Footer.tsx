export const Footer = () => {
  return (
    <footer className="right-0 bottom-0 left-0 z-50 fixed bg-gradient-to-bl from-gray-900 to-gray-950 h-16">
      <div className="flex justify-between items-center mx-auto px-4 h-full container">
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Super Power Notes. All Rights Reserved.
        </div>
        <div className="text-gray-400 text-sm">by Bozzetto Mirko</div>
      </div>
    </footer>
  );
};
