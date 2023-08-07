let page = 1;
let maxPage;
let infiniteScroll;

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, {passive:false});

searchBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value.trim()}` ;
    location.reload();
});

backBtn.addEventListener('click', () => {
   
     history.back();
     trends.innerHTML = '';
   
});

headerTitleBackHome.addEventListener('click', () => {
    location.hash = '#home';
    trends.innerHTML = '';
});

trendsBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

function navigator(){

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive:false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')){
        favorites.innerHTML = '';
        trendPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        trends.innerHTML = '';
        movieDetailPage();
    } else if (location.hash.startsWith('#category=')) {
        categoryPage();
    } else {
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive:false});
    }
}

function homePage(){
    console.log('home');

    headerConteiner.classList.remove('inactive');
    backBtn.classList.remove('inactive');
    favoritesMoviesList.classList.remove('inactive');
    favoriteTitle.classList.remove('inactive');
    favoritesLove.classList.remove('inactive');
    favorites.setAttribute('style', 'display:flex')
    trendsBtn.classList.remove('inactive');
    categoryContainer.classList.remove('inactive');
    categoryTitle.classList.remove('inactive');
    searchBox.setAttribute('style', 'display:none')
    search.classList.remove('inactive')
    searchTitle.classList.add('inactive');
    trends.classList.add('inactive');
    category.classList.add('inactive');
    category.setAttribute('style', 'display:none')
    headerTitleBackHome.classList.add('inactive');
    movieDetail.classList.add('inactive');
    relatedMoviesContainer.classList.add('inactive');
    trendingsTitle.classList.add('inactive');
    
    assignLanguage(headerLanguage);
    getTrendingMoviesDay();
    getCategoryMoviesBox();
    getFavoritesMovies();
    translator();

}

function trendPage(){
    console.log('trends')

    categoryTitle.classList.add('inactive');
    relatedMoviesContainer.classList.remove('inactive');
    headerTitleBackHome.classList.remove('inactive');
    searchBox.classList.add('inactive');
    search.classList.add('inactive');
    searchTitle.classList.add('inactive');
    backBtn.classList.remove('inactive');
    trends.classList.remove('inactive');
    trendingsTitle.classList.remove('inactive');
    categoryContainer.classList.add('inactive');
    favoritesMoviesList.classList.add('inactive');
    favoriteTitle.classList.add('inactive');
    favoritesLove.classList.add('inactive');
    favorites.setAttribute('style','display:none');
    trendsBtn.classList.add('inactive');
    movieDetail.classList.add('inactive');
    headerConteiner.classList.add('inactive');
    category.setAttribute('style', 'display:none')
   
    getTrendingMoviesWeek();
    assignLanguage(headerLanguage);
    translator();
}

function movieDetailPage(){
    console.log('estoy en detail Movie');

    relatedMoviesContainer.classList.remove('inactive');
    headerTitleBackHome.classList.remove('inactive');
    backBtn.classList.remove('inactive');
    movieDetail.classList.remove('inactive');
    favorites.setAttribute('style','display:none');
    trendsBtn.classList.add('inactive');
    trends.classList.add('inactive');
    headerConteiner.classList.add('inactive');
    searchBox.setAttribute('style', 'display:none')
    categoryContainer.classList.add('inactive');
    categoryTitle.setAttribute('style', 'display:none')
    category.setAttribute('style', 'display:none')
    searchTitle.classList.add('inactive');
    search.classList.add('inactive');
    trendingsTitle.classList.add('inactive');

    const idArray = location.hash.split('=');
    const MovieId = idArray[1];

    getMovieDetailById(MovieId);
    assignLanguage(headerLanguage);
    translator();

    infiniteScroll = getScrollRelatedMoviesById;
}

function categoryPage(){
    console.log('estoy en categorias')

    categoryContainer.classList.remove('inactive');
    category.classList.remove('inactive');
    headerTitleBackHome.classList.remove('inactive');
    backBtn.classList.remove('inactive');
    headerConteiner.classList.add('inactive');
    favorites.setAttribute('style','display:none');
    trendsBtn.classList.add('inactive');
    movieDetail.classList.add('inactive');
    trends.classList.add('inactive');
    searchBox.classList.add('inactive');
    relatedMoviesContainer.classList.add('inactive');
    categoryTitle.classList.remove('inactive');
    searchTitle.classList.add('inactive');
    search.classList.add('inactive')
    
    const queryArray = location.hash.split('=');
    const queryToCut = queryArray[1].split('-');
    const queryFinal = Number(queryToCut[0]);

    getCategoryMoviesBox();
    getMovieByCategory(queryFinal);
    assignLanguage(headerLanguage);
    translator();

    infiniteScroll = getScrollMovieByCategory;
}

function searchPage(){
    console.log('search')

    searchTitle.classList.remove('inactive');
    headerTitleBackHome.classList.remove('inactive');
    backBtn.classList.remove('inactive');
    searchBox.classList.remove('inactive');
    categoryContainer.classList.add('inactive');
    trends.classList.remove('inactive');
    relatedMoviesContainer.classList.remove('inactive');
    favoritesMoviesList.classList.add('inactive');
    favoriteTitle.classList.add('inactive');
    trendsBtn.classList.add('inactive');
    headerConteiner.classList.add('inactive');
    categoryTitle.classList.add('inactive');
    movieDetail.classList.add('inactive');
    favorites.setAttribute('style', 'display:none')

    const searchArray = location.hash.split('=');
    const searchValue = searchArray[1];

    getSearchBy(searchValue);
    getCategoryMoviesBox();
    assignLanguage(headerLanguage);
    translator();
    
    infiniteScroll = getScroll;
}