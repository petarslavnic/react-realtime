import React from 'react'
import { mount } from 'enzyme'
import {
  RealTimeProvider,
  RealTimeChannel,
  useRealTimeEventListener,
  useRealTimeEventTrigger,
} from '../../src'

describe(`<RealTimeProvider />`, () => {
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
    }
    MyComponent = ({ callback }) => {
      useRealTimeEventListener(`CommentCreated`, callback)
      return (<span>Test</span>)
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
      <RealTimeProvider connector={connector}>
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
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(unsubscribe).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it(`should call bind on channel when component did mount`, () => {
    const myCallback = jest.fn()

    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyComponent callback={myCallback}/>
        </RealTimeChannel>
      </RealTimeProvider>
    )

    expect(bind).toHaveBeenCalled()
    expect(bind).toHaveBeenCalledWith(`CommentCreated`, myCallback)

    wrapper.unmount()
  })

  it(`should call unbind on channel when component will unmount`, () => {
    const myCallback = jest.fn()

    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyComponent callback={myCallback}/>
        </RealTimeChannel>
      </RealTimeProvider>
    )

    expect(unbind).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(unbind).toHaveBeenCalled()
    expect(unbind).toHaveBeenCalledWith(`CommentCreated`, myCallback)
  })

  it(`should trigger fake event on click`, () => {
    MyComponent = () => {
      const trigger = useRealTimeEventTrigger()
      const handleClick = () => {
        trigger(`TestEvent`, { test: 1234 })
      }
      return (
        <button className="test" type="button" onClick={handleClick} />
      )
    }

    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )

    wrapper.find(`.test`).first().simulate(`click`)

    expect(trigger).toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(`TestEvent`, { test: 1234 })
  })
})
