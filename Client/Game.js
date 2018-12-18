const screen = document.getElementById('scene');
const socket = io.connect('http://localhost:3000');


function Init(){
    (function GetMap() {

        fetch('http://localhost:3000/getRobot')
            .then((response) =>
                //console.log(response.json());
                response.json()
            ).then(data =>{                         //Объект Robot
            //console.log(data[0].Texture_link);
            return data}).then((Robot) =>{


        //Запрос на текстуру Plain
        fetch('http://localhost:3000/getPlain')
            .then((response) =>
                //console.log(response.json());
                response.json()
            ).then(data =>{                         //Объект Plain
            //console.log(data[0].Texture_link);
            return data}).then((Plain) =>{


        //Запрос на текстуру Forest
        fetch('http://localhost:3000/getForest')
            .then((response) =>
                //console.log(response.json());
                response.json()
            ).then(data =>{                         //Объект Forest
            //console.log(data[0].Texture_link);
            return data}).then((Forest) =>{

            //Запрос на текстуру Mount
            fetch('http://localhost:3000/getMount')
                .then((response) =>
                    //console.log(response.json());
                    response.json()
                ).then(data =>{                         //Объект Mount
                //console.log(data[0].Texture_link);
                return data;
            }).then((Mount) =>{
                Play(Plain,Mount,Forest, Robot);
                //console.log(Forest);
            })})})}); //Возможно, со скобкми вызвать надо!
    })();
}
Init();
function Play(Plain,Mount,Forest, MRobot){

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
            console.clear()
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

            console.log('location: ' + i,j);
            this.protectionBonus = 20;
            this.pointOnStep = 10;
            this.image = '../'+Mount[0].Texture_link;//Texture/Mountain.jpg';
            console.log('Присвоение стат!!!');
            console.log(Mount[0].Texture_link);
        }
    }

    class MapForest extends Map {
        constructor(i, j) {
            super(i, j);
            this.protectionBonus = 5;
            this.pointOnStep = 5;
            this.image = '../'+Forest[0].Texture_link;
        }
    }

    class MapPlain extends Map {
        constructor(i, j) {
            super(i, j);
            this.protectionBonus = 0;
            this.pointOnStep = 1;
            this.image = '../'+Plain[0].Texture_link;
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



    const dto = new class DTO {      //Сделать Синглтоном
        constructor() {
            //this.ob;
            //this.currentSelectedUnit; //id юнита

        }

        transfer(i, j, pointOnStep){

            if(this.rob !== undefined){
                if(this.pointOnStep(pointOnStep)){
                    this.rob.percentTired -= pointOnStep;   //Вычитание энергии при шаге

                    if( Math.abs(this.rob.i - i) <= 1 && Math.abs(this.rob.j - j) <= 1){        //Проверка на дальность хода





                        fetch('http://localhost:3000/getInf', {
                            method: 'post',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({id: this.rob.id,x:i ,y:j, energy: this.rob.percentTired, hp:this.rob.HP})});







                        this.rob.moveTo(i, j);
                        console.log("Abs i " + Math.abs(this.rob.i - i));
                        console.log("Abs j " + Math.abs(this.rob.j - j));
                    }
                    this.deleateIlluminationArea();
                    this.illuminationArea();
                }
            }else alert("С начала выберите робота");

        }

        pointOnStep(pointOnStep) {
            if(pointOnStep > this.rob.percentTired) {
                console.log("you can't going");
                alert('Очки движения закончились!');
                return false
            } return true
        }

        collectRobotInfo(robot) {

            if(this.rob == robot){      //Если кликнуть по роботу повторно, робот не будет выбранным
                this.rob.skin.classList.remove('selected');
                this.deleateIlluminationArea();
                this.rob = undefined;
                console.log("Сброс");
                return;
            }
            if(this.rob != undefined){
                this.battle();
                return;
            }


            this.rob = robot;
            this.illuminationArea();
            console.log('ID= ' + this.rob.id);
        }

        illuminationArea() {

            /*if(isNaN(m.mountainsArray[this.rob.i+1][this.rob.j] || m.mountainsArray[this.rob.i-1][this.rob.j] ||
                m.mountainsArray[this.rob.i][this.rob.j+1] || m.mountainsArray[this.rob.i][this.rob.j-1] )){
                console.log("Nan");
            }*/

            //el.skin.classList.remove('selected');
            if(this.rob.percentTired > m.mountainsArray[this.rob.i+1][this.rob.j].pointOnStep) {
                m.mountainsArray[this.rob.i+1][this.rob.j].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i-1][this.rob.j].pointOnStep) {
                m.mountainsArray[this.rob.i-1][this.rob.j].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i][this.rob.j+1].pointOnStep) {
                m.mountainsArray[this.rob.i][this.rob.j+1].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i][this.rob.j-1].pointOnStep) {
                m.mountainsArray[this.rob.i][this.rob.j-1].skin.classList.add('infoArea');
            }

            if(this.rob.percentTired > m.mountainsArray[this.rob.i+1][this.rob.j+1].pointOnStep) {
                m.mountainsArray[this.rob.i+1][this.rob.j+1].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i-1][this.rob.j-1].pointOnStep) {
                m.mountainsArray[this.rob.i-1][this.rob.j-1].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i-1][this.rob.j+1].pointOnStep) {
                m.mountainsArray[this.rob.i-1][this.rob.j+1].skin.classList.add('infoArea');
            }
            if(this.rob.percentTired > m.mountainsArray[this.rob.i+1][this.rob.j-1].pointOnStep) {
                m.mountainsArray[this.rob.i+1][this.rob.j-1].skin.classList.add('infoArea');
            }
        }

        deleateIlluminationArea() {
            m.mountainsArray.forEach((el, i)=> {                           //m - объект класса FillingMap

                el.forEach((el, i)=> {
                    el.skin.classList.remove('infoArea');
                })
            })
        }

        battle() {
            console.log("Attack!");
            return;
        }

    }();

    function getMapTileSize() {
        const width = document.getElementsByClassName('tileCell')[0].offsetWidth;
        const height = document.getElementsByClassName('tileCell')[0].offsetHeight;
        return {
            width: width,
            height: height,
        }
    }


    class Robot {
        constructor(id, elDispl){
            this.HP;
            this.damage;
            this.def;
            this.skin;
            this.percentTired;
            this.id = id;

            this.elDispl = elDispl; //Информация на дисплей о роботе

            //РАЗОБРАТЬСЯ!!!
            this.onclick = this.onclick.bind(this); // Правильно ли сделал?
            this.moveTo = this.moveTo.bind(this);
            this.render = this.render.bind(this);
        }

        moveTo(i, j) {
            const needsUpdate = this.i !==i || this.j !== j;
            this.rotateRob(i, j);
            this.i = i;
            this.j = j;
            if(needsUpdate) {
                this.render();
                changeStamina(this.elDispl.unitStamina, this.percentTired);
            }
        }

        onclick() {

            robotsArmy.robotsArray.forEach((el, i)=> {
                //el.getRobot().skin.classList.remove('selected');   //|||||||||||||||||     JSON.stringify(this.elDispl)
            });
            //console.log('This is a classList ' + this.skin.classList);
            console.log('This is a display ' + this.elDispl.unitHealth);

            //this.skin.classList.add('selected');
            dto.collectRobotInfo(this);
        }

        render() {
            const { width, height } = getMapTileSize();
            this.width = this.height = height;

            this.skin.style.width = this.width + 'px';
            this.skin.style.height = this.height + 'px';

            const borderSize = 4;

            this.skin.style.top = ((this.i) * (height) + (height - borderSize * 2) / 2 - this.height / 2) + 'px';
            this.skin.style.left = ((this.j) * (width) + (width - borderSize * 2) / 2 - this.width / 2) + 'px';
        }

        rotateRob(i, j){        //======ToDo
            if(this.j > j ){
                this.sprite = "../Texture/feavyRobotLeft.png";
                this.skin.style.backgroundImage = 'url(' + this.sprite + ')';
                console.log("this.skin.style.left = " + this.skin.style.left + ' j =' + j);

            }else if(this.j < j ){
                this.sprite = "../Texture/feavyRobotRight.png";
                this.skin.style.backgroundImage = 'url(' + this.sprite + ')';
                console.log("this.skin.style.left = " + this.skin.style.left + ' j =' + j);

            }else if(this.i > i ){
                this.sprite = "../Texture/feavyRobot.png";
                this.skin.style.backgroundImage = 'url(' + this.sprite + ')';
                //this.rob.render();
                console.log("this.skin.style.top = " + this.skin.style.top + 'i = ' + i);

            }else if(this.i < i ){
                this.sprite = "../Texture/Medium_robot.png";
                this.skin.style.backgroundImage = 'url(' + this.sprite + ')';
                //this.rob.render();
                console.log("this.skin.style.top = " + this.skin.style.top + 'i = ' + i);
            }
        }

        checkStep() {

        }
    }


    class feavyRobot extends Robot {
        constructor(posI, posJ, id, elDispl) {
            super(id, elDispl);
            this.HP = 100;
            this.damage = 25;
            this.def = 30;
            this.sprite = '../' + MRobot[0].Texture_link;//Texture/Medium_robot.png';
            this.percentTired = 100;

            this.width = 50;
            this.height = 50;

            this.i= posI;
            this.j = posJ;
        }
    }


    class wrapperRobot {             // Стоит ли так оставлять класс? Или метод генерации лучше в Робота перенести?
        constructor(r) {
            this.setupRobotSkin(r);
            this.ob = r;
        }

        setupRobotSkin(r) {
            r.skin = document.createElement('DIV');
            r.skin.className = 'robot';

            r.skin.style.width = r.width + 'px';
            r.skin.style.height = r.height + 'px';
            r.skin.style.backgroundImage = 'url(' + r.sprite + ')';
            screen.appendChild(r.skin);

            r.skin.onclick = r.onclick;
        }

        getRobot() {
            return this.ob;
        }

    }

    class Army {
        constructor(){
            this.robotsArray = [];    //ToDo
            this.IdGenerator = 0;
            this.disp = new Display();
            //console.log("Массив " + this.mas);
        }

        createArmy(countRob) {
            for(this.IdGenerator; this.IdGenerator < countRob; this.IdGenerator++){     //Сделать более осмысленный способ задания кол-ва роботов

                this.robotsArray[this.IdGenerator] = new wrapperRobot(new feavyRobot(1, this.IdGenerator, this.IdGenerator, this.disp.arrayIcon[this.IdGenerator]));   //1 - координата появления робота
                this.robotsArray[this.IdGenerator].getRobot().render();
                console.log("Проход " + this.IdGenerator);
                console.log("Проход генератора " + this.robotsArray[this.IdGenerator].getRobot().skin);

            }
        }
    }

    class Display {
        constructor() {
            this.arrayIcon = [];
        }

        createArrayIcon(count) {
            for(let i = 0; i < count; i++) {
                this.arrayIcon[i] = this.fillingArray();
            }
        }

        fillingArray() {
            const {unitCard, unitImage, unitHealth, unitStamina} = generateUnitCardInUID('../images/feavyRobot.png', 100, 100);
            let arr = unitCard;
            //array = unitCard;
            arr.unitImage = unitImage;
            arr.unitHealth = unitHealth;
            arr.unitStamina = unitStamina;
            return arr
        }
    }


//Если окно изменит размеры - всё перерендерить
    window.onresize = function () {
        robotsArmy.robotsArray.forEach((el) => {
            el.getRobot().render();
        });
    }


    m = new FillingMap();
    m.generateMap();


    const countRob = 3;
    robotsArmy = new Army();
    robotsArmy.disp.createArrayIcon(countRob);
    robotsArmy.createArmy(countRob);

//=====================================================================================================================

    function generateUnitCardInUID ( unitImageUrl, unitHealthValue, unitStaminaValue ) {
        /*
        Нужно получить вот это на выходе:
                <div class="unitCard">
                    <div class="unitImage"></div>
                    <div class="unitStats">
                        <div class="unitHealth" value="90%" style="background: linear-gradient(90deg, #ff0000 90%, transparent 0%)"></div>
                        <div class="unitStamina" value="50%" style="background: linear-gradient(90deg, #0000ff 50%, transparent 0%)"></div>
                    </div>
                </div>

             и вставить это в <div id="unitsScreen">
         */

        //нам надо создавать дивы и давать им всем имя класса. Пусть это функция делает!
        const newDiv = ( className ) => {
            let element = document.createElement('DIV');
            element.className = className;
            return element;
        };

        //Сама карточка:
        const unitCard = newDiv('unitCard');
        document.getElementById('unitsScreen').appendChild(unitCard);

        //Внутренности карточки - картинка и статы:
        const unitImage = newDiv('unitImage');
        unitImage.style.backgroundImage = 'url(' + unitImageUrl + ')';
        unitCard.appendChild(unitImage);

        const unitStats = newDiv('unitStats');
        unitCard.appendChild(unitStats);

        //внутренности unitStats - линия жизней и линия ходов:
        const unitHealth = newDiv('unitHealth');
        unitHealth.setAttribute('value', unitHealthValue + '%');
        unitHealth.style.background = 'linear-gradient(90deg, #ff0000,' + unitHealthValue + '%, transparent 0%)';
        unitStats.appendChild(unitHealth);

        const unitStamina = newDiv('unitStamina');
        unitStamina.setAttribute('value', unitStaminaValue + '%');
        unitStamina.style.background = 'linear-gradient(90deg, #0000ff,' + unitStaminaValue + '%, transparent 0%)';
        unitStats.appendChild(unitStamina);

        return{
            unitCard: unitCard,
            unitImage: unitImage,
            unitHealth: unitHealth,
            unitStamina: unitStamina,
        }

    }

    function changeStamina(unitStamina, unitStaminaValue) {
        unitStamina.setAttribute('value', unitStaminaValue + '%');
        unitStamina.style.background = 'linear-gradient(90deg, #0000ff,' + unitStaminaValue + '%, transparent 0%)';
    }

    function changeHealth(unitHealth, unitHealthValue) {
        unitHealth.setAttribute('value', unitHealthValue + '%');
        unitHealth.style.background = 'linear-gradient(90deg, #ff0000' + unitHealthValue + '%, transparent 0%)';
    }
//setInterval(function(){console.log('Последний?' + p)}, 1000);
}



