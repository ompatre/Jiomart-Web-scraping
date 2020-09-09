const puppeteer = require('puppeteer')
const fs = require('fs')

void (async () => {

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        page.setViewport({ width: 1280, height: 926 });

        await page.setDefaultNavigationTimeout(0); 
        await page.goto('https://www.jiomart.com/c/groceries/staples/13')

        await page.exposeFunction("loadAllPages", loadAllPages);
        await page.exposeFunction("evaluate", evaluate);
        await page.exposeFunction("logger", logger);
        // await page.exposeFunction("main", main);
        // await page.exposeFunction("writeToFile", writeToFile);

        
        items=[]

        // main(0);
        // // Click on all categories and call loadAllPages
        // async function main(i){
        
        //     setTimeout(()=>{
        //         if (i==8){
        //             writeToFile();
        //         } else {
        //             page.evaluate((i)=>{
        //                 logger(i);
        //                 categories = document.querySelectorAll(".o-menu>a");
        //                 categories[i].click();
        //                 loadAllPages();
        //                 main(i+1);
        //             },i).catch((err) => { console.log(err) });
        //         }
        //     },15000);   
        // }      

        // async function writeToFile(){
        //     console.log(items);
        //     fs.writeFileSync('./items.txt', JSON.stringify(items, null, 2));
        //     await browser.close();
        // }

        // Click all next buttons and evaluate items
        async function loadAllPages() {
            // setTimeout(async ()=>{
                items.push(page.url());
                console.log(page.url());
                // evaluate().then(()=>console.log("after evalaute"))
                await evaluate();
                console.log("after plz")
                await page.evaluate(async ()=>{
                    if (!(document.querySelector(".next")==null)){
                        document.querySelector(".next > a").click();
                        // await loadAllPages();
                    }else{
                        logger("Done!");
                    }
                }).catch((err)=>console.log(err))
            // },2000)
        }



        // setTimeout(()=>{
        await loadAllPages();
        console.log("END")
        // console.log(items)
        // },1000);

        function logger(data){
            console.log(data);
        }

        async function evaluate(){         
            logger("INside evaluate")   
            await page.evaluate(() => {
                logger("INside inside page eval");
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

                logger(data);
                return data
            }).then((data)=>{
                items.push(data)
            })
            .catch((err)=>console.log(err));
            

            // console.log(result);
            // items.push(result);
            console.log(1111123);
            return 1;
        }

        
})();