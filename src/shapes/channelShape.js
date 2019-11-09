import PropTypes from 'prop-types'

export const channelShape = PropTypes.shape({
  bind: PropTypes.func.isRequired,
  unbind: PropTypes.func.isRequired,
  trigger: PropTypes.func,
})
