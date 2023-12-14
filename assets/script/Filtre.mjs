export default class Filtre
{
    #domParent;
    #aData;

    // Inséré les catégories sur lesquels je veux générer les filtres
    #aCatFiltre =[{
        propriete :"CategorieObjet",
        etiquette : "Catégories", 
        valeurs : []
    },
    {
        propriete :"SousCategorieObjet",
        etiquette : "Sous-Catégories", 
        valeurs : []
    },
    {
        propriete :"Arrondissement",
        etiquette : "Arrondissements", 
        valeurs : []
    }];

    // Insère en propriété le parent de DOM sur lequel on veut insérer les données
    constructor(domParent)
    {
        this.#domParent = domParent
    };

    // Génère les filtres correspondants entre les catégories précisées dans la propriété de l'objet et la valeur des propriétés du tableau de données envoyé dans la méthode
    setCategorie(data)
    {
        this.#aData = data;
        this.#aCatFiltre.forEach((catFiltre)=>
        {
            let prop = catFiltre.propriete;
            let valeur = [];
            data.forEach(uneOeuvre => 
            {
                valeur.push(uneOeuvre[prop]);
            });
            // Fait un tableau avec les valeurs trouvées
            valeur = [...(new Set(valeur))];    // Avec l'opérateur de décomposition (spread operator)

            // Les insèrent dans les valeurs de la propriété de chaque catégorie correspondante
            catFiltre.valeurs = valeur;
        });
    };

    /**
     * Applique les filtres sur les données en fonction des paramètres
     * @param {Object} params 
     * @param {String} params.cat - La propriété à filtrer
     * @param {String | Number} params.valeur - La valeur du filtre
     * @return {Array} - Données filtrés
     */
    
    // Va retourner un tableau avec les données correspondants au filtre envoyé en paramètres
    appliquerFiltre(params)
    {
        let res = [];
        if(params == null)
        {
            res = this.#aData;
        }
        else
        {
            let valeur = params.valeur;
            res = this.#aData.filter((unElement)=>{
                return (unElement[params.cat] == valeur);
            })
        };

        return res;
    };

    // Enlève l'état actif des boutons de filtres au clic du bouton de réinitialisation
    reinitialiseFiltre(boutons){
        for(let filtre of boutons)
        {
        if(filtre.dataset.filtreActif == 1)
            {
                filtre.dataset.filtreActif = 0;
            };
        };
    };

    // Va insérer sous chaque catégorie de filtres les valeurs de filtres correspondantes à chacune
    rendu(){
        let chaineHTML = "";

        this.#aCatFiltre.forEach((uneCatFiltre)=>{
            chaineHTML += `<div><div class="filtre-bouton">${uneCatFiltre.etiquette}<span class="material-icons">arrow_drop_down</span></div><div class="filtre-ferme">`;

            uneCatFiltre.valeurs.forEach((uneValeur)=>{
                chaineHTML += `<li class="choixFiltre" data-js-cat="${uneCatFiltre.propriete}" data-js-cat-valeur="${uneValeur}" data-filtre-actif="0">${uneValeur}</li>`;
            })
            
            chaineHTML += `</div></div>`;
        });

        this.#domParent.innerHTML = chaineHTML;
    };
};
