document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const mealContainer = document.getElementById('meal');
  const mealsContainer = document.getElementById('meals');
  const mealListSection = document.getElementById('meal-list');
  const modal = document.getElementById('meal-modal');
  const modalContent = document.querySelector('.modal-content');
  const ingredientsList = document.getElementById('ingredients');
  const closeModal = document.querySelector('.close');

  // Attaching functions to window object for testing
  
    window.fetchRandomMeal = fetchRandomMeal;
  window.fetchMealsByCategory = fetchMealsByCategory;
  window.displayMeal = displayMeal;
  window.fetchMealDetails = fetchMealDetails;
  window.displayIngredients = displayIngredients;
  window.clearSearchAndHideMeals = clearSearchAndHideMeals;

  // Function to  Add event listener to the search input to trigger search on 'Enter' key press

  searchInput.addEventListener('keypress', function (event) {
    console.log(event.key); // Log the key pressed
    if (event.key === 'Enter') {
      const query = searchInput.value.trim(); // Get and trim the input value
      if (query) {
        fetchMealsByCategory(query); // Call function with the query
      }
    }
  });
  
  // Function to  Fetch and display a random meal on page load
  fetchRandomMeal();


  // Function to  Fetch a random meal and display it
  function fetchRandomMeal() {
    clearSearchAndHideMeals();
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        displayMeal(meal, mealContainer);
      })
      .catch(err => console.error(err));
  }
  

  // Function to  Fetch meals by category and display them
  // API :https://www.themealdb.com/api
  
  
  function fetchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => {
        mealsContainer.innerHTML = ''; 
        data.meals.forEach(meal => {
          displayMeal(meal, mealsContainer);
        });
        mealListSection.classList.remove('hidden');
      })
      .catch(err => console.error(err));
  }
  

  // function to  Display a meal in the specified container
  function displayMeal(meal, container) {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    `;
    mealDiv.addEventListener('click', () => {
      fetchMealDetails(meal.idMeal);
    });
    container.appendChild(mealDiv);
  }
  
  // Task 1: Fetch and display meal details in the modal
  // API:- https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}
  function fetchMealDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        modal.classList.remove('hidden');
        displayIngredients(meal);
      })
      .catch(err => console.error(err));
  }

  function displayIngredients(meal) {
    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const li = document.createElement('li');
        li.textContent = `${measure} ${ingredient}`;
        ingredientsList.appendChild(li);
      }
    }
  }

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  function clearSearchAndHideMeals() {
    searchInput.value = '';
    mealsContainer.innerHTML = '';
    mealListSection.classList.add('hidden');
  }
});

