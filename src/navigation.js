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

    if (location.hash = '#home'){

        location.reload();
    }

    trends.innerHTML = '';
});

headerCarouselTitle.addEventListener('click', () => {

    location.hash = '#home';
    location.reload();
    trends.innerHTML = '';
});

GotrendingBtn.addEventListener('click', () => {

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
    
    headerCarouselContainer.classList.remove('inactive');
    backBtn.classList.remove('inactive');
    favoritesMoviesList.classList.remove('inactive');
    favoriteTitle.classList.remove('inactive');
    favorites.setAttribute('style', 'display:flex')
    GotrendingBtn.classList.remove('inactive');
    categoryContainer.classList.remove('inactive');
    searchView.setAttribute('style', 'display:none');
    search.classList.remove('inactive');
    trends.classList.add('inactive');
    category.classList.add('inactive');
    category.setAttribute('style', 'display:none');
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
   
    header.classList.remove('header');
    header.classList.add('headerCategory');
    headerCarouselTitle.classList.remove('header-carousel-title');
    headerCarouselTitle.classList.add('header-title');
    backBtn.setAttribute('style', 'top:14%');
    headerLanguage.setAttribute('style', 'top:14%');
    headerCarouselContainer.setAttribute('style', 'display:none');
    GotrendingBtn.setAttribute('style', 'display:none');
    search.classList.add('inactive');
    categoryContainer.classList.add('inactive');
    favorites.setAttribute('style','display:none');
    searchView.setAttribute('style', 'display:none');
    
    getTrendingMoviesWeek();
    assignLanguage(headerLanguage);
    translator();
}

function movieDetailPage(){

    header.classList.remove('header');
    header.classList.add('headerCategory');
    headerCarouselTitle.classList.remove('header-carousel-title');
    headerCarouselTitle.classList.add('header-title');
    backBtn.setAttribute('style', 'top:14%');
    headerLanguage.setAttribute('style', 'top:14%');
    headerCarouselContainer.setAttribute('style', 'display:none');
    GotrendingBtn.setAttribute('style', 'display:none');
    movieDetail.classList.remove('inactive');
    favorites.setAttribute('style','display:none');
    searchView.setAttribute('style', 'display:none');
    categoryContainer.classList.add('inactive');
    search.classList.add('inactive');

    const idArray = location.hash.split('=');
    const MovieId = idArray[1];

    getMovieDetailById(MovieId);
    assignLanguage(headerLanguage);
    translator();

    infiniteScroll = getScrollRelatedMoviesById;
}

function categoryPage(){

    header.classList.remove('header');
    header.classList.add('headerCategory');
    headerCarouselTitle.classList.remove('header-carousel-title');
    headerCarouselTitle.classList.add('header-title');
    backBtn.setAttribute('style', 'top:14%');
    headerLanguage.setAttribute('style', 'top:14%');
    headerCarouselContainer.setAttribute('style', 'display:none');
    categoryContainer.classList.remove('categoryBox');
    categoryContainer.classList.add('categoryBoxPage');
    GotrendingBtn.setAttribute('style', 'display:none');
    favorites.setAttribute('style','display:none');
    search.classList.add('inactive');
    searchView.setAttribute('style', 'display:none');
    
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

    header.classList.remove('header');
    header.classList.add('headerSearchView');
    headerCarouselTitle.classList.remove('header-carousel-title');
    headerCarouselTitle.classList.add('header-title');
    searchForm.classList.remove('searchForm');
    searchForm.classList.add('searchFormView');
    searchFormInput.classList.remove('searchFormInput');
    searchFormInput.classList.add('searchFormInputView');
    searchBtn.classList.remove('searchBtn');
    searchBtn.classList.add('searchBtnView');
    backBtn.setAttribute('style', 'top:14%');
    headerLanguage.setAttribute('style', 'top:14%');
    GotrendingBtn.setAttribute('style', 'display:none');
    headerCarouselContainer.setAttribute('style', 'display:none');
    categoryContainer.classList.add('inactive');
    favorites.setAttribute('style', 'display:none')

    const searchArray = location.hash.split('=');
    const searchValue = searchArray[1];

    getSearchBy(searchValue);
    getCategoryMoviesBox();
    assignLanguage(headerLanguage);
    translator();
    
    infiniteScroll = getScroll;
}