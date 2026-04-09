interface Props { teacherName: string; courseName: string; onSubmitAnother: () => void }

export default function SuccessScreen({ teacherName, courseName, onSubmitAnother }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <div
        className="rounded-3xl p-10 flex flex-col items-center border border-white/[0.08]"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div
          className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6"
          style={{ boxShadow: '0 0 32px rgba(6,182,212,0.3)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Session Submitted</h1>
        <p className="text-sm font-label text-on-surface-variant/70 max-w-xs mb-1">
          Attendance for <span className="text-on-surface font-semibold">{courseName}</span> has been recorded.
        </p>
        <p className="text-xs font-label text-on-surface-variant/50 mb-8">Submitted by {teacherName}</p>
        <button
          onClick={onSubmitAnother}
          className="px-8 py-3 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
        >
          Submit Another Session
        </button>
      </div>
    </div>
  )
}
