---
layout: post
title: "How to have two versions of the same app on your device"
date: 2013-07-29 07:59
comments: true
published: true
categories:
- iOS
- App Store
---

You have *v1* of your great app in the App Store, and therefore on all your devices. You are now starting to work on *v1.1*. The problem is that if you just bump the version number and keep building/provisioning with your current settings, when you install it on your device, it will replace the App Store version.

In this article, I am going to explain how to get both the currently released version of your app and the development build you are working on the same device easily. I am also going to explain how to have 2 different icons for them so that you can tell them apart.

<!--more-->

### Create 2 different App IDs
**Update:** *You only need 2 different App IDs if you need to use things such as push notifications or iCloud. Otherwise you can use a wildcard profile with 2 different bundle IDs. Thanks [@alloy](http://twitter.com/alloy) for the tip.*

When you install an App, in order to determine if you are trying to install a new app or to update an app already installed, the device compares their App IDs.

So the first thing to do is to go in the provisioning center and create a second App ID for the development version of your app so that the device will be able to keep the two versions of your app.

If your App Store app has the App ID `com.mycompany.myapp` I suggest you create `com.mycompany.myapp-beta` or `com.mycompany.myapp-dev`.

While you're in there also create a provisioning profile for that new App ID.

### Create a different icon for the development version
In order to differentiate the 2 versions when they are on my device, I use 2 different icons. The beta version has a black and yellow *work in progress* banner at the top left.

![Beta next to release](http://f.cl.ly/items/1g0n2k3i2Z2f1u10423F/Beta-next-to-release.jpg)

The first time I saw that technique used it was on a springboard screenshot of [Federico Viticci](http://twitter.com/viticci)'s phone where he had a development version of [Tweetbot](http://tapbots.com/software/tweetbot/).

I created a PSD template to create those development icons, here it is: [App-icon-beta-overlay](http://cl.ly/3x1Y0s0q2m3T/download/App%20Icon%20Beta%20Overlay.psd)

Name your icons `Icon.png`, `Icon@2x.png`, `Icon-beta.png` and `Icon-beta@2x.png`.

### Have separate Build configurations
By default, Xcode creates 2 build configurations for you: *Debug* and *Release*. I like to add a third one, *AppStore*. I use them as follow:

- Debug: when I work and put the app on the device directly from Xcode.
- Release: When I package the app as an ipa + plist and put it on our Over-the-air distribution system. (Similar to test flight but much simpler)
- AppStore: I use this configuration when creating the builds that are submitted to the App Store.

### Put it all together
#### User-Defined build settings
Now we need to setup the project so tat it will use the correct App ID and icon for each configuration.

To do so, go in your project's Build Settings and scroll all the way down. Add a User-defined setting that you call `BUNDLE_IDENTIFIER` and another one that you call `APP_ICON_NAME`. Set the values for each build configuration as in the following screenshot:

![Project Settings screenshot](http://f.cl.ly/items/3v3T3W230B1v2K0M2m1c/Screen%20Shot%202013-07-23%20at%2011.12.16%20AM.png)

Now we need to tell Xcode to use these settings when building your app

#### Info.plist
Open the info.plist file for your project (It's in Supporting files and is called MyApp-Info.plist).

There under bundle identifier, replace the bundle identifier that you currently have with `${BUNDLE_IDENTIFIER}`

Also open the Icon files drop down and make sure the 2 options you have are `${APP_ICON_NAME}@2x.png` and `${APP_ICON_NAME}.png`.

The `${…}` syntax is the pre-processor syntax: the first phase of any build starts with the pre-processor going over all the files and replacing these `${…}` with the values to what they are set.

### Conclusion
This lets you with a project that will automatically use the beta App ID and icon when you are building for testing but that will also use the regular App ID and icon when you make a build for the App Store.

Using pre-processor macros you can also access those settings from your code to set different parameters for different configurations.

You can take it now step further and define more build configuration. Let's say your app connects to an API and you want some builds to point to the production server and some others to point to a development server, you can use this method to point them to the right URL and give them a different icon automatically!