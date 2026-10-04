/* =========================================================
   ARCHIVES — MOTEUR DE RECHERCHE
   La Guilde d'Outremonde
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const sourcesArchives = [

    {
        nom: "Playlists des Aventures",
        icone: "⚔️",
        fichier: "archives/aventures.html"
    },

    {
        nom: "Lives bruts",
        icone: "🔴",
        fichier: "archives/lives.html"
    },

    {
        nom: "Le Mercredi Chaos",
        icone: "🎲",
        fichier: "archives/lmc.html"
    }

];


/* =========================================================
   ÉLÉMENTS DE LA PAGE
   ========================================================= */

const champRecherche =
    document.getElementById("rechercheArchives");

const resultatsArchives =
    document.getElementById("resultatsArchives");

const categoriesArchives =
    document.querySelector(".archives");


/* =========================================================
   NORMALISATION DU TEXTE
   Permet de rechercher sans tenir compte des accents
   ni des majuscules.
   ========================================================= */

function normaliserTexte(texte) {

    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


/* =========================================================
   CHARGEMENT DES PAGES
   ========================================================= */

async function chargerArchives() {

    const archives = [];


    for (const source of sourcesArchives) {

        try {

            const reponse =
                await fetch(source.fichier);


            if (!reponse.ok) {

                console.error(
                    `Impossible de charger ${source.fichier}`
                );

                continue;

            }


            const html =
                await reponse.text();


            const documentSource =
                new DOMParser().parseFromString(
                    html,
                    "text/html"
                );


            /*
             * Toutes les cartes de jeux
             */

            const cartes =
                documentSource.querySelectorAll(
                    ".archive"
                );


            cartes.forEach(carte => {

                const titre =
                    carte.querySelector("h2")
                        ?.textContent
                        .trim() || "";


                const description =
                    carte.querySelector("p")
                        ?.textContent
                        .trim() || "";


                const statut =
                    carte.querySelector(".statut-playlist")
                        ?.textContent
                        .trim() || "";


                const image =
                    carte.querySelector("img")
                        ?.getAttribute("src")
                        || "";


                const lien =
                    carte.querySelector("a")
                        ?.getAttribute("href")
                        || "";


                /*
                 * On ignore les cartes sans titre
                 */

                if (!titre) {

                    return;

                }


                archives.push({

                    titre,

                    description,

                    statut,

                    image,

                    lien,

                    categorie:
                        source.nom,

                    icone:
                        source.icone

                });

            });


            /*
             * La playlist principale du Mercredi Chaos
             */

            if (
                source.fichier === "archives/lmc.html"
            ) {

                const playlistPrincipale =
                    documentSource.querySelector(
                        ".archive-principale"
                    );


                if (playlistPrincipale) {

                    const titre =
                        playlistPrincipale
                            .querySelector("h2")
                            ?.textContent
                            .trim() || "";


                    const description =
                        playlistPrincipale
                            .querySelector("p")
                            ?.textContent
                            .trim() || "";


                    const statut =
                        playlistPrincipale
                            .querySelector(".statut-playlist")
                            ?.textContent
                            .trim() || "";


                    const image =
                        playlistPrincipale
                            .querySelector("img")
                            ?.getAttribute("src")
                            || "";


                    const lien =
                        playlistPrincipale
                            .querySelector("a")
                            ?.getAttribute("href")
                            || "";


                    archives.push({

                        titre,

                        description,

                        statut,

                        image,

                        lien,

                        categorie:
                            "Le Mercredi Chaos",

                        icone:
                            "🎲"

                    });

                }

            }

        }

        catch (erreur) {

            console.error(
                `Erreur lors du chargement de ${source.fichier}`,
                erreur
            );

        }

    }


    return archives;

}


/* =========================================================
   DONNÉES DES ARCHIVES
   ========================================================= */

let toutesLesArchives = [];


/* =========================================================
   RECHERCHE
   ========================================================= */

async function rechercherArchives() {

    const recherche =
        normaliserTexte(
            champRecherche.value
        );


    /*
     * Si aucune recherche :
     * on remet la page normale.
     */

    if (!recherche) {

        resultatsArchives.innerHTML = "";

        categoriesArchives.style.display = "";

        return;

    }


    /*
     * Chargement des archives
     */

    if (toutesLesArchives.length === 0) {

        toutesLesArchives =
            await chargerArchives();

    }


    /*
     * RECHERCHE UNIQUEMENT DANS LE TITRE
     *
     * La description, le statut et la catégorie
     * ne sont PAS pris en compte.
     */

    const resultats =
        toutesLesArchives.filter(archive => {

            const titre =
                normaliserTexte(
                    archive.titre
                );


            return titre.includes(
                recherche
            );

        });


    /*
     * Masquer les catégories
     */

    categoriesArchives.style.display =
        "none";


    /*
     * Aucun résultat
     */

    if (resultats.length === 0) {

        resultatsArchives.innerHTML = `

            <div class="aucun-resultat">

                <span>
                    🔎
                </span>

                <h3>
                    Aucun résultat
                </h3>

                <p>
                    Aucune archive ne correspond à
                    « ${champRecherche.value} ».
                </p>

            </div>

        `;

        return;

    }


    /*
     * Affichage des résultats
     */

    resultatsArchives.innerHTML =
        resultats
            .map(archive => {

                /*
                 * Corriger les chemins d'images
                 *
                 * Les pages sources utilisent ../../
                 * car elles sont dans archives/.
                 *
                 * Depuis archives.html, il faut utiliser
                 * ../images/.
                 */

                let image =
                    archive.image;


                if (
                    image.startsWith("../../")
                ) {

                    image =
                        image.replace(
                            "../../",
                            "../"
                        );

                }


                return `

                    <article class="resultat-archive">


                        <div class="resultat-image">

                            ${
                                image
                                    ? `
                                        <img
                                            src="${image}"
                                            alt="${archive.titre}"
                                        >
                                      `
                                    : ""
                            }

                        </div>


                        <div class="resultat-contenu">

                            <span class="resultat-categorie">

                                ${archive.icone}
                                ${archive.categorie}

                            </span>


                            <h3>
                                ${archive.titre}
                            </h3>


                            ${
                                archive.description
                                    ? `
                                        <p>
                                            ${archive.description}
                                        </p>
                                      `
                                    : ""
                            }


                            ${
                                archive.statut
                                    ? `
                                        <span class="statut-playlist">
                                            ${archive.statut}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>


                        ${
                            archive.lien
                                ? `
                                    <a
                                        href="${archive.lien}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="bouton"
                                    >
                                        Explorer
                                    </a>
                                  `
                                : ""
                        }

                    </article>

                `;

            })
            .join("");

}


/* =========================================================
   ÉVÉNEMENT DE RECHERCHE
   ========================================================= */

champRecherche.addEventListener(
    "input",
    rechercherArchives
);