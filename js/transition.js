/* =========================================================
   TRANSITION — PORTAIL D'ENTRÉE DE LA GUILDE
   ========================================================= */


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           RÉCUPÉRATION DU PORTAIL
        ================================================= */

        const portail =
            document.querySelector(
                ".transition-portail"
            );


        /*
         * Si le portail n'existe pas sur une page,
         * on ne fait absolument rien.
         */

        if (!portail) {

            return;

        }



        /* =================================================
           IDENTIFICATION DE LA PAGE
        ================================================= */

        const page =
            window.location.pathname;



        /* =================================================
           BOUTON "ENTRER DANS LA GUILDE"
        ================================================= */

        const entrer =
            document.querySelector(
                ".entrer-guilde"
            );



        /* =================================================
           ARRIVÉE DANS LE HALL
           
           Le portail est déjà présent dans le HTML.
           
           Il est volontairement figé pendant que le Hall
           termine son chargement.
        ================================================= */

        if (
            page.endsWith("/hall.html") ||
            page.endsWith("hall.html")
        ) {


            /*
             * On attend que toutes les ressources de la page
             * soient réellement chargées.
             */

            window.addEventListener(
                "load",
                () => {


                    /*
                     * On laisse le navigateur effectuer
                     * au moins une frame complète avec le Hall
                     * déjà peint derrière le portail.
                     */

                    requestAnimationFrame(
                        () => {

                            requestAnimationFrame(
                                () => {


                                    /*
                                     * Le Hall est maintenant
                                     * derrière le portail.
                                     *
                                     * On libère l'animation.
                                     */

                                    portail.classList.remove(
                                        "attente"
                                    );


                                    /*
                                     * L'animation de fermeture
                                     * dure 1.30 seconde.
                                     *
                                     * Une fois terminée,
                                     * on fait disparaître le
                                     * conteneur proprement.
                                     */

                                    setTimeout(
                                        () => {

                                            portail.classList.remove(
                                                "entree"
                                            );


                                            portail.classList.add(
                                                "termine"
                                            );


                                            /*
                                             * On attend la petite
                                             * transition d'opacité
                                             * avant de retirer
                                             * complètement l'élément.
                                             */

                                            setTimeout(
                                                () => {

                                                    portail.remove();

                                                },
                                                250
                                            );

                                        },
                                        1300
                                    );

                                }
                            );

                        }
                    );

                },
                {
                    once: true
                }
            );


            /*
             * IMPORTANT :
             *
             * On ne fait RIEN d'autre ici.
             *
             * Le portail reste visible pendant tout
             * le chargement du Hall.
             */

            return;

        }



        /* =================================================
           DÉPART DEPUIS LE SITE
           
           SITE → PORTAIL → HALL
        ================================================= */

        if (entrer) {


            entrer.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();



                    /* =============================
                       PROTECTION DOUBLE CLIC
                    ============================= */

                    if (
                        portail.classList.contains(
                            "sortie"
                        )
                    ) {

                        return;

                    }



                    /* =============================
                       LANCEMENT DU PORTAIL
                    ============================= */

                    portail.classList.add(
                        "sortie"
                    );



                    /*
                     * Ton animation actuelle dure
                     * 1.30 seconde.
                     *
                     * On attend donc légèrement plus
                     * longtemps avant de changer de page,
                     * pour ne pas couper l'animation.
                     */

                    setTimeout(
                        () => {

                            window.location.href =
                                entrer.href;

                        },
                        1350
                    );

                }
            );

        }

    }
);