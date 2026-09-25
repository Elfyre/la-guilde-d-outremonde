/* =========================================================
   HALL — PROCHAINES ACTIVITÉS
   ========================================================= */


/* =========================================================
   CONFIGURATION TWITCH
========================================================= */

/*
 * URL du service qui vérifiera plus tard
 * si la chaîne Twitch est en direct.
 *
 * Laisser vide pour le moment.
 */

const TWITCH_API_URL =
    "https://la-guilde-twitch.elo200027.workers.dev";


/*
 * URL de la chaîne Twitch.
 */

const TWITCH_URL =
    "https://www.twitch.tv/mk666xxx";


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    chargerPlanning
);


/* =========================================================
   CHARGER LE PLANNING
========================================================= */

async function chargerPlanning() {

    try {

        const reponse =
            await fetch("../pages/planning.html");


        if (!reponse.ok) {

            throw new Error(
                `Impossible de charger planning.html : ${reponse.status}`
            );

        }


        const contenu =
            await reponse.text();


        const parser =
            new DOMParser();


        const planning =
            parser.parseFromString(
                contenu,
                "text/html"
            );


        /* =========================
           DATE DE DÉBUT DE LA SEMAINE
        ========================= */

        const elementSemaine =
            planning.querySelector(
                ".planning-semaine[data-date-debut]"
            );


        if (!elementSemaine) {

            throw new Error(
                "La date de début du planning est introuvable."
            );

        }


        const dateDebut =
            elementSemaine.dataset.dateDebut;


        /* =========================
           RÉCUPÉRER LES MISSIONS
        ========================= */

        const missions =
            planning.querySelectorAll(
                ".mission"
            );


        const videos = [];

        const lives = [];


        missions.forEach(
            (mission) => {

                const titreJour =
                    mission.querySelector("h2");


                if (!titreJour) {

                    return;

                }


                const jour =
                    obtenirNumeroJour(
                        titreJour.textContent
                    );


                if (jour === null) {

                    return;

                }


                /* =========================
                   CRÉNEAUX
                ========================= */

                const creneaux =
                    mission.querySelectorAll(
                        ".creneau[data-heure]"
                    );


                creneaux.forEach(
                    (creneau) => {

                        const heure =
                            creneau.dataset.heure;


                        const date =
                            creerDate(
                                dateDebut,
                                jour,
                                heure
                            );


                        const type =
                            creneau.dataset.type;


                        const activite = {

                            date: date,

                            titre:
                                obtenirTitre(
                                    creneau
                                ),

                            image:
                                type === "twitch"
                                    ? obtenirImageLive(
                                        creneau
                                    )
                                    : obtenirImage(
                                        creneau
                                    )

                        };


                        if (
                            type === "youtube"
                        ) {

                            videos.push(
                                activite
                            );

                        }


                        if (
                            type === "twitch"
                        ) {

                            lives.push(
                                activite
                            );

                        }

                    }
                );

            }
        );


        /* =====================================================
           ACTIVITÉS SUPPLÉMENTAIRES POUR LE JAVASCRIPT
           
           Ces données sont présentes dans planning.html
           uniquement pour permettre au Hall de connaître
           une activité située en dehors de la semaine affichée.
        ===================================================== */

        const donneesJs =
            planning.querySelector(
                "#planning-js"
            );


        if (donneesJs) {

            try {

                const donnees =
                    JSON.parse(
                        donneesJs.textContent
                    );


                if (
                    donnees.prochaineVideo
                ) {

                    const video =
                        donnees.prochaineVideo;


                    const activite = {

                        date:
                            creerDateDirecte(
                                video.date,
                                video.heure
                            ),

                        titre:
                            video.titre,

                        image:
                            video.image || null

                    };


                    videos.push(
                        activite
                    );

                }


                if (
                    donnees.prochainLive
                ) {

                    const live =
                        donnees.prochainLive;


                    const activite = {

                        date:
                            creerDateDirecte(
                                live.date,
                                live.heure
                            ),

                        titre:
                            live.titre,

                        image:
                            live.image || null

                    };


                    lives.push(
                        activite
                    );

                }

            }
            catch (erreur) {

                console.error(
                    "Erreur dans les données JavaScript du planning :",
                    erreur
                );

            }

        }


        /* =========================
           DATE ACTUELLE
        ========================= */

        const maintenant =
            new Date();


        /* =====================================================
           PROCHAINE VIDÉO YOUTUBE
        ===================================================== */

        const prochainesVideos =
            videos
                .filter(
                    video =>
                        video.date > maintenant
                )
                .sort(
                    (a, b) =>
                        a.date - b.date
                );


        const prochaineVideo =
            prochainesVideos[0];


        if (prochaineVideo) {

            afficherVideo(
                prochaineVideo
            );


            lancerCompteARebours(
                "prochaine-video"
            );

        }
        else {

            afficherAucuneVideo();

        }


        /* =====================================================
           PROCHAIN LIVE TWITCH
        ===================================================== */

        const prochainsLives =
            lives
                .filter(
                    live =>
                        live.date > maintenant
                )
                .sort(
                    (a, b) =>
                        a.date - b.date
                );


        const prochainLive =
            prochainsLives[0];


        /*
         * On affiche d'abord le prochain live
         * prévu dans le planning.
         *
         * Le bouton Twitch reste caché tant que
         * la chaîne n'est pas réellement en direct.
         */

        if (prochainLive) {

            afficherLive(
                prochainLive
            );


            lancerCompteARebours(
                "prochain-live"
            );

        }
        else {

            afficherAucunLive();

        }


        /* =====================================================
           VÉRIFICATION DU LIVE TWITCH
        ===================================================== */

        verifierLiveTwitch();

    }
    catch (erreur) {

        console.error(
            "Erreur lors du chargement du planning :",
            erreur
        );


        afficherErreur();

    }

}


/* =========================================================
   OBTENIR LE NUMÉRO DU JOUR
========================================================= */

function obtenirNumeroJour(
    texte
) {

    const texteNormalise =
        texte
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const jours = {

        lundi: 0,

        mardi: 1,

        mercredi: 2,

        jeudi: 3,

        vendredi: 4,

        samedi: 5,

        dimanche: 6

    };


    for (
        const [nom, numero]
        of Object.entries(jours)
    ) {

        if (
            texteNormalise.includes(nom)
        ) {

            return numero;

        }

    }


    return null;

}


/* =========================================================
   CRÉER LA DATE DU CRÉNEAU
========================================================= */

function creerDate(
    dateDebut,
    numeroJour,
    heure
) {

    const date =
        new Date(
            `${dateDebut}T${heure}:00`
        );


    date.setDate(
        date.getDate() + numeroJour
    );


    return date;

}


/* =========================================================
   CRÉER UNE DATE DIRECTE
========================================================= */

function creerDateDirecte(
    date,
    heure
) {

    return new Date(
        `${date}T${heure}:00`
    );

}


/* =========================================================
   OBTENIR LE TITRE
========================================================= */

function obtenirTitre(
    creneau
) {

    const paragraphe =
        creneau.querySelector("p");


    if (paragraphe) {

        const clone =
            paragraphe.cloneNode(true);


        clone
            .querySelectorAll("br")
            .forEach(
                br =>
                    br.replaceWith(" ")
            );


        let texte =
            clone.textContent
                .replace(/\s+/g, " ")
                .trim();


        texte =
            texte.replace(
                /^\d{1,2}H(?:-\d{1,2}H)?\s*/i,
                ""
            );


        if (texte) {

            return texte;

        }

    }


    const image =
        creneau.querySelector("img");


    if (
        image &&
        image.alt
    ) {

        return image.alt.trim();

    }


    return "Prochaine activité";

}


/* =========================================================
   OBTENIR L'IMAGE
========================================================= */

function obtenirImage(
    creneau
) {

    /*
     * Si une image spécifique est définie
     * directement sur le créneau avec data-image,
     * elle est prioritaire.
     *
     * Cela permet notamment d'avoir une image
     * spécifique pour les rediffusions.
     */

    const imagePersonnalisee =
        creneau.dataset.image;


    if (imagePersonnalisee) {

        return imagePersonnalisee;

    }


    /*
     * Sinon, on utilise simplement l'image
     * présente dans le créneau.
     */

    const image =
        creneau.querySelector("img");


    if (!image) {

        return null;

    }


    return image.getAttribute(
        "src"
    );

}


/* =========================================================
   OBTENIR L'IMAGE DU LIVE
========================================================= */

function obtenirImageLive(
    creneau
) {

    /*
     * Pour les lives Twitch,
     * l'image est définie directement
     * dans data-image du planning.
     */

    const image =
        creneau.dataset.image;


    if (image) {

        return image;

    }


    return null;

}


/* =========================================================
   AFFICHER LA VIDÉO
========================================================= */

function afficherVideo(
    video
) {

    const bloc =
        document.getElementById(
            "prochaine-video"
        );


    if (!bloc) {

        return;

    }


    const titre =
        bloc.querySelector(
            ".activite-nom"
        );


    if (titre) {

        titre.textContent =
            video.titre;

    }


    const conteneurImage =
        bloc.querySelector(
            ".activite-image"
        );


    if (
        conteneurImage &&
        video.image
    ) {

        const image =
            document.createElement("img");


        image.src =
            video.image;


        image.alt =
            video.titre;


        conteneurImage.replaceChildren(
            image
        );

    }


    const date =
        bloc.querySelector(
            ".activite-date"
        );


    if (date) {

        date.textContent =
            formaterDate(
                video.date
            );

    }


    bloc.dataset.date =
        video.date.toISOString();

}


/* =========================================================
   AFFICHER LE PROCHAIN LIVE
========================================================= */

function afficherLive(
    live
) {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    const titre =
        bloc.querySelector(
            ".activite-nom"
        );


    if (titre) {

        titre.textContent =
            live.titre;

    }


    const conteneurImage =
        bloc.querySelector(
            ".activite-image"
        );


    if (
        conteneurImage &&
        live.image
    ) {

        const image =
            document.createElement("img");


        image.src =
            live.image;


        image.alt =
            live.titre;


        conteneurImage.replaceChildren(
            image
        );

    }


    const date =
        bloc.querySelector(
            ".activite-date"
        );


    if (date) {

        date.textContent =
            formaterDate(
                live.date
            );

    }


    bloc.dataset.date =
        live.date.toISOString();


    /*
     * Le bouton "Rejoindre le live"
     * est caché tant que Twitch ne confirme
     * pas que la chaîne est réellement en direct.
     */

    masquerBoutonTwitch();

}


/* =========================================================
   VÉRIFIER LE LIVE TWITCH
========================================================= */

async function verifierLiveTwitch() {

    /*
     * Tant que l'URL du service Twitch
     * n'est pas renseignée, on conserve
     * simplement le prochain live du planning.
     *
     * Le bouton reste caché.
     */

    if (!TWITCH_API_URL) {

        masquerBoutonTwitch();

        return;

    }


    try {

        const reponse =
            await fetch(
                TWITCH_API_URL
            );


        if (!reponse.ok) {

            throw new Error(
                `Erreur Twitch : ${reponse.status}`
            );

        }


        const donnees =
            await reponse.json();


        /*
         * La réponse attendue sera :
         *
         * {
         *     enDirect: true,
         *     titre: "...",
         *     image: "...",
         *     url: "..."
         * }
         */


        if (
            donnees.enDirect
        ) {

            afficherLiveEnDirect(
                donnees
            );

            return;

        }


        /*
         * Si Twitch indique que la chaîne
         * n'est pas en direct, le bouton reste caché.
         */

        masquerBoutonTwitch();

    }
    catch (erreur) {

        console.error(
            "Erreur lors de la vérification de Twitch :",
            erreur
        );


        /*
         * En cas d'erreur, on garde le bouton caché
         * par sécurité.
         */

        masquerBoutonTwitch();

    }

}


/* =========================================================
   AFFICHER LE LIVE EN DIRECT
========================================================= */

function afficherLiveEnDirect(
    donnees
) {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    /* =========================
       TITRE DE L'ENCADRÉ
    ========================= */

    const titreBloc =
        bloc.querySelector(
            ".activite-titre"
        );


    if (titreBloc) {

        titreBloc.textContent =
            "🔴 LA GUILDE EST EN DIRECT";

    }


    /* =========================
       NOM DU JEU
    ========================= */

    const titre =
        bloc.querySelector(
            ".activite-nom"
        );


    if (titre) {

        titre.textContent =
            donnees.titre ||
            "En direct sur Twitch";

    }


    /* =========================
       IMAGE
    ========================= */

    const conteneurImage =
        bloc.querySelector(
            ".activite-image"
        );


    if (
        conteneurImage &&
        donnees.image
    ) {

        const image =
            document.createElement("img");


        image.src =
            donnees.image;


        image.alt =
            donnees.titre ||
            "Live Twitch";


        conteneurImage.replaceChildren(
            image
        );

    }


    /* =========================
       DATE
    ========================= */

    const date =
        bloc.querySelector(
            ".activite-date"
        );


    if (date) {

        date.textContent =
            "🔴 En direct maintenant";

    }


    /* =========================
       COMPTE À REBOURS
    ========================= */

    const compteur =
        bloc.querySelector(
            ".activite-compte-a-rebours"
        );


    if (compteur) {

        compteur.textContent =
            "";

    }


    /*
     * On supprime la date utilisée
     * par le compte à rebours.
     */

    delete bloc.dataset.date;


    /* =========================
       BOUTON
    ========================= */

    afficherBoutonTwitch(
        "Rejoindre le live",
        donnees.url ||
        TWITCH_URL
    );


    afficherBoutonTwitchVisible();

}


/* =========================================================
   BOUTON TWITCH
========================================================= */

function afficherBoutonTwitch(
    texte,
    url = TWITCH_URL
) {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    const bouton =
        bloc.querySelector(
            ".bouton-twitch"
        );


    if (!bouton) {

        return;

    }


    bouton.textContent =
        texte;


    bouton.href =
        url;

}


/* =========================================================
   AFFICHER LE BOUTON TWITCH
========================================================= */

function afficherBoutonTwitchVisible() {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    const bouton =
        bloc.querySelector(
            ".bouton-twitch"
        );


    if (!bouton) {

        return;

    }


    bouton.style.display =
        "";

}


/* =========================================================
   MASQUER LE BOUTON TWITCH
========================================================= */

function masquerBoutonTwitch() {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    const bouton =
        bloc.querySelector(
            ".bouton-twitch"
        );


    if (!bouton) {

        return;

    }


    bouton.style.display =
        "none";

}


/* =========================================================
   FORMATER LA DATE
========================================================= */

function formaterDate(
    date
) {

    const maintenant =
        new Date();


    const memeJour =
        date.getFullYear() === maintenant.getFullYear()
        &&
        date.getMonth() === maintenant.getMonth()
        &&
        date.getDate() === maintenant.getDate();


    const heure =
        date.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    if (memeJour) {

        return (
            "Aujourd'hui à "
            +
            heure
        );

    }


    const jour =
        date.toLocaleDateString(
            "fr-FR",
            {
                weekday: "long"
            }
        );


    return (
        jour.charAt(0).toUpperCase()
        +
        jour.slice(1)
        +
        " à "
        +
        heure
    );

}


/* =========================================================
   COMPTE À REBOURS
========================================================= */

function lancerCompteARebours(
    idBloc
) {

    const bloc =
        document.getElementById(
            idBloc
        );


    if (!bloc) {

        return;

    }


    const compteur =
        bloc.querySelector(
            ".activite-compte-a-rebours"
        );


    if (!compteur) {

        return;

    }


    function actualiser() {

        /*
         * Le bloc peut être passé en mode
         * "en direct" entre deux actualisations.
         */

        if (!bloc.dataset.date) {

            return;

        }


        const date =
            new Date(
                bloc.dataset.date
            );


        const difference =
            date.getTime()
            -
            Date.now();


        if (difference <= 0) {

            compteur.textContent =
                "🎬 C'est maintenant !";

            return;

        }


        compteur.textContent =
            "⏳ Dans "
            +
            formaterDuree(
                difference
            );

    }


    actualiser();


    setInterval(
        actualiser,
        1000
    );

}


/* =========================================================
   FORMATER LE COMPTE À REBOURS
========================================================= */

function formaterDuree(
    millisecondes
) {

    let secondes =
        Math.floor(
            millisecondes / 1000
        );


    const jours =
        Math.floor(
            secondes / 86400
        );


    secondes %= 86400;


    const heures =
        Math.floor(
            secondes / 3600
        );


    secondes %= 3600;


    const minutes =
        Math.floor(
            secondes / 60
        );


    secondes %= 60;


    const morceaux = [];


    if (jours > 0) {

        morceaux.push(
            `${jours}j`
        );

    }


    if (
        heures > 0 ||
        jours > 0
    ) {

        morceaux.push(
            `${heures}h`
        );

    }


    if (
        minutes > 0 ||
        heures > 0 ||
        jours > 0
    ) {

        morceaux.push(
            `${minutes}min`
        );

    }


    morceaux.push(
        `${secondes}s`
    );


    return morceaux.join(" ");

}


/* =========================================================
   AUCUNE VIDÉO
========================================================= */

function afficherAucuneVideo() {

    const bloc =
        document.getElementById(
            "prochaine-video"
        );


    if (!bloc) {

        return;

    }


    const titre =
        bloc.querySelector(
            ".activite-nom"
        );


    const date =
        bloc.querySelector(
            ".activite-date"
        );


    const compteur =
        bloc.querySelector(
            ".activite-compte-a-rebours"
        );


    if (titre) {

        titre.textContent =
            "Aucune vidéo programmée";

    }


    if (date) {

        date.textContent =
            "";

    }


    if (compteur) {

        compteur.textContent =
            "";

    }

}


/* =========================================================
   AUCUN LIVE
========================================================= */

function afficherAucunLive() {

    const bloc =
        document.getElementById(
            "prochain-live"
        );


    if (!bloc) {

        return;

    }


    const titre =
        bloc.querySelector(
            ".activite-nom"
        );


    const date =
        bloc.querySelector(
            ".activite-date"
        );


    const compteur =
        bloc.querySelector(
            ".activite-compte-a-rebours"
        );


    if (titre) {

        titre.textContent =
            "Aucun live programmé";

    }


    if (date) {

        date.textContent =
            "";

    }


    if (compteur) {

        compteur.textContent =
            "";

    }


    masquerBoutonTwitch();

}


/* =========================================================
   ERREUR
========================================================= */

function afficherErreur() {

    const blocVideo =
        document.getElementById(
            "prochaine-video"
        );


    const blocLive =
        document.getElementById(
            "prochain-live"
        );


    if (blocVideo) {

        const titre =
            blocVideo.querySelector(
                ".activite-nom"
            );


        if (titre) {

            titre.textContent =
                "Impossible de charger le planning";

        }

    }


    if (blocLive) {

        const titre =
            blocLive.querySelector(
                ".activite-nom"
            );


        if (titre) {

            titre.textContent =
                "Impossible de charger le planning";

        }

    }


    masquerBoutonTwitch();

}