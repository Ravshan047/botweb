let tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let total = 0;

function addToCart(product, price) {
    cart.push({ name: product, price: price });
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} so'm`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Olib tashlash';
        removeBtn.onclick = () => removeFromCart(index);
        li.appendChild(removeBtn);
        cartItems.appendChild(li);
    });
    document.getElementById('total').textContent = `Jami: ${total} so'm`;
}

function removeFromCart(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
}

function sendOrder() {
    if (cart.length === 0) {
        alert('Savat bo\'sh!');
        return;
    }
    const orderData = {
        items: cart,
        total: total
    };
    tg.sendData(JSON.stringify(orderData));
}

function showAdmin() {
    document.getElementById('adminPanel').style.display = 'block';
}

function loginAdmin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === 'admin123') { // Simple password
        document.getElementById('adminContent').style.display = 'block';
    } else {
        alert('Noto\'g\'ri parol');
    }
}

function addNewItem() {
    const name = document.getElementById('newItemName').value;
    const price = document.getElementById('newItemPrice').value;
    const category = document.getElementById('newItemCategory').value;
    if (name && price) {
        // For demo, add to DOM (not persistent)
        const menuSection = document.querySelector(`#menu h2:contains('${category}') + .menu-section`);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="https://via.placeholder.com/150" alt="${name}">
            <h3>${name}</h3>
            <p>${price} so'm</p>
            <button onclick="addToCart('${name}', ${price})">Qo'shish</button>
        `;
        menuSection.appendChild(card);
        alert('Mahsulot qo\'shildi!');
    }
}