const hours = [];

window.onload = function() {
    document.getElementById("add_hour").addEventListener("click", createHour);
    document.getElementById("del_hour").addEventListener("click", delHour);
    document.getElementById("infor").addEventListener("click", myinfor);
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












//*************************************************** clas HOUR
class Hour {
    constructor(hourNum, shift) {
        this.hourNum = hourNum;
        this.shift = shift;
        this.hourFond = 3600;

        if (this.hourNum === 1) {
            switch (shift) {
                    case 'morning':
                        this.hourFrom = 6;
                        break;
                    case 'day':
                        this.hourFrom = 13;
                        break;
            }
        } else {
            switch (shift) {
                case 'morning':
                    this.hourFrom = 6 + this.hourNum - 1;
                    break;
                case 'day':
                    this.hourFrom = 13 + this.hourNum - 1;
                    break;
            }
        }

        this.hourTill = this.getNextHour(this.hourFrom)
        this.orders = [];
        this.breaks = [];
        this.add_hour();

    }


    add_hour() {
        document.getElementById('shiftSelect').disabled = true;

        // новый блок часа
        this.hourBox = document.createElement('div');
        this.hourBox.classList.add('hour-block');
        this.hourBox.id = 'hourBlock' + this.hourNum;


        // шапка
        const headBox = document.createElement('div');

        // interval
        const hourInterval = document.createElement('label');
        hourInterval.textContent = `${this.hourNum}. ${this.hourFrom}:00 - ${this.hourTill}:00`;

        // btn add order
        const btnAddOrder = document.createElement('button');
        btnAddOrder.innerText = 'add order'
        btnAddOrder.classList.add('nav_btn');
        btnAddOrder.style.margin = '0px 0px 0px 10px';
        btnAddOrder.addEventListener('click', () => this.addOrderToList(this.hourBox));

        // btn add break
        const btnAddBreak = document.createElement('button');
        btnAddBreak.innerText = 'add break'
        btnAddBreak.classList.add('nav_btn');
        btnAddBreak.style.margin = '0px 0px 0px 10px';
        btnAddBreak.addEventListener('click', () => this.addBreak(this.hourBox));


        //lbl InfoRaw
        this.lblInfoRaw = document.createElement('label');
        this.lblInfoRaw.style.marginLeft = '10px';



        headBox.appendChild(hourInterval);
        headBox.appendChild(btnAddOrder);
        headBox.appendChild(btnAddBreak);
        headBox.appendChild(this.lblInfoRaw);
        this.hourBox.appendChild(headBox);
        document.body.appendChild(this.hourBox);

    }

    calcNeededLeft() {
        let needed = 0;
        for (let i of this.orders) {
            if (i && typeof i.orderTime === 'number') {
                needed += i.orderTime;
            }
        }
        let left = this.hourFond - needed;
        return [needed.toFixed(2), left.toFixed(2)];
    }




    //__________________________метод добавления ordera в список
    addOrderToList(container) {
        let orderNum = this.orders.length + 1;
        this.orders.push(new Order(container, orderNum, this));

    }

    //__________________ метод определения следующего часа
    getNextHour(h) {
        let nh;
        if (h===24) {
            return nh = 1;
        } else {
            return nh = h+1;
        }
    }

    delHour() {
       this.hourBox.remove();
    }


}//**********class Hour_end


















//*****************************************************class ORDER
class Order {
    constructor (container, orderNum, hourInstance) {
        this.container = container;
        this.orderNum = orderNum;
        this.hour = hourInstance;



        this.calculateOrder = () => {
            if (this.modelSelector.value && this.staffQtySelector.value) {
                const tactKey = (this.checkboxWL.checked ? 'w' : 's') + this.staffQtySelector.value;
                let found = false;
                for (let i of obj_lst) {
                    if (i.model === this.modelSelector.value) {
                        found = true;
                        this.tactValue = i[tactKey];
                        this.inputTact.value = this.tactValue;
                        break;
                    }
                }


                // Если выбрано "input manually" и поле пустое — переключаем UI
                if (this.orderQtySelector.value === 'input manually' && this.orderQtyInput.value === '') {
                    this.orderQtySelector.classList.add("hide");
                    this.btnToQtySelector.classList.remove("hide");
                    this.orderQtyInput.classList.remove("hide");

                    // Предотвращаем повторное навешивание обработчика
                    if (!this.orderQtyInput._hasChangeHandler) {
                        this.orderQtyInput.addEventListener('change', () => this.calculateOrderTimeForInput());
                        this.orderQtyInput._hasChangeHandler = true;
                    }

                // ----- Если поле ввода активно и содержит число
                } else if (this.orderQtySelector.value === 'input manually' && !isNaN(Number(this.orderQtyInput.value))) {
                    this.calculateOrderTimeForInput();

                // ----- Если выбран preset из select'а
                } else if (this.orderQtySelector.value !== 'order qty') {
                    this.orderTime = Number(this.orderQtySelector.value) * this.tactValue;
                    this.left = this.hour.hourFond - this.orderTime;
                    this.lblOrderTime.textContent = 'needed: ' + this.orderTime.toFixed(2);
                    let [needed, left] = this.hour.calcNeededLeft();

                    if (needed > this.hour.hourFond + Number(this.tactValue)) {

                       this.qtyToNextHour = ((left/this.tactValue)*-1).toFixed(0);
                       this.qtyToFullHour = this.orderQtySelector.value - this.qtyToNextHour;
                       this.hour.lblInfoRaw.textContent = `Fond: ${this.hour.hourFond}, Needed: ${needed}, Left: ${left}, fit:${this.qtyToFullHour}, next:${this.qtyToNextHour}`; //!!!!!!FOND NEEDED LEFT new

                       createHour();
                       let nextHourBlock = document.getElementById('hourBlock' + (Number(this.hour.hourNum) + 1));
                       hours[this.hour.hourNum].addOrderToList(nextHourBlock);




                        this.orderQtySelector.classList.add("hide");
                        this.btnToQtySelector.classList.remove("hide");
                        this.orderQtyInput.classList.remove("hide");
                        this.orderQtySelector.value = 0;
                        this.orderQtyInput.value = this.qtyToFullHour;
                        this.orderTime = Number(this.orderQtyInput.value) * this.tactValue;
                        console.log(hours[this.hourNum-1].orders.at(-1).orderTime);
                        this.lblOrderTime.textContent = 'needed: ' + this.orderTime.toFixed(2);

////
//                        let [needed, left] = hours[this.hourNum-1].calcNeededLeft();
//                        console.log(needed, left);
//
//                        this.hour.lblInfoRaw.textContent = `Fond: ${this.hour.hourFond}, Needed: ${needed}, Left: ${left}`;


                    } else {
                        this.hour.lblInfoRaw.textContent = `Fond: ${this.hour.hourFond}, Needed: ${needed}, Left: ${left}`; //!!!!!!FOND NEEDED LEFT
                    }





                }
            } else {
                return;
            }
        }; //end calculateOrder

        this.addOrder();
    } //end constructor



     //расчет времени для поля инпут
    calculateOrderTimeForInput () {
        this.orderTime = this.orderQtyInput.value * this.tactValue;
        let [needed, left] = this.hour.calcNeededLeft();

        this.hour.lblInfoRaw.textContent = `Fond: ${this.hour.hourFond}, Needed: ${needed}, Left: ${left}`; //!!!!!!FOND NEEDED LEFT
        this.lblOrderTime.textContent = 'needed: ' + this.orderTime.toFixed(2);
    }







    addOrder () {
        // обертка
        this.wrapper = document.createElement('div');
        this.wrapper.style.display = 'flex';
        this.wrapper.style.alignItems = 'center';

        // label порядковый номер
        this.labelNum = document.createElement('label');
        this.labelNum.textContent = `${this.orderNum}.`;
        this.labelNum.style.marginLeft = '20px';

        // from
        this.orderFrom = document.createElement('input');
        this.orderFrom.setAttribute("type", "time");
        this.orderFrom.setAttribute("id", "lblfrom");
        this.orderFrom.setAttribute("value", this.hourFrom + ":00");
        this.orderFrom.readOnly = true;
//        this.orderFrom.addEventListener('change', this.calculateTimeDifference);

        this.orderTill = document.createElement('input'); //till
        this.orderTill.setAttribute("type", "time");
        this.orderTill.setAttribute("id", "lbltill");
        this.orderTill.setAttribute("value", this.hourFrom + ":15");
//        this.orderTill.addEventListener('change', this.calculateTimeDifference);



        // model selector
        this.modelSelector = selectTemplate.cloneNode(true);
        this.modelSelector.style.display = 'inline-block';
        this.modelSelector.style.margin = '0px 5px 0px 5px';
        this.modelSelector.addEventListener('change', this.calculateOrder);

        // флажок WL
        this.checkboxWL = document.createElement('input');
        this.checkboxWL.type = 'checkbox';
        this.checkboxWL.id = 'wlCheckbox';
        this.checkboxWL.addEventListener('change', this.calculateOrder);

        // label WL
        this.lblWL = document.createElement('label');
        this.lblWL.textContent = 'WL';

        //label back to qty selector
        this.btnToQtySelector = document.createElement('button');
        this.btnToQtySelector.innerText = '<';
        this.btnToQtySelector.addEventListener('click', () => this.backToQtySelector());
        this.btnToQtySelector.classList.add("hide");
        this.btnToQtySelector.classList.add('nav_btn');
        this.btnToQtySelector.style.margin = '0px 0px 0px 10px';
        this.btnToQtySelector.id = "btnToQtySelector";

        //селектор кол-ва штук
        this.orderQtySelector = document.createElement('select');
        this.orderQtySelector.style.margin = '0px 0px 0px 8px';
        this.orderQtySelector.id = "orderQtySelector";
        const orderDefaultOption = document.createElement('option');
        orderDefaultOption.textContent = 'order qty';
        orderDefaultOption.disabled = true;
        orderDefaultOption.selected = true;
        this.orderQtySelector.appendChild(orderDefaultOption);
        const orderManually = document.createElement('option');
        orderManually.textContent = 'input manually';
        this.orderQtySelector.appendChild(orderManually);
        this.orderQtySelector.addEventListener('change', this.calculateOrder);
        for (let i = 63; i <= 630; i+=63) {
            const orderOption = document.createElement('option');
            orderOption.value = i;
            orderOption.textContent = i;
            this.orderQtySelector.appendChild(orderOption);
        }

        //input кол-ва штук
        this.orderQtyInput = document.createElement('input');
        this.orderQtyInput.classList.add("hide");
        this.orderQtyInput.id = "orderQtyInput";
        this.orderQtyInput.style.width = '82px';
        this.orderQtyInput.placeholder = 'input qty';
        this.orderQtyInput.value = '';



        // label pcs
        this.labelPcs = document.createElement('label');
        this.labelPcs.textContent = 'pcs';


        // селектор кол-ва людей
        this.staffQtySelector = document.createElement('select');

        this.staffQtySelector.style.margin = '0px 5px 0px 15px';
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 5;
        defaultOption.selected = true;
        this.staffQtySelector.appendChild(defaultOption);
        this.staffQtySelector.addEventListener('change', this.calculateOrder);
        for (let i = 4; i > 0; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            this.staffQtySelector.appendChild(option);
        }

        // label people
        this.labelPeople = document.createElement('label');
        this.labelPeople.textContent = '🧍‍♂️';

        // input Tact
        this.inputTact = document.createElement('input');
        this.inputTact.style.marginLeft = '15px';
        this.inputTact.style.width = '60px';
        this.inputTact.placeholder = 'Tact';

        // label OrderTime
        this.lblOrderTime = document.createElement('label');
        this.lblOrderTime.style.width = '160px';
        this.lblOrderTime.style.marginLeft = '20px';
        this.lblOrderTime.textContent = 'Time';

        // btn Del order
        this.btnDelOrder = document.createElement('button');
        this.btnDelOrder.style.marginLeft = '180px';
        this.btnDelOrder.textContent = 'Del';
        this.btnDelOrder.onclick = () => {
            delOrder(this.hourNum, this.orderNum);
            this.wrapper.remove();
            let [needed, left] = this.hour.calcNeededLeft();
            this.hour.lblInfoRaw.textContent = `Fond: ${this.hour.hourFond}, Needed: ${needed}, Left: ${left}`;
        };


        this.wrapper.appendChild(this.labelNum);
        this.wrapper.appendChild(this.orderFrom);
        this.wrapper.appendChild(this.orderTill);
        this.wrapper.appendChild(this.modelSelector);
        this.wrapper.appendChild(this.checkboxWL);
        this.wrapper.appendChild(this.lblWL);
        this.wrapper.appendChild(this.btnToQtySelector);
        this.wrapper.appendChild(this.orderQtySelector);
        this.wrapper.appendChild(this.orderQtyInput);
        this.wrapper.appendChild(this.labelPcs);
        this.wrapper.appendChild(this.staffQtySelector);
        this.wrapper.appendChild(this.labelPeople);
        this.wrapper.appendChild(this.inputTact);
        this.wrapper.appendChild(this.lblOrderTime);
        this.wrapper.appendChild(this.btnDelOrder);

        this.container.appendChild(this.wrapper);
    }


    backToQtySelector() {
        this.orderQtyInput.value = 0;
        this.orderQtyInput.classList.toggle("hide");
        this.btnToQtySelector.classList.toggle("hide");
        this.orderQtySelector.classList.toggle("hide");
    }


    calculateTimeDifference () {
        let from = document.getElementById("lblfrom").value;
        let h_from = from.split(":")[0];
        let m_from = from.split(":")[1];
        let till = document.getElementById("lbltill").value;
        let h_till = from.split(":")[0];
        let m_till = from.split(":")[1];
        if (h_from == h_till == this.hourFrom) {
        }
    }





}










//***************************    FUNCTIONS   ************************************



function myinfor() {
    console.log(hours);
}

//___________________________функция создания hour
function createHour() {
    const shift = document.getElementById('shiftSelect').value;
    if (!shift) {
        alert('Choose your shift please!');
        return;
    }
    const hour = new Hour(hours.length + 1, shift);
    hours.push(hour);
}

//_______________________________функция удаления hour
function delHour() {
    const last_obj = (hours[(hours.length-1)]);
    last_obj.delHour();
    hours.pop();
    if (hours.length === 0){
        document.getElementById("shiftSelect").disabled = false;
    }

}


//_______________________________функция удаления ordera
function delOrder(h, o) {
   delete hours[h-1].orders[o-1];
}










//***********************************************  MAIN CODE

//парсим список имен и список моделей
const names = JSON.parse(document.getElementById('names_json').textContent);
const lst = JSON.parse(document.getElementById('lst_json').textContent);

// Создание списка объектов JS
const obj_lst = lst.map(
    ([model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5]) =>
        new Record(model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5)
);

// Заполняем основной select именами моделей
const selectTemplate = document.getElementById('modelSelect');
names.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    selectTemplate.appendChild(option);
});






