import { useMemo } from 'react'

import {
  type SimulationFormData,
  type SimulationRecord,
} from '../data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

const parseStorage = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    const savedData = parseStorage()

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getFormData = (id: string) => {
    const savedData = parseStorage()
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = parseStorage()
    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const listSimulations = () => parseStorage()

  const deleteSimulation = (id: string) => {
    const savedData = parseStorage()
    const updated = savedData.filter((record) => record.id !== id)

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return useMemo(
    () => ({
      saveFormData,
      getFormData,
      updateSimulation,
      listSimulations,
      deleteSimulation,
    }),
    [],
  )
}
