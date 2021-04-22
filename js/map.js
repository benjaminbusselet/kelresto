class GMap {
    constructor(pos) {
        this.pos = pos;
    }

    addPositionMarker() {
        let myMarker = new google.maps.Marker({
            map: map,
            position: this.pos,
            title: "Vous êtes ici !"
        });
        map.setCenter(this.pos);
        map.setZoom(16);
    };

    addText() {

        let Message = document.createElement('p');
        Message.style.fontFamily = 'Gill Sans,sans-serif';
        Message.style.fontSize = '20px';
        Message.style.lineHeight = '38px';
        Message.style.marginTop = '60px';
        Message.style.paddingLeft = '5px';
        Message.style.paddingRight = '5px';
        Message.style.borderRadius = '3px';
        Message.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        Message.style.backgroundColor = 'orange';
        Message.style.opacity = "0.8";

        Message.innerHTML = 'Cliquez sur la carte pour ajouter un restaurant';
        var myTextDiv = document.createElement('div');
        myTextDiv.appendChild(Message);

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(myTextDiv);
    }
};
