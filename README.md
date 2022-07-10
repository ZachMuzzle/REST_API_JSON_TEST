# Rest API JSON Javascript Test

## This program is a test from a Hackerrank interview test
The objective of this program is to take data from an URL and use it to find records that get transaction data from users; what is returned is userIds that have a debit spending average less than the transaction amount for that given month.

## How to run the Program
* You will need to have NPM installed. If it is not installed in terminal execute this command: `npm install`
* The program can be ran using `node Hackerrank_test.js`. If you want to add more features to the code and automatically update the node. Install **nodemon** to do this: `npm i -g nodemon` then `npm i --save-dev nodemon`. Now you can run the program using `nodemon Hackerrank_test.js` which will update the node while code is edited and saved.
* To make things easier use the provided text file [data.txt](data.txt) to for testing. Edit the 3 attributes and when you want to compile run `cat data.txt | nodemon Hackerrank_test.js` this will act as an input to command line.