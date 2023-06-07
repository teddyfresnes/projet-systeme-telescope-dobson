function check360(number)
{
	
	while (number>360 || number<0)
	{
		
		if (number>360)
		{
			number = number - 360;
		}
		else if (number<0)
		{
			number = number + 360;
		}
	}
	return number;
}




function toDegrees(angle)
{
	return angle*(180/Math.PI);
}




function toRadians(angle)
{
	return angle*(Math.PI/180);
}




/* Liste des données */

// Données équatoriales //
var timed;		// Temps reçu
var SS;			// Seconde
var MM;			// Minute
var HH;			// Heure
var HHf;		// Heure décimale
var date;		// Date reçu
var year;		// Année
var month;		// Mois	
var day;		// Jour
var JJ;			// Jour julien
var J2000;		// Jours depuis 2000
var Lat_dms;	// Latitude degré minute seconde
var Lat_dd;		// Latitude degré décimal
var Long_dms;	// Longitude degré minute seconde
var Long_dd;	// Longitude dégré décimal
var LST_dd;		// Temps sidéral local degré décimal
var HA;			// Angle horaire
var HA_polaire;	// Angle horaire étoile polaire

// Données astrales //
var RA_hms;		// Ascencion droite heure minute seconde
var RA_hd;		// Ascencion droite heure décimal
var RA_dd;		// Ascencion droite degré décimal
var RA_polaire;	// Ascencion droite étoile polaire degré décimal
var Dec_dms;	// Déclinaison degré minute seconde
var Dec_dd;		// Déclinaison degré décimal
var Dec_polaire;// Déclinaison étoile polaire degré décimal
var Az;			// Azimut
var Alt;		// Hauteur
var Az_polaire;	// Azimut étoile polaire
var Alt_polaire;// Hauteur étoile polaire
var DeltaAz;	// Delta azimut
var DeltaAlt;	// Delta hauteur

// Variables pour le calcul //
var a;
var b;
var y;
var m;
	



function calculHorizontal()
{
	event.preventDefault();

	/* Import des données de l'IHM */

	// Import des données //
	timed = document.getElementById("var_time").innerText;
	SS = parseInt(timed.substring(6,8)); // chaine vide les 10 premiers char
	MM = parseInt(timed.substring(3,5));
	HH = parseInt(timed.substring(0,2));
	date = document.getElementById("var_date").innerText;
	year = parseInt(date.substring(6,8))+2000;
	month = parseInt(date.substring(3,5));
	day = parseFloat(date.substring(0,2));
	Long_dms = document.getElementById("var_long").innerText;
	Lat_dms = document.getElementById("var_lat").innerText;
	RA_hms = document.getElementById("ascention_i").value;
	Dec_dms = document.getElementById("declinaison_i").value;
	RA_polaire = 37.954600;
	Dec_polaire = 89.264100;

	// Traitement des données //
	HHf = HH + MM/60 + SS/3600; // Heure décimale
	if ((Lat_dms.includes("0°'") == true) || (Long_dms.includes("°'") == true))
	{
		Lat_dms = "00°00'00\",N ";
		Long_dms = "000°00'00\",E ";
		alert("Les coordonnées GPS n'ont pas été reçues.\n\nVérifiez que le gps connecté est bien dans un lieu ouvert, un plafond, un toit, des arbres peuvent bloquer la réception.");
	}
	Lat_dd = parseFloat(Lat_dms.substring(0,2)) + parseFloat(Lat_dms.substring(3,5))/60 + parseFloat(Lat_dms.substring(6,8))/3600;
	if (Lat_dms.substring(10,11) == 'S') {Lat_dd = Lat_dd * -1;} // Si sud, alors latitude négatif
	Long_dd = parseFloat(Long_dms.substring(0,3)) + parseFloat(Long_dms.substring(4,6))/60 + parseFloat(Long_dms.substring(7,9))/3600;
	if (Long_dms.substring(11,12) == 'W') {Long_dd = Long_dd * -1;} // Si ouest, alors longitude négatif
	RA_hd = parseFloat(RA_hms.substring(0,2)) + parseFloat(RA_hms.substring(3,5)/60) + parseFloat(RA_hms.substring(6,11))/3600;
	RA_dd = (RA_hd*15).toFixed(6);
	Dec_dd = parseFloat(Dec_dms.substring(0,3)) + parseFloat(Dec_dms.substring(4,6)/60) + parseFloat(Dec_dms.substring(7,12))/3600;
	
	

	/* Calcul J2000 */

	if (month > 2)
	{
		y = year;
		m = month;
	}
	else
	{
		y = year - 1;
		m = month + 12;
	}

	// Calcul J2000 //
	a = Math.trunc(y/100);
	b = 2 - a + Math.trunc(a/4); // car date > 1582
	JJ = Math.trunc(365.25 * (y + 4716)) + Math.trunc(30.6001 * (m + 1)) + day + b - 1524.5;
	JJ = JJ + HHf/24;
	J2000 = JJ - 2451545.0;



	/* Calcul Temps Sidéral Local */
	
	LST_dd = 100.46 + 0.985647*J2000 + Long_dd + 15*HHf;
	LST_dd = check360(LST_dd);
	
	
	
	/* Calcul Angle Horaire */
	
	HA = LST_dd - RA_dd;
	HA = check360(HA);
	HA_polaire = LST_dd - RA_polaire;
	HA_polaire = check360(HA_polaire);
	
	
	
	/* Calcul Azimuth et Hauteur */
	
	//
	Alt = toDegrees( Math.asin( Math.sin(toRadians(Dec_dd))*Math.sin(toRadians(Lat_dd))+Math.cos(toRadians(Dec_dd))*Math.cos(toRadians(Lat_dd))*Math.cos(toRadians(HA)) ) );
	Az = toDegrees( Math.acos ( (Math.sin(toRadians(Dec_dd)) - Math.sin(toRadians(Alt))*Math.sin(toRadians(Lat_dd)))/(Math.cos(toRadians(Alt))*Math.cos(toRadians(Lat_dd))) ) );
	if (Math.sin(toRadians(HA)) > 0)
		Az = 360 - Az;
	Alt_polaire = toDegrees( Math.asin( Math.sin(toRadians(Dec_dd))*Math.sin(toRadians(Lat_dd))+Math.cos(toRadians(Dec_dd))*Math.cos(toRadians(Lat_dd))*Math.cos(toRadians(HA_polaire)) ) );
	Az_polaire = toDegrees( Math.acos ( (Math.sin(toRadians(Dec_dd)) - Math.sin(toRadians(Alt_polaire))*Math.sin(toRadians(Lat_dd)))/(Math.cos(toRadians(Alt_polaire))*Math.cos(toRadians(Lat_dd))) ) );
	if (Math.sin(toRadians(HA_polaire)) > 0)
		Az_polaire = 360 - Az_polaire;
	
	DeltaAlt = Alt_polaire - Alt;
	DeltaAz = Az_polaire - Az;
	
	if (DeltaAz>180)
		DeltaAz = DeltaAz - 360;
	if (DeltaAz<-180)
		DeltaAz = DeltaAz + 360;
	
	document.getElementById("var_deltaalt").innerHTML = DeltaAlt;
	document.getElementById("var_deltaaz").innerHTML = DeltaAz;
}


function showMe()
{
	if (document.getElementById("wrapper_fly").style.display == "block")
	{
		document.getElementById("wrapper_fly").style.display = "none";
	}
	else
	{
		document.getElementById("wrapper_fly").style.display = "block";
		
		document.getElementById("var_timed").innerHTML = timed;
		document.getElementById("var_date2").innerHTML = date;
		document.getElementById("var_HHf").innerHTML = HHf;
		document.getElementById("var_a").innerHTML = a;
		document.getElementById("var_b").innerHTML = b;
		document.getElementById("var_y").innerHTML = y;
		document.getElementById("var_m").innerHTML = m;
		document.getElementById("var_JJ").innerHTML = JJ;
		document.getElementById("var_J2000").innerHTML = J2000;
		document.getElementById("var_Lat_dms").innerHTML = Lat_dms;
		document.getElementById("var_Lat_dd").innerHTML = Lat_dd;
		document.getElementById("var_Long_dms").innerHTML = Long_dms;
		document.getElementById("var_Long_dd").innerHTML = Long_dd;
		document.getElementById("var_LST_dd").innerHTML = LST_dd;
		document.getElementById("var_HA").innerHTML = HA;
		document.getElementById("var_HA_polaire").innerHTML = HA_polaire;
		document.getElementById("var_RA_hms").innerHTML = RA_hms;
		document.getElementById("var_RA_hd").innerHTML = RA_hd;
		document.getElementById("var_RA_dd").innerHTML = RA_dd;
		document.getElementById("var_RA_polaire").innerHTML = RA_polaire;
		document.getElementById("var_Dec_dms").innerHTML = Dec_dms;
		document.getElementById("var_Dec_dd").innerHTML = Dec_dd;
		document.getElementById("var_Dec_polaire").innerHTML = Dec_polaire;
		document.getElementById("var_Az").innerHTML = Az;
		document.getElementById("var_Alt").innerHTML = Alt;
		document.getElementById("var_Az_polaire").innerHTML = Az_polaire;
		document.getElementById("var_Alt_polaire").innerHTML = Alt_polaire;
		document.getElementById("var_DeltaAz").innerHTML = DeltaAz;
		document.getElementById("var_DeltaAlt").innerHTML = DeltaAlt;
		document.getElementById("var_DeltaAz_pas").innerHTML = DeltaAz/0.176;
		document.getElementById("var_DeltaAlt_pas").innerHTML = DeltaAlt/0.176;
	}
}


function closeMe()
{
	document.getElementById("wrapper_fly").style.display = "none";
}


function maskSomeItems()
{
	
	var selectItems = document.getElementById("db_select2");
	var catalogue_choice = db_select1.value;
	
	var list_of_items = db_select2.options;
	let constellations = db_select3.options;
	
	
	// afficher tout options items
	if (catalogue_choice == "all")
	{
		for (var i=0; i<selectItems.options.length; i++)
		{
			selectItems.options[i].style.display = "block";
		}
	}
	
	// afficher toutes les constellations
	for (let i = 0; i < constellations.length; i++) // gere pour toute la liste des constellations
	{
		constellations[i].style.display = "block";
	}
	
	if (catalogue_choice == "catalogue_custom")
	{
		saison = 5;
		for (var i=0; i<list_of_items.length; i++)
		{
			var const_item = list_of_items[i].getAttribute("name");
			if (const_item === "none")
			{
				list_of_items[i].style.display = "block";
			}
			else
			{
				list_of_items[i].style.display = "none";
			}
		}
	}

	// masquer des options items que l'utilisateur n'a pas besoin
	if (catalogue_choice == "catalogue_messier")
	{
		for (var i=0; i<list_of_items.length; i++)
		{
			var item = list_of_items[i].textContent;
			var const_item = list_of_items[i].getAttribute("name");
			if (item.startsWith("M") && const_item !== "none")
			{
				list_of_items[i].style.display = "block";
			}
			else
			{
				list_of_items[i].style.display = "none";
			}
		}
	}

	if (catalogue_choice == "catalogue_ngc")
	{
		for (var i=0; i<list_of_items.length; i++)
		{
			var item = list_of_items[i].textContent;
			var const_item = list_of_items[i].getAttribute("name");
			if (item.startsWith("NGC") && const_item !== "none")
			{
				list_of_items[i].style.display = "block";
			}
			else
			{
				list_of_items[i].style.display = "none";
			}
		}
	}

	if (catalogue_choice == "catalogue_ic")
	{
		for (var i=0; i<list_of_items.length; i++)
		{
			var item = list_of_items[i].textContent;
			var const_item = list_of_items[i].getAttribute("name");
			if (item.startsWith("IC") && const_item !== "none")
			{
				list_of_items[i].style.display = "block";
			}
			else
			{
				list_of_items[i].style.display = "none";
			}
		}
	}

	var selectConst = document.getElementById("db_select3");
	var const_choice = db_select3.value; // constellation choisi

	if (const_choice == "all_const")
	{
		// pass
	}
	else
	{
		for (var i=0; i<list_of_items.length; i++)
		{
			var item = list_of_items[i].getAttribute("name"); // constellation de l'item
			if (item != const_choice)
			{
				list_of_items[i].style.display = "none";
			}
		}
	}
	
	if (saison != 5)
	{
		chooseSeason();
	}
}




const list_constellations_north = [ // 1 hiver, 2 printemps, 3 été, 4 automne, 5 tout
	{ abbreviation: "all_const", season: 5 },
	{ abbreviation: "none", season: 0 },
	{ abbreviation: "And", season: 4 },
	{ abbreviation: "Ant", season: 0 },
	{ abbreviation: "Aps", season: 2 },
	{ abbreviation: "Aql", season: 3 },
	{ abbreviation: "Aqr", season: 4 },
	{ abbreviation: "Ara", season: 3 },
	{ abbreviation: "Ari", season: 1 },
	{ abbreviation: "Aur", season: 1 },
	{ abbreviation: "Boo", season: 2 },
	{ abbreviation: "Cae", season: 1 },
	{ abbreviation: "Cam", season: 1 },
	{ abbreviation: "Cnc", season: 3 },
	{ abbreviation: "CVn", season: 2 },
	{ abbreviation: "CMa", season: 1 },
	{ abbreviation: "CMi", season: 1 },
	{ abbreviation: "Cap", season: 3 },
	{ abbreviation: "Car", season: 3 },
	{ abbreviation: "Cas", season: 1 },
	{ abbreviation: "Cen", season: 3 },
	{ abbreviation: "Cep", season: 4 },
	{ abbreviation: "Cet", season: 4 },
	{ abbreviation: "Cha", season: 3 },
	{ abbreviation: "Cir", season: 0 },
	{ abbreviation: "Col", season: 3 },
	{ abbreviation: "Com", season: 2 },
	{ abbreviation: "CrA", season: 3 },
	{ abbreviation: "CrB", season: 2 },
	{ abbreviation: "Crv", season: 3 },
	{ abbreviation: "Crt", season: 3 },
	{ abbreviation: "Cru", season: 3 },
	{ abbreviation: "Cyg", season: 3 },
	{ abbreviation: "Del", season: 3 },
	{ abbreviation: "Dor", season: 3 },
	{ abbreviation: "Dra", season: 3 },
	{ abbreviation: "Equ", season: 3 },
	{ abbreviation: "Eri", season: 1 },
	{ abbreviation: "For", season: 3 },
	{ abbreviation: "Gem", season: 1 },
	{ abbreviation: "Gru", season: 3 },
	{ abbreviation: "Her", season: 3 },
	{ abbreviation: "Hor", season: 3 },
	{ abbreviation: "Hya", season: 2 },
	{ abbreviation: "Hyi", season: 3 },
	{ abbreviation: "Ind", season: 3 },
	{ abbreviation: "Lac", season: 3 },
	{ abbreviation: "Leo", season: 2 },
	{ abbreviation: "LMi", season: 2 },
	{ abbreviation: "Lep", season: 1 },
	{ abbreviation: "Lib", season: 3 },
	{ abbreviation: "Lup", season: 3 },
	{ abbreviation: "Lyn", season: 2 },
	{ abbreviation: "Lyr", season: 3 },
	{ abbreviation: "Men", season: 3 },
	{ abbreviation: "Mic", season: 3 },
	{ abbreviation: "Mon", season: 1 },
	{ abbreviation: "Mus", season: 3 },
	{ abbreviation: "Nor", season: 3 },
	{ abbreviation: "Oct", season: 3 },
	{ abbreviation: "Oph", season: 3 },
	{ abbreviation: "Ori", season: 1 },
	{ abbreviation: "Pav", season: 3 },
	{ abbreviation: "Peg", season: 4 },
	{ abbreviation: "Per", season: 1 },
	{ abbreviation: "Phe", season: 0 },
	{ abbreviation: "Pic", season: 3 },
	{ abbreviation: "PsA", season: 3 },
	{ abbreviation: "Psc", season: 4 },
	{ abbreviation: "Pup", season: 1 },
	{ abbreviation: "Pyx", season: 2 },
	{ abbreviation: "Ret", season: 3 },
	{ abbreviation: "Scl", season: 2 },
	{ abbreviation: "Sco", season: 3 },
	{ abbreviation: "Sct", season: 3 },
	{ abbreviation: "Ser", season: 3 },
	{ abbreviation: "Sex", season: 2 },
	{ abbreviation: "Sge", season: 3 },
	{ abbreviation: "Sgr", season: 3 },
	{ abbreviation: "Tau", season: 1 },
	{ abbreviation: "Tel", season: 3 },
	{ abbreviation: "TrA", season: 3 },
	{ abbreviation: "Tri", season: 4 },
	{ abbreviation: "Tuc", season: 2 },
	{ abbreviation: "UMa", season: 2 },
	{ abbreviation: "UMi", season: 1 },
	{ abbreviation: "Vel", season: 2 },
	{ abbreviation: "Vir", season: 2 },
	{ abbreviation: "Vol", season: 3 },
	{ abbreviation: "Vul", season: 3 }
];


const list_constellations_south = [
	{ abbreviation: "all_const", season: 5 },
	{ abbreviation: "none", season: 0 },
	{ abbreviation: "And", season: 0 },
	{ abbreviation: "Ant", season: 3 },
	{ abbreviation: "Aps", season: 4 },
	{ abbreviation: "Aqr", season: 1 },
	{ abbreviation: "Aql", season: 2 },
	{ abbreviation: "Ara", season: 1 },
	{ abbreviation: "Ari", season: 0 },
	{ abbreviation: "Aur", season: 0 },
	{ abbreviation: "Boo", season: 0 },
	{ abbreviation: "Cae", season: 2 },
	{ abbreviation: "Cam", season: 0 },
	{ abbreviation: "Cnc", season: 0 },
	{ abbreviation: "CVn", season: 0 },
	{ abbreviation: "CMa", season: 3 },
	{ abbreviation: "CMi", season: 4 },
	{ abbreviation: "Cap", season: 1 },
	{ abbreviation: "Car", season: 3 },
	{ abbreviation: "Cas", season: 0 },
	{ abbreviation: "Cen", season: 2 },
	{ abbreviation: "Cep", season: 0 },
	{ abbreviation: "Cet", season: 0 },
	{ abbreviation: "Cha", season: 4 },
	{ abbreviation: "Cir", season: 4 },
	{ abbreviation: "Col", season: 4 },
	{ abbreviation: "Com", season: 0 },
	{ abbreviation: "CrA", season: 1 },
	{ abbreviation: "CrB", season: 2 },
	{ abbreviation: "Crv", season: 2 },
	{ abbreviation: "Cru", season: 3 },
	{ abbreviation: "Crt", season: 3 },
	{ abbreviation: "Cyg", season: 0 },
	{ abbreviation: "Del", season: 0 },
	{ abbreviation: "Dor", season: 4 },
	{ abbreviation: "Dra", season: 0 },
	{ abbreviation: "Equ", season: 1 },
	{ abbreviation: "Eri", season: 0 },
	{ abbreviation: "For", season: 3 },
	{ abbreviation: "Gem", season: 0 },
	{ abbreviation: "Gru", season: 3 },
	{ abbreviation: "Her", season: 0 },
	{ abbreviation: "Hor", season: 4 },
	{ abbreviation: "Hya", season: 3 },
	{ abbreviation: "Hyi", season: 4 },
	{ abbreviation: "Ind", season: 1 },
	{ abbreviation: "Lac", season: 2 },
	{ abbreviation: "Leo", season: 2 },
	{ abbreviation: "LMi", season: 0 },
	{ abbreviation: "Lep", season: 4 },
	{ abbreviation: "Lib", season: 3 },
	{ abbreviation: "Lup", season: 3 },
	{ abbreviation: "Lyn", season: 1 },
	{ abbreviation: "Lyr", season: 0 },
	{ abbreviation: "Men", season: 1 },
	{ abbreviation: "Mic", season: 3 },
	{ abbreviation: "Mon", season: 2 },
	{ abbreviation: "Mus", season: 4 },
	{ abbreviation: "Crv", season: 2 },
	{ abbreviation: "Cru", season: 3 },
	{ abbreviation: "Vel", season: 2 },
	{ abbreviation: "Hya", season: 3 },
	{ abbreviation: "Hyi", season: 4 },
	{ abbreviation: "Ind", season: 1 },
	{ abbreviation: "Lac", season: 2 },
	{ abbreviation: "Leo", season: 2 },
	{ abbreviation: "Lep", season: 4 },
	{ abbreviation: "Lib", season: 3 },
	{ abbreviation: "Lup", season: 3 },
	{ abbreviation: "Lyn", season: 1 },
	{ abbreviation: "Men", season: 1 },
	{ abbreviation: "Mic", season: 3 },
	{ abbreviation: "Mon", season: 2 },
	{ abbreviation: "Mus", season: 4 },
	{ abbreviation: "Nor", season: 4 },
	{ abbreviation: "Oct", season: 4 },
	{ abbreviation: "Oph", season: 1 },
	{ abbreviation: "Ori", season: 4 },
	{ abbreviation: "Pav", season: 4 },
	{ abbreviation: "Peg", season: 1 },
	{ abbreviation: "Per", season: 4 },
	{ abbreviation: "Phe", season: 3 },
	{ abbreviation: "Pic", season: 2 },
	{ abbreviation: "PsA", season: 3 },
	{ abbreviation: "Psc", season: 1 },
	{ abbreviation: "Pup", season: 4 },
	{ abbreviation: "Pyx", season: 2 },
	{ abbreviation: "Ret", season: 2 },
	{ abbreviation: "Sge", season: 3 },
	{ abbreviation: "Sgr", season: 2 },
	{ abbreviation: "Sco", season: 3 },
	{ abbreviation: "Scl", season: 1 },
	{ abbreviation: "Sct", season: 3 },
	{ abbreviation: "Ser", season: 2 },
	{ abbreviation: "Sex", season: 2 },
	{ abbreviation: "Tau", season: 4 },
	{ abbreviation: "Tel", season: 1 },
	{ abbreviation: "Tri", season: 1 },
	{ abbreviation: "TrA", season: 2 },
	{ abbreviation: "Tuc", season: 3 },
	{ abbreviation: "UMa", season: 3 },
	{ abbreviation: "UMi", season: 4 },
	{ abbreviation: "Vel", season: 2 },
	{ abbreviation: "Vol", season: 4 },
	{ abbreviation: "Vul", season: 3 },
];


var saison = 5;
var hemisphere = 1;


function restart_season_buttons()
{
	var bouton = document.getElementById("buttonlikeradio_winter");
	bouton.style.backgroundColor = '#1c1c1c';
	bouton.classList.remove("active");
	
	var bouton = document.getElementById("buttonlikeradio_spring");
	bouton.style.backgroundColor = '#1c1c1c';
	bouton.classList.remove("active");
	
	var bouton = document.getElementById("buttonlikeradio_summer");
	bouton.style.backgroundColor = '#1c1c1c';
	bouton.classList.remove("active");
	
	var bouton = document.getElementById("buttonlikeradio_autumn");
	bouton.style.backgroundColor = '#1c1c1c';
	bouton.classList.remove("active");
	
	maskSomeItems(); // on restart les filtres
}


function winter_chooseSeason()
{
	event.preventDefault(); // bouton dans le formulaire, on empeche d'actualiser la page au clic
	
	saison = 1;
	
	restart_season_buttons();
	
	var bouton = document.getElementById("buttonlikeradio_winter");
	bouton.style.backgroundColor = '#8791ad';
	bouton.classList.add("active");
	
	chooseSeason();
}


function spring_chooseSeason()
{
	event.preventDefault(); // bouton dans le formulaire, on empeche d'actualiser la page au clic
	
	saison = 2;
	
	restart_season_buttons();
	
	var bouton = document.getElementById("buttonlikeradio_spring");
	bouton.style.backgroundColor = '#cf80cc';
	bouton.classList.add("active");
	
	chooseSeason();
}


function summer_chooseSeason()
{
	event.preventDefault(); // bouton dans le formulaire, on empeche d'actualiser la page au clic
	
	saison = 3;
		
	restart_season_buttons();
	
	var bouton = document.getElementById("buttonlikeradio_summer");
	bouton.style.backgroundColor = '#539940';
	bouton.classList.add("active");
	
	chooseSeason();
}


function autumn_chooseSeason()
{
	event.preventDefault(); // bouton dans le formulaire, on empeche d'actualiser la page au clic
	
	saison = 4;
	
	restart_season_buttons();
	
	var bouton = document.getElementById("buttonlikeradio_autumn");
	bouton.style.backgroundColor = '#9c5e3d';
	bouton.classList.add("active");
	
	chooseSeason();
}


function chooseSeason()
{
	event.preventDefault();
	
	if (hemisphere == 1)
		list_constellations = list_constellations_north;
	else
		list_constellations = list_constellations_south;

	let constellations = db_select3.options;

	for (let i = 0; i < constellations.length; i++) // gere pour toute la liste des constellations
	{
		let constellation = constellations[i].value; // const de la liste
		
		let visible = false;
		
		for (let j = 0; j < list_constellations.length; j++)
		{
			let double_of_list = list_constellations[j];
			if ((double_of_list.abbreviation == constellation && double_of_list.season == saison))
			{
				visible = true;
				break;
			}
		}
	
		if (!(visible))
		{
			constellations[i].style.display = "none";
		}
		constellations[0].style.display = "block"; // pour le filtre "TOUT"

	}
	
	let objectList = document.getElementById('db_select2');
	let objects = objectList.getElementsByTagName('option');

	for (let i = 0; i < objects.length; i++) // gere pour toute la liste des astres
	{
		let object = objects[i]; // astre
		let objectConst = object.getAttribute('name'); // const de l'astre
		
		let visible = false;
		for (let j = 0; j < list_constellations.length; j++)
		{
			let double_of_list = list_constellations[j];
			if (double_of_list.abbreviation == objectConst && double_of_list.season == saison)
			{
				visible = true;
				break;
			}
		}

		if (!visible)
		{
			object.style.display = "none";
		}
	}
}


function change_hemisphere()
{
	event.preventDefault();
	
	if (hemisphere == 1)
	{
		var bouton = document.getElementById("hemisphere_north");
		bouton.style.display = "none";
		
		var bouton = document.getElementById("hemisphere_south");
		bouton.style.display = "block";
		
		hemisphere = 2;
	}
	else
	{
		var bouton = document.getElementById("hemisphere_north");
		bouton.style.display = "block";
		
		var bouton = document.getElementById("hemisphere_south");
		bouton.style.display = "none";
		
		hemisphere = 1;
	}
	maskSomeItems();
}




function searchItem()
{
	event.preventDefault();
	
	var $listItemsSelect = document.getElementById('db_select2');
	var inputValue = document.getElementById("input_search").value;
	inputValue = inputValue.toUpperCase(); // mettre en maj car toutes les valeurs des atres sont en majuscules
	var option = $listItemsSelect.querySelector("option[value='" + inputValue + "']");
	if (option)
	{
		option.selected = true;
		// envoi du formulaire comme si on cliquait sur le bouton sélectionner
		document.getElementById('formAjax1').submit();
	}
	else
	{
		alert("L'astre "+inputValue+" n'a pas été trouvé dans les catalogues locals.");
	}
}




function saveYourStar()
{
	event.preventDefault(); // Empêche le rechargement de la page
	
	if (document.getElementById("submit_3").innerHTML === "Sauvegarder")
	{
		document.getElementById("submit_2").style.display = "none";
		document.getElementById("input_save").style.display = "block";
		document.getElementById("submit_3").innerHTML = "Enregistrer";
	}
	else
	{
		document.getElementById("submit_2").style.display = "block";
		document.getElementById("input_save").style.display = "none";
		document.getElementById("submit_3").innerHTML = "Sauvegarder";
		
		
		// récupération des données dans JS
		var ascension = $('#ascention_i').val();
		var declinaison = $('#declinaison_i').val();
		var starName = $('#input_save').val();
		starName = starName.toUpperCase();
		
		
		// vérification du format des données transmises
		let youCanSaveIt = true;
		message_alert = "";
		
		if (ascension === "" && declinaison == "") // coordonnées vides = suppression étoile
		{
			if (!confirm("Si l'astre $starName existe dans la base de données, il sera supprimé, voulez vous continuer ?"))
			{
				youCanSaveIt = false;
			}
		}
		else
		{
			if (starName.length > 64)
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Le nom de l'étoile est trop grand...\n";
			}
			
			if (ascension.length != 11)
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - L'ascension doit respecter une taille précise de 11 caractères...\n";
			}
			if (ascension[2] != ':' || ascension[5] != ':')
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - format utilisé pour l'ascension : HH:MM:SS.SS (les nombres sont mal démarqués par ':')\n";
			}
			if (ascension[8] != '.')
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - format utilisé pour l'ascension : HH:MM:SS.SS (la virgule est peut-être mal placée)\n";
			}
			if ( isNaN(parseFloat(ascension.substring(0,2))) || isNaN(parseFloat(ascension.substring(3,5))) || isNaN(parseFloat(ascension.substring(6,10))) )
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Format utilisé pour l'ascension : HH:MM:SS.SS (valeur numériques non detectées)\n";
			}
			
			if (declinaison.length != 11)
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - La déclinaison doit respecter une taille précise de 11 caractères...\n";
			}
			if (declinaison[0] != '+' && declinaison[0] != '-')
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Format utilisé pour la déclinaison : +DE:MM:SS.S (n'oubliez pas le signe au début)\n";
			}
			if (declinaison[3] != ':' || declinaison[6] != ':')
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Format utilisé pour la déclinaison : +DE:MM:SS.S (les nombres sont mal démarqués par ':')\n";
			}
			if (declinaison[9] != '.')
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Format utilisé pour la déclinaison : +DE:MM:SS.S (la virgule est peut-être mal placée)\n";
			}
			if ( isNaN(parseFloat(declinaison.substring(0,3))) || isNaN(parseFloat(declinaison.substring(4,6))) || isNaN(parseFloat(declinaison.substring(7,10))) )
			{
				youCanSaveIt = false;
				message_alert = message_alert + "ERREUR - Format utilisé pour la déclinaison : +DE:MM:SS.S (valeur numériques non detectées)\n";
			}
			
			var selectItems = document.getElementById("db_select2");
			var list_of_items = db_select2.options;
			for (var i=0; i<list_of_items.length; i++)
			{
				var item = list_of_items[i].textContent;
				// alert(starName+" =? "+item+" === "+(item===starName));
				if (item === starName)
				{
					youCanSaveIt = false;
					message_alert = message_alert + "ERREUR - Une étoile porte déjà ce nom, si vous voulez la supprimer, entre le nom de l'étoile avec des champs vides\n";
					break;
				}
			}
			
			if (!youCanSaveIt)
			{
				message_alert = message_alert + "\n\nIMPOSSIBLE DE SAUVEGARDER CETTE ETOILE";
				alert(message_alert);
			}
		}
		
		if (youCanSaveIt)
		{
			message_alert = "Opération sur l'étoile "+starName+" effectué dans la sauvegarde\n\nVous pouvez actualiser la page si vous souhaitez afficher les nouvelles modifications";

			// Ajax
			$.ajax(
			{
				method: "GET",
				url: "save_star.php",
				dataType: "html",
				data:
				{
					ascension: ascension,
					declinaison: declinaison,
					starName: starName
				}
			})
			.done(function(data)
			{
				alert(message_alert);
			})
			.fail(function(xhr, status, error)
			{
				alert("Erreur: " + error);
			});

		}
	}
}



function startLEDactivity()
{
	document.getElementById("led_red").setAttribute('value','active');
	let labelColor = document.getElementById("label_led2");
	labelColor.style.color = 'white';
}



function stopLEDactivity()
{
	document.getElementById("led_red").setAttribute('value','inactive');
	let labelColor = document.getElementById("label_led2");
	labelColor.style.color = 'gray';
}



function startLEDpolaire()
{
	if (document.getElementById('isChecked1').checked)
	{
		// alert(document.getElementById("led_blue").value);
		// document.getElementById("led_blue").value = "active";
		document.getElementById("led_blue").setAttribute('value','active');
		let labelColor = document.getElementById("label_led1");
		labelColor.style.color = 'white';
	}
	else
	{
		// alert(document.getElementById("led_blue").value);
		document.getElementById("led_blue").setAttribute('value','inactive');
		let labelColor = document.getElementById("label_led1");
		labelColor.style.color = 'gray';
	}
}



function startLEDend()
{
	document.getElementById("led_green").setAttribute('value','active');
	let labelColor = document.getElementById("label_led3");
	labelColor.style.color = 'white';
}



function stopLEDend()
{
	document.getElementById("led_green").setAttribute('value','inactive');
	let labelColor = document.getElementById("label_led3");
	labelColor.style.color = 'gray';
}


// var intervalId;

// // Fonction pour mettre à jour la première valeur
// function mettreAJourPremiereValeur()
// {
  // let the = 4.987;
  // if (parseFloat(document.getElementById("var_deltaalt").innerHTML) < 0)
	  // the = the * -1;
  // if (parseFloat(document.getElementById("var_deltaaz").innerHTML) - the <= 0)
  // {
    // document.getElementById("var_deltaaz").innerHTML = "0";
    // return;
  // }
  // else
  // {
    // document.getElementById("var_deltaaz").innerHTML = parseFloat(document.getElementById("var_deltaaz").innerHTML) - the;
	// // alert("edit",parseFloat(document.getElementById("var_deltaaz").innerHTML) - 7.99);
	// setTimeout(mettreAJourPremiereValeur, 500);
  // }
// }

// // Fonction pour mettre à jour la deuxième valeur
// function mettreAJourDeuxiemeValeur()
// {
  // let the = 4.987;
  // if (parseFloat(document.getElementById("var_deltaalt").innerHTML) < 0)
	  // the = the * -1;
  // if (parseFloat(document.getElementById("var_deltaalt").innerHTML) - the <= 0)
  // {
    // document.getElementById("var_deltaalt").innerHTML = "0";
	// return;
  // }
  // else
  // {
    // document.getElementById("var_deltaalt").innerHTML = parseFloat(document.getElementById("var_deltaalt").innerHTML) - the;
	// setTimeout(mettreAJourPremiereValeur, 500);
  // }
// }



function socketHell()
{
	let manuel;
	let deltaAz_pas = parseInt(DeltaAz/0.176);
	let deltaAlt_pas = parseInt(DeltaAlt/0.176);
	
	if (document.getElementById("led_blue").getAttribute("value") === "inactive")
	{
		alert("Assurez vous d'aligner le télescope sur l'étoile polaire avant de démarrer le système.");
	}
	else if (isNaN(DeltaAz) || isNaN(DeltaAlt))
	{
		alert("Assurez vous de calculer les valeurs des coordonnées horizontalespour démarrer le système.");
	}
	else
	{
		let manuel;
		if (document.getElementById('isChecked2').checked) // automatique
		{
			manuel = "02";
		}
		else // manuel
		{
			manuel = "01";
		}
		
		// verrouillage des Checkbox
		document.getElementById('isChecked1').disabled = true;
		document.getElementById('isChecked2').disabled = true;
		document.getElementById('starting_button_lockit').style.backgroundColor = '#2C546F';
		
		startLEDactivity();
		
		// mettreAJourPremiereValeur();
		// mettreAJourDeuxiemeValeur();
		
		// Ajax
		$.ajax(
		{
			method: "GET",
			url: "socket.php",
			dataType: "html",
			data:
			{
				deltaAz_pas: deltaAz_pas,
				deltaAlt_pas: deltaAlt_pas,
				manuel: manuel,
			}
		})
		.done(function(data)
		{			
			alert("Position atteinte ! ",data);
			
			let [send_deltaAz, send_deltaAlt] = data.split(';');
			
			document.getElementById("var_deltaalt").innerHTML = send_deltaAlt;
			document.getElementById("var_deltaaz").innerHTML = send_deltaAz;
			
			stopLEDactivity();
			startLEDend();
		})
		.fail(function(xhr, status, error)
		{
			alert("Erreur: " + error);
		});
	}
}


// function maskSomeItemsFromConst()
// {
	// maskSomeItems();
	
	// var selectConst = document.getElementById("db_select3");
	// var const_choice = db_select3.value; // constellation choisi
	
	// var list_of_items = db_select2.options; // liste des options
	
	// // masquer des options items que l'utilisateur n'a pas besoin
	// if (const_choice == "all_const")
	// {
		// // pass
	// }
	// for (var i=0; i<list_of_items.length; i++)
	// {
		// var item = list_of_items[i].getAttribute("name"); // constellation de l'item
		// if (item != const_choice)
		// {
			// list_of_items[i].style.display = "none";
		// }
	// }
// }


$(document).ready( // attend que la page soit chargé pour que le script s'execute apres l'id

);




// Plages des 0-360° à respecter //

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














// $(document).ready(function()
// {
    // // Lorsque la page est chargée, on charge les données dans la div
    // $("#formAjax1").submit(function(event)
	// {
		// // empecher le traitement par défaut du formulaire
		// event.preventDefault();
		
		// // envoi d'une requete ajax pour récupérer les données
		// url: "home.php",
		// type: "GET",
		// data: $("#formAjax1").serialize(),
		// success: function(data)
		// {
			// // maj de la div avec les nouvelles données
			// $("#container_3_choice").html(data);
		// }
	// }
// };








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