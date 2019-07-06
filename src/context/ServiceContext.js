import React from 'react'

export const ServiceContext = React.createContext({
  subscribe: () => {},
  unsubscribe: () => {},
})
