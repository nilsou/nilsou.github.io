---
layout: post
title: "How to turn a PNG Sequence into a video with the correct colors for the iPad"
date: 2013-01-10 08:33
comments: true
categories: iOS, Colors
---

A few days ago, I was asked to embed videos in an iPad app and to have the video player be "invisible" to the user. This means that we extracted the part of the background for the view where the video would go and used it as the background for creating the video (in After Effects). Everything looked great and I had a perfectly invisible experience in the simulator.

Then I decided to test on an actual iPad. This is when I realized that the videos looked completely different from the background. I had a color management problem. We tried every export settings we could find in After Effects, nothing would work.

<!-- more -->

The solution that I found was to have After Effect export the animation as a PNG Sequence + audio file and then to generate an mp4 video from these assets using ffmpeg.

This post explains the settings I found that worked for me.

###The Basics
1. Install the latest version of ffmpeg (you can get it from here [ffmpegmac](http://ffmpegmac.net/))
2. the PNG sequence has to be named something like imagexxxxx.png where xxxxx is the frame number with a constant number of digits (00001, 00002, … , 99999)
3. Open a terminal window and run the following command:

		ffmpeg 	-f image2
				-i ./path/to/images/imaged.png \
				-i ./path/to/audio/audio.mp3 \
				-r 30 \
				-vcodec libx264 \
				-pix_fmt yuv420p \
				-acodec libvo_aacenc \
				-ab 128k \
				./path/to/output/output.mp4
Let me explain the parameters here:
	- `-i xxx` is to specify the *input* files (both the image sequence with the  which means "number with 5 exactly digits" and the audio file)
	- `-r` is to specify the frame rate at which ffmpeg is going to interpret the png sequence
	- `-vcodec` is the video codec
	- `-pix_fmt yuv420p` is required so that the output h264 mp4 file is compatible with Apple implementation of the codec. I fyou don't put this, the video won't play in quicktime or on an iOS device.
	- `-acodec` is the audio codec
	- `-ab` is the audio bitrate
	- finallly you can use `-o` to specify the output name but it can be omitted (the last parameter is the output name in this case)
	
The video created with this method will play on iOS devices and will match the color of images you might have next to it.

###Automate it
if you have a number of sequences you have to convert, you can use a for loop to let the terminal do all the work for you.

1. first of all have your png sequences in separate folders named videoY where Y is the video number etc…
2. In each folder, have the png named imageX_xxxxx where Y is the video number and xxxxx is the frame number with a constant number of digits (00001, 00002, … , 99999)
3. make sure you run bash as your shell (other shells have different syntax for loops)
4. Run the following command:
	
		for i in 1 2 3 4 5 6 7;
		do
		ffmpeg 	-f image2 \
				-i ./video$i/image${i}_d.png \
				-i ./video$i/audio.mp3 \
				-r 30 \
				-vcodec libx264 \
				-pix_fmt yuv420p \
				-acodec libvo_aacenc \
				-ab 128k \
				./video$i/output$i.mp4;
		done

5. Grab a beer and watch the magic happen