import { render, unmountComponentAtNode } from 'react-dom'
// @ts-ignore
import { findByPlaceholderText, fireEvent, waitFor } from '@testing-library/dom'
import IActor from '../IActor'
import TodoApp from '../../../src/client/components/TodoApp'
import React from 'react'
import assert from 'assert'
import getTodosFromDom from '../dom/getTodosFromDom'
import makeFakeBrowserElement from './makeFakeBrowserElement'

export default class ReactActor implements IActor {
  private fakeBrowserErowserElement?: HTMLElement
  private appElement?: HTMLElement

  constructor(
    private readonly name: string,
    private readonly useTodoList: UseTodoList,
    private readonly addTodoFn: AddTodo
  ) {}

  async addTodo(todo: string): Promise<void> {
    const input = await findByPlaceholderText(this.appElement!, 'What needs to be done?')
    const todoCount = this.getTodos().length
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
    await waitFor(() => assert.equal(this.getTodos().length, todoCount + 1), {
      container: this.appElement,
    })
  }

  getTodos(): ReadonlyArray<string> {
    return getTodosFromDom(this.appElement!)
  }

  async start(): Promise<void> {
    this.fakeBrowserErowserElement = await makeFakeBrowserElement(this.name)
    this.appElement = this.fakeBrowserErowserElement.querySelector(
      'div.cucumber-electron-fake-browser-content'
    )! as HTMLElement

    render(<TodoApp useTodoList={this.useTodoList} addTodo={this.addTodoFn} />, this.appElement)
  }

  stop(): Promise<void> {
    // We have to explicitly unmount the React App to trigger the useEffect cleanup functions
    assert(unmountComponentAtNode(this.appElement!))
    this.fakeBrowserErowserElement!.remove()
    return Promise.resolve()
  }
}
