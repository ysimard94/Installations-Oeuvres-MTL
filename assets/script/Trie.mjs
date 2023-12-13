export default class Trie {

    /**
     * Retourne la liste des maires trié selon les paramètres
     * @param {Object} params - Objet de paramètre
     * @param {string} params.type - Le type de tri : ["Titre", "Artiste"]
     * @param {string} params.ordre - L'ordre du tri : ["ASC", "DESC"]
     */

    // Va trier la liste du tableau envoyé en paramètre selon les sélections de l'utilisateur
    listeTrie(params, liste) {
        // Trie en ordre ascendant de base, sinon si descendant est sélectionné je reverse la liste par titre ou par artistes
        // et retourne la liste triée
        if (params.type === "Titre") {
            liste.sort(function (a, b) {
                console.log(a["Artistes"][0].Prenom);
                return a.Titre.localeCompare(b.Titre, "fr");
            });
        }

        if (params.type === "Titre" && params.ordre === "DESC") 
        {
            liste.reverse();
        }

        if (params.type === "Artistes")
        {
            liste.sort(function (a, b) {
                return a["Artistes"][0].Prenom.localeCompare(b["Artistes"][0].Prenom, "fr");
            });
        }

        if (params.type === "Artistes" && params.ordre == "DESC")
        {
            liste.reverse();
        }

        return liste;
    }
}