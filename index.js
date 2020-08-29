const puppeteer = require('puppeteer')
const fs = require('fs')

void (async () => {

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        page.setViewport({ width: 1280, height: 926 });

        await page.goto('https://www.jiomart.com/c/groceries/staples/13')

        await page.exposeFunction("loadAllPages", loadAllPages);
        await page.exposeFunction("evaluate", evaluate);
        await page.exposeFunction("logger", logger);

        loadAllPages();

        // Click all next buttons and evaluate items
        function loadAllPages() {
            setTimeout(()=>{
                console.log(page.url());
                evaluate();
                page.evaluate(()=>{
                    if (!(document.querySelector(".next")==null)){
                        document.querySelector(".next > a").click();
                        loadAllPages();
                    }else{
                        logger("Done!");
                    }
                }).catch((err)=>console.log(err))
            },3000)
        }

        function logger(data){
            console.log(data);
        }

        function evaluate(){            
                page.evaluate(() => {
                
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
            }).catch((err) => { console.log(err) })
        }

        // await browser.close()
        
})();