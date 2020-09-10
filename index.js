const puppeteer = require('puppeteer')
const fs = require('fs');

void (async () => {

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        page.setViewport({ width: 1280, height: 926 });

        await page.setDefaultNavigationTimeout(0); 
        await page.goto('https://www.jiomart.com/')

        await page.exposeFunction("logger", logger);

        
        let items=[]
        await wait(2000);
        await main();

        // Click on all categories and call loadAllPages
        async function main(){

            for (let i=0; i<8; i++){
                
                let subCategories=0;

                await page.evaluate(async (i)=>{
                    
                    categories = document.querySelectorAll(".o-menu ");
                    title = categories[i].querySelector("a").innerText;
                    logger(title);
                    return [categories[i].querySelectorAll("a").length,title];

                },i).then((arr)=> {
                    subCategories=arr[0];
                    items.push(arr[1]);
                })
                .catch((err) => { console.log(err) });

                for (let j=1; j<subCategories; j++){
                    await wait(3000);

                    await page.evaluate(async (arr)=>{
                        categories = document.querySelectorAll(".o-menu ");
                        sub = categories[arr[1]].querySelectorAll("a");
                        subTitle = sub[arr[0]].innerText;
                        logger(arr[0]+". "+subTitle);
                        await sub[arr[0]].click();
                        return subTitle;
                    },[j,i]).then((res)=>{items.push(res);})
                    .catch((err) => { console.log(err) });

                    await loadAllPages();
                }

                console.log("Category Finished!\n");
                items.push("Category Finished!");
            }

            writeToFile();
        }      

        async function writeToFile(){
            fs.writeFileSync('./items.txt', JSON.stringify(items, null, 2));
            await browser.close();
        }
        
        async function wait(ms) {
            return new Promise(resolve => {
              setTimeout(resolve, ms);
            });
        }
 
        // Click all next buttons and evaluate items
        async function loadAllPages() {
            let flag=true;
            while (true){

                await wait(3000);
                items.push(page.url());
                console.log(page.url());

                await evaluate();

                await page.evaluate(async ()=>{
                    if (!(document.querySelector(".next")==null)){
                        await document.querySelector(".next > a").click();
                    }else{
                        logger("Done!");
                        return false;
                    }
                }).then((res)=>{
                    if (res==false){
                        flag=false;
                    }
                })
                .catch((err)=>console.log("ERRORRR"))
                
                if (flag==false){
                    break;
                }
            }
        }

        
        function logger(data){
            console.log(data);
        }

        async function evaluate(){            
            await page.evaluate(() => {
                
                var data=[] 

                var items=document.querySelectorAll('.product-list .col-md-3');

                for (let item of items) {
                    var name = "NaN"
                    var brand = "NaN"
                    var price = "NaN"
                    var oldPrice = "NaN"
                    var sodexo = "NaN"
                    var offer = "NaN"

                    if (!(item.querySelector(".clsgetname")==null)){
                        name = item.querySelector(".clsgetname").innerText;
                    }
                    if (!(item.querySelector(".drug-varients")==null)){
                        brand = item.querySelector(".drug-varients").innerText;
                    }
                    if (!(item.querySelector(".price-box #price")==null)){
                        oldPrice = item.querySelector(".price-box #price").innerText;
                    }
                    if (!(item.querySelector(".price-box #final_price")==null)){
                        price = item.querySelector(".price-box #final_price").innerText;
                    }
                    if (!(item.querySelector(".price-box .sodexo_icon")==null)){
                        sodexo = item.querySelector(".price-box .sodexo_icon").innerText;
                    }
                    if (!(item.querySelector(".dis_section span")==null)){
                        offer = item.querySelector(".dis_section span").innerText;
                    }

                    data.push({
                        name: name,
                        brand: brand,
                        price : price,
                        oldPrice: oldPrice,
                        sodexo: sodexo,
                        offer: offer                        
                    });
                }

                return data;

            }).then((result) => {
                console.log(result);
                items.push(result);
            }).catch((err) => { console.log(err) })
        }
   
})();