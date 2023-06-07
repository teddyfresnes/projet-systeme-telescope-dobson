-- Création de la table
CREATE TABLE IF NOT EXISTS `telescope`.`catalogue_custom` (`Name` varchar(64), `RA` varchar(11), `Declinaison` varchar(11), `Const` varchar(9)) DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci; 


-- Pour ajouter un élément
INSERT INTO catalogue_custom (Name, RA, Declinaison, Const)
SELECT 'ARCTURUS', '14:15:39.67', '+19:10:56.6', 'none'
FROM dual
WHERE NOT EXISTS (
	SELECT * FROM catalogue_custom WHERE Name = 'ARCTURUS'
) AND NOT EXISTS (
	SELECT * FROM catalogue_messier WHERE Name = 'ARCTURUS'
) AND NOT EXISTS (
	SELECT * FROM catalogue_ic WHERE Name = 'ARCTURUS'
) AND NOT EXISTS (
	SELECT * FROM catalogue_ngc WHERE Name = 'ARCTURUS'
);