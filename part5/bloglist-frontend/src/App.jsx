import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
  
  const addBlog = async (event) => {
    event.preventDefault()
    if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
      setMessageType('error')
      setMessage('all fields must be filled')
      setTimeout(() => {
        setMessage('')
      }, 5000)
      return
    }
    try {
      const newBlog = {
        title,
        author,
        url
      }
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setTitle('')
      setAuthor('')
      setUrl('')
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
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
        <h2>create new</h2>
        {blogForm()}
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
        </div>}
    </div>
  )
}

export default App