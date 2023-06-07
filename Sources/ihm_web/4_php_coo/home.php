<?php 

	class BD_communication
	{
		
		var $config;
		
		function __construct()
		{
			$this->config["host"] = "localhost:3306";
			$this->config["username"] = "root";
			$this->config["password"] = "";
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
	
	/* si objet selectionné, récupération des coordonnées étoiles */
	if (isset($_GET['objectList'])) // (isset vérifier que la valeur existe)
	{
		$option_objectList = $_GET['objectList'];
		
		$Telescope_bdr = new BD_communication();
		$request = "SELECT `RA (Right Ascension)`,`Dec (Declinaison)` FROM `catalogue_messier` WHERE (Messier = '".$option_objectList."');"; 
		$result = $Telescope_bdr->connexion($request);
		$row = $result->fetch_assoc();
		$value_ra = $row["RA (Right Ascension)"] ?? false; // renvoie false si rien trouvé dans la db
		$value_d = $row["Dec (Declinaison)"] ?? false; // renvoie false si rien trouvé dans la db
	}
	else
	{
		$value_ra = $value_d = "";
	}
?>


<!doctype html>
<html lang="fr">

	<head>
		<meta charset="utf-8">
		<title>E6.2 Téléscope</title>
        <link rel = "icon" href = "../images/logo.png" type="image/x-icon">
		<link rel="stylesheet" href="style.css">
		<script src="script.js"></script>
	</head>
	
	
	<body>
	
		<div class="main-wrapper">
		
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
									<span class="table_value"></span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Longitude</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value"></span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">Latitude</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value"></span>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span class="table_key">HH:MM:SS</span>
							</td>
							<td>
								<div class="table1_value_wrapper">
									<span class="table_value"></span>
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
									<button class="depth" type="button">&#9673;</button>
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
						<form method="GET" action="home.php">
							<div id="c_title">
								<span class="f_title">Sélection</span>
							</div>

							<div id="c_db_filter">
							</div>
							
							<div id="c_db_scroll">
								<div class="box">
									<select>
										<option>Catalogue de messier</option>
										<option>Personnalisé</option>
									</select>
								</div>
							
								<div class="box">
									<select name="objectList">
										<?php 
											$Telescope_bdr = new BD_communication();
											$request = "SELECT Messier FROM catalogue_messier;"; 
											$result = $Telescope_bdr->connexion($request);
											$row = mysqli_fetch_assoc($result); // skip le nom de colonne
											while($row = $result->fetch_assoc())
											{
												echo "<option value=\"".$row['Messier']."\">".$row['Messier']."</option>";
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
								<button type="text" class="submit" id="submit_2">Calculer</button>
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
									<span class="table_value"></span>
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
									<span class="table_value"></span>
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
									<span class="table_value"></span>
								</div>
							</td>
						</tr>
					</table>
				</div>
				
				
			</div>
			
		</div>
		
	</body>
	
</html>