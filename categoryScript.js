function loadCategories() {
    // Abrufen der Rezeptkategorien von der API
    const categoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    // Mit Fetch API die Rezeptkategorien von der API abrufen
    fetch(categoriesUrl)
    .then(response => response.json())
    .then(data => displayCategories(data.categories)) // Kategorien anzeigen
    .catch(error => console.error('Fehler beim Laden der Kategorien:', error)); // Fehlerbehandlung
}

function displayCategories(categories) {
    // Container für Kategorien aus dem DOM holen
    const categoriesContainer = document.getElementById('categories-container');
  
    categories.forEach(category => {
        // Für jede Kategorie eine Karte mit Bild und Button erstellen
      const categoryCard = document.createElement('div');
      categoryCard.className = 'col';
  
      // Erstelle ein Bild für die Kategorie
      const categoryImage = document.createElement('img');
      categoryImage.className = 'img-fluid';
      categoryImage.src = `https://www.themealdb.com/images/category/${category.strCategory}.png`;
      categoryImage.alt = category.strCategory;
  
      // Erstelle einen Button für die Kategorie
      const categoryButton = document.createElement('button');
      categoryButton.textContent = category.strCategory;
      categoryButton.className = 'btn'; // Hier können Sie die Bootstrap-Klassen anpassen

     // Benutzerdefinierte Stile für den Button
      categoryButton.style.backgroundColor = '#dedede'; // Grauer Hintergrund
      categoryButton.style.marginTop = '10px'; // Abstand zwischen Bild und Button (oben)
  
      // Füge das Bild und den Button zur Kategorie-Karte hinzu
      categoryCard.appendChild(categoryImage);
      categoryCard.appendChild(categoryButton);
  
      // Füge die Kategorie-Karte zur Container-Reihe hinzu
      categoriesContainer.appendChild(categoryCard);
  
      categoryButton.addEventListener('click', function() {
        loadCategoryRecipes(category.strCategory);
      });
    });
  }

  
function loadCategoryRecipes(category) {
    // Abrufen von Rezepten einer bestimmten Kategorie von der API
    const categoryRecipesUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    // Rezepte für die ausgewählte Kategorie von der API abrufen
    fetch(categoryRecipesUrl)
        .then(response => response.json())
        .then(data => {
            // Geladene Rezepte anzeigen
            displayCategoryRecipes(data.meals);
        })
        .catch(error => {
        // Fehler behandeln, falls das Laden der Rezepte fehlschlägt
            console.error(`Fehler beim Laden der Rezepte für die Kategorie ${category}:`, error);
        });
}

function displayCategoryRecipes(meals) {
    // Container für Rezeptergebnisse aus dem DOM holen
    const recipesContainer = document.getElementById('recipes-container');

    // Falls das Container-Element nicht gefunden wird, Fehler anzeigen
    if (!recipesContainer) {
        console.error('Das Element mit der ID "recipes-container" wurde nicht gefunden.');
        return;
    }

    recipesContainer.innerHTML = ''; // Leert den Container, um vorherige Inhalte zu entfernen

    // Für jedes Rezept ein HTML-Element erstellen und anzeigen
    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'col-12', 'mb-4'); // mb-4 fügt einen unteren Abstand hinzu

        // Fügen Sie hier die gewünschten Informationen für jedes Rezept hinzu (z.B. Name, Bild, usw.)
        const recipeName = document.createElement('h4'); // Größe des Rezeptnamens
        recipeName.textContent = meal.strMeal;
        recipeCard.appendChild(recipeName);

        // Hinzufügen des Rezeptbilds        
        const recipeImage = document.createElement('img');
        recipeImage.src = meal.strMealThumb;
        recipeImage.alt = meal.strMeal;
        recipeImage.style.maxWidth = '80%';
        recipeImage.style.height = 'auto';
        recipeImage.classList.add('recipe-image');
        recipeCard.appendChild(recipeImage);

        // Füge einen Button zum Anzeigen der Details hinzu
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'View Details';
        detailsButton.classList.add('btn');

        // Benutzerdefinierte Stile für den Button
        detailsButton.style.backgroundColor = '#dedede'; // Grauer Hintergrund
        detailsButton.style.color = '#000'; // Schwarzer Text

        detailsButton.style.marginTop = '10px'; // Abstand zwischen Bild und Button (oben)
        detailsButton.style.marginBottom = '20px'; // Abstand zwischen Bild und Button (oben)

        detailsButton.addEventListener('click', function () {
            showDetails(meal.idMeal, recipeCard);
        });
        recipeCard.appendChild(detailsButton);

        recipesContainer.appendChild(recipeCard);
    });
}

function showDetails(mealId, recipeCard) {     // Details zu einem Rezept anzeigen oder verbergen
    // Überprüfen, ob bereits ein Details-Container vorhanden ist
    const existingDetailsContainer = recipeCard.querySelector('.recipe-details');

    // Wenn bereits vorhanden, entferne es und kehre zurück
    if (existingDetailsContainer) {
        existingDetailsContainer.remove();
        return;
    }

    // API-URL für ein einzelnes Rezept basierend auf der Meal-ID
    const recipeDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    // Rezeptdetails von der API abrufen
    fetch(recipeDetailsUrl)
        .then(response => response.json())
        .then(data => {
            // Die Details des Rezepts anzeigen
            displayRecipeDetails(data.meals[0], recipeCard);
        })
        .catch(error => {
            console.error(`Fehler beim Laden der Rezeptdetails für das Rezept ${mealId}:`, error);
        });
}


function displayRecipeDetails(recipe, recipeCard) {
        // Detailinformationen zu einem Rezept anzeigen
    if (recipe) {
        // Erstelle einen Container für die Rezeptdetails
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('recipe-details');

        // Rezeptdetails hinzufügen (Titel, Bild, Zutaten, Anweisungen)
        detailsContainer.innerHTML = `
            <h3>Ingredients:</h3>
            <ul style="text-align: left;">
                ${getIngredientsList(recipe)}
            </ul>
            <p style="text-align: left;">${recipe.strInstructions}</p>
        `;

        // Füge den Details-Container direkt unterhalb des Rezeptes hinzu
        recipeCard.appendChild(detailsContainer);
    } else {
        alert('Details not available.');
    }
}


function getIngredientsList(recipe) {
    // Zutatenliste für ein Rezept generieren
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


// Event-Listener für das Laden der Kategorien nach dem DOMContentLoaded-Event
document.addEventListener('DOMContentLoaded', loadCategories);