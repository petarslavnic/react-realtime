import React, { FC } from 'react'
import { ServiceContext } from '../context'
import Pusher from 'pusher-js'

interface RealTimeProviderProps {
  connector: Pusher;
}

export const RealTimeProvider: FC<RealTimeProviderProps> = ({ connector, children }) => {
  return (
    <ServiceContext.Provider value={{ pusher: connector }}>
      {React.Children.only(children)}
    </ServiceContext.Provider>
  )
}
