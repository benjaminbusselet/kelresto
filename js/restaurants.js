class Restaurants {
	constructor() {
		this.markers = [];
	}

	createMarker(source) {
		if (
			google.maps.places.PlacesServiceStatus.OK &&
			(source.types[0] == 'restaurant' || source.types[1] == 'restaurant') &&
			source.reviews
		) {
			let marker = new google.maps.Marker({
				map: map,
				position: source.latlng,
				icon: {
					url: source.icon,
					scaledSize: new google.maps.Size(20, 20)
				},
				title: source.name,
				id: 'restaurant_' + source.name.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z ]/g, ''),
				rating: source.rating
			});

			google.maps.event.addListener(marker, 'click', function() {
				map.setCenter(marker.position);
				let strHTML = '<b>' + this.title + '</b><br />';
				let id = document.querySelectorAll('#' + this.id);

				id[0].parentNode.classList.toggle('active');
				if (id[0].nextSibling.style.maxHeight) {
					id[0].nextSibling.style.maxHeight = null;
					id[0].nextSibling.childNodes[3].style.display = 'none';
				} else {
					id[0].nextSibling.style.maxHeight = id[0].nextSibling.scrollHeight + 'vh';
					id[0].nextSibling.firstChild.style.display = 'block';
					id[0].scrollIntoView();
				}
			});
			this.markers.unshift(marker);
		}
	}

	createList(source) {
		if (
			google.maps.places.PlacesServiceStatus.OK &&
			(source.types[0] == 'restaurant' || source.types[1] == 'restaurant') &&
			source.reviews
		) {
			let List = document.getElementById('list');

			let Restaurant = document.createElement('div');
			Restaurant.className = 'restaurant';
			let note = Math.ceil(source.rating);
			Restaurant.setAttribute('data-rating', note);
			List.appendChild(Restaurant);

			let HeaderRestaurant = document.createElement('div');
			HeaderRestaurant.id =
				'restaurant_' + source.name.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z ]/g, '');
			Restaurant.appendChild(HeaderRestaurant);

			let TitleRestaurant = document.createElement('p');
			TitleRestaurant.className = 'title-restaurant';
			TitleRestaurant.textContent = source.name;
			HeaderRestaurant.appendChild(TitleRestaurant);

			let AdressRestaurant = document.createElement('p');
			AdressRestaurant.className = 'adress-restaurant';
			AdressRestaurant.textContent = source.vicinity;
			HeaderRestaurant.appendChild(AdressRestaurant);

			let NoteRestaurant = document.createElement('p');
			NoteRestaurant.className = 'starability-result';
			NoteRestaurant.setAttribute('data-rating', note);
			NoteRestaurant.textContent = note;
			HeaderRestaurant.appendChild(NoteRestaurant);

			let BodyRestaurant = document.createElement('div');
			BodyRestaurant.className = 'body-restaurant';
			Restaurant.appendChild(BodyRestaurant);

			let brbody = document.createElement('br');
			BodyRestaurant.appendChild(brbody);

			let SVRestaurant = document.createElement('img');
			SVRestaurant.className = 'svrestaurant';

			let lat = source.latlng.lat;
			let lng = source.latlng.lng;

			SVRestaurant.setAttribute(
				'src',
				'https://maps.googleapis.com/maps/api/streetview?size=300x200&location=' +
					lat +
					',' +
					lng +
					'&key=AIzaSyCeZE73r7X1AIkxje2eNIYmH_4Tx9HERRY'
			);
			BodyRestaurant.appendChild(SVRestaurant);

			let ButtonComment = document.createElement('button');
			ButtonComment.className = 'button_comment';
			ButtonComment.setAttribute('type', 'button');
			ButtonComment.textContent = 'Ajouter Un Commentaire';
			BodyRestaurant.appendChild(ButtonComment);

			let FormComment = document.createElement('form');
			FormComment.id = 'form_comment';
			let InputAuthorTitle = document.createElement('p');
			InputAuthorTitle.className = 'input_author_title';
			InputAuthorTitle.textContent = 'Votre Nom';
			FormComment.appendChild(InputAuthorTitle);
			let InputAuthor = document.createElement('input');
			InputAuthor.setAttribute('type', 'text');
			InputAuthor.setAttribute('name', 'author');
			FormComment.appendChild(InputAuthor);
			let NoteCommmentTitle = document.createElement('p');
			NoteCommmentTitle.className = 'note_comment_title';
			NoteCommmentTitle.textContent = 'Votre Note';
			FormComment.appendChild(NoteCommmentTitle);

			let array = [ 1, 2, 3, 4, 5 ];
			let NoteCommment = document.createElement('select');
			NoteCommment.id = 'mySelect';
			FormComment.appendChild(NoteCommment);

			for (let i = 0; i < array.length; i++) {
				let option = document.createElement('option');
				option.value = array[i];
				option.text = array[i];
				NoteCommment.appendChild(option);
			}
			let CommmentTitle = document.createElement('p');
			CommmentTitle.className = 'comment_title';
			CommmentTitle.textContent = 'Votre Commentaire';
			FormComment.appendChild(CommmentTitle);

			let Comment = document.createElement('textarea');
			Comment.setAttribute('name', 'comment');
			Comment.setAttribute('form', 'form_comment');
			FormComment.appendChild(Comment);

			let br = document.createElement('br');
			FormComment.appendChild(br);

			let ValideButtonComment = document.createElement('input');
			ValideButtonComment.id = 'validebutton_comment';
			ValideButtonComment.setAttribute('type', 'button');
			ValideButtonComment.setAttribute('value', 'Poster');

			FormComment.appendChild(ValideButtonComment);

			BodyRestaurant.appendChild(FormComment);

			let ReviewsRestaurant = document.createElement('div');
			ReviewsRestaurant.className = 'reviews-restaurant';

			let reviews = source.reviews;

			for (let i = 0; i < reviews.length; i++) {
				let Review = document.createElement('div');
				Review.className = 'review';
				let AuthorReview = document.createElement('p');
				AuthorReview.className = 'author-review';
				AuthorReview.textContent = reviews[i].author_name + ' ';
				Review.appendChild(AuthorReview);
				let NoteReview = document.createElement('p');
				NoteReview.className = 'starability-result';
				NoteReview.setAttribute('data-rating', reviews[i].rating);
				NoteReview.textContent = reviews[i].rating;
				Review.appendChild(NoteReview);
				let TextReview = document.createElement('p');
				TextReview.className = 'text-review';
				TextReview.textContent = reviews[i].text;
				Review.appendChild(TextReview);
				ReviewsRestaurant.appendChild(Review);
			}
			BodyRestaurant.appendChild(ReviewsRestaurant);

			ValideButtonComment.addEventListener('click', function() {
				event.preventDefault();

				let Review = document.createElement('div');
				Review.className = 'review';
				let AuthorReview = document.createElement('p');
				AuthorReview.className = 'author-review';
				AuthorReview.textContent = this.parentNode.childNodes[1].value;
				Review.appendChild(AuthorReview);
				let NoteReview = document.createElement('p');
				NoteReview.className = 'starability-result';
				NoteReview.setAttribute('data-rating', this.parentNode.childNodes[3].value);
				NoteReview.textContent = this.parentNode.childNodes[3].value;
				Review.appendChild(NoteReview);
				let TextReview = document.createElement('p');
				TextReview.className = 'text-review';
				TextReview.textContent = this.parentNode.childNodes[5].value;
				Review.appendChild(TextReview);
				ReviewsRestaurant.appendChild(Review);

				ReviewsRestaurant.insertBefore(Review, ReviewsRestaurant.childNodes[0]);

				NoteRestaurant.setAttribute(
					'data-rating',
					Math.ceil(
						(parseFloat(NoteRestaurant.dataset.rating) + parseFloat(this.parentNode.childNodes[3].value)) /
							2
					)
				);

				FormComment.reset();
				FormComment.style.display = 'none';
				ButtonComment.style.display = 'block';
			});

			HeaderRestaurant.addEventListener('click', function() {
				this.parentNode.classList.toggle('active');
				if (BodyRestaurant.style.maxHeight) {
					BodyRestaurant.style.maxHeight = null;
					FormComment.style.display = 'none';
				} else {
					BodyRestaurant.style.maxHeight = BodyRestaurant.scrollHeight + 'vh';
					HeaderRestaurant.scrollIntoView();
				}
			});

			ButtonComment.addEventListener('click', function() {
				FormComment.style.display = 'block';
				ButtonComment.style.display = 'none';
			});

			List.insertBefore(Restaurant, List.childNodes[0]);
		}
	}

	filter() {
		let restaurants = document.querySelectorAll('.restaurant');
		let filtermin = document.querySelector('#filter-min').value;
		let filtermax = document.querySelector('#filter-max').value;
		console.log(filtermax);

		for (let i = 0; i < restaurants.length; i++) {
			if (this.markers[i] != undefined) {
				let note = restaurants[i].dataset.rating;
				if (note >= filtermin && note <= filtermax) {
					console.log(note);
					restaurants[i].style.display = 'block';
					this.markers[i].setMap(map);
				} else {
					restaurants[i].style.display = 'none';
					restaurants[i].style.border = 'none';
					this.markers[i].setMap(null);
				}
			}
		}
	}

	reset() {
		let restaurants = document.querySelectorAll('.restaurant');

		for (let i = 0; i < restaurants.length; i++) {
			restaurants[i].style.display = 'block';
			restaurants[i].style.borderBottom = '1px solid';
			this.markers[i].setMap(map);
		}
	}
}
