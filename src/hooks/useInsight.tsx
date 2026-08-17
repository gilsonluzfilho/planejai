import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '../data/aiPrompt'
import type { ChatMessage, SimulationRecord } from '../data/simulation'
import {
  getChatResponse,
  getInsight,
  type InsightData,
} from '../services/aiService'
import { useSimulationStorage } from './useSimulationStorage'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      return simulation.insight
    }

    return null
  })

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const simulation = getFormData(id)
    return simulation?.chatHistory || []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  // Necessário o uso do useCallback pois temos que colocar essa função
  // Como array de dependências do useEffect
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao gerar o diagnóstico. Tente novamente.',
        )
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  const sendChatMessage = useCallback(
    async (messageText: string) => {
      const simulation = getFormData(id)
      if (!simulation) {
        setChatError('Simulação não encontrada.')
        return
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      }

      const updatedHistoryWithUser = [...chatHistory, userMessage]
      setChatHistory(updatedHistoryWithUser)
      setChatError(null)
      setIsChatLoading(true)

      const simulationWithUser = {
        ...simulation,
        chatHistory: updatedHistoryWithUser,
      } as SimulationRecord
      updateSimulation(id, simulationWithUser)

      try {
        const responseText = await getChatResponse(
          simulation,
          chatHistory,
          messageText,
        )

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseText,
          createdAt: new Date().toISOString(),
        }

        const finalHistory = [...updatedHistoryWithUser, assistantMessage]
        setChatHistory(finalHistory)

        updateSimulation(id, {
          ...simulationWithUser,
          chatHistory: finalHistory,
        } as SimulationRecord)
      } catch (err) {
        setChatError(
          err instanceof Error
            ? err.message
            : 'O educador financeiro não pôde responder no momento. Tente novamente.',
        )
      } finally {
        setIsChatLoading(false)
      }
    },
    [id, chatHistory, getFormData, updateSimulation],
  )

  useEffect(() => {
    // Evita loop infinito de requisições para a API do Gemini
    if (insight || isLoading || error || isRequestPending.current) {
      return
    }

    fetchInsight(id)
  }, [id, insight, isLoading, error, fetchInsight])

  return {
    insight,
    isLoading,
    error,
    fetchInsight,
    chatHistory,
    isChatLoading,
    chatError,
    sendChatMessage,
  }
}
