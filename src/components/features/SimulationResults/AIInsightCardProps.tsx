import 'react-loading-skeleton/dist/skeleton.css'

import { Send } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import ReactMarkdown from 'react-markdown'

import { useInsight } from '../../../hooks/useInsight'
import { Button } from '../../shared/Button'
import { Divider } from '../../shared/Divider'
import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const {
    insight,
    isLoading,
    error,
    fetchInsight,
    chatHistory,
    isChatLoading,
    chatError,
    sendChatMessage,
  } = useInsight(simulationId)

  const [messageInput, setMessageInput] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!messageInput.trim() || isChatLoading) return

    const text = messageInput
    setMessageInput('')
    await sendChatMessage(text)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isChatLoading])

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && (
        <>
          <Content insight={insight} />

          <Divider orientation="horizontal" spacing={20} className="my-5" />

          <div className="flex flex-col gap-4">
            <h4 className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
              <span>💬</span> Conversar com o Educador Financeiro
            </h4>

            {/* Histórico da Conversa */}
            <div
              ref={chatContainerRef}
              className="scrollbar-thumb-border flex max-h-72 scrollbar-thin scrollbar-track-transparent flex-col gap-3 overflow-y-auto pr-1"
            >
              {chatHistory.length === 0 ? (
                <p className="text-muted-foreground text-xs italic">
                  Tem alguma dúvida sobre seu diagnóstico ou meta? Pergunte
                  abaixo!
                </p>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex max-w-[85%] flex-col rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground self-end font-medium'
                        : 'bg-secondary-button text-foreground border-border self-start border font-medium'
                    }`}
                  >
                    <span
                      className={`mb-0.5 text-[10px] font-bold tracking-wider uppercase ${
                        msg.role === 'user'
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {msg.role === 'user' ? 'Você' : 'Educador Financeiro'}
                    </span>
                    <div className="text-sm">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-1 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-2 list-disc pl-4">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-2 list-decimal pl-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              )}

              {isChatLoading && (
                <div className="bg-secondary-button text-foreground border-border flex max-w-[85%] flex-col self-start rounded-2xl border px-4 py-2.5 text-sm font-medium">
                  <span className="text-muted-foreground mb-1.5 text-[10px] font-bold tracking-wider uppercase">
                    Educador Financeiro
                  </span>
                  <div className="flex items-center gap-1.5 py-1">
                    <span
                      className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}

              {chatError && (
                <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-500">
                  {chatError}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Campo de Envio */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={isChatLoading}
                placeholder="Ex: Como posso atingir minha meta mais rápido?"
                className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-primary/50 flex-1 rounded-xl border px-4 py-3 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                variant="primary"
                type="submit"
                disabled={!messageInput.trim() || isChatLoading}
                icon={Send}
                className="h-[44px] shrink-0 rounded-xl px-4 py-3"
              />
            </form>
          </div>
        </>
      )}
    </div>
  )
}
