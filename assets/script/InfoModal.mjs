export default class InfoModal{

    #domParent
    #aOeuvres

    // Insère en propriété le parent de DOM sur lequel on veut insérer les données
    constructor(domParent){
        this.#domParent = domParent;
    }

    // Insère le tableau de données en paramètres pour être utilisé en comparaison
    setOeuvres(data)
    {
        this.#aOeuvres = data;
    };
    
    // Va insérer les informations plus en détail avec le titre de la carte cliquée envoyé en paramètre
    insererInformations(titreOeuvre)
    {
        let chaineHtml = "";
        
        // Va parcourir le tableau mis en propriété pour trouver quel objet correspond au titre envoyé en paramètre
        this.#aOeuvres.forEach(uneOeuvre=> {

            // Va remplacer les valeurs null par inconnu
            uneOeuvre.Materiaux = this.verificationNull(uneOeuvre.Materiaux);
            uneOeuvre.DimensionsGenerales = this.verificationNull(uneOeuvre.DimensionsGenerales);
            uneOeuvre.ModeAcquisition = this.verificationNull(uneOeuvre.ModeAcquisition);

            // Si le titre correspond à la valeur de titre d'un objet, il imprime les informations de cet objet dans la boite modale
            if(titreOeuvre.innerHTML == uneOeuvre.Titre)
            {
                chaineHtml = `  <button>X</button>
                                <header>
                                    <h2>${uneOeuvre.Titre}</h2>
                                </header>
                                <div class="contenu">
                                    <h3>Artiste(s) : ${uneOeuvre.NomArtistes}</h3>
                                    <h3>${uneOeuvre.CategorieObjet}</h3>
                                    <h4>${uneOeuvre.SousCategorieObjet}</h4>
                                    <p>Arrondissement : ${uneOeuvre.Arrondissement}</p>`;

                if(uneOeuvre.AdresseCivique != null)
                {
                    chaineHtml += `<p>Adresse : ${uneOeuvre.AdresseCivique}</p>`;
                }
                else 
                {
                    chaineHtml += `Adresse : Inconnue`;
                }

                if(uneOeuvre.Parc != null){
                    chaineHtml += `<p>Parc : ${uneOeuvre.Parc}</p>`;
                }

                if(uneOeuvre.Batiment != null)
                {
                    chaineHtml += `<p>Bâtiment : ${uneOeuvre.Batiment}</p>`;
                }

                if(uneOeuvre.Technique != null)
                {
                    chaineHtml += `<p>Technique utilisée : ${uneOeuvre.Technique}</p>`;
                }
                
                chaineHtml +=  `    <p>Fin de production : ${uneOeuvre.DateFinProduction}</p>
                                    <p>Date d'accession : ${uneOeuvre.DateAccession}</p>
                                    <p>Mode d'acquisition : ${uneOeuvre.ModeAcquisition}</p>
                                    <p>Matériaux utilisé : ${uneOeuvre.Materiaux}</p>
                                    <p>Dimensions générales : ${uneOeuvre.DimensionsGenerales}</p>
                                </div>`;
            }
        });

        this.#domParent.innerHTML = chaineHtml;
    }

    // Insère la valeur d'inconnu pour les propriétés qui ont comme valeur null
    verificationNull(param)
    {
        if(param == null)
        {
            param = "Inconnu";
        }
        
        return param;
    }
}