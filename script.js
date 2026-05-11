let tg = window.Telegram.WebApp;

tg.expand();

function buyProduct(product){

    tg.sendData(product);

}