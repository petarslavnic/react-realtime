import React from 'react'

export const ChannelContext = React.createContext({
  bind: () => {},
  unbind: () => {},
  trigger: () => {},
})
