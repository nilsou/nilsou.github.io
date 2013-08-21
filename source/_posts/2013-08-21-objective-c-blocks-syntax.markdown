---
layout: post
title: "From C declarators to Objective-C blocks syntax"
date: 2013-08-21 11:30
comments: true
published: true
keywords: objective-c, blocks, syntax, ansi-c
categories:
- Objective-C
- blocks
- syntax
- C

---

In this post, I start with the simplest C declarator and build in complexity until we get to Objective-C blocks syntax. It took me a while to get block syntax but once you understand how it is organized and where it comes from, there is no looking in Google every time you need to declare a block anymore.

If you want to be able to write block declarations from the top of your head, read-on!

I strongly advise against reading this post in an RSS reader or read later service. It does heavy use of colors to explain things and these colors would not appear there.

<!-- more -->

### Declarators
Variables in C (and by extension Objective-C) are declared using declarators.

A declarator has 2 roles:

- Specify the type of the variable (what the compiler should expect to find in that memory space)
- Give that variable a name to make it available to the appropriate scope.

Let's start with the most basic declarator:

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="2E6FFD">a</font>;
</pre>

This is most likely the first line of C code you have ever written.

<code><font color="722CFD">int</font></code> is a basic type and <code><font color="2E6FFD">a</font></code> is the variable name or identifier[^identifier].

To read a declarator, you start from the identifier, then go right until you can't and then you start over from the left of the variable[^microsoft] (we'll explain why in the next section).

Here there is nothing to the right of our variable so it's straightforward: <code><font color="2E6FFD">a</font></code> is an <code><font color="722CFD">int</font></code>.

A declaration can only have *1* basic type and it's the left most word of the declarator.

Declarators can modify basic types using modifiers to create *derived types*. The 4 modifiers (3 from ANSI-C and one from [Apple's proposed extension](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1451.pdf)) are <code><font color="DD2067">*</font></code>, <code><font color="66B132">[]</font></code>, <code><font color="FD9A00">()</font></code> and <code><font color="66CCFF">^</font></code>.

#### The 3 ANSI-C modifiers
##### The pointer modifier <code><font color="DD2067">*</font></code>
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="DD2067">*</font><font color="2E6FFD">a</font>;
</pre>
The basic type is still int and the name of the variable <code><font color="2E6FFD">a</font></code>. But the pointer modifier <code><font color="DD2067">*</font></code> comes to tell us that <code><font color="2E6FFD">a</font></code> is a <font color="DD2067">pointer to</font> an <code><font color="722CFD">int</font></code> instead of an <code><font color="722CFD">int</font></code>.

The <code><font color="DD2067">*</font></code> modifier is always to the left of the modified variable.

##### The array modifier <code><font color="66B132">[]</font></code>
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="2E6FFD">a</font><font color="66B132">[]</font>;
</pre>
Here we see that the array modifier <code><font color="66B132">[]</font></code> comes to tell us that <code><font color="2E6FFD">a</font></code> is now <font color="66B132">an array of</font> <code><font color="722CFD">int</font></code>s instead of a simple <code><font color="722CFD">int</font></code>. This can be completed by the dimension of the array e.g. <code><font color="722CFD">int</font> <font color="2E6FFD">a</font><font color="66B132">[</font>10<font color="66B132">]</font>;</code>.

The <code><font color="66B132">[]</font></code> modifier is always to the right of the modified variable.

##### The function modifier <code><font color="FD9A00">()</font></code>
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="2E6FFD">f</font><font color="FD9A00">()</font>;
</pre>
The function modifier <code><font color="FD9A00">()</font></code> comes to tell us that <code><font color="2E6FFD">f</font></code> is <font color="FD9A00">a function that returns</font> an <code><font color="722CFD">int</font></code>. This modifier can also specify the arguments that the function takes e.g. <code><font color="722CFD">int</font> <font color="2E6FFD">f</font><font color="FD9A00">(</font><font color="9A9A9A">long</font><font color="FD9A00">)</font>;</code> is <font color="FD9A00">a function that</font>  <font color="9A9A9A">takes a long as an argument and</font> <font color="FD9A00">returns</font> an int.

The <code><font color="FD9A00">()</font></code> modifier is always to the right of the modified variable.

#### Composing modifiers
##### Pointers and arrays
Modifiers can be composed to create more complex variable types. Similarly to how arithmetic operations are ordered by precedence (\* and / are executed before + and -), modifiers are too. <code><font color="66B132">[]</font></code> and <code><font color="FD9A00">()</font></code> have higher precedence over <code><font color="DD2067">*</font></code> (and <code><font color="66CCFF">^</font></code>).
Since the 2 modifiers with higher precedence are written to the right of the variable, when reading complex declarator, **you always start from the identifier and go right as long as possible** then go left when you reach either the end of the declarator or a closing parenthesis.

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="DD2067">*</font><font color="2E6FFD">a</font><font color="66B132">[]</font>;
</pre>
or as you can write it by adding parentheses to improve readability
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="DD2067">*</font>(<font color="2E6FFD">a</font><font color="66B132">[]</font>);
</pre>
is <font color="66B132">an array of</font> pointers to an <code><font color="722CFD">int</font></code>.

But you might ask, what if I want to have a pointer to an array of ints? Well since <code><font color="DD2067">*</font></code> has lower precedence than <code><font color="66B132">[]</font></code>, you need to use parenthesis to force that precedence.

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> (<font color="DD2067">*</font><font color="2E6FFD">a</font>)<font color="66B132">[]</font>;
</pre>
Here, <code><font color="2E6FFD">a</font></code> is a <font color="DD2067">pointer to</font> <font color="66B132">an array of</font> <code><font color="722CFD">int</font></code>s.

##### Array and functions
You cannot have an array of functions and a function cannot return an array or a function[^function return].
A function can however take an array as an argument.

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="2E6FFD">f</font><font color="FD9A00">(</font><font color="722CFD">int</font> <font color="66B132">[</font>10<font color="66B132">]</font><font color="FD9A00">)</font>;
</pre>

Here f is <font color="FD9A00">a function that </font> takes <font color="66B132">an array of</font> 10 <code><font color="722CFD">int</font></code>s as an argument and <font color="FD9A00">returns</font> an <code><font color="722CFD">int</font></code>.

##### Pointers and functions
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> <font color="DD2067">*</font><font color="2E6FFD">f</font><font color="FD9A00">()</font>;
<font color="722CFD">int</font> <font color="DD2067">*</font>(<font color="2E6FFD">f</font><font color="FD9A00">()</font>);
</pre>

In both cases, <code><font color="2E6FFD">f</font></code> is <font color="FD9A00">a function that returns</font> a <font color="DD2067">pointer to</font> an <code><font color="722CFD">int</font></code>.

What if you want a pointer to a function? Parentheses!

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> (<font color="DD2067">*</font><font color="2E6FFD">f</font>)<font color="FD9A00">()</font>
</pre>

<code><font color="2E6FFD">f</font></code> is a <font color="DD2067">pointer to</font> <font color="FD9A00">a function that returns</font> an <code><font color="722CFD">int</font></code>.

#### The block (or closure) pointer modifier <code><font color="66CCFF">^</font></code>
Apple introduced a 4th modifier in its [proposed extension of the ANSI-C standard](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1451.pdf): <code><font color="66CCFF">^</font></code>.
This modifier is called the block pointer modifier (or closure modifier as they were originally called). Blocks are very similar to pointers for functions. You declare a block the same way you would declare a pointer to a function.

The block pointer modifier can only be applied to a function (you cannot write <code><font color="722CFD">int</font> <font color="66CCFF">^</font><font color="2E6FFD">a</font>;</code> as this is not defined).

This is the reason why <code><font color="722CFD">int</font> <font color="66CCFF">^</font><font color="2E6FFD">b</font><font color="FD9A00">()</font></code> is illegal and will cause a compiler error: If you read this declarator using the precedence rules, b would be a function that returns a block pointer to an int. There is no such thing and this is why **when declaring a block you need to always put the caret and the identifier in parentheses**.

<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> (<font color="66CCFF">^</font><font color="2E6FFD">b</font>)<font color="FD9A00">()</font>
</pre>
<code><font color="2E6FFD">b</font></code> is a <font color="66CCFF">block pointer to</font> <font color="FD9A00">a function that returns</font> an <code><font color="722CFD">int</font></code> or as abbreviated a <font color="66CCFF">block</font>  <font color="FD9A00">that returns</font>  an  <code><font color="722CFD">int</font><font color="DD2067"></font></code>.

You can of course specify the arguments that the block takes:
<pre align='center' style="font-size:1.5em; margin-bottom:1em;">
<font color="722CFD">int</font> (<font color="66CCFF">^</font><font color="2E6FFD">b</font>)<font color="FD9A00">(</font><font color="9A9A9A">long</font><font color="FD9A00">)</font>
</pre>
is a <font color="66CCFF">block</font> <font color="FD9A00">that</font> <font color="9A9A9A">takes a long as an argument</font> <font color="FD9A00">returns a</font> <code><font color="722CFD">int</font></code>.

This is where the syntax for block declarations comes from. Now you already know that there are other syntaxes that you need to remember in order to use blocks: the one used to define a block literal, and the one to pass the block to an Objective-C method.

### Abstract declarator
A declarator is made up of 2 things: an abstract declarator in which you insert the identifier.

Abstract declarators are used in 3 cases in standard C:

- In casts: in `int *a; long *b = (long *) a;`, `(long *)` is an abstract declarator for a pointer to a `long`.

- As arguments of sizeof(): `malloc(sizeof(long *));`

- When declaring argument types for a function: `int f(long *);`

Objective-C uses abstract declarators in one more place: when declaring arguments or return values for methods.
``` objc
	- (long **)methodWithArgument:(int *)a;
```

Here both `long **` and `int *` are abstract declarators.

So in order to use blocks as arguments or return values for Objective-C methods, we need to find the abstract declarator for these blocks. This is achieved by taking the declarator and removing the identifier.

<code><font color="722CFD">int</font> (<font color="66CCFF">^</font><font color="2E6FFD">b</font>)<font color="FD9A00">()</font></code> becomes <code><font color="722CFD">int</font> (<font color="66CCFF">^</font>)<font color="FD9A00">()</font></code>  and <code><font color="722CFD">int</font> (<font color="66CCFF">^</font><font color="2E6FFD">b</font>)<font color="FD9A00">(</font><font color="9A9A9A">long</font><font color="FD9A00">)</font></code> becomes <code><font color="722CFD">int</font> (<font color="66CCFF">^</font>)<font color="FD9A00">(</font><font color="9A9A9A">long</font><font color="FD9A00">)</font></code>.

example:
``` objc
	- (void)methodWithArgument:(int(^)())block;
	- (void)anotherMethodWithArgument:(void(^)(long arg1))block;
```

While you don't have to name your block's arguments in these abstract declarators, it is a good idea to do it. It will give a good hint as to what the block expects as argument and Xcode autocomplete will make your life easier when using that method.

### Block literals
When you write `int a = 2;`, `int a` is a declarator and `2` is a literal for an int.

The caret `^` is also used as a unary operator to transform a function implementation into a block[^block literals]. You don't need to specify the return type for the block (it is inferred from the return statement in that block) but you can.

Since this is the implementation of that block, you need to name your arguments here.

So for the block `int (^block)(long, long);`, a block literal would be:

``` objc
block = ^(long a, long b) {
	int c = a + b;
	return c;
}
```

### Conclusion

As convoluted as it may seem, blocks syntax in Objective-C is built upon standard C syntax. A block in Objective-C is nothing more than a pointer to a function that captures its scope. Once you understand that and practice writing and reading a few blocks declaration, you'll find it much easier to apprehend.


[^identifier]: From [ANSI-C draft](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) page 35: *"An identiﬁer can denote an object; a function; a tag or a member of a structure, union, or enumeration; a typedef name; a label name; a macro name; or a macro parameter"*

[^function return]: From [ANSI-C draft](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) page 133: *"A function declarator shall not specify a return type that is a function type or an array type."*

[^block literals]: From [Clang documentation](http://clang.llvm.org/docs/BlockLanguageSpec.html#id5): *"A Block literal expression produces a reference to a Block. It is introduced by the use of the ^ token as a unary operator."*

[^microsoft]: Oddly enough, Microsoft, of all companies, has a good [page](http://msdn.microsoft.com/en-us/library/1x82y1z4\(v=vs.80\).aspx) explaining the interpretation of complex declarators.
