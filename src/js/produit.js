// Fonction qui apelle toutes mes fonctions automatiquement
(async function () {
	const productId = getParamId();
	const product = await getProduct(productId);
	hydrateProduct(product);
	onAddtoCart(product);
})();

// Permet de récuperer l'ID de notre produit dans l'url
function getParamId() {
	return new URL(location.href).searchParams.get('id');
}

// Fonction qui permet de recuperer le produit choisie
async function getProduct(productId) {
	return await fetch(`${apiUrl}/api/teddies/${productId}`)
		.then((res) => res.json())
		.then((products) => products)
		.catch((error) => {
			alert('SOLD OUT !');
		});
}

// Ajoute le choix du coloris
function colorOptions(product) {
	const productColors = product.colors;
	const productOption = document.getElementById('productOption');
	productColors.forEach((color) => {
		const optionColor = document.createElement('option');
		optionColor.setAttribute('value', color);
		optionColor.innerHTML = color;
		productOption.appendChild(optionColor);
	});
}

// Injecte les infos produits dans le HTML
function hydrateProduct(product) {
	document.getElementById('productImage').src = product.imageUrl;
	document.getElementById('productName').textContent = product.name;
	document.getElementById('productPrice').textContent = `${
		product.price / 100
	}.00 €`;
	document.getElementById('productDescription').textContent =
		product.description;
	colorOptions(product);
}

// Fonction pour ajouter un produit dans le localStorage
function addProductLocalStorage(productCart, productCartStorage) {
	// ajout dans le tableau de l'objet avec la couleur choisie
	productCartStorage.push(productCart);

	// transforme en json et envoie la key products dans le localstorage
	localStorage.setItem('products', JSON.stringify(productCartStorage));
}

//-------------- Récupération données séléctionner pour panier

function onAddtoCart(product) {
	// Sélection bouton ajout au panier
	const addToCart = document.querySelector('#addToCart');

	// Ecoute bouton addToCart
	addToCart.addEventListener('click', (e) => {
		e.preventDefault();

		const idForm = document.querySelector('#productOption');
		// Choix option dans une variable
		const optionChoice = idForm.value;

		// Récuperation valeurs panier
		let productCart = {
			name: product.name,
			color: optionChoice,
			price: product.price / 100,
			id: product._id,
		};

		// --------------------localStorage

		// Json.parse convertit les donnée au format json qui sont dans le local en objet javascript
		let productCartStorage = JSON.parse(localStorage.getItem('products'));

		//  si produit déja enregistrer dans le local
		if (productCartStorage) {
			addProductLocalStorage(productCart, productCartStorage);
			popupConfirm(productCart);
		} else {
			productCartStorage = [];
			addProductLocalStorage(productCart, productCartStorage);
			popupConfirm(productCart);
		}
	});
}

// Lorsque un article est ajouter au panier la fenetre popup s'ouvre
function popupConfirm(productCart) {
	if (
		window.confirm(`L'ourson ${productCart.name} en ${productCart.color} a bien été ajouté au panier
Consultez le panier OK ou revenir à l'accueil ANNULER`)
	) {
		window.location.href = './panier.html';
	} else {
		window.location.href = './../index.html';
	}
}
