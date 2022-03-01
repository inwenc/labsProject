# Running GPS tracker

The GPS running tracker main objective is to gamify your running sessions to push you run further and faster.
Get your running time metrics using custom pinned checkpoint on Google Map.

## Table of Contents

1. [Overview](#Overview)
1. [Hardware](#Hardware)
1. [Usage](#Usage)
1. [Tech Stack](#Tech-Stack)
1. [GPS service](#GPS-service)

# Hardware:

- Raspberry pi 3B
- [GPS NEO-6M](https://www.amazon.com/gp/product/B07P8YMVNT/ref=ppx_yo_dt_b_asin_title_o01_s01?ie=UTF8&psc=1)
- LED Start/Stop button

### How to install the start/stop button

// to do

## Usage

Add your own Google API key in `/project-ui/src/app.tsx`

```
<Wrapper
        apiKey={`${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`}
        render={render}
      >
```

From project root folder.

- `$ Balena push <fleet name>`
- Access UI from your public URL on Balena Fleets Dashboard to set checkpoints.

![Alt Text](https://media.giphy.com/media/fOUrTir22JbBL4rCC4/giphy.gif)

- Press button to start and press button to stop

![Alt Text](running_device.jpeg)

- Retreat time metrics after running

![Alt Text](https://media.giphy.com/media/jGYA8VZrL3cGNFBWrQ/giphy.gif)

## GPS-service

GPS service is taken from [alan128](https://github.com/alanb128/)'s contribution

1. [GPS-service](https://github.com/alanb128/gps-block)

1. [GPS-controller](https://github.com/alanb128/gps-block)

On press of `start/stop` button, the gps coordinates will start to populate in the text file in `/data/gps_data` volume.
