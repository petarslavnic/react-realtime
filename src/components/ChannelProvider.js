import React from 'react'
import PropTypes from 'prop-types'
import ChannelContext from '../context/ChannelContext'

class ChannelProvider extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)

    const channel = props.subscribe(this.props.name)

    this.state = {
      bind(...attrs) {
        channel.bind(...attrs)
      },
      unbind(...attrs) {
        channel.unbind(...attrs)
      },
      trigger(...attrs) {
        channel.trigger(...attrs)
      },
    }
  }

  componentWillUnmount() {
    this.props.unsubscribe(this.props.name)
  }

  render() {
    return (
      <ChannelContext.Provider value={this.state}>
        {React.Children.only(this.props.children)}
      </ChannelContext.Provider>
    )
  }
}

export default ChannelProvider
