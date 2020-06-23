import React, { FC, useState, useContext, useEffect } from 'react'
import { ServiceContext, ChannelContext } from '../context'
import * as PusherTypes from 'pusher-js'

interface RealTimeChannelProps {
  name: string;
}

export const RealTimeChannel: FC<RealTimeChannelProps> = ({ name, children }) => {
  const { pusher } = useContext(ServiceContext)
  const [ channel, setChannel ] = useState<PusherTypes.Channel>()

  useEffect(
    () => {
      const channel = pusher?.subscribe(name)

      setChannel(channel)

      return () => {
        pusher?.unsubscribe(name)
      }
    },
    [name, pusher]
  )

  return (
    <ChannelContext.Provider value={{ channel }}>
      {React.Children.only(children)}
    </ChannelContext.Provider>
  )
}
