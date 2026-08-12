/* =========================================================
   TRANSITION DE PAGE — PORTAIL
   LA GUILDE D'OUTREMONDE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CRÉATION DU PORTAIL
       ===================================================== */

    const portail = document.createElement("div");

    portail.className = "transition-portail entree";

    document.body.appendChild(portail);


    /* =====================================================
       FIN DE L'ANIMATION D'ENTRÉE
       ===================================================== */

    window.setTimeout(() => {

        portail.classList.remove("entree");

        portail.classList.add("termine");

    }, 650);


    /* =====================================================
       LIENS INTERNES
       ===================================================== */

    const liens = document.querySelectorAll("a[href]");


    liens.forEach(lien => {

        lien.addEventListener("click", event => {

            /* ---------------------------------------------
               MODIFICATEURS DE CLIC
               --------------------------------------------- */

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {

                return;

            }


            /* ---------------------------------------------
               LIENS EXTERNES / NOUVEL ONGLET
               --------------------------------------------- */

            if (lien.target === "_blank") {

                return;

            }


            /* ---------------------------------------------
               LIENS SPÉCIAUX
               --------------------------------------------- */

            const href = lien.getAttribute("href");


            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("javascript:")
            ) {

                return;

            }


            /* ---------------------------------------------
               URL ABSOLUE
               --------------------------------------------- */

            let destination;


            try {

                destination =
                    new URL(
                        href,
                        window.location.href
                    );

            } catch {

                return;

            }


            /* ---------------------------------------------
               UNIQUEMENT LE MÊME SITE
               --------------------------------------------- */

            if (
                destination.origin !==
                window.location.origin
            ) {

                return;

            }


            /* ---------------------------------------------
               MÊME PAGE
               --------------------------------------------- */

            if (
                destination.href ===
                window.location.href
            ) {

                return;

            }


            /* ---------------------------------------------
               TRANSITION
               --------------------------------------------- */

            event.preventDefault();

            portail.classList.remove("termine");

            portail.classList.add("sortie");


            /* ---------------------------------------------
               CHANGEMENT DE PAGE
               --------------------------------------------- */

            window.setTimeout(() => {

                window.location.href =
                    destination.href;

            }, 600);

        });

    });

});