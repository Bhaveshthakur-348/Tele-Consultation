// One component per file — Avatar

const MALE_COLOR   = '#0062FF'
const FEMALE_COLOR = '#18DCAB'

export default function Avatar({ age = '', size = 30 }) {
  const isFemale = typeof age === 'string' && age.includes('F')
  const bg = isFemale ? FEMALE_COLOR : MALE_COLOR

  return (
    <div
      className="rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size, background: bg }}
    >
      <svg viewBox="0 0 28 28" width={size} height={size}>
        <circle cx="14" cy="8" r="5" fill="white" />
        <path d="M3 28c0-6 5-10 11-10s11 4 11 10" fill="white" />
      </svg>
    </div>
  )
}
