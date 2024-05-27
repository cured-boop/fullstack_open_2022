import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

test('renders content properly when additional information is hidden', () => {
    const blog = {
        title: 'Microservices and the First Law of Distributed Objects',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/distributed-objects-microservices.html',
        likes: 6,
        user:{
          id:'664d00f7f7cf0db2a5812365'
        }
      }
    const user = {
        username: "hellas",
        name: "Arto Hellas",
        id: '664d00f7f7cf0db2a5812365',
    }
  const { container } = render(<Blog blog={blog} user={user}/>)
  screen.debug()
  const div = container.querySelector('.off')
  expect(div).toHaveTextContent(
    'Microservices and the First Law of Distributed Objects'
  )
  expect(div).not.toHaveTextContent(
    'https://martinfowler.com/articles/distributed-objects-microservices.html'
  )
  expect(div).not.toHaveTextContent(
    '6'
  )
})

test('renders content properly when additional information is shown', async () => {
    const blog = {
        title: 'Microservices and the First Law of Distributed Objects',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/distributed-objects-microservices.html',
        likes: 6,
        user:{
          id:'664d00f7f7cf0db2a5812365',
          name: "Arto Hellas",
          username: "hellas",
        }
      }
    const user = {
        username: "hellas",
        name: "Arto Hellas",
        id: '664d00f7f7cf0db2a5812365',
    }
  const { container } = render(<Blog blog={blog} user={user}/>)
  const actor = userEvent.setup()
  const button = screen.getByText('view')
  await actor.click(button)
  const div = container.querySelector('.on')
  expect(div).toBeInTheDocument()
  expect(div).toHaveTextContent(
    'https://martinfowler.com/articles/distributed-objects-microservices.html'
  )
  expect(div).toHaveTextContent(
    '6'
  )
  expect(div).toHaveTextContent(
    'Arto Hellas'
  )
})

test('when like button is pressed twice the event handler is called twice', async () => {
    const blog = {
        title: 'Microservices and the First Law of Distributed Objects',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/distributed-objects-microservices.html',
        likes: 6,
        user:{
          id:'664d00f7f7cf0db2a5812365',
          name: "Arto Hellas",
          username: "hellas",
        }
      }
    const user = {
        username: "hellas",
        name: "Arto Hellas",
        id: '664d00f7f7cf0db2a5812365',
    }
    const mockHandler = vi.fn()
    render(<Blog blog={blog} user={user} addLike={mockHandler}/>)
    const actor = userEvent.setup()
    const button = screen.getByText('like')
    await actor.click(button)
    await actor.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()
  
    render(<BlogForm createBlog={createBlog} />)
    screen.debug()
    const title = screen.getByPlaceholderText('write title here')
    const author = screen.getByPlaceholderText('write author here')
    const url = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')
    
    await user.type(title, 'testing a form...')
    await user.type(author, 'testing a form...')
    await user.type(url, 'testing a form...')
    await user.click(sendButton)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing a form...')
})