import React from 'react'

const ServiceContext = React.createContext({
  subscribe: () => {},
  unsubscribe: () => {},
})

export default ServiceContext
