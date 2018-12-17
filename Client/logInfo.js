const socket = io.connect('http://localhost:3000');

let inp = document.getElementsByTagName('input');
let btnNext = document.getElementById('next');

console.log(inp);
let id = 1; //привязать к кнопке
/*inp.forEach(function (el){
    console.log(el);
});*/

//btnNext.onclick = ()=>{
//    id++;
    socket.emit('report', {id:id/*, robot:ind*/});
    socket.on('serverRepo', (data)=>{
        console.log('server report');
        console.log(data);
        for(let i =0; i < inp.length; i++){
            console.log(inp[i]);
            inp[i].value = data[0];
        }

        for(let key in data[1]){
            console.log('Идет?');
            console.log(key + ' значение ' );
        }
        /*inp.forEach(function (el,ind) {
            //el.innerHTML = data[2];
            console.log(el);
        });*/
        console.log(data[1]); //не видит конкретных элементов массива
    });
//};