import RPi.GPIO as GPIO 
import requests
from datetime import datetime
import time

GPIO.setmode(GPIO.BCM)
DEBOUNCE = 600  # switch debounce time in ms
TIME_DELAY = 5  # How often to write GPS data in seconds
our_mode = "stop"
# gps_file = open("/data/gps_data/gps.txt", "a")
gps_file = open(f"/data/gps_data/gps-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt", "w")
# gps_file = open(f"/data/gps_data/gps-{datetime.now().strftime('%Y%m%d')}.txt", "w")


def button_press(channel):
    global our_mode, gps_file
    # This event fires when the button is pressed
    if (our_mode == "stop"):
        # Turn on LED and start saving file
        GPIO.output(20, 1)
        our_mode = "start"
    else:
        # Turn off LED and stop saving file
        GPIO.output(20, 0)
        our_mode = "stop"
        gps_file.close()
        

# This is where the program starts

print("Starting the controller!")

GPIO.setup(26, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(26, GPIO.RISING, callback=button_press, bouncetime=DEBOUNCE)
GPIO.setup(20, GPIO.OUT)
GPIO.output(20, 0)
while True:

    time.sleep(TIME_DELAY)
    if our_mode == "start":
        # write gps data to file
        r = requests.get('http://gps:7575')
        gps_data = r.json()
        gps_file.write("{0}, {1}, {2}\n".format(gps_data["lat"], gps_data["lon"], gps_data["time"]))


        