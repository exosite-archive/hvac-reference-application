# Getting-started Guide: Prototype or Simulate an HVAC Monitoring and Control System with Murano

This getting-started guide is an interactive tutorial that allows users to learn the core features of Murano from both a hardware and software perspective. You will have the option to prototype or simulate the implementation of an HVAC monitoring system with simple controls using the Murano platform. 

# Requirements

## Hardware Setup

### SeeedStudio BeagleBone Green Wireless

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

## Software Setup

### BeagleBone Green

The BBG comes standard with a useful set of software that will enable you to rapidly develop your IoT solution.

* Debian 8.5

* Python

* Node.js

* Node-RED ([http://nodered.org/](http://nodered.org/))

### Gateway Engine with GMQ

ExositeReady™ Gateway Engine (GWE) is a Python-based application framework that runs on embedded Linux gateway devices, such as the Multitech Conduit. GWE makes it easy to connect devices to a gateway and write applications on that gateway that interact with Exosite web services, including the Murano platform, Murano Edge, or both.

### Mr. Murano

Mr. Murano is a command-line utility for working with Murano.

[https://github.com/tadpol/MrMurano#mrmurano](https://github.com/tadpol/MrMurano#mrmurano)

```
$ mr help
```

### Git

Git is required to check out the source code used in this tutorial.

https://git-scm.com/downloads

## Solution Implementation

### Generic Solution and Product

For the purposes of executing this tutorial, a generic solution and product have been created called GWE-Multitool.

### Endpoints

Details about the endpoints that exist in the solution

### Freeboard

[https://freeboard.io/](https://freeboard.io/)

Details about Freeboard and it is useful
TODO: update this text 

Auto-create datasources for connected sensors details

## Sensors

### SeeedStudio Grove Sensors

* Sensor pack

* 4 wires

    * details?

* Inexpensive

* Compatible

* Solid connection

* [https://www.seeedstudio.com/Grove-Starter-Kit-for-SeeedStudio-BeagleBone-Green-p-2526.html](https://www.seeedstudio.com/Grove-Starter-Kit-for-SeeedStudio-BeagleBone-Green-p-2526.html)

* [http://wiki.seeedstudio.com/wiki/Grove_Starter_Kit_for_BeagleBone_Green](http://wiki.seeedstudio.com/wiki/Grove_Starter_Kit_for_BeagleBone_Green)

# Getting Started

In this section, you can walk through the process of connecting the BBG to a Murano solution. 

```
Watch for the comments in boxes like these! These notes will provide further insight to answer the "whys" along the way and hopefully give you a better idea of how Murano works.
```

## Features

The code provided in this tutorial connects a BBG to Murano and allows data to be displayed with a simple example solution. This should provide you with an easy starting point for connecting devices and creating solutions to visualize and interpret your device's data.

## Constraints

The current solutions implemented by this tutorial ignore users and groups. Any solution implemented by or created from this base tutorial will need to apply their needs for users and groups.

## Create Business

To get started with this tutorial you will need to create an Exosite account. 

1. If you don't have an Exosite account, you can sign up here ([https://exosite.com/signup/](https://exosite.com/signup/))

1. Once you have an active account and have logged in, you can navigate to the following URL to create a new business or switch to the business you would like to use. [https://www.exosite.io/business/memberships](https://www.exosite.io/business/memberships)

1. Once a business has been created, click on the business to switch to it.

```
What is a Business within Murano?

A Business is a virtual space that houses all the products and solutions of your organization in one place. A Business does not necessarily have to be a real-life company, but rather a space to keep all of your solutions and businesses together and safe. Products and solutions are discussed in later sections.
TODO: Make a better description for a business
```

TODO update the screen to be a full screnshot
![image alt text](new_business_button.png)


## Create Product

Next, you will need to create a product. The product you will create is the virtual representation of the BBG’s physical hardware and sensors that will send data to the platform. To create a new product:

1. Navigate to the following URL. Note: Product name cannot contain any capital letters. [https://www.exosite.io/business/products](https://www.exosite.io/business/products)

1. Select start from scratch and then click the add button. In the next step you can use code to configure your product.

```
What is a Product?

A Product is the device side of Murano. You can create a product definition which defines all of the avenues that your physical devices will communicate through. Example: If you have a thermoeter product, you would want all of your new devices to report a temperature back to murano. When you create a product definition with a temperature, every device added to that product will contain a temerature alias. in order to make this product definition easier to create, we will need some help from MrMurano, the command line tool for Murano.

TODO expand this
```

TODO update this screenshot to be the full page
![image alt text](new_product_button.png)

## Install Mr. Murano

```
Mr Murano is the command line tool to interact with murano and make different tasks easier. TODO more
```

Mr. Murano requires Ruby. 

```
If you are new to Ruby, it is recommended to use RVM for development. If you are not doing development work with Ruby or Mr. Murano, you can skip this portion of the step. 

* [https://rvm.io/](https://rvm.io/)

* [https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/](https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/) 
```

Ruby may already be installed on your system. Check to see if it is installed first by opening up a terminal window and type the command  (always copy and paste what comes after the $).

```
$ which gem
```

If you see /usr/bin/gem, then it is already installed. 

```
If you do not have Ruby installed, the official Ruby docs will help you get it installed.

[https://www.ruby-lang.org/en/documentation/installation/](https://www.ruby-lang.org/en/documentation/installation/) 
```

Once Ruby is installed, you can install Mr. Murano by running this command.

```
$ sudo gem install MrMurano
```

## Check Out BBAE HVAC

Check if Git is installed by running the command: 
```
$ which git 
```

In this step you will use the BBAE HVAC spec file to configure your product.

The following repository includes everything you need to configure the product you just created and deploy a solution. Get started by checking out the code.

In a terminal window:

```
$ git clone https://github.com/tadpol/ae-beaglebone-hvac-demo.git **Change
```
Enter your GitHub username and password if prompted.

Run command:
```
$ cd ae-beaglebone-hvac-demo
```

Before continuing you will need to find the ID of the product you created.

1. In Murano select *Products*

2. Select the product you just created

3. Copy the Product ID on this page

To configure your product, use the config command of the Mr. Murano tool.This command tells MrMurano what product to look use. 

```
$ mr config product.id <productid>
```
Run the command below. This command will set the product definition for this example.
```
$ mr product spec push --file spec/beaglebone-hvac-spec.yaml 
```

At this point your product is configured and ready to start receiving data from the BBG.

If you would like to review the spec file that was used to configure your product, it can be viewed at the following URL: [https://github.com/exosite/ae-beaglebone-hvac-demo/blob/master/spec/beaglebone-hvac-spec.yaml](https://github.com/exosite/ae-beaglebone-hvac-demo/blob/master/spec/beaglebone-hvac-spec.yaml)

## Create Solution

Next you need a place to deploy the BBAE solution code. The steps for creating a solution can be found in the Murano documentation (we will add in here from the documentation). Please follow only Step 1 and be sure to "start from scratch" when creating the solution.

[http://docs.exosite.com/murano/get-started/solutions/exampleapp/](http://docs.exosite.com/murano/get-started/solutions/exampleapp/) 

Once you have created a solution using the "start from scratch" option, you will need to find the Solution ID.

[https://www.exosite.io/business/solutions](https://www.exosite.io/business/solutions) 

1. In Murano select *Solutions*

2. Select the solution you just created

3. Copy the Solution ID on this page

To configure your solution, use the config command of the Mr. Murano tool.

```
$ mr config solution.id <solutionid>
```

```
What is a solution?

TODO: a description
```

## Use Mr. Murano to Sync Code

At this point the product is created and the solution is ready to be deployed. In the BBAE repository directory, you can sync the code base. Ensure you are in the BBAE HVAC repository directory and then use the syncup command of Mr. Murano.

```
$ cd ae-beaglebone-hvac-demo
```
```
$ mr syncup -V
```
```
What is happening when I sync code?

TODO: words
```

## Read BeagleBone Documentation


[http://beagleboard.org/static/beaglebone/latest/README.htm](http://beagleboard.org/static/beaglebone/latest/README.htm)

Follow the connection steps to connect to the BeagleBone’s Wi-Fi. The box has an informational sheet that includes details on how to accomplish this. 

*IMPORTANT!!! After you have connected to Wi-Fi, write down your devices IP address.*

If you need to reset your device:

[http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29](http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29) 

If you intend to use Node-RED, you can connect at the following address: [http://192.168.11.xxx:1880/](http://192.168.11.xxx:1880/)

If you intend to use Cloud9, you can conenct at the following address: [http://192.168.11.xxx:3000/](http://192.168.11.xxx:3000/)

Now, to connect directly to the BBG, you can use ssh. At this point you can update the board to install a few needed libraries. The password for the BBG will be displayed after you initiate the ssh connection.

```
$ ssh root@<IP Address>
```
```
$ sudo apt-get update && sudo apt-get upgrade
```
```
$ sudo pip install Adafruit_BBIO --upgrade
```
```
$ sudo pip install pyserial --upgrade
```
```
$ sudo apt-get install python-smbus
```

## Install GWE w/GMQ on BeagleBone

[https://gateway-engine.exosite.io/](https://gateway-engine.exosite.io/)

You have already done Step 1 above. Start from Step 2. Write down mac address for adding the device later. 

TODO: take the steps from Step two and improve upon them. Send these steps to will for addition to the true documentation, if he can update these quickly we may not need to make our own steps in this guide.

TODO: Also make sure that they are getting their MAC address. 
ssh root@<IP Adddress>
ifconfig

[https://gateway-engine.exosite.io/getting_started.html#step-two](https://gateway-engine.exosite.io/getting_started.html#step-two)

## Install Node Modules 
-Skipped this test

```
$ npm install -g node-red-contrib-exosite
```

*At this point in the tutorial, your device’s software is up to date and ready to connect.

## Add Device

1. In Murano select *Products*

2. Select your product

3. Select *DEVICES*

4. Click "+ NEW DEVICE"

5. Add device with name and MAC Address

## Enable Serial Number which is the MAC Address of the Device

Enable device words.

TODO Delete?

## Activate GWE

TODO: I believe this is done in the GWE documentation Step 2

GWE can be activated by passing information:

```
$ gwe --set-product-id <PRODUCT_ID> --set-uuid <THE_SERIAL_NUMBER>
```

*At this point in the tutorial, your device is now connected to the platform

## Connect the Product to the Solution

1. In your Murano solution, click on the *SERVICES* tab 

2. Select *Product*

3. Select the settings icon 

4. Select the product(s) you want to include in the solution 

5. Click "APPLY"

## Final Steps

At this point in the development process there are few paths one can take.

Create widgets in freeboard

Use Node-RED to connect sensors

TODO: Add the code needed for this, then explain wha tthe code is doing. 

## Diagrams

TODO: Dataflow from device to Fsolution

