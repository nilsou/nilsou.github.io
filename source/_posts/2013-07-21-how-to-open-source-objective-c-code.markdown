---
layout: post
title: "Open source Objective-C code with Github and CocoaPods"
date: 2013-07-21 16:33
comments: false
categories:
- iOS
- Objective-C
- Open Source
---

Last week I decided to open source some classes that I have written and that I reuse often in apps so that other developers can benefit from them. This post has 3 parts: first I talk about how to format you code/project to make it useful to other developers. Then I explain how to put it on Github. And finally I describe what to do to make it available through [CocoaPods](http://cocoapods.org).

<!-- more -->

### Make that project look good
#### Clean up the code itself
As always when writing code that other people are going to read, you want it to be as clean as possible. Here are a few tips:

- Removing all commented code that you have left in there.
- Name your variables and methods with names that are legible and easy to understand.
- Split big methods in multiple small methods (a good guideline is ~25 lines max per method)
- Comment the hell of your header file. (This is the only thing that most people using your code will read)

#### Organize the project
Often you want to share just a few classes but it is a good idea to include a Demo project so that people can understand how your classes are intended to be used.

Have the files of interest in a folder and the files for the demo project in a different one so as not to confuse your user.

You want the project file to reflect the organization of the project folder:

![project organization](http://farm8.staticflickr.com/7397/9340191112_5dda8d0ecd_o.png)

![project folder](http://farm4.staticflickr.com/3692/9337404169_20a9e4740a_o.png)

Here the class I want to share is `NHAlignmentLayout` the rest of the files are there to demonstrate how to use it.

#### Include a README
Write an explicit readme with code samples and even screenshots, that will be the homepage for your repo and will likely be the decisive point for if someone who comes to your project will end up using it or not.
Include explicit instructions on how to install you classes (Most likely using [CocoaPods](http://cocoapods.org).

#### Include a LICENSE
When you open source some of your work, you need to define what people can and cannot do with it. This is the role of a license. There are many open-source licenses such as MIT, GNU, and BSD… You can find which one is best for you by going to [Choose A License](http://choosealicense.com/). This site made by Github will help you find the best license for you.

### Put it on Github
#### Create the Repository
Go to your Github account and create a new repository for your project. Name it with a name that makes sense; don't name it `XXSomethingDemo` but rather `XXSomething` as this is what everybody cares about.
Check the option to add a .gitignore file and choose Objective-C.

#### Clone the empty repository on your computer
Clone the repo you just created in a temp folder on your mac. You don't want to add the repo as a remote for your current git repo in order to start with a fresh repo and a beautiful *Initial Commit*.

```
git clone https://github.com/nilsou/NHAlignmentLayout.git
```

#### Copy and Paste your project to that folder
Copy and paste your project files to that folder. You want to have the .xcodeproj file at the root of the repo. Do not put everything in a folder as the only thing it will do is annoy you users.

#### Commit and Push
Add your newly added files to git, commit and push to github.
```
git add .
git commit -a -m "Initial Commit"
git push origin master
```

Your project is now open-sourced and people can start using it! But for it to be really easy to use and install you want to make it available on [CocoaPods](http://cocoapods.org).

### CocoaPods
CocoaPods is to Objective-C what gems are to Ruby. You can list in the root of your project the "pods" you need and CocoaPods will download them and install them for you.

Start by installing CocoaPods if it is not already installed on your mac.

#### Create the .podspec file.
You need to create at the root of your repo a file that is a recipe for CocoaPods to use your classes.

Navigate to your project folder in a terminal window and ask CocoaPods to create a staring pod spec for you:
```
pod spec create NHSlidingController
```

Open that file and start filling it with the information on your project.

It is important to use a version number. I usually start with 0.1.0 but this is up to you.

The `source` line is also important it is the line that tells CocoaPods where your project resides on the internet.

``` ruby
s.source = { :git => "https://github.com/nilsou/NHAlignmentFlowLayout.git", :tag => "0.1.0" }
```

You also need to tell CocoaPods which files in your repo are relevant so that it does not copy any unneeded demo/example file.

``` ruby
s.source_files = 'NHAlignmentFlowLayout/*.{h,m}'
```

#### Validate the .podspec file
Then we are going to verify the validity of your .podspec file.

You noticed that in `s.source` we point to a specific tag in our repo. You need to create a tag for CocoaPods to be able to find your code. A tag is an absolute reference across branches to a state of your code in time. They're often used for versioning and that's what CocoaPods use them for.

Create the tag locally and then push it to Github. In your terminal window enter:
```
git tag 0.1.0 -m "0.1.0 - Initial release"
git push origin master -tags
```

Then you want to make sure that you .podspec file works. To do so use the `pod spec lint command`.
```
pod spec lint NHAlignmentFlowLayout.podspec 
```

This will try to download the pod you just created from the address you supplied in the podspec file. You should get something like this:
```
NHAlignmentFlowLayout.podspec passed validation.
```

Commit that file to git and push it to Github.
```
git add .
git commit -a -m "Added .podspec file"
git push origin master
```

#### Add you .podspec to the master Specs repo
All .podspecs files are kept in a central to repo called Specs. You need to fork that repo, add your pod specs to it and then issue a pull request for it to be merged. Don’t worry it's really easy.

##### Fork the Specs Repo and clone it to your mac
Go to the [Specs Github Repo](https://github.com/CocoaPods/Specs) and Press the Fork Button on the top right corner. This will create a copy of the Specs repo in your account.

Clone the forked repo on you computer to be able to modify it.
```
git clone https://github.com/nilsou/Specs.git
```

##### Add your .podspec and push it to your fork
Create a folder named with the name of you pod. for me it is `NHAlignmentLayout`
Create a subfolder with the name of your tag `0.1.0` for me.
Copy the .podspec file you created earlier in that folder.

Commit and push your changes to you forked repo:
```
git add .
git commit -a -m "Added NHAlignmentLayout"
git push origin master
```

##### Create the pull request
Go to the forked Specs repo on github. Press the Comparison button, next to the name of the current branch. :

![Pull request button](http://farm6.staticflickr.com/5479/9340191074_1a6f3ae4d0_o.png)

This will initiate the comparison between your current repo and the original repo.

Review the changes, you should see the content of you .podspec file in green, meaning that this was added.

Press the `Click to create a pull request for this comparison` Button.

![Click to create a pull request for this comparison](http://farm3.staticflickr.com/2874/9337404161_38396a3a23_o.png)

This will send a pull request to the owners of the Specs repo. They are usually *extremely* quick to merge the pull request!

Once your pull request is approved you can start using your pod in other projects.

Now, go share your code!