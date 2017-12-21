import PropTypes from 'prop-types'

export const connectorShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
})

export const channelShape = PropTypes.shape({
  bind: PropTypes.func.isRequired,
  unbind: PropTypes.func.isRequired,
  trigger: PropTypes.func,
})
