#!/usr/bin/node
'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
    console.log("DATA: " + inputStdin);
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');
    console.log("STRING: ", inputString);
    main();
});

function readLine() {
    return inputString[currentLine++];
}


/*
 * Complete the 'getUserTransaction' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. INTEGER uid; userid, not the unique one
 *  2. STRING txnType; transaction type, can be debit or credit
 *  3. STRING monthYear; date in format of MM-YYYY
 *
 *  https://jsonmock.hackerrank.com/api/transactions/search?userId=
 */

/* Function totalPages; we are accessing the URL and returning the amount of total pages of the JSON. */
async function totalPages(url) {
    const https = require('https');
    let jsonFullData = "";
    return new Promise((resolve, reject) => {

        https.get(url, (res) => {
                
                res.on("data",(chunk) => {
                    jsonFullData += chunk;
                });
                
                res.on("end", () => {
                    try {
                        const jsonFullDataParse = JSON.parse(jsonFullData);
                        // console.log(jsonFullDataParse.total_pages);
                                                
                        resolve(jsonFullDataParse.total_pages); // returns just parsed data field

                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on("error", (error) => {
                console.error(error.message);
            });
            
    });
}

/* Function totalData; we are accessing the JSON dataset and just returning the total amount of variables. */
async function totalData(uid) {
    const https = require('https');
    let jsonFullData = "";
    let  url = `https://jsonmock.hackerrank.com/api/transactions/search?userId=${uid}`;
    
    return new Promise((resolve, reject) => {

        https.get(url, (res) => {
                
                res.on("data",(chunk) => {
                    jsonFullData += chunk;
                });
                
                res.on("end", () => {
                    try {
                        const jsonFullDataParse = JSON.parse(jsonFullData);
                        // console.log(jsonFullDataParse.total);
                                                
                        resolve(jsonFullDataParse.total); // returns just parsed data field

                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on("error", (error) => {
                console.error(error.message);
            });
            
    });
}

/* Function fullJsonHelper; using the parameter url, parse only the first page of the JSON and return only the data field.  */
function fullJsonHelper(url) {
    const https = require('https');
    let jsonFullData = "";
    
    return new Promise((resolve, reject) => {
        
        https.get(url, (res) => {
            
            res.on("data",(chunk) => {
                jsonFullData += chunk;
            });
            
            res.on("end", () => {
                try {
                    const jsonFullDataParse = JSON.parse(jsonFullData);
                    // console.log(jsonFullDataParse.data);
                                            
                    resolve(jsonFullDataParse.data); // returns just parsed data field

                } catch (e) {
                    reject(e.message);
                }
            });
        }).on("error", (error) => {
            console.error(error.message);
        });
        
    });
}
/* Function fullJsonData; using the parameter uid, use the url with just uid. await the total pages function call to get the total amount of pages.
    Starting at current page = 1; loop through until you are <= total_pages. Each pass through we call fullJsonHelper with the new url value,
    After each data JSON returned we push to a array named: jsonAppend.
 */
 async function fullJsonData(uid) {
    let  url = `https://jsonmock.hackerrank.com/api/transactions/search?userId=${uid}`;
    var total_pages = await totalPages(url);
    
    var jsonAppend = [];
    let current_page = 1;
    
    return new Promise(resolve => {
    for(current_page; current_page <= total_pages; current_page++) {
        url = `https://jsonmock.hackerrank.com/api/transactions/search?userId=${uid}&page=${current_page}`;
        fullJsonHelper(url).then(jsonFirstPageParse => {
            jsonAppend.push(jsonFirstPageParse); // put all data into one json
            // jsonAppend = JSON.stringify(jsonAppend);
            resolve(jsonAppend);
            // console.log(jsonAppend);
        
            }).catch((error) => {
            console.log("ERROR OCCURED!");
        });
}
});
 }
 /* Function pushToArray creates two arrays all_records and debit records for the functions below to be used with them. */
function pushToArray(total_data, newData, monthYear, txnType) {
    let i = 0;
    let all_records = [];
    let debit_records = [];
    
    while(i <= (total_data - 1)) {
        // console.log(newData[i].id);
        const time = new Date(newData[i].timestamp);
        let month = time.toLocaleString("en-US", {month: "numeric"});
        if(month.length == 1) {
            month = "0" + month;
        }
        let year = time.toLocaleString("en-US", {year:"numeric"});
        let mm_yyyy = month + "-" + year;
        // on Hackerrank just had txnType = newData[i].txnType
        if(mm_yyyy == monthYear && ('credit' || 'debit') == newData[i].txnType) {
            all_records.push(newData[i]);
        }
        
        if(mm_yyyy == monthYear && 'debit' == newData[i].txnType) {
            debit_records.push(newData[i]);
        }
        i++;
    }
    console.log("ALL RECORDS: ", all_records, "\n", "DEBIT_RECORDS: ", debit_records);
    return [all_records, debit_records];
}
/* Function debitAverage takes the debit records and calculates the average spending for that month. */
function debitAverage(debit_records) {
          /* Calculates  debit average! */
          let debit_average = 0.0;
          for(let i = 0; i <= debit_records.length-1; i++) {
                  let trans_amount = debit_records[i].amount.replace('$','');
                  // console.log("TRAN AMOUNT: " + trans_amount);
                  trans_amount = parseFloat(trans_amount.replace(/,/g,''));
                  debit_average += trans_amount;
                  // console.log("DEBIT AVERAGE: " + debit_average);
    }
    debit_average = debit_average / debit_records.length;
    return debit_average;
}
/* Function isGreaterThanAverage test whether the debit spending average is less than the transaction amount for that month. */
function isGreaterThanAverage(debit_average, all_records) {
        let j = 0;
        let results = [];
        while (j <= all_records.length - 1) {
                let trans_amount = all_records[j].amount.replace('$', '');
                trans_amount = parseFloat(trans_amount.replace(/,/g, ''));
                // console.log("TRANS AMOUNT: " + trans_amount);
                if (debit_average < trans_amount) {
                        results.push(all_records[j].id);
                        j++;
                }
                else {
                        j++;
                }
        }
        return results
}
async function getUserTransaction(uid, txnType, monthYear) {
    /* 
     * Returns an array of ints
     * @param uid: userId
     * @param txnType: type either debit or credit
     * @param monthYear: string in the form of: MM-YYYY
    */
    
        let jsonData = await fullJsonData(uid);
        let total_data = await totalData(uid)
        console.log(total_data)
        const newData = jsonData.flat(); // remove double []
        // console.log(newData)
        let records = pushToArray(total_data, newData, monthYear, txnType);
        const all_records = records[0],
                debit_records = records[1];
        console.log(all_records)
        let debit_average = debitAverage(debit_records);
        console.log(debit_average)
        let isGreaterThanAverageVal = isGreaterThanAverage(debit_average, all_records);
        console.log(isGreaterThanAverageVal)
    

        if (isGreaterThanAverageVal.length == 0) return [-1];
        return isGreaterThanAverageVal.sort(function (a, b) { return a - b });
}
async function main() {
    const ws = fs.createWriteStream('./output');

    const uid = parseInt(readLine().trim(), 10);

    const txnType = readLine();

    const monthYear = readLine();

    const result = await getUserTransaction(uid, txnType, monthYear);
    
    ws.write(result.join('\n') + '\n');

    ws.end();
    console.log("DONE!")
}
