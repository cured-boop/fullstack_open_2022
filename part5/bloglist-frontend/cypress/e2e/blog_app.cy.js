import { func } from "prop-types"

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'asdasdasd'
    }
    const otherUser = {
      username: 'antero',
      name: 'Antti Tiusanen',
      password: 'asdfasdf'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', otherUser)
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('asdasdasd')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('hahahaha')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('asdasdasd')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type("Things I Don't Know as of 2018")
      cy.get('#author').type('Dan Abramov')
      cy.get('#url').type("https://overreacted.io/things-i-dont-know-as-of-2018/")
      cy.get('#submitBlog-button').click()
      cy.contains("Things I Don't Know as of 2018")
      cy.contains('Dan Abramov')
    })
    describe('and when a blog exists', function () {
      beforeEach( function() {
        cy.contains('create new blog').click()
        cy.get('#title').type("Things I Don't Know as of 2018")
        cy.get('#author').type('Dan Abramov')
        cy.get('#url').type("https://overreacted.io/things-i-dont-know-as-of-2018/")
        cy.get('#submitBlog-button').click()
        cy.contains("Things I Don't Know as of 2018")
        cy.contains('Dan Abramov')
        
      })
      it('a blog can be liked', function () {
        cy.contains('view').click()
        cy.contains('0')
        cy.get('#like-button').click()
        cy.contains('1')
      })
      it('a blog can be deleted', function () {
        cy.get('#logout-button').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('asdasdasd')
        cy.get('#login-button').click()
        cy.contains('view').click()
        cy.get('#like-button').click()
        cy.contains("Things I Don't Know as of 2018")
        cy.get('#remove-button').click({ force: true })
        cy.contains('view').should('not.exist')
      })
      it('a blog cannot be deleted by other users', function () {
        cy.get('#logout-button').click()
        cy.get('#username').type('antero')
        cy.get('#password').type('asdfasdf')
        cy.get('#login-button').click()
        cy.contains('Antti Tiusanen logged in')
        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })
      it('the blog with most likes is on top', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type("Top title")
        cy.get('#author').type('Top author')
        cy.get('#url').type("topurl")
        cy.get('#submitBlog-button').click()


        cy.contains('Top title').contains('view').click()
        cy.get('.like-button').eq(1).click({ force: true })
        cy.get('.blog').eq(0).should('contain', 'Top title')
        cy.get('.blog').eq(1).should('contain', "Things I Don't Know as of 2018")
      })
    })
  })
})