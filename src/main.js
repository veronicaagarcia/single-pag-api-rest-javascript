const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
      'api_key': API_KEY,
      "language": localStorage.getItem('language') ? localStorage.getItem('language') : navigator.language,
    },
});


//Local Storage
function listFavoritesMovies(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    } else {
        movies = {};
    }
    return movies; 
}

function likeMovie (movie) {
    const likedMovies = listFavoritesMovies();

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    if (location.hash.startsWith('#home') || !location.hash) { homePage(); } 

}

//Language

function assignLanguage(container) {
    const lenguajes = Array.from(container.querySelectorAll('img'));

    lenguajes.forEach((lenguaje) => {
        lenguaje.addEventListener('click', () => {
            localStorage.setItem('language', lenguaje.getAttribute('data-lang'))
            translator(localStorage.getItem('language'));
            location.reload();
        });
    });
}
function translator(langParam) {
    langParam = localStorage.getItem('language');
    
    if (langParam == "es-AR") {
        headerLanguageTitle.innerText = 'Seleccionar idioma';
        searchFormInput.setAttribute('placeholder', 'Buscar pelicula');
        trendingsTitle.innerHTML = "Tendencias de la semana";
        trendingBtn.innerText = 'Tendencias';
        categoryTitle.innerText = 'Categorias de peliculas';
        // relatedMoviesTitle.innerHTML = "Peliculas similares";
        favoriteTitle.innerText = 'Tu seleccion';
        footer.innerText = 'Curso de API REST con Javascript. Realizado por @veronicaagarcia';
        searchTitle.innerText = 'Todos los resultados para:'
    }

    if (langParam == 'pt-BR') {
        headerLanguageTitle.innerText = "Selecione o idioma";
        searchFormInput.setAttribute("placeholder", "Procurar filme");
        trendingsTitle.innerText = "Tendências da semana";
        trendingBtn.innerText = "Tendências";
        categoryTitle.innerText = "Sua seleção";
        // relatedMoviesTitle.innerText = "Similar movies";
        favoriteTitle.innerText = "Favoritos";
        footer.innerText = 'Curso API REST com Javascript. Feito por @veronicaagarcia';
        searchTitle.innerText = 'Todos os resultados para:';
    }

    if (langParam == 'en-EN') {
        headerLanguageTitle.innerText = "Select language";
        searchFormInput.setAttribute("placeholder", "Search movie");
        trendingsTitle.innerText = "Trendings of the week";
        trendingBtn.innerText = "Trendings";
        categoryTitle.innerText = "Movie categories";
        // relatedMoviesTitle.innerText = "Similar movies";
        favoriteTitle.innerText = "Your selection";
        footer.innerText = 'REST API course with Javascript. Made by @veronicaagarcia';
        searchTitle.innerText = 'All results for:';
    }
}

//Helpers
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((img) => {
        if (img.isIntersecting) {
            const url = img.target.getAttribute('data-img')
            img.target.setAttribute('src', url);
          }
    })
})
function makeMovies (
    array,
    conteiner, 
    {
        lazyLoad = false,
        clean = true,
    } = {},
    ) {

    if (clean){
        conteiner.innerHTML = ''
    }
    array.forEach(movie => {
        
        const trendsDiv = document.createElement('div');
        trendsDiv.classList.add('trendsContainer');

        // trendsDiv.addEventListener('click', () => {
        //     location.hash = '#movie=' + movie.id
        //     console.log(location.hash)
        // })

        conteiner.appendChild(trendsDiv);
        const trendsDiv2 = document.createElement('div');
        trendsDiv2.classList.add('trends-div');
        trendsDiv.appendChild(trendsDiv2);
        const trendsTitle = document.createElement('h3');
        trendsTitle.classList.add('trends-title');
        trendsTitle.innerText = `${movie.title}`;
        trendsDiv2.appendChild(trendsTitle);
        const trendsImg = document.createElement('img');
        trendsImg.classList.add('trends-img');
        trendsImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/w500/${movie.poster_path}`);

            trendsImg.addEventListener('click', () => {
                    location.hash = '#movie=' + movie.id
                    console.log(location.hash)
            })
            
            trendsImg.addEventListener('error', () => {
                trendsImg.setAttribute('src', 
                'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png')
            });

            const favoriteBtn = document.createElement('button');
            favoriteBtn.classList.add('favorites-btn');
            listFavoritesMovies()[movie.id] && favoriteBtn.classList.add('favorites-btn--liked');
            favoriteBtn.addEventListener('click', () => {
                favoriteBtn.classList.toggle('favorites-btn--liked');
                likeMovie(movie);
                
            });

            if (lazyLoad) {
                lazyLoader.observe(trendsImg);
            }
        trendsDiv2.appendChild(trendsImg);
        trendsDiv2.appendChild(favoriteBtn);
    }); 
}

function btnLoad (){
    const btnLoadMore = document.createElement('button');
    btnLoadMore.classList.add('btnLoadMore');
    btnLoadMore.innerText = '+';
    btnLoadMore.addEventListener('click', getPaginatedMoviesTrendings);
    btnLoadMore.addEventListener('click', ()=> {
        btnLoadMore.remove()
    });

    trends.appendChild(btnLoadMore);
}

//Api calls

async function getTrendingMoviesDay() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    makeMovies(movies,trendingContainer, {lazyLoad: true, clean: true});
}

async function getTrendingMoviesWeek() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;
    maxPage = data.total_pages;

    // trends.innerHTML = '';
    // const trendsView = document.createElement('h1');
    // trendsView.classList.add('trendsView');
    // trendingsTitle.innerText= 'Trendings of the week';
    // trends.appendChild(trendingsTitle);

    makeMovies(movies, trends, {lazyLoad: true, clean: true});
    
    btnLoad();
}

async function getPaginatedMoviesTrendings(){
    page++;
    const { data } = await api('trending/movie/week', {
        params: {
          page,
        },
      });
      const movies = data.results;

    makeMovies(movies, trends, {lazyLoad: true, clean: false});

    btnLoad();
}
async function getCategoryMoviesBox() {

    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoryContainer.innerHTML = '';
    const categoryConteinerType = document.createElement('div');
    categoryConteinerType.classList.add('category-conteiner-type');
    categoryContainer.appendChild(categoryConteinerType);

    categories.forEach(genre => {
        
        const pGenre = document.createElement('p');
        pGenre.classList.add('category-type');
        pGenre.setAttribute('id', genre.id);
        pGenre.addEventListener('click', () => {
            location.hash = `#category=${genre.id}-${genre.name}`;
            location.reload();
          });
        pGenre.innerHTML = `${genre.name}`;
        categoryConteinerType.appendChild(pGenre);
    }); 
}

async function getMovieDetailById(MovieId) {
    const { data: movie } = await api('movie/' + MovieId);
     
    movieDetail.innerHTML = '';
    movieDetailDiv.innerHTML = '';
     
    movieDetailDiv.classList.add('movie-container');
    movieDetail.appendChild(movieDetailDiv);
    movieDetailTitle.classList.add('category-title');
    movieDetailTitle.innerText = `${movie.title}`;
    movieDetailDiv.appendChild(movieDetailTitle);
    movieDetailScore.classList.add('movieDetail-score');
    movieDetailScore.innerText = `🍿: ${(movie.vote_average).toFixed(1)}`;
    movieDetailDiv.appendChild(movieDetailScore);
    const movieDetailImg = document.createElement('img');
    movieDetailImg.classList.add('trends-img');
    movieDetailDiv.appendChild(movieDetailImg);
    movieDetailImg.setAttribute("src", `https://image.tmdb.org/t/p/w500/${movie.poster_path}`);
    const favoriteBtn = document.createElement('button');
            favoriteBtn.classList.add('favorites-btn');
            favoriteBtn.addEventListener('click', () => {
                favoriteBtn.classList.toggle('favorites-btn--liked')
            });
            movieDetailDiv.appendChild(favoriteBtn)
    const movieDetailOverview = document.createElement('p');
    movieDetailOverview.classList.add('trends-overview');
    movieDetailOverview.textContent = movie.overview;
    movieDetailDiv.appendChild(movieDetailOverview);
    const movieDetailDate = document.createElement('p');
    movieDetailDate.classList.add('trends-overview');
    movieDetailDate.textContent = `📅: ${movie.release_date}`;
    movieDetailDiv.appendChild(movieDetailDate);
     
    getRelatedMoviesById(MovieId);
}
async function getRelatedMoviesById(MovieId) {
    const { data } = await api(`movie/${MovieId}/recommendations`);
    const relatedMovies = data.results;
    maxPage = data.total_pages;

    movieDetail.appendChild(relatedMoviesContainer);
    relatedMoviesContainer.innerHTML = '';
    relatedMoviesContainer.classList.add('relatedMovies');
    const relatedMoviesSection = document.createElement('h2');
    relatedMoviesSection.classList.add('category-title');
    relatedMoviesSection.innerText = 'Peliculas similares-Similar movies-filmes semelhantes';
    relatedMoviesContainer.appendChild(relatedMoviesSection);

    makeMovies(relatedMovies,relatedMoviesContainer, {lazyLoad: true, clean: false});
}
async function getScrollRelatedMoviesById() {
    // ver porque no funciona
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const idArray = location.hash.split('=');
    const MovieId = idArray[1];

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api(`movie/${MovieId}/recommendations`, {
        params: {
            page,
        },
      });
      const relatedMovies = data.results;
  
      makeMovies(relatedMovies, relatedMoviesContainer, {lazyLoad: true, clean: false});
    }
}

async function getMovieByCategory(queryFinal){
    
    const {data}= await api(`discover/movie`);
    const moviesFound = data.results.filter((movie) => (movie.genre_ids).includes(queryFinal));
    maxPage = data.total_pages;
    
    makeMovies(moviesFound, category, {lazyLoad: true, clean: true});
}
async function getScrollMovieByCategory() {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const queryArray = location.hash.split('=');
    const queryToCut = queryArray[1].split('-');
    const queryFinal = Number(queryToCut[0]);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('discover/movie', {
        params: {
            queryFinal,
            page,
        },
      });
      const moviesFound = data.results.filter((movie) => (movie.genre_ids).includes(queryFinal));
  
      makeMovies(moviesFound, category, {lazyLoad: true, clean: false});
    }
}

async function getSearchBy(searchValue) {

    trends.innerHTML = ''
    const  {data}  = await api('search/movie', {params:{
        query:searchValue
    }});
    maxPage = data.total_pages;

    const search = data.results
    searchBox.innerHTML = '';
    const searchTitle = document.createElement('h2');
    searchTitle.classList.add('category-title');
    searchTitle.innerHTML = `${(searchValue).replace(/%20/g, " ")}`;
    searchBox.appendChild(searchTitle);
    
    makeMovies(search, searchBox, {lazyLoad: true, clean: false});
}
async function getScroll() {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const searchArray = location.hash.split('=');
    const searchValue = searchArray[1];

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('search/movie', {
        params: {
            query:searchValue,
            page,
        },
      });
      const search = data.results
  
      makeMovies(search, searchBox, {lazyLoad: true, clean: false});
    }
}

function getFavoritesMovies(){
  const likedMovies =  listFavoritesMovies();
  const likedMoviesArray = Object.values(likedMovies);

  favoritesHeader.appendChild(favoriteTitle);
  favorites.appendChild(favoritesHeader);
  favorites.appendChild(favoritesMoviesList);

  makeMovies(likedMoviesArray, favoritesMoviesList, {lazyLoad : true, clean : true})
}