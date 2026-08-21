/* =========================================================
   EASTER EGG — LICORNE
   LA GUILDE D'OUTREMONDE
   ========================================================= */


/* =========================================================
   CHEMIN DU SCRIPT
   ========================================================= */

const scriptLicorne =
    document.querySelector(
        'script[src*="licorne.js"]'
    );


const cheminImages =
    scriptLicorne
        ? new URL(
            "../images/licornes/",
            scriptLicorne.src
        ).href
        : null;


/* =========================================================
   IMAGES DES LICORNES
   ========================================================= */

const licornes = [

    {
        image:
            "licorne-1.png",

        rarete:
            40
    },

    {
        image:
            "licorne-2.jpg",

        rarete:
            25
    },

    {
        image:
            "licorne-3.jpg",

        rarete:
            20
    },

    {
        image:
            "licorne-4.jpg",

        rarete:
            10
    },

    {
        image:
            "licorne-5.jpg",

        rarete:
            5
    }

];


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           CHANCE D'APPARITION
           TEST : 100 %
           ================================================= */

        const chanceApparition =
            1;


        /* =================================================
           TIRAGE ALÉATOIRE
           ================================================= */

        if (Math.random() > chanceApparition) {

            return;

        }


        /* =================================================
           VÉRIFICATION DES IMAGES
           ================================================= */

        if (
            !cheminImages ||
            licornes.length === 0
        ) {

            return;

        }


        /* =================================================
           DÉLAI AVANT APPARITION
           TEST : ENTRE 3 ET 10 SECONDES
           ================================================= */

        const delaiMinimum =
            3000;

        const delaiMaximum =
            10000;

        const delai =
            Math.random() *
            (
                delaiMaximum -
                delaiMinimum
            ) +
            delaiMinimum;


        /* =================================================
           ATTENTE AVANT APPARITION
           ================================================= */

        setTimeout(
            () => {


                /* =========================================
                   CRÉATION DE LA LICORNE
                   ========================================= */

                const licorne =
                    document.createElement(
                        "img"
                    );


                licorne.className =
                    "licorne-easter-egg";


                /* =========================================
                   TIRAGE DE LA LICORNE
                   ========================================= */

                const tirage =
                    Math.random() * 100;

                let cumul =
                    0;

                let licorneChoisie =
                    licornes[
                        licornes.length - 1
                    ];


                for (
                    const licorneDisponible
                    of licornes
                ) {

                    cumul +=
                        licorneDisponible.rarete;


                    if (
                        tirage <=
                        cumul
                    ) {

                        licorneChoisie =
                            licorneDisponible;

                        break;

                    }

                }


                /* =========================================
                   IMAGE
                   ========================================= */

                licorne.src =
                    new URL(
                        licorneChoisie.image,
                        cheminImages
                    ).href;


                licorne.alt =
                    "";


                licorne.setAttribute(
                    "aria-hidden",
                    "true"
                );


                /* =========================================
                   POSITION ALÉATOIRE
                   ========================================= */

                const largeur =
                    window.innerWidth;

                const hauteur =
                    window.innerHeight;


                const positionX =
                    Math.random() *
                    Math.max(
                        0,
                        largeur - 150
                    );


                const positionY =
                    Math.random() *
                    Math.max(
                        0,
                        hauteur - 150
                    );


                licorne.style.left =
                    `${positionX}px`;


                licorne.style.top =
                    `${positionY}px`;


                /* =========================================
                   ANIMATION ALÉATOIRE
                   ========================================= */

                const nombreAnimations =
                    10;


                const animation =
                    Math.floor(
                        Math.random() *
                        nombreAnimations
                    ) + 1;


                licorne.classList.add(
                    `licorne-animation-${animation}`
                );


                /* =========================================
                   DIRECTION ALÉATOIRE
                   8 DIRECTIONS
                   ========================================= */

                const directions = [

                    {
                        x: 1,
                        y: 0
                    },

                    {
                        x: -1,
                        y: 0
                    },

                    {
                        x: 0,
                        y: 1
                    },

                    {
                        x: 0,
                        y: -1
                    },

                    {
                        x: 1,
                        y: 1
                    },

                    {
                        x: 1,
                        y: -1
                    },

                    {
                        x: -1,
                        y: 1
                    },

                    {
                        x: -1,
                        y: -1
                    }

                ];


                const direction =
                    directions[
                        Math.floor(
                            Math.random() *
                            directions.length
                        )
                    ];


                /* =========================================
                   VARIABLES CSS DE DIRECTION
                   ========================================= */

                licorne.style.setProperty(
                    "--direction-x",
                    direction.x
                );


                licorne.style.setProperty(
                    "--direction-y",
                    direction.y
                );


                /* =========================================
                   AJOUT À LA PAGE
                   ========================================= */

                document.body.appendChild(
                    licorne
                );


                /* =========================================
                   SUPPRESSION APRÈS ANIMATION
                   ========================================= */

                licorne.addEventListener(
                    "animationend",
                    () => {

                        licorne.remove();

                    }
                );


            },
            delai
        );

    }
);