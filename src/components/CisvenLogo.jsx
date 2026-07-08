export function CisvenLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arco superior grueso - azul oscuro */}
      <path
        d="M15 50 A35 35 0 1 1 85 50"
        stroke="#1a2f4a"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arco inferior izquierdo - teal, con gap */}
      <path
        d="M15 50 A35 35 0 0 0 47 83"
        stroke="#2eaa8a"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arco inferior derecho - teal, con gap */}
      <path
        d="M53 83 A35 35 0 0 0 85 50"
        stroke="#2eaa8a"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ojo central */}
      <circle cx="50" cy="50" r="9" fill="#1a2f4a" />
      <circle cx="53" cy="47" r="3" fill="white" />
    </svg>
  )
}

export default CisvenLogo
