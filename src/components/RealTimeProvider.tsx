import React, { FC } from 'react'
import { ServiceContext } from '../context'
import Pusher from 'pusher-js'

interface RealTimeProviderProps {
  instance: Pusher;
}

export const RealTimeProvider: FC<RealTimeProviderProps> = ({ instance, children }) => {
  return (
    <ServiceContext.Provider value={{ pusher: instance }}>
      {React.Children.only(children)}
    </ServiceContext.Provider>
  )
}
