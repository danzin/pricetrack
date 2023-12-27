Live project at: https://pricetrackapp.netlify.app/ 

## Overview
PriceTrack is a web application for tracking product prices of the popular bulgarian e-commerce website. 

![firefox_5PnQRwOWWh](https://github.com/danzin/pricetrack/assets/8279984/ce297ecf-7446-4bd0-af4a-14a63df7482e)

It's built with React, TypeScript and Tailwind CSS using the NextJS framework.

## Getting Started

First, install dependencies:
``` npm install ```

Configure .env file with the required environment variables:
```
MONGODB_URI_CLD=MONGO_CLOUD_DATABASE
EMAIL_PASSWORD=PASSWORD_FOR_EMAIL_USED_IN_NODEMAILER
BRIGHTDATA_USERNAME=USERNAME_FOR_BRIGHTDATA_PROXY
BRIGHTDATA_PASSWORD=PASSWORD_FOR_BRIGHTDATA_PROXY
```

Run the project:
```npm run dev ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Functionality


The app scrapes relevant data for a product from a valid product link provided by user:

![firefox_Gy7OO4NU50](https://github.com/danzin/pricetrack/assets/8279984/8e2d53f3-8296-4ee7-88ad-00f414cd90df)

Keeps product data in MongoDB database.
Users can subscribe for products via the "Track" button in the product page:

![firefox_fn8p1HqbUZ](https://github.com/danzin/pricetrack/assets/8279984/6389ecda-32b4-4a56-a39b-8f193d455233)


Executes a cronjob once a day, updating product data and notifying users via Email if there any updates in price of select products:

![firefox_TzFGBXaGAN](https://github.com/danzin/pricetrack/assets/8279984/4b97ef4a-0a0f-4107-ac53-6309a0e6d2ce)


