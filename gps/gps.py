from gpsdclient import GPSDClient
import time
import json
import paho.mqtt.client as mqtt
import os
import threading
import socket

client = GPSDClient(host="127.0.0.1")
i = 0
use_httpserver = 0
skip = int(os.getenv('SKIP_CYCLES', '5'))
mqtt_address = os.getenv('MQTT_ADDRESS', '0')
if mqtt_address == '0':
    use_httpserver = 1
mqtt_topic = os.getenv('MQTT_TOPIC', 'gps')

gps_data = '{"mode": 0}'

# Simple webserver
# see https://gist.github.com/joaoventura/824cbb501b8585f7c61bd54fec42f08f
def background_web(server_socket):

    global gps_data

    while True:
        # Wait for client connections
        client_connection, client_address = server_socket.accept()

        # Get the client request
        request = client_connection.recv(1024).decode()
        print("HTTP request from {}".format(client_address))
        

        # Send HTTP response
        response = 'HTTP/1.0 200 OK\n\n'+ gps_data
        client_connection.sendall(response.encode())
        client_connection.close()


if use_httpserver == 1:
    SERVER_HOST = '0.0.0.0'
    SERVER_PORT = 7575

    # Create socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(1)
    print("HTTP server listening on port {0}...".format(SERVER_PORT))

    t = threading.Thread(target=background_web, args=(server_socket,))
    t.start()
else:
    mqtt_client = mqtt.Client()
    print("Starting mqtt client, publishing to {0}:1883".format(mqtt_address))
    try:
        mqtt_client.connect(mqtt_address, 1883, 60)
    except Exception as e:
        print("Error connecting to mqtt. ({0})".format(str(e)))
    else:
        mqtt_client.loop_start()

while True:
    # Get data as python dicts (optionally convert time information to `datetime` objects)
    
    for result in client.dict_stream():
        if result["class"] == "TPV":
            gps_data = json.dumps(result, indent=4, sort_keys=True, default=str)
            mode = ["No value", "No fix", "2D fix", "3D fix"][result["mode"]]
            i += 1
            if i == (skip + 1):
                 if use_httpserver == 0:
                     print("Publishing GPS data {0} mode {1}".format(result["time"], mode))
                     mqtt_client.publish(mqtt_topic, gps_data)
                     print("-------------------------------")
                     i = 0

