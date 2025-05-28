import { HiTable } from "react-icons/hi";
import { HiCalendar } from "react-icons/hi";
import { HiUser, HiMail } from "react-icons/hi";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onTableClick: () => void;
  onCalendarClick: () => void;
  onMeClick?: () => void;
  onMailClick?: () => void;
}

export default function Navbar({ onTableClick, onCalendarClick, onMeClick, onMailClick }: NavbarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="w-full backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* 로고/타이틀 */}
        <div className="flex items-center gap-3 select-none">
          <span className="text-[1.7rem] font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'SF Pro Display, Apple SD Gothic Neo, Roboto, sans-serif' }}>골든래빗 대시보드</span>
        </div>
        {/* 메뉴 */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onTableClick}
            className="flex items-center gap-1 text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            <HiTable className="w-5 h-5" /> 표
          </button>
          <button
            type="button"
            onClick={onCalendarClick}
            className="flex items-center gap-1 text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            <HiCalendar className="w-5 h-5" /> 캘린더
          </button>
          {session ? (
            <>
              <button
                type="button"
                onClick={onMeClick}
                className="flex items-center gap-1 text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-green-600 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                <HiUser className="w-5 h-5" /> 내 정보
              </button>
              <button
                type="button"
                onClick={onMailClick}
                className="flex items-center gap-1 text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-purple-600 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                <HiMail className="w-5 h-5" /> 메일 발송 자동화
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="ml-2 border border-gray-400 text-gray-700 font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-150"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn('google')}
              className="ml-2 border border-blue-600 text-blue-600 font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-150"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 