import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ServiceContext, ChannelContext } from '../context'

const initialState = {
  bind: () => {},
  unbind: () => {},
  trigger: () => {},
}

export const RealTimeChannel = ({ name, children }) => {
  const { subscribe, unsubscribe } = useContext(ServiceContext)
  const [ value, setValue ] = useState(initialState)

  useEffect(
    () => {
      const channel = subscribe(name)

      setValue({
        bind(...attrs) {
          channel.bind(...attrs)
        },
        unbind(...attrs) {
          channel.unbind(...attrs)
        },
        trigger(...attrs) {
          channel.trigger(...attrs)
        },
      })

      return () => {
        unsubscribe(name)
      }
    },
    [name, subscribe, unsubscribe]
  )

  return (
    <ChannelContext.Provider value={value}>
      {React.Children.only(children)}
    </ChannelContext.Provider>
  )
}

RealTimeChannel.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.any,
}
