<?php 

	class BD_communication
	{
		
		var $config;
		
		function __construct()
		{
			$this->config["host"] = "localhost:3306";
			$this->config["username"] = "root";
			$this->config["password"] = "password";
			$this->config["database"] = "telescope";
		}
		
	
		function connexion($req)
		{
			$host = $this->config["host"];
			$utilisateur = $this->config["username"];
			$mot_passe = $this->config["password"];
			$database = $this->config["database"];
	 
			$connect = new mysqli($host, $utilisateur, $mot_passe, $database);
			if (!$connect)
			{
				echo "Impossible de se connecter";
			}/*
			else
			{
				echo "Connexion réussie<br/>";
			}*/
			$rep = $connect->query($req); // réponse de query issue de PDO
			mysqli_close($connect);
			return $rep;
		}
	}
	
	/* RECUPERATION DES COORDONNES ETOILES DEPUIS BDD si une option est selectionné */
	if (isset($_GET['objectList'])) // (isset vérifier que la valeur existe)
	{
		$option_objectList = $_GET['objectList'];
		
		$Telescope_bdr = new BD_communication();
		$request = "SELECT `RA`,`Declinaison`,`Name` FROM `catalogue_messier` WHERE (Name = '".$option_objectList."')
		UNION SELECT `RA`,`Declinaison`,`Name` FROM `catalogue_ngc` WHERE (Name = '".$option_objectList."')
		UNION SELECT `RA`,`Declinaison`,`Name` FROM `catalogue_ic` WHERE (Name = '".$option_objectList."');"; 
		$result = $Telescope_bdr->connexion($request);
		$row = $result->fetch_assoc();
		$value_ra = $row["RA"] ?? ""; // renvoie "" si rien trouvé dans la db
		$value_d = $row["Declinaison"] ?? "";
		$value_catalogue = $db_select1 ?? "";
		$value_name = $row["Name"] ?? "";
		$value_const = $db_select3 ?? "";
	}
	
	/* RECUPERATION DONNEES GPS AVEC SCRIPT PYTHON */
	exec("python3 /home/pi/gps/gps.py",$gps_result); // envoie un array des print réalisés
	$gps_trame = $gps_result[0]; 
	//echo "résultat: $gps_trame";
	//echo exec("whoami"); //utilisateur de php : www-data
	if ($gps_trame == "ERREUR GPS") // si un problème survient avec le gps
	{
		$gps_var_date = $gps_var_longitude = $gps_var_latitude = $gps_var_time = "ERREUR GPS";
	}
	else
	{
		$gps_trame_array = explode(',',$gps_trame); 
		
		$gps_var_date = $gps_trame_array[9];
		$gps_var_date = substr_replace($gps_var_date,'/',4,0); // ajout slash sur la date
		$gps_var_date = substr_replace($gps_var_date,'/',2,0); // ajout slash sur la date
		
		$gps_var_longitude = substr($gps_trame_array[5],0,3).'°'; // on recupere les 3 premiers nb pour les degrés, on enlève les 0 en trop en passant la string en int
		$gps_var_longitude = $gps_var_longitude . substr($gps_trame_array[5],3,2).'\''; // récupération des minutes
		$gps_var_longitude = $gps_var_longitude . strval(intval(intval(substr($gps_trame_array[5],6,2))/100*60)).'",'; // conversion des degrés décimales en minutes
		$gps_var_longitude = $gps_var_longitude . $gps_trame_array[6];
		/*if (intval(substr($gps_trame_array[5],0,3)) > 0) // si le nombre est positif on rajoute un + pour le format physique
			{$gps_var_longitude = '+'.$gps_var_longitude;}*/
		
		$gps_var_latitude = strval(intval(substr($gps_trame_array[3],0,2))).'°';
		$gps_var_latitude = $gps_var_latitude . substr($gps_trame_array[3],2,2).'\'';
		$gps_var_latitude = $gps_var_latitude . strval(intval(intval(substr($gps_trame_array[3],5,2))/100*60)).'",';
		$gps_var_latitude = $gps_var_latitude . $gps_trame_array[4];
		
		$gps_var_time = substr($gps_trame_array[1],0,6);
		$gps_var_time = substr_replace($gps_var_time,':',4,0); // on met : de séparation
		$gps_var_time = substr_replace($gps_var_time,':',2,0); // on met : de séparation
		$gps_var_hour = intval(substr($gps_var_time,0,2)); // recuperation heure en integer
		/*if ($gps_var_hour > 23) // on rajoute une heure pour UTC+1
			{$gps_var_hour = 0;} 
		if ($gps_var_hour < 10) // on rajoute un zero si un seul chiffre, on remet en string
			$gps_var_hour = '0'.strval($gps_var_hour);*/
		$gps_var_time = $gps_var_hour . substr($gps_var_time,2,7); // on rajoute l'heure en concatenant
	}
?>


<!DOCTYPE html>
<html lang="fr">

	<head>
		<meta charset="utf-8">
		<title>E6.2 Téléscope</title>
        <link rel = "icon" href = "../images/logo.png" type="image/x-icon">
		<link rel="stylesheet" href="style.css">
		<script type="text/javascript" src="jquery.min.js"></script>
		<script type="text/javascript" src="script.js"></script>
	</head>
	
	<body>
	
		<div class="main-wrapper">
		
			<div id="wrapper_fly">
				<br />
				<table id="tab_feuille_calcul">
					<colgroup>
						<col span="1" style="width: 15%;">
						<col span="1" style="width: 15%;">
						<col span="1" style="width: 15%;">
						<col span="1" style="width: 15%;">
						<col span="1" style="width: 15%;">
						<col span="1" style="width: 15%;">
					</colgroup>
					<tr>
						<td>Date</td>
						<td id="var_date2" class="value_feuille"></td>
						<td>Temps</td>
						<td id="var_timed" class="value_feuille"></td>
						<td>Heure décimale</td>
						<td id="var_HHf" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Jour juliens</td>
						<td id="var_JJ" class="value_feuille"></td>
						<td>J2000</td>
						<td id="var_J2000" class="value_feuille"></td>
						<td>a</td>
						<td id="var_a" class="value_feuille"></td>
					</tr>
					<tr>
						<td>b</td>
						<td id="var_b" class="value_feuille"></td>
						<td>y</td>
						<td id="var_y" class="value_feuille"></td>
						<td>m</td>
						<td id="var_m" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Latitude deg.m.s.</td>
						<td id="var_Lat_dms" class="value_feuille"></td>
						<td>Latitude deg.</td>
						<td id="var_Lat_dd" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Longitude deg.m.s.</td>
						<td id="var_Long_dms" class="value_feuille"></td>
						<td>Longitude deg.</td>
						<td id="var_Long_dd" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Ascention droite h.m.s.</td>
						<td id="var_RA_hms" class="value_feuille"></td>
						<td>Ascention droite h.</td>
						<td id="var_RA_hd" class="value_feuille"></td>
						<td>Ascention droite deg.</td>
						<td id="var_RA_dd" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Déclinaison deg.m.s.</td>
						<td id="var_Dec_dms" class="value_feuille"></td>
						<td>Déclinaison deg.</td>
						<td id="var_Dec_dd" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Ascention droite polaire deg.</td>
						<td id="var_RA_polaire" class="value_feuille"></td>
						<td>Déclinaison polaire deg.</td>
						<td id="var_Dec_polaire" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Temps sidéral deg.</td>
						<td id="var_LST_dd" class="value_feuille"></td>
						<td>Angle horaire deg.</td>
						<td id="var_HA" class="value_feuille"></td>
						<td>Angle horaire polaire deg.</td>
						<td id="var_HA_polaire" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Hauteur polaire deg.</td>
						<td id="var_Alt_polaire" class="value_feuille"></td>
						<td>Azimut polaire deg.</td>
						<td id="var_Az_polaire" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Hauteur deg.</td>
						<td id="var_Alt" class="value_feuille"></td>
						<td>Azimut deg.</td>
						<td id="var_Az" class="value_feuille"></td>
					</tr>
					<tr>
						<td>Delta Azimut</td>
						<td id="var_DeltaAlt" class="value_feuille"></td>
						<td>Delta Hauteur</td>
						<td id="var_DeltaAz" class="value_feuille"></td>
					</tr>
				</table>
				<br />
				<button onClick="closeMe();">Fermer</button>
			</div>
			
			<div class="wrapper_left">
				<button type="submit" id="small_one_1" onClick="showMe();">
					<img src="../images/button1.png" alt="button1" border="0" />
				</button>
			</div>		
	
			<div class="telescope_header">
				<a href="home.php">
					<div class="header_img"></div>
				</a>
			</div>
		
			<div class="wrapper">
				
				<div class="container" id="container_1">
					<span class="c_title">Données GPS</span>
					<table class="table" id="table_1">
						<tr>
							<td>
								<span class="table_key">Date</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value" id="var_date">
										<?php echo $gps_var_date ?>
									</span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Latitude</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value" id="var_lat">
										<?php echo $gps_var_latitude ?>
									</span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Longitude</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value" id="var_long">
										<?php echo $gps_var_longitude ?>
									</span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">HH:MM:SS</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value" id="var_time">
										<?php echo $gps_var_time ?>
									</span>
								</div>
							</td>
						</tr>
					</table>
				</div>
				
				
				<div class="container" id="container_2">
					<table class="table" id="table_3">
						<tr>
							<td>
								<span class="table_key">Initialisation téléscope</span>
							</td>
							<td>
								<div class="table_item" colspan=2>
									<button class="depth" type="button" action="socket.php">&#9673;</button>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Manuel/Automatique</span>
							</td>
							<td class="table_item" colspan=2>
								<label class="toggle">
								  <input class="toggle-checkbox" type="checkbox" enabled>
								  <div class="toggle-switch"></div>
								  <span class="toggle-label">Automatique</span>
								</label>
							</td>
						</tr>
						<tr>
							<td>
								<div class="led_box">
									<div class="led-blue" value="inactive"></div>
									<p class="label_led">Mise à l'origine</p>
								</div>
							</td>
							<td>
								<div class="led_box">
									<div class="led-red" value="inactive"></div>
									<p class="label_led">Témoin d'activité</p>
								</div>
							</td>
							<td>
								<div class="led_box">
									<div class="led-green" value="inactive"></div>
									<p class="label_led">Alignement de l'astre</p>
								</div>
							</td>
						</tr>
					</table>
				
				</div>
				
				
				<div class="container" id="container_3">
					<div class="container" id="container_3_database">
						<form method="GET" action="home.php" id="formAjax1">
							<div id="c_title">
								<span class="f_title">Sélection</span>
							</div>

							<div id="c_db_filter">
								<div id="c_db_filter_buttonsradio">
								
								</div>
							</div>
							
							<div id="c_db_scroll">
								<div class="box">
									<select name="db_select1" id="db_select1" onchange="maskSomeItems()">
										<option name="c_all" value="all" selected>TOUT</option>
										<option name="c_m" value="catalogue_messier">Catalogue de messier</option>
										<option name="c_ngc" value="catalogue_ngc">Catalogue NGC</option>
										<option name="c_ic" value="catalogue_ic">Catalogue IC</option>
									</select>
								</div>
								
								<div class="box">
									<select name="db_select3" id="db_select3" onchange="maskSomeItemsFromConst()">
										<option value="all_const" selected>TOUT</option>
										<option value="And">Andromède</option>
										<option value="Ant">Machine pneumatique</option>
										<option value="Aps">Oiseau de paradis</option>
										<option value="Aql">Aigle</option>
										<option value="Aqr">Verseau</option>
										<option value="Ara">Autel</option>
										<option value="Ari">Bélier</option>
										<option value="Aur">Coche</option>
										<option value="Boo">Bouvier</option>
										<option value="Cae">Burin</option>
										<option value="Cam">Girafe</option>
										<option value="Cap">Capricorne</option>
										<option value="Car">Carène</option>
										<option value="Cas">Cassiopée</option>
										<option value="Cen">Centaure</option>
										<option value="Cep">Céphée</option>
										<option value="Cet">Baleine</option>
										<option value="Cha">Caméléon</option>
										<option value="Cir">Compas</option>
										<option value="CMa">Grand chien</option>
										<option value="CMi">Petit chien</option>
										<option value="Cnc">Cancer</option>
										<option value="Col">Colombe</option>
										<option value="Com">Chevelure de Bérénice</option>
										<option value="CrA">Couronne australe</option>
										<option value="CrB">Couronne boréale</option>
										<option value="Crt">Couple</option>
										<option value="Cru">Coffre</option>
										<option value="Crv">Corbeau</option>
										<option value="CVn">Chiens de chasse</option>
										<option value="Cyg">Cygne</option>
										<option value="Del">Dauphin</option>
										<option value="Dor">Dorade</option>
										<option value="Dra">Dragon</option>
										<option value="Equ">Petit cheval</option>
										<option value="Eri">Éridan</option>
										<option value="For">Fourneau</option>
										<option value="Gem">Gémeaux</option>
										<option value="Gru">Grue</option>
										<option value="Her">Hercule</option>
										<option value="Hor">Horloge</option>
										<option value="Hya">Hydre femelle</option>
										<option value="Hyi">Hydre mâle</option>
										<option value="Ind">Indien</option>
										<option value="Lac">Lézard</option>
										<option value="Leo">Lion</option>
										<option value="Lep">Lièvre</option>
										<option value="Lib">Balance</option>
										<option value="LMi">Petit lion</option>
										<option value="Lup">Loup</option>
										<option value="Lyn">Lynx</option>
										<option value="Lyr">Lyre</option>
										<option value="Men">Table</option>
										<option value="Mic">Microscope</option>
										<option value="Mon">Licorne</option>
										<option value="Mus">Mouche</option>
										<option value="Nor">Règle</option>
										<option value="Oct">Octant</option>
										<option value="Oph">Serpentaire</option>
										<option value="Ori">Orion</option>
										<option value="Pav">Paon</option>
										<option value="Peg">Pégase</option>
										<option value="Per">Persée</option>
										<option value="Phe">Phénix</option>
										<option value="Pic">Pictor</option>
										<option value="PsA">Poissons austraux</option>
										<option value="Psc">Poissons</option>
										<option value="Pup">Poupe</option>
										<option value="Pyx">Boussole</option>
										<option value="Ret">Réticule</option>
										<option value="Scl">Sculpteur</option>
										<option value="Sco">Scorpion</option>
										<option value="Sct">Flèche</option>
										<option value="Ser">Serpent</option>
										<option value="Sex">Sextant</option>
										<option value="Sge">Flèche du Sagittaire</option>
										<option value="Sgr">Sagittaire</option>
										<option value="Tau">Taureau</option>
										<option value="Tel">Télescope</option>
										<option value="TrA">Triangle austral</option>
										<option value="Tri">Triangle</option>
										<option value="Tuc">Toucan</option>
										<option value="UMa">Grande Ourse</option>
										<option value="UMi">Petite Ourse</option>
										<option value="Vel">Voiles</option>
										<option value="Vir">Vierge</option>
										<option value="Vol">Oiseau de proie</option>
										<option value="Vul">Renard</option>
									</select>
								</div>
							
								<div class="box">
									<select name="objectList"id="db_select2">
										<?php
											$Telescope_bdr = new BD_communication();
											$request = "SELECT Name,Const FROM catalogue_messier ORDER BY CAST(SUBSTR(Name, 2) AS INTEGER) ASC;"; 
											$result = $Telescope_bdr->connexion($request);
											// $row = mysqli_fetch_assoc($result); // skip le nom de colonne
											while($row = $result->fetch_assoc())
											{
												$selected = ($row['Name'] == $value_name) ? 'selected' : "$objectList";
												echo "<option name=\"".$row['Const']."\" value=\"".$row['Name']."\" ".$selected.">".$row['Name']."</option>";
											}
											$request = "SELECT Name,Const FROM catalogue_ngc ORDER BY CAST(SUBSTR(Name, 4) AS INTEGER) ASC;"; 
											$result = $Telescope_bdr->connexion($request);
											while($row = $result->fetch_assoc())
											{
												$selected = ($row['Name'] == $value_name) ? 'selected' : '';
												echo "<option name=\"".$row['Const']."\" value=\"".$row['Name']."\" ".$selected.">".$row['Name']."</option>";
											}
											$request = "SELECT Name,Const FROM catalogue_ic ORDER BY CAST(SUBSTR(Name, 3) AS INTEGER) ASC;"; 
											$result = $Telescope_bdr->connexion($request);
											while($row = $result->fetch_assoc())
											{
												$selected = ($row['Name'] == $value_name) ? 'selected' : '';
												echo "<option name=\"".$row['Const']."\" value=\"".$row['Name']."\" ".$selected.">".$row['Name']."</option>";
											}
										?>
									</select>
								</div>
							</div>
							
							<div id="c_db_button">
								<button type="text" class="submit">Sélectionner</button>
							</div>
						</form>
					</div>
					
					<div class="container" id="container_3_choice">
						<div class="form">
							<div class="f_title">Coordonnées</div>
							<div class="input-container ic1">
								<?php
									echo '<input id="ascention_i" class="input" type="text" placeholder=" " value="'.$value_ra.'" />';
								?>
								<div class="cut"></div>
								<label for="ascention_i" class="placeholder">Ascention droite HH:MM:SS</label>
							</div>
							<div class="input-container ic2">
								<?php
									echo '<input id="declinaison_i" class="input" type="text" placeholder=" " value="'.$value_d.'" />';
								?>
								<div class="cut"></div>
								<label for="declinaison_i" class="placeholder">Déclinaison +DEG:MM:SS</label>
							</div>
							<div id="c_choice_button">
								<button type="text" class="submit" id="submit_2" onClick="calculHorizontal();">Calculer</button>
							</div>
						</div>
					</div>	
				</div>
				
				
				<div class="container" id="container_4">
					<table class="table" id="table_2">
						<tr>
							<td>
								<span class="table_key">Etoile sélectionée :</span>
							</td>
						</tr>
						<tr>
							<td>
								<div class="table2_value_wrapper">
									<span class="table_value2">
										<?php echo $value_name ?>
									</span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Delta azimuth :</span>
							</td>
						</tr>
						<tr>
							<td>
								<div class="table2_value_wrapper">
									<span class="table_value2" id="var_deltaaz"></span>
								</div>
							</td>
						</tr>						
						<tr>
							<td>
								<span class="table_key">Delta hauteur :</span>
							</td>
						</tr>
						<tr>
							<td>
								<div class="table2_value_wrapper">
									<span class="table_value2" id="var_deltaalt"></span>
								</div>
							</td>
						</tr>
					</table>
				</div>
				
			</div>
			
		</div>
		
	</body>
	
</html>
