import React from 'react'
import ChannelProvider from './ChannelProvider'
import ServiceContext from '../context/ServiceContext'

const RealTimeChannel = (props) => (
  <ServiceContext.Consumer>
    {({ subscribe, unsubscribe }) => (
      <ChannelProvider
        {...props}
        subscribe={subscribe}
        unsubscribe={unsubscribe}
      />
    )}
  </ServiceContext.Consumer>
)

export default RealTimeChannel
