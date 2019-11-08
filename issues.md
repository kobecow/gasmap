### DataChange
At 2019/11/5, We used two datasets(myData.js gas_summary.csv).It should be change using new one which is gas_summary.csv .  
But due to size of the file, it must stay Backend. File size is over 40MB.
Fortunately, App doesn't need whole file at once. It menas App doesn't need 15 years of gases at once.

So I will change code to request to get data of each year.