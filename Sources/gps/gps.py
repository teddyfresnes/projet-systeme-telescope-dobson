"""placé dans /home/pi/gps/"""

import serial

try:
	gps = serial.Serial("/dev/ttyUSB0", timeout=None, baudrate=4800, xonxoff=False, rtscts=False, dsrdtr=False)
	
	done = False
	while (done != True): 
		result = gps.readline()
		if (result[:6] == b"$GPRMC"): # attend de recevoir une trame RMC pour sortir de la boucle
			done = True
	result = result.decode("utf-8") # décodage de l’objet octet pour l’affichage
	print(result)
except:
	print("ERREUR GPS")


