import React from 'react'
import * as PusherTypes from 'pusher-js'

export interface Channel {
  channel?: PusherTypes.Channel;
}

export const ChannelContext = React.createContext<Channel>({})
