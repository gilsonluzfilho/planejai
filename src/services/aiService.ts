import type { ChatMessage, SimulationRecord } from '../data/simulation'
import { parseCurrency } from '../utils/currency'
import { calcMonthlySavings } from '../utils/simulation'

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-3.6-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiRawAPI = async (body: object) => {
  const maxAttempts = 3
  const delays = [1000, 2000]

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return (await response.json()) as GeminiResponse
    }

    const shouldRetry = response.status === 429 || response.status === 503

    if (shouldRetry && attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
      continue
    }

    throw new Error(
      'O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.',
    )
  }

  throw new Error(
    'O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.',
  )
}

const callGeminiAPI = async (prompt: string) => {
  return callGeminiRawAPI({
    contents: [{ parts: [{ text: prompt }] }],
  })
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}

export const getChatResponse = async (
  simulation: SimulationRecord,
  history: ChatMessage[],
  newMessage: string,
): Promise<string> => {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline)

  const systemInstructionText = `Você é um educador financeiro especializado em finanças pessoais.
Você está conversando com um usuário sobre a simulação financeira dele.
Sua missão é dar respostas curtas, claras, objetivas, amigáveis, práticas e baseadas nos dados da simulação fornecida abaixo. Fale sempre em segunda pessoa ("você").

Dados da simulação atual:
- Renda mensal bruta: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas e parcelas mensais: ${debts}
- Valor disponível por mês: ${monthlySavings} reais
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo desejado: ${goalDeadline} meses
- Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded.toFixed(2)} reais
- Saldo após reserva para a meta: ${(monthlySavings - monthlySavingsNeeded).toFixed(2)} reais

Use as informações acima para responder à dúvida do usuário de forma personalizada.`

  const contents = [
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    {
      role: 'user',
      parts: [{ text: newMessage }],
    },
  ]

  const response = await callGeminiRawAPI({
    contents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }],
    },
  })

  return response.candidates[0].content.parts[0].text
}
