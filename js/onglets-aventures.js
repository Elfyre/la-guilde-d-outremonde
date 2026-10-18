
/* =========================================================
   LA GUILDE D'OUTREMONDE
   Gestion des onglets des fiches d'aventure
   ========================================================= */

document.querySelectorAll("[data-tabs]").forEach((tabList) => {

    const container = tabList.closest(".aventure-onglets");

    if (!container) {
        return;
    }

    const tabs = Array.from(
        tabList.querySelectorAll('[role="tab"]')
    );

    function afficherOnglet(tabActif, donnerLeFocus = false) {

        const panneauId = tabActif.getAttribute("aria-controls");
        const panneauActif = document.getElementById(panneauId);

        if (!panneauActif || !container.contains(panneauActif)) {
            return;
        }

        tabs.forEach((tab) => {

            const actif = tab === tabActif;

            tab.setAttribute("aria-selected", String(actif));
            tab.tabIndex = actif ? 0 : -1;

            const panneauIdTab = tab.getAttribute("aria-controls");
            const panneau = document.getElementById(panneauIdTab);

            if (panneau && container.contains(panneau)) {
                panneau.hidden = !actif;
            }

        });

        if (donnerLeFocus) {
            tabActif.focus();
        }

    }

    tabs.forEach((tab, index) => {

        tab.addEventListener("click", () => {
            afficherOnglet(tab);
        });

        tab.addEventListener("keydown", (event) => {

            let nouvelIndex = index;

            switch (event.key) {

                case "ArrowRight":
                    nouvelIndex = (index + 1) % tabs.length;
                    break;

                case "ArrowLeft":
                    nouvelIndex = (index - 1 + tabs.length) % tabs.length;
                    break;

                case "Home":
                    nouvelIndex = 0;
                    break;

                case "End":
                    nouvelIndex = tabs.length - 1;
                    break;

                default:
                    return;

            }

            event.preventDefault();
            afficherOnglet(tabs[nouvelIndex], true);

        });

    });

    const ongletInitial = tabs.find(
        (tab) => tab.getAttribute("aria-selected") === "true"
    ) || tabs[0];

    if (ongletInitial) {
        afficherOnglet(ongletInitial);
    }

});
