Hackathon BeagleBone User Guide

# 1. Requirements

## 1.1. Hardware Requirements

### 1.1.1. SeeedStudio BeagleBone Green Wireless

[https://beagleboard.org/green-wireless](https://beagleboard.org/green-wireless)

SeeedStudio BeagleBone Green (BBG) is a low-cost, open-source, community-supported development platform for developers and hobbyists. It is a joint effort by BeagleBoard.org and Seeed Studio. It is based on the classical open-source hardware design of BeagleBone Black and has been developed into this differentiated version. The BBG includes two Grove connectors, making it easier to connect to the large family of Grove sensors. The onboard HDMI is removed to make room for these Grove connectors.

[http://wiki.seeed.cc/BeagleBone_Green/](http://wiki.seeed.cc/BeagleBone_Green/) 

**Technical Specifications**

* Processor: AM335x 1GHz ARM® Cortex-A8

* 512MB DDR3 RAM

* 4GB 8-bit eMMC onboard flash storage

* 3D graphics accelerator

* NEON floating-point accelerator

* 2x PRU 32-bit microcontrollers

**Connectivity**

* USB client for power & communications

* USB host with 4-port hub

* Wi-Fi 802.11 b/g/n 2.4GHz

* Bluetooth 4.1 with BLE

* 2x 46 pin headers

* 2x Grove connectors (I2C and UART)

## 1.2. Software

### 1.2.1. BeagleBone Green

The BBG comes standard with a useful set of software that will enable you to rapidly develop your IoT solution.

* Debian 8.5

* Python

* Node.js

* Node-RED ([http://nodered.org/](http://nodered.org/))

### 1.2.2. Gateway Engine with GMQ

ExositeReady™ Gateway Engine (GWE) is a Python-based application framework that runs on embedded Linux gateway devices, such as the Multitech Conduit. GWE makes it easy to connect devices to a gateway and write applications on that gateway that interact with Exosite web services, including the Murano platform, Murano Edge, or both.

### 1.2.3. Mr. Murano

Mr. Murano is a command line utility for working with Murano.

[https://github.com/tadpol/MrMurano#mrmurano](https://github.com/tadpol/MrMurano#mrmurano)

$ mr help

### 1.2.4. Git

Git is required to check out the source code used in this tutorial.

https://git-scm.com/downloads

## 1.3. Solution Implementation

### 1.3.1. Generic Solution and Product

For the purposes of executing this tutorial, a generic solution and product have been created called GWE-Multitool.

### 1.3.2. Endpoints

Details about the endpoints that exist in the solution

### 1.3.3. Freeboard

[https://freeboard.io/](https://freeboard.io/)

Details about Freeboard and why we decided to use it

Auto-create datasources for connected sensors details

## 1.4. Sensors

## 1.5. SeeedStudio Grove Sensors

* Sensor pack

* 4 wires

    * details?

* Inexpensive

* Compatible

* Solid connection

* [https://www.seeedstudio.com/Grove-Starter-Kit-for-SeeedStudio-BeagleBone-Green-p-2526.html](https://www.seeedstudio.com/Grove-Starter-Kit-for-SeeedStudio-BeagleBone-Green-p-2526.html)

* [http://wiki.seeedstudio.com/wiki/Grove_Starter_Kit_for_BeagleBone_Green](http://wiki.seeedstudio.com/wiki/Grove_Starter_Kit_for_BeagleBone_Green)

# 2. Getting Started

In this section, we’ll walk through the process of connecting the BBG to a Murano Solution. 

## 2.1. Features

The code provided in this tutorial connects a BBG to Murano and allows data to be displayed with Freeboard deployed as a solution. From there you will be able to create widgets to visualize data in Freeboard, or deploy an example solution that can be modified and extended for your project’s needs.

## 2.2. Constraints

The current solutions implemented by this tutorial ignore users and groups. Any solution implemented by or created from this base tutorial will need to apply their needs for users and groups.

## 2.3. Create Business

To get started with this tutorial you will need to create an Exosite account. You can sign up here ([https://exosite.com/signup/](https://exosite.com/signup/)) or log in here ([https://www.exosite.io/business/auth/login](https://www.exosite.io/business/auth/login)).

Once you have an active account and have logged in, you can navigate to the following URL to create a new business or switch to the business you would like to use. 

[https://www.exosite.io/business/memberships](https://www.exosite.io/business/memberships)

![image alt text](image_0.png)

## 2.4. Create Product

Once a business has been created, you will need to create a product. The product you will create is the virtual representation of the BBG’s physical hardware and sensors that will send data to the platform. To create a new product, navigate to the following URL.  

[https://www.exosite.io/business/products](https://www.exosite.io/business/products)

![image alt text](image_1.png)

Create the product without a template. In the next step we will use code to configure your product.

## 2.5. Install Mr. Murano

Mr. Murano requires Ruby. If you’re new to Ruby, it is recommend to use RVM for development. If you’re not doing development work with Ruby or Mr. Murano, you can skip this portion of the step.

* [https://rvm.io/](https://rvm.io/)

* [https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/](https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/) 

Ruby may already be installed on your system. If you do not have Ruby installed, the official Ruby docs will help you get it installed.

[https://www.ruby-lang.org/en/documentation/installation/](https://www.ruby-lang.org/en/documentation/installation/) 

Once Ruby is installed and properly configured, you can install Mr. Murano.

$ sudo gem install MrMurano

## 2.6. Checkout GWE-Multitool Code

In this  step you will use the GWE-MT spec file to configure your product.

The following repository includes everything you need to configure the product you just created and to deploy a solution. Let’s get started by checking out the code.

In a terminal window:

$ git clone [https://github.com/tadpol/GWE-Multitool.git](https://github.com/tadpol/GWE-Multitool.git)

$ cd GWE-Multitool

Before continuing you’ll need to find the ID of the product you created.

1. In Murano select *Products*

2. Select the product you just created

3. Copy the Product ID on this page

To configure your product, use the config command of the Mr. Murano tool.

$ mr config product.id <productid>

$ mr product spec push --file spec/gwe-multitool.yaml

At this point your product is configured and ready to start receiving data from the BBG.

If you would like to review the spec file that was used to configure your product, it can be viewed at the following URL: [https://raw.githubusercontent.com/tadpol/GWE-Multitool/master/spec/gwe-multitool.yaml](https://raw.githubusercontent.com/tadpol/GWE-Multitool/master/spec/gwe-multitool.yaml)

## 2.7. Create Solution

Next we need a place to deploy the GWE-Multitool solution code. The steps for creating a solution can be found in the Murano documentation. Please follow only Step 1 and be sure to "start from scratch" when creating the solution.

[http://docs.exosite.com/murano/get-started/solutions/exampleapp/](http://docs.exosite.com/murano/get-started/solutions/exampleapp/) 

Once you have created a solution using the "start from scratch" option, we’ll need to find the Solution ID.

[https://www.exosite.io/business/solutions](https://www.exosite.io/business/solutions) 

1. In Murano select *Solutions*

2. Select the solution you just created

3. Copy the Solution ID on this page

To configure your solution, use the config command of the Mr. Murano tool.

$ mr config solution.id XXXXX

## 2.8. Use Mr. Murano to Sync Code

At this point the product is created and the solution is ready to be deployed. In the GWE-Multitool repository directory we can sync the code base. Ensure you are in the GWE-Multitool repository directory and then use the syncup command of Mr. Murano.

$ cd GWE-Multitool

$ mr syncup -V

## 2.9. Read BeagleBone Documentation

[http://beagleboard.org/static/beaglebone/latest/README.htm](http://beagleboard.org/static/beaglebone/latest/README.htm)

Follow the connection steps to connect to the BeagleBone’s Wi-Fi. The box has an informational sheet that includes details on how to accomplish this.

If you need to reset your device:

[http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29](http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29) 

If you intend to use Node-RED, you can connect at the following address: [http://192.168.11.xxx:1880/](http://192.168.11.xxx:1880/)

If you intend to use Cloud9, you can conenct at the following address: [http://192.168.11.xxx:3000/](http://192.168.11.xxx:3000/)

Now, to connect directly to the BBG, you can use ssh. At this point we will update the board the install a few needed libraries. The password for the BBG will be displayed after you initiate the ssh connection.

$ ssh [debian@192.168.11.xxx](mailto:debian@192.168.11.xxx)

$ sudo apt-get update && sudo apt-get upgrade

$ sudo pip install Adafruit_BBIO --upgrade

$ sudo pip install pyserial --upgrade

$ sudo apt-get install python-smbus

## 2.10. Install GWE w/GMQ on BeagleBone

[https://gateway-engine.exosite.io/](https://gateway-engine.exosite.io/)

We have already done Step 1 above. Start from Step 2.

[https://gateway-engine.exosite.io/getting_started.html#step-two](https://gateway-engine.exosite.io/getting_started.html#step-two)

## 2.11. Install Node Modules

$ npm install -g node-red-contrib-exosite

*At this point in the tutorial, your device’s software is up to date and ready to connect.

## 2.12. Add Device

1. In Murano select *Products*

2. Select your product

3. Select *DEVICES*

4. Hit *+ NEW DEVICE*

5. Add device with name and serial number

## 2.13. Enable Serial Number which is the MAC Address of the Device

Enable device words.

## 2.14. Activate GWE:

GWE can be activated by passing information:

$ gwe --set-product-id <PRODUCT_ID> --set-uuid <THE_SERIAL_NUMBER>

*At this point in the tutorial, your device is now connected to the platform

# 3. In Murano, Connect the Product to the Solution

4. In your solution, click on the *SERVICES* tab 

5. Select *Product*

6. Select the settings icon 

7. Select the product(s) you want to include in the solution 

8. Hit *APPLY*

# 4. Final Steps

At this point in the development process there are few paths one can take.

Create widgets in freeboard

Use Node-RED to connect sensors

Create a <vertical> web solution

# 5. Diagrams

Dataflow from device to Freeboard

Dataflow from Freeboard to device
