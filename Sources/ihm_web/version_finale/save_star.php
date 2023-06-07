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
	 
			// connexion depuis la rpi
			$connect = new mysqli($host, $utilisateur, $mot_passe, $database);
			if ($connect->connect_error)
			{
				die("Connection failed: " . $connect->connect_error);
			}
			/*
			else
			{
				echo "Connexion réussie<br/>";
			}*/
			$rep = $connect->query($req); // réponse de query issue de PDO
			
			if (!$rep)
			{
				// journaliser l'erreur ou l'afficher à l'utilisateur
				error_log("Erreur de base de données: " . $connect->error);
				mysqli_close($connect);
				return false;
			}
			mysqli_close($connect);
			return $rep;
		}
	}
	
	// récupération des données envoyé par Ajax
	if (isset($_GET['starName']))
	{
		$ascension = $_GET["ascension"];
		$declinaison = $_GET["declinaison"];
		$starName = $_GET["starName"];
	}
	else // si on execute le fichier a part, pas de données importés par ajax donc on les crée nous mêmes
	{
		// $ascension = "14:15:39.67";
		// $declinaison = "-14:15:39.6";
		$ascension = "";
		$declinaison = "";
		$starName = "test";
	}

	$Telescope_bdr = new BD_communication();
	
	// $request = "INSERT INTO catalogue_custom VALUES ('$starName', '$ascension', '$declinaison', 'all_const');"; 
	
	// $request = "
	// INSERT INTO catalogue_custom (Name, RA, Declinaison, Const)
	// SELECT 'ARCTURUS', '14:15:39.67', '+19:10:56.6', 'none'
	// FROM dual
	// WHERE NOT EXISTS (
		// SELECT * FROM catalogue_custom WHERE Name = 'ARCTURUS1'
	// ) AND NOT EXISTS (
		// SELECT * FROM catalogue_messier WHERE Name = 'ARCTURUS1'
	// ) AND NOT EXISTS (
		// SELECT * FROM catalogue_ic WHERE Name = 'ARCTURUS1'
	// ) AND NOT EXISTS (
		// SELECT * FROM catalogue_ngc WHERE Name = 'ARCTURUS1'
	// );
	// ";
	
	if (empty($ascension) && empty($declinaison)) // suppression de l'étoile
		$request = "DELETE FROM catalogue_custom WHERE Name = '$starName';";
	else
		$request = "
		INSERT INTO catalogue_custom (Name, RA, Declinaison, Const)
		SELECT '$starName', '$ascension', '$declinaison', 'none'
		FROM dual
		WHERE NOT EXISTS (
			SELECT * FROM catalogue_custom WHERE Name = '$starName'
		) AND NOT EXISTS (
			SELECT * FROM catalogue_messier WHERE Name = '$starName'
		) AND NOT EXISTS (
			SELECT * FROM catalogue_ic WHERE Name = '$starName'
		) AND NOT EXISTS (
			SELECT * FROM catalogue_ngc WHERE Name = '$starName'
		);
		";

	$result = $Telescope_bdr->connexion($request);
	
	// echo "<script>alert('nice');</script>";
	
?>