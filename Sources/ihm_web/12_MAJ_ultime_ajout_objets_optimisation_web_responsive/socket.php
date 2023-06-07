<?php

// Configuration du serveur et du port
$serveur = "192.168.4.99";  // Adresse IP du serveur ESP8266
$port = 25566;

// Phrase à envoyer au serveur
$phrase = "547;54";

// Création du socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    echo "Erreur lors de la création du socket : " . socket_strerror(socket_last_error()) . "\n";
    exit(1);
}

// Connexion au serveur
$result = socket_connect($socket, $serveur, $port);
if ($result === false) {
    echo "Erreur lors de la connexion au serveur : " . socket_strerror(socket_last_error($socket)) . "\n";
    exit(1);
}

// Envoi de la phrase au serveur
socket_write($socket, $phrase, strlen($phrase));

// Réception de la réponse du serveur
$response = socket_read($socket, 1024);
echo "Réponse du serveur : " . $response . "\n";

// Fermeture du socket
socket_close($socket);

?>

