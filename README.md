# projet-systeme-telescope-dobson

## BTS Project : creation of a control system for a Dobsonian mount telescope

![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/5ab91e6f-25eb-46b4-ac69-e8d7a07f280a)



**The proposed resources are the result of my personal work carried out to meet the requirements of the specifications (data sheet, source code, documentation). The codes for moving the telescope produced by the group are not shown here.**

### This includes briefly :


**- Installation and configuration of rpi:** complete installation of the Raspberry, plus additional features such as a shared Samba. Installation of DB Mysql on Raspberry PI: installation of the Messier catalog according to specifications. Additional catalogs (NGC and IC) and a custom catalog to save the user's stars are added as extras.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/d630cc43-a6da-47b4-a7c9-ab5a83478f60)

**- Wifi access point:** Installation of access point and configuration of tools accordingly to access the Raspberry's functions.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/9001ba44-5ab7-425b-baad-049877d3c02b)

**- Polar star initialization management:** Polar star initialization lock switch, alignment information and display when star is aligned.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/e0227493-1df2-40d3-b5e5-a2c8ea15ccdc)

**- GPS acquisition:** Script for filtering a particular NMEA frame, frame processing and error handling (gps error, no detection, gps not connected, etc.), conversion and use of cut values in degrees.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/3011968f-fff3-4dde-9d42-f7307e3b2954)

**- Equatorial coordinate DB queries:** Creation of SQL queries, addition of filters to select the star based on the Messier catalog according to specifications. Filters were then added to filter according to catalog, constellation hemisphere or season to facilitate use.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/e6c9290d-4767-48f7-aa09-31511a94d362)

**- Calculate Azimuth height coordinates:** Calculate horizontal coordinates after research, documentation and the use of numerous algorithms.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/81e38d39-1af2-46bd-8d3e-cf9e77d4be6c)

**- Calculation and display of height and azimuth deltas:** Calculation of the horizontal coordinates of the polar star and the difference in distance with the star selected according to specifications. Creation of a spreadsheet to display calculation details and additional variables to technically troubleshoot calculation errors and display details to the user.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/493f8df0-abb9-46ef-9443-5d265234dff5)

**- Positon reached display:** Digital LEDs are displayed and only need to be activated when the delta height and azimuth count are zero, depending on the response received from the ESP via a PHP socket script.
![image](https://github.com/teddyfresnes/projet-systeme-telescope-dobson/assets/80900011/c29781ab-1e7a-421c-8fce-d140e29708e9)




### Problems encountered as a student :


There were no major difficulties with any single problem, except for certain design and 
design and implementation that took longer than expected:

**- During PhpMyAdmin configuration** to manage the database and facilitate the use of LAMP, even with the extensive documentation, a difficulty was encountered with MySQL permissions.

**- SQL queries** that I found complicated on several topics

**- Creating the web GUI:** certain elements can be time-consuming during development (display bugs when framing form tags, improving the site to make it web  to make it web responsive by adapting and recreating all elements with a fixed position  etc.)

**- Calculation:** A great deal of testing, comparison, documentation and research went into 
to improve the accuracy of the calculation, including the testing of several algorithms for calculating the number of Julian days (accumulation of algorithm tests with an margin of error of 1 year, 1 month, 2 weeks, 2 days, 2 hours...) 

**- Making search filters:** after meeting with an amateur astronomer who outlined needs, it was necessary to add filters to display only observable stars. the creation of several filters and their simultaneous operation was a complex task

**- Using Ajax:** I found it difficult to understand how Ajax worked and its syntax as I'd never used it before.
