
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const allButton = document.getElementById("allBtn");
    const activeButton = document.getElementById("activeBtn");
    const inactiveButton = document.getElementById("inactiveBtn");
    const lightModeButton = document.getElementById("light-mode");
    let items = [];
    let currentFilter = null;

    function adddiv(container, element, index){
        const statusLabel = element.isActive ? "ON" : "OFF";
        container.innerHTML += `
            <div class="box">
                <div class="b1">
                    <img src='${element.logo}' alt="dd">
                    <div class="b2">
                        <p>${element.name}</p>
                        <p>${element.description}</p>
                    </div>
                </div>
                <div class="box_contain">
                    <button class="remove-btn" data-index="${index}">Remove</button>
                    <button class="status-btn" data-index="${index}" data-status="${element.isActive}">${statusLabel}</button>
                </div>
            </div>`;
    }

    container.addEventListener("click", event => {
        const removeButton = event.target.closest("button.remove-btn");
        if (removeButton) {
            const index = Number(removeButton.dataset.index);
            if (!Number.isNaN(index)) {
                items.splice(index, 1);
                renderData(currentFilter);
            }
            return;
        }

        const statusButton = event.target.closest("button.status-btn");
        if (statusButton) {
            const index = Number(statusButton.dataset.index);
            if (!Number.isNaN(index) && items[index]) {
                items[index].isActive = !Boolean(items[index].isActive);
                renderData(currentFilter);
            }
        }
    });

    function isActive(element) {
        return element.isActive === true || element.isActive === "true";
    }

    function isInactive(element) {
        return element.isActive === false || element.isActive === "false";
    }

    function renderData(filter) {
        if (!items.length) {
            fetch("data.json")
                .then(response => response.json())
                .then(data => {
                    items = data.slice();
                    currentFilter = filter || null;
                    container.innerHTML = "";
                    items.forEach((element, index) => {
                        if (!filter || filter(element)) {
                            adddiv(container, element, index);
                        }
                    });
                })
                .catch(error => console.error(error));
            return;
        }

        currentFilter = filter || null;
        container.innerHTML = "";
        items.forEach((element, index) => {
            if (!filter || filter(element)) {
                adddiv(container, element, index);
            }
        });
    }

    function setTheme(isLightMode) {
        document.body.classList.toggle("light-theme", isLightMode);
        if (lightModeButton) {
            lightModeButton.src = isLightMode ? "assets/images/icon-moon.svg" : "assets/images/icon-sun.svg";
            lightModeButton.alt = isLightMode ? "dark_mode" : "light_mode";
        }
    }

    if (lightModeButton) {
        lightModeButton.addEventListener("click", () => {
            const isLightMode = document.body.classList.contains("light-theme");
            setTheme(!isLightMode);
        });
    }

    function showAll(){
        allButton.style.background = "grey";
        activeButton.style.background = "";
        inactiveButton.style.background = "";
        renderData();
    }

    function showActive(){
        allButton.style.background = "";
        activeButton.style.background = "grey";
        inactiveButton.style.background = "";
        renderData(isActive);
    }

    function showInactive(){
        allButton.style.background = "";
        activeButton.style.background = "";
        inactiveButton.style.background = "grey";
        renderData(isInactive);
    }

    allButton.addEventListener("click", showAll);
    activeButton.addEventListener("click", showActive);
    inactiveButton.addEventListener("click", showInactive);

    setTheme(false);
    renderData();
});

