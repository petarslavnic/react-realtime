import React from 'react'
import PropTypes from 'prop-types'
import { connectorShape } from '../shapes'
import ServiceContext from '../context/ServiceContext'

class RealTimeProvider extends React.Component {
  static propTypes = {
    connector: connectorShape.isRequired,
    children: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { ...this.props.connector }
  }

  render() {
    return (
      <ServiceContext.Provider value={this.state}>
        {React.Children.only(this.props.children)}
      </ServiceContext.Provider>
    )
  }
}

export default RealTimeProvider
