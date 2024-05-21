const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray)
})

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
        const newBlog = helper.testBlogs[0]
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        const blogs = await helper.blogsInDb()
        assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
        const contents = blogs.map(blog => blog.title)
        assert(contents.includes("React patterns"))
    })
    test('adding a blog without likes works correctly', async () => {
        const newBlog = helper.testBlogs[1]
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        const blogs = await helper.blogsInDb()
        const last = blogs[blogs.length - 1]
        assert.strictEqual(last.likes, 0)
    })
    test('adding a blog without title or url returns Bad Request', async () => {
        const missingURL = helper.testBlogs[2]
        const missingTitle = helper.testBlogs[3]
        await api
            .post('/api/blogs')
            .send(missingURL)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(missingTitle)
            .expect(400)
        const blogs = await helper.blogsInDb()
        assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })
})
describe('DELETE method works properly', () => {
    test('deleting a blog works correctly', async () => {
        const blogs = await helper.blogsInDb()
        await api
            .delete(`/api/blogs/${blogs[0].id}`)
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
after(async () => {
  await mongoose.connection.close()
})