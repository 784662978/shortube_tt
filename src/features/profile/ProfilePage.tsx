import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { User, ChevronRight, Shield, FileText } from 'lucide-react'

/* ============================================================
   ProfilePage — 个人中心
   头像 + 昵称 | 服务协议 / 隐私协议
   ============================================================ */

export function ProfilePage() {
  const navigate = useNavigate()

  // 模拟 TikTok 用户数据（实际应通过 tt.getUserInfo() 获取）
  const [userInfo] = useState(() => {
    const saved = localStorage.getItem('shortube_user_nickname')
    return {
      nickname: saved || 'TikTok User',
      avatar: '',
    }
  })

  return (
    <AppLayout>
      <div className="pb-2 pt-4">
        {/* ==================== 用户信息卡片 ==================== */}
        <div className="relative rounded-2xl overflow-hidden mb-6
                        bg-gradient-to-br from-brand-pink/20 via-brand-bg to-brand-purple/10
                        border border-white/5 p-5">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />

          {/* 头像 + 昵称 */}
          <div className="flex items-center gap-4 relative z-[1]">
            {/* 头像 */}
            <div className="relative flex-shrink-0">
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.nickname}
                  className="w-[68px] h-[68px] rounded-full object-cover border-2 border-brand-pink/30"
                />
              ) : (
                <div className="w-[68px] h-[68px] rounded-full bg-gradient-brand flex items-center justify-center border-2 border-brand-pink/30">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* 昵称 */}
            <h2 className="text-lg font-bold font-sora text-brand-text truncate">
              {userInfo.nickname}
            </h2>
          </div>
        </div>

        {/* ==================== 协议区域 ==================== */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider px-1 mb-3">
            Legal & Agreements
          </h3>

          {/* 服务协议 */}
          <ProfileAction
            icon={<FileText className="w-[18px] h-[18px]" />}
            label="Terms of Service"
            description="Read our terms and conditions"
            onClick={() => navigate('/terms')}
            iconBg="bg-brand-pink/10"
            iconColor="text-brand-pink"
          />

          {/* 隐私协议 */}
          <ProfileAction
            icon={<Shield className="w-[18px] h-[18px]" />}
            label="Privacy Policy"
            description="How we handle your data"
            onClick={() => navigate('/privacy')}
            iconBg="bg-brand-purple/10"
            iconColor="text-brand-purple"
          />
        </div>

        {/* ==================== 底部信息 ==================== */}
        <div className="mt-8 pb-2 text-center">
          <p className="text-[11px] text-brand-muted/50">
            Shortube v1.0.0 · Made with ❤️
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

/* ============================================================
   可点击操作行
   ============================================================ */
function ProfileAction({
  icon,
  label,
  description,
  onClick,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  iconBg: string
  iconColor: string
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 rounded-xl
                 bg-brand-surface/30 hover:bg-brand-surface
                 border border-white/5 hover:border-white/10
                 transition-all duration-200 group text-left"
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-text group-hover:text-white transition-colors">
          {label}
        </p>
        <p className="text-[11px] text-brand-muted truncate">
          {description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-pink transition-all group-hover:translate-x-0.5 flex-shrink-0" />
    </button>
  )
}
