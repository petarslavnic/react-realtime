import { useEffect, useContext } from 'react'
import { ServiceContext } from '../context'

export const useRealTimeConnectionEventListener = (eventName, eventCallback) => {
  const { connection: { bind, unbind } } = useContext(ServiceContext)

  useEffect(
    () => {
      bind(eventName, eventCallback)

      return () => {
        unbind(eventName, eventCallback)
      }
    },
    [bind, unbind, eventName, eventCallback]
  )
}
