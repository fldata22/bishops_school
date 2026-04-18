import Image from "next/image";
import PrincipalShell from "@/components/layout/PrincipalShell";
import { api } from "@/lib/api";
import { teacherAvatar } from "@/lib/teacher-avatars";

function rateColor(rate: number) {
  if (rate >= 80) return { text: "text-secondary-dim", gradient: "from-secondary to-secondary-dim" };
  if (rate >= 65) return { text: "text-primary-dim", gradient: "from-primary to-primary-dim" };
  return { text: "text-tertiary-dim", gradient: "from-tertiary to-tertiary-dim" };
}

export default async function DashboardPage() {
  const dashboard = await api.getDashboard();
  const modules = await api.listModules();
  const progresses = await Promise.all(
    modules.map((m) => api.getModuleProgress(m.id))
  );
  const totalChapters = progresses.reduce(
    (s, p) => s + p.module.total_chapters,
    0
  );
  const totalTaught = progresses.reduce((s, p) => s + p.chapters_taught, 0);
  const overallModuleCompletion =
    totalChapters > 0 ? Math.round((totalTaught / totalChapters) * 100) : 0;

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">
            Overview
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface">
            Dashboard
          </h1>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall class attendance */}
          <div
            className="col-span-2 rounded-2xl p-6 border border-primary/20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))' }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'rgba(124,58,237,0.25)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-dim font-label mb-3">
              Overall Class Attendance
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black font-headline text-on-surface">
                {dashboard.overall_class_attendance}
              </span>
              <span className="text-2xl font-bold text-on-surface-variant/60 font-headline">%</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 font-label mt-2">Across all classes</p>
          </div>

          {/* Overall module completion */}
          <div
            className="col-span-2 rounded-2xl p-6 border border-secondary/20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.06))' }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'rgba(6,182,212,0.2)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-dim font-label mb-3">
              Overall Module Completion
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black font-headline text-on-surface">
                {overallModuleCompletion}
              </span>
              <span className="text-2xl font-bold text-on-surface-variant/60 font-headline">%</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 font-label mt-2">% of module taught</p>
          </div>

          {/* Total students */}
          <div
            className="rounded-2xl p-6 border border-white/[0.07] relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl"
              style={{ background: 'rgba(6,182,212,0.12)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-3">
              Students Enrolled
            </p>
            <span className="text-5xl font-black font-headline text-secondary-dim">
              {dashboard.students_enrolled}
            </span>
          </div>

          {/* Total teachers */}
          <div
            className="rounded-2xl p-6 border border-white/[0.07] relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl"
              style={{ background: 'rgba(244,63,94,0.1)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-3">
              Teachers
            </p>
            <span className="text-5xl font-black font-headline text-tertiary-dim">
              {dashboard.teacher_count}
            </span>
          </div>
        </div>

        {/* Teacher performance */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-headline text-on-surface">
            Teachers Targets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboard.teacher_targets.map((teacher) => {
              const { text, gradient } = rateColor(teacher.rate);
              return (
                <div
                  key={teacher.id}
                  className="p-4 rounded-xl border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                      <Image
                        src={teacherAvatar(teacher)}
                        alt={teacher.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {teacher.name}
                      </p>
                    </div>
                    <span className={`text-xl font-black font-headline ${text}`}>
                      {teacher.rate}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                      style={{ width: `${teacher.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PrincipalShell>
  );
}
