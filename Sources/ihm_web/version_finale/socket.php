<?php
	$host = '192.168.4.99'; // Remplacez par l'adresse IP ou le nom d'hôte du serveur
	$port = 25566; // Remplacez par le port utilisé par le serveur
	
	// Création d'une socket
	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
	if ($socket === false)
	{
		echo "Erreur lors de la création de la socket : " . socket_strerror(socket_last_error()) . "\n";
		exit(1);
	}
	

	// Connexion à la socket serveur
	$result = socket_connect($socket, $host, $port);
	if ($result === false)
	{
		echo "Erreur lors de la connexion à la socket serveur : " . socket_strerror(socket_last_error($socket)) . "\n";
		exit(1);
	}


	// récupération des données envoyé par Ajax
	if (isset($_GET['deltaAz_pas']))
	{
		$deltaAz_pas = $_GET["deltaAz_pas"];
		$deltaAlt_pas = $_GET["deltaAlt_pas"];
		$manuel = $_GET["manuel"];
	}
	else // si on execute le fichier a part, pas de données importés par ajax donc on les crée nous mêmes
	{
		$deltaAz_pas = 1337;
		$deltaAlt_pas = 1337;
		$manuel = "01";
	}
	
	// Envoi des données au serveur
	$message = $manuel . "," . strval($deltaAz_pas) . ";" . strval($deltaAlt_pas);
	if (!isset($_GET['deltaAz_pas'])) // lorsque le fichier est ouvert sans l'IHM
		echo "String envoyé : " . $message . "<br />\n";
	socket_write($socket, $message, strlen($message));
	
	
	// Réception de la réponse du serveur
	$response = socket_read($socket, 1024);
	if (!isset($_GET['deltaAz_pas'])) // lorsque le fichier est ouvert sans l'IHM
		echo "Réponse du serveur : " . $response . "\n";
	else // réponse envoyé à l'IHM
		echo $response;
	
	
	// Fermeture de la socket
	socket_close($socket);
?>
