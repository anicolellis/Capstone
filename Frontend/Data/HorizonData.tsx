/*
Author: Alex Nicolellis

Data for the Horizon form's checklist.

Description: static text
*/
export const HorizonData: {description:string}[] = [
    {description:"PC/Server must meet specifications as per the logical number of robots calculator? https://pccalculator.lelyonline.com/"},
    {description:"Correct Operating System ordered as per the recommended specifications: Windows 11 Pro x64 or Window Server 2022 Standard Edition x64?"},
    {description:"Correct SQL version ordered as per the recommended specifications. (Only for Dairy XL) SQL 2022 Standard Edition x64?"},
    {description:".NET Framework is 4.8 or higher? (Windows Server 2019)"},
    {description:"Configure all RAID Arrays (RAID 1, RAID 10 if applicable as per the calculator)"},
    {description:"Install the Operating System"},
    {description:"Create main user account as administrator (NO Home users)"},
    {description:"Install the drivers from the DVD’s that came with the PC (typical example): Chipset Drivers, Network Drivers, Audio Drivers, Display Drivers, Onboard RAID Controller Drivers, etc."},
    {description:"Update all the drivers in step 4 from the PC’s manufacturer’s website. Windows update normally will not have the updated drivers."},
    {description:"Update the BIOS (Download from the PC’s manufacturer’s website and follow BIOS update instructions, some cases it can be done via Windows Desktop and other cases you have to do it via the BIOS only accessible during PC boot up with a USB stick)"},
    {description:"Ensure that the Internet network is not on a 10.X.X.X IP RANGE, this can have negative impact on communication since the T4C Services can view the 10.X.X.X as a valid server IP instead of the T4C Network IP 10.4.1.1."},
    {description:"Install all Windows Updates until ‘Checking for updates’ returns with “Windows is up to date. There are no updates available for your computer.”"},
    {description:"Install TeamViewer Host Edition (Start with windows, VPN adapter, static secure password) https://www.teamviewer.com/en-us/info/teamviewer-host/"},
    {description:"Download the current Horizon Setup file from LelyNet (Knowledge Base) https://lely.rightanswers.com/portal/app/portlets/results/viewsolution.jsp?solutionid=150713113407614"},
    {description:"Right Click and Run the Horizon Setup EXE file as administrator."},
    {description:"When prompted, enter the correct Farm Name, Country and Culture (metric or imperial)"},
    {description:"Restart the PC when prompted."},
    {description:"Install all Windows Updates until ‘Checking for updates’ returns with “Windows is up to date. There are no updates available for your computer.”"},
    {description:"Install Google Chrome"},
    {description:"SQL Standard Edition (Dairy XL Only), perform an edition upgrade to SQL 2019 Standard edition x64 or perform a version upgrade to SQL 2022 Standard edition x64 https://lely.rightanswers.com/portal/app/portlets/results/viewsolution.jsp?solutionid=190417100928007"},
    {description:"Register Horizon using: a. “Farm” license type, b. Customer Movex Code, Lely Center Name, c. Lely Center Check Code, Service Technician Code, d. Product Key"},
    {description:"Use SSP to generate and download a 3-3 Letter (new customer). Create an account in the Lely Portal (this can be done anytime on any device) https://www.lelyportal.com. Provide Movex, the personal registration code (from 3-3 letter) and have preferred payment method ready for activation. Activate the Horizon subscription in the portal (Farmer should be present)"},
    {description:"Enter and configure all devices (Internet Required)"},
    {description:"Logout of Horizon then Login again (Manage>>License Overview>>Save License again)"},
    {description:"Enter cows and proceed to FMS configurations (Milking, Feeding, Routing etc.)"},
]