export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-accent-500 to-blue-500 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">🥩 RoastBeef.ai</p>
          <p className="text-sm opacity-90">
            The fun way to roast websites with AI
          </p>
          <p className="text-xs mt-4 opacity-75">
            © {new Date().getFullYear()} RoastBeef.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
