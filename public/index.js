
(async () => {

    const submitForm = document.querySelector('#submitImage')

    submitForm.addEventListener('submit', handleFileSubmit)

    async function handleFileSubmit(event) {

        event.preventDefault()

        let file = document.getElementById("image-file").files[0];

        let description = document.getElementById("description").value;

        
        const data = new FormData()
        data.append('image', file)
        data.append('description', description)
        await axios.post('/posts', data)

        window.location.reload()

    }


    // const gallery = document.querySelector('main')

    // const result = await axios.get('/posts')

    // let posts = ''

    // result.data.posts.map(post => (
    //     posts += `<figure key=${post.id}>
    //       <img src=${post.image_url}></img>
    //       <figcaption>${post.description}</figcaption>
    //     </figure>`
    // ))

    // gallery.innerHTML = posts
})();
