// Json.parse convertit les donnée au format json qui sont dans le local en objet javascript
let productCartStorage = JSON.parse(localStorage.getItem('products'));
console.log(productCartStorage);

// Selection de la classe ou le code HTML sera injecter
const containerPanier = document.querySelector('#containerPanier');
let basketProducts = [];

// Si le panier est vide
if (productCartStorage === null || productCartStorage == 0) {
	const emptyBasket = `<div class = "container-emptyBasket font-weight-bold">
							<div> Le panier est vide </div>
						</div>`;
	containerPanier.innerHTML = emptyBasket;
}
// Combien d'article dans le local ?
else {
	for (i = 0; i < productCartStorage.length; i++) {
		basketProducts =
			basketProducts +
			`
	<div class="recapPanier d-flex justify-content-around mb-4">
		<div class="w-25 text-left">${productCartStorage[i].name} / ${productCartStorage[i].color}</div>	
		<div class="">${productCartStorage[i].price}€ </div>
	</div>
	`;
	}
	if (i === productCartStorage.length) {
		// injection HTML
		containerPanier.innerHTML = basketProducts;
	}
}

// Tout les prix des produits sont mis dans un tableau pour être calculer avec reducer
let getPrice = [];
for (let p = 0; p < productCartStorage.length; p++) {
	productCartStorage[p].price;
	getPrice.push(productCartStorage[p].price);
}

// additionner tout les prix du tableau
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const totalPrice = getPrice.reduce(reducer, 0);

// Afficher prix total dans le HTML
const displayTotalPrice = `<div class="font-weight-bold"> Le prix total est de : ${totalPrice}€</div>`;
containerPanier.insertAdjacentHTML('beforeend', displayTotalPrice);

// Selection bouton envoie formulaire
const submitForm = document.querySelector('#formPost');

submitForm.addEventListener('click', (e) => {
	e.preventDefault();
	// Récupération des valeurs du form
	const contact = {
		firstName: document.querySelector('#firstName').value,
		lastName: document.querySelector('#lastName').value,
		address: document.querySelector('#address').value,
		city: document.querySelector('#city').value,
		email: document.querySelector('#email').value,
	};

	// --------Validation formulaire
	function firstNameControle() {
		const firstName = contact.firstName;
		if (/^[A-Za-z]{3,20}$/.test(firstName)) {
			return true;
		} else {
			alert(
				'Chiffre et symbole ne sont pas autorisé \n Ne pas dépasser 20 caractères, minimum 3 caractères.'
			);
			return false;
		}
	}

	// Mettre l'objet "contact" dans le localStorage
	localStorage.setItem('contact', JSON.stringify(contact));
});
