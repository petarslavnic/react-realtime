import React from 'react'
import { mount, shallow } from 'enzyme'
import {
  RealTimeProvider,
  RealTimeChannel,
  realTimeEventListener,
  realTimeEventTrigger,
} from '../../src'

describe(`<RealTimeProvider />`, () => {
  let connector, wrapper, unsubscribe, bind, unbind, trigger
  let MyComponent, MyWrappedComponent, mockEventCallback, MyWrappedComponentTrigger

  beforeEach(() => {
    bind = jest.fn()
    unbind = jest.fn()
    trigger = jest.fn()
    unsubscribe = jest.fn()
    connector = {
      subscribe: () => ({ bind, unbind, trigger }),
      unsubscribe,
    }
    mockEventCallback = jest.fn()
    MyComponent = () => (<span>Test</span>)
    MyWrappedComponent = realTimeEventListener(`CommentCreated`)(MyComponent)
    MyWrappedComponentTrigger = realTimeEventListener(`isWritingComment`)(MyComponent)
  })

  afterEach(() => {
    bind = null
    unbind = null
    unsubscribe = null
    connector = null
    wrapper = null
    mockEventCallback = null
    MyComponent = null
    MyWrappedComponent = null
    MyWrappedComponentTrigger = null
  })

  it(`should render`, () => {
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent />
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
          <MyWrappedComponent />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(unsubscribe).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })

  it(`should accept event name as function`, () => {
    const mockEventNameAsFunc = jest.fn()

    const createMyComponent = () => {
      MyWrappedComponent = realTimeEventListener(mockEventNameAsFunc)(MyComponent)
      wrapper = mount(
        <RealTimeProvider connector={connector}>
          <RealTimeChannel name="test">
            <MyWrappedComponent id={89} />
          </RealTimeChannel>
        </RealTimeProvider>
      )
    }

    // It is expected to throw an error because
    // we use mock function and her
    // result are not string type
    expect(createMyComponent).toThrowError(`The result of a given function needs to be string type!`)

    // Actually, we just want to prove that
    // passed function has been called.
    expect(mockEventNameAsFunc).toHaveBeenCalled()
    expect(mockEventNameAsFunc).toHaveBeenCalledWith({ id: 89 })
  })

  it(`should handle callback`, () => {
    let mockEventProps = jest.fn()
    MyWrappedComponent = realTimeEventListener(`CommentCreated`, mockEventCallback, mockEventProps)(MyComponent)

    let memoizedCallback

    connector = {
      subscribe: () => {
        return {
          bind(eventName, callback) {
            memoizedCallback = callback
          },
          unbind,
        }
      },
      unsubscribe,
    }

    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(mockEventCallback).not.toHaveBeenCalled()
    expect(mockEventProps).not.toHaveBeenCalled()
    memoizedCallback({ test: 1234 })
    expect(mockEventCallback).toHaveBeenCalled()
    expect(mockEventCallback).toHaveBeenCalledWith({ test: 1234 }, { id: 45, name: `Hello World` })
    expect(mockEventProps).toHaveBeenCalled()
    expect(mockEventProps).toHaveBeenCalledWith({ test: 1234 }, { id: 45, name: `Hello World` })

    mockEventCallback.mockClear()
    mockEventProps.mockClear()

    MyWrappedComponent = realTimeEventListener(`CommentCreated`)(MyComponent)
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    expect(mockEventCallback).not.toHaveBeenCalled()
    expect(mockEventProps).not.toHaveBeenCalled()
    memoizedCallback({ test: 4321 })
    expect(mockEventCallback).not.toHaveBeenCalled()
    expect(mockEventProps).not.toHaveBeenCalled()

    mockEventCallback.mockClear()
    mockEventProps.mockClear()

    // test pass new props
    mockEventProps = () => ({ test: 5678 })
    MyWrappedComponent = realTimeEventListener(`CommentCreated`, null, mockEventProps)(MyComponent)
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()

    // test pass undefined props
    mockEventProps = () => undefined
    MyWrappedComponent = realTimeEventListener(`CommentCreated`, null, mockEventProps)(MyComponent)
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()
    // call it again to test more if-s cases in function
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()

    // test pass empty props
    mockEventProps = () => ({})
    MyWrappedComponent = realTimeEventListener(`CommentCreated`, null, mockEventProps)(MyComponent)
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()
    // call it again to test more if-s cases in function
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()

    // test pass same props
    mockEventProps = () => ({ test: 4321 })
    MyWrappedComponent = realTimeEventListener(`CommentCreated`, null, mockEventProps)(MyComponent)
    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponent id={45} name="Hello World" />
        </RealTimeChannel>
      </RealTimeProvider>
    )
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()
    // call it again to test more if-s cases in function
    memoizedCallback({ test: 4321 })
    expect(wrapper).toMatchSnapshot()
  })

  it(`should handle receive new props`, () => {
    MyWrappedComponent = realTimeEventListener(`CommentCreated`)(MyComponent)

    let channel = {
      bind: () => null,
      unbind: () => null,
    }

    wrapper = shallow(
      <MyWrappedComponent id={45} name="Hello World" />,
      { context: { channel } }
    )

    wrapper.setProps({ id: 51 })

    expect(wrapper).toMatchSnapshot()
  })

  it(`should throw error if event name is not a string`, () => {
    let createMyComponent = eventName => () => {
      MyWrappedComponent = realTimeEventListener(eventName)(MyComponent)
      wrapper = mount(
        <RealTimeProvider connector={connector}>
          <RealTimeChannel name="test">
            <MyWrappedComponent id={45} name="Hello World" />
          </RealTimeChannel>
        </RealTimeProvider>
      )
    }

    let message = `Passed event name value needs to be string type!`
    let funcMessage = `The result of a given function needs to be string type!`

    expect(createMyComponent(() => ({}))).toThrowError(funcMessage)
    expect(createMyComponent(undefined)).toThrowError(message)
    expect(createMyComponent(null)).toThrowError(message)
    expect(createMyComponent({ name: `Test` })).toThrowError(message)
    expect(createMyComponent(() => `Test`)).not.toThrowError(message)
    wrapper.unmount()
  })

  it(`should throw error if trigger name is not a string`, () => {
    let createMyComponent = mapEventProps => () => {
      MyWrappedComponentTrigger = realTimeEventTrigger(mapEventProps)(MyComponent)
      wrapper = mount(
        <RealTimeProvider connector={connector}>
          <RealTimeChannel name="test">
            <MyWrappedComponentTrigger id={45} name="Hello World" />
          </RealTimeChannel>
        </RealTimeProvider>
      )
    }

    let message = `First argument for this function need to be a function type!`
    let funcMessage = `Passed event props need to be object type!`

    expect(createMyComponent(null)).toThrowError(message)
    expect(createMyComponent(undefined)).toThrowError(message)
    expect(createMyComponent({ name: `Test` })).toThrowError(message)
    expect(createMyComponent(`Test`)).toThrowError(message)
    expect(createMyComponent(() => undefined)).toThrowError(funcMessage)
    expect(createMyComponent(() => `Test`)).toThrowError(funcMessage)
    expect(createMyComponent(() => null)).not.toThrowError(message) // type of null is object
    expect(createMyComponent(() => null)).not.toThrowError(funcMessage) // type of null is object
    expect(createMyComponent(() => ({}))).not.toThrowError(message)
    expect(createMyComponent(() => ({}))).not.toThrowError(funcMessage)
    wrapper.unmount()
  })

  it(`should trigger on hijacked function`, () => {
    let mockOnClick = jest.fn()
    let mapEventProps = (trigger, { onClick }) => {
      return {
        onClick(...attrs) {
          trigger()
          onClick(...attrs)
        },
      }
    }

    MyComponent = ({ onClick }) => (<span onClick={onClick}>Test</span>)
    MyWrappedComponentTrigger = realTimeEventTrigger(mapEventProps)(MyComponent)

    wrapper = mount(
      <RealTimeProvider connector={connector}>
        <RealTimeChannel name="test">
          <MyWrappedComponentTrigger id={45} name="Hello World" onClick={mockOnClick} />
        </RealTimeChannel>
      </RealTimeProvider>
    )

    expect(mockOnClick).not.toHaveBeenCalled()
    expect(trigger).not.toHaveBeenCalled()
    wrapper.find(`span`).first().simulate(`click`)
    expect(mockOnClick).toHaveBeenCalled()
    expect(trigger).toHaveBeenCalled()
    wrapper.unmount()
  })

  it(`should handle real time event trigger receive new props`, () => {
    let mapEventProps = (trigger, { onClick }) => {
      return {
        onClick(...attrs) {
          trigger()
          onClick(...attrs)
        },
      }
    }
    MyWrappedComponent = realTimeEventTrigger(mapEventProps)(MyComponent)

    let channel = {
      bind: () => null,
      unbind: () => null,
    }

    wrapper = shallow(
      <MyWrappedComponent id={45} name="Hello World" />,
      { context: { channel } }
    )

    wrapper.setProps({ id: 51 })

    expect(wrapper).toMatchSnapshot()
  })
})
