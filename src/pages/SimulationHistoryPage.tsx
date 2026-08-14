import { Goal, SquareArrowUpRight, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/shared/Button'
import { Divider } from '../components/shared/Divider'
import { PageHero } from '../components/shared/PageHero'
import { type SimulationRecord } from '../data/simulation'
import { useSimulationStorage } from '../hooks/useSimulationStorage'
import { parseCurrency } from '../utils/currency'

function formatCurrency(value: string) {
  const amount = parseCurrency(value)
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return '—'
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('pt-BR')
}

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { listSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] =
    useState<SimulationRecord[]>(listSimulations)

  const sortedSimulations = useMemo(
    () =>
      [...simulations].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
    [simulations],
  )

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((item) => item.id !== id))
  }

  const handleViewDetails = (id: string) => {
    void navigate(`/resultado/${id}`)
  }

  return (
    <main className="mx-auto max-w-6xl px-2 py-10 sm:px-6 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      <section className="space-y-4">
        {sortedSimulations.length === 0 && (
          <div className="border-border bg-card text-muted-foreground rounded-3xl border p-8 text-center">
            Nenhuma simulação encontrada. Crie uma nova simulação para ver seu
            histórico aqui.
          </div>
        )}

        {sortedSimulations.length > 0 && (
          <div className="space-y-6">
            {sortedSimulations.map((simulation) => {
              const monthlyGoal =
                Number(simulation.goalDeadline) > 0
                  ? parseCurrency(simulation.goalAmount) /
                    Number(simulation.goalDeadline)
                  : 0

              return (
                <article
                  key={simulation.id}
                  className="bg-card border-border/10 hover:border-border/20 mb-6 rounded-lg p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.15)] transition-all hover:shadow-[4px_4px_30px_0px_rgba(0,0,0,0.15)] min-[960px]:p-5"
                >
                  <div className="flex w-full flex-col gap-4 min-[960px]:min-w-0 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-8">
                    <div className="flex min-w-0 flex-1 flex-col gap-4 min-[960px]:min-w-0 min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between min-[960px]:gap-8 lg:gap-12">
                      <div className="flex min-w-0 flex-col gap-3 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-4">
                        <div className="bg-primary-foreground text-primary flex h-12 w-12 flex-none items-center justify-center rounded-2xl shadow-sm sm:h-12 sm:w-12">
                          <Goal size={25} className="text-primary" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-foreground text-base font-semibold sm:text-base">
                            {simulation.goalName}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {formatDate(simulation.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 space-y-3 min-[960px]:flex min-[960px]:min-w-0 min-[960px]:justify-between min-[960px]:gap-8 min-[960px]:space-y-0 lg:gap-12">
                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            Custo da meta
                          </p>
                          <p className="text-foreground mt-1 text-sm font-semibold sm:text-base">
                            R$ {formatCurrency(simulation.goalAmount)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            Prazo
                          </p>
                          <p className="text-foreground mt-1 text-sm font-semibold sm:text-base">
                            {simulation.goalDeadline} meses
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            Economia mensal
                          </p>
                          <p className="text-foreground mt-1 text-sm font-semibold sm:text-base">
                            R${' '}
                            {monthlyGoal.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-border ju mt-1 flex min-w-0 items-center min-[960px]:mt-0 min-[960px]:min-w-0 min-[960px]:items-center min-[960px]:gap-4 min-[960px]:border-t-0 min-[960px]:pt-0">
                      <div className="flex min-w-0 items-center gap-3 min-[960px]:gap-4">
                        <Divider
                          orientation="vertical"
                          className="hidden h-8 min-[960px]:block"
                        />

                        <button
                          aria-label="Excluir simulação"
                          onClick={() => handleDelete(simulation.id)}
                          className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex min-w-0 items-center gap-3 min-[960px]:gap-4">
                        <Divider
                          orientation="vertical"
                          className="block h-8 min-[960px]:hidden"
                        />

                        <Button
                          variant="secondary"
                          className="shrink-0 rounded-full !px-3 !py-1.5 text-sm leading-none min-[960px]:!px-4"
                          icon={SquareArrowUpRight}
                          onClick={() => handleViewDetails(simulation.id)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
