{{{
    "title"    : "If we don't have binary2text encoding system",
    "tags"     : ["binary"],
    "category" : "underlayer",
    "date"     : "11-24-2021"
}}}

Today , I slack off at my office to learn some fondamental knowledge about "How computer treat characters" , after some tough learning , I think I master it , now I want to share these mumbo-jumbo to you!

### If we don't have binary2text encoding system

It's no more than a platitude . **Computer can only process binary data ( 0 and 1) .**

The Operate-system read binary from memory or disk and send it to display driver ( also know as [firmware](https://superuser.com/a/886221) and built-in by manufacturer)  , then , a graphical text will be displayed in your monitor .
> It's sounds like cool , but the technology under the hood is most complicated and difficult to describe , you would need to learn dozens of knowledge of Driver , Bug , address , IO devices , Operation system achitecture and stuff like that , So , For the good of all of us  , let it go .
> If you are really curious about How does computer display binary to screen as text form , you can investigate it along following links :
> * https://electronics.stackexchange.com/questions/359648/where-is-the-location-of-display-buffer-on-a-computer-board
> * https://www.quora.com/How-does-a-computer-knows-that-printf-means-to-show-output-on-monitor
> * https://www.quora.com/How-does-a-computer-display-characters

Imagin there is not have text encoding in the world , and you need exchange some information to someone else , and computer only can recognize "0" and "1" , you are asked for settle this problem , what will you do ?

> You probably say : It's impossible because we can only use binary for communication between two computer!
But In the dark time of programmer , the expert use the [punch-card](https://en.wikipedia.org/wiki/Punched_card) to write program , you must carry a lot of punch-card and use a mechine to punch some hole in them , each hole represented a single binary digit(bit) , It's pure binary-programming , and if you do a overwork , not have a clear mind , the punch-card you already punch the most hole was for nothing.

Back to our topic , the key point to resolve this problem is **How to ensure the binary you passed to other guy's computer can be interpret correctly . **

As an illustrantion , assume the binary "100 0001" represent the letter 'A' , and you pass the binary to another computer by Socket , so , How can another computer translate the binary to letter 'A' correctly ? Why can't another computer translate it into something else ?

Assume you are a manufacturer , You may want to develop a mapping mechinism between binary data and glyph disply in screen . So you can display binary to screen as human-readable manner . And you can transfer the binary to other computer created by your company . These computer all build-in same encoding system on acount of they are all created by your company . So the computer recive these binary can display the glyph as well .

### About ASCII

But how about computers created by other manufacturers ? They also can form their own encoding system , so the information maybe can't translate to correct meaning .

That's true story , In earily era of computer  , each computer manufacturer used their own mapping of glyph to binary number , different computer can't communicate with each other easily . So **ASCII** kick in .

In my understanding , ASCII is a encoding system , in another words , it's just mapping from binary numbers to characters .So you can pass binary data ( represent readable meaning ) between computers which compatible with ASCII encoding system . And each computer can interpret these binary precisely .

> The another thing I think worth mention is ASCII is an **implemention** , that means ASCII have actual program you can find from internet .
> You can find all character supported by ASCII and correspond binary number from [here](https://en.wikipedia.org/wiki/ASCII)

### Break change : Unicode

For now , everythings be ok . But how about transfer characters between two computers use different language ? As an illustration , I want to transfer an chinese character '我' to another computer that use ASCII encoding system , I will send some binary sequence to this computer , but how can this computer recognize this chinese character  ? It can't be translated by ASCII encoding system , because of computer can't find correspond character by find bianary mapping in ASCII.

So Unicode standard be introduced .
> You can see , **The Unicode is a standard , not a implemention .** To be exact , you can't say you use Unicode encoding system . Files can't encoded with Unicode standard , because Unicode not is a implemention !

Let's talk something about Unicode  :

[Unicode](https://home.unicode.org/) is a standard which think  Everyone in the world should be able to use their own language on phones and computers.

This standard is managed by Unicode Technical Committee . The committee in charge of index all charactor over the world , such chinese charaters , english charaters and so on .

Today When I open Unicode offical website , I saw an pinned post that title is [Unicode Emoji 15.0 Provisional Candidates](https://home.unicode.org/unicode-emoji-15-0-provisional-candidates/) , This suggests that Unicode Technical Committee still add new character or glyph to [Unicode character Table](https://unicode-table.com/en) .
> you can find all charater indexed by Unicode Technical Committee in above link . Have fun :)

Along era change , maybe some new  glyph which represent new culture will be add continually  .

>As proof , the glyph 🧘  means yoga . This glyph's exact description is  : A person sitting in a lotus position . And it be added to Unicode in 2017 .   Now , imaging you live in 2016 , maybe you already hear something about yoga , or maybe you are a yoga master , you want to transfer the meaning of yoga to your friend through Internet , you can only type the characters "yoga"  , hit enter to send message , sure  , your friend can look these two character in his screen ,  but the screen can't display  the yoga glyph correctly but only these two characters .
>
>But you live in 2021 , you can type the glyph 🧘  and send it to your friend ! He will say : Yep , I think I need sit on the ground like a fucking Lotus if I want to do some yoga . That's funny .

We can call each glyph indexed by Unicode as **Code Point** .
> Notice the count of Code Point is unlimited , that means Unicode community can put new  glyph as a new Code Point .

Another Amazing feature of Unicode is **Private Use Area (PUA)**
> Not the fucking pickup artist  :)
> In some Unicode version , Commintee will left a range of Code Point to third parties intentionally , so they can define their own charaters without comflicting with Unicode Consortium assignments .

### Executor  : UTF-8

Remember We say **Unicode just a standard , not a implementation  ?**
So that you can only use this standard with a implementation ,  so you need a implementation that already widely used in most modern system -- **UTF-8** .

UTF-8 is a implementation of Unicode .
Fundamentally , UTF-8 is a encoding system , can transform text to binary , vice versa .
> What a implementation means ? That means UTF-8 not a abstract  conception , you can use this in reality .

So you can use UTF-8 encoding files or text and storage them in computer as binary data.

UTF-8 is a **8-bit variable-width** encoding system , and **backward-compatible with 7-bit ASCII character** as it can use 1 bytes for ASCII character , so it widely used .

You can think of UTF-8 just a **mapping between Unicode Code Point to binary data** , can encoding Code Point to **one -- four bytes .**
> We can find some example :
> ```Markdown
> In Unicode , Code Point U+0035 means glyph '5' , UTF-8 represent this codepoint as binary data : 00110101
> In Unicode , Code Point U+00C7 means glyph 'Ç' , UTF-8 represent this codepoint as binary data : 11000011 10000111
>```
> But in reality world , **a "character" can actually take more than 4 bytes**, e.g. an  [emoji flag character](https://en.wikipedia.org/wiki/Regional_indicator_symbol)  takes 8 bytes since it's "constructed from a pair of Unicode scalar values".
> ```javaScript
> "👩\u{200D}👩\u{200D}👦\u{200D}👦" == "👩‍👩‍👦‍👦"
> ```

But **not all** Unicode glyph can be encoding with UTF-8 encoding system .
> After tough work , I find a character that not implement with UTF-8 encoding system :
> you can find some glyph in following link :
> 
> https://unicode.org/charts/PDF/Unicode-14.0/U140-2A700.pdf
> 
> Then you can paste this glyph to [unicode-table](https://unicode-table.com/en/) to find correspond UTF-8 representation .
> You will not found it , but don't worry about , because most of character we used in normal life must be already include in   UTF-8 .

Here have another point worth mention :  **UTF-8 encoding can not mapping to same Code Point position** , see following link :

https://stackoverflow.com/a/5610039/11742589

### Addition : Other encoding-system base on Unicode
Here also have other encoding system not used often over the world . such [UTF-16](https://en.wikipedia.org/wiki/UTF-16) ,
[UTF-32](https://en.wikipedia.org/wiki/UTF-32) .
But they all base on Unicode , is an implementation of Unicode .

### End , code happy ! Fuck the Unicode !
