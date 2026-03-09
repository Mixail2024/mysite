const orders = [];

window.onload = function() {
    document.getElementById("btn_add_order").addEventListener("click", () => document.getElementById("dataInput").classList.toggle("hide"));
//    document.getElementById("btn_inf").addEventListener("click", () => inf2());

}




//=============================================CLASSES===========================================

//************************************** REcord
class Record {
    constructor(model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5){
        this.model = model;
        this.box = box;
        this.card = card;
        this.rail = rail;
        this.s1 = s1;
        this.s2 = s2;
        this.s3 = s3;
        this.s4 = s4;
        this.s5 = s5;
        this.w1 = w1;
        this.w2 = w2;
        this.w3 = w3;
        this.w4 = w4;
        this.w5 = w5;
    }
}

class Order {
    constructor(model, line, qty, staff, tact) {
        this.model = model;
        this.line = line ? 'wl' : 's';
        this.qty = qty;
        this.staff = staff;
        this.tact = tact;

        this.wrapper = document.getElementById("orders")
        this.addToTable();

        console.log(orders);
    }

    addToTable() {
        const tableOfOrders = document.getElementById('ordersTable');
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #ccc';
        row.innerHTML = `
            <td>${this.model}</td>
            <td>${this.line}</td>
            <td>${this.qty}</td>
            <td>${this.staff}</td>
            <td>${this.tact}</td>
            <td>${this.qty*this.tact}</td>
        `;
        tableOfOrders.appendChild(row);
    }




}




function formCreation() {
    // обертка для формы
    wrapper = document.getElementById('dataInput')

    // model selector
    let modelSelector = document.createElement('select');
    modelSelector.style.display = 'inline-block';
    modelSelector.style.margin = '0px 5px 0px 0px';
    let modelSelectorPlaceholder = document.createElement('option');
    modelSelectorPlaceholder.textContent = 'Choose model';
    modelSelectorPlaceholder.selected = true;
    modelSelector.appendChild(modelSelectorPlaceholder);
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        modelSelector.appendChild(option);
    });

    // флажок Line
    let checkboxLine = document.createElement('input');
    checkboxLine.type = 'checkbox';
    checkboxLine.id = 'LineCheckbox';

    // label Line
    let lblLine = document.createElement('label');
    lblLine.textContent = 'WL';

    //label back to qty selector
    let btnToQtySelector = document.createElement('button');
    btnToQtySelector.innerText = '<';
    btnToQtySelector.addEventListener('click', () => {
        orderQtyInput.value = '';
        orderQtyInput.classList.toggle("hide");
        btnToQtySelector.classList.toggle("hide");
        orderQtySelector.classList.toggle("hide");
        orderDefaultOption.selected = true;
    });
    btnToQtySelector.classList.add("hide");
    btnToQtySelector.classList.add('nav_btn');
    btnToQtySelector.style.margin = '0px 0px 0px 10px';
    btnToQtySelector.id = "btnToQtySelector";

    //селектор кол-ва штук
    let orderQtySelector = document.createElement('select');
    orderQtySelector.style.margin = '0px 0px 0px 8px';
    orderQtySelector.id = "orderQtySelector";
    const orderDefaultOption = document.createElement('option');
    orderDefaultOption.textContent = 'Choose qty';
    orderDefaultOption.disabled = true;
    orderDefaultOption.selected = true;
    orderQtySelector.appendChild(orderDefaultOption);
    const orderManually = document.createElement('option');
    orderManually.textContent = 'input manually';
    orderQtySelector.appendChild(orderManually);
    orderQtySelector.addEventListener('change', () => {
        if (orderQtySelector.value === 'input manually') {
            orderQtySelector.classList.add("hide");
            btnToQtySelector.classList.remove("hide");
            orderQtyInput.classList.remove("hide");
        };
    });
    for (let i = 63; i <= 630; i+=63) {
        const orderOption = document.createElement('option');
        orderOption.value = i;
        orderOption.textContent = i;
        orderQtySelector.appendChild(orderOption);
    };

    //input кол-ва штук
    let orderQtyInput = document.createElement('input');
    orderQtyInput.classList.add("hide");
    orderQtyInput.id = "orderQtyInput";
    orderQtyInput.style.width = '82px';
    orderQtyInput.placeholder = 'input qty';
    orderQtyInput.value = '';

    // label pcs
    let labelPcs = document.createElement('label');
    labelPcs.textContent = 'pcs';

    // селектор кол-ва людей
    let staffQtySelector = document.createElement('select');
    staffQtySelector.style.margin = '0px 5px 0px 15px';
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 5;
    defaultOption.selected = true;
    staffQtySelector.appendChild(defaultOption);
    for (let i = 4; i > 0; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        staffQtySelector.appendChild(option);
    };

    // label people
    let labelPeople = document.createElement('label');
    labelPeople.textContent = '🧍‍♂️';

    // btn Add
    let btnAdd = document.createElement('button');
    btnAdd.style.margin = '0px 5px 0px 10px';
    btnAdd.classList.add('nav_btn');
    btnAdd.textContent = 'Add';
    btnAdd.onclick = () => {
        let qty = !isNaN(orderQtySelector.value) ? Number(orderQtySelector.value) : (!isNaN(orderQtyInput.value) ? Number(orderQtyInput.value) : null);
        if (modelSelector.value != 'Choose model' && qty) {
            if (modelSelector.value && staffQtySelector.value) {
                const tactKey = (checkboxLine.checked ? 'w' : 's') + staffQtySelector.value;
                let found = false;
                console.log(tactKey);
                for (let i of obj_lst) {
                    if (i.model === modelSelector.value) {
                        found = true;
                        tact = i[tactKey];
                        break;
                    }
                }
            }
            orders.push(new Order(modelSelector.value, checkboxLine.checked, qty, staffQtySelector.value, Number(tact)));
            if (orders.length >0){
                document.getElementById('orders').classList.remove("hide");
            }

            console.log(orders);
        } else {
            btnAdd.textContent = 'Please fill all fields !';
            setTimeout(() => {
                btnAdd.textContent = 'Add';
            }, 3000);
        }
        wrapper.classList.add("hide");
    };



    wrapper.appendChild(modelSelector);
    wrapper.appendChild(checkboxLine);
    wrapper.appendChild(lblLine);
    wrapper.appendChild(btnToQtySelector);
    wrapper.appendChild(orderQtySelector);
    wrapper.appendChild(orderQtyInput);
    wrapper.appendChild(labelPcs);
    wrapper.appendChild(staffQtySelector);
    wrapper.appendChild(labelPeople);
    wrapper.appendChild(btnAdd);



};









//***********************************************  MAIN CODE

//парсим список имен и список моделей
const names = JSON.parse(document.getElementById('names_json').textContent);
const lst = JSON.parse(document.getElementById('lst_json').textContent);

// Создание списка объектов JS
const obj_lst = lst.map(
    ([model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5]) =>
        new Record(model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5));

formCreation();




