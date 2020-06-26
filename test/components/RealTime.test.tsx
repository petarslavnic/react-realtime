import React, { useCallback } from 'react'
import { mount } from 'enzyme'
import {
  RealTimeProvider,
  RealTimeChannel,
  useRealTimeEventListener,
  useRealTimeEventTrigger,
  useRealTimeConnectionEventListener,
} from '../../src'

describe('<RealTimeProvider />', () => {
  let connector, wrapper, unsubscribe, bind, unbind, trigger
  let MyComponent

  beforeEach(() => {
    bind = jest.fn()
    unbind = jest.fn()
    trigger = jest.fn()
    unsubscribe = jest.fn()
    connector = {
      subscribe: () => ({ bind, unbind, trigger }),
      unsubscribe,
      connection: {
        bind: jest.fn(),
        unbind: jest.fn(),
      },
    }
    MyComponent = ({ callback }) => {
      useRealTimeEventListener(`CommentCreated`, callback)
      return (
        <span>Test</span>
      )
    }
  })

  afterEach(() => {
    bind = null
    unbind = null
    unsubscribe = null
    connector = null
    wrapper = null
    MyComponent = null
  })

  it(`should render`, () => {
    wrapper = mount(
      <RealTimeProvider instance={connector}>
        <RealTimeChannel name="test">
          <MyComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it(`should unsubscribe channel on component will unmount event`, () => {
    wrapper = mount(
      <RealTimeProvider instance={connector}>
        <RealTimeChannel name="test">
          <MyComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(unsubscribe).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it(`should call bind/unbind on channel when component mount/unmount`, () => {
    const myCallback = jest.fn()

    wrapper = mount(
      <RealTimeProvider instance={connector}>
        <RealTimeChannel name="test">
          <MyComponent callback={myCallback}/>
        </RealTimeChannel>
      </RealTimeProvider>
    )

    expect(unbind).not.toHaveBeenCalled()
    expect(bind).toHaveBeenCalled()
    expect(bind).toHaveBeenCalledWith(`CommentCreated`, myCallback)

    wrapper.unmount()

    expect(unbind).toHaveBeenCalled()
    expect(unbind).toHaveBeenCalledWith(`CommentCreated`, myCallback)
  })

  it(`should trigger fake event on click`, () => {
    MyComponent = () => {
      const trigger = useRealTimeEventTrigger()
      const handleClick = useCallback(() => {
        trigger(`TestEvent`, { test: 1234 })
      }, [trigger])
      return (
        <button className="test" type="button" onClick={handleClick} />
      )
    }

    wrapper = mount(
      <RealTimeProvider instance={connector}>
        <RealTimeChannel name="test">
          <MyComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )

    wrapper.find(`.test`).first().simulate(`click`)

    expect(trigger).toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(`TestEvent`, { test: 1234 })
  })

  it(`should call bind/unbind on connection when component mount/unmount`, () => {
    MyComponent = ({ callback }) => {
      useRealTimeConnectionEventListener(`connected`, callback)
      return (<span>Test</span>)
    }

    const myCallback = jest.fn()

    wrapper = mount(
      <RealTimeProvider instance={connector}>
        <RealTimeChannel name="test">
          <MyComponent callback={myCallback} />
        </RealTimeChannel>
      </RealTimeProvider>
    )

    expect(connector.connection.unbind).not.toHaveBeenCalled()
    expect(connector.connection.bind).toHaveBeenCalled()
    expect(connector.connection.bind).toHaveBeenCalledWith(`connected`, myCallback)

    wrapper.unmount()

    expect(connector.connection.unbind).toHaveBeenCalled()
    expect(connector.connection.unbind).toHaveBeenCalledWith(`connected`, myCallback)
  })
})
