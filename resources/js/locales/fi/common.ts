const fiCommon = {
    common: {
        language: 'Kieli',
        english: 'Englanti',
        finnish: 'Suomi',
        loading: 'Ladataan...',
        navigation: 'Navigointi',
    },

    nav: {
        dashboard: 'Hallintapaneeli',
        patients: 'Potilaat',
        repository: 'Repositorio',
        documentation: 'Dokumentaatio',
        navigationMenu: 'Navigointivalikko',
    },

    auth: {
        login: 'Kirjaudu sisään',
        register: 'Rekisteröidy',
        verifyEmail: 'Vahvista sähköposti',
        pleaseLoginToContinue: 'Kirjaudu sisään jatkaaksesi',
        email: 'Sähköposti',
        password: 'Salasana',
        enterYourEmail: 'Syötä sähköpostiosoitteesi',
        rememberMe: 'Muista minut',
        signIn: 'Kirjaudu sisään',
        signingIn: 'Kirjaudutaan...',
        unexpectedError: 'Tapahtui odottamaton virhe',
        useCredentialsFromDatabase: 'Käytä tietokannan tunnuksia',
        loginWithDatabaseUser: 'Kirjaudu käyttäjät-taulun tunnuksilla',
        noAccount: 'Eikö sinulla ole tiliä?',
        signUp: 'Rekisteröidy',
    },

    user: {
        welcome: 'Tervetuloa',
        settings: 'Asetukset',
        logout: 'Kirjaudu ulos',
        myDashboard: 'Oma hallintapaneeli',
    },

    tabs: {
        users: 'Käyttäjät',
        groups: 'Ryhmät',
        waitingList: 'Odotuslista',
        settings: 'Asetukset',
    },

    welcome: {
        title: 'Tervetuloa',
        heading: 'Aloitetaan',
        introLine1: 'Laravelilla on erittäin laaja ekosysteemi.',
        introLine2: 'Suosittelemme aloittamaan seuraavista.',
        readThe: 'Lue',
        documentation: 'dokumentaatio',
        watchTutorials: 'Katso video-oppaat palvelussa',
        laracasts: 'Laracasts',
        deployNow: 'Julkaise nyt',
    },

    users: {
        managementTitle: 'Käyttäjien hallinta',
        searchPlaceholder: 'Hae käyttäjiä...',
        waitingList: 'Odotuslista',
        roles: {
            nurse: 'Hoitaja (vain luku)',
            manager: 'Manageri (CRUD)',
            admin: 'Ylläpitäjä (täysi pääsy)',
        },
        form: {
            firstName: 'Etunimi *',
            lastName: 'Sukunimi *',
            email: 'Sähköposti *',
            role: 'Rooli',
            passwordOptional: 'Salasana (valinnainen)',
            confirmPasswordOptional: 'Vahvista salasana (valinnainen)',
            password: 'Salasana',
            confirmPassword: 'Vahvista salasana',
            passwordHint: 'Jätä Salasana ja Vahvista salasana tyhjäksi, jos haluat säilyttää nykyisen salasanan.',
            newPasswordPlaceholder: 'Uusi salasana (valinnainen)',
            confirmNewPasswordPlaceholder: 'Vahvista uusi salasana',
        },
        errors: {
            fillBothPasswordFields: 'Vaihda salasana täyttämällä molemmat salasanakentät.',
            passwordsDoNotMatch: 'Salasanat eivät täsmää',
            notAllowedToChangePassword: 'Sinulla ei ole oikeutta vaihtaa tätä salasanaa.',
            fillBothOrLeaveEmpty: 'Täytä molemmat salasanakentät tai jätä molemmat tyhjiksi',
        },
    },

    grid: {
        loading: 'Ladataan...',
        add: 'Lisää',
        success: {
            itemUpdated: 'Tieto päivitettiin onnistuneesti!',
        },
        errors: {
            updateFailed: 'Tietueen päivittäminen epäonnistui',
            listViewRequiresProps: 'Listanäkymä vaatii sekä renderItem- että loadPage-propsit.',
        },
        dialog: {
            edit: 'Muokkaa',
            add: 'Lisää',
            save: 'Tallenna',
            cancel: 'Peruuta',
            close: 'Sulje',
        },
        confirmDelete: {
            title: 'Vahvista poistaminen',
            message: 'Haluatko varmasti poistaa tämän kohteen?',
            delete: 'Poista',
            deleting: 'Poistetaan…',
            cancel: 'Peruuta',
        },
        pagination: {
            previous: 'Edellinen',
            next: 'Seuraava',
            page: 'Sivu',
            of: '/',
        },
    },

    table: {
        name: 'Nimi',
        email: 'Sähköposti',
        roleType: 'Roolityyppi',
        actions: 'Toiminnot',
        edit: 'Muokkaa',
        delete: 'Poista',
    },
};

export default fiCommon;
