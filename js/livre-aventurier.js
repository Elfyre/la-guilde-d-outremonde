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
            pageActuelle === pages.length - 1;

    }


    /* =====================================================
       CHANGEMENT DE PAGE
       ===================================================== */

    function changerPage(
        nouvellePage,
        direction
    ) {

        /* -------------------------------------------------
           EMPÊCHE UN SECOND CLIC PENDANT L'ANIMATION
           ------------------------------------------------- */

        if (animationEnCours) {

            return;
        }


        /* -------------------------------------------------
           VÉRIFICATION DE LA PAGE DEMANDÉE
           ------------------------------------------------- */

        if (
            nouvellePage < 0 ||
            nouvellePage >= pages.length ||
            nouvellePage === pageActuelle
        ) {

            return;
        }


        /* -------------------------------------------------
           RÉCUPÉRATION DES PAGES
           ------------------------------------------------- */

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


        /* -------------------------------------------------
           VERROUILLAGE
           ------------------------------------------------- */

        animationEnCours = true;


        /* -------------------------------------------------
           NETTOYAGE DE LA NOUVELLE PAGE
           ------------------------------------------------- */

        nouvellePageElement.classList.remove(
            "page-tourne-gauche",
            "page-tourne-droite"
        );


        /* -------------------------------------------------
           LA NOUVELLE PAGE EST PRÉPARÉE DERRIÈRE
           ------------------------------------------------- */

        nouvellePageElement.classList.add(
            "page-active"
        );


        /* -------------------------------------------------
           ANIMATION DE L'ANCIENNE PAGE
           ------------------------------------------------- */

        if (
            direction === "suivant"
        ) {

            anciennePage.classList.add(
                "page-tourne-gauche"
            );

        } else {

            anciennePage.classList.add(
                "page-tourne-droite"
            );

        }


        /* -------------------------------------------------
           MISE À JOUR DE LA PAGE COURANTE
           ------------------------------------------------- */

        pageActuelle =
            nouvellePage;


        mettreAJourBoutons();


        /* =================================================
           FIN DE L'ANIMATION
           ================================================= */

        setTimeout(() => {


            /* ---------------------------------------------
               RETIRE COMPLÈTEMENT L'ANCIENNE PAGE
               --------------------------------------------- */

            anciennePage.classList.remove(
                "page-active",
                "page-tourne-gauche",
                "page-tourne-droite"
            );


            /* ---------------------------------------------
               NETTOIE LA NOUVELLE PAGE
               --------------------------------------------- */

            nouvellePageElement.classList.remove(
                "page-tourne-gauche",
                "page-tourne-droite"
            );


            /* ---------------------------------------------
               GARDE LA NOUVELLE PAGE ACTIVE
               --------------------------------------------- */

            nouvellePageElement.classList.add(
                "page-active"
            );


            /* ---------------------------------------------
               DÉVERROUILLAGE
               --------------------------------------------- */

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

        page.classList.remove(
            "page-active",
            "page-tourne-gauche",
            "page-tourne-droite"
        );


        if (index === 0) {

            page.classList.add(
                "page-active"
            );

        }

    });


    /* =====================================================
       BOUTONS INITIAUX
       ===================================================== */

    mettreAJourBoutons();

});