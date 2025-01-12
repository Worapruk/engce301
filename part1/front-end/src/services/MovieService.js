export async function searchMovie(search_data) {

    try {

        console.log('search_data: ' + search_data);

        const response = await fetch('http://192.168.56.106:3001/api/movie/search?search_text=' + search_data);

        return await response.json(); //***

        // console.log('Search Movie response: ' + await response);

    } catch (error) {
        return [];
    }

}

export async function getAllMovies() {

    try{
        //const response = await fetch('/api/users');
         const response = await fetch('http://localhost:3001/api/movie/all');
        //const response = await fetch('/api/movie/all');
        return await response.json();
    }catch(error) {
        return [];
    }
    
}

//---- ยังไม่เสร็จ ----
export async function createMovie(data) {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
      })
    return await response.json();
}

