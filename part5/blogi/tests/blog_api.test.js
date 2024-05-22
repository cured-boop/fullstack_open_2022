const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')



beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const hash = await bcrypt.hash("asdfasdf", 10)
    const user = new User({
        username: "mluukkai",
        name: "Matti Luukkainen",
        blogs: [],
        passwordHash: hash,
    })
    await user.save()
    const blogObjects = helper.initialBlogs.map(blog => new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: user._id,
        likes: blog.likes
    }))
    const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))
    user.blogs = savedBlogs.map(blog => blog._id)
    await user.save()
})
describe('Testing for blogs', () => {
    describe('GET method works properly', () => {
        test('blogs are returned as json', async () => {
            await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })

        test('the correct amount of blogs are returned', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })
        test('the identifier of blog objects is id (not _id by default)', async () => {
            const blogs = await helper.blogsInDb()
            for (const blog of blogs) {
                const response = await api    
                    .get(`/api/blogs/${blog.id}`)    
                    .expect(200)    
                assert(response.body.id !== undefined)
            }
        })
    })
    describe('POST method works properly', () => {
        test('adding a blog works correctly', async () => {
            const userCredentials = {
                username: "mluukkai",
                password: "asdfasdf",
            }
            const user = await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(userCredentials)
                .expect(200)
            const newBlog = helper.testBlogs[0]
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${user.body.token}`)
                .send(newBlog)
                .expect(201)
            const blogs = await helper.blogsInDb()
            assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
            const contents = blogs.map(blog => blog.title)
            assert(contents.includes("React patterns"))
        })
        test('adding a blog without likes works correctly', async () => {
            const userCredentials = {
                username: "mluukkai",
                password: "asdfasdf"
            }
            const user = await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(userCredentials)
                .expect(200)
            const newBlog = helper.testBlogs[1]
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${user.body.token}`)
                .send(newBlog)
                .expect(201)
            const blogs = await helper.blogsInDb()
            const last = blogs[blogs.length - 1]
            assert.strictEqual(last.likes, 0)
        })
        test('adding a blog without title or url returns Bad Request', async () => {
            const userCredentials = {
                username: "mluukkai",
                password: "asdfasdf"
            }
            const user = await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(userCredentials)
                .expect(200)
            const missingURL = helper.testBlogs[2]
            const missingTitle = helper.testBlogs[3]
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${user.body.token}`)
                .send(missingURL)
                .expect(400)
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${user.body.token}`)
                .send(missingTitle)
                .expect(400)
            const blogs = await helper.blogsInDb()
            assert.strictEqual(blogs.length, helper.initialBlogs.length)
        })
        test('adding a blog without token return Unauthorized', async () => {
            const newBlog = helper.testBlogs[0]
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
            const blogs = await helper.blogsInDb()
            assert.strictEqual(blogs.length, helper.initialBlogs.length)
        })
    })
    describe('DELETE method works properly', () => {
        test('deleting a blog works correctly', async () => {
            const userCredentials = {
                username: "mluukkai",
                password: "asdfasdf"
            }
            const user = await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(userCredentials)
                .expect(200)
            const blogs = await helper.blogsInDb()
            await api
                .delete(`/api/blogs/${blogs[0].id}`)
                .set('Authorization', `Bearer ${user.body.token}`)
                .expect(204)
            const newBlogs = await helper.blogsInDb()
            assert.strictEqual(blogs.length - 1, newBlogs.length)
            const contents = newBlogs.map(blog => blog.title)
            assert(!contents.includes(blogs[0].title))
        })
    })
    describe('PUT method works properly', () => {
        test('editing a blog works correctly', async () => {
            const blogs = await helper.blogsInDb()
            const initialBlog = blogs[0]
            const newBlog = {
                title: initialBlog.title,
                author: initialBlog.author,
                url: initialBlog.url,
                likes: 123,
            }
            await api
                .put(`/api/blogs/${initialBlog.id}`)
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const newBlogs = await helper.blogsInDb()
            const finalBlog = newBlogs[0]
            assert(finalBlog.title === initialBlog.title)
            assert(finalBlog.likes !== initialBlog.likes)
            assert(finalBlog.likes === 123)
        })
    })
})

describe('Testing for users', () => {
    describe('POST method works properly', () => {
        beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
        })
    
        test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
        })
        test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()
            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'salainen',
            }
        
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
        
            const usersAtEnd = await helper.usersInDb()
            assert(result.body.error.includes('expected `username` to be unique'))
        
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
        test('creation fails with proper statuscode and message if either username or password are not defined', async () => {
            const usersAtStart = await helper.usersInDb()
            const noPassword = {
                username: 'noPass',
                name: 'MissingPass',
            }
            const noUsername = {
                name: 'MissingUsername',
                password: 'salainen',
            }
            const noResult = await api
                .post('/api/users')
                .send(noPassword)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            assert(noResult.body.error.includes('not defined'))
            await api
                .post('/api/users')
                .send(noUsername)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
        test('creation fails with proper statuscode and message if either username or password are under 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()
            
            const shortPassword = {
                username: 'noPass',
                name: 'MissingPass',
                password: 'no',
            }
            const shortUsername = {
                name: 'SO',
                password: 'salainen',
                password: 'salainen',
            }
            const shortResult = await api
                .post('/api/users')
                .send(shortPassword)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            assert(shortResult.body.error.includes('atleast 3 characters'))
            await api
                .post('/api/users')
                .send(shortUsername)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})
