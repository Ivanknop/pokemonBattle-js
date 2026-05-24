export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full min-h-12 flex items-center justify-center bg-[#1f2a44] text-white border-t-4 border-[#ffcb05]">
      <p className="text-center text-sm">
        created by Iván Knopoff
        <a href="https://linkedin.com/in/ivan-knopoff" className="text-[#ffcb05] ml-2" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://github.com/IvanKnop" className="text-[#ffcb05] ml-2" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github-square"></i>
        </a>
      </p>
    </footer>
  );
}
