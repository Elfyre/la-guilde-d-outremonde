/* =========================================================
   TRANSITION DE PAGE — PORTAIL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           CRÉATION DU PORTAIL
           ================================================= */

        const portail =
            document.createElement("div");

        portail.className =
            "transition-portail";

        document.body.appendChild(
            portail
        );


        /* =================================================
           TRANSITION D'ARRIVÉE
           ================================================= */

        portail.classList.add(
            "entree"
        );


        setTimeout(
            () => {

                portail.classList.add(
                    "termine"
                );

            },
            450
        );


        /* =================================================
           LIENS INTERNES
           ================================================= */

        const liens =
            document.querySelectorAll(
                "a[href]"
            );


        liens.forEach(
            (lien) => {

                lien.addEventListener(
                    "click",
                    (event) => {

                        const destination =
                            lien.href;


                        /* =============================
                           IGNORER LES LIENS SPÉCIAUX
                           ============================= */

                        if (

                            event.ctrlKey ||
                            event.shiftKey ||
                            event.altKey ||
                            event.metaKey ||

                            lien.target === "_blank" ||

                            lien.hasAttribute("download") ||

                            destination.startsWith(
                                "javascript:"
                            )

                        ) {

                            return;

                        }


                        /* =============================
                           IGNORER LES ANCRES
                           ============================= */

                        const url =
                            new URL(
                                destination,
                                window.location.href
                            );


                        if (

                            url.pathname ===
                            window.location.pathname &&

                            url.hash

                        ) {

                            return;

                        }


                        /* =============================
                           LIEN EXTERNE
                           ============================= */

                        if (
                            url.origin !==
                            window.location.origin
                        ) {

                            return;

                        }


                        /* =============================
                           ANNULER LE LIEN
                           ============================= */

                        event.preventDefault();


                        /* =============================
                           ANIMATION DE SORTIE
                           ============================= */

                        portail.classList.remove(
                            "termine"
                        );

                        portail.classList.remove(
                            "entree"
                        );

                        portail.classList.add(
                            "sortie"
                        );


                        /* =============================
                           CHANGEMENT DE PAGE
                           ============================= */

                        setTimeout(
                            () => {

                                window.location.href =
                                    destination;

                            },
                            450
                        );

                    }
                );

            }
        );

    }
);