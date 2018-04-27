import React from 'react'

const ChannelContext = React.createContext({
  bind: () => {},
  unbind: () => {},
  trigger: () => {},
})

export default ChannelContext
