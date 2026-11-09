
        const preview = document.getElementById("preview");
        const hexCode = document.getElementById("hexCode");
        const colorPicker = document.getElementById("colorPicker");
        const palette = document.getElementById("palette");
        const savedColors = document.getElementById("savedColors");
        const notification = document.getElementById("notification");

        let currentColor = "#667EEA";

        let favorites = [];

        try {
            const saved = JSON.parse(localStorage.getItem("favoriteColors"));

            if (Array.isArray(saved)) {
                favorites = saved.filter(color =>
                    typeof color === "string" &&
                    /^#[0-9A-F]{6}$/i.test(color)
                );
            }
        } catch (error) {
            favorites = [];
        }

        function changeColor(color) {
            if (!/^#[0-9A-F]{6}$/i.test(color)) return;

            currentColor = color.toUpperCase();

            preview.style.background = currentColor;
            document.body.style.background = currentColor;
            hexCode.textContent = currentColor;
            colorPicker.value = currentColor;

            notification.textContent = "";
        }

        function generateColor() {
            const characters = "0123456789ABCDEF";
            let color = "#";

            for (let i = 0; i < 6; i++) {
                color += characters[
                    Math.floor(Math.random() * 16)
                ];
            }

            changeColor(color);
        }

        function generatePalette() {
            palette.innerHTML = "";

            for (let i = 0; i < 10; i++) {
                const characters = "0123456789ABCDEF";
                let color = "#";

                for (let j = 0; j < 6; j++) {
                    color += characters[
                        Math.floor(Math.random() * 16)
                    ];
                }

                const colorElement = document.createElement("div");

                colorElement.className = "palette-color";
                colorElement.style.background = color;
                colorElement.title = color;

                colorElement.addEventListener("click", () => {
                    changeColor(color);
                });

                palette.appendChild(colorElement);
            }
        }

        function saveFavorites() {
            localStorage.setItem(
                "favoriteColors",
                JSON.stringify(favorites)
            );
        }

        function renderFavorites() {
            savedColors.innerHTML = "";

            if (favorites.length === 0) {
                savedColors.innerHTML =
                    '<p class="empty">Пока нет сохранённых цветов</p>';
                return;
            }

            favorites.forEach((color, index) => {
                const item = document.createElement("div");

                item.className = "saved-item";
                item.style.background = color;
                item.title = color;

                item.addEventListener("click", event => {
                    if (event.target.tagName !== "BUTTON") {
                        changeColor(color);
                    }
                });

                const deleteButton = document.createElement("button");

                deleteButton.textContent = "×";
                deleteButton.title = "Удалить цвет";

                deleteButton.addEventListener("click", () => {
                    favorites.splice(index, 1);
                    saveFavorites();
                    renderFavorites();
                });

                item.appendChild(deleteButton);
                savedColors.appendChild(item);
            });
        }

        document.getElementById("generateButton")
            .addEventListener("click", () => {
                generateColor();
                generatePalette();
            });

        document.getElementById("copyButton")
            .addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(currentColor);
                    notification.textContent = "✅ Цвет скопирован!";
                } catch (error) {
                    notification.textContent =
                        "Не удалось скопировать. Код: " + currentColor;
                }
            });

        colorPicker.addEventListener("input", event => {
            changeColor(event.target.value);
        });

        document.getElementById("saveButton")
            .addEventListener("click", () => {
                if (favorites.includes(currentColor)) {
                    notification.textContent = "Этот цвет уже сохранён!";
                    return;
                }

                favorites.push(currentColor);

                saveFavorites();
                renderFavorites();

                notification.textContent = "❤️ Цвет добавлен в избранное!";
            });

        changeColor(currentColor);
        generatePalette();
        renderFavorites();

