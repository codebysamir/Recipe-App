
const favArr = []

const randomMealTitle = document.querySelector('.random-recipeTitle');
const randomMealImage =  document.querySelector('.random-recipeImg');

async function recipeRndEventListener() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const respJson = await response.json()
    randomMealImage.addEventListener('click', e => showFullRecipe(e), true)

}
recipeRndEventListener()

async function recipeRandomLoop() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const respJson = await response.json()
    let randomMeal = respJson.meals[0];
    randomMealTitle.innerText = randomMeal.strMeal;
    let urlMealThumb = "url" + "(" + "'" + randomMeal.strMealThumb + "'" + ")";
    randomMealImage.style.backgroundImage = urlMealThumb;
}
recipeRandomLoop()

setInterval(recipeRandomLoop, 10000)

const bodyClass = document.body;
const overlayClass = document.querySelector('.overlay')
const recipeContainer = document.querySelector('.recipe-container')
const searchContainer = document.querySelector('.search-container')
const searchIcon = document.querySelector('.fa-search')
const searchInput = document.querySelector('.search-input')

const searchResultContainer = document.querySelector('.searchResults-container')
const searchResult = document.querySelector('.searched-recipes')
const searchResultName = document.querySelector('.recipe-name')
const searchResultArea = document.querySelector('.recipeArea')

searchIcon.addEventListener('click', () => {
    searchContainer.style.visibility = 'visible'
    searchContainer.classList.add('animation')
    recipeContainer.classList.add('overlay');
    searchInput.value = '';
    searchInput.focus();

    removePrevSearchResult();

    bodyClass.addEventListener('click', (e) => {
        if (recipeContainer.classList.contains('overlay')) {
            if (e.target !== searchIcon && e.target !== searchInput && e.target !== searchResult) {
                searchContainer.style.visibility = 'hidden'
                searchContainer.classList.remove('animation')
                recipeContainer.classList.remove('overlay');
                searchResultContainer.style.visibility = 'hidden'
                searchResultContainer.classList.remove('animation')
                removePrevSearchResult();
            }
        } else {
            return;
        }
    })

    searchInput.addEventListener('keydown', async (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();

            removePrevSearchResult()

            searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
            const resp = await fetch(searchUrl + searchInput.value)
            const data = await resp.json()
            searchResultContainer.style.visibility = 'visible'
            searchResultContainer.classList.add('animation')
            removePrevSearchResult()
            if (!data.meals) {
                alert('Not Found')
            } else {

                data.meals.forEach(createSearchResult)
            }
        }
    })


})

function removePrevSearchResult() {
    while (searchResultContainer.firstChild) {
        searchResultContainer.removeChild(searchResultContainer.firstChild)
    }
}

function createSearchResult(data) {
    
    const newSearchResult = document.createElement('div')
    const newSearchResultName = document.createElement('span')
    const newSearchResultArea = document.createElement('span')

    searchResultContainer.appendChild(newSearchResult)
    newSearchResult.appendChild(newSearchResultArea)
    newSearchResult.appendChild(newSearchResultName)

    newSearchResult.classList.add('searched-recipes')
    newSearchResult.classList.add('recipeOTD')
    newSearchResultArea.classList.add('recipeArea')
    newSearchResultArea.classList.add('recipeType')
    newSearchResultName.classList.add('recipe-name')
    newSearchResultName.classList.add('recipeTitle')

    newSearchResult.style.backgroundImage = 'url' + '(' + '"' + data.strMealThumb + '"' + ')'
    newSearchResultArea.innerText = data.strArea
    newSearchResultName.innerText = data.strMeal
    
    newSearchResult.addEventListener('click', e => showFullRecipe(e))
};

function elCheck(e) {
    let recipeName = ''

    if (e.target.children.length > 0) {
        return recipeName = e.target.children[1].innerText
    } else {
        return recipeName = e.target.parentElement.children[1].innerText
    }
}

async function showFullRecipe(e) {
    
    

    searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
    const resp = await fetch(searchUrl + elCheck(e))
    const data = await resp.json()
    
    if (!document.getElementById(data.meals[0].idMeal)) {
        createFullRecipePage(e)
        
        
    } else {
        searchContainer.style.visibility = 'hidden'
        recipeContainer.classList.remove('overlay');
        searchResultContainer.style.visibility = 'hidden'
        favoritesContainer.classList.remove('active')
        categoriesContainer.classList.remove('active')
        ingredientSearchContainer.classList.remove('active')
        removePrevSearchResult();
        recipeContainer.style.display = 'none'
        document.getElementById(data.meals[0].idMeal).classList.add('active')
        console.log('already existing...')
    }
    

}

function createFullRecipePage(e) {

    searchContainer.style.visibility = 'hidden'
    recipeContainer.classList.remove('overlay');
    ingredientSearchContainer.classList.remove('active')
    categoriesContainer.classList.remove('active')
    searchResultContainer.style.visibility = 'hidden'
    removePrevSearchResult();
    recipeContainer.style.display = 'none'
   
    console.log('creating...')
    
    const recipePage = document.createElement('div')
    recipePage.classList.add('recipe-page') 
    recipePage.classList.add('active')
    document.body.appendChild(recipePage)
    
    const controlMenuContainer = document.createElement('div')
    controlMenuContainer.classList.add('control-menu-ct')
    recipePage.appendChild(controlMenuContainer)
    
    const backIconBtn = document.createElement('i')
    backIconBtn.classList.add('fas')
    backIconBtn.classList.add('fa-chevron-left')
    controlMenuContainer.appendChild(backIconBtn)
    backIconBtn.addEventListener('click', () => {
        recipePage.classList.remove('active')
        recipeContainer.style.display = 'block'
        removePrevSearchResult();
    })
    
    const favoriteIconBtn = document.createElement('i')
    favoriteIconBtn.classList.add('far')
    favoriteIconBtn.classList.add('fa-heart')
    controlMenuContainer.appendChild(favoriteIconBtn)
    favoriteIconBtn.addEventListener('click', () => {
        if (favoriteIconBtn.classList.contains('favorited')) {
            favoriteIconBtn.classList.remove('favorited')
            favoriteIconBtn.classList.remove('fas')
            favoriteIconBtn.classList.add('far')
            const index = favArr.indexOf(recipePageTitle.innerText)
            favArr.splice(index, 1)
        } else {
            
            favArr.push(recipePageTitle.innerText)
            favoriteIconBtn.classList.add('favorited')
            favoriteIconBtn.classList.remove('far')
            favoriteIconBtn.classList.add('fas')
        }
    })
    
    const recipePageTitle = document.createElement('h2')
    recipePageTitle.classList.add('recipe-page-title')
    controlMenuContainer.appendChild(recipePageTitle)
    
    const instructionContainer = document.createElement('div')
    instructionContainer.classList.add('instruction-ct')
    recipePage.appendChild(instructionContainer)
    
    const instructionText = document.createElement('p')
    instructionContainer.appendChild(instructionText)
    
    const ingridientsContainer = document.createElement('div')
    ingridientsContainer.classList.add('ingridients-ct')
    recipePage.appendChild(ingridientsContainer)
    
    const ingridientsHeader = document.createElement('h3')
    ingridientsContainer.appendChild(ingridientsHeader)
    ingridientsHeader.innerText = 'Zutaten'
    
    const servingContainer = document.createElement('div')
    servingContainer.classList.add('servings-ct')
    ingridientsContainer.appendChild(servingContainer)
    
    const servingsNumber = document.createElement('span')
    servingsNumber.classList.add('servings')
    servingContainer.appendChild(servingsNumber)
    
    const servingsAdd = document.createElement('span')
    servingsAdd.classList.add('servings-plus')
    servingContainer.appendChild(servingsAdd)
    servingsAdd.innerHTML = '&plus;'
    
    const servingsRemove = document.createElement('span')
    servingsRemove.classList.add('servings-minus')
    servingContainer.appendChild(servingsRemove)
    servingsRemove.innerHTML = '&minus;'
    

    async function apiRecipeData() {

        
        
        searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
        const resp = await fetch(searchUrl + elCheck(e))
        const data = await resp.json()

        controlMenuContainer.style.backgroundImage = 'url' + '(' + '"' + data.meals[0].strMealThumb + '"' + ')'
        recipePageTitle.innerText = data.meals[0].strMeal
        instructionText.innerText = data.meals[0].strInstructions
        servingsNumber.innerText = 'servings'
        recipePage.classList.add(data.meals[0].idMeal)
        recipePage.id = data.meals[0].idMeal
        
        ingrArray = []
        measureArray = []
    
        function ingrData() {
            
    
            for (let items in data.meals[0]) {
                
                let itemValue = data.meals[0][items]
                if (items.startsWith('strIngredient') && itemValue != '' && itemValue != null) {
                    
                    ingrArray.push(itemValue)
                } 
    
                if (items.startsWith('strMeasure') && itemValue != '' && itemValue != "" && itemValue != " " && itemValue != null) {
                    
                    measureArray.push(itemValue)
                } 
                
            }
    
            for (let i = 0; i < ingrArray.length; i++) {
                const IngrFiltered = ingrArray[i];
                const measureFiltered = measureArray[i]
    
                createXIngrItems(IngrFiltered, measureFiltered)
            }
        }
        ingrData()
    
        
        function createXIngrItems(items, measures) {
            
            const ingridientItems = document.createElement('div')
            ingridientItems.classList.add('ingridient-items')
            ingridientsContainer.appendChild(ingridientItems)
            
            const itemName = document.createElement('span')
            itemName.classList.add('item-name')
            ingridientItems.appendChild(itemName)
            itemName.innerText = items
        
            let noneMeasures = () => {
                if (measures == undefined) {
                    return itemMeasure.innerText = " "
                } else {
                    return itemMeasure.innerText = measures
                }
            }

            const itemMeasure = document.createElement('span')
            itemMeasure.classList.add('item-measure')
            ingridientItems.appendChild(itemMeasure)
            itemMeasure.innerText = noneMeasures()
            
        }
    } 
    apiRecipeData()

    
}

//Open Menu
const menu = document.querySelector('.menu')
const menuPoints = document.querySelector('.menupoint')
const menuBtn = document.querySelector('.fa-bars')
// menuBtn.addEventListener('click', openMenu)

function openMenu() {
    menu.classList.add('active')
    recipeContainer.classList.add('overlay')
}
bodyClass.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && e.target !== menu && e.target !== menuBtn && e.target !== menuPoints) {
        menu.classList.remove('active');
        recipeContainer.classList.remove('overlay');
    } else {
        return;
    }
})

//show Favorites:
const favoritesContainer = document.querySelector('.favorites-ct')
const favorites = document.querySelector('.favorites')
const favoritesListContainer = document.querySelector('.favorites-list-ct')
const favBackBtn = favoritesContainer.querySelector('.fa-chevron-left')
favBackBtn.addEventListener('click', () => {
    favoritesContainer.classList.remove('active')
    recipeContainer.style.display = 'block'
})

favorites.addEventListener('click', openFavorites)

function openFavorites() {
    menu.classList.remove('active');
    recipeContainer.classList.remove('overlay');
    recipeContainer.style.display = 'none'
    favoritesContainer.classList.add('active')

    while (favoritesListContainer.firstChild) {
        favoritesListContainer.removeChild(favoritesListContainer.firstChild)
    }

    for (let i = 0; i < favArr.length; i++) {
        const favRec = favArr[i];
        showFavorites(favRec)
    }
    console.log('creating favs...');
}


async function showFavorites(e) {

    const favoritedRecipe = e

    searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
    const resp = await fetch(searchUrl + favoritedRecipe)
    const data = await resp.json()


    const favRecipe = document.createElement('div')
    favRecipe.classList.add('fav-recipe')
    favoritesListContainer.appendChild(favRecipe)

    const favRecImg = document.createElement('img')
    favRecImg.classList.add('fav-img')
    favRecipe.appendChild(favRecImg)
    favRecImg.src = data.meals[0].strMealThumb

    const favName = document.createElement('span')
    favName.classList.add('fav-name')
    favRecipe.appendChild(favName)
    favName.innerText = data.meals[0].strMeal

    const favCategorie = document.createElement('span')
    favCategorie.classList.add('fav-cat')
    favRecipe.appendChild(favCategorie)
    favCategorie.innerText = data.meals[0].strCategory

    const favArea = document.createElement('span')
    favArea.classList.add('fav-area')
    favRecipe.appendChild(favArea)
    favArea.innerText = data.meals[0].strArea

    favRecipe.addEventListener('click', e => showFullRecipe(e), true)
}


//Categories Search:
const categoriesMenuContainer = document.querySelector('.categories-menu-ct')
const categoriesMenuTitle = categoriesMenuContainer.querySelector('h1')
const categoriesContainer = document.querySelector('.categories-ct')
const categoriesListContainer = document.querySelector('.categories-list-ct')
const catBackBtn = categoriesContainer.querySelector('.fa-chevron-left')
catBackBtn.addEventListener('click', () => {
    categoriesContainer.classList.remove('active')
    recipeContainer.style.display = 'block'
})

const foodCategories = document.querySelectorAll('.cat-img')
foodCategories.forEach((e) => e.addEventListener('click', openXCategorie))

const catArr = []

async function openXCategorie(e) {
    catArr.splice(0, catArr.length)
    const catName = e.target.alt
    categoriesMenuTitle.textContent = 'Katogorie: ' + catName

    searchUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c='
    const resp = await fetch(searchUrl + catName)
    const data = await resp.json()

    data.meals.forEach((data) => catArr.push(data.strMeal))


    console.log('opening Categories...');
    
    recipeContainer.style.display = 'none'
    categoriesContainer.classList.add('active')
    
    while (categoriesListContainer.firstChild) {
        categoriesListContainer.removeChild(categoriesListContainer.firstChild)
    }

    for (let i = 0; i < catArr.length; i++) {
        const catRec = catArr[i];
        showCategories(catRec)
    }


}


async function showCategories(e) {

    const categoriesRecipes = e

    searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
    const resp = await fetch(searchUrl + categoriesRecipes)
    const data = await resp.json()


    const catRecipe = document.createElement('div')
    catRecipe.classList.add('cat-recipe')
    categoriesListContainer.appendChild(catRecipe)

    const catRecImg = document.createElement('img')
    catRecImg.classList.add('categorie-img')
    catRecipe.appendChild(catRecImg)
    catRecImg.src = data.meals[0].strMealThumb

    const catName = document.createElement('span')
    catName.classList.add('cat-name')
    catRecipe.appendChild(catName)
    catName.innerText = data.meals[0].strMeal

    const catCategorie = document.createElement('span')
    catCategorie.classList.add('cat-categorie')
    catRecipe.appendChild(catCategorie)
    catCategorie.innerText = data.meals[0].strCategory

    const catArea = document.createElement('span')
    catArea.classList.add('cat-area')
    catRecipe.appendChild(catArea)
    catArea.innerText = data.meals[0].strArea

    catRecipe.addEventListener('click', e => showFullRecipe(e), true)
}

//Ingriedient Search:
const ingredientSearchMenuContainer = document.querySelector('.ingredientSearch-menu-ct')
const ingredientSearchMenuTitle = ingredientSearchMenuContainer.querySelector('h1')
const ingredientSearchContainer = document.querySelector('.ingredientSearch-ct')
const ingredientSearchListContainer = document.querySelector('.ingredientSearch-list-ct')
const ingrSearchBackBtn = ingredientSearchContainer.querySelector('.fa-chevron-left')
ingrSearchBackBtn.addEventListener('click', () => {
    ingredientSearchContainer.classList.remove('active')
    recipeContainer.style.display = 'block'
})

const tryIngredientSearchText = document.querySelector('.tryFeature-text')
const tryIngredientSearchButton = tryIngredientSearchText.querySelector('button')
tryIngredientSearchButton.addEventListener('click', openRecipesWithIngr)


const ingrSearchArr = []

const ingrSearchSearchBoxContainer = document.querySelector('.ingredientSearch-searchBox-ct')
const ingrSearchInput = ingrSearchSearchBoxContainer.querySelector('input')
ingrSearchInput.addEventListener('keydown', async (event) => {
    if (event.key == 'Enter') {
        event.preventDefault();
        
        
        const ingrSearchName = ingrSearchInput.value
        searchUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?i='
        const resp = await fetch(searchUrl + ingrSearchName)
        const data = await resp.json()
        if (!data.meals) {
            alert('Not Found')
        } else {
            data.meals.forEach((data) => ingrSearchArr.push(data.strMeal))
        
            while (ingredientSearchListContainer.firstChild) {
                ingredientSearchListContainer.removeChild(ingredientSearchListContainer.firstChild)
            }
        
            for (let i = 0; i < ingrSearchArr.length; i++) {
                const ingrSearchRec = ingrSearchArr[i];
                showRecipeWithIngredient(ingrSearchRec)
            }
        }
    }   
})

async function openRecipesWithIngr() {
    
    ingrSearchInput.value = '';
    ingrSearchInput.focus();
    ingrSearchArr.splice(0, ingrSearchArr.length)
    console.log('opening Ingredient Search...');
    recipeContainer.style.display = 'none'
    ingredientSearchContainer.classList.add('active')
}


async function showRecipeWithIngredient(e) {

    const ingredientRecipes = e

    searchUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
    const resp = await fetch(searchUrl + ingredientRecipes)
    const data = await resp.json()

    const ingrSearchRecipe = document.createElement('div')
    ingrSearchRecipe.classList.add('ingrSearch-recipe')
    ingredientSearchListContainer.appendChild(ingrSearchRecipe)

    const ingrSearchRecImg = document.createElement('img')
    ingrSearchRecImg.classList.add('ingrSearch-img')
    ingrSearchRecipe.appendChild(ingrSearchRecImg)
    ingrSearchRecImg.src = data.meals[0].strMealThumb

    const ingrSearchName = document.createElement('span')
    ingrSearchName.classList.add('ingrSearch-name')
    ingrSearchRecipe.appendChild(ingrSearchName)
    ingrSearchName.innerText = data.meals[0].strMeal

    const ingrSearchCat = document.createElement('span')
    ingrSearchCat.classList.add('ingrSearch-categorie')
    ingrSearchRecipe.appendChild(ingrSearchCat)
    ingrSearchCat.innerText = data.meals[0].strCategory

    const ingrSearchArea = document.createElement('span')
    ingrSearchArea.classList.add('ingrSearch-area')
    ingrSearchRecipe.appendChild(ingrSearchArea)
    ingrSearchArea.innerText = data.meals[0].strArea

    ingrSearchRecipe.addEventListener('click', e => showFullRecipe(e), true)
}