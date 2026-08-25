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
   MODE TEST
   true  = affiche les informations dans la console
   false = aucun affichage
   ========================================================= */

const modeTest =
    false;


/* =========================================================
   CHANCES DES RARETÉS
   ========================================================= */

const chancesRarete = {

    commune:
        55,

    peuCommune:
        25,

    rare:
        11,

    tresRare:
        5,

    epique:
        3,

    legendaire:
        1

};


/* =========================================================
   IMAGES DES LICORNES
   ========================================================= */

const licornes = [

    {
        image:
            "licorne-1.png",

        rarete:
            "commune"
    },

    {
        image:
            "licorne-2.png",

        rarete:
            "commune"
    },

    {
        image:
            "licorne-3.png",

        rarete:
            "peuCommune"
    },

    {
        image:
            "licorne-4.png",

        rarete:
            "peuCommune"
    },

    {
        image:
            "licorne-5.png",

        rarete:
            "rare"
    },

    {
        image:
            "licorne-6.png",

        rarete:
            "rare"
    },

    {
        image:
            "licorne-7.png",

        rarete:
            "tresRare"
    },

    {
        image:
            "licorne-8.png",

        rarete:
            "tresRare"
    },

    {
        image:
            "licorne-9.png",

        rarete:
            "epique"
    },

    {
        image:
            "licorne-10.png",

        rarete:
            "legendaire"
    }

];


/* =========================================================
   VÉRIFICATION DES PROBABILITÉS
   UNIQUEMENT EN MODE TEST
   ========================================================= */

if (modeTest) {

    /* =====================================================
       TOTAL DES CHANCES
       ===================================================== */

    const totalChances =
        Object.values(chancesRarete)
            .reduce(
                (
                    total,
                    chance
                ) =>
                    total + chance,
                0
            );


    console.log(
        "========================================"
    );

    console.log(
        "🦄 TEST DES PROBABILITÉS"
    );

    console.log(
        "========================================"
    );


    console.log(
        "Total des chances :",
        totalChances + "%"
    );


    if (
        totalChances === 100
    ) {

        console.log(
            "✅ Les chances font bien 100 %."
        );

    } else {

        console.error(
            "❌ ERREUR : les chances ne font pas 100 %."
        );

    }


    /* =====================================================
       CHANCE DE CHAQUE LICORNE
       ===================================================== */

    console.table(

        licornes.map(
            (
                licorne,
                index
            ) => {

                const nombreDansRarete =
                    licornes.filter(
                        autre =>
                            autre.rarete ===
                            licorne.rarete
                    ).length;


                const chance =
                    chancesRarete[
                        licorne.rarete
                    ] /
                    nombreDansRarete;


                return {

                    Licorne:
                        index + 1,

                    Image:
                        licorne.image,

                    Rareté:
                        licorne.rarete,

                    "Chance (%)":
                        chance

                };

            }
        )

    );

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           CHANCE D'APPARITION
           ================================================= */

        const chanceApparition =
            0.20;


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
                   TIRAGE DE LA RARETÉ
                   ========================================= */

                const tirageRarete =
                    Math.random() * 100;

                let cumul =
                    0;

                let rareteChoisie =
                    "legendaire";


                for (
                    const [rarete, chance]
                    of Object.entries(chancesRarete)
                ) {

                    cumul +=
                        chance;


                    if (
                        tirageRarete <=
                        cumul
                    ) {

                        rareteChoisie =
                            rarete;

                        break;

                    }

                }


                /* =========================================
                   LICORNES DE LA RARETÉ CHOISIE
                   ========================================= */

                const licornesDisponibles =
                    licornes.filter(
                        licorneDisponible =>
                            licorneDisponible.rarete ===
                            rareteChoisie
                    );


                /* =========================================
                   VÉRIFICATION
                   ========================================= */

                if (
                    licornesDisponibles.length === 0
                ) {

                    return;

                }


                /* =========================================
                   TIRAGE DE LA LICORNE
                   ========================================= */

                const licorneChoisie =
                    licornesDisponibles[
                        Math.floor(
                            Math.random() *
                            licornesDisponibles.length
                        )
                    ];


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