# Getting-started Guide: Prototype or Simulate an HVAC Monitoring and Control System with Murano

This getting-started guide is an interactive tutorial that allows users to learn the core features of Murano from both a hardware and software perspective. You will have the option to prototype or simulate the implementation of an HVAC monitoring system with simple controls using the Murano platform. 

# Requirements

## Hardware Setup

### SeeedStudio BeagleBone Green Wireless

[https://beagleboard.org/green-wireless](https://beagleboard.org/green-wireless)

SeeedStudio BeagleBone Green (BBG) is a low-cost, open-source, community-supported development platform for developers and hobbyists. It is a joint effort by BeagleBoard.org and Seeed Studio. It is based on the classical open-source hardware design of BeagleBone Black and has been developed into this differentiated version. The BBG includes two Grove connectors, making it easier to connect to the large family of Grove sensors. The onboard HDMI is removed to make room for these Grove connectors.

[http://wiki.seeed.cc/BeagleBone_Green/](http://wiki.seeed.cc/BeagleBone_Green/) 

## Software Setup

### BeagleBone Green

The BBG comes standard with a useful set of software that will enable you to rapidly develop your IoT solution.

* Debian 8.5

* Python

* Node.js

* Node-RED ([http://nodered.org/](http://nodered.org/))

### Gateway Engine with GMQ

ExositeReady™ Gateway Engine (GWE) is a Python-based application framework that runs on embedded Linux gateway devices. GWE makes it easy to connect devices to a gateway and write applications on that gateway to interact with Exosite web services, including the Murano platform, Murano Edge, or both.

In this example you will use GWE to allow sensors to communicate with the Murano platform.

### Mr. Murano

Mr. Murano is a command-line utility for working with Murano. Think of it as a way to simplify and automate repititous tasks for those who are comfortable with the command-line interface. 

[https://github.com/tadpol/MrMurano#mrmurano](https://github.com/tadpol/MrMurano#mrmurano)

### Git

Git is required to check out the source code used in this tutorial. Git is a source control tool that is widely used in the software industry. 

To install Git on your computer please visit the link below and follow the instructions.

[https://git-scm.com/downloads](https://git-scm.com/downloads)

# Getting Started

In this section, you will walk through the process of installing GWE on the BBG, connecting the BBG and its sensors to the Murano platform, and connecting the sensor data to a Murano solution. This should provide you with an easy starting point for connecting devices and creating solutions to visualize and interpret your device's data.

```
Watch for the comments in boxes like these! These notes will provide further insight to answer the "whys" along the way and hopefully give you a better idea of how Murano works.
```

## Create Business

To get started with this tutorial you will need to create an Exosite account. 

1. If you do not have an Exosite account, you can sign up here ([https://exosite.com/signup/](https://exosite.com/signup/)).

   ![signup](assets/exosite_signup.png)
   
   ![welcome](assets/business_welcome.png)

1. Once you have an active account and have logged in, you can navigate to the following URL to see your newly created business  [https://www.exosite.io/business/memberships](https://www.exosite.io/business/memberships).

   ![new business](assets/new_business.png)

1. Click on your business to access your business page. 

```
What is a Business within Murano?

A Business is a virtual space that houses all the products and solutions created by your organization in one place. A Business does not necessarily have to be a real-life company. A business could be a development or testing space for trying out new innovations. The business page is the place to manage your account, user access, products, solutions, billing and payments, and more.

Products and solutions will be explained in later sections.
```

## Create Product

Next, you will need to create a product. The product you create is the virtual representation of the BBG’s physical hardware and sensors that will send data to the Murano platform. To create a new product:

1. Navigate to the following URL. Note: Product name cannot contain any capital letters. [https://www.exosite.io/business/products](https://www.exosite.io/business/products)

   ![new product](assets/new_product.png)

1. Select *Start from scratch* and click the "ADD" button. In the next step you can use code to configure your product.

   ![new product](assets/new_product_popup.png)

```
What is a Product within Murano?

A Product encompasses the device side of Murano. Think of it as a virtual blueprint of definitions that will be applied to each connected device. The definitions will tell each new product device how to talk to Murano. 

Example: If you have a thermometer product, you would want all your new devices to report a temperature back to Murano. When you create a product definition with a temperature, every new device added to that product will contain the temerature alias. The Mr Murano tool will be used to make this product definition easier to create.
```

## Install Mr. Murano

```
Mr. Murano is the command-line tool that interacts with Murano and makes different tasks easier. Mr Murano makes it easy to deploy code to a solution, import many product definitions at once, set up endpoints and APIs, and more. 
```

Mr. Murano is a ruby based command line interface Ruby. TODO more here 

Ruby may already be installed on your system. Check to see if it is installed first by opening up a terminal window and type the command.  

**Note:** Always copy and paste what comes after the $.

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

Git is required for this next step. Check if Git is installed by running the command: 

```
$ which git 
```

TODO, any more info
In this step you will use the BBAE HVAC spec file to configure your product.

The following repository includes everything you need to configure the product you just created and deploy a solution. Get started by checking out the code.

In a terminal window:

```
$ git clone https://github.com/tadpol/ae-beaglebone-hvac-demo.git
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

To configure your product, use the config command of the Mr. Murano tool. This command tells Mr. Murano which product to use. 

```
$ mr config product.id <productid>
```

Run the command below. This command will set the product definition for this example.

```
$ mr product spec push --file spec/beaglebone-hvac-spec.yaml 
```

At this point your product is configured and ready to start receiving data from the BBG.

If you would like to review the spec file used to configure your product, it can be viewed at the following URL: [https://github.com/exosite/ae-beaglebone-hvac-demo/blob/master/spec/beaglebone-hvac-spec.yaml](https://github.com/exosite/ae-beaglebone-hvac-demo/blob/master/spec/beaglebone-hvac-spec.yaml)

## Create Solution

Next you need a place to deploy the BBAE solution code. The steps for creating a solution can be found in the Murano documentation (we will add in here from the documentation). Please follow only Step 1 and be sure to *Start from scratch* when creating the solution.

[http://docs.exosite.com/murano/get-started/solutions/exampleapp/](http://docs.exosite.com/murano/get-started/solutions/exampleapp/) 

Once you have created a solution using the *Start from scratch* option, you will need to find the Solution ID.

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

Next, the beaglebone doesn't come with all of the tools that are needed for reading sensors that are connected to it.

[http://beagleboard.org/static/beaglebone/latest/README.htm](http://beagleboard.org/static/beaglebone/latest/README.htm)

Follow the connection steps to connect to the BeagleBone’s Wi-Fi. The box has an informational sheet that includes details on how to accomplish this. 

TODO: Add screenshots and steps for beaglebone setup

**Note:** After you have connected to Wi-Fi, be sure to write down your device's IP address.

If you need to reset your device:

[http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29](http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#microSD.2FStandalone:_.28iot.29_.28BeagleBone.2FBeagleBone_Black.2FBeagleBone_Green.29) 

TODO: change this to just use cloud9
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

## Install GWE with GMQ on BeagleBone

Gateway engine is a TODO words

To install follow 

[https://gateway-engine.exosite.io/](https://gateway-engine.exosite.io/)

Write down MAC address for adding the device later.

Download, install, and configure Gateway Engine onto your gateway.

To download the latest version of the Public Release of Gateway Engine, follow these steps:

Navigate to the Gateway Engine Release Packages section and follow the instructions to download Gateway Engine.
Run these commands to copy Gateway Engine to your gateway (the actual filename in the command may differ):

```
ssh <USER>@<GATEWAY_IP> "mkdir /opt"
scp GatewayEngine.v1-1-2.tar.gz <USER>@<GATEWAY_IP>:/opt
```

At this point, you have downloaded the latest release of Gateway Engine and copied it to your gateway.
Run this command to untar the release package and install Gateway Engine onto your gateway:

```
ssh <USER>@<GATEWAY_IP> "cd /opt
   tar zxvf GatewayEngine.v1-1-2.tar.gz
   cd gateway-engine
   ./install.sh"
   ```
   
**Note:** In some Linux environments, you will need to use Super-User permissions to run the installer. In this case, replace the ./install.sh command to:

```
sudo ./install.sh
```

Once the installation completes, you will need to configure Gateway Engine for your IoT solution and Exosite account. This will require one piece of information from your Murano account, and you will need to make a decision about what serial number to use for your gateway.

In your Murano account, navigate to your Product and click on the *INFO* tab. Copy the Product ID and use it in the commands, below, in place of <PRODUCT_ID>.

Determine the serial number of your gateway. Gateway Engine is programmed to retrieve the MAC address from the internet interface of your choosing (e.g., eth0, wlan0, ppp0, etc.) when the --set-iface command-line switch is used. Or you can just specify any serial number you want with the --set-uuid command line switch.

Once you have gathered this information and determined what serial number to use for your gateway (interface MAC address or custom serial number), run the following command to configure Gateway Engine:

$ ssh <USER>@<GATEWAY_IP> "gwe --set-product-id <PRODUCT_ID> --set-iface <THE_INTERFACE>""
Note

Example:

$ ssh <USER>@<GATEWAY_IP> "gwe --set-product-id dubhxzv0r4e1m7vj --set-iface eth0"``
Or if you want to just specify your own serial number:

$ ssh <USER>@<GATEWAY_IP> "gwe --set-product-id <PRODUCT_ID> --set-uuid <THE_SERIAL_NUMBER>""
Note

Example:

$ ssh <USER>@<GATEWAY_IP> "gwe --set-product-id dubhxzv0r4e1m7vj --set-uuid 12345"
To complete the installation you will need to reboot the gateway. To reboot, you can toggle the power or use the following command:

$ ssh <USER>@<GATEWAY_IP> "reboot"

Important

Gateway Engine uses supervisord to start itself on boot and once it starts, it will start Gateway Engine as well as all other installed Custom Gateway Applications.

ssh root@<IP Adddress>
ifconfig

## Install Node Modules 
TODO, is this step needed

```
$ npm install -g node-red-contrib-exosite
```

At this point in the tutorial, your device’s software is up to date and ready to connect.

## Add Device

1. In Murano select *Products*

   ![image alt text](assets/products_tab.png)

2. Select your product

3. Select *DEVICES*

   ![image alt text](assets/devices_tab.png)

4. Click "+ NEW DEVICE"

   ![image alt text](assets/new_device_popup.png)

5. Add a device with a name and MAC Address

## Enable Serial Number which is the MAC Address of the Device

TODO Enable device words. I think this is a reboot of the beagle bone

## Connect the Product to the Solution

1. In your Murano solution, click on the *SERVICES* tab 

2. Select *Product*

3. Select the settings icon 

4. Select the product(s) you want to include in the solution 

5. Click "APPLY"

## Final Steps

TODO: add final steps. click the solution link. and watch the magic happen.

TODO: Add the code needed for this, then explain what the code is doing. 

There are many other services and features of Murano that were not covered in this example such as users, timeseries databases, email, SMS, and many more. Please visit [docs.exosite.com](docs.exosite.com) to explore additional features of Murano.

## Diagrams

![image alt text](assets/services_soutions_diagram.png)


