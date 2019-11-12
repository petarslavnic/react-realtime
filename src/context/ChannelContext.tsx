import React from 'react'

export interface Channel {
  bind(eventName: string, eventCallback: Function): void,
  unbind(eventName: string, eventCallback: Function): void,
  trigger(eventName: string, data: Object): void,
}

export const ChannelContext = React.createContext<Channel>({
  bind: () => {},
  unbind: () => {},
  trigger: () => {},
})
