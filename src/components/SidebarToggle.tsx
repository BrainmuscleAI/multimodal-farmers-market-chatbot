interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed left-4 top-4 z-50 p-3 rounded-xl transition-all duration-300
        dark:bg-[#2a2b2e] dark:hover:bg-[#2d2e31] dark:text-white
        dark:shadow-[5px_5px_15px_#151618,-5px_-5px_15px_#3f4044]
        bg-white hover:bg-gray-50 text-gray-800
        shadow-[5px_5px_15px_#d1d5db,-5px_-5px_15px_#ffffff]"
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 transition-transform duration-300"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>
  )
}
