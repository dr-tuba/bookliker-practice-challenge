document.addEventListener("DOMContentLoaded", initialize);

const listPanel = document.getElementById('list-panel')
const showPanel = document.getElementById('show-panel')

function initialize() {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(data => data.forEach(renderBooks))
}

function renderBooks(book) {
    let ul = document.getElementById('list')
    let li = document.createElement('li')
    li.setAttribute('id', book.id)
    let p = document.createElement('p')

    ul.append(li)
    li.append(p)
    p.innerText = book.title

    renderData()

    function renderData() {
        let eachBook = document.createElement('div')
        eachBook.setAttribute('id', book.id)
        eachBook.setAttribute('class', 'books')
        eachBook.style.display = 'none'
        let img = document.createElement('img')
        img.src = book['img_url']
        let title = document.createElement('h1')
        title.innerText = book.title
        let subTitle = document.createElement('h2')
        subTitle.innerText = book.subtitle
        let author = document.createElement('h2')
        author.innerText = book.author
        let description = document.createElement('p')
        description.innerText = book.description
        
        showPanel.append(eachBook)
        eachBook.append(img)
        eachBook.append(title)
        eachBook.append(subTitle)
        eachBook.append(author)
        eachBook.append(description)

    
        book.users.forEach(user => {
            let userName = document.createElement('li')
            eachBook.append(userName)
            userName.innerText = user.username
        })

        let likeButton = document.createElement('button')
        likeButton.textContent = 'Like'

        eachBook.append(likeButton)

        likeButton.addEventListener('click', displayUser)

        function displayUser(e) {
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "users": [...book.users,
                        {"id":1, "username":"pouros"}
                    ]
                })
            })
            .then(resp => resp.json())
            .then(data => {
                let li = document.createElement('li')
                li.innerText = data.users.slice(-1)[0].username
                let lastUser = li
                const parentNode = e.path[1]
                const likeButton = e.path[1].lastChild
                parentNode.insertBefore(lastUser, likeButton)
            })
        }

        p.addEventListener('click', function(e) {
            const allBooks = document.querySelectorAll('.books')
            allBooks.forEach(book => {
                if (e.path[1].id === book.id) {
                    book.style.display = 'block'
                } else {
                    book.style.display = 'none'
                }
            })
        })
    }
}


