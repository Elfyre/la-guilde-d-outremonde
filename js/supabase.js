const SUPABASE_URL = 'https://oyboplkuhwkodsogtfqr.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_bTLzG5fYGGLp5c4CUUnYmQ_BrmzRNle';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log(
    "✅ Connexion Supabase initialisée :",
    supabaseClient
);


/* =====================================================
   TEST CONNEXION SUPABASE
===================================================== */

async function testerSupabase() {

    const { data, error } =
        await supabaseClient
            .from('jeux')
            .select('id, nom, statut');

    if (error) {

        console.error(
            '❌ Erreur Supabase :',
            error
        );

        return null;
    }

    console.log(
        '✅ Jeux récupérés depuis Supabase :',
        data
    );

    return data;
}


/* =====================================================
   UTILISATEUR ANONYME
===================================================== */

async function obtenirUtilisateurAnonyme() {

    const {
        data: { session },
        error
    } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            '❌ Erreur récupération session :',
            error
        );

        return null;
    }

    if (session?.user) {

        console.log(
            '✅ Session existante retrouvée :',
            session.user
        );

        return session.user;
    }

    const {
        data,
        error: signInError
    } =
        await supabaseClient.auth.signInAnonymously();

    if (signInError) {

        console.error(
            '❌ Erreur utilisateur anonyme :',
            signInError
        );

        return null;
    }

    console.log(
        '✅ Nouvel utilisateur anonyme créé :',
        data.user
    );

    return data.user;
}


/* =====================================================
   MES VOTES
===================================================== */

async function obtenirMesVotes() {

    const utilisateur =
        await obtenirUtilisateurAnonyme();

    if (!utilisateur) {

        console.error(
            '❌ Impossible de récupérer l’utilisateur.'
        );

        return [];
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from('votes')
            .select('jeu_id')
            .eq('user_id', utilisateur.id);

    if (error) {

        console.error(
            '❌ Erreur récupération de mes votes :',
            error
        );

        return [];
    }

    console.log(
        '✅ Votes de l’utilisateur actuel :',
        data
    );

    return data;
}


/* =====================================================
   RETIRER MON VOTE
===================================================== */

async function retirerVote(jeuId) {

    const utilisateur =
        await obtenirUtilisateurAnonyme();

    if (!utilisateur) {

        console.error(
            '❌ Impossible de récupérer l’utilisateur.'
        );

        return false;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from('votes')
            .delete()
            .eq('jeu_id', jeuId)
            .eq('user_id', utilisateur.id)
            .select();

    if (error) {

        console.error(
            '❌ Erreur lors de la suppression du vote :',
            error
        );

        return false;
    }

    console.log(
        '✅ Vote supprimé :',
        data
    );

    return true;
}


/* =====================================================
   NOMBRE DE VOTES
===================================================== */

async function obtenirNombreVotes(jeuId) {

    const {
        data,
        error
    } =
        await supabaseClient
            .rpc('compter_votes', {
                jeu_id_input: jeuId
            });

    if (error) {

        console.error(
            '❌ Erreur compteur de votes :',
            error
        );

        return 0;
    }

    console.log(
        `✅ Nombre de votes pour ${jeuId} :`,
        data
    );

    return data;
}


/* =====================================================
   JEUX AVEC LEURS VOTES
===================================================== */

async function obtenirJeuxAvecVotes() {

    const jeux =
        await testerSupabase();

    if (!jeux) {

        console.error(
            '❌ Impossible de récupérer les jeux.'
        );

        return [];
    }

    const mesVotes =
        await obtenirMesVotes();

    const jeuxAvecVotes = [];


    for (const jeu of jeux) {

        const nombreVotes =
            await obtenirNombreVotes(
                jeu.id
            );

        const dejaVote =
            mesVotes.some(
                vote =>
                    vote.jeu_id === jeu.id
            );


        jeuxAvecVotes.push({

            id: jeu.id,

            nom: jeu.nom,

            statut: jeu.statut,

            nombreVotes: nombreVotes,

            dejaVote: dejaVote

        });

    }


    console.log(
        '✅ Jeux avec leurs votes :',
        jeuxAvecVotes
    );

    return jeuxAvecVotes;
}