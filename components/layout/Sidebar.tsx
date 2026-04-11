"use client";
import Link from "next/link";
import Image from "next/image";
import {
  SquaresFour,
  CalendarCheck,
  BookOpen,
  Users,
  ChalkboardTeacher,
  GearSix,
  GraduationCap,
} from "@phosphor-icons/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: SquaresFour },
  { href: "/attendance", label: "Attendance", Icon: CalendarCheck },
  { href: "/classes", label: "Classes", Icon: GraduationCap },
  { href: "/courses", label: "Modules", Icon: BookOpen },
  { href: "/students", label: "Students", Icon: Users },
  { href: "/teachers", label: "Teachers", Icon: ChalkboardTeacher },
  { href: "/admin", label: "Admin", Icon: GearSix },
];

export default function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside
      className="fixed left-0 h-full w-64 flex flex-col py-8 px-4 gap-y-1 z-40 border-r border-white/[0.06]"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Nav */}
      <nav className="flex-1 space-y-0.5 pt-2">
        {navItems.map(({ href, label, Icon }) => {
          const active =
            currentPath === href ||
            (href !== "/dashboard" && currentPath.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border
                ${
                  active
                    ? "bg-primary/[0.18] border-primary/[0.28] text-primary-dim"
                    : "border-transparent text-on-surface-variant/45 hover:text-on-surface/70 hover:bg-surface/[0.04]"
                }`}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} weight={active ? "fill" : "regular"} />
                {active && (
                  <span
                    className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 rounded-full bg-primary-dim"
                    style={{ boxShadow: "0 0 8px #a78bfa" }}
                  />
                )}
              </div>
              <span className="font-label font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      {/* <div
        className="mt-auto border border-white/[0.08] rounded-xl px-3 py-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-gradient-to-br from-primary to-secondary">
          <Image
            src="https://i.pravatar.cc/80?u=principal-julian"
            alt="Principal"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate text-on-surface">Dr. Julian Vance</p>
          <p className="text-[10px] text-on-surface-variant/45 uppercase tracking-widest font-label">Admin</p>
        </div>
      </div> */}
    </aside>
  );
}
