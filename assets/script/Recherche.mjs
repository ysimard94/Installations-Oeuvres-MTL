export default class Recherche 
{
    // Va comparer la valeur rentrée par l'utilisateur avec celles des conditions
    // et retourner un tableau correspondants à celle-ci
    rechercheListe(params, liste)
    {
        let res = [];
        const valeur = params.valeur.toLowerCase();

        for(let uneOeuvre of liste){
            if (uneOeuvre.Titre.toLowerCase().includes(valeur) ||
            uneOeuvre.DateFinProduction.includes(valeur) ||
            uneOeuvre.NomArtistes.toLowerCase().includes(valeur) ||
            uneOeuvre.Arrondissement.toLowerCase().includes(valeur))
            {
                res.push(uneOeuvre);
            };
        };

        return res;
    };
};