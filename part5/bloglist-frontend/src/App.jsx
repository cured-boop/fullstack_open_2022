import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [refresh, setRefresh] = useState(false)
  const blogFormRef = useRef()



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [refresh])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessageType('success')
      setMessage('login successful')
    } catch (exception) {
      setMessageType('error')
      setMessage('wrong username or password')
    } finally {
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessageType('success')
    setMessage('logged out')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setMessageType('success')
      setMessage(`a new blog ${response.title} by ${response.author} added`)
    } catch (exception) {
      setMessageType('error')
      setMessage('error creating a blog')
    } finally {
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const addLike = async (id, newBlog) => {
    await blogService.update(id, newBlog)
    setRefresh(!refresh)
  }
  const removeBlog = async (id) => {
    await blogService.remove(id)
    setRefresh(!refresh)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  return (
    <div>
      {!user && <div>
        <h2>log in to application</h2>
        <Notification message={message} type={messageType} />
        {loginForm()}
      </div>
      }
      {user && <div>
        <h2>blogs</h2>
        <Notification message={message} type={messageType}/>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}

          />
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
            user={user}
          />
        )}
      </div>}
    </div>
  )
}

export default App