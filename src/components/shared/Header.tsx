import { Clock, Moon, Sun, TrendingUp, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '../../hooks/useTheme'
import { Button } from './Button'
import { Divider } from './Divider'

export function Header() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-(--border) px-3 py-2 sm:px-6 sm:py-3">
      <nav className="flex w-full items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9">
            <Wallet
              size={18}
              className="text-primary-foreground sm:h-5 sm:w-5"
            />
          </div>
          <span className="hidden text-lg sm:inline">
            <span className="text-muted-foreground font-medium">Planej</span>
            <span className="font-extrabold">.ai</span>
          </span>
        </div>

        {/* Actions Buttons */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-1">
          <Button
            variant="secondary"
            icon={TrendingUp}
            onClick={() => void navigate('/')}
            className="min-w-0 shrink-[0.5] gap-1 rounded-full px-2 py-2 text-[11px] leading-none sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
          >
            <span className="whitespace-nowrap">Nova Simulação</span>
          </Button>
          <Button
            variant="ghost"
            icon={Clock}
            onClick={() => void navigate('/historico')}
            className="min-w-0 shrink-[0.5] gap-1 rounded-full px-2 py-2 text-[11px] leading-none max-[364px]:px-1 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
          >
            <span className="whitespace-nowrap">Histórico</span>
          </Button>
          <Divider
            orientation="vertical"
            spacing={4}
            className="block shrink-0"
          />
          <Button
            aria-label={`Mudar para o tema ${theme === 'light' ? 'escuro' : 'claro'}`}
            variant="ghost"
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
            className="shrink-0 max-[364px]:px-1"
          />
        </div>
      </nav>
    </header>
  )
}
