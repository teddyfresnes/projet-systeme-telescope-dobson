"""placé dans /home/pi/gps/"""
import serial

gps = serial.Serial("/dev/ttyUSB0", timeout=None, baudrate=4800, xonxoff=False, rtscts=False, dsrdtr=False)

while True:
    line = gps.readline()
    print(line)
