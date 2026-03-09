document.getElementById('uploadBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function() {
    if (this.files.length) {
        let fileName = this.files[0].name;
        document.getElementById('fileInfo').textContent = `File "${fileName}" loading...`;
        document.getElementById('fileNameInput').value = fileName;  // Заполняем скрытое поле
        document.getElementById('uploadForm').submit();  // Отправляем форму
    }
});

function toggleChildren(element) {
        var nestedList = element.nextElementSibling; // Получаем вложенный список
        if (nestedList.style.display === "none") {
            nestedList.style.display = "block"; // Показываем подкатегории
            element.innerHTML = "&#9662; " + element.innerHTML.slice(2); // Меняем значок
        } else {
            nestedList.style.display = "none"; // Скрываем подкатегории
            element.innerHTML = "&#9656; " + element.innerHTML.slice(2); // Меняем значок
        }
    }



function openTab(event, tabId) {
    let parentContainer = event.currentTarget.closest('.tabs'); // Ищем контейнер вкладок
    if (!parentContainer) return;

    // Отключаем активную кнопку внутри текущего блока вкладок
    parentContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Отключаем все .tab-content внутри родительского контейнера
    let contentContainer = parentContainer.parentElement; // Берем общий контейнер
    contentContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Активируем нужную вкладку
    let targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Объект с автоматическими активациями
    let autoTabs = {
        "Silver": "dg",
        "WL": "k_wl",
        "bbox_main": "bbox"

    };

    // Автоматическая активация вложенной вкладки
    if (autoTabs[tabId]) {
        setTimeout(() => {
            let nestedTab = document.getElementById(autoTabs[tabId]);
            let nestedBtn = document.querySelector(`.tab-button[onclick*='${autoTabs[tabId]}']`);

            if (nestedTab) {
                nestedTab.classList.add('active');
            }

            if (nestedBtn) {
                nestedBtn.classList.add('active');
            }
        }, 50);
    }
}
