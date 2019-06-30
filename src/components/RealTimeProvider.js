import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connectorShape } from '../shapes'
import { ServiceContext } from '../context'

const RealTimeProvider = ({ connector, children }) => {
  const value = useMemo(() => {
    return {
      subscribe(...attrs) {
        return connector.subscribe(...attrs)
      },
      unsubscribe(...attrs) {
        connector.unsubscribe(...attrs)
      },
    }
  }, [connector])

  return (
    <ServiceContext.Provider value={value}>
      {React.Children.only(children)}
    </ServiceContext.Provider>
  )
}

RealTimeProvider.propTypes = {
  connector: connectorShape.isRequired,
  children: PropTypes.element.isRequired,
}

RealTimeProvider.displayName = `RealTimeProvider`

export default RealTimeProvider
