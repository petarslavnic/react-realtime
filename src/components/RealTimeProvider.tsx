import React, { useMemo } from 'react'
import { ServiceContext, Connector } from '../context'

interface RealTimeProviderProps {
  connector: Connector;
  children?: React.ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ connector, children }) => {
  const value = useMemo(() => {
    return {
      subscribe(channelName: string) {
        return connector.subscribe(channelName)
      },
      unsubscribe(channelName: string) {
        connector.unsubscribe(channelName)
      },
      connection: connector.connection,
    }
  }, [connector])

  return (
    <ServiceContext.Provider value={value}>
      {React.Children.only(children)}
    </ServiceContext.Provider>
  )
}
