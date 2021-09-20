// Json.parse convertit les donnée au format json qui sont dans le local en objet javascript
let productCartStorage = JSON.parse(localStorage.getItem('products'));
// Selection de la classe ou le code HTML sera injecter
const containerPanier = document.querySelector('#containerPanier');
// Selection bouton envoie formulaire
const submitForm = document.querySelector('#formPost');
// Création de tableau pour afficher le panier
let basketProducts = [];
// Tableau pour stocker l'id des produits à envoyer au serveur
let products = [];

// Fonction qui recupere les produits dans le localStorage pour alimenter la page panier
function hydrateCart(productCartStorage, basketProducts) {
	/// Action quand le panier est vide
	if (productCartStorage === null || productCartStorage == 0) {
		const emptyBasket = `<div class = "container-emptyBasket font-weight-bold">
	<div> Le panier est vide </div>
</div>`;
		containerPanier.innerHTML = emptyBasket;
	}
	{
		// Ajouter dans le tableau besketProducts les produits enregistrer dans le localStorage
		for (i = 0; i < productCartStorage.length; i++) {
			basketProducts =
				basketProducts +
				`
	<div class="recapPanier d-flex justify-content-around mb-4">
		<div class="w-25 text-left">${productCartStorage[i].name} / ${productCartStorage[i].color}</div>	
		<div class="">${productCartStorage[i].price}€ </div>
	</div>
	`;
			// Ajouter l'ID des produits dans le tableau "Products"
			products.push(`${productCartStorage[i].id}`);
		}
	}

	/// Action quand le panier est plein
	if (i === productCartStorage.length) {
		// injection du tableau basketProducts dans le HTML
		containerPanier.innerHTML = basketProducts;
	}
}
hydrateCart(productCartStorage, basketProducts);

function totalPrice(productCartStorage) {
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
}
totalPrice(productCartStorage);

function formValidation(e) {
	const formAttributesWithValidation = [
		(rule = {
			label: 'firstName',
			value: e.target.firstName.value,
			error_message: 'Veuillez entrez votre firstname',
			regex: /^[A-Za-z]{3,20}$/,
		}),
		(rule = {
			label: 'lastName',
			value: e.target.lastName.value,
			error_message: 'Veuillez entrez votre lastName',
			regex: /^[A-Za-z]{3,20}$/,
		}),
		(rule = {
			label: 'address',
			value: e.target.address.value,
			error_message: 'Veuillez entrez votre lastName',
			regex: /^[A-Za-z0-100\s]{5,50}$/,
		}),
		(rule = {
			label: 'city',
			value: e.target.city.value,
			error_message: 'Veuillez indiquer votre ville',
			regex: /^[A-Za-z\s]{3,45}$/,
		}),
		(rule = {
			label: 'email',
			value: e.target.email.value,
			error_message: 'Veuillez indiquer votre adresse mail',
			regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
		}),
	];

	const errorsValidations = [];

	// Boucle de verification ....
	formAttributesWithValidation.forEach((rule) => {
		if (rule.regex.test(rule.value) === false) {
			errorsValidations.push({
				label: rule.label,
				message: rule.error_message,
			});
		}
	});

	// controle validité formulaire avant envoie danz le local storage
	if (errorsValidations.length != 0) {
		return alert('Veuillez remplir le formulaire');
	}

	const contactArray = formAttributesWithValidation.map((item) => {
		return [item.label, item.value];
	});

	// Transformer contactArray en Objet "contact"
	const contact = Object.fromEntries(contactArray);
	const order = {
		contact: contact,
		products: products,
	};
	console.log("order");

console.log(order);
}

// Lors de l'envoie du formulaire les infos sont controller et les données sont envoyée au serveur
function sendOrder(order) {
	submitForm.addEventListener('submit', (e) => {
		e.preventDefault();
		formValidation(e);
		// Envoie de l'objet order au serveur
		const requestServer = fetch(`${apiUrl}/api/teddies/order`, {
			method: 'POST',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});

		requestServer.then(async (response) => {
			try {
				const data = await response.json();
				localStorage.removeItem(productCartStorage);
				window.location.href = `./confirmation.html?orderId=${data.orderId}`;
			} catch (e) {
				alert('Oups un probleme est survenu');
			}
		});
	});
}
sendOrder();
