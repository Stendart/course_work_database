//Server logic
console.log('extended file');

class Map {
    constructor(i,j) {
        this.protectionBonus;
        this.pointOnStep;
        this.image;

        this.i = i;
        this.j = j;

        this.mapTileOnClick = this.mapTileOnClick.bind(this);
    }

    mapTileOnClick(e){
        console.clear();
        //console.log("Click", e);
        console.log('Map class click ' + this.i + " j: "+ this.j);
        try {
            dto.transfer(this.i, this.j, this.pointOnStep); //=======================================
        }
        catch(e) {
            console.log('Конец карты');
        }
    }

    calcPointOnStep() {

    }
}

class MapMountain extends Map {
    constructor(i, j) {
        super(i, j);
        this.protectionBonus = 20;
        this.pointOnStep = 10;
        this.image = 'Mountain.jpg';
    }
}

class MapForest extends Map {
    constructor(i, j) {
        super(i, j);
        this.protectionBonus = 5;
        this.pointOnStep = 5;
        this.image = 'Forest.jpg';
    }
}

class MapPlain extends Map {
    constructor(i, j) {
        super(i, j);
        this.protectionBonus = 0;
        this.pointOnStep = 1;
        this.image = 'Plain.jpg';
    }
}

class FillingMap {
    constructor() {
        this.mountainsArray = [];
    }

    addToArray(mapSection) {
        this.mountainsArray.push(mapSection);
    }

    createElement(Map, container) {
        Map.skin = document.createElement('DIV');
        Map.skin.className = 'tileCell';
        Map.skin.style.backgroundImage = 'url(' + Map.image + ')';
        container.appendChild(Map.skin);

        Map.skin.onclick = Map.mapTileOnClick;

        return Map;
    }

    generateMap() {

        for (let i = 0; i < 20; i++) {
            let row = document.createElement('DIV');
            //row = document.createElement('DIV');
            row.className = 'tilesRow';
            screen.appendChild(row);

            this.mountainsArray[i] = [];

            for (let j = 0; j < 10; j++) {
                let random = Math.random();
                if (random > 0.9){
                    this.mountainsArray[i][j] = this.createElement(new MapMountain(i, j), row);
                } else if(random < 0.1){
                    this.mountainsArray[i][j] = this.createElement(new MapForest(i,j), row);
                } else
                    this.mountainsArray[i][j] = this.createElement(new MapPlain(i,j), row);
            }
        }
    }
}