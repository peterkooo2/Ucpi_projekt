// Shared search + preview functionality
(function () {
    "use strict";

    const routes = {
        "škola": "school.html",
        "skola": "school.html",
        "school": "school.html",
        "já": "me.html",
        "ja": "me.html",
        "me": "me.html",
        "budoucnost": "future.html",
        "future": "future.html",
        "home": "index.html",
        "domů": "index.html",
        "domu": "index.html"
    };

    const routeLabels = {
        "škola": "🎓 Škola",
        "skola": "🎓 Škola",
        "school": "🎓 Škola",
        "já": "👤 Já",
        "ja": "👤 Já",
        "me": "👤 Já",
        "budoucnost": "🚀 Budoucnost",
        "future": "🚀 Budoucnost",
        "home": "🏠 Home",
        "domů": "🏠 Domů",
        "domu": "🏠 Domů"
    };

    const searchInput = document.getElementById('searchInput');
    const searchPreview = document.getElementById('searchPreview');
    let selectedIndex = -1;

    if (!searchInput || !searchPreview) return;

    function showPreview(matches) {
        searchPreview.innerHTML = "";
        selectedIndex = -1;

        if (!matches.length) {
            searchPreview.style.display = "none";
            return;
        }

        matches.forEach((match) => {
            const item = document.createElement("div");
            item.className = "search-preview-item";
            item.textContent = (routeLabels[match] || match) + " \u2192 " + routes[match];
            item.addEventListener("mousedown", function (e) {
                // mousedown instead of click so the input doesn't lose focus first
                e.preventDefault();
                navigateTo(match);
            });
            searchPreview.appendChild(item);
        });

        searchPreview.style.display = "block";
    }

    function navigateTo(text) {
        const target = routes[text];
        if (!target) return;

        const isCurrent =
            target === window.location.pathname.split("/").pop() ||
            (target === "index.html" &&
                (window.location.pathname.endsWith("/") ||
                    window.location.pathname.endsWith("index.html")));

        if (isCurrent) {
            window.scrollTo({ top: 0, behavior: "instant" });
            alert("U\u017e jste na str\u00e1nce '" + text + "'.");
        } else {
            window.location.href = target;
        }
        searchPreview.style.display = "none";
        searchInput.value = "";
    }

    searchInput.addEventListener("input", function () {
        const text = this.value.toLowerCase().trim();
        if (!text) {
            searchPreview.style.display = "none";
            return;
        }
        const matches = Object.keys(routes).filter((key) => key.includes(text));
        showPreview(matches);
    });

    searchInput.addEventListener("keydown", function (e) {
        const items = searchPreview.querySelectorAll(".search-preview-item");
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                const matches = Object.keys(routes).filter((k) =>
                    k.includes(searchInput.value.toLowerCase().trim())
                );
                navigateTo(matches[selectedIndex]);
            } else {
                vyhledat(e);
            }
        } else if (e.key === "Escape") {
            searchPreview.style.display = "none";
        }
    });

    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle("active", index === selectedIndex);
        });
    }

    document.addEventListener("click", function (e) {
        if (!searchPreview.contains(e.target) && e.target !== searchInput) {
            searchPreview.style.display = "none";
        }
    });

    window.vyhledat = function (event) {
        event.preventDefault();
        const text = searchInput.value.toLowerCase().trim();
        if (routes[text]) {
            navigateTo(text);
        } else {
            alert(
                "Nic nebylo nalezeno. Zkuste zadat nap\u0159. 'škola', 'já' nebo 'budoucnost'."
            );
            searchPreview.style.display = "none";
        }
    };
})();
