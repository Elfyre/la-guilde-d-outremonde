document.addEventListener("DOMContentLoaded", () => {

    const points = document.querySelectorAll(".kitana-point");
    const modal = document.getElementById("kitana-modal");
    const contenu = document.getElementById("kitana-modal-contenu");
    const fenetre = document.querySelector(".kitana-fenetre-lore");
    const boutonsFermer = document.querySelectorAll("[data-fermer-lore]");

    if (!points.length || !modal || !contenu || !fenetre) {
        return;
    }


    /* =====================================================
       OUVRIR UN FRAGMENT
       ===================================================== */

    function ouvrirLore(id) {

        const template = document.getElementById(`lore-${id}`);

        if (!template) {
            return;
        }


        /* Nettoyage */

        contenu.innerHTML = "";

        modal.classList.remove("lore-long");


        /* Copier le contenu du template */

        const fragment = template.content.cloneNode(true);

        contenu.appendChild(fragment);


        /* Les gros textes passent en deux colonnes */

        if (
            id === "entite" ||
            id === "soleil"
        ) {
            modal.classList.add("lore-long");
        }


        /* Affichage */

        modal.hidden = false;

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
        });


        /* Empêcher le défilement de la page */

        document.body.classList.add("kitana-modal-ouvert");


        /* Accessibilité */

        points.forEach(point => {
            point.setAttribute("aria-expanded", "false");
        });

        const pointActif = document.querySelector(
            `.kitana-point[data-lore="${id}"]`
        );

        if (pointActif) {
            pointActif.setAttribute("aria-expanded", "true");
        }


        /* Focus sur le bouton fermer */

        const boutonFermer =
            modal.querySelector(".kitana-modal-fermer");

        if (boutonFermer) {
            setTimeout(() => {
                boutonFermer.focus();
            }, 100);
        }

    }


    /* =====================================================
       FERMER
       ===================================================== */

    function fermerLore() {

        modal.classList.remove("is-open");

        document.body.classList.remove("kitana-modal-ouvert");

        points.forEach(point => {
            point.setAttribute("aria-expanded", "false");
        });


        setTimeout(() => {

            modal.hidden = true;

            contenu.innerHTML = "";

            modal.classList.remove("lore-long");

        }, 280);

    }


    /* =====================================================
       CLIC SUR LES LOUPES
       ===================================================== */

    points.forEach(point => {

        point.addEventListener("click", () => {

            const id = point.dataset.lore;

            ouvrirLore(id);

        });

    });


    /* =====================================================
       BOUTONS FERMER + FOND
       ===================================================== */

    boutonsFermer.forEach(element => {

        element.addEventListener("click", fermerLore);

    });


    /* =====================================================
       ÉCHAP
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {
            fermerLore();
        }

    });


    /* =====================================================
       EMPÊCHER LE CLIC DANS LA FENÊTRE
       DE FERMER LA MODALE
       ===================================================== */

    fenetre.addEventListener("click", event => {

        event.stopPropagation();

    });

});