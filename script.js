async function searchRecipe() {
    const query = document.getElementById('search').value.trim();
    const filter = document.getElementById('filter').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!query) {
        alert('Please enter an ingredient or dish name!');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        if (data.meals) {
            resultsDiv.innerHTML = ''; // Clear previous results
            data.meals.forEach(meal => {
                // Simple Veg/Non-Veg filter (Assumes non-veg meals contain "chicken", "beef", etc.)
                const ingredients = Object.values(meal)
                    .slice(9, 29) // Extracting ingredient fields from API response
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (
                    (filter === 'veg' && (ingredients.includes('chicken') || ingredients.includes('beef') || ingredients.includes('fish'))) ||
                    (filter === 'nonveg' && !(ingredients.includes('chicken') || ingredients.includes('beef') || ingredients.includes('fish')))
                ) {
                    return; // Skip meals that don't match the filter
                }

                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="getRecipeDetails('${meal.idMeal}')">View Recipe</button>
                `;
                resultsDiv.appendChild(recipeCard);
            });

            if (!resultsDiv.innerHTML) {
                resultsDiv.innerHTML = '<p>No matching recipes found!</p>';
            }
        } else {
            resultsDiv.innerHTML = '<p>No recipes found!</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
    }
}

async function getRecipeDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();

    if (data.meals) {
        const meal = data.meals[0];
        alert(`Recipe: ${meal.strMeal}\n\nInstructions:\n${meal.strInstructions}`);
    }
}
