/* =========================================================
   LIVRE AVENTURIER
   NAVIGATION ENTRE LES PAGES
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ÉLÉMENTS
       ===================================================== */

    const livre =
        document.getElementById(
            "livre-aventurier"
        );

    const pages =
        livre
            ? Array.from(
                livre.querySelectorAll(
                    ".page-livre"
                )
            )
            : [];

    const boutonPrecedent =
        document.getElementById(
            "livre-precedent"
        );

    const boutonSuivant =
        document.getElementById(
            "livre-suivant"
        );


    /* =====================================================
       VÉRIFICATIONS
       ===================================================== */

    if (
        !livre ||
        !pages.length ||
        !boutonPrecedent ||
        !boutonSuivant
    ) {

        return;
    }


    /* =====================================================
       ÉTAT
       ===================================================== */

    let pageActuelle = 0;

    let animationEnCours = false;


    /* =====================================================
       DURÉE DE L'ANIMATION
       ===================================================== */

    const dureeAnimation = 700;


    /* =====================================================
       BOUTONS
       ===================================================== */

    function mettreAJourBoutons() {

        boutonPrecedent.disabled =
            pageActuelle === 0;

        boutonSuivant.disabled =
            pageActuelle ===
            pages.length - 1;
    }


    /* =====================================================
       CHANGEMENT DE PAGE
       ===================================================== */

    function changerPage(
        nouvellePage,
        direction
    ) {

        if (animationEnCours) {

            return;
        }


        if (
            nouvellePage < 0 ||
            nouvellePage >= pages.length ||
            nouvellePage === pageActuelle
        ) {

            return;
        }


        const anciennePage =
            pages[pageActuelle];

        const nouvellePageElement =
            pages[nouvellePage];


        if (
            !anciennePage ||
            !nouvellePageElement
        ) {

            return;
        }


        animationEnCours = true;


        /* =================================================
           PRÉPARATION DE LA NOUVELLE PAGE
           ================================================= */

        nouvellePageElement.classList.remove(
            "page-tourne-gauche",
            "page-tourne-droite"
        );

        nouvellePageElement.classList.add(
            "page-active"
        );


        /* =================================================
           ANIMATION DE L'ANCIENNE PAGE
           ================================================= */

        if (direction === "suivant") {

            anciennePage.classList.add(
                "page-tourne-gauche"
            );

        } else {

            anciennePage.classList.add(
                "page-tourne-droite"
            );
        }


        /* =================================================
           NOUVELLE PAGE ACTIVE
           ================================================= */

        pageActuelle =
            nouvellePage;


        mettreAJourBoutons();


        /* =================================================
           FIN DE L'ANIMATION
           ================================================= */

        setTimeout(() => {

            anciennePage.classList.remove(
                "page-active",
                "page-tourne-gauche",
                "page-tourne-droite"
            );


            nouvellePageElement.classList.remove(
                "page-tourne-gauche",
                "page-tourne-droite"
            );


            nouvellePageElement.classList.add(
                "page-active"
            );


            animationEnCours = false;

        }, dureeAnimation);
    }


    /* =====================================================
       PAGE SUIVANTE
       ===================================================== */

    function pageSuivante() {

        if (
            pageActuelle <
            pages.length - 1
        ) {

            changerPage(
                pageActuelle + 1,
                "suivant"
            );
        }
    }


    /* =====================================================
       PAGE PRÉCÉDENTE
       ===================================================== */

    function pagePrecedente() {

        if (
            pageActuelle > 0
        ) {

            changerPage(
                pageActuelle - 1,
                "precedent"
            );
        }
    }


    /* =====================================================
       CLICS
       ===================================================== */

    boutonSuivant.addEventListener(
        "click",
        pageSuivante
    );


    boutonPrecedent.addEventListener(
        "click",
        pagePrecedente
    );


    /* =====================================================
       CLAVIER
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "ArrowRight"
            ) {

                pageSuivante();

            } else if (
                event.key === "ArrowLeft"
            ) {

                pagePrecedente();
            }
        }
    );


    /* =====================================================
       INITIALISATION
       ===================================================== */

    pages.forEach((page, index) => {

        if (index === 0) {

            page.classList.add(
                "page-active"
            );

        } else {

            page.classList.remove(
                "page-active"
            );
        }
    });


    mettreAJourBoutons();

});