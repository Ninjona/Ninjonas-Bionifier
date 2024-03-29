## Ninjona's Bionifier

Ninjona's Bionifier is a simple script designed to facilitate the bionification of books, making them more readable in a
bionic format. This script was created to address the lack of convenient tools for converting ebooks into the bionic
format.

## Background

I made this script while procrastinating studying for my ASVAB test. I figured it would definitely save me time to make
all my books bionic (it 100% did). I initially attempted to integrate bionification
into [a Calibre extension](https://github.com/bookfere/Ebook-Translator-Calibre-Plugin/tree/master), but I'm not smart
with python. So with all my new knowledge on the epub format. I decided it was simpler to just do all the epub
implementations myself.

## Usage

1. Clone this repository
2. Install the required dependencies using npm:
     ```bash
     npm i
     ```
3. Run the script:
   ```bash
   node main.js /path/to/your/book.epub
   ```

## Customization

- Adjust bionification preferences in the `Prefs` object within the script,
  (*Most of these prefs are still confusing to me and don't work as expected. I'll update them in the future. Until
  then, I advise you to leave them as default.*)

## Credits

This script owes much of its bionic formatting techniques to the [Jiffy-reader](https://github.com/ansh/jiffyreader.com)
extension. I loved using the Jiffy-reader on all my browsers. It's made reading webpages so much easier. Most bionic
work in this script is adapted from it. Thank you to the [Jiffy-reader](https://github.com/ansh/jiffyreader.com) team
for making their project open-source!

## Note

This whole project is in the making, so it might not make any sense yet. I am still learning so bare with me. I intend
to implement many more formats and features. Any help or advice would be much appreciated!

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
