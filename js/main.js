//création de l'objet Map
const map = new google.maps.Map(document.getElementById('map'), {
	center: {
		lat: 46.478,
		lng: 2.517
	},
	zoom: 6,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	overviewMapControl: false,
	fullscreenControl: false,
	zoomControl: true,
	navigationControlOptions: {
		style: google.maps.NavigationControlStyle.SMALL
	},
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	styles: [
		{
			featureType: 'poi',
			stylers: [
				{
					visibility: 'off'
				}
			]
		}
	]
});

//déclaration des outils Gmap
const service = new google.maps.places.PlacesService(map);
const objInfoWindow = new google.maps.InfoWindow();

//Utilisation de la géolocalisation HTML5
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		const pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		//création de l'objet Carte
		const gmap = new GMap(pos);
		gmap.addPositionMarker();
		gmap.addText();

		//création de l'objet Restaurants
		const restos = new Restaurants();
		getLocalSources(restos, pos);
		getGmapSources(restos, pos).then(function(results) {
			return findDetail(restos, results);
		});
		addRestaurant(restos);

		//lancement de la fonction de filtre
		const FilterButton = document.querySelector('#filter-button');
		FilterButton.addEventListener('click', function() {
			restos.filter();
		});

		//lancement de la fonction de reset du filtre
		const ResetButton = document.querySelector('#reset-button');
		ResetButton.addEventListener('click', function() {
			restos.reset();
		});
	});
} else {
	alert("Le service de géolocalisation n'est pas disponible sur votre ordinateur.");
}

function getLocalSources(restos, pos) {
	const sourceLocal = 'js/listresto.json';
	ajax(sourceLocal, function(response) {
		const parseLocal = JSON.parse(response);
		const placelocal = parseLocal.results;
		for (let i = 0; i < placelocal.length; i++) {
			restos.createMarker(placelocal[i]);
			restos.createList(placelocal[i]);
		}
	});
}

function getGmapSources(restos, pos) {
	let request = {
		location: pos,
		type: [ 'restaurant' ],
		rankBy: google.maps.places.RankBy.DISTANCE,
		fields: [
			'id',
			'name',
			'geometry',
			'formatted_address',
			'formatted_phone_number',
			'photos',
			'rating',
			'user_ratings_total'
		]
	};
	return new Promise(function(resolve, reject) {
		service.nearbySearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				resolve(results);
			} else {
				reject(status);
			}
		});
	});
}

function findDetail(restos, place) {
	return new Promise(function(resolve, reject) {
		for (let i = 0; i < place.length; i++) {
			service.getDetails(
				{
					placeId: place[i].place_id,
					fields: [ 'name', 'icon', 'id', 'types', 'rating', 'vicinity', 'geometry', 'reviews' ]
				},
				function(place, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						place.latlng = place.geometry.location.toJSON();
						delete place['geometry'];
						delete place['id'];
						restos.createMarker(place);
						restos.createList(place);
					} else {
						reject(status);
					}
				}
			);
		}
	});
}

function addRestaurant(restos) {
	const geocoder = new google.maps.Geocoder();
	const modal = document.getElementById('myModal');
	var span = document.getElementsByClassName('close')[0];
	map.addListener('click', function(event) {
		modal.style.display = 'block';
		geocoder.geocode(
			{
				latLng: event.latLng
			},
			function(results, status) {
				if (status === 'OK') {
					map.panTo(event.latLng);
					const ValideButtonNewResto = document.querySelector('#validebutton_new_resto');
					ValideButtonNewResto.addEventListener('click', function(event) {
						event.preventDefault();
						const FormNewResto = document.querySelector('#form_new_resto');
						let nameresto = FormNewResto.childNodes[3].value;
						let noteresto = FormNewResto.childNodes[11].value;
						let nameauthor = FormNewResto.childNodes[7].value;
						let commentresto = FormNewResto.childNodes[15].value;
						let newresto = {
							name: nameresto,
							icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
							latlng: {
								lat: results[0].geometry.location.toJSON().lat,
								lng: results[0].geometry.location.toJSON().lng
							},
							vicinity: results[0].formatted_address,
							types: [ 'restaurant' ],
							rating: noteresto,
							reviews: [
								{
									author_name: nameauthor,
									rating: noteresto,
									text: commentresto
								}
							]
						};

						restos.createList(newresto);
						restos.createMarker(newresto);
						modal.style.display = 'none';
					});
				}
			}
		);
		span.onclick = function() {
			modal.style.display = 'none';
		};
	});
}
