function searchRecipe() {
    // Wert des Rezeptnamens aus dem Eingabefeld holen und Leerzeichen entfernen
    const recipeName = document.getElementById('recipeName').value.trim();
  
    // Überprüfen, ob ein Rezeptname eingegeben wurde
    if (recipeName !== '') {
        // Weiterleitung zu recipe.html mit dem Rezeptnamen als URL-Parameter
        window.location.href = `recipe.html?recipeName=${encodeURIComponent(recipeName)}`;
    } else {
     // Benutzer benachrichtigen, wenn kein Rezeptname eingegeben wurde
      alert('Please enter a recipe name');
    }
  }
  
  function getRandomMeal() {
    // Abrufen eines zufälligen Rezepts von der API
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(response => response.json())
      .then(data => displayRandomMeal(data.meals[0]))
      .catch(error => console.error('Error fetching random meal:', error));
    // Die Funktion displayRandomMeal wird aufgerufen, um das Rezept anzuzeigen
  }

  
  function displayRandomMeal(meal) {
    // Container für das zufällige Rezept holen
    const randomRecipeContainer = document.getElementById('randomRecipe');
  
    if (meal) {
      // Ein HTML-Element für das zufällige Rezept erstellen und anzeigen
      const randomRecipeCard = document.createElement('div');
      randomRecipeCard.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 70%; height: auto">
        <div class="details-container">
          <button onclick="showDetails('${meal.idMeal}')">Show Details</button>
          <div id="${meal.idMeal}" style="display: none; max-width: 700px;">
            <h3 style="text-align: left;">Ingredients:</h3>
            <ul>${getIngredientsList(meal)}</ul>
  
            <h3 style="text-align: left;">Instructions:</h3>
            ${formatInstructions(meal.strInstructions)}
            <!-- Add more details as needed -->
          </div>
        </div>
      `;
      randomRecipeContainer.appendChild(randomRecipeCard);
    } else {
      // Benutzer benachrichtigen, wenn kein zufälliges Rezept gefunden wurde
      randomRecipeContainer.innerHTML = '<p>No random recipe found.</p>';
    }
  }
  
  function formatInstructions(instructions) {
    // Zubereitungstext in Absätze aufteilen und als HTML-String zurückgeben
    const paragraphs = instructions.split('\n').map(paragraph => `<p style="text-align: left;">${paragraph}</p>`);
    return paragraphs.join('');
  }

  
  function showDetails(mealId) { 
    //Diese Funktion zeigt die Details (z.B. Anweisungen) für ein bestimmtes Rezept an, 
    //wenn der Benutzer auf den "Show Details" Button klickt
    console.log('Toggle details for meal ID:', mealId);

    const detailsContainer = document.getElementById(mealId);
    console.log('Details container:', detailsContainer);

    if (detailsContainer) {
        // Umschalten zwischen Anzeigen und Ausblenden der Details
        if (detailsContainer.style.display === 'block') {
            // Wenn die Details bereits angezeigt werden, ausblenden 
            detailsContainer.style.display = 'none';
        } else {
            // Wenn die Details ausgeblendet sind, anzeigen 
            detailsContainer.style.display = 'block';
        }
    } else {
        console.error('Details container not found!');
    }
}

  
  document.addEventListener('DOMContentLoaded', () => {
    // Ausführen, sobald der DOM geladen ist
    if (window.location.pathname.includes('recipe.html')) {
        // Rezeptdaten basierend auf URL-Parameter abrufen und anzeigen
      const params = new URLSearchParams(window.location.search);
      const recipeName = params.get('recipeName');
  
      if (recipeName) {
        // Rezeptdaten basierend auf dem bereitgestellten Rezeptnamen abrufen und anzeigen
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
          .then(response => response.json())
          .then(data => displayRecipeResults(data.meals))
          .catch(error => console.error('Error fetching recipe data:', error));
      } else {
        // Fehler behandeln, wenn kein Rezeptname bereitgestellt wurde
        console.error('Recipe name not found in URL parameters');
      }
    } else {
      // Wenn sich die Seite nicht auf recipe.html befindet, ein zufälliges Rezept abrufen und anzeigen
      getRandomMeal();
    }
  });
  
  function displayRecipeResults(recipes) {
      // Container-Element holen, in dem die Rezeptergebnisse angezeigt werden sollen
    const recipeResultsContainer = document.getElementById('recipeResults');
  
    if (recipes && recipes.length > 0) {
        // Für jedes gefundene Rezept ein HTML-Element erstellen und anzeigen
        recipes.forEach(recipe => {
            // HTML-Element für jedes Rezept erstellen und zum Container hinzufügen
        const recipeCard = document.createElement('div');
        recipeCard.innerHTML = `
          <div class="recipe-card">
            <h2>${recipe.strMeal}</h2>
            <div class="recipe-details" style="margin-bottom: 20px;">
              <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="max-width: 80%; height: auto">
              <button class="show-details-btn"  style="margin-top: 10px; margin-bottom: 20px;" onclick="showDetails('${recipe.idMeal}')">Show Details</button>
              <div id="${recipe.idMeal}" style="display: none; max-width: 700px;">
                <h3 style="text-align: left;">Ingredients:</h3>
                <ul>${getIngredientsList(recipe)}</ul>
  
                <h3 style="text-align: left;">Instructions:</h3>
                ${formatInstructions(recipe.strInstructions)}
              </div>
            </div>
          </div>
        `;
       // Erstellte HTML-Element zu dem Container hinzufügen

        recipeResultsContainer.appendChild(recipeCard);
      });
    } else {
      // Benutzer benachrichtigen, wenn keine Ergebnisse gefunden wurden
      recipeResultsContainer.innerHTML = '<p>No results found.</p>';
    }
  }

  
  function getIngredientsList(recipe) {
    // Liste von Zutaten und Mengen für ein Rezept erstellen
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredientsList += `<li style="text-align: left;">${measure} ${ingredient}</li>`;
        }
    }

    return ingredientsList;
}
// Dieser Eventlistener wird aufgerufen, wenn der Benutzer auf den "Search" Button klickt, und ruft die Funktion searchRecipe auf
  document.getElementById('searchButton').addEventListener('click', searchRecipe);
