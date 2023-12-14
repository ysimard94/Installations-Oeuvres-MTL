export default class Catalogue{
    #aOeuvres;
    #domParent;

    // Insère en propriété le parent de DOM sur lequel on veut insérer les données
    constructor(domParent)
    {
        this.#domParent = domParent;
    };

    // Insère en propriété le tableau de données sur lequel on veut travailler
    setOeuvres(data)
    {
        this.#aOeuvres = data;
    };

    // Va convertir la valeur timestamp envoyée et retourner une date de format d-m-Y
    convertirDate(date)
    {
        date = date.slice(0, date.indexOf('-'));
        date = date.slice(date.indexOf('(') + 1);
        date = Number(date);
        let jour = new Date(date).getDay();
        let mois = new Date(date).toLocaleDateString('fr-CA', { month: 'long'});
        let annee = new Date(date).getFullYear();
        date = jour + " " + mois + " " + annee;

        return date;
    };

    // Si la donnée de la propriété de date est null, elle est donnée une valeur de base, sinon elle rentre dans une autre méthode de convertion
    convertirDateProp(prop)
    {
        if(prop == null)
        {
            prop = "Date inconnue";
            return prop;
        }
        else
        {
            let date = this.convertirDate(prop);
            return date;
        };
    };


    // Va remplacer les points virgules de la valeur d'une propriété envoyée pour que ce soit plus présentable
    formatterPonctuation(prop)
    {
        if(prop != null)
        {
            prop = prop.replace(/;/g, ', ');
        }

        return prop;
    }

    // Je mets ici les propriétés que je veux convertir ou formatter la ponctuation
    convertionProp(data)
    {
        data.forEach(uneOeuvre=> 
            {
                uneOeuvre['DateAccession'] = this.convertirDateProp(uneOeuvre['DateAccession']);
                uneOeuvre['DateFinProduction'] = this.convertirDateProp(uneOeuvre['DateFinProduction']);

                uneOeuvre.Materiaux = this.formatterPonctuation(uneOeuvre.Materiaux);
                uneOeuvre.Technique = this.formatterPonctuation(uneOeuvre.Technique);
            });
    }
    
    // Va afficher le contenu du tableau de données dans la page
    rendu()
    {
        let chaineHtml = "";

        this.#aOeuvres.forEach(uneOeuvre=> {
            let artisteNom = "";

            // Je rentre dans une boucle car le tableau d'artistes peut avoir plusieurs artistes
            uneOeuvre.Artistes.forEach((artistes) =>{
                let artiste = artistes;

                if(uneOeuvre.Artistes.length < 2)
                {
                    if(artiste.Prenom == null)
                    {
                        artiste.Prenom = "Artiste";
                        artiste.Nom = "Inconnu";
                    }
                    artisteNom += artiste.Prenom + " " + artiste.Nom;
                }
                else
                {
                    artisteNom += artiste.Prenom + " " + artiste.Nom + " & "
                };
            });
            
            // S'il y a plus qu'un artiste, j'utilise slice pour enlever le dernier & car il y en avait un d'ajouté à chaque concaténation d'artiste
            if(artisteNom.includes('&'))
            {
                artisteNom = artisteNom.slice(0, -2);
            };

            // J'insère la valeur dans une nouvelle propriété pour facilité la fonction de recherche avec les noms d'artistes
            uneOeuvre.NomArtistes = artisteNom;

            chaineHtml += `<article class="carte">
                                <header>
                                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=${uneOeuvre.CoordonneeLatitude},${uneOeuvre.CoordonneeLongitude}&zoom=14&markers=size=mid|${uneOeuvre.CoordonneeLatitude},${uneOeuvre.CoordonneeLongitude}&size=250x250&key=AIzaSyCsfanp2M2Z6sK-XD94E9CU75bYnNvOW3w"></img>
                                    <h2>${uneOeuvre.Titre}</h2> 
                                </header>
                                    <div class="contenu">
                                    <h3>${uneOeuvre.CategorieObjet}</h3>
                                    <h4>${uneOeuvre.SousCategorieObjet}</h4>
                                    <p>Arrondissement : ${uneOeuvre.Arrondissement}</p>
                                    <p>Fin de production : ${uneOeuvre.DateFinProduction}<p>
                                    <p>Artiste(s) : ${artisteNom}</p>
                                </div>
                            </article>`;
        });

        // Insère la carte avec les informations de l'oeuvre dans le catalogue
        this.#domParent.innerHTML = chaineHtml;
    };
};
