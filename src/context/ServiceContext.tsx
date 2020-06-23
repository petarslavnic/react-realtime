import React from 'react'
import Pusher from 'pusher-js'

export interface Connector {
  pusher?: Pusher;
}

export const ServiceContext = React.createContext<Connector>({})
