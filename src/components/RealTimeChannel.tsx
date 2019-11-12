import React, { useState, useContext, useEffect } from 'react'
import { ServiceContext, ChannelContext, Channel } from '../context'

const initialState: Channel = {
  bind: () => {},
  unbind: () => {},
  trigger: () => {},
}

interface RealTimeChannelProps {
  name: string;
  children?: React.ReactNode;
}

export const RealTimeChannel: React.FC<RealTimeChannelProps> = ({ name, children }) => {
  const { subscribe, unsubscribe } = useContext(ServiceContext)
  const [ value, setValue ] = useState(initialState)

  useEffect(
    () => {
      const channel = subscribe(name)

      setValue(channel)

      return () => {
        unsubscribe(name)
      }
    },
    [name, subscribe, unsubscribe]
  )

  return (
    <ChannelContext.Provider value={value}>
      {React.Children.only(children)}
    </ChannelContext.Provider>
  )
}
