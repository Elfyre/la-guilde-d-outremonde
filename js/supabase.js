const SUPABASE_URL = 'https://oyboplkuhwkodsogtfqr.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_bTLzG5fYGGLp5c4CUUnYmQ_BrmzRNle';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("✅ Connexion Supabase initialisée :", supabaseClient);


async function testerSupabase() {

    const { data, error } = await supabaseClient
        .from('jeux')
        .select('id, nom');

    if (error) {

        console.error('❌ Erreur Supabase :', error);

        return;
    }

    console.log('✅ Jeux récupérés depuis Supabase :', data);

    return data;
}


async function obtenirUtilisateurAnonyme() {

    const { data: { session }, error } =
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

    const { data, error: signInError } =
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


async function obtenirMesVotes() {

    const utilisateur = await obtenirUtilisateurAnonyme();

    if (!utilisateur) {

        console.error(
            '❌ Impossible de récupérer l’utilisateur.'
        );

        return [];
    }

    const { data, error } = await supabaseClient
        .from('votes')
        .select('jeu_id');

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


async function obtenirNombreVotes(jeuId) {

    const { data, error } = await supabaseClient
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


async function obtenirJeuxAvecVotes() {

    const jeux = await testerSupabase();

    if (!jeux) {

        console.error(
            '❌ Impossible de récupérer les jeux.'
        );

        return [];
    }

    const mesVotes = await obtenirMesVotes();

    const jeuxAvecVotes = [];

    for (const jeu of jeux) {

        const nombreVotes = await obtenirNombreVotes(jeu.id);

        const dejaVote = mesVotes.some(
            vote => vote.jeu_id === jeu.id
        );

        jeuxAvecVotes.push({
            id: jeu.id,
            nom: jeu.nom,
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


obtenirJeuxAvecVotes();