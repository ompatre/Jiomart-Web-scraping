const puppeteer = require('puppeteer')
const fs = require('fs')




void (async () => {

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage()
        page.setViewport({ width: 1280, height: 926 });

        page.goto('https://www.jiomart.com/c/groceries/staples/13')

        await page.exposeFunction("logger", logger);

        console.log(page.url());

        loadWholePage();


        
        function loadWholePage() {
            page.evaluate(()=>{
                document.querySelector(".next > a").click();
                
         
            }).catch((err)=>console.log(err));
    
        }

        setTimeout(()=>{
            console.log(page.url());
            page.evaluate(()=>{
                logger("asd");
                document.querySelector(".next > a").click();

            }).catch((err)=>console.log(err));
            
        },1000);

        function logger(data){
            console.log(data);
        }

        await page.evaluate(() => {
            
            const data=[] 

            var items=document.querySelectorAll('.product-list .col-md-3');

            for (let item of items) {
                info = "NaN"
                price = "NaN"
        
                if (!(item.querySelector(".clsgetname")==null)){
                    info = item.querySelector(".clsgetname").innerText
                }
                if (!(item.querySelector(".final-price")==null)){
                    price = item.querySelector(".final-price").innerText
                }
                data.push({
                    info : info,
                    price : price,
                });
            }

            console.log(data);
            return data
        }).then((result) => {
            fs.writeFileSync('./newitems2.txt', JSON.stringify(result, null, 2));
            console.log(result);
        }).catch((err) => { console.log(err) })

        await browser.close()

})();












            // logger("check2");
            // console.log("check2log")
            // url();
            // page.evaluate(()=>{
            //     document.querySelector(".next > a").click();
            //     logger("abbb");
                // setTimeout(()=>{
                    // loadWholePage2();
                // },500);
            // }).catch((err)=>console.log(err));
        // }
        // setTimeout(()=>{
        //     console.log(page.url());
        //     page.evaluate(()=>{
        //         logger("asd");
        //         console.log("Asda");
        //         // document.querySelector(".next > a").click();

        //     }).catch((err)=>console.log(err));
            
        // },1000);