/* =========================================================
   TRANSITION PORTAIL
   LA GUILDE D'OUTREMONDE
   ========================================================= */


/* =========================================================
   CRÉATION DU PORTAIL DE TRANSITION
   ========================================================= */

function creerPortailTransition() {

    let portail =
        document.querySelector(
            ".transition-portail"
        );


    if (!portail) {

        portail =
            document.createElement(
                "div"
            );


        portail.className =
            "transition-portail";


        portail.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.appendChild(
            portail
        );

    }


    return portail;

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           LE SCRIPT NE DOIT ÊTRE ACTIF QUE SUR SITE.HTML
           ================================================= */

        const chemin =
            window.location.pathname
                .toLowerCase();


        const estAccueil =
            chemin.endsWith(
                "/site.html"
            ) ||
            chemin.endsWith(
                "site.html"
            ) ||
            chemin.endsWith(
                "/"
            );


        if (!estAccueil) {

            return;

        }


        /* =================================================
           CRÉATION
           ================================================= */

        const portail =
            creerPortailTransition();


        const bouton =
            document.querySelector(
                ".entrer-guilde"
            );


        if (!bouton) {

            return;

        }


        /* =================================================
           CLIC SUR
           "ENTRER DANS LA GUILDE"
           ================================================= */

        bouton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                /* =========================================
                   URL DE DESTINATION
                   ========================================= */

                const destination =
                    bouton.href;


                /* =========================================
                   PRÉPARATION
                   ========================================= */

                portail.classList.remove(
                    "termine"
                );


                portail.classList.remove(
                    "sortie"
                );


                /* =========================================
                   FORCER UN NOUVEAU CALCUL DE STYLE
                   ========================================= */

                void portail.offsetWidth;


                /* =========================================
                   LANCEMENT
                   ========================================= */

                portail.classList.add(
                    "sortie"
                );


                /* =========================================
                   CHANGEMENT DE PAGE
                   ========================================= */

                setTimeout(
                    () => {

                        window.location.href =
                            destination;

                    },
                    2200
                );

            }
        );

    }
);