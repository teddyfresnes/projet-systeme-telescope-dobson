function calculHorizontal()
{	alert('lol');
}
	// /* Liste des données */

	// // Données équatoriales //
	// var time;		// Temps reçu
	// var SS;			// Seconde
	// var MM;			// Minute
	// var HH;			// Heure
	// var HHf;		// Heure décimale
	// var date;		// Date reçu
	// var year;		// Année
	// var month;		// Mois	
	// var day;		// Jour
	// var JJ;			// Jour julien
	// var J2000;		// Jours depuis 2000
	// var Lat_dms;	// Latitude degré minute seconde
	// var Lat_dd;		// Latitude degré décimal
	// var Long_dms;	// Longitude degré minute seconde
	// var Long_dd;	// Longitude dégré décimal
	// var LST;		// Temps sidéral local
	// var HA;			// Angle horaire
	// var Alt;		// Hauteur
	// var Az;			// Azimut

	// // Données astrales //
	// var RA_hms;		// Ascencion droite heure minute seconde
	// var RA_hd;		// Ascencion droite heure décimal
	// var RA_dd;		// Ascencion droite degré décimal
	// var Dec_dms;	// Déclinaison degré minute seconde
	// var Dec_dd;		// Déclinaison degré décimal
	// var Az;			// Azimut
	// var Alt;		// Hauteur
	// var DeltaAz;	// Delta azimut
	// var DeltaAlt;	// Delta hauteur




	// /* Import des données de l'IHM */

	// // Import des données //
	// time = document.getElementById("var_time");
	// SS = parseInt(time.substring(6,7));
	// MM = parseInt(time.substring(3,5));
	// HH = parseInt(time.substring(0,2));
	// date = document.getElementById("var_date");
	// year = parseInt(date.substring(6,7));
	// month = parseInt(date.substring(3,5));
	// day = parseFloat(date.substring(0,2));
	// Long_dms = document.getElementById("var_long");
	// Lat_dms = document.getElementById("var_lat");

	// RA_hms = document.getElementById("ascention_i");
	// Dec_dms = document.getElementById("declinaison_i");

	// // Traitement des données //
	// HHf = HH + MM/60 + SS/3600;
	// Long_dd = parseInt(Long_dms.substring(0,3)) + parseInt(Long_dms.substring(4,6))/60 + parseInt(Long_dms.substring(7,9))/3600;
	//document.getElementById("var_deltaaz").innerHTML = "lol";




	// /* Calcul J2000 */

	// // Variables pour le calcul //
	// var a;
	// var y;
	// var m;

	// // Calcul J2000 //
	// a = Math.trunc((14-month)/12);
	// y = year + 4800 - a;
	// m = month + 12*a - 3;

	// JJ = day + Math.trunc((153*m+2)/5) + Math.trunc(365*y + y/4 - y/100 + y/400 - 32045);
	// J2000 = JJ - 2451545;


//}

/* Calcul temps sidéral local */


// /* Calcul des données pour l"IHM */

// // Calcul des données //


// TSL = HHf + (Long/15);
// HA = TSL - RA;
// Alt = Math.asin(Math.sin(Lat) * Math.sin(Dec) + Math.cos(Lat) * Math.cos(Dec) * Math.cos(HA));
// Az = Math.acos(Math.sin(Dec) * Math.sin(Alt) + Math.sin(Lat)) / Math.cos(Alt) * Math.cos(Lat);
// deltaAz = RA - Az;
// deltaAlt = Dec - Alt;


// // Fonction pour convertir un angle en degrés en radians
// function degresEnRadians(angle) {
  // return angle * (Math.PI / 180);
// }

// // Fonction pour calculer le delta azimuth et le delta hauteur
// function calculerDeltaAzimuthEtHauteur(latitude, longitude, ha1, dec1, ha2, dec2) {
  // // Convertir les angles en décimal
  // ha1 = heuresEnDecimal(ha1.heures, ha1.minutes, ha1.secondes);
  // ha2 = heuresEnDecimal(ha2.heures, ha2.minutes, ha2.secondes);
  // dec1 = degresEnRadians(dec1);
  // dec2 = degresEnRadians(dec2);
  // latitude = degresEnRadians(latitude);
  // longitude = degresEnRadians(longitude);

  // // Calculer l"heure sidérale locale
  // var tsl = heureSidéraleLocale(longitude);

  // // Calculer l"angle horaire pour chaque position
  // var ah1 = tsl - ha1;
  // var ah2 = tsl - ha2;

  // // Calculer les coordonnées équatoriales de chaque position
  // var eq1 = coordonnéesÉquatoriales(ah1, dec1);
  // var eq2 = coordonnéesÉquatoriales(ah2, dec2);

  // // Calculer le delta azimuth et le delta hauteur
  // var deltaAzimuth = Math.atan2(Math.sin(eq2.azimuth - eq1.azimuth), Math.cos(eq2.azimuth - eq1.azimuth) * Math.sin(latitude) - Math.tan(eq1.hauteur) * Math.cos(latitude));
  // var deltaHauteur = Math.asin(Math.sin(latitude) * Math.sin(eq1.hauteur) + Math.cos(latitude) * Math.cos(eq1.hauteur) * Math.cos(eq2.hauteur - eq1.hauteur));

  // // Convertir le delta azimuth en degrés
  // deltaAzimuth = deltaAzimuth * (180 / Math.PI);

  // // Convertir le delta hauteur en degrés
  // deltaHauteur = deltaHauteur * (180 / Math.PI);

  // // Retourner les résultats
  // return {
    // deltaAzimuth: deltaAzimuth,
    // deltaHauteur: deltaHauteur
  // };
// }

// // Exemple d"utilisation
// var latitude = 48.8567; // Paris
// var longitude = 2.3508;
// var ha1 = { heures: 18, minutes: 34, secondes: 32.3 };
// var dec1 = 38.78;
// var ha2 = { heures: 18, minutes: 38, secondes: 12.6 };
// var dec2 = 40.15;

// var resultat = calculerDeltaAzimuthEtHauteur(latitude, longitude, ha1, dec1, ha2, dec2);

// console.log("Delta Azimuth : " + resultat.deltaAzimuth.toFixed(2) + " degrés");
// console.log("Delta Hauteur : " + resultat.deltaHauteur.toFixed(2) + " degrés");*/














/*$(document).ready(function()
{
    // Lorsque la page est chargée, on charge les données dans la div
    $("#formAjax1").submit(function(event)
	{
		// empecher le traitement par défaut du formulaire
		event.preventDefault();
		
		// envoi d'une requete ajax pour récupérer les données
		url: "home.php",
		type: "GET",
		data: $("#formAjax1").serialize(),
		success: function(data)
		{
			// maj de la div avec les nouvelles données
			$("#container_3_choice").html(data);
		}
	}
};*/