export function TypingRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
      }}
    >
      <div style={{ display: 'flex', gap: 5 }}>
        {[0, 1, 2].map(index => (
          <div
            key={index}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-teal)',
              animation: 'typingPulse 1.2s ease-in-out infinite',
              animationDelay: `${index * 0.18}s`,
            }}
          />
        ))}
      </div>

      <span
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-mid)',
          fontStyle: 'italic',
        }}
      >
        Agent is thinking...
      </span>

      <style>{`
        @keyframes typingPulse {
          0%, 80%, 100% { opacity: 0.28; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
