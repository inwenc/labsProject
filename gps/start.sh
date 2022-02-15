# manually start gpsd and point it at the 
# GPS breakout on the USB serial adapter port
gpsd /dev/ttyACM0 -F /var/run/gpsd.sock

python3 gps.py
