import React from 'react'
import { Channel } from './ChannelContext'

export interface Connector {
  subscribe(channelName: string): Channel;
  unsubscribe(channelName: string): void;
  connection: {
    bind(eventName: string, eventCallback: Function): void,
    unbind(eventName: string, eventCallback: Function): void,
  };
}

export const ServiceContext = React.createContext<Connector>({
  subscribe() {
    return {
      bind: () => {},
      unbind: () => {},
      trigger: () => {},
    }
  },
  unsubscribe: () => {},
  connection: {
    bind: () => {},
    unbind: () => {},
  },
})
