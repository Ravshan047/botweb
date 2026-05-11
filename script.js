let tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let total = 0;
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [
    { name: 'Burger', price: 25000, category: 'Burgers' },
    { name: 'Cheese Burger', price: 30000, category: 'Burgers' },
    { name: 'Lavash', price: 30000, category: 'Lavash' },
    { name: 'Chicken Lavash', price: 35000, category: 'Lavash' },
    { name: 'Coca Cola', price: 10000, category: 'Ichimliklar' },
    { name: 'Pepsi', price: 10000, category: 'Ichimliklar' },
    { name: 'Caesar Salad', price: 20000, category: 'Salads' },
    { name: 'Greek Salad', price: 22000, category: 'Salads' },
    { name: 'Chocolate Cake', price: 15000, category: 'Desserts' },
    { name: 'Ice Cream', price: 12000, category: 'Desserts' }
];

function loadMenu() {
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) categories[item.category] = [];
        categories[item.category].push(item);
    });
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';
    for (const [cat, items] of Object.entries(categories)) {
        menuDiv.innerHTML += `<h2>${cat}</h2><div class="menu-section" id="${cat}"></div>`;
        const section = document.getElementById(cat);
        items.forEach(item => {
            section.innerHTML += `
                <div class="card">
                    <img src="https://via.placeholder.com/150" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.price} so'm</p>
                    <button onclick="addToCart('${item.name}', ${item.price})">Qo'shish</button>
                </div>
            `;
        });
    }
}

loadMenu();

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
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Manzilni kiriting!');
        return;
    }
    const orderData = {
        items: cart,
        total: total,
        address: address
    };
    tg.sendData(JSON.stringify(orderData));
}

function showAdmin() {
    document.getElementById('adminPanel').style.display = 'block';
}

function loginAdmin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === 'admin123') {
        document.getElementById('adminContent').style.display = 'block';
        loadAdminItems();
    } else {
        alert('Noto\'g\'ri parol');
    }
}

function addNewItem() {
    const name = document.getElementById('newItemName').value;
    const price = parseInt(document.getElementById('newItemPrice').value);
    const category = document.getElementById('newItemCategory').value;
    if (name && price && category) {
        menuItems.push({ name, price, category });
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenu();
        loadAdminItems();
        alert('Mahsulot qo\'shildi!');
    } else {
        alert('Barcha maydonlarni to\'ldiring!');
    }
}

function loadAdminItems() {
    const adminList = document.getElementById('adminItems');
    adminList.innerHTML = '';
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} so'm (${item.category})`;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Tahrirlash';
        editBtn.onclick = () => editItem(index);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'O\'chirish';
        deleteBtn.onclick = () => deleteItem(index);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        adminList.appendChild(li);
    });
}

function editItem(index) {
    const item = menuItems[index];
    document.getElementById('newItemName').value = item.name;
    document.getElementById('newItemPrice').value = item.price;
    document.getElementById('newItemCategory').value = item.category;
    // For simplicity, reuse add button, but mark as edit
    // Actually, add a save edit function
}

function deleteItem(index) {
    menuItems.splice(index, 1);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    loadMenu();
    loadAdminItems();
}