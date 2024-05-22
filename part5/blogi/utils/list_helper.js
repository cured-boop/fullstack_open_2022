const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    let likes = 0
    console.log(blogs)
    if (blogs.size == 0) {
        return 0
    }
    blogs.forEach(blog => {
        likes += blog.likes
    })
    return likes
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let favorite = blogs[0]
    let mostLikes = favorite.likes
    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            favorite = blog
        }
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let amountOfBlogs = {}
    blogs.forEach(blog => {
        author = blog.author
        if (author in amountOfBlogs) {
            amountOfBlogs[author] += 1
        } else {
            amountOfBlogs[author] = 1
        }
    })
    let most = 0
    let topAuthor = 0
    for (author in amountOfBlogs) {
        if (amountOfBlogs[author] > most) {
            topAuthor = author
            most = amountOfBlogs[author]
        }
    }
    return {
        author: topAuthor,
        blogs: most,
    }
}
const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let amountOfLikes = {}
    blogs.forEach(blog => {
        author = blog.author
        likes = blog.likes
        if (author in amountOfLikes) {
            amountOfLikes[author] += likes
        } else {
            amountOfLikes[author] = likes
        }
    })
    let most = 0
    let topAuthor = 0
    for (author in amountOfLikes) {
        if (amountOfLikes[author] > most) {
            topAuthor = author
            most = amountOfLikes[author]
        }
    }
    return {
        author: topAuthor,
        likes: most,
    }
}
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
