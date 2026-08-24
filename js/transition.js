/* =========================================================
   TRANSITION PORTAIL
   LA GUILDE D'OUTREMONDE
   SITE → HALL UNIQUEMENT
   ========================================================= */


/* =========================================================
   DURÉES
   ========================================================= */

const DUREE_TRANSITION = 3350;
const DUREE_ARRIVEE = 1400;


/* =========================================================
   CRÉATION DU PORTAIL DE TRANSITION
   ========================================================= */

function creerPortailTransition() {

    let portail =
        document.querySelector(
            ".transition-portail"
        );


    if (portail) {

        return portail;

    }


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


    /* =====================================================
       HALO CENTRAL
       ===================================================== */

    const halo =
        document.createElement(
            "div"
        );

    halo.className =
        "transition-halo";


    portail.appendChild(
        halo
    );


    /* =====================================================
       FUMÉE
       ===================================================== */

    const fumee =
        document.createElement(
            "div"
        );

    fumee.className =
        "portail-fumee";


    const anglesFumee = [
        0,
        30,
        60,
        90,
        120,
        150,
        180,
        210,
        240,
        270,
        300,
        330
    ];


    anglesFumee.forEach(
        (angle, index) => {

            const nuage =
                document.createElement(
                    "span"
                );


            nuage.className =
                "fumee-nuage";


            nuage.style.setProperty(
                "--fumee-angle",
                `${angle}deg`
            );


            nuage.style.setProperty(
                "--fumee-delai",
                `${-(index * 1.1)}s`
            );


            fumee.appendChild(
                nuage
            );

        }
    );


    portail.appendChild(
        fumee
    );


    /* =====================================================
       CRISTAUX
       ===================================================== */

    const cristaux =
        document.createElement(
            "div"
        );


    cristaux.className =
        "portail-cristaux";


    const nombreCristaux =
        12;


    for (
        let i = 0;
        i < nombreCristaux;
        i++
    ) {

        const cristal =
            document.createElement(
                "span"
            );


        cristal.className =
            "cristal";


        const angle =
            i *
            (360 / nombreCristaux);


        const distance =
            225 +
            (i % 3) * 18;


        const taille =
            0.65 +
            (i % 4) * 0.15;


        cristal.style.setProperty(
            "--cristal-angle",
            `${angle}deg`
        );


        cristal.style.setProperty(
            "--cristal-distance",
            `${distance}px`
        );


        cristal.style.setProperty(
            "--cristal-taille",
            taille
        );


        cristal.style.setProperty(
            "--cristal-delai",
            `${-(i * 0.35)}s`
        );


        cristaux.appendChild(
            cristal
        );

    }


    portail.appendChild(
        cristaux
    );


    /* =====================================================
       ÉTINCELLES
       ===================================================== */

    const etincelles =
        document.createElement(
            "div"
        );


    etincelles.className =
        "portail-etincelles";


    const nombreEtincelles =
        18;


    for (
        let i = 0;
        i < nombreEtincelles;
        i++
    ) {

        const etincelle =
            document.createElement(
                "span"
            );


        etincelle.className =
            "etincelle";


        const angle =
            i *
            (360 / nombreEtincelles);


        const distance =
            190 +
            (i % 5) * 12;


        const duree =
            2.1 +
            (i % 4) * 0.35;


        etincelle.style.setProperty(
            "--etincelle-angle",
            `${angle}deg`
        );


        etincelle.style.setProperty(
            "--etincelle-distance",
            `${distance}px`
        );


        etincelle.style.setProperty(
            "--etincelle-duree",
            `${duree}s`
        );


        etincelle.style.setProperty(
            "--etincelle-delai",
            `${-(i * 0.22)}s`
        );


        etincelles.appendChild(
            etincelle
        );

    }


    portail.appendChild(
        etincelles
    );


    /* =====================================================
       ÉCLAIRS
       ===================================================== */

    const eclairs =
        document.createElement(
            "div"
        );


    eclairs.className =
        "portail-eclairs";


    const anglesEclairs = [
        15,
        70,
        125,
        185,
        240,
        300
    ];


    anglesEclairs.forEach(
        (angle, index) => {

            const eclair =
                document.createElement(
                    "span"
                );


            eclair.className =
                "eclair";


            eclair.style.setProperty(
                "--eclair-angle",
                `${angle}deg`
            );


            eclair.style.setProperty(
                "--eclair-delai",
                `${-(index * 0.65)}s`
            );


            eclairs.appendChild(
                eclair
            );

        }
    );


    portail.appendChild(
        eclairs
    );


    /* =====================================================
       NOIR FINAL
       ===================================================== */

    const noir =
        document.createElement(
            "div"
        );


    noir.className =
        "transition-noir";


    portail.appendChild(
        noir
    );


    /* =====================================================
       AJOUT AU DOCUMENT
       ===================================================== */

    document.body.appendChild(
        portail
    );


    return portail;

}


/* =========================================================
   ARRIVÉE DANS LE HALL
   ========================================================= */

function lancerArriveeHall() {

    const portail =
        creerPortailTransition();


    portail.classList.add(
        "arrivee"
    );


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    portail.classList.add(
                        "arrivee-active"
                    );

                }
            );

        }
    );


    setTimeout(
        () => {

            portail.remove();

        },
        DUREE_ARRIVEE + 200
    );

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           CHEMIN ACTUEL
           ================================================= */

        const chemin =
            window.location.pathname
                .toLowerCase();


        /* =================================================
           PAGE D'ACCUEIL
           ================================================= */

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


        /* =================================================
           HALL
           ================================================= */

        const estHall =
            chemin.endsWith(
                "/hall.html"
            ) ||
            chemin.endsWith(
                "hall.html"
            );


        /* =================================================
           ARRIVÉE DANS LE HALL
           ================================================= */

        if (estHall) {

            lancerArriveeHall();

            return;

        }


        /* =================================================
           UNIQUEMENT SITE.HTML
           ================================================= */

        if (!estAccueil) {

            return;

        }


        /* =================================================
           CRÉATION DU PORTAIL
           ================================================= */

        const portail =
            creerPortailTransition();


        /* =================================================
           BOUTON D'ENTRÉE
           ================================================= */

        const bouton =
            document.querySelector(
                ".bouton[href]"
            );


        if (!bouton) {

            return;

        }


        /* =================================================
           CLIC
           ================================================= */

        bouton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const destination =
                    bouton.href;


                /* =========================================
                   ÉVITER LES DOUBLES CLICS
                   ========================================= */

                if (
                    portail.classList.contains(
                        "sortie"
                    )
                ) {

                    return;

                }


                /* =========================================
                   RÉINITIALISATION
                   ========================================= */

                portail.classList.remove(
                    "sortie"
                );


                void portail.offsetWidth;


                /* =========================================
                   LANCEMENT
                   ========================================= */

                portail.classList.add(
                    "sortie"
                );


                /* =========================================
                   NAVIGATION
                   ========================================= */

                setTimeout(
                    () => {

                        window.location.href =
                            destination;

                    },
                    DUREE_TRANSITION
                );

            }
        );

    }
);