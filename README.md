# Shopify Phase2 App

This app is developed in NodeJs with express. It is created on Node version:- `v16.17.1`

# Folder Sturcture

1. `web` folder contains the NodeJs Source code
2. `web/frontend` folder have all the react based shopify app template which will be visible in shopify admin on app page
3. `.env` file should contain all configuration, you can copy content from env.example and change accordingly.

# Requirements

### Part 1: POC of Capture of Product
- Develop a Shopify feature that enforces the definition of a custom attribute "Excise Tax
Product Type" when a product is added or modified into Shopify. The attribute can have one of
the values: 'n/a', 'vape'.
- If the "Excise Tax Product Type" is defined as 'vape', ensure that a "Wholesale Price" and a
“Has Nicotine” attribute is also defined for the product. This is required information for vape
products only and need not be supplied for when ‘n/a’ is specified.
- The feature should inform the user if the required information is not provided. In particular, if
"Excise Tax Product Type" is set to 'vape' but no "Wholesale Price" or “Has Nicotine” attribute is
given, an alert should be triggered. You will need to add more once you get to Part 2 below but
these two attributes are enough to start with.
We are interested to see how you handle ‘c’ in particular - no we are not going to help you
decide what to do here. We want to see how you think.
When you’re done with this phase please tag it in your git repo so that we can take a look later
on if need be. Also prep a video to show us what you have before proceeding to the next step.
### Part 2: Integration of Token of Trust API

- Modify the existing product sync script developed in Part 1 to send product details to Token of Trust each time a product is created or modified within Shopify. You will note that there are more attributes in the
API than we originally asked for - please add the additional fields for vape products along with
suitable validation!
We will send the OpenAPI 3.0 version of the API once you complete an MNDA - you should
have already received a request for your full name and legal address which we require in order
to complete that document. The MNDA is intended to protect both parties from sharing
confidential information.

# Code Functionality

This app is based on shopify app template, which provide basic installation and auth flow.

After installation, shop offline access token get stored in mongodb. You can manage mongodb details in .env file.

The app does below things at shopify:-

- As shopify not supporting adding custom validations on admin -> products page, we have to be in shopify structure to complete this task
- Shopify have metafields and metaobject options which can be used to get additional data 
- Once app get installed "Excise Tax Product Type" metafield get added in Products section
- It has two Metaobject fields "N/A" and "Vape" which also get synced in shopify automatically
- As metaobject fields should have atleast one field as per shopify we have added message field in "N/A", you can leave it empty
- After selecting "Vape", in Entry form all other respective fields shows up
- Each product should have SKU, only then it will be synced to ToT
- After product create/update it will auto update to ToT